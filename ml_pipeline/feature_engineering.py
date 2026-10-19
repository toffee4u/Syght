"""
Feature Engineering Module: Pure transform collapsing raw claims and beneficiary
tables into a defensible provider-level feature matrix.
"""

from __future__ import annotations

import logging
from typing import Optional

import numpy as np
import pandas as pd

from ml_pipeline.config import SyghtConfig
from ml_pipeline.data_ingestion import derive_fraud_label

logger = logging.getLogger(__name__)


def compute_concentration(series: pd.Series) -> float:
    """
    Computes the share of a provider's claims taken by their single most frequent value.
    Higher concentration indicates high reliance on one physician or one primary diagnosis.
    """
    valid = series.dropna()
    valid = valid[valid.astype(str).str.strip() != ""]
    if len(valid) == 0:
        return 0.0
    val_counts = valid.value_counts(normalize=True)
    return float(val_counts.iloc[0])


def compute_duplicate_same_day_billing(claims_df: pd.DataFrame, config: SyghtConfig) -> pd.Series:
    """
    Computes the fraction of claims where the same beneficiary was billed
    multiple times on the exact same service start date for that provider.
    """
    cfg = config
    group_cols = [cfg.id_col, cfg.bene_id_col, cfg.claim_start_col]
    counts = (
        claims_df.groupby(group_cols, observed=True)
        .size()
        .rename("bene_day_claim_count")
        .reset_index()
    )

    # A claim is part of a duplicate group if bene_day_claim_count > 1
    counts["is_duplicate"] = counts["bene_day_claim_count"] > 1

    prov_dup = counts.groupby(cfg.id_col, observed=True).agg(
        n_dup_events=("is_duplicate", "sum"),
        n_total_events=("is_duplicate", "count"),
    )
    dup_rate = prov_dup["n_dup_events"] / prov_dup["n_total_events"].clip(lower=1)
    return dup_rate


def build_unified_claims(
    inpatient_df: pd.DataFrame,
    outpatient_df: pd.DataFrame,
    config: SyghtConfig,
) -> pd.DataFrame:
    """Combines inpatient and outpatient claims, computing base claim-level variables."""
    cfg = config

    ip = inpatient_df.copy().assign(is_inpatient=1)
    op = outpatient_df.copy().assign(is_inpatient=0)
    claims = pd.concat([ip, op], ignore_index=True)

    # Convert amounts
    claims[cfg.reimbursed_amt_col] = pd.to_numeric(claims[cfg.reimbursed_amt_col], errors="coerce").fillna(0.0)
    claims[cfg.deductible_amt_col] = pd.to_numeric(claims[cfg.deductible_amt_col], errors="coerce").fillna(0.0)

    # Dates and Durations
    start_dt = pd.to_datetime(claims[cfg.claim_start_col], errors="coerce")
    end_dt = pd.to_datetime(claims[cfg.claim_end_col], errors="coerce")
    claims["claim_duration_days"] = (end_dt - start_dt).dt.days.clip(lower=0).fillna(0.0)

    if cfg.admit_dt_col in claims.columns and cfg.discharge_dt_col in claims.columns:
        admit_dt = pd.to_datetime(claims[cfg.admit_dt_col], errors="coerce")
        discharge_dt = pd.to_datetime(claims[cfg.discharge_dt_col], errors="coerce")
        claims["admit_days"] = (discharge_dt - admit_dt).dt.days.clip(lower=0)
    else:
        claims["admit_days"] = np.nan

    # Counts of diagnosis & procedure codes per claim
    diag_df = claims[cfg.diag_cols].fillna("").astype(str)
    diag_valid = (diag_df != "") & (diag_df != "nan") & (diag_df != "None")
    claims["n_diagnosis_codes"] = diag_valid.sum(axis=1)

    proc_df = claims[cfg.proc_cols].fillna("").astype(str)
    proc_valid = (proc_df != "") & (proc_df != "nan") & (proc_df != "None")
    claims["n_procedure_codes"] = proc_valid.sum(axis=1)

    return claims


