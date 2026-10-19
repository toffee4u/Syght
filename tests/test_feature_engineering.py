"""
Tests for Feature Engineering Module.
"""

from ml_pipeline.config import SyghtConfig
from ml_pipeline.feature_engineering import build_provider_features
from ml_pipeline.medicare_simulator import generate_simulated_medicare_data


def test_build_provider_features_structure():
    cfg = SyghtConfig()
    labels, bene, ip, op = generate_simulated_medicare_data(n_providers=40, n_beneficiaries=120, seed=42)

    prov_df = build_provider_features(labels, bene, ip, op, config=cfg)

    # 1. Must have one row per provider
    assert len(prov_df) == 40
    assert prov_df[cfg.id_col].nunique() == 40

    # 2. Must contain all defined features
    for feat in cfg.all_features:
        assert feat in prov_df.columns, f"Missing feature {feat}"

    # 3. Must contain target column 'fraud'
    assert "fraud" in prov_df.columns
    assert set(prov_df["fraud"].unique()) <= {0, 1}

    # 4. Must contain exposure_amount
    assert "exposure_amount" in prov_df.columns
    assert (prov_df["exposure_amount"] >= 0).all()

    # 5. Ethical safeguard: Gender and Race must NOT be present in feature set
    for sensitive_col in cfg.protected_bene_cols:
        assert sensitive_col not in prov_df.columns, f"Sensitive demographic column '{sensitive_col}' leaked into features!"


def test_build_provider_features_unlabelled_mode():
    cfg = SyghtConfig()
    labels, bene, ip, op = generate_simulated_medicare_data(n_providers=20, n_beneficiaries=60, seed=42)
    unlabelled_labels = labels[[cfg.id_col]].copy()  # No PotentialFraud column

    prov_df = build_provider_features(unlabelled_labels, bene, ip, op, config=cfg)

    assert len(prov_df) == 20
    assert "fraud" not in prov_df.columns
    assert "total_reimbursed" in prov_df.columns
    assert "ip_cv_los" in prov_df.columns
