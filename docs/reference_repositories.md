# Reference Repositories Analysis & Attribution

**Project**: Syght — Explainable Healthcare Fraud-Risk Detection Platform  
**Document**: Research References, Methodology Audit, and Attribution Record  
**Date**: October 2026  

---

## 1. Executive Summary

Syght uses reference open-source research implementations as design inputs rather than copying or merging codebases. Both reference repositories were cloned to `references/` for thorough inspection of schemas, feature design, validation practices, leakage prevention, and model evaluation.

Neither reference repository contains an explicit software license file (such as MIT, Apache 2.0, or BSD) in its root repository. Consequently, per strict intellectual property hygiene:
- **No code is directly copied** into Syght's core deliverables.
- Syght independently implements an original, modular, and unified ML pipeline architecture (`ml_pipeline/`).
- The reference repositories remain isolated in `references/` for research provenance and are strictly excluded from git tracking, deployment packages, and exported artifact bundles.

---

## 2. Reference Repositories Overview

### Repository A: `health-fraud-detection-ml-pipeline`
* **Repository URL**: [https://github.com/youlia-denisov/health-fraud-detection-ml-pipeline.git](https://github.com/youlia-denisov/health-fraud-detection-ml-pipeline.git)
* **Author**: Youlia Denisov
* **Clone Destination**: `references/health-fraud-detection-ml-pipeline/`
* **License**: Unspecified (no `LICENSE` file found in repository root; `pyproject.toml` contains project metadata without a license field).
* **Target Task**: Healthcare provider fraud detection using Medicare claims (Kaggle benchmark dataset).
* **Architecture**: Polars and DuckDB-based pipeline (`pipelines/ingest.py`, `features.py`, `train.py`, `evaluate.py`, `report.py`, `orchestrate.py`).

#### Methodologies Inspected:
1. **Schema Mapping Layer**: Decouples external column names from internal pipeline naming (`config/schema_mapping.yaml`), facilitating future dataset schema adaptations.
2. **Defensive Label Derivation**: Robust parsing of target labels across data types (Boolean, integer 0/1, string Yes/No/True/False) that raises explicit errors when encountering unrecognized values rather than failing silently.
3. **Clinical Aggregations**:
   - Inpatient Length of Stay (LOS) metrics (`discharge_date - admission_date`).
   - Length of Stay Coefficient of Variation (`ip_cv_los = std / mean`), providing a dispersion signal for inpatient stays.
   - Chronic condition comorbidity counts aggregated across beneficiary records.
4. **Imbalance Handling**: Calculation of `scale_pos_weight` (`(y == 0).sum() / (y == 1).sum()`) for XGBoost, and `class_weight='balanced'` for linear and forest estimators.
5. **Metric Discipline**: Explicit prioritization of Precision-Recall AUC (PR-AUC / Average Precision) over Accuracy given the ~9.4% base rate of fraud.
6. **Explainability**: SHAP `TreeExplainer` utilizing background sampling and interventional feature perturbation.

---

### Repository B: `provider-fraud-detection`
* **Repository URL**: [https://github.com/drakon-codes/provider-fraud-detection.git](https://github.com/drakon-codes/provider-fraud-detection.git)
* **Author**: Harsha (`drakon-codes`)
* **Clone Destination**: `references/provider-fraud-detection/`
* **License**: Unspecified (no `LICENSE` file in repository root).
* **Target Task**: Provider fraud investigation prioritization using Medicare claims.
* **Architecture**: Script-staged pipeline (`src/audit.py`, `build_features.py`, `split.py`, `ablation.py`, `train.py`, `size_confound.py`, `threshold_cost.py`, `rank_topk.py`, `explain.py`).

#### Methodologies Inspected:
1. **Decision Support Philosophy**: Transparently framing predictions as risk prioritization for human investigators, not proof of fraud.
2. **Provider as Unit of Analysis**: Aggregating claims upward to the provider level, eliminating claim-to-provider leakage and guaranteeing clean provider partitioning.
3. **Structured Feature Grouping & Ethical Exclusions**:
   - Distinct grouping: `volume` (billing scale), `money` (reimbursement statistics & tail percentiles), `behaviour` (billing patterns, duplicate same-day billing, physician and diagnosis concentration), `patient_mix` (patient age, mortality, chronic condition load, renal disease).
   - **Ethical Safeguard**: Strict exclusion of protected patient demographics (`Gender`, `Race`) from feature sets to prevent biased provider scoring.
4. **Pre-Flight Data Auditing**: Explicit checks for structurally missing fields (e.g., outpatient records omitting admission dates) versus unintended nulls, duplicate claims, and provider label consistency.
5. **Operational Rule Baselines**: Benchmarking ML candidates against transparent heuristic rules (`Rule_ClaimVolume`, `Rule_TotalReimbursed`, `Rule_MeanReimbursed`). An ML model is only adopted if it statistically outperforms simple billing volume heuristics.
6. **Model Selection by 1-Standard-Error Rule**: Selecting the simplest, most regularized candidate model within 1 standard error of the best cross-validated PR-AUC, avoiding overfitting to fold noise.
7. **Cost-Aware Threshold Optimization**:
   - Decision threshold selected on out-of-fold training probabilities (never on held-out test data) by balancing fixed case investigation cost against unrecovered exposure.
   - Sensitivity testing across different recovery fractions.
8. **Investigation Queue Simulation (Top-K)**: Evaluating Precision@K, Recall@K, and financial exposure captured at realistic operational capacities (1%, 5%, 10%, 20%), comparing probability-ranking vs. exposure-weighting vs. size-banded allocation.
9. **Synthetic Data Generator (`make_sample_data.py`)**: Realistic synthetic generator mirroring the schema for safe local pipeline validation without downloading the proprietary dataset.

---

## 3. Syght's Unified Architectural Synthesis

Syght incorporates the best theoretical and methodological principles from both research inputs into a unified, object-oriented, production-ready Python package (`ml_pipeline/`):

| Principle / Capability | Source Inspiration | Syght Unified Implementation |
|---|---|---|
| **Ethical Feature Guardrails** | Repo B | Strict exclusion of race/gender; focus on operational billing anomalies, same-day duplicate billing, and clinical concentrations. |
| **Schema Normalization** | Repo A | Configuration-driven schema mapper (`ml_pipeline/data_ingestion.py`) validating columns and types defensively. |
| **Pre-Flight Data Audit** | Repo B | Automated data quality, label integrity, and leakage audit engine (`ml_pipeline/data_audit.py`). |
| **Leakage-Safe Partitioning** | Repo A & B | Stratified provider-level splitting with zero data leakage; cross-validation preprocessors fitted strictly on training folds (`ml_pipeline/split.py`, `preprocessing.py`). |
| **Rule Baseline Verification** | Repo B | Heuristic baselines evaluated alongside Logistic Regression, Random Forest, LightGBM, and XGBoost; statistical testing against volume heuristics (`ml_pipeline/train.py`). |
| **Selection Discipline** | Repo A & B | Cross-validated PR-AUC (Average Precision) primary criterion with 1-SE parsimony rule. |
| **Validation Threshold Selection** | Repo A & B | Validation-only threshold optimization combining Maximum F1 and Cost-Aware curves with sensitivity analysis (`ml_pipeline/threshold.py`). |
| **Investigation Queue Prioritization** | Repo B | Multi-strategy queue simulation (probability, exposure, banded) with Precision@K, Recall@K, and captured exposure (`ml_pipeline/evaluate.py`). |
| **Explainable Risk Profiling** | Repo A & B | SHAP values + plain-language risk descriptions mapped for claims investigators (`ml_pipeline/explain.py`). |
| **Production Inference Contract** | Syght Original | Structured inference service returning risk scores, risk percentiles, key contributing risk factors, and investigation recommendation (`ml_pipeline/predict.py`). |
| **Offline Testing Generator** | Repo B | Native Medicare data simulator (`ml_pipeline/medicare_simulator.py`) enabling 100% offline unit and integration testing without downloading the Kaggle dataset. |

---

## 4. Attribution and License Compliance Statement

1. **Independent Implementation**: All code within `ml_pipeline/`, `tests/`, `notebooks/`, and `docs/` is written independently for the Syght project.
2. **References Cleanup & Provenance**: The temporary cloned repositories in `references/` served as read-only design and methodology benchmarks during development and have been safely cleaned up. Their full citation, URL attribution, and architectural contributions are permanently recorded in this document.
3. **Exclusion from Deliverables**: `references/` is excluded from git commits and application release packages via `.gitignore`.
4. **Data Privacy**: The Kaggle dataset is strictly accessed inside Google Colab; no private or raw benchmark records are stored in the local codebase or committed to source control.

