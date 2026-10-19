"""
Tests for Reporting and Artifacts Modules.
"""

import tempfile
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

from ml_pipeline.artifacts import load_model_bundle, package_deployment_artifacts, save_model_bundle
from ml_pipeline.evaluate import evaluate_frozen_test_set
from ml_pipeline.preprocessing import SyghtPreprocessor
from ml_pipeline.report import save_benchmark_report


def test_report_and_artifacts_lifecycle():
    features = ["n_claims", "total_reimbursed"]
    train_df = pd.DataFrame({
        "Provider": [f"P{i}" for i in range(20)],
        "n_claims": np.random.randint(10, 100, 20),
        "total_reimbursed": np.random.uniform(5000, 50000, 20),
        "exposure_amount": np.random.uniform(5000, 50000, 20),
        "fraud": [1 if i % 4 == 0 else 0 for i in range(20)],
    })
    test_df = train_df.copy()

    prep = SyghtPreprocessor(features).fit(train_df)
    X_trans = prep.transform(train_df)
    model = LogisticRegression().fit(X_trans, train_df["fraud"])

    test_rep = evaluate_frozen_test_set(test_df, prep, model, selected_threshold=0.50)

    cv_summary = pd.DataFrame([
        {"model": "LogisticRegression", "pr_auc_mean": 0.75, "pr_auc_std": 0.05, "roc_auc_mean": 0.85, "roc_auc_std": 0.04, "brier_mean": 0.08},
        {"model": "Rule_ClaimVolume", "pr_auc_mean": 0.65, "pr_auc_std": 0.06, "roc_auc_mean": 0.78, "roc_auc_std": 0.05, "brier_mean": 0.12},
    ])
    selection_meta = {
        "selected_model": "LogisticRegression",
        "best_ml_model": "LogisticRegression",
        "best_ml_score": 0.75,
        "best_rule_model": "Rule_ClaimVolume",
        "best_rule_score": 0.65,
        "ml_justified": True,
    }
    threshold_meta = {
        "max_f1_threshold": 0.50,
        "max_f1_score": 0.60,
        "cost_optimal_threshold": 0.45,
        "cost_optimal_details": {"investigation_cost": 2500, "total_cost": 12500},
        "cost_savings_vs_no_investigation": 8000,
        "sensitivity_table": [],
    }
    audit_report = {
        "status": "PASSED",
        "labels": {"n_unique_providers": 20, "fraud_rate": 0.25},
        "claims": {"n_total_claims": 200, "duplicate_claim_ids": 0, "overlap_fraction": 1.0},
    }
    global_imp = pd.DataFrame([
        {"feature": "n_claims", "description": "Total claims filed", "importance": 0.8, "direction": 1.0, "effect": "Raises Fraud Risk"},
    ])

    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)

        # 1. Save Report
        report_files = save_benchmark_report(
            tmp_path / "reports",
            audit_report,
            cv_summary,
            selection_meta,
            threshold_meta,
            test_rep,
            global_imp,
        )
        assert report_files["markdown_report"].is_file()
        assert report_files["json_report"].is_file()

        # 2. Save Model Bundle
        bundle_file = save_model_bundle(
            model=model,
            preprocessor=prep,
            feature_names=features,
            decision_threshold=0.50,
            metadata=selection_meta,
            output_path=tmp_path / "models" / "syght_bundle.joblib",
        )
        assert bundle_file.is_file()

        loaded = load_model_bundle(bundle_file)
        assert loaded["decision_threshold"] == 0.50
        assert loaded["feature_names"] == features

        # 3. Package Deployment Zip
        zip_path = package_deployment_artifacts(tmp_path, tmp_path / "syght_deployment_bundle.zip")
        assert zip_path.is_file()
        assert zip_path.stat().st_size > 0
