"""
Data Ingestion Module: Safe file loading, schema validation, and label derivation
for raw healthcare provider claims data.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Dict, Optional, Tuple, Union

import numpy as np
import pandas as pd

from ml_pipeline.config import SyghtConfig

logger = logging.getLogger(__name__)


def find_raw_file(
    directory: Union[str, Path],
    pattern: str,
    exclude_prefixes: Tuple[str, ...] = ("Test_", "Test-"),
) -> Path:
    """
    Locates exactly one file matching pattern in directory, safely excluding
    unlabelled test files.

    Raises:
        FileNotFoundError: If no matching file is found.
        RuntimeError: If multiple ambiguous matches are found.
    """
    dir_path = Path(directory)
    if not dir_path.exists():
        raise FileNotFoundError(f"Directory does not exist: {dir_path}")

    matches = [
        p for p in sorted(dir_path.glob(pattern))
        if not p.name.startswith(exclude_prefixes)
    ]

    if not matches:
        raise FileNotFoundError(
            f"No file matching pattern '{pattern}' found in {dir_path} (excluding prefixes {exclude_prefixes})."
        )
    if len(matches) > 1:
        match_names = ", ".join(m.name for m in matches)
        raise RuntimeError(
            f"Ambiguous file match: pattern '{pattern}' matched multiple files in {dir_path}: [{match_names}]. "
            "Please ensure only one matching file exists per role."
        )

    return matches[0]


def read_csv_safe(file_path: Union[str, Path]) -> pd.DataFrame:
    """
    Reads a CSV file preserving string categories without silent conversion
    of strings like 'None' or 'NA' to NaN. Empty strings are treated as NaN.
    """
    path = Path(file_path)
    if not path.is_file():
        raise FileNotFoundError(f"File not found: {path}")

    return pd.read_csv(
        path,
        keep_default_na=False,
        na_values=[""],
        low_memory=False,
    )


def derive_fraud_label(
    df: pd.DataFrame,
    target_col: str = "PotentialFraud",
    positive_label: str = "Yes",
    output_col: str = "fraud",
) -> pd.DataFrame:
    """
    Converts heterogeneous fraud label representations (string 'Yes'/'No',
    integers 0/1, booleans, string '1'/'0', 'True'/'False') into clean Int8 0/1.

    Fails loudly with an informative ValueError if an unexpected encoding or
    value range is discovered, preventing silent label corruption.
    """
    if target_col not in df.columns:
        if output_col in df.columns:
            # Already derived
            return df
        raise KeyError(f"Target column '{target_col}' not found in DataFrame columns: {list(df.columns)}")

    col = df[target_col]
    result_df = df.copy()

    # Boolean dtype
    if pd.api.types.is_bool_dtype(col):
        result_df[output_col] = col.astype(int)
        return result_df

    # Numeric dtype
    if pd.api.types.is_numeric_dtype(col):
        unique_vals = set(col.dropna().unique())
        if unique_vals <= {0, 1}:
            result_df[output_col] = col.astype(int)
            return result_df
        raise ValueError(
            f"Numeric label column '{target_col}' contains invalid values outside {{0, 1}}: {sorted(unique_vals)}"
        )

    # String / Object dtype
    if pd.api.types.is_object_dtype(col) or pd.api.types.is_string_dtype(col):
        clean_col = col.astype(str).str.strip()
        unique_vals = set(clean_col.unique())

        if unique_vals <= {"Yes", "No"}:
            result_df[output_col] = (clean_col == positive_label).astype(int)
            return result_df
        if unique_vals <= {"1", "0"}:
            result_df[output_col] = (clean_col == "1").astype(int)
            return result_df
        if unique_vals <= {"True", "False"}:
            result_df[output_col] = (clean_col == "True").astype(int)
            return result_df

        raise ValueError(
            f"Text label column '{target_col}' contains unrecognized values: {sorted(unique_vals)}. "
            "Supported encodings: ['Yes', 'No'], ['1', '0'], ['True', 'False']."
        )

    raise TypeError(f"Target column '{target_col}' has unsupported dtype: {col.dtype}")


def validate_raw_tables(
    labels: pd.DataFrame,
    beneficiary: pd.DataFrame,
    inpatient: pd.DataFrame,
    outpatient: pd.DataFrame,
    config: Optional[SyghtConfig] = None,
) -> Dict[str, Union[bool, str, int]]:
    """
    Validates structural presence of critical schema columns across all four tables.
    """
    cfg = config or SyghtConfig()

    required_cols = {
        "labels": [cfg.id_col],
        "beneficiary": [cfg.bene_id_col] + cfg.chronic_cols,
        "inpatient": [cfg.id_col, cfg.bene_id_col, cfg.claim_id_col, cfg.reimbursed_amt_col],
        "outpatient": [cfg.id_col, cfg.bene_id_col, cfg.claim_id_col, cfg.reimbursed_amt_col],
    }

    tables = {
        "labels": labels,
        "beneficiary": beneficiary,
        "inpatient": inpatient,
        "outpatient": outpatient,
    }

    missing_info = {}
    for table_name, req_cols in required_cols.items():
        table_df = tables[table_name]
        missing = [c for c in req_cols if c not in table_df.columns]
        if missing:
            missing_info[table_name] = missing

    if missing_info:
        raise ValueError(
            f"Schema validation failed. Missing required columns in tables: {missing_info}"
        )

    return {
        "is_valid": True,
        "n_labels": len(labels),
        "n_beneficiaries": len(beneficiary),
        "n_inpatient_claims": len(inpatient),
        "n_outpatient_claims": len(outpatient),
    }


def load_raw_tables(
    raw_dir: Union[str, Path],
    config: Optional[SyghtConfig] = None,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Resolves, reads, and validates the four raw CSV tables from the raw data directory.
    """
    cfg = config or SyghtConfig()
    dir_path = Path(raw_dir)

    labels_file = find_raw_file(dir_path, cfg.file_patterns["labels"], cfg.exclude_prefixes)
    bene_file = find_raw_file(dir_path, cfg.file_patterns["beneficiary"], cfg.exclude_prefixes)
    ip_file = find_raw_file(dir_path, cfg.file_patterns["inpatient"], cfg.exclude_prefixes)
    op_file = find_raw_file(dir_path, cfg.file_patterns["outpatient"], cfg.exclude_prefixes)

    logger.info("Loading raw files from %s...", dir_path)
    labels = read_csv_safe(labels_file)
    beneficiary = read_csv_safe(bene_file)
    inpatient = read_csv_safe(ip_file)
    outpatient = read_csv_safe(op_file)

    validate_raw_tables(labels, beneficiary, inpatient, outpatient, cfg)
    return labels, beneficiary, inpatient, outpatient
