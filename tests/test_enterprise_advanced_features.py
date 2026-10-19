"""
Tests for Enterprise Advanced Fraud Detection Modules:
1. Graph Collusion & Kickback Nexus Detection
2. Real-Time Pre-Auth Gateway (< 5ms Adjudication)
3. OCR / Clinical Discharge Summary Cross-Verification
"""

import pandas as pd
import pytest

from backend.preauth_gateway import PreAuthFraudGateway, PreAuthRequest
from ml_pipeline.clinical_verifier import ClinicalDischargeVerifier
from ml_pipeline.graph_collusion import HealthcareCollusionGraph


def test_graph_collusion_ring_detection():
    # Synthetic claims sharing physicians and beneficiaries
    claims_data = {
        "Provider": ["PRV_A", "PRV_A", "PRV_B", "PRV_B", "PRV_C"],
        "BeneID": ["B1", "B2", "B1", "B2", "B3"],
        "AttendingPhysician": ["DOC_1", "DOC_2", "DOC_1", "DOC_2", "DOC_9"],
    }
    df = pd.DataFrame(claims_data)

    graph = HealthcareCollusionGraph(min_shared_beneficiaries=2, min_shared_physicians=2)
    graph.fit_from_claims(df)

    rings = graph.detect_collusion_rings()
    assert len(rings) >= 1
    top_ring = rings[0]
    assert "PRV_A" in top_ring.providers
    assert "PRV_B" in top_ring.providers
    assert top_ring.shared_beneficiaries_count == 2
    assert "DOC_1" in top_ring.shared_physicians

    metrics_df = graph.compute_provider_collusion_metrics()
    assert len(metrics_df) == 3
    assert "graph_collusion_degree" in metrics_df.columns
    assert "graph_pct_multi_facility_physicians" in metrics_df.columns


def test_preauth_gateway_realtime_decisions():
    gateway = PreAuthFraudGateway(known_high_risk_providers={"PRV_BAD"})

    # Normal clean claim
    req_clean = PreAuthRequest(
        claim_id="CLM001",
        provider_id="PRV_GOOD",
        beneficiary_id="BENE_100",
        attending_physician="DOC_GOOD",
        admission_date="2026-10-19",
        requested_amount=1200.0,
        diagnosis_codes=["4019"],
    )
    res_clean = gateway.score_preauth(req_clean)
    assert res_clean.decision == "AUTO_APPROVED"
    assert res_clean.fraud_probability < 0.35
    assert res_clean.latency_ms < 50.0  # Ultra-fast latency

    # Upcoding + Bad Provider Claim
    req_fraud = PreAuthRequest(
        claim_id="CLM002",
        provider_id="PRV_BAD",
        beneficiary_id="BENE_200",
        attending_physician="DOC_BAD",
        admission_date="2026-10-19",
        requested_amount=20000.0,  # 16x normal for 4019
        diagnosis_codes=["4019"],
    )
    res_fraud = gateway.score_preauth(req_fraud)
    assert res_fraud.decision in ("MANUAL_AUDIT_REQUIRED", "REJECT_SUSPECTED_FRAUD")
    assert res_fraud.fraud_probability >= 0.50
    assert "SUSPECTED_PACKAGE_UPCODING" in res_fraud.flags_triggered


def test_clinical_discharge_cross_verification():
    verifier = ClinicalDischargeVerifier()

    # Legit claim: knee replacement matching text
    legit_notes = (
        "Patient admitted for left total knee replacement. Successful knee arthroplasty "
        "and prosthesis implantation. Stay duration: 3 days. Discharged stable."
    )
    res_legit = verifier.audit_claim_against_notes(
        claim_id="CLM101",
        billed_procedures=["KNEE_REPLACEMENT"],
        billed_stay_days=3,
        discharge_summary_text=legit_notes,
    )
    assert res_legit.is_suspicious is False
    assert res_legit.discrepancy_score < 0.30

    # Phantom surgery: billed appendectomy but notes describe mild acidity / same-day discharge
    fake_notes = (
        "Patient seen in emergency for gastritis after spicy food. Abdomen non-tender. "
        "Prescribed antacids. Discharged same day after observation. No surgery."
    )
    res_fake = verifier.audit_claim_against_notes(
        claim_id="CLM102",
        billed_procedures=["APPENDECTOMY"],
        billed_stay_days=4,
        discharge_summary_text=fake_notes,
    )
    assert res_fake.is_suspicious is True
    assert res_fake.discrepancy_score >= 0.50
    assert "FREEZE_PAYMENT" in res_fake.auditor_action


def test_visualization_suite():
    import numpy as np
    from sklearn.ensemble import RandomForestClassifier
    from ml_pipeline.visualization import (
        plot_model_benchmarks,
        plot_decision_tree_explanation,
        plot_evaluation_dashboard,
        plot_fraud_recovery_lift,
    )

    cv_df = pd.DataFrame({
        "model": ["Rule_ClaimVolume", "RandomForest", "ExtraTrees"],
        "pr_auc_mean": [0.45, 0.74, 0.76],
        "pr_auc_std": [0.03, 0.02, 0.02],
        "roc_auc_mean": [0.70, 0.91, 0.92],
        "accuracy_mean": [0.88, 0.95, 0.96],
        "balanced_acc_mean": [0.65, 0.86, 0.88],
    })
    fig1 = plot_model_benchmarks(cv_df)
    assert fig1 is not None

    rf = RandomForestClassifier(n_estimators=5, max_depth=3, random_state=42)
    rf.fit(np.random.randn(50, 4), np.random.randint(0, 2, 50))
    fig2 = plot_decision_tree_explanation(rf, ["f1", "f2", "f3", "f4"])
    assert fig2 is not None

    y_test = np.array([0, 0, 1, 1, 0, 1])
    p_test = np.array([0.1, 0.2, 0.8, 0.9, 0.3, 0.7])
    fig3 = plot_evaluation_dashboard(y_test, p_test, 0.5)
    assert fig3 is not None

    fig4 = plot_fraud_recovery_lift(y_test, p_test, np.array([100, 200, 500, 1000, 50, 300]))
    assert fig4 is not None

