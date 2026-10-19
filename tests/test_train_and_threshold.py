"""
Tests for Training, Model Selection, and Threshold Modules.
"""

import numpy as np
import pandas as pd

from ml_pipeline.config import SyghtConfig
from ml_pipeline.feature_engineering import build_provider_features
from ml_pipeline.medicare_simulator import generate_simulated_medicare_data
from ml_pipeline.threshold import find_max_f1_threshold, select_validation_threshold, sweep_cost_curve
from ml_pipeline.train import (
    RuleBaselineClassifier,
    evaluate_cv_candidates,
    fit_final_model,
    run_feature_ablation,
)


def test_rule_baseline_classifier():
    df = pd.DataFrame({"n_claims": [10, 50, 100, 200]})
    rule = RuleBaselineClassifier("n_claims").fit(df)
    probs = rule.predict_proba(df)[:, 1]

    assert len(probs) == 4
    # Monotonically increasing risk with claims
    assert probs[0] < probs[1] < probs[2] < probs[3]


def test_evaluate_cv_candidates_and_selection():
    cfg = SyghtConfig()
    cfg.cv_n_splits = 3  # Fast test
    labels, bene, ip, op = generate_simulated_medicare_data(n_providers=60, n_beneficiaries=150, seed=42)
    prov_df = build_provider_features(labels, bene, ip, op, config=cfg)

    features = cfg.all_features[:10]  # Subset for fast test

    summary, oof_df, selection_meta = evaluate_cv_candidates(prov_df, features, config=cfg)

    assert len(summary) >= 4
    assert "pr_auc_mean" in summary.columns
    assert "selected_model" in selection_meta
    assert len(oof_df) == len(prov_df)

    # Test fitting final model
    prep, model = fit_final_model(prov_df, features, selection_meta["selected_model"], config=cfg)
    assert prep is not None
    assert model is not None


def test_threshold_selection_on_oof():
    cfg = SyghtConfig()
    y_true = np.array([0, 0, 0, 1, 0, 1, 1, 0, 0, 1])
    y_prob = np.array([0.1, 0.2, 0.3, 0.8, 0.2, 0.7, 0.9, 0.4, 0.1, 0.85])

    thresh, max_f1 = find_max_f1_threshold(y_true, y_prob)
    assert 0.0 < thresh < 1.0
    assert 0.0 < max_f1 <= 1.0

    oof_df = pd.DataFrame({
        "Provider": [f"P{i}" for i in range(10)],
        "fraud": y_true,
        "exposure_amount": np.full(10, 10000.0),
        "p_TestModel": y_prob,
    })

    thresh_meta = select_validation_threshold(oof_df, "TestModel", config=cfg)
    assert "cost_optimal_threshold" in thresh_meta
    assert "max_f1_threshold" in thresh_meta
    assert len(thresh_meta["sensitivity_table"]) > 0


def test_feature_ablation_and_xgboost():
    cfg = SyghtConfig()
    cfg.cv_n_splits = 3
    labels, bene, ip, op = generate_simulated_medicare_data(n_providers=40, n_beneficiaries=100, seed=42)
    prov_df = build_provider_features(labels, bene, ip, op, config=cfg)

    # 1. Feature Ablation
    ablation_df = run_feature_ablation(prov_df, base_model_name="RandomForest", config=cfg)
    assert len(ablation_df) >= 4
    assert "feature_subset" in ablation_df.columns
    assert "pr_auc_mean" in ablation_df.columns

    # 2. XGBoost and LightGBM model fitting and SHAP explainer
    features = cfg.all_features[:8]
    prep, xgb_model = fit_final_model(prov_df, features, "XGBoost", config=cfg)
    assert xgb_model is not None

    from ml_pipeline.explain import SyghtExplainer
    explainer = SyghtExplainer(xgb_model, prep, features, background_sample=prov_df.head(10))
    imp_df = explainer.compute_global_importance(prov_df.head(10), top_n=5)
    assert len(imp_df) <= 5
    assert "importance" in imp_df.columns
    assert "description" in imp_df.columns

