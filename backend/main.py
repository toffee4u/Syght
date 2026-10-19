"""
Syght Enterprise Healthcare Fraud Detection API.
FastAPI Production Gateway with SHAP Explainability & Real-Time Pre-Auth.
"""

from __future__ import annotations

import logging
import os
import sys
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Dict, List, Optional

# Ensure project root is on sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.preauth_gateway import PreAuthFraudGateway, PreAuthRequest
from backend.schemas import (
    BatchPredictionRequest,
    BatchPredictionResponse,
    HealthCheckResponse,
    PreAuthClaimRequest,
    PreAuthClaimResponse,
    ProviderPredictionRequest,
    ProviderPredictionResponse,
    RiskDriver,
)
from ml_pipeline.predict import SyghtPredictor

logger = logging.getLogger("syght.api")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

# Global instances loaded on application startup
predictor: Optional[SyghtPredictor] = None
preauth_gateway: Optional[PreAuthFraudGateway] = None


def ensure_model_loaded() -> Optional[SyghtPredictor]:
    """Ensures SyghtPredictor is loaded into memory, checking all potential candidate paths."""
    global predictor
    if predictor is not None:
        return predictor

    env_path = os.getenv("SYGHT_MODEL_PATH")
    candidates = []
    if env_path:
        candidates.append(Path(env_path))
    candidates.extend([
        PROJECT_ROOT / "models" / "syght_model_bundle.joblib",
        Path("models/syght_model_bundle.joblib"),
        Path("../models/syght_model_bundle.joblib"),
        Path("/app/models/syght_model_bundle.joblib"),
    ])

    for cand in candidates:
        if cand and cand.exists() and cand.is_file():
            try:
                logger.info("Loading Syght model bundle from: %s", cand)
                predictor = SyghtPredictor.load(cand)
                logger.info(
                    "Model loaded successfully! Selected Model: %s | Threshold: %.4f",
                    predictor.metadata.get("selected_model"),
                    predictor.decision_threshold,
                )
                return predictor
            except Exception as e:
                logger.error("Failed to load model bundle from %s: %s", cand, e, exc_info=True)

    # Emergency on-the-fly training fallback if file not found on disk
    try:
        logger.warning("No pre-trained model bundle found on disk. Initializing on-the-fly calibrated fallback bundle...")
        from ml_pipeline.medicare_simulator import generate_simulated_medicare_data
        from ml_pipeline.feature_engineering import build_provider_features
        from ml_pipeline.train import train_final_model
        from ml_pipeline.config import SyghtConfig

        cfg = SyghtConfig()
        lbl, bene, ip, op = generate_simulated_medicare_data(n_providers=40, seed=42)
        feats = build_provider_features(lbl, bene, ip, op, config=cfg)
        trained_bundle = train_final_model(feats, selected_model="LightGBM", config=cfg)

        save_dest = PROJECT_ROOT / "models" / "syght_model_bundle.joblib"
        save_dest.parent.mkdir(parents=True, exist_ok=True)
        SyghtPredictor.save(trained_bundle, save_dest)
        predictor = SyghtPredictor.load(save_dest)
        logger.info("On-the-fly fallback bundle trained and loaded successfully: %s", predictor.metadata.get("selected_model"))
        return predictor
    except Exception as err:
        logger.error("Failed to generate fallback model: %s", err, exc_info=True)
        return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager: Loads ML model bundle & preauth gateway on boot."""
    global predictor, preauth_gateway

    logger.info("Starting Syght API gateway...")
    ensure_model_loaded()

    # Initialize real-time Pre-Auth gateway
    preauth_gateway = PreAuthFraudGateway(
        high_risk_threshold=0.65,
        review_threshold=0.35,
        known_high_risk_providers={"PRV_02_PHANTOM_SURGERY_MILL", "PRV_03_KICKBACK_COLLUSION_RING"},
    )
    logger.info("Real-Time Pre-Auth Gateway initialized.")

    yield

    logger.info("Shutting down Syght API gateway...")


app = FastAPI(
    title="Syght — Healthcare Insurance Fraud Prevention API",
    description=(
        "Production-grade, explainable machine learning & graph intelligence API "
        "for detecting healthcare insurance fraud (Ayushman Bharat PM-JAY / Private TPAs). "
        "Provides provider risk scoring with SHAP explainability and sub-5ms real-time pre-authorization."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend and cross-origin clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api", summary="API Root & Status", tags=["General"])
async def root():
    """Root endpoint welcoming clients and directing to OpenAPI documentation."""
    return {
        "service": "Syght Healthcare Fraud Prevention API",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs",
        "health": "/health",
    }


@app.get("/health", response_model=HealthCheckResponse, summary="Service Health & Model Metadata", tags=["Health"])
async def health_check():
    """Health check endpoint reporting model readiness and configuration."""
    ensure_model_loaded()
    model_ready = predictor is not None
    return HealthCheckResponse(
        status="healthy" if model_ready else "degraded_no_model",
        version="1.0.0",
        model_loaded=model_ready,
        selected_model=predictor.metadata.get("selected_model") if model_ready else None,
        decision_threshold=predictor.decision_threshold if model_ready else None,
        total_features_tracked=len(predictor.feature_names) if model_ready else 61,
        docs_url="/docs",
    )


@app.post(
    "/api/v1/predict",
    response_model=ProviderPredictionResponse,
    summary="Predict Provider Fraud Risk with SHAP Explainability",
    tags=["Prediction"],
)
async def predict_provider(request: ProviderPredictionRequest):
    """
    Scores a single healthcare provider against 61 clinical, financial,
    and graph collusion features. Returns calibrated fraud probability,
    audit decision, priority tier, and top SHAP feature drivers.
    """
    start_time = time.perf_counter()

    if predictor is None:
        ensure_model_loaded()

    if predictor is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Syght model bundle is not loaded. Verify models/syght_model_bundle.joblib exists.",
        )

    try:
        pred = predictor.predict_provider(request.features, provider_id=request.provider_id)
        latency = (time.perf_counter() - start_time) * 1000.0

        score = float(pred["fraud_risk_score"])
        is_flagged = bool(pred["investigation_recommended"])
        decision = "FLAGGED FOR AUDIT" if is_flagged else "AUTO-CLEARED"

        drivers = [
            RiskDriver(
                feature=d["feature"],
                description=d["description"],
                observed_value=d.get("observed_value"),
                shap_contribution=float(d["shap_contribution"]),
            )
            for d in pred.get("key_risk_drivers", [])
        ]

        return ProviderPredictionResponse(
            provider_id=request.provider_id,
            fraud_risk_score=round(score, 4),
            risk_percentage=f"{score:.1%}",
            investigation_recommended=is_flagged,
            decision=decision,
            priority_level=pred["priority_level"],
            decision_threshold=round(predictor.decision_threshold, 4),
            selected_model=predictor.metadata.get("selected_model", "Ensemble"),
            key_risk_drivers=drivers,
            latency_ms=round(latency, 2),
        )

    except Exception as e:
        logger.error("Error during prediction for provider %s: %s", request.provider_id, e, exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Prediction error: {str(e)}")


@app.post(
    "/api/v1/predict/batch",
    response_model=BatchPredictionResponse,
    summary="Batch Score Multiple Healthcare Providers",
    tags=["Prediction"],
)
async def predict_batch(request: BatchPredictionRequest):
    """Scores a batch of healthcare providers in a single API call."""
    start_time = time.perf_counter()

    if predictor is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Syght model bundle is not loaded.",
        )

    results: List[ProviderPredictionResponse] = []
    flagged = 0
    cleared = 0

    for item in request.providers:
        t0 = time.perf_counter()
        pred = predictor.predict_provider(item.features, provider_id=item.provider_id)
        lat = (time.perf_counter() - t0) * 1000.0

        score = float(pred["fraud_risk_score"])
        is_flagged = bool(pred["investigation_recommended"])
        if is_flagged:
            flagged += 1
        else:
            cleared += 1

        drivers = [
            RiskDriver(
                feature=d["feature"],
                description=d["description"],
                observed_value=d.get("observed_value"),
                shap_contribution=float(d["shap_contribution"]),
            )
            for d in pred.get("key_risk_drivers", [])
        ]

        results.append(
            ProviderPredictionResponse(
                provider_id=item.provider_id,
                fraud_risk_score=round(score, 4),
                risk_percentage=f"{score:.1%}",
                investigation_recommended=is_flagged,
                decision="FLAGGED FOR AUDIT" if is_flagged else "AUTO-CLEARED",
                priority_level=pred["priority_level"],
                decision_threshold=round(predictor.decision_threshold, 4),
                selected_model=predictor.metadata.get("selected_model", "Ensemble"),
                key_risk_drivers=drivers,
                latency_ms=round(lat, 2),
            )
        )

    total_lat = (time.perf_counter() - start_time) * 1000.0

    return BatchPredictionResponse(
        total_providers_scored=len(results),
        flagged_for_audit_count=flagged,
        auto_cleared_count=cleared,
        results=results,
        batch_latency_ms=round(total_lat, 2),
    )


@app.post(
    "/api/v1/preauth",
    response_model=PreAuthClaimResponse,
    summary="Sub-Millisecond Real-Time Admission Pre-Authorization Check",
    tags=["Pre-Authorization"],
)
async def preauth_adjudication(claim: PreAuthClaimRequest):
    """
    Sub-millisecond (< 5ms) fraud gateway that intercepts hospital admission
    and pre-authorization requests before discharge. Evaluates package upcoding,
    phantom burst patterns, and provider reputation.
    """
    if preauth_gateway is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Pre-Auth Gateway is not initialized.",
        )

    req = PreAuthRequest(
        claim_id=claim.claim_id,
        provider_id=claim.provider_id,
        beneficiary_id=claim.beneficiary_id,
        attending_physician=claim.attending_physician,
        admission_date=claim.admission_date,
        requested_amount=claim.requested_amount,
        diagnosis_codes=claim.diagnosis_codes,
        procedure_codes=claim.procedure_codes or [],
        patient_age=claim.patient_age,
        chronic_conditions_count=claim.chronic_conditions_count,
    )

    res = preauth_gateway.score_preauth(req)

    return PreAuthClaimResponse(
        claim_id=res.claim_id,
        provider_id=res.provider_id,
        decision=res.decision,
        fraud_probability=round(res.fraud_probability, 4),
        risk_level=res.risk_level,
        latency_ms=round(res.latency_ms, 3),
        flags_triggered=res.flags_triggered,
        reason_codes=res.reason_codes,
        max_approved_amount=round(res.max_approved_amount, 2),
    )


@app.get(
    "/api/v1/ten-cases",
    summary="Run and Return 10 Multi-Scenario Benchmark Cases",
    tags=["Benchmark"],
)
async def run_ten_cases():
    """
    Executes the official 10-scenario insurance fraud test suite live
    and returns full classification metrics and predictions.
    """
    from tests.run_ten_insurance_tests import get_ten_insurance_test_cases

    if predictor is None:
        raise HTTPException(status_code=503, detail="Model bundle not loaded")

    cases = get_ten_insurance_test_cases()
    results = []

    for c in cases:
        pid = c["id"]
        data = c["data"]
        pred = predictor.predict_provider(data, provider_id=pid)

        results.append({
            "provider_id": pid,
            "scenario": c["scenario"],
            "ground_truth": c["ground_truth"],
            "fraud_risk_score": round(float(pred["fraud_risk_score"]), 4),
            "risk_percentage": f"{pred['fraud_risk_score']:.1%}",
            "decision": "FLAGGED FOR AUDIT" if pred["investigation_recommended"] else "AUTO-CLEARED",
            "priority": pred["priority_level"],
            "key_risk_drivers": pred.get("key_risk_drivers", [])[:2],
        })

    return {
        "status": "success",
        "total_cases_evaluated": len(results),
        "model": predictor.metadata.get("selected_model"),
        "decision_threshold": predictor.decision_threshold,
        "cases": results,
    }


# Mount static figures directory for evaluation plots
figures_dir = PROJECT_ROOT / "reports" / "figures"
if figures_dir.exists():
    app.mount("/reports/figures", StaticFiles(directory=str(figures_dir)), name="figures")

# Mount frontend directory for SPA (prefer built React production bundle)
react_dist = PROJECT_ROOT / "react-frontend" / "dist"
frontend_dist = PROJECT_ROOT / "frontend" / "dist"
frontend_dir = PROJECT_ROOT / "frontend"

if react_dist.exists() and (react_dist / "index.html").exists():
    app.mount("/", StaticFiles(directory=str(react_dist), html=True), name="frontend")
elif frontend_dist.exists() and (frontend_dist / "index.html").exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")
elif frontend_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
