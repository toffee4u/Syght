# Presentation Part 3: Supervised Learning, Model Benchmark & Explainability
**Presenter**: Member 3  
**Syllabus Focus**: Unit-1 Experiment 3 & Experiment 4 (Supervised Learning & Multi-Algorithm Classification)  
**Time**: ~3 minutes  

---

### Slide 1: Supervised Learning Formulation
- **Classification Task**: Supervised binary classification predicting provider status: $y \in \{0, 1\}$.
- **Engineered Feature Space**: 61 forensic behavioral features per provider (admission lengths, financial sums, duplicate ratios, physician degree).
- **Leakage-Free Splitting**:
  - Stratified 80% train / 20% test split preserving the 9.56% fraud ratio.
  - Test set kept strictly frozen for final model evaluation.
  - All preprocessing transformations fit solely on training data.

---

### Slide 2: Multi-Algorithm Benchmark (Experiment 4)
- **Algorithms Compared**:
  - *Linear Baseline*: Logistic Regression with L2 Regularization.
  - *Tree Ensembles*: Random Forest & Extra Trees.
  - *Gradient Boosting*: LightGBM, XGBoost, CatBoost.
- **Cross-Validation**: Stratified 5-Fold Cross-Validation across all models.
- **Evaluation Metric Focus**: PR-AUC (Precision-Recall Area Under Curve) and ROC-AUC due to severe class imbalance.

---

### Slide 3: Benchmark Results
| Model | PR-AUC | ROC-AUC | F1-Score | Inference Latency |
|---|:---:|:---:|:---:|:---:|
| **LightGBM (Selected Champion)** | **0.7011** | **0.9412** | **0.654** | **3.8 ms** |
| CatBoost | 0.6978 | 0.9385 | 0.648 | 8.2 ms |
| XGBoost | 0.6924 | 0.9351 | 0.641 | 6.5 ms |
| Random Forest | 0.6710 | 0.9240 | 0.622 | 12.1 ms |
| Logistic Regression | 0.5820 | 0.8650 | 0.518 | 1.1 ms |
- **Decision**: LightGBM selected for superior PR-AUC and sub-5ms real-time throughput.

---

### Slide 4: Threshold Optimization
- **Standard 0.50 Threshold**: Misses subtle fraud cases due to low baseline prevalence (9.5%).
- **Precision-Recall Curve Sweep**: Evaluated F1-score across thresholds from 0.10 to 0.90.
- **Operational Threshold**: Calibrated to **0.42**, achieving optimal balance between fraud recall and investigator workload.

---

### Slide 5: Explainable AI with SHAP
- **SHAP TreeExplainer**: Computes exact additive Shapley values for each claim prediction.
- **Top Fraud Drivers**:
  1. `pct_duplicate_bene_claims_same_day` (+0.34 SHAP)
  2. `unbundling_score` (+0.28 SHAP)
  3. `mean_inpatient_los` (+0.22 SHAP)
  4. `top_physician_concentration` (+0.19 SHAP)
- **Clinical Benefit**: Provides clear, auditable explanations for investigators rather than black-box decisions.