def extract_claims_features(claims: pd.DataFrame, config: SyghtConfig) -> pd.DataFrame:
    """Aggregates claim-level variables up to the provider level."""
    cfg = config
    g = claims.groupby(cfg.id_col, observed=True)

    f = pd.DataFrame(index=g.size().index)

    # 1. Volume Features
    f["n_claims"] = g.size()
    f["n_inpatient_claims"] = g["is_inpatient"].sum()
    f["n_outpatient_claims"] = f["n_claims"] - f["n_inpatient_claims"]
    f["inpatient_share"] = (f["n_inpatient_claims"] / f["n_claims"].clip(lower=1)).round(4)
    f["n_unique_beneficiaries"] = g[cfg.bene_id_col].nunique()

    # Physician counts
    if cfg.attending_physician_col in claims.columns:
        f["n_unique_attending_physicians"] = g[cfg.attending_physician_col].apply(
            lambda s: len(set(s.dropna().astype(str).str.strip()) - {"", "nan", "None"})
        )
    else:
        f["n_unique_attending_physicians"] = 0

    if cfg.operating_physician_col in claims.columns:
        f["n_unique_operating_physicians"] = g[cfg.operating_physician_col].apply(
            lambda s: len(set(s.dropna().astype(str).str.strip()) - {"", "nan", "None"})
        )
    else:
        f["n_unique_operating_physicians"] = 0

    if cfg.other_physician_col in claims.columns:
        f["n_unique_other_physicians"] = g[cfg.other_physician_col].apply(
            lambda s: len(set(s.dropna().astype(str).str.strip()) - {"", "nan", "None"})
        )
    else:
        f["n_unique_other_physicians"] = 0

    f["claims_per_beneficiary"] = (f["n_claims"] / f["n_unique_beneficiaries"].clip(lower=1)).round(3)
    f["claims_per_attending_physician"] = (
        f["n_claims"] / f["n_unique_attending_physicians"].clip(lower=1)
    ).round(3)
    f["claims_per_operating_physician"] = (
        f["n_claims"] / f["n_unique_operating_physicians"].clip(lower=1)
    ).round(3)
    f["inpatient_claims_per_beneficiary"] = (
        f["n_inpatient_claims"] / f["n_unique_beneficiaries"].clip(lower=1)
    ).round(3)
    f["outpatient_claims_per_beneficiary"] = (
        f["n_outpatient_claims"] / f["n_unique_beneficiaries"].clip(lower=1)
    ).round(3)

    # 2. Money Features
    amt = cfg.reimbursed_amt_col
    ded = cfg.deductible_amt_col
    f["total_reimbursed"] = g[amt].sum().round(2)
    f["mean_reimbursed"] = g[amt].mean().round(2)
    f["median_reimbursed"] = g[amt].median().round(2)
    f["std_reimbursed"] = g[amt].std().fillna(0.0).round(2)
    f["max_reimbursed"] = g[amt].max().round(2)
    f["p90_reimbursed"] = g[amt].quantile(0.90).round(2)
    f["p99_reimbursed"] = g[amt].quantile(0.99).round(2)
    f["total_deductible"] = g[ded].sum().round(2)
    f["mean_deductible"] = g[ded].mean().round(2)
    f["max_deductible"] = g[ded].max().round(2)
    f["deductible_to_reimbursement_ratio"] = (
        f["total_deductible"] / f["total_reimbursed"].clip(lower=1.0)
    ).round(4)
    f["reimbursed_per_beneficiary"] = (f["total_reimbursed"] / f["n_unique_beneficiaries"].clip(lower=1)).round(2)
    f["reimbursed_per_attending_physician"] = (
        f["total_reimbursed"] / f["n_unique_attending_physicians"].clip(lower=1)
    ).round(2)

    # Separate inpatient vs outpatient average reimbursement
    ip_subset = claims[claims["is_inpatient"] == 1]
    op_subset = claims[claims["is_inpatient"] == 0]
    f["mean_reimbursed_inpatient"] = ip_subset.groupby(cfg.id_col, observed=True)[amt].mean()
    f["mean_reimbursed_outpatient"] = op_subset.groupby(cfg.id_col, observed=True)[amt].mean()

    # 3. Behaviour Features
    f["mean_claim_duration_days"] = g["claim_duration_days"].mean().round(2)
    f["mean_admit_days"] = g["admit_days"].mean().round(2)
    f["std_admit_days"] = g["admit_days"].std().fillna(0.0).round(2)
    f["max_admit_days"] = g["admit_days"].max().round(2)

    # Length of Stay Coefficient of Variation (ip_cv_los)
    f["ip_cv_los"] = (f["std_admit_days"] / (f["mean_admit_days"] + 1e-6)).round(4)

    f["pct_claims_zero_duration"] = g["claim_duration_days"].apply(lambda s: float((s == 0).mean())).round(4)

    if cfg.attending_physician_col in claims.columns:
        f["pct_claims_missing_attending"] = g[cfg.attending_physician_col].apply(
            lambda s: float((s.isna() | (s.astype(str).str.strip() == "")).mean())
        ).round(4)
        f["top_physician_concentration"] = g[cfg.attending_physician_col].apply(compute_concentration).round(4)
    else:
        f["pct_claims_missing_attending"] = 1.0
        f["top_physician_concentration"] = 0.0

    if cfg.operating_physician_col in claims.columns:
        f["pct_claims_with_operating_physician"] = g[cfg.operating_physician_col].apply(
            lambda s: float((s.notna() & (s.astype(str).str.strip() != "")).mean())
        ).round(4)
    else:
        f["pct_claims_with_operating_physician"] = 0.0

    if cfg.other_physician_col in claims.columns:
        f["pct_claims_with_other_physician"] = g[cfg.other_physician_col].apply(
            lambda s: float((s.notna() & (s.astype(str).str.strip() != "")).mean())
        ).round(4)
    else:
        f["pct_claims_with_other_physician"] = 0.0

    f["mean_n_diagnosis_codes"] = g["n_diagnosis_codes"].mean().round(2)
    f["mean_n_procedure_codes"] = g["n_procedure_codes"].mean().round(2)
    f["pct_claims_with_procedure"] = g["n_procedure_codes"].apply(lambda s: float((s > 0).mean())).round(4)

    # Distinct diagnosis and procedure counts across provider
    valid_diag_cols = [c for c in cfg.diag_cols if c in claims.columns]
    if valid_diag_cols:
        f["unique_diagnosis_count"] = g.apply(
            lambda sub: len(set(sub[valid_diag_cols].values.ravel()) - {"", "nan", "None", np.nan})
        )
    else:
        f["unique_diagnosis_count"] = 0

    valid_proc_cols = [c for c in cfg.proc_cols if c in claims.columns]
    if valid_proc_cols:
        f["unique_procedure_count"] = g.apply(
            lambda sub: len(set(sub[valid_proc_cols].values.ravel()) - {"", "nan", "None", np.nan})
        )
    else:
        f["unique_procedure_count"] = 0

    if "ClmDiagnosisCode_1" in claims.columns:
        f["top_diagnosis_concentration"] = g["ClmDiagnosisCode_1"].apply(compute_concentration).round(4)
    else:
        f["top_diagnosis_concentration"] = 0.0

    # Same-day duplicate beneficiary billing rate
    f["pct_duplicate_bene_claims_same_day"] = compute_duplicate_same_day_billing(claims, cfg).round(4)

    return f


