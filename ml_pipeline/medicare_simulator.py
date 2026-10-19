"""
Medicare Data Simulator: Generates realistic Medicare-schema datasets for offline testing,
unit tests, and local pipeline verification without downloading Kaggle data.

CRITICAL NOTICE: Simulated data is strictly for pipeline testing and code validation.
No benchmark metric or research conclusion should be derived from simulated data.
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict, Optional, Tuple, Union

import numpy as np
import pandas as pd

from ml_pipeline.config import SyghtConfig


def generate_simulated_medicare_data(
    n_providers: int = 250,
    n_beneficiaries: int = 1000,
    seed: int = 42,
    config: Optional[SyghtConfig] = None,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Generates four simulated DataFrames matching the exact column names,
    types, and realistic relationships of the CMS Medicare dataset.

    Returns:
        (labels_df, beneficiary_df, inpatient_df, outpatient_df)
    """
    cfg = config or SyghtConfig()
    rng = np.random.default_rng(seed)

    # 1. Providers and Latent Traits
    providers = [f"PRV{50000 + i}" for i in range(n_providers)]

    # Latent traits governing behavior and noisy fraud label
    latent_inflation = rng.normal(0, 1, n_providers)
    latent_dup_rate = rng.normal(0, 1, n_providers)
    latent_doc_conc = rng.normal(0, 1, n_providers)
    latent_size = rng.normal(0, 1, n_providers)

    # Probabilistic fraud generation (~9-10% base rate)
    logit = (
        -2.4
        + 1.10 * latent_inflation
        + 0.90 * latent_dup_rate
        + 0.70 * latent_doc_conc
        + 0.25 * latent_size
        + rng.normal(0, 0.5, n_providers)
    )
    prob_fraud = 1.0 / (1.0 + np.exp(-logit))
    fraud_flags = rng.random(n_providers) < prob_fraud

    labels_df = pd.DataFrame({
        cfg.id_col: providers,
        cfg.target_col: np.where(fraud_flags, cfg.positive_label, "No"),
    })

    # 2. Beneficiaries
    bene_ids = [f"BENE{10000 + i}" for i in range(n_beneficiaries)]
    dob_base = pd.Timestamp("1925-01-01")
    dob_days = rng.integers(0, 22000, n_beneficiaries)
    dobs = [dob_base + pd.Timedelta(days=int(d)) for d in dob_days]

    # Deceased beneficiaries (~2.5%)
    is_dead = rng.random(n_beneficiaries) < 0.025
    dods = [
        (pd.Timestamp("2009-01-01") + pd.Timedelta(days=int(rng.integers(0, 365)))).strftime("%Y-%m-%d")
        if dead else np.nan
        for dead in is_dead
    ]

    bene_dict: Dict[str, Union[list, np.ndarray]] = {
        cfg.bene_id_col: bene_ids,
        "DOB": [d.strftime("%Y-%m-%d") for d in dobs],
        "DOD": dods,
        "Gender": rng.integers(1, 3, n_beneficiaries),
        "Race": rng.choice([1, 2, 3, 5], n_beneficiaries, p=[0.80, 0.12, 0.04, 0.04]),
        "RenalDiseaseIndicator": np.where(rng.random(n_beneficiaries) < 0.12, "Y", "0"),
        "State": rng.integers(1, 55, n_beneficiaries),
        "County": rng.integers(1, 900, n_beneficiaries),
        "NoOfMonths_PartACov": rng.choice([12, 11, 10], n_beneficiaries, p=[0.94, 0.03, 0.03]),
        "NoOfMonths_PartBCov": rng.choice([12, 11, 10], n_beneficiaries, p=[0.94, 0.03, 0.03]),
    }

    # Chronic condition flags (1 = Yes, 2 = No in CMS dataset)
    for c in cfg.chronic_cols:
        bene_dict[c] = rng.choice([1, 2], n_beneficiaries, p=[0.42, 0.58])

    bene_dict["IPAnnualReimbursementAmt"] = np.round(rng.gamma(1.5, 3800, n_beneficiaries), 0)
    bene_dict["IPAnnualDeductibleAmt"] = np.round(rng.gamma(1.2, 520, n_beneficiaries), 0)
    bene_dict["OPAnnualReimbursementAmt"] = np.round(rng.gamma(1.6, 950, n_beneficiaries), 0)
    bene_dict["OPAnnualDeductibleAmt"] = np.round(rng.gamma(1.3, 270, n_beneficiaries), 0)

    beneficiary_df = pd.DataFrame(bene_dict)

    # 3. Claims generation
    ip_rows = []
    op_rows = []
    claim_counter = 100000

    # Physician pool
    all_physicians = [f"PHY{300000 + i}" for i in range(1200)]

    for idx, prov in enumerate(providers):
        # Claim volume scale driven by provider size trait
        n_claims = int(np.clip(np.exp(3.8 + 0.50 * latent_size[idx] + rng.normal(0, 0.3)), 5, 350))
        # Inpatient claim share (0% to 50%)
        n_inpatient = int(n_claims * np.clip(rng.normal(0.18, 0.08), 0.02, 0.50))
        amt_multiplier = float(np.exp(0.55 * latent_inflation[idx] + rng.normal(0, 0.1)))

        # Physician concentration
        doc_pool_size = max(1, int(n_claims / np.clip(np.exp(1.5 + 0.8 * latent_doc_conc[idx]), 1.5, 40)))
        prov_docs = rng.choice(all_physicians, size=min(len(all_physicians), doc_pool_size), replace=False)
        doc_weights = rng.dirichlet(np.full(len(prov_docs), float(np.clip(np.exp(-0.8 * latent_doc_conc[idx]), 0.05, 8.0))))

        # Patient pool
        patient_pool_size = max(2, int(n_claims / np.clip(np.exp(0.70 * latent_dup_rate[idx]), 0.8, 10)))
        prov_benes = rng.choice(bene_ids, size=min(len(bene_ids), patient_pool_size), replace=False)

        for k in range(n_claims):
            claim_counter += 1
            is_ip = (k < n_inpatient)
            start_date = pd.Timestamp("2009-01-01") + pd.Timedelta(days=int(rng.integers(0, 650)))
            duration = int(rng.integers(1, 14)) if is_ip else int(rng.integers(0, 3))
            end_date = start_date + pd.Timedelta(days=duration)

            reimb_amt = np.round(
                (rng.gamma(2.5, 3500) if is_ip else rng.gamma(1.8, 280)) * amt_multiplier, 0
            )
            deduct_amt = np.round(1068.0 if is_ip else rng.choice([0.0, 50.0, 100.0], p=[0.7, 0.2, 0.1]), 0)

            doc = str(rng.choice(prov_docs, p=doc_weights))
            op_doc = str(rng.choice(prov_docs)) if rng.random() < 0.4 else ""
            oth_doc = str(rng.choice(prov_docs)) if rng.random() < 0.3 else ""

            row = {
                cfg.id_col: prov,
                cfg.bene_id_col: str(rng.choice(prov_benes)),
                cfg.claim_id_col: f"CLM{claim_counter}",
                cfg.claim_start_col: start_date.strftime("%Y-%m-%d"),
                cfg.claim_end_col: end_date.strftime("%Y-%m-%d"),
                cfg.reimbursed_amt_col: reimb_amt,
                cfg.deductible_amt_col: deduct_amt,
                cfg.attending_physician_col: doc,
                cfg.operating_physician_col: op_doc,
                cfg.other_physician_col: oth_doc,
            }

            # Add diagnosis & procedure codes
            n_diag = rng.integers(1, 6)
            for d_idx in range(1, 11):
                col_name = f"ClmDiagnosisCode_{d_idx}"
                row[col_name] = f"D{rng.integers(100, 999)}" if d_idx <= n_diag else ""

            n_proc = rng.integers(0, 4) if is_ip else (1 if rng.random() < 0.15 else 0)
            for p_idx in range(1, 7):
                col_name = f"ClmProcedureCode_{p_idx}"
                row[col_name] = f"P{rng.integers(1000, 9999)}" if p_idx <= n_proc else ""

            if is_ip:
                row[cfg.admit_dt_col] = start_date.strftime("%Y-%m-%d")
                row[cfg.discharge_dt_col] = end_date.strftime("%Y-%m-%d")
                ip_rows.append(row)
            else:
                op_rows.append(row)

    inpatient_df = pd.DataFrame(ip_rows)
    outpatient_df = pd.DataFrame(op_rows)

    return labels_df, beneficiary_df, inpatient_df, outpatient_df


def save_simulated_dataset_files(
    output_dir: Union[str, Path],
    n_providers: int = 250,
    n_beneficiaries: int = 1000,
    seed: int = 42,
) -> Dict[str, Path]:
    """
    Saves generated simulated DataFrames to CSV files matching the Kaggle timestamp naming convention.
    """
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    labels, bene, ip, op = generate_simulated_medicare_data(
        n_providers=n_providers,
        n_beneficiaries=n_beneficiaries,
        seed=seed,
    )

    stamp = "1542865627584"
    files = {
        "labels": out_path / f"Train-{stamp}.csv",
        "beneficiary": out_path / f"Train_Beneficiarydata-{stamp}.csv",
        "inpatient": out_path / f"Train_Inpatientdata-{stamp}.csv",
        "outpatient": out_path / f"Train_Outpatientdata-{stamp}.csv",
    }

    labels.to_csv(files["labels"], index=False)
    bene.to_csv(files["beneficiary"], index=False)
    ip.to_csv(files["inpatient"], index=False)
    op.to_csv(files["outpatient"], index=False)

    return files


# Backward compatibility aliases
generate_synthetic_medicare_data = generate_simulated_medicare_data
save_synthetic_dataset_files = save_simulated_dataset_files
