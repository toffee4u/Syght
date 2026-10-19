"""
Inference Interface Module: Production-ready scoring service with structured
predictions, risk percentiles, and investigator-oriented risk explanations.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import joblib
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator

from ml_pipeline.explain import SyghtExplainer
from ml_pipeline.preprocessing import SyghtPreprocessor

logger = logging.getLogger(__name__)

DISCLAIMER_TEXT = (
    "Syght is a clinical and financial decision-support tool. Predictions represent "
    "statistical fraud-risk estimates for prioritized human investigator review, "
    "not legal or factual proof of fraud."
)


class SyghtPredictor:
    """
    Standardized inference engine for scoring healthcare providers.
    """

    def __init__(
        self,
        model: BaseEstimator,
        preprocessor: SyghtPreprocessor,
        feature_names: List[str],
        decision_threshold: float = 0.50,
        metadata: Optional[Dict[str, Any]] = None,
        explainer: Optional[SyghtExplainer] = None,
    ):
        self.model = model
        self.preprocessor = preprocessor
        self.feature_names = list(feature_names)
        self.decision_threshold = float(decision_threshold)
        self.metadata = metadata or {}
        self.explainer = explainer or SyghtExplainer(
            model=model,
            preprocessor=preprocessor,
            feature_names=self.feature_names,
        )

    @classmethod
    def load(cls, bundle_path: Union[str, Path]) -> "SyghtPredictor":
        """Loads a saved Syght model bundle from disk."""
        path = Path(bundle_path)
        if not path.is_file():
            raise FileNotFoundError(f"Syght model bundle not found: {path}")

        bundle = joblib.load(path)
        return cls(
            model=bundle["model"],
            preprocessor=bundle["preprocessor"],
            feature_names=bundle["feature_names"],
            decision_threshold=bundle.get("decision_threshold", 0.50),
            metadata=bundle.get("metadata", {}),
        )

    def _determine_priority(self, score: float) -> str:
        """Categorizes fraud risk score into operational priority bands."""
        if score >= max(0.80, self.decision_threshold * 1.3):
            return "CRITICAL"
        elif score >= self.decision_threshold:
            return "HIGH"
        elif score >= self.decision_threshold * 0.70:
            return "MEDIUM"
        return "LOW"

    def predict_provider(
        self,
        provider_data: Union[Dict[str, Any], pd.Series],
        provider_id: Optional[str] = None,
        top_k_factors: int = 5,
    ) -> Dict[str, Any]:
        """
        Scores a single healthcare provider, validates inputs, and formats
        explanations for claims investigators.
        """
        if isinstance(provider_data, dict):
            pid = provider_id or str(provider_data.get("Provider", provider_data.get("provider_id", "UNKNOWN_PROVIDER")))
            df = pd.DataFrame([provider_data])
        elif isinstance(provider_data, pd.Series):
            pid = provider_id or str(provider_data.get("Provider", provider_data.get("provider_id", "UNKNOWN_PROVIDER")))
            df = provider_data.to_frame().T
        else:
            raise TypeError("provider_data must be a dict or pandas Series.")

        # Ensure all required features are present
        missing_features = [f for f in self.feature_names if f not in df.columns]
        for mf in missing_features:
            df[mf] = np.nan

        X_trans = self.preprocessor.transform(df)
        fraud_prob = float(self.model.predict_proba(X_trans)[0, 1])
        flagged = bool(fraud_prob >= self.decision_threshold)
        priority = self._determine_priority(fraud_prob)

        # Generate local risk explanations
        explanation = self.explainer.explain_provider_instance(df, top_k=top_k_factors)

        return {
            "provider_id": pid,
            "fraud_risk_score": float(round(fraud_prob, 4)),
            "decision_threshold": float(round(self.decision_threshold, 4)),
            "investigation_recommended": flagged,
            "priority_level": priority,
            "model_version": self.metadata.get("model_version", "1.0.0"),
            "model_name": self.metadata.get("selected_model", self.model.__class__.__name__),
            "key_risk_drivers": explanation["risk_increasing_factors"],
            "mitigating_factors": explanation["risk_decreasing_factors"],
            "disclaimer": DISCLAIMER_TEXT,
        }

    def predict_batch(
        self,
        df: pd.DataFrame,
        id_col: str = "Provider",
        include_explanations: bool = False,
    ) -> pd.DataFrame:
        """
        Scores a batch of providers, returning an enriched DataFrame with risk scores,
        investigation recommendations, and priority levels.
        """
        results_df = df.copy()

        # Check and fill missing features
        for mf in self.feature_names:
            if mf not in results_df.columns:
                results_df[mf] = np.nan

        X_trans = self.preprocessor.transform(results_df)
        probs = self.model.predict_proba(X_trans)[:, 1]

        results_df["fraud_risk_score"] = np.round(probs, 4)
        results_df["investigation_recommended"] = probs >= self.decision_threshold
        results_df["priority_level"] = [self._determine_priority(p) for p in probs]

        # Calculate empirical risk percentiles
        ranks = pd.Series(probs).rank(pct=True)
        results_df["risk_percentile"] = np.round(ranks * 100, 1)

        # Sort queue by risk score descending
        return results_df.sort_values("fraud_risk_score", ascending=False).reset_index(drop=True)
