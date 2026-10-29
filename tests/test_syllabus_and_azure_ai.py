"""
Unit tests for Syllabus Curriculum Endpoints, Azure ML SDK v2 integration,
Generative AI multi-agent system, and Clinical NLP analyzers.
"""

from pathlib import Path
import tempfile
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from ml_pipeline.azure_ml_integration import AzureMLConfig, AzureMLManager, AzureMLPipelineGenerator
from ml_pipeline.genai_agent_system import HealthFraudAgentSystem
from ml_pipeline.nlp_clinical_analyzer import ClinicalNotesNLPAnalyzer, AzureAIDocumentIntelligenceConnector, AzureAISearchConnector


@pytest.fixture
def client():
    return TestClient(app)


def test_syllabus_curriculum_endpoint(client):
    resp = client.get("/api/v1/syllabus/curriculum")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "COMPLIANT"
    assert len(data["units"]) == 2
    
    # Unit 1
    u1 = data["units"][0]
    assert u1["unit"] == "Unit-1"
    assert len(u1["experiments"]) == 4
    for exp in u1["experiments"]:
        assert exp["status"] == "COMPLETED"

    # Unit 2
    u2 = data["units"][1]
    assert u2["unit"] == "Unit-2"
    assert len(u2["experiments"]) == 3
    for exp in u2["experiments"]:
        assert exp["status"] == "COMPLETED"


def test_azure_ml_spec_endpoint_and_export(client):
    resp = client.get("/api/v1/azure-ml/pipeline-spec")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert "pipeline_stages" in data
    assert len(data["pipeline_stages"]) == 4

    # Test asset export in temporary directory
    with tempfile.TemporaryDirectory() as tmp_dir:
        mgr = AzureMLManager()
        exported = mgr.export_azure_assets(Path(tmp_dir))
        assert "conda_env" in exported
        assert "pipeline_job" in exported
        assert "endpoint" in exported
        assert "deployment" in exported
        assert "score_script" in exported
        assert Path(exported["conda_env"]).exists()
        assert Path(exported["pipeline_job"]).exists()


def test_genai_multi_agent_investigation_endpoint(client):
    sample_payload = {
        "Provider": "PRV_SUSPICIOUS_ICU_SURGERY",
        "n_claims": 240,
        "pct_duplicate_bene_claims_same_day": 0.22,
        "unbundling_score": 0.85,
        "mean_inpatient_los": 18.5,
        "max_inpatient_los": 45.0,
        "fraud_risk_score": 0.92,
        "top_physician_concentration": 0.95,
        "shared_physician_degree": 0.88,
    }

    resp = client.post("/api/v1/agents/investigate", json=sample_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    inv = data["investigation"]
    assert inv["decision"] == "IMMEDIATE_DISBURSEMENT_FREEZE"
    assert inv["priority"] == "CRITICAL"
    assert len(inv["agent_deliberations"]) == 3
    assert "EXECUTIVE SUMMARY" in inv["narrative_report"]


def test_genai_audit_summary_endpoint(client):
    sample_payload = {
        "Provider": "PRV_NORMAL_CLINIC",
        "n_claims": 45,
        "pct_duplicate_bene_claims_same_day": 0.01,
        "unbundling_score": 0.10,
        "mean_inpatient_los": 2.2,
        "fraud_risk_score": 0.08,
        "top_physician_concentration": 0.20,
    }
    resp = client.post("/api/v1/genai/audit-summary", json=sample_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["recommended_decision"] == "AUTO_CLEARED_FOR_PAYOUT"


def test_nlp_clinical_notes_analysis_endpoint(client):
    # Test upcoding & phantom billing detection
    suspicious_payload = {
        "clinical_notes": "Patient presented with mild throat irritation and occasional cough. Vitals normal. Prescribed paracetamol and rest.",
        "billed_icd_codes": ["A41", "I50"],  # Sepsis & Heart failure billed for a mild cough!
    }
    resp = client.post("/api/v1/nlp/analyze-notes", json=suspicious_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    analysis = data["nlp_analysis"]
    assert analysis["upcoding_suspected"] is True
    assert analysis["phantom_billing_suspected"] is True
    assert analysis["semantic_concordance_score"] == 0.0
    assert len(data["matched_precedents"]) > 0


def test_nlp_clean_notes_concordance(client):
    clean_payload = {
        "clinical_notes": "Patient diagnosed with essential hypertension and type 2 diabetes mellitus. Blood pressure 145/90, glucose elevated.",
        "billed_icd_codes": ["I10", "E11"],
    }
    resp = client.post("/api/v1/nlp/analyze-notes", json=clean_payload)
    assert resp.status_code == 200
    data = resp.json()
    analysis = data["nlp_analysis"]
    assert analysis["upcoding_suspected"] is False
    assert analysis["phantom_billing_suspected"] is False
    assert analysis["semantic_concordance_score"] == 1.0

