"""
Tests for Data Audit Module.
"""

import pandas as pd
import pytest

from ml_pipeline.data_audit import DataAuditor
from ml_pipeline.medicare_simulator import generate_simulated_medicare_data


def test_data_auditor_on_simulated_data():
    labels, bene, ip, op = generate_simulated_medicare_data(n_providers=50, n_beneficiaries=150, seed=42)
    auditor = DataAuditor()
    report = auditor.run_full_audit(labels, bene, ip, op)

    assert report["status"] == "PASSED"
    assert report["labels"]["n_unique_providers"] == 50
    assert report["labels"]["duplicate_provider_records"] == 0
    assert report["labels"]["providers_with_conflicting_labels"] == 0
    assert report["claims"]["n_total_claims"] > 0
    assert report["claims"]["overlap_fraction"] >= 0.50


def test_data_auditor_detects_label_conflict():
    labels = pd.DataFrame({
        "Provider": ["PRV1", "PRV1"],
        "PotentialFraud": ["Yes", "No"],
    })
    auditor = DataAuditor()
    with pytest.raises(ValueError, match="conflicting fraud labels"):
        auditor.audit_labels(labels)


def test_data_auditor_detects_severe_overlap_mismatch():
    labels = pd.DataFrame({"Provider": [f"P{i}" for i in range(100)], "PotentialFraud": ["No"] * 100})
    ip = pd.DataFrame({
        "Provider": ["OTHER_1", "OTHER_2"],
        "BeneID": ["B1", "B2"],
        "ClaimID": ["C1", "C2"],
        "InscClaimAmtReimbursed": [100, 200],
        "DeductibleAmtPaid": [10, 20],
        "ClaimStartDt": ["2009-01-01", "2009-01-02"],
        "ClaimEndDt": ["2009-01-05", "2009-01-06"],
    })
    op = ip.copy()

    auditor = DataAuditor()
    with pytest.raises(RuntimeError, match="Fatal dataset mismatch"):
        auditor.audit_claims(labels, ip, op)
