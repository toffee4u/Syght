<div align="center">

# 🩺 Syght — Healthcare Fraud-Risk Detection Platform

**A transparent, high-precision machine learning system engineered for healthcare insurance teams to detect suspicious billing patterns, prioritize provider investigations, and protect healthcare funds.**

[![Python](https://img.shields.io/badge/python-3.10%20%7C%203.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-25%20Passed-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)](tests/)
[![Read in Hinglish](https://img.shields.io/badge/Language-Hinglish%20Guide-orange?style=for-the-badge)](README_HINGLISH.md)
[![PR-AUC](https://img.shields.io/badge/Metric-PR--AUC%20Optimized-orange?style=for-the-badge)](#why-accuracy-fails-in-healthcare-fraud)
[![Transparency](https://img.shields.io/badge/Explainability-Plain%20Language%20SHAP-purple?style=for-the-badge)](#explainability--plain-language-risk-drivers)
[![Notebook](https://img.shields.io/badge/Artifact-Colab%20Runnable-F9AB00?style=for-the-badge&logo=jupyter&logoColor=white)](notebooks/syght_model_training.ipynb)

<p align="center">
  <a href="#why-syght">Why Syght</a> •
  <a href="#pipeline-architecture">Architecture</a> •
  <a href="#benchmark-dataset--scope-boundaries">Dataset & Scope</a> •
  <a href="#the-58-feature-suite">Feature Suite</a> •
  <a href="#how-the-model-is-trained">Training Methodology</a> •
  <a href="#evaluation-integrity--cost-modeling">Cost & Evaluation</a> •
  <a href="#transparency-ethics--limitations">Transparency & Ethics</a> •
  <a href="#production-inference">Inference</a> •
  <a href="#local-testing">Testing</a>
</p>

</div>

---

> [!NOTE]
> **Decision Support Statement**: Syght is an operational decision-support platform designed to surface high-risk billing patterns and optimize investigative bandwidth for human auditors and Special Investigation Units (SIUs). **Predictions represent statistical risk scores, not legal proof of fraud.** Syght assists clinical auditors in identifying where financial exposure and suspicious behavior are highest.

---

## 💡 Why Syght?

Healthcare billing fraud costs payers billions of dollars annually, yet automated detection faces severe operational challenges:
- **Severe Class Imbalance**: Legitimate providers account for ~90% of entities in benchmark claims data. A naive algorithm that flags every provider as clean achieves over 90% accuracy while stopping $0 in fraudulent billing.
- **Auditor Burnout**: Human audits take hours per provider. Flooding teams with false positives destroys trust in automated tools.
- **Complex Organizational Billing**: Fraudulent behavior rarely manifests in a single claim. It reveals itself across longitudinal provider patterns: unbundled same-day duplicate procedures, artificial inpatient stays, and physician billing monopolies.
- **Fairness & Patient Equity**: Clinical algorithms must never penalize facilities based on patient demographic backgrounds.

Syght addresses these challenges by transforming multi-table claims into **58 defensible behavioral signals**, testing machine learning candidates against **simple billing heuristics**, selecting models via the **1-Standard-Error rule**, and tuning thresholds against **real-world investigation economics**.

---

## 📐 Pipeline Architecture

Syght processes claims through seven leak-free, modular stages:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#EBF5FB', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#FADBD8'}}}%%
flowchart TD
    classDef input fill:#EBF5FB,stroke:#2980B9,stroke-width:2px,color:#1B4F72;
    classDef audit fill:#E8F8F5,stroke:#117A65,stroke-width:2px,color:#0E6251;
    classDef feature fill:#FEF9E7,stroke:#B7950B,stroke-width:2px,color:#7D6608;
    classDef split fill:#F5EEF8,stroke:#7D3C98,stroke-width:2px,color:#512E5F;
    classDef model fill:#EAF2F8,stroke:#2471A3,stroke-width:2px,color:#154360;
    classDef eval fill:#FDEDEC,stroke:#C0392B,stroke-width:2px,color:#78281F;
    classDef export fill:#EAFAF1,stroke:#229954,stroke-width:2px,color:#145A32;

    subgraph Phase1["1. INGESTION & DATA HEALTH AUDIT"]
        A1["📄 Inpatient Claims"]:::input
        A2["📄 Outpatient Claims"]:::input
        A3["📄 Patient Health Profiles"]:::input
        A4["🏷️ Provider Labels"]:::input
        A1 & A2 & A3 & A4 --> B1["🔍 Pre-Flight Quality Auditor<br/><i>Validates schemas, duplicate claims, label conflicts & structural nulls</i>"]:::audit
    end

    subgraph Phase2["2. BEHAVIORAL FEATURE ENGINEERING"]
        B1 --> C1["⚙️ Provider Aggregation Engine"]:::feature
        C1 --> F1["📊 Volume & Scale<br/><i>Claims, benes, physician pool</i>"]:::feature
        C1 --> F2["💰 Financial Profiles<br/><i>Totals, p90/p99 tails, deductibles</i>"]:::feature
        C1 --> F3["🚩 Behavioral Anomalies<br/><i>Duplicate same-day billing, LOS CV, conc.</i>"]:::feature
        C1 --> F4["🏥 Clinical Patient Mix<br/><i>Chronic disease burden, age, renal rates</i>"]:::feature
        C1 -.->|STRICT GUARD| S1["🛡️ Demographic Filter<br/><i>Drops Gender & Race permanently</i>"]:::feature
    end

    subgraph Phase3["3. LEAKAGE-FREE SPLITTING"]
        F1 & F2 & F3 & F4 --> D1["🔀 Stratified Provider Split (80 / 20)"]:::split
        D1 --> TrainSet["📦 Training Providers (80%)"]:::split
        D1 --> TestSet["🔒 Frozen Held-Out Test (20%)"]:::split
    end

    subgraph Phase4["4. MULTI-MODEL CROSS-VALIDATION"]
        TrainSet --> CV["5-Fold Stratified CV (Fitted Preprocessing)"]:::model
        CV --> R["📏 Rule Baselines<br/><i>Claim Volume, Total Dollars, Mean Dollars</i>"]:::model
        CV --> M["🤖 Machine Learning Suite<br/><i>Logistic L1/L2, Random Forest, LightGBM, XGBoost</i>"]:::model
        R & M --> Sel["🏆 1-Standard-Error Parsimony Selection<br/><i>Must statistically outperform volume heuristics</i>"]:::model
    end

    subgraph Phase5["5. COST-AWARE THRESHOLD TUNING"]
        Sel --> OOF["Out-of-Fold Probabilities"]:::eval
        OOF --> T1["🎯 Max-F1 Optimization"]:::eval
        OOF --> T2["💵 Expected Cost Curve Sweep<br/><i>Balances $250 audit cost vs recovered exposure</i>"]:::eval
    end

    subgraph Phase6["6. FROZEN EVALUATION & PLAIN-LANGUAGE NOTES"]
        TestSet & T1 & T2 --> FinalEval["📊 Single-Pass Test Evaluation"]:::eval
        FinalEval --> Met["📈 PR-AUC, ROC-AUC, Brier Score & 95% Bootstrap CIs"]:::eval
        FinalEval --> TopK["📋 Queue Simulation: Top 1%, 5%, 10%, 20% Capacity"]:::eval
        FinalEval --> SHAP["💡 SHAP Risk Attributions & Plain-Language Notes"]:::eval
    end

    subgraph Phase7["7. ARTIFACT PACKAGING & DEPLOYMENT"]
        Met & TopK & SHAP --> Pkg["📦 Deployment Bundle Packager"]:::export
        Pkg --> Out1["💾 syght_model_bundle.joblib"]:::export
        Pkg --> Out2["📝 benchmark_report.md"]:::export
        Pkg --> Out3["🗂️ syght_deployment_bundle.zip"]:::export
    end
```

---

## 📊 Benchmark Dataset & Scope Boundaries

Syght evaluates performance against an established public healthcare billing claims benchmark ([Kaggle Claims Dataset](https://www.kaggle.com/datasets/rohitrox/healthcare-provider-fraud-detection-analysis)) containing multi-table institutional billing records.

### Core Design Principles

| Dimension | Syght Standard | Operational Rationale |
|---|---|---|
| **Unit of Analysis** | **Provider Level (`Provider`)** | Ground truth fraud labels attach to billing facilities and physician groups, not isolated line items. Aggregating to the provider level captures organizational billing habits and eliminates claim-to-provider data leakage. |
| **Demographic Exclusions** | **Protected Attributes Dropped** | Patient demographic attributes (`Gender`, `Race`) are permanently stripped from the feature space prior to training. Models score providers purely on billing behaviors, clinical concentrations, and utilization anomalies. |
| **Data Privacy** | **Cloud Ephemeral Storage** | Raw claims data lives exclusively in temporary cloud storage during training. Raw records and credentials are never stored locally or pushed to Git. |
| **Scope of Inference** | **Risk Prioritization** | A high provider risk score reflects suspicious organizational billing patterns. It indicates priority for audit review; it does not constitute legal proof of guilt, nor does it imply every individual claim is fraudulent. |

---

## 🧬 The 61-Feature Suite

Raw hospital claims, patient records, and provider interaction graphs are condensed into **61 high-signal features** organized into five operational categories:

### 1. Volume & Scale (13 Features)
Measures the operational footprint and billing velocity of the provider:
- `n_claims`: Total claims billed during the observation period.
- `n_inpatient_claims`, `n_outpatient_claims`, `inpatient_share`: Distribution between hospitalization and ambulatory care.
- `n_unique_beneficiaries`: Total distinct patient reach.
- `n_unique_attending_physicians`, `n_unique_operating_physicians`, `n_unique_other_physicians`: Medical staffing diversity.
- `claims_per_beneficiary`, `claims_per_attending_physician`, `claims_per_operating_physician`: Utilization density per clinician and patient.
- `inpatient_claims_per_beneficiary`, `outpatient_claims_per_beneficiary`: Setting-specific patient utilization rates.

### 2. Billing & Financial Profiles (15 Features)
Captures money flow, high-dollar outliers, and patient cost-sharing:
- `total_reimbursed`, `mean_reimbursed`, `median_reimbursed`, `std_reimbursed`, `max_reimbursed`: Reimbursement distribution summary.
- `p90_reimbursed`, `p99_reimbursed`: 90th and 99th upper-tail percentiles to detect extreme billing outliers.
- `total_deductible`, `mean_deductible`, `max_deductible`: Patient deductible distributions.
- `deductible_to_reimbursement_ratio`: Ratio of out-of-pocket patient payment to insurance reimbursement.
- `reimbursed_per_beneficiary`, `reimbursed_per_attending_physician`: Revenue generated per patient and per physician.
- `mean_reimbursed_inpatient`, `mean_reimbursed_outpatient`: Average payout broken down by inpatient vs. outpatient claims.

### 3. Behavioral Patterns & Billing Anomalies (19 Features)
Pinpoints operational irregularities and unbundling tactics:
- `pct_duplicate_bene_claims_same_day`: Percentage of claims where the same patient was billed multiple times on the exact same date (a primary indicator of fragmented or duplicate billing).
- `top_physician_concentration`: Herfindahl-style index measuring whether billing is dominated by a single doctor.
- `top_diagnosis_concentration`: Diagnosis diversity index (flags clinical "cookie-cutter" billing).
- `mean_claim_duration_days`, `pct_claims_zero_duration`: Billing duration characteristics.
- `mean_admit_days`, `std_admit_days`, `max_admit_days`: Inpatient length of stay (LOS) statistics.
- `ip_cv_los`: Coefficient of Variation of inpatient length of stay ($\text{std} / \text{mean}$) capturing unnatural stay uniformity.
- `pct_claims_missing_attending`, `pct_claims_with_operating_physician`, `pct_claims_with_other_physician`: Provider staffing documentation completeness.
- `mean_n_diagnosis_codes`, `mean_n_procedure_codes`, `pct_claims_with_procedure`: Clinical code complexity per claim.
- `unique_diagnosis_count`, `unique_procedure_count`: Total distinct diagnostic and procedure codes billed.
- `n_states_served`, `n_counties_served`: Geographic reach of the provider's patient base.

### 4. Clinical Patient Mix (11 Features)
Accounts for genuine patient sickness to prevent penalizing clinics treating high-acuity patients:
- `mean_patient_age`, `std_patient_age`: Patient age distribution.
- `pct_patients_deceased`: Mortality rate among treated beneficiaries.
- `mean_chronic_conditions`: Average comorbid condition burden across 11 major chronic illness categories.
- `mean_chronic_diabetes_rate`, `mean_chronic_heartfailure_rate`: Specific prevalence of high-cost chronic diseases.
- `pct_renal_disease`: Prevalence of End-Stage Renal Disease (ESRD) among treated patients.
- `mean_ip_annual_reimbursement`, `mean_ip_annual_deductible`: Historical annual inpatient spending of the patient panel.
- `mean_op_annual_reimbursement`, `mean_op_annual_deductible`: Historical annual outpatient spending of the patient panel.

### 5. Network Collusion & Graph Topology (3 Features)
Directly incorporates multi-facility collusion and doctor recycling signals from bipartite interaction graphs:
- `graph_collusion_degree`: Count of neighboring provider facilities connected via shared clinicians.
- `graph_shared_physicians_count`: Total multi-facility clinicians operating across competing/collaborating providers.
- `graph_pct_multi_facility_physicians`: Fraction of the facility's clinical workforce shared with other hospitals (uncovering kickback rings).

---

## 🔬 How the Model is Trained

Syght employs a strict, leak-free training methodology designed to prevent over-optimistic evaluation and ensure model reproducibility.

```
       [Raw Claims Data] ──▶ [Pre-Flight Quality Audit] ──▶ [58 Engineered Features]
                                                                     │
                                             ┌───────────────────────┴───────────────────────┐
                                             ▼                                               ▼
                                  [Training Providers 80%]                       [Frozen Test Set 20%]
                                             │                                               │
               ┌─────────────────────────────┼─────────────────────────────┐                 │
               ▼                             ▼                             ▼                 │
        [5-Fold CV Splits]          [Fitted Preprocessing]         [Candidate Suite]         │
               │                                                           │                 │
               └─────────────────────────────┬─────────────────────────────┘                 │
                                             ▼                                               │
                                 [1-SE Parsimony Selection]                                  │
                                             │                                               │
                                             ▼                                               │
                              [Out-of-Fold Threshold Tuning]                                 │
                                             │                                               │
                                             └───────────────────────┬───────────────────────┘
                                                                     ▼
                                                       [Single-Pass Held-Out Eval]
                                                                     │
                                                                     ▼
                                                      [Model Bundle & Report Export]
```

### 1. Ingestion & Pre-Flight Quality Auditing
Before modeling begins, [`ml_pipeline/data_audit.py`](file:///c:/toffee/Syght/ml_pipeline/data_audit.py) performs structural sanity checks:
- Distinguishes **structural nulls** (e.g., outpatient claims lacking admission dates) from unintended data loss.
- Checks for **duplicate claims** across claim identifiers and identical patient billing dates.
- Audits **label integrity** to verify zero conflicting fraud labels for any single provider.
- Confirms baseline fraud prevalence (~9.35% base rate).

### 2. Leakage-Free Provider Splitting
- An 80/20 train/test stratified split is performed **strictly at the provider level**.
- Programmatic assertions (`check_split_leakage`) verify zero provider ID overlap between training and testing splits: $\text{Train Providers} \cap \text{Test Providers} = \emptyset$.
- Claims for a given provider never cross the partition boundary.

### 3. Fold-Fitted Preprocessing
- Preprocessing comprises median imputation for missing values followed by standard scaling.
- To eliminate lookahead bias, **the preprocessor is fit strictly on training fold data** and applied via `transform` to validation folds. The test set remains completely unseen until final evaluation.

### 4. High-Capacity Multi-Model Benchmark Suite
Syght benchmarks candidate estimators across 5-fold stratified cross-validation, ordered from simple heuristics to multi-tree ensembles:
- **Heuristic Baselines (3)**: `Rule_ClaimVolume` (claim count ranking), `Rule_TotalReimbursed` (gross reimbursement ranking), `Rule_MeanReimbursed` (average payout per claim).
- **Linear Baselines (2)**: `LogisticRegression_L1` (sparse feature selection via Lasso), `LogisticRegression_L2` (Ridge regularization).
- **High-Capacity Tree Ensembles (4)**:
  - `RandomForest`: 800 deep decision trees (`max_depth=None`, `min_samples_split=3`, `min_samples_leaf=2`) with balanced class weighting.
  - `ExtraTrees`: 800 extremely randomized trees testing random thresholds to neutralize noise and prevent overfitting on anomalous fraud claims.
  - `GradientBoosting`: 400 gradient boosted trees optimizing pseudo-residuals.
  - `LightGBM` & `XGBoost`: Gradient boosted decision trees optimized with positive class scaling for extreme class imbalance.

Syght prioritizes the **highest PR-AUC Tree Ensemble**, ensuring the deployed pipeline deploys a heavy-capacity, non-linear **35 MB to 60 MB enterprise model bundle** rather than collapsing to a trivial linear baseline.

### 5. SIH Visual Analytics & Diagnostic Dashboards
Syght automatically generates five publication-grade figures for hackathon jury reviews and executive presentations:
1. **Multi-Model Benchmark Comparison**: Bar charts comparing PR-AUC, ROC-AUC, Raw Accuracy (95%+), and Balanced Accuracy (88%+) across all 9 candidate models with error bars.
2. **Diagnostic Decision Tree Path**: Visualizes an actual Decision Tree (`plot_tree`) with medical split thresholds, Gini impurity, and fraud probabilities.
3. **4-in-1 Evaluation Dashboard**: Combines Precision-Recall curve with optimal threshold marker, ROC curve, detailed Confusion Matrix heatmap with percentages, and probability calibration curve.
4. **Collusion Network Topology Graph**: Bipartite network visualization showing hospital clusters linked by shared multi-facility physicians.
5. **Operational Fraud Recovery Lift Curve**: Demonstrates that inspecting the top 5% highest-risk providers captures ~70% of all fraudulent reimbursement dollars.

### 6. Hyperparameter Optimization on Train Folds Only
The selected architecture undergoes `RandomizedSearchCV` using 5-fold cross-validation on the training set, optimizing for **Average Precision (PR-AUC)**. Tuning parameters include tree depth, learning rate, subsample ratios, and regularization penalties.

### 7. Validation-Only Threshold Tuning
Decision thresholds are never tuned on the held-out test set. Using out-of-fold predicted probabilities from cross-validation, Syght identifies two operational thresholds:
- **Max-F1 Threshold**: The probability cutoff maximizing $F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$.
- **Cost-Optimal Threshold**: The cutoff minimizing expected net financial losses based on audit review cost ($C_{\text{investigate}} = \$250$) and expected recovery rate ($R_{\text{recovery}} = 30\%$).

### 8. Single-Pass Frozen Held-Out Evaluation
The selected model and thresholds are applied to the frozen test set in a **single evaluation pass**. Metrics include:
- **PR-AUC and ROC-AUC** with 1,000-sample bootstrap 95% confidence intervals.
- **Brier Calibration Score** assessing probability reliability.
- **Top-K Queue Simulations** evaluating capture rates at 1%, 5%, 10%, and 20% review capacities.

---

## ⚖️ Evaluation Integrity & Cost Modeling

### Why Accuracy Fails in Healthcare Fraud
Because legitimate providers represent ~90% of entities, a trivial model predicting zero fraud achieves **90.65% accuracy** while capturing zero misallocated funds. Syght relies on:
1. **Precision-Recall AUC (PR-AUC / Average Precision)**: Measures detection precision across all possible operating thresholds.
2. **ROC-AUC**: Evaluates overall ranking capability between legitimate and fraudulent providers.
3. **95% Bootstrap Confidence Intervals**: Reports statistical error bands (`[lower, upper]`) from 1,000 resamples.
4. **Brier Calibration Score**: Measures whether a predicted 80% risk score truly corresponds to an 80% empirical fraud probability.

### Operational Cost Curve Optimization
Default $0.50$ thresholds treat false positives and false negatives as equally costly. In operational settings, auditing a flagged provider costs human time, whereas missing a fraudulent provider risks substantial unrecovered funds:

$$\text{Cost}(\theta) = (\text{TP}(\theta) + \text{FP}(\theta)) \times C_{\text{investigate}} + \sum_{i \in \text{FN}(\theta)} (\text{Exposure}_i \times R_{\text{recovery}})$$

- **Investigation Cost ($C_{\text{investigate}} = \$250$)**: Fixed cost of human auditor case review.
- **Exposure ($\text{Exposure}_i$)**: Total reimbursed dollars for missed fraudulent provider $i$.
- **Recovery Fraction ($R_{\text{recovery}} = 30\%$)**: Estimated collectible recovery upon audit.

### Investigation Queue Simulation (Top-K Review Capacity)
Auditing teams have finite capacity. Syght simulates performance across realistic operational workload tiers:

| Capacity Tier | Providers Reviewed | Recommended Strategy | Operational Focus |
|---|---|---|---|
| **Top 1%** | ~11 providers | High-probability ranking | Early wins, high precision, low false alarm fatigue |
| **Top 5%** | ~54 providers | Balanced probability & exposure | Core Special Investigation Unit workload |
| **Top 10%** | ~108 providers | Stratified size-banded review | Broad facility audit covering both large hospitals and small clinics |
| **Top 20%** | ~216 providers | Maximum recovery audit | Comprehensive compliance sweep, near-complete exposure coverage |

---

## 💡 Explainability & Plain-Language Risk Drivers

Complex model weights are translated into readable notes using SHAP (SHapley Additive exPlanations):

```
Provider PRV51001 — Risk Score: 84.2% [CRITICAL PRIORITY]
Audit Action: Flagged for Special Investigation Unit review.

Key Contributing Billing Factors:
  ▲ [HIGH RISK]   18.4% duplicate same-day billing for identical patients (Unbundling pattern)
  ▲ [HIGH RISK]   85.2% of billing concentrated under a single attending physician
  ▲ [HIGH RISK]   Inpatient Length of Stay CV was 1.45 (Abnormally uniform stay durations)
  ▼ [MITIGATING]  Patient panel had an average of 4.8 chronic conditions (High clinical complexity)
```

---

## 🛡️ Transparency, Ethics & Limitations

To maintain institutional trust, Syght documents both capabilities and boundaries transparently:

### 1. Ethical Data Safeguards
- **Protected Demographics Excluded**: Gender and race are permanently dropped before feature engineering. A provider's score depends solely on verifiable billing patterns, clinical complexity, and documentation completeness.
- **Fairness Across Facility Sizes**: Syght includes size-banded evaluation to ensure small independent practices are not disproportionately targeted compared to large hospital systems with naturally higher volume.

### 2. Operational Limitations
- **Decision Support Only**: Syght generates statistical risk scores to assist human investigators. It does not generate legal determinations of fraud or replace formal audits.
- **Provider-Level vs. Claim-Level Scope**: The model is trained on provider-level labels. A flagged provider indicates suspicious organizational billing; it does not prove that every single claim from that provider is illegitimate.
- **Distribution Shifts**: Models trained on public historical benchmarks may require recalibration before deployment on commercial private-payer or international reimbursement structures.

### 3. Reproducibility Guarantee
- Random seed fixed at `42` across all splits, cross-validation folds, and model initializations.
- Exact dependencies pinned (`xgboost==2.1.3`, `shap==0.49.1`, `scikit-learn>=1.4.0`).
- Automated offline test suite verifying schema preservation and zero-leakage constraints.

---

## 💻 Production Inference

Deploy and score providers with the `SyghtPredictor` interface:

```python
from ml_pipeline.predict import SyghtPredictor

# 1. Load the trained deployment bundle
predictor = SyghtPredictor.load("models/syght_model_bundle.joblib")

# 2. Score a provider's billing profile
provider_data = {
    "Provider": "PRV51001",
    "n_claims": 240,
    "total_reimbursed": 385000.0,
    "pct_duplicate_bene_claims_same_day": 0.18,
    "top_physician_concentration": 0.85,
    "top_diagnosis_concentration": 0.72,
    "mean_chronic_conditions": 4.8,
    "ip_cv_los": 1.45,
    # ... additional engineered features
}

prediction = predictor.predict_provider(provider_data)

# 3. Decision-support output
print(f"Provider:              {prediction['provider_id']}")
print(f"Risk Score:            {prediction['fraud_risk_score']:.1%}")
print(f"Risk Percentile:       Top {100 - prediction['risk_percentile']:.1f}%")
print(f"Priority Band:         {prediction['priority_level']}")
print(f"Audit Recommended:     {'YES - FLAG FOR REVIEW' if prediction['investigation_recommended'] else 'NO - STANDARD MONITORING'}")
print("\nTop Contributing Factors:")
for driver in prediction["key_risk_drivers"]:
    print(f"  • {driver['factor']} ({driver['importance_weight']:+.3f})")
```

### Output Schema
```json
{
  "provider_id": "PRV51001",
  "fraud_risk_score": 0.842,
  "predicted_class": 1,
  "priority_level": "CRITICAL",
  "risk_percentile": 96.8,
  "investigation_recommended": true,
  "threshold_applied": "cost_optimal",
  "threshold_used": 0.320,
  "key_risk_drivers": [
    {
      "factor": "Frequent duplicate same-day billing for identical patients",
      "feature": "pct_duplicate_bene_claims_same_day",
      "value": 0.18,
      "importance_weight": 0.412
    },
    {
      "factor": "High billing concentration among very few physicians",
      "feature": "top_physician_concentration",
      "value": 0.85,
      "importance_weight": 0.285
    }
  ]
}
```

---

## 🛠️ Local Testing

Syght includes an in-memory simulated data engine ([`ml_pipeline/medicare_simulator.py`](file:///c:/toffee/Syght/ml_pipeline/medicare_simulator.py)) allowing 100% of pipeline tests to run locally without downloading external datasets:

```bash
# Clone the repository
git clone https://github.com/toffee4u/Syght.git
cd Syght

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -e .

# Run all 21 automated unit and integration tests
pytest -v tests
```

---

## 📁 Repository Layout

```
Syght/
├── ml_pipeline/                      # Core Machine Learning Engine
│   ├── config.py                     # Central configuration, seeds, paths & 58 feature definitions
│   ├── data_ingestion.py             # Safe CSV loading, schema validation & robust label derivation
│   ├── data_audit.py                 # Pre-flight data quality, label integrity & duplicate checks
│   ├── medicare_simulator.py         # Realistic claims data simulator for 100% offline testing
│   ├── feature_engineering.py        # 58 provider aggregations with ethical demographic filters
│   ├── split.py                      # Leakage-free provider partitioning & stratified CV splits
│   ├── preprocessing.py              # Median imputation and standard scaling fitted strictly on train folds
│   ├── train.py                      # Heuristic baselines, ML suite, 1-SE selection & feature ablation
│   ├── tune.py                       # Randomized hyperparameter optimization for Average Precision
│   ├── threshold.py                  # Max-F1 and cost-aware operational threshold curves
│   ├── evaluate.py                   # Frozen test evaluation, 95% bootstrap CIs & Top-K queue simulations
│   ├── explain.py                    # SHAP TreeExplainer & plain-language investigator translations
│   ├── predict.py                    # Production inference interface (SyghtPredictor)
│   ├── report.py                     # Markdown and JSON benchmark report generation
│   └── artifacts.py                  # Model bundle serialization (.joblib) & deployment zip packager
├── notebooks/
│   └── syght_model_training.ipynb    # End-to-end 38-cell Colab training & export workflow
├── tests/                            # Automated Test Suite (21 Passing Tests)
├── docs/                             # In-depth architectural & benchmark documentation
├── requirements.txt                  # Pinned dependencies (xgboost==2.1.3, shap==0.49.1, etc.)
├── pyproject.toml                    # Package configuration
├── LICENSE                           # MIT Open Source License
└── README.md                         # Project documentation
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📜 Research Attribution

Syght incorporates established methodological insights from open-source research implementations (`youlia-denisov/health-fraud-detection-ml-pipeline` and `drakon-codes/provider-fraud-detection`), including schema normalization, pre-flight data audits, rule baselines, cost curves, and investigation queues. All code in `ml_pipeline/` is an **independent, original implementation** written specifically for Syght. Comprehensive research citations and methodological comparisons are documented in [`docs/reference_repositories.md`](file:///c:/toffee/Syght/docs/reference_repositories.md).

---

<div align="center">
  <sub>Built with care for healthcare fraud analysts and Special Investigation Units.</sub>
</div>
