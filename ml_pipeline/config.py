"""
Syght Configuration Module: Central source of truth for pipeline parameters,
paths, schemas, feature groups, and model specifications.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Tuple


@dataclass
class SyghtConfig:
    """Central configuration for Syght ML Pipeline."""

    # Project identification
    project_name: str = "Syght"
    version: str = "1.0.0"
    random_seed: int = 42

    # Directory Paths
    base_dir: Path = field(default_factory=lambda: Path(os.getcwd()))
    data_raw_dir: Path = field(default_factory=lambda: Path("data/raw"))
    data_processed_dir: Path = field(default_factory=lambda: Path("data/processed"))
    models_dir: Path = field(default_factory=lambda: Path("models"))
    reports_dir: Path = field(default_factory=lambda: Path("reports"))
    outputs_dir: Path = field(default_factory=lambda: Path("outputs"))

    # File patterns for raw Kaggle dataset (Glob patterns)
    file_patterns: Dict[str, str] = field(default_factory=lambda: {
        "labels": "Train-*.csv",
        "beneficiary": "Train_Beneficiarydata-*.csv",
        "inpatient": "Train_Inpatientdata-*.csv",
        "outpatient": "Train_Outpatientdata-*.csv",
    })

    # Prefix filter to avoid loading unlabelled test files
    exclude_prefixes: Tuple[str, ...] = ("Test_", "Test-")

    # Column Identifiers in Raw CMS Dataset
    id_col: str = "Provider"
    target_col: str = "PotentialFraud"
    positive_label: str = "Yes"
    bene_id_col: str = "BeneID"
    claim_id_col: str = "ClaimID"
    claim_start_col: str = "ClaimStartDt"
    claim_end_col: str = "ClaimEndDt"
    admit_dt_col: str = "AdmissionDt"
    discharge_dt_col: str = "DischargeDt"
    reimbursed_amt_col: str = "InscClaimAmtReimbursed"
    deductible_amt_col: str = "DeductibleAmtPaid"
    attending_physician_col: str = "AttendingPhysician"
    operating_physician_col: str = "OperatingPhysician"
    other_physician_col: str = "OtherPhysician"

    # Diagnosis & Procedure column lists
    diag_cols: List[str] = field(default_factory=lambda: [f"ClmDiagnosisCode_{i}" for i in range(1, 11)])
    proc_cols: List[str] = field(default_factory=lambda: [f"ClmProcedureCode_{i}" for i in range(1, 7)])

    # Beneficiary chronic conditions
    chronic_cols: List[str] = field(default_factory=lambda: [
        "ChronicCond_Alzheimer",
        "ChronicCond_Heartfailure",
        "ChronicCond_KidneyDisease",
        "ChronicCond_Cancer",
        "ChronicCond_ObstrPulmonary",
        "ChronicCond_Depression",
        "ChronicCond_Diabetes",
        "ChronicCond_IschemicHeart",
        "ChronicCond_Osteoporasis",
        "ChronicCond_rheumatoidarthritis",
        "ChronicCond_stroke",
    ])

    # Beneficiary annual financial columns
    bene_annual_cols: List[str] = field(default_factory=lambda: [
        "IPAnnualReimbursementAmt",
        "IPAnnualDeductibleAmt",
        "OPAnnualReimbursementAmt",
        "OPAnnualDeductibleAmt",
    ])

    # Protected or sensitive patient attributes strictly excluded from feature engineering
    # Ethical requirement: Providers must not be penalized based on patient demographic attributes.
    protected_bene_cols: List[str] = field(default_factory=lambda: ["Gender", "Race"])

    # Feature Group Definitions (58 Provider-Level Features Total)
    volume_features: List[str] = field(default_factory=lambda: [
        "n_claims",
        "n_inpatient_claims",
        "n_outpatient_claims",
        "inpatient_share",
        "n_unique_beneficiaries",
        "n_unique_attending_physicians",
        "n_unique_operating_physicians",
        "n_unique_other_physicians",
        "claims_per_beneficiary",
        "claims_per_attending_physician",
        "claims_per_operating_physician",
        "inpatient_claims_per_beneficiary",
        "outpatient_claims_per_beneficiary",
    ])

    money_features: List[str] = field(default_factory=lambda: [
        "total_reimbursed",
        "mean_reimbursed",
        "median_reimbursed",
        "std_reimbursed",
        "max_reimbursed",
        "p90_reimbursed",
        "p99_reimbursed",
        "total_deductible",
        "mean_deductible",
        "max_deductible",
        "deductible_to_reimbursement_ratio",
        "reimbursed_per_beneficiary",
        "reimbursed_per_attending_physician",
        "mean_reimbursed_inpatient",
        "mean_reimbursed_outpatient",
    ])

    behaviour_features: List[str] = field(default_factory=lambda: [
        "mean_claim_duration_days",
        "mean_admit_days",
        "std_admit_days",
        "max_admit_days",
        "ip_cv_los",
        "pct_claims_zero_duration",
        "pct_claims_missing_attending",
        "pct_claims_with_operating_physician",
        "pct_claims_with_other_physician",
        "mean_n_diagnosis_codes",
        "mean_n_procedure_codes",
        "pct_claims_with_procedure",
        "unique_diagnosis_count",
        "unique_procedure_count",
        "top_diagnosis_concentration",
        "top_physician_concentration",
        "pct_duplicate_bene_claims_same_day",
        "n_states_served",
        "n_counties_served",
    ])

    patient_mix_features: List[str] = field(default_factory=lambda: [
        "mean_patient_age",
        "std_patient_age",
        "pct_patients_deceased",
        "mean_chronic_conditions",
        "pct_renal_disease",
        "mean_chronic_diabetes_rate",
        "mean_chronic_heartfailure_rate",
        "mean_ip_annual_reimbursement",
        "mean_ip_annual_deductible",
        "mean_op_annual_reimbursement",
        "mean_op_annual_deductible",
    ])

    # Splitting parameters
    test_size: float = 0.20
    val_size: float = 0.15
    cv_n_splits: int = 5
    cv_n_repeats: int = 1

    # Cost-Aware Threshold Optimization Parameters
    # Fixed operational cost per investigator reviewing a flagged case
    investigation_cost: float = 2500.0
    # Expected clawback/recovery fraction of exposure for detected fraud
    default_recovery_fraction: float = 0.20
    # Sensitivity range for recovery fractions to test
    cost_ratios_to_test: List[float] = field(default_factory=lambda: [0.05, 0.10, 0.15, 0.20, 0.25, 0.35, 0.50])

    # Investigation queue capacity thresholds (top-K as percentage of total provider population)
    queue_capacities: List[float] = field(default_factory=lambda: [0.01, 0.05, 0.10, 0.20])

    @property
    def all_features(self) -> List[str]:
        """Returns the full list of engineered provider-level features."""
        return (
            self.volume_features
            + self.money_features
            + self.behaviour_features
            + self.patient_mix_features
        )

    @property
    def size_features(self) -> List[str]:
        """Features reflecting absolute provider scale rather than operational ratios."""
        return [
            "n_claims",
            "n_inpatient_claims",
            "n_outpatient_claims",
            "n_unique_beneficiaries",
            "n_unique_attending_physicians",
            "total_reimbursed",
            "n_states_served",
            "n_counties_served",
        ]

    @property
    def behaviour_only_features(self) -> List[str]:
        """Normalized features capturing behavioral patterns independent of provider size."""
        size_set = set(self.size_features)
        return [f for f in self.all_features if f not in size_set]
