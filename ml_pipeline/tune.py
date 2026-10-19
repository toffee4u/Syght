"""
Hyperparameter Tuning Module: Cross-validated parameter optimization on training folds.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator
from sklearn.model_selection import RandomizedSearchCV, StratifiedKFold

from ml_pipeline.config import SyghtConfig
from ml_pipeline.preprocessing import SyghtPreprocessor

logger = logging.getLogger(__name__)


def get_tuning_param_distributions(model_name: str) -> Dict[str, Any]:
    """Returns sensible search distributions tailored for fraud detection."""
    if "XGBoost" in model_name:
        return {
            "max_depth": [3, 4, 5, 6],
            "learning_rate": [0.01, 0.03, 0.05, 0.1],
            "subsample": [0.7, 0.8, 0.9, 1.0],
            "colsample_bytree": [0.6, 0.7, 0.8, 0.9],
            "n_estimators": [150, 250, 350],
            "min_child_weight": [1, 3, 5],
        }
    elif "LightGBM" in model_name:
        return {
            "num_leaves": [15, 31, 63],
            "max_depth": [3, 4, 5, 6],
            "learning_rate": [0.01, 0.03, 0.05, 0.1],
            "subsample": [0.7, 0.8, 0.9],
            "colsample_bytree": [0.6, 0.7, 0.8],
            "n_estimators": [150, 250, 350],
        }
    elif "RandomForest" in model_name:
        return {
            "n_estimators": [200, 300, 400],
            "max_depth": [4, 6, 8, 10, None],
            "min_samples_leaf": [2, 5, 10],
            "max_features": ["sqrt", "log2", 0.3, 0.5],
        }
    elif "LogisticRegression" in model_name:
        return {
            "C": [0.01, 0.05, 0.1, 0.5, 1.0, 5.0, 10.0],
        }
    return {}


def tune_model(
    train_df: pd.DataFrame,
    features: List[str],
    base_model: BaseEstimator,
    model_name: str,
    n_iter: int = 15,
    config: Optional[SyghtConfig] = None,
) -> Tuple[BaseEstimator, Dict[str, Any], float]:
    """
    Performs RandomizedSearchCV optimizing Average Precision (PR-AUC)
    on training data only.
    """
    cfg = config or SyghtConfig()
    param_dist = get_tuning_param_distributions(model_name)

    if not param_dist:
        logger.info("No tuning distribution specified for %s; returning base estimator.", model_name)
        return base_model, {}, 0.0

    y_train = train_df["fraud"].to_numpy()
    prep = SyghtPreprocessor(features).fit(train_df)
    X_train_trans = prep.transform(train_df)

    cv = StratifiedKFold(n_splits=cfg.cv_n_splits, shuffle=True, random_state=cfg.random_seed)

    search = RandomizedSearchCV(
        estimator=base_model,
        param_distributions=param_dist,
        n_iter=n_iter,
        scoring="average_precision",
        cv=cv,
        random_state=cfg.random_seed,
        n_jobs=-1,
        verbose=0,
    )

    logger.info("Running hyperparameter search for %s (%d iterations)...", model_name, n_iter)
    search.fit(X_train_trans, y_train)

    logger.info("Best parameters for %s: %s (PR-AUC=%.4f)", model_name, search.best_params_, search.best_score_)
    return search.best_estimator_, search.best_params_, float(search.best_score_)
