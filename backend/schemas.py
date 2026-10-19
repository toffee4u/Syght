"""
Pydantic Request and Response Schemas for Syght Healthcare Fraud API.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class RiskDriver(BaseModel):
    feature: str = Field(..., description="Technical feature name")
    description: str = Field(..., description="Human-readable clinical/financial explanation")
    observed_value: Optional[float] = Field(None, description="Observed numeric value for provider")
    shap_contribution: float = Field(..., description="SHAP feature attribution value")


class ProviderPredictionRequest(BaseModel):
    provider_id: str = Field(..., examples=["PRV_HOSPITAL_01"], description="Unique provider ID")
    features: Dict[str, Any] = Field(
        ...,
        description="Dictionary mapping feature names to numerical or identifier values",
        examples=[{
            "n_claims": 520.0,
            "n_inpatient_claims": 460.0,
            "n_outpatient_claims": 60.0,
            "inpatient_share": 0.885,
            "total_reimbursed": 5100000.0,
            "claims_per_beneficiary": 5.47,
            "claims_per_operating_physician": 260.0,
            "top_physician_concentration": 0.92,
            "graph_collusion_degree": 7.0,
        }],
    )


class ProviderPredictionResponse(BaseModel):
    provider_id: str
    fraud_risk_score: float = Field(..., description="Calibrated fraud probability [0.0 - 1.0]")
    risk_percentage: str = Field(..., description="Formatted probability percentage")
    investigation_recommended: bool = Field(..., description="True if score >= operating threshold")
    decision: str = Field(..., description="'FLAGGED FOR AUDIT' or 'AUTO-CLEARED'")
    priority_level: str = Field(..., description="'CRITICAL', 'HIGH', 'MEDIUM', or 'LOW'")
    decision_threshold: float = Field(..., description="Trained cost-optimal decision threshold")
    selected_model: str = Field(..., description="Underlying ensemble architecture")
    key_risk_drivers: List[RiskDriver] = Field(default_factory=list, description="Top SHAP explainability factors")
    latency_ms: float = Field(..., description="Model scoring inference latency in milliseconds")


class BatchPredictionRequest(BaseModel):
    providers: List[ProviderPredictionRequest]


class BatchPredictionResponse(BaseModel):
    total_providers_scored: int
    flagged_for_audit_count: int
    auto_cleared_count: int
    results: List[ProviderPredictionResponse]
    batch_latency_ms: float


class PreAuthClaimRequest(BaseModel):
    claim_id: str = Field(..., examples=["CLM_9901"])
    provider_id: str = Field(..., examples=["PRV_HOSPITAL_01"])
    beneficiary_id: str = Field(..., examples=["BENE_4412"])
    attending_physician: str = Field(..., examples=["DOC_0921"])
    admission_date: str = Field(..., examples=["2026-10-19"])
    requested_amount: float = Field(..., examples=[85000.0])
    diagnosis_codes: List[str] = Field(default_factory=list, examples=[["4019", "4280"]])
    procedure_codes: List[str] = Field(default_factory=list, examples=[["3893"]])
    patient_age: int = Field(55, examples=[68])
    chronic_conditions_count: int = Field(2, examples=[4])


class PreAuthClaimResponse(BaseModel):
    claim_id: str
    provider_id: str
    decision: str = Field(..., description="'AUTO_APPROVED', 'MANUAL_AUDIT_REQUIRED', or 'REJECT_SUSPECTED_FRAUD'")
    fraud_probability: float
    risk_level: str = Field(..., description="'LOW', 'MEDIUM', 'HIGH', or 'CRITICAL'")
    latency_ms: float
    flags_triggered: List[str]
    reason_codes: List[str]
    max_approved_amount: float


class HealthCheckResponse(BaseModel):
    status: str
    version: str
    model_loaded: bool
    selected_model: Optional[str]
    decision_threshold: Optional[float]
    total_features_tracked: int
    docs_url: str
