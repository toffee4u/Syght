"""
Preprocessing Module: Scalable, leakage-free feature imputation and scaling pipelines.
"""

from __future__ import annotations

from typing import List, Optional

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


class SyghtPreprocessor(BaseEstimator, TransformerMixin):
    """
    Fits median imputation and standard scaling strictly on training folds,
    preventing validation or test distribution leakage.
    """

    def __init__(self, feature_cols: List[str]):
        self.feature_cols = list(feature_cols)
        self.transformer: Optional[ColumnTransformer] = None
        self.feature_names_out_: List[str] = []

    def fit(self, X: pd.DataFrame, y: Optional[np.ndarray] = None) -> "SyghtPreprocessor":
        """Fits imputation statistics and scaler parameters on X."""
        available_cols = [c for c in self.feature_cols if c in X.columns]
        if not available_cols:
            raise ValueError(f"None of the required features {self.feature_cols} found in input DataFrame.")

        numeric_pipeline = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ])

        self.transformer = ColumnTransformer(
            transformers=[
                ("num", numeric_pipeline, available_cols),
            ],
            remainder="drop",
        )
        self.transformer.fit(X)
        self.feature_names_out_ = available_cols
        return self

    def transform(self, X: pd.DataFrame) -> np.ndarray:
        """Transforms input DataFrame using fitted parameters."""
        if self.transformer is None:
            raise RuntimeError("Preprocessor has not been fitted yet.")
        return self.transformer.transform(X)

    def fit_transform(self, X: pd.DataFrame, y: Optional[np.ndarray] = None) -> np.ndarray:
        """Fits on X and transforms."""
        return self.fit(X, y).transform(X)

    def get_feature_names(self) -> List[str]:
        """Returns the list of features processed by this preprocessor."""
        return self.feature_names_out_