def extract_patient_mix_features(
    claims: pd.DataFrame,
    beneficiary_df: pd.DataFrame,
    config: SyghtConfig,
) -> pd.DataFrame:
    """Aggregates beneficiary traits (age, mortality, chronic condition load) to provider level."""
    cfg = config
    bene = beneficiary_df.copy()

    # Reference date for patient age computation (Medicare 2009-2010 study period)
    ref_date = pd.Timestamp("2009-12-01")
    dob = pd.to_datetime(bene["DOB"], errors="coerce")
    bene["patient_age"] = ((ref_date - dob).dt.days / 365.25).clip(lower=0, upper=120)

    # Mortality indicator
    dod = pd.to_datetime(bene["DOD"], errors="coerce")
    bene["is_deceased"] = dod.notna().astype(int)

    # Chronic conditions count (1 = Yes, 2 = No)
    chronic_matrix = bene[cfg.chronic_cols].apply(pd.to_numeric, errors="coerce")
    bene["mean_chronic_conditions"] = (chronic_matrix == 1).sum(axis=1)

    # Specific chronic condition rates
    if "ChronicCond_Diabetes" in bene.columns:
        bene["has_diabetes"] = (pd.to_numeric(bene["ChronicCond_Diabetes"], errors="coerce") == 1).astype(int)
    else:
        bene["has_diabetes"] = 0

    if "ChronicCond_Heartfailure" in bene.columns:
        bene["has_heartfailure"] = (pd.to_numeric(bene["ChronicCond_Heartfailure"], errors="coerce") == 1).astype(int)
    else:
        bene["has_heartfailure"] = 0

    # Renal disease flag
    if "RenalDiseaseIndicator" in bene.columns:
        bene["pct_renal_disease"] = (bene["RenalDiseaseIndicator"].astype(str).str.strip().str.upper() == "Y").astype(int)
    else:
        bene["pct_renal_disease"] = 0

    # Annual amounts
    for col in cfg.bene_annual_cols:
        if col in bene.columns:
            bene[col] = pd.to_numeric(bene[col], errors="coerce").fillna(0.0)

    keep_cols = [
        cfg.bene_id_col,
        "patient_age",
        "is_deceased",
        "mean_chronic_conditions",
        "has_diabetes",
        "has_heartfailure",
        "pct_renal_disease",
        "IPAnnualReimbursementAmt",
        "IPAnnualDeductibleAmt",
        "OPAnnualReimbursementAmt",
        "OPAnnualDeductibleAmt",
    ]
    if "State" in bene.columns:
        keep_cols.append("State")
    if "County" in bene.columns:
        keep_cols.append("County")

    available_keep_cols = [c for c in keep_cols if c in bene.columns]

    # Link claims to beneficiary attributes
    prov_bene_link = claims[[cfg.id_col, cfg.bene_id_col]].drop_duplicates()
    merged = prov_bene_link.merge(bene[available_keep_cols], on=cfg.bene_id_col, how="left")

    g = merged.groupby(cfg.id_col, observed=True)
    f = pd.DataFrame(index=g.size().index)

    f["mean_patient_age"] = g["patient_age"].mean().round(1)
    f["std_patient_age"] = g["patient_age"].std().fillna(0.0).round(2)
    f["pct_patients_deceased"] = g["is_deceased"].mean().round(4)
    f["mean_chronic_conditions"] = g["mean_chronic_conditions"].mean().round(2)
    f["pct_renal_disease"] = g["pct_renal_disease"].mean().round(4)
    f["mean_chronic_diabetes_rate"] = g["has_diabetes"].mean().round(4)
    f["mean_chronic_heartfailure_rate"] = g["has_heartfailure"].mean().round(4)
    f["mean_ip_annual_reimbursement"] = g["IPAnnualReimbursementAmt"].mean().round(2)
    f["mean_ip_annual_deductible"] = g["IPAnnualDeductibleAmt"].mean().round(2)
    f["mean_op_annual_reimbursement"] = g["OPAnnualReimbursementAmt"].mean().round(2)
    f["mean_op_annual_deductible"] = g["OPAnnualDeductibleAmt"].mean().round(2)

    if "State" in merged.columns:
        f["n_states_served"] = g["State"].nunique()
    else:
        f["n_states_served"] = 1

    if "County" in merged.columns:
        f["n_counties_served"] = g["County"].nunique()
    else:
        f["n_counties_served"] = 1

    return f


