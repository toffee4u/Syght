# Syght — Healthcare Fraud Risk Model Benchmark Report

**Generated**: 2026-10-19 15:48:02 UTC  
**Model Selected**: `LightGBM`  
**Operating Decision Threshold**: `0.5364` (Max-F1) | `0.060` (Cost-Optimal)  

> **Operational Notice**: Syght provides statistical decision support to prioritize provider review. Predictions represent risk estimates for human review, not proof of fraud.

---

## 1. Dataset & Audit Summary

- **Unique Labeled Providers**: 5660
- **Fraud Base Rate**: 9.56%
- **Total Claims Ingested**: 571,018
- **Inpatient Claims**: 42,763
- **Outpatient Claims**: 528,255
- **Duplicate Claims**: 0
- **Provider ID Consistency Check**: PASSED (100.0% overlap)

---

## 2. Cross-Validation Candidate Comparison

Candidate models and transparent heuristic baselines evaluated under identical 5-fold cross-validation:

| Model / Baseline | CV PR-AUC (Mean ± Std) | CV ROC-AUC (Mean ± Std) | Brier Score |
|---|---|---|---|
| Rule_ClaimVolume | 0.4067 ± 0.0432 | 0.8072 ± 0.0151 | 0.0864 |
| Rule_TotalReimbursed | 0.6732 ± 0.0398 | 0.9298 ± 0.0129 | 0.0793 |
| Rule_MeanReimbursed | 0.2236 ± 0.0304 | 0.7768 ± 0.0189 | 0.0881 |
| LogisticRegression_L1 | 0.7142 ± 0.0421 | 0.9451 ± 0.0094 | 0.0891 |
| LogisticRegression_L2 | 0.6968 ± 0.0408 | 0.9410 ± 0.0082 | 0.0878 |
| RandomForest | 0.7113 ± 0.0530 | 0.9489 ± 0.0121 | 0.0458 |
| ExtraTrees | 0.7141 ± 0.0487 | 0.9474 ± 0.0123 | 0.0480 |
| GradientBoosting | 0.7159 ± 0.0561 | 0.9443 ± 0.0106 | 0.0520 |
| **LightGBM (SELECTED)** | 0.7378 ± 0.0318 | 0.9470 ± 0.0101 | 0.0500 |
| XGBoost | 0.7313 ± 0.0411 | 0.9477 ± 0.0109 | 0.0490 |

- **Best Heuristic Baseline**: `Rule_TotalReimbursed` (PR-AUC: 0.6732)
- **Best Candidate Model**: `LightGBM` (PR-AUC: 0.7378)
- **Model Complexity Justified**: **YES**: The chosen ML model outperformed the best simple volume baseline by > 1 SE.

---

## 3. Frozen Held-Out Test Evaluation

Evaluated on held-out test data touched strictly once after freezing all models and thresholds:

- **PR-AUC (Average Precision)**: `0.7135` (95% CI: `[0.6220, 0.7986]`)
- **ROC-AUC**: `0.9383` (95% CI: `[0.9105, 0.9623]`)
- **Brier Calibration Score**: `0.0531`
- **Fraud Precision**: `0.6796`
- **Fraud Recall**: `0.6481`
- **F1-Score**: `0.6635`
- **Investigation Rate**: `9.10%`

### Test Confusion Matrix

| | Predicted Legitimate | Predicted Suspicious (Flagged) |
|---|---|---|
| **Actual Legitimate** | 991 (TN) | 33 (FP) |
| **Actual Fraud** | 38 (FN) | 70 (TP) |

---

## 4. Cost-Aware Threshold & Workload Analysis

- **Investigation Cost per Case**: $2,200,000
- **Expected Total Operational Cost**: $3,141,920
- **Net Savings vs. Zero Investigation**: $45,928,182

---

## 5. Investigation Queue Performance (Top-K Simulation)

| Strategy | Capacity % | Queue Size (k) | Precision@K | Recall@K | Frauds Caught | % Exposure Captured |
| Probability | 1.0% | 11 | 0.909 | 0.093 | 10 | 25.3% |
| Exposure | 1.0% | 11 | 1.000 | 0.102 | 11 | 32.7% |
| Banded | 1.0% | 11 | 0.364 | 0.037 | 4 | 6.5% |
| Rule_TotalBilledOnly | 1.0% | 11 | 1.000 | 0.102 | 11 | 32.7% |
| Random | 1.0% | 11 | 0.113 | 0.011 | 1 | 1.0% |
| Probability | 5.0% | 57 | 0.825 | 0.435 | 47 | 72.1% |
| Exposure | 5.0% | 57 | 0.772 | 0.407 | 44 | 75.8% |
| Banded | 5.0% | 57 | 0.281 | 0.148 | 16 | 31.5% |
| Rule_TotalBilledOnly | 5.0% | 57 | 0.754 | 0.398 | 43 | 76.2% |
| Random | 5.0% | 57 | 0.091 | 0.048 | 5 | 5.1% |
| Probability | 10.0% | 113 | 0.655 | 0.685 | 74 | 89.2% |
| Exposure | 10.0% | 113 | 0.646 | 0.676 | 73 | 89.8% |
| Banded | 10.0% | 113 | 0.266 | 0.278 | 30 | 52.0% |
| Rule_TotalBilledOnly | 10.0% | 113 | 0.584 | 0.611 | 66 | 90.4% |
| Random | 10.0% | 113 | 0.095 | 0.100 | 11 | 9.7% |
| Probability | 20.0% | 226 | 0.425 | 0.889 | 96 | 98.4% |
| Exposure | 20.0% | 226 | 0.425 | 0.889 | 96 | 98.4% |
| Banded | 20.0% | 226 | 0.221 | 0.463 | 50 | 69.0% |
| Rule_TotalBilledOnly | 20.0% | 226 | 0.389 | 0.815 | 88 | 97.4% |
| Random | 20.0% | 226 | 0.094 | 0.196 | 21 | 20.0% |

---

## 6. Global Risk Factor Attribution (Top 10 Feature Drivers)

| Feature | Clinical / Billing Description | Direction of Risk | Importance |
|---|---|---|---|
| `total_reimbursed` | Total Medicare reimbursement received | Increases Fraud Risk | 1.2966 |
| `claims_per_beneficiary` | Average claims filed per individual patient | Increases Fraud Risk | 0.7381 |
| `claims_per_operating_physician` | Claims Per Operating Physician | Increases Fraud Risk | 0.5539 |
| `max_admit_days` | Max Admit Days | Increases Fraud Risk | 0.5365 |
| `pct_claims_zero_duration` | Share of claims with zero-day service duration | Lowers Fraud Risk | 0.4581 |
| `median_reimbursed` | Median reimbursement received per claim | Increases Fraud Risk | 0.4215 |
| `deductible_to_reimbursement_ratio` | Deductible To Reimbursement Ratio | Lowers Fraud Risk | 0.3971 |
| `mean_reimbursed_outpatient` | Average reimbursement per outpatient encounter | Increases Fraud Risk | 0.3460 |
| `total_deductible` | Total Deductible | Increases Fraud Risk | 0.3334 |
| `ip_cv_los` | Coefficient of variation in inpatient hospital length of stay | Increases Fraud Risk | 0.2862 |
