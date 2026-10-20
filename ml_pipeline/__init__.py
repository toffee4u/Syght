"""
Syght: Explainable Healthcare Insurance Fraud-Risk Detection Pipeline.

Syght provides a clean, modular, and defensible machine learning pipeline for
identifying suspicious healthcare provider billing patterns, prioritizing investigation
workloads, and explaining risk predictions for human review.
"""

__version__ = "1.0.0"
__author__ = "Team Pulse"

from ml_pipeline.config import SyghtConfig
from ml_pipeline.predict import SyghtPredictor
from ml_pipeline.visualization import (
    plot_model_benchmarks,
    plot_decision_tree_explanation,
    plot_evaluation_dashboard,
    plot_collusion_network,
    plot_fraud_recovery_lift,
)

__all__ = [
    "SyghtConfig",
    "SyghtPredictor",
    "plot_model_benchmarks",
    "plot_decision_tree_explanation",
    "plot_evaluation_dashboard",
    "plot_collusion_network",
    "plot_fraud_recovery_lift",
    "__version__",
]