def build_provider_features(
    labels_df: pd.DataFrame,
    beneficiary_df: pd.DataFrame,
    inpatient_df: pd.DataFrame,
    outpatient_df: pd.DataFrame,
    config: Optional[SyghtConfig] = None,
) -> pd.DataFrame:
    """
    Main feature engineering entry point: Transforms the four Medicare tables
    into a single provider-level feature table.

    Returns:
        DataFrame with one row per provider, containing engineered features,
        financial exposure, and target label (if present).
    """
    cfg = config or SyghtConfig()
    logger.info("Starting provider feature engineering...")

    claims = build_unified_claims(inpatient_df, outpatient_df, cfg)
    claim_feats = extract_claims_features(claims, cfg)
    patient_feats = extract_patient_mix_features(claims, beneficiary_df, cfg)

    # Join claim and patient mix features
    all_feats = claim_feats.join(patient_feats, how="outer").reset_index()

    # Join with provider spine
    spine_cols = [cfg.id_col]
    has_labels = (cfg.target_col in labels_df.columns) or ("fraud" in labels_df.columns)

    if has_labels:
        clean_labels = derive_fraud_label(labels_df, cfg.target_col, cfg.positive_label, output_col="fraud")
        spine = clean_labels[[cfg.id_col, "fraud"]].drop_duplicates(subset=[cfg.id_col])
    else:
        spine = labels_df[[cfg.id_col]].drop_duplicates(subset=[cfg.id_col])

    # Left join onto spine so every provider in the label file is retained
    provider_df = spine.merge(all_feats, on=cfg.id_col, how="left")

    # Financial exposure definition (total money reimbursed)
    if "total_reimbursed" in provider_df.columns:
        provider_df["exposure_amount"] = provider_df["total_reimbursed"].fillna(0.0)
    else:
        provider_df["exposure_amount"] = 0.0

    # Ensure all engineered features exist in the DataFrame
    for feat_col in cfg.all_features:
        if feat_col not in provider_df.columns:
            provider_df[feat_col] = np.nan

    logger.info(
        "Feature engineering complete: %d providers, %d features",
        len(provider_df),
        len(cfg.all_features),
    )
    return provider_df
