# Syght Model Artifacts Directory

This directory stores serialized model binaries, preprocessor pipelines, and metadata produced by the Syght ML training pipeline.

---

## 1. Storage Guidelines & Git Governance

- **Do Not Commit Large Binaries**: Raw `.joblib`, `.pkl`, and `.bin` model files are strictly excluded from git tracking via [.gitignore](file:///c:/toffee/Syght/.gitignore).
- **Deployment Artifact Bundles**: When trained in Google Colab, the pipeline packages:
  - `syght_model_bundle.joblib`
  - `benchmark_report.md`
  - `benchmark_report.json`
  - Evaluation figures (`*.png`)
  into `syght_deployment_bundle.zip` for download.
- Place the extracted `syght_model_bundle.joblib` in this `models/` directory for local inference or backend service execution.

---

## 2. Model Bundle Specification

The `syght_model_bundle.joblib` is a compressed dictionary containing:
```python
{
    "model": fitted_estimator,             # Scikit-learn, XGBoost, or LightGBM model
    "preprocessor": fitted_preprocessor,   # Fitted SyghtPreprocessor (imputation + scaling)
    "feature_names": [...],                # Ordered list of expected features
    "decision_threshold": float,           # Validation-optimized decision threshold
    "metadata": {
        "model_version": "1.0.0",
        "selected_model": "XGBoost",
        "created_at_utc": "2026-10-19T...",
        "environment": { ... }             # Dependency versions at train time
    }
}
```

---

## 3. Production Inference Usage

To load and score provider records in an API service (e.g., FastAPI):

```python
from ml_pipeline.predict import SyghtPredictor

# 1. Initialize predictor from bundle
predictor = SyghtPredictor.load("models/syght_model_bundle.joblib")

# 2. Score a provider
provider_record = {
    "Provider": "PRV51001",
    "n_claims": 185,
    "total_reimbursed": 245000.0,
    "top_physician_concentration": 0.88,
    "pct_duplicate_bene_claims_same_day": 0.14,
    # ... additional engineered features
}

prediction = predictor.predict_provider(provider_record)
print(f"Risk Score: {prediction['fraud_risk_score']:.2%}")
print(f"Priority Band: {prediction['priority_level']}")
print(f"Audit Recommended: {prediction['investigation_recommended']}")
print(f"Key Risk Drivers: {prediction['key_risk_drivers']}")
```
