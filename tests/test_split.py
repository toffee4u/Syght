"""
Tests for Split Module.
"""

import pandas as pd
import pytest

from ml_pipeline.split import check_split_leakage, create_provider_split, get_stratified_cv_splits


def test_create_provider_split_disjoint():
    df = pd.DataFrame({
        "Provider": [f"PRV{i}" for i in range(100)],
        "fraud": [1 if i % 10 == 0 else 0 for i in range(100)],
        "feature_1": range(100),
    })

    train_df, test_df = create_provider_split(df, test_size=0.20, seed=42)

    assert len(train_df) == 80
    assert len(test_df) == 20

    # Leakage check must pass without exception
    check_split_leakage(train_df, test_df, id_col="Provider")


def test_check_split_leakage_raises_on_overlap():
    train_df = pd.DataFrame({"Provider": ["P1", "P2", "P3"]})
    test_df = pd.DataFrame({"Provider": ["P3", "P4", "P5"]})  # P3 overlaps!

    with pytest.raises(RuntimeError, match="CRITICAL DATA LEAKAGE"):
        check_split_leakage(train_df, test_df, id_col="Provider")


def test_stratified_cv_splits():
    df = pd.DataFrame({
        "Provider": [f"PRV{i}" for i in range(60)],
        "fraud": [1 if i % 6 == 0 else 0 for i in range(60)],
    })

    folds = list(get_stratified_cv_splits(df, n_splits=3, seed=42))
    assert len(folds) == 3

    for tr_idx, val_idx in folds:
        tr_df = df.iloc[tr_idx]
        val_df = df.iloc[val_idx]
        assert len(set(tr_df["Provider"]) & set(val_df["Provider"])) == 0
