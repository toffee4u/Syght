"""
Tests for Predictor and Inference Interface Module.
"""

import pandas as pd
from sklearn.linear_model import LogisticRegression

from ml_pipeline.config import SyghtConfig
from ml_pipeline.predict import SyghtPredictor
from ml_pipeline.preprocessing import SyghtPreprocessor


def test_syght_predictor_single_and_batch():
    features = ["n_claims", "total_reimbursed", "claims_per_beneficiary"]
    train_df = pd.DataFrame({
        "Provider": ["P1", "P2", "P3", "P4"],
        "n_claims": [10, 50, 100, 200],
        "total_reimbursed": [5000, 25000, 80000, 150000],
        "claims_per_beneficiary": [1.1, 1.5, 2.5, 4.0],
        "fraud": [0, 0, 1, 1],
    })

    prep = SyghtPreprocessor(features).fit(train_df)
    X_trans = prep.transform(train_df)
    model = LogisticRegression().fit(X_trans, train_df["fraud"])

    predictor = SyghtPredictor(
        model=model,
        preprocessor=prep,
        feature_names=features,
        decision_threshold=0.50,
        metadata={"model_version": "1.0.0", "selected_model": "LogisticRegression"},
    )

    # 1. Single Provider Inference
    single_prov = {
        "Provider": "P_TEST",
        "n_claims": 180,
        "total_reimbursed": 140000,
        "claims_per_beneficiary": 3.8,
    }
    pred_res = predictor.predict_provider(single_prov)

    assert pred_res["provider_id"] == "P_TEST"
    assert 0.0 <= pred_res["fraud_risk_score"] <= 1.0
    assert isinstance(pred_res["investigation_recommended"], bool)
    assert pred_res["priority_level"] in {"CRITICAL", "HIGH", "MEDIUM", "LOW"}
    assert "disclaimer" in pred_res
    assert "key_risk_drivers" in pred_res

    # 2. Batch Inference
    batch_df = train_df[["Provider"] + features].copy()
    scored_batch = predictor.predict_batch(batch_df)

    assert len(scored_batch) == 4
    assert "fraud_risk_score" in scored_batch.columns
    assert "investigation_recommended" in scored_batch.columns
    assert "priority_level" in scored_batch.columns
    assert "risk_percentile" in scored_batch.columns
    # Check sorted descending
    assert scored_batch["fraud_risk_score"].iloc[0] >= scored_batch["fraud_risk_score"].iloc[-1]
