"""
Unit tests for FastAPI Production Gateway (backend/main.py).
"""

import pytest
from fastapi.testclient import TestClient

from backend.main import app
from tests.run_ten_insurance_tests import get_ten_insurance_test_cases


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_frontend_spa_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "Syght" in response.text
    assert "root" in response.text or "Command Center" in response.text


def test_api_json_root_endpoint(client):
    response = client.get("/api")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "/docs" in data["documentation"]


def test_api_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["selected_model"] == "LightGBM"
    assert data["decision_threshold"] > 0.0


def test_api_preauth_endpoint_approved(client):
    req_payload = {
        "claim_id": "CLM_CLEAN_01",
        "provider_id": "PRV_LEGIT_CLINIC",
        "beneficiary_id": "BENE_9901",
        "attending_physician": "DOC_NORMAL",
        "admission_date": "2026-10-19",
        "requested_amount": 1800.0,
        "diagnosis_codes": ["4019"],  # Essential Hypertension (~1200 base rate)
        "patient_age": 62,
    }
    response = client.post("/api/v1/preauth", json=req_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["claim_id"] == "CLM_CLEAN_01"
    assert data["decision"] in ["AUTO_APPROVED", "MANUAL_AUDIT_REQUIRED"]
    assert "latency_ms" in data


def test_api_preauth_endpoint_suspicious_upcoding(client):
    req_payload = {
        "claim_id": "CLM_SUSPICIOUS_02",
        "provider_id": "PRV_02_PHANTOM_SURGERY_MILL",
        "beneficiary_id": "BENE_9902",
        "attending_physician": "DOC_GHOST",
        "admission_date": "2026-10-19",
        "requested_amount": 150000.0,  # Extreme package upcoding
        "diagnosis_codes": ["4019"],
        "patient_age": 75,
    }
    response = client.post("/api/v1/preauth", json=req_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] == "REJECT_SUSPECTED_FRAUD"
    assert "SUSPECTED_PACKAGE_UPCODING" in data["flags_triggered"]


def test_api_single_provider_predict(client):
    cases = get_ten_insurance_test_cases()
    fraud_case = cases[1]  # Phantom surgery mill

    req_payload = {
        "provider_id": fraud_case["id"],
        "features": fraud_case["data"],
    }
    response = client.post("/api/v1/predict", json=req_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["provider_id"] == fraud_case["id"]
    assert data["decision"] == "FLAGGED FOR AUDIT"
    assert data["fraud_risk_score"] > 0.5364
    assert len(data["key_risk_drivers"]) > 0


def test_api_ten_cases_benchmark_endpoint(client):
    response = client.get("/api/v1/ten-cases")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total_cases_evaluated"] == 10
    assert len(data["cases"]) == 10
