"""
Split Module: Leakage-safe provider partitioning for training, validation, and testing.
"""

from __future__ import annotations

import logging
from typing import Iterator, Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold, train_test_split

from ml_pipeline.config import SyghtConfig

logger = logging.getLogger(__name__)


def check_split_leakage(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    id_col: str = "Provider",
) -> None:
    """
    Verifies that no provider identifier appears in both train and test partitions.

    Raises:
        RuntimeError: If any provider ID overlaps between partitions.
    """
    train_ids = set(train_df[id_col].dropna().unique())
    test_ids = set(test_df[id_col].dropna().unique())
    overlap = train_ids & test_ids

    if overlap:
        sample_leaked = list(overlap)[:5]
        raise RuntimeError(
            f"CRITICAL DATA LEAKAGE: {len(overlap)} provider IDs appear in both partitions! "
            f"Examples: {sample_leaked}. Partitions must be completely disjoint."
        )


def create_provider_split(
    provider_features_df: pd.DataFrame,
    test_size: float = 0.20,
    seed: int = 42,
    stratify_col: str = "fraud",
    id_col: str = "Provider",
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Partitions the provider feature matrix into frozen train and test sets,
    preserving class balance via stratification.

    Enforces zero provider leakage across splits.
    """
    df = provider_features_df.copy()

    if stratify_col in df.columns:
        stratify = df[stratify_col]
    else:
        stratify = None
        logger.warning("Stratify column '%s' not found. Performing unstratified split.", stratify_col)

    train_df, test_df = train_test_split(
        df,
        test_size=test_size,
        random_state=seed,
        stratify=stratify,
    )

    train_df = train_df.reset_index(drop=True)
    test_df = test_df.reset_index(drop=True)

    # Enforce leakage check
    check_split_leakage(train_df, test_df, id_col=id_col)

    logger.info(
        "Created provider split: Train=%d providers, Test=%d providers (test_size=%.2f)",
        len(train_df),
        len(test_df),
        test_size,
    )
    if stratify_col in df.columns:
        logger.info(
            "Fraud rates: Train=%.2f%%, Test=%.2f%%",
            train_df[stratify_col].mean() * 100,
            test_df[stratify_col].mean() * 100,
        )

    return train_df, test_df


def get_stratified_cv_splits(
    train_df: pd.DataFrame,
    n_splits: int = 5,
    seed: int = 42,
    stratify_col: str = "fraud",
    id_col: str = "Provider",
) -> Iterator[Tuple[np.ndarray, np.ndarray]]:
    """
    Generates cross-validation fold indices for the training partition.
    Verifies that no provider leaks between fold train and validation splits.
    """
    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=seed)
    y = train_df[stratify_col].to_numpy() if stratify_col in train_df.columns else np.zeros(len(train_df))

    for fold_idx, (tr_idx, val_idx) in enumerate(skf.split(train_df, y)):
        tr_df = train_df.iloc[tr_idx]
        val_df = train_df.iloc[val_idx]
        check_split_leakage(tr_df, val_df, id_col=id_col)
        yield tr_idx, val_idx
