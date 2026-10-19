"""
Data Audit Module: Pre-flight data quality, label integrity, identifier overlap,
and data leakage audit for healthcare claims datasets.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, Optional, Tuple

import numpy as np
import pandas as pd

from ml_pipeline.config import SyghtConfig
from ml_pipeline.data_ingestion import derive_fraud_label

logger = logging.getLogger(__name__)


class DataAuditor:
    """Audits raw healthcare claims datasets before feature engineering and modeling."""

    def __init__(self, config: Optional[SyghtConfig] = None):
        self.config = config or SyghtConfig()

    def audit_labels(self, labels_df: pd.DataFrame) -> Dict[str, Any]:
        """Audits label distribution, duplicates, and consistency."""
        cfg = self.config
        report: Dict[str, Any] = {}

        n_rows = len(labels_df)
        n_unique_prov = labels_df[cfg.id_col].nunique()
        report["n_rows"] = n_rows
        report["n_unique_providers"] = n_unique_prov
        report["duplicate_provider_records"] = int(labels_df[cfg.id_col].duplicated().sum())

        clean_labels = derive_fraud_label(labels_df, cfg.target_col, cfg.positive_label, output_col="fraud")
        fraud_counts = clean_labels["fraud"].value_counts().to_dict()
        report["class_distribution"] = {
            "legitimate_0": int(fraud_counts.get(0, 0)),
            "fraud_1": int(fraud_counts.get(1, 0)),
        }
        report["fraud_rate"] = float(round(clean_labels["fraud"].mean(), 4))

        # Check for conflicting labels on the same provider ID
        label_conflicts = clean_labels.groupby(cfg.id_col)["fraud"].nunique()
        n_conflicts = int((label_conflicts > 1).sum())
        report["providers_with_conflicting_labels"] = n_conflicts

        if n_conflicts > 0:
            raise ValueError(
                f"Data integrity violation: {n_conflicts} providers have conflicting fraud labels!"
            )

        return report

    def audit_claims(
        self,
        labels_df: pd.DataFrame,
        inpatient_df: pd.DataFrame,
        outpatient_df: pd.DataFrame,
    ) -> Dict[str, Any]:
        """Audits claims volume, identifier overlap, and amount sanity."""
        cfg = self.config
        report: Dict[str, Any] = {}

        claims = pd.concat([
            inpatient_df.assign(encounter_type="inpatient"),
            outpatient_df.assign(encounter_type="outpatient"),
        ], ignore_index=True)

        report["n_inpatient_claims"] = len(inpatient_df)
        report["n_outpatient_claims"] = len(outpatient_df)
        report["n_total_claims"] = len(claims)
        report["duplicate_claim_ids"] = int(claims[cfg.claim_id_col].duplicated().sum())

        prov_claims = set(claims[cfg.id_col].dropna().unique())
        prov_labels = set(labels_df[cfg.id_col].dropna().unique())

        overlap = prov_claims & prov_labels
        report["providers_in_claims"] = len(prov_claims)
        report["providers_with_claims_and_labels"] = len(overlap)
        report["labelled_providers_without_claims"] = len(prov_labels - prov_claims)
        report["claims_providers_without_labels"] = len(prov_claims - prov_labels)
        report["overlap_fraction"] = float(round(len(overlap) / max(len(prov_labels), 1), 4))

        # Critical check: if overlap is less than 50%, wrong files were loaded
        if report["overlap_fraction"] < 0.50:
            raise RuntimeError(
                f"Fatal dataset mismatch: only {len(overlap)} of {len(prov_labels)} "
                f"({report['overlap_fraction']:.1%}) labelled providers appear in claim files. "
                "Ensure training claim files (not unlabelled test files) are being loaded."
            )

        # Financial amount sanity checks
        reimb_numeric = pd.to_numeric(claims[cfg.reimbursed_amt_col], errors="coerce")
        deduct_numeric = pd.to_numeric(claims[cfg.deductible_amt_col], errors="coerce")

        report["negative_reimbursements"] = int((reimb_numeric < 0).sum())
        report["negative_deductibles"] = int((deduct_numeric < 0).sum())
        report["reimbursement_stats"] = {
            "min": float(reimb_numeric.min()),
            "mean": float(round(reimb_numeric.mean(), 2)),
            "median": float(round(reimb_numeric.median(), 2)),
            "max": float(reimb_numeric.max()),
            "p99": float(round(reimb_numeric.quantile(0.99), 2)),
        }

        # Date sanity check
        start_dt = pd.to_datetime(claims[cfg.claim_start_col], errors="coerce")
        end_dt = pd.to_datetime(claims[cfg.claim_end_col], errors="coerce")
        report["invalid_claim_date_order"] = int((end_dt < start_dt).sum())
        report["date_range"] = {
            "earliest_claim_start": str(start_dt.min().date()) if not start_dt.isna().all() else None,
            "latest_claim_end": str(end_dt.max().date()) if not end_dt.isna().all() else None,
        }

        # Hospital admission/discharge sanity for inpatient
        if cfg.admit_dt_col in inpatient_df.columns and cfg.discharge_dt_col in inpatient_df.columns:
            admit_dt = pd.to_datetime(inpatient_df[cfg.admit_dt_col], errors="coerce")
            discharge_dt = pd.to_datetime(inpatient_df[cfg.discharge_dt_col], errors="coerce")
            report["inpatient_invalid_discharge_before_admit"] = int((discharge_dt < admit_dt).sum())

        return report

    def audit_beneficiaries(
        self,
        beneficiary_df: pd.DataFrame,
        inpatient_df: pd.DataFrame,
        outpatient_df: pd.DataFrame,
    ) -> Dict[str, Any]:
        """Audits beneficiary records, chronic conditions, and network span."""
        cfg = self.config
        report: Dict[str, Any] = {}

        report["n_beneficiary_records"] = len(beneficiary_df)
        report["n_unique_beneficiaries"] = beneficiary_df[cfg.bene_id_col].nunique()
        report["duplicate_beneficiary_ids"] = int(beneficiary_df[cfg.bene_id_col].duplicated().sum())

        # Check chronic condition flags (should be 1 or 2)
        invalid_chronic = {}
        for c in cfg.chronic_cols:
            if c in beneficiary_df.columns:
                vals = set(pd.to_numeric(beneficiary_df[c], errors="coerce").dropna().unique())
                if not vals <= {1, 2}:
                    invalid_chronic[c] = list(vals)
        report["invalid_chronic_condition_encodings"] = invalid_chronic

        # Check multi-provider beneficiary span
        claims_benes = pd.concat([
            inpatient_df[[cfg.bene_id_col, cfg.id_col]],
            outpatient_df[[cfg.bene_id_col, cfg.id_col]],
        ], ignore_index=True).drop_duplicates()

        prov_per_bene = claims_benes.groupby(cfg.bene_id_col)[cfg.id_col].nunique()
        report["pct_beneficiaries_visiting_multiple_providers"] = float(
            round((prov_per_bene > 1).mean(), 4)
        )

        return report

    def run_full_audit(
        self,
        labels_df: pd.DataFrame,
        beneficiary_df: pd.DataFrame,
        inpatient_df: pd.DataFrame,
        outpatient_df: pd.DataFrame,
    ) -> Dict[str, Any]:
        """Executes the complete pre-flight data audit and returns a unified report."""
        logger.info("Running pre-flight data quality audit...")
        label_audit = self.audit_labels(labels_df)
        claims_audit = self.audit_claims(labels_df, inpatient_df, outpatient_df)
        bene_audit = self.audit_beneficiaries(beneficiary_df, inpatient_df, outpatient_df)

        full_report = {
            "status": "PASSED",
            "labels": label_audit,
            "claims": claims_audit,
            "beneficiary": bene_audit,
        }
        return full_report
