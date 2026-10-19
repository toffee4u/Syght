# Dataset Specification & Benchmark Methodology

**Project**: Syght — Explainable Healthcare Fraud-Risk Detection Platform  
**Document**: Dataset Source, Schema Characteristics, Split Design, and Evaluation Standards  
**Date**: October 2026  

---

## 1. Dataset Source & Background

Syght uses the historical US Medicare claims dataset uploaded by `rohitrox` on Kaggle:  
**Kaggle Dataset**: [Healthcare Provider Fraud Detection Analysis](https://www.kaggle.com/datasets/rohitrox/healthcare-provider-fraud-detection-analysis)

The dataset consists of four core relational tables:
1. **`Train-*.csv`**: Primary provider labels (`Provider`, `PotentialFraud` = "Yes" / "No").
2. **`Train_Beneficiarydata-*.csv`**: Patient demographics, mortality indicators (`DOD`), 11 chronic health conditions, and annual reimbursement totals.
3. **`Train_Inpatientdata-*.csv`**: Inpatient hospital admission claims containing admission/discharge dates, diagnosis codes, procedure codes, and reimbursement amounts.
4. **`Train_Outpatientdata-*.csv`**: Outpatient clinic encounters containing service start/end dates, diagnosis codes, procedure codes, and reimbursement amounts.

---

## 2. Essential Dataset Limitations & Scope

### 2.1 Provider-Level Unit of Analysis
The ground-truth labels in this dataset attach strictly to **healthcare providers** (`Provider`), not to individual claims (`ClaimID`). Consequently:
- Syght models **provider-level fraud risk**.
- Syght does **not** fabricate claim-level labels from provider labels.
- Predictions represent provider investigation priorities for human claims review.

### 2.2 Geographic and Institutional Specificity
- This benchmark dataset is derived from historical **US Medicare** claims.
- It is **not** Indian healthcare or health insurance data.
- Performance on this dataset does not establish performance on Indian insurance claim formats (e.g., Ayushman Bharat / PM-JAY or private TPA claims), which exhibit different billing taxonomies, coding standards, and adjudication rules.

### 2.3 Kaggle Test File Unusability
Kaggle provides accompanying `Test_*.csv` files, but these contain no labels (intended for competition leaderboard submissions). They cannot be used for scientific model evaluation. Syght constructs a disciplined, frozen train/test partition directly from the labeled training data.

### 2.4 Nature of Predictions
Syght produces **probabilistic risk assessments for decision support**. A high risk score indicates anomalous, high-risk billing patterns that warrant review by certified fraud investigators, not legal proof of fraudulent intent.

---

## 3. Data Quality & Pre-Flight Auditing

Before feature engineering, the pipeline executes automated audits (`ml_pipeline/data_audit.py`):
1. **Label Integrity**:
   - Class distribution verification: ~9.4% base rate of fraud (`PotentialFraud == "Yes"`).
   - Zero tolerance for conflicting labels: raises a fatal error if any provider ID appears with multiple conflicting labels.
2. **Structural Absence vs. Real Missingness**:
   - Outpatient records structurally lack `AdmissionDt` and `DischargeDt` because outpatient visits do not involve overnight hospital stays. The pipeline treats these as structurally absent rather than missing data.
3. **Identifier Consistency**:
   - Cross-references provider identifiers across claims and labels.
   - Requires that at least 50% of labeled providers have matching claims; otherwise, the pipeline aborts, preventing accidental ingestion of mismatched test files.
4. **Financial Sanity**:
   - Checks for negative reimbursement amounts or negative deductibles.

---

## 4. Leakage-Safe Partitioning Methodology

To prevent data leakage:
1. **Disjoint Provider Splitting**:
   - All claims and beneficiary records are aggregated to **one row per provider** before partitioning.
   - An 80% train / 20% test stratified split is generated (`ml_pipeline/split.py`).
   - Every split is programmatically checked (`check_split_leakage`) to ensure zero provider overlap between train and test sets.
2. **Fitted Preprocessing**:
   - Imputation medians and scaling parameters (`ml_pipeline/preprocessing.py`) are fitted exclusively on training folds.
   - Out-of-fold validation and test partitions are transformed without leaking distribution statistics.
3. **Zero In-Fold Resampling**:
   - Synthetic oversampling methods (such as SMOTE) are deliberately avoided because they distort predicted probability calibration, which is essential for financial cost modeling and Top-K investigation queues. Class imbalance is handled through algorithm-native cost weighting (`scale_pos_weight` in XGBoost; `class_weight='balanced'` in Logistic Regression and Random Forest).

---

## 5. Benchmark Evaluation Framework

Given the severe class imbalance (~9.4% positive fraud rate), accuracy is misleading and is strictly avoided as an optimization objective.

### 5.1 Primary Selection Metric: PR-AUC (Average Precision)
The primary model selection metric across 5-fold cross-validation is **PR-AUC (Precision-Recall Area Under Curve / Average Precision)**. PR-AUC evaluates the trade-off between fraud precision and fraud recall specifically on the rare positive class across all operational thresholds.

### 5.2 Heuristic Rule Baselines & Justification
Every candidate ML model is compared directly against transparent rule baselines:
- `Rule_ClaimVolume`: Ranking providers strictly by total claims filed.
- `Rule_TotalReimbursed`: Ranking providers strictly by total money reimbursed.
- `Rule_MeanReimbursed`: Ranking providers strictly by average reimbursement per claim.

**One-Standard-Error Justification Rule**: An ML model is only considered justified if its cross-validated PR-AUC exceeds the best rule baseline by more than one standard error ($SE = \sigma / \sqrt{K}$). Furthermore, model selection picks the simplest candidate within 1 SE of the top ML score.

### 5.3 Validation-Only Threshold Optimization
Decision thresholds are never selected on the test set. Out-of-fold cross-validation training probabilities drive two distinct threshold selections:
1. **Maximum F1 Threshold**: Balances precision and recall for general alerting.
2. **Cost-Aware Threshold**: Minimizes expected insurer cost:
   $$\text{Cost} = (TP + FP) \times \text{Investigation Cost} + \sum_{\text{missed fraud}} (\text{Exposure Amount} \times \text{Recovery Fraction})$$
   Sensitivity analysis is conducted across recovery fractions from 5% to 50%.

### 5.4 Operational Queue Simulation (Top-K)
Investigation teams operate under fixed monthly capacity constraints. The test set simulates queues at 1%, 5%, 10%, and 20% capacity across four strategies:
1. **Probability Ranking**: Rank by $P(\text{fraud})$ — maximizes total fraudulent providers identified.
2. **Exposure Ranking**: Rank by $P(\text{fraud}) \times \text{Total Reimbursed}$ — maximizes dollars recovered.
3. **Banded Ranking**: Stratifies providers by billing scale and ranks within size bands, preventing large providers from monopolizing investigation capacity.
4. **Rule Total Billed Only**: Simple sorting by reimbursement dollars.
5. **Random Floor**: Benchmark floor representing unprioritized audits.

### 5.5 Statistical Rigor & Confidence Intervals
All test metrics report **95% Bootstrap Confidence Intervals** (1,000 resamples) to prevent overstating performance on small test cohorts.
