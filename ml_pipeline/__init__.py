"""
Syght: Explainable Healthcare Insurance Fraud-Risk Detection Pipeline.

Syght provides a clean, modular, and defensible machine learning pipeline for
identifying suspicious healthcare provider billing patterns, prioritizing investigation
workloads, and explaining risk predictions for human review.
"""

__version__ = "1.0.0"
__author__ = "Syght ML Engineering"

from ml_pipeline.config import SyghtConfig
from ml_pipeline.predict import SyghtPredictor

__all__ = ["SyghtConfig", "SyghtPredictor", "__version__"]
