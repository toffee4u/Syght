"""
Tests for Medicare Simulator Module.
"""

from ml_pipeline.config import SyghtConfig
from ml_pipeline.medicare_simulator import generate_simulated_medicare_data, generate_synthetic_medicare_data


def test_generate_simulated_medicare_data_schemas():
    cfg = SyghtConfig()
    labels, bene, ip, op = generate_simulated_medicare_data(n_providers=30, n_beneficiaries=80, seed=123)

    # 1. Labels DataFrame
    assert len(labels) == 30
    assert cfg.id_col in labels.columns
    assert cfg.target_col in labels.columns
    assert set(labels[cfg.target_col].unique()) <= {cfg.positive_label, "No"}

    # 2. Beneficiaries DataFrame
    assert len(bene) == 80
    assert cfg.bene_id_col in bene.columns
    for c in cfg.chronic_cols:
        assert c in bene.columns
        assert set(bene[c].unique()) <= {1, 2}

    # 3. Claims DataFrames
    assert len(ip) > 0
    assert len(op) > 0
    assert cfg.id_col in ip.columns
    assert cfg.bene_id_col in ip.columns
    assert cfg.claim_id_col in ip.columns
    assert cfg.reimbursed_amt_col in ip.columns
    assert cfg.admit_dt_col in ip.columns
    assert cfg.discharge_dt_col in ip.columns


def test_medicare_simulator_backward_compatibility():
    # Test backward compatibility alias
    labels, bene, ip, op = generate_synthetic_medicare_data(n_providers=10, n_beneficiaries=20, seed=42)
    assert len(labels) == 10
