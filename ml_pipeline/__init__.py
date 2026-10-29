# Student Academic Project: Machine Learning Pipeline for Fraud Detection
"""
Syght: Explainable Healthcare Insurance Fraud-Risk Detection Pipeline.

Syght provides a clean, modular, and defensible machine learning pipeline for
identifying suspicious healthcare provider billing patterns, prioritizing investigation
workloads, and explaining risk predictions for human review.
"""

__version__ = "1.0.0"
__author__ = ""

from ml_pipeline.config import SyghtConfig
from ml_pipeline.predict import SyghtPredictor
from ml_pipeline.azure_ml_integration import AzureMLConfig, AzureMLPipelineGenerator, AzureMLManager
from ml_pipeline.genai_agent_system import HealthFraudAgentSystem, AgentMessage
from ml_pipeline.nlp_clinical_analyzer import ClinicalNotesNLPAnalyzer, AzureAIDocumentIntelligenceConnector, AzureAISearchConnector
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
    "AzureMLConfig",
    "AzureMLPipelineGenerator",
    "AzureMLManager",
    "HealthFraudAgentSystem",
    "AgentMessage",
    "ClinicalNotesNLPAnalyzer",
    "AzureAIDocumentIntelligenceConnector",
    "AzureAISearchConnector",
    "plot_model_benchmarks",
    "plot_decision_tree_explanation",
    "plot_evaluation_dashboard",
    "plot_collusion_network",
    "plot_fraud_recovery_lift",
    "__version__",
]
