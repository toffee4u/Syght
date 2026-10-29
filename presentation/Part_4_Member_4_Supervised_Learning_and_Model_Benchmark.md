# Presentation Part 4: Supervised Learning & Algorithm Benchmark
**Presenter**: Member 4  
**Syllabus Focus**: Unit-1 Experiment 3 & Experiment 4 (Supervised Learning & Multi-Algorithm Classification)  
**Point Explained**: How we developed supervised classifiers, benchmarked 5 algorithms, selected LightGBM champion (0.7011 PR-AUC), and extracted SHAP explanations.  
**Time**: ~3 minutes  

---

### Slide 1: Supervised Learning Formulation
- **Classification Task**: Supervised binary classification predicting provider fraud status: $y \in \{0, 1\}$.
- **Engineered Feature Space**: 61 forensic behavioral features per provider (stay lengths, financial sums, duplicate ratios, network degree).
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

### Slide 4: Threshold Optimization & SHAP Explainability
- **Threshold Calibration**:
  - Default 0.50 threshold misses subtle fraud cases due to low 9.5% prevalence.
  - Precision-Recall curve sweep optimized threshold to **0.42** for balanced precision and recall.
- **SHAP Feature Importance (TreeExplainer)**:
  - Top predictive drivers: `pct_duplicate_bene_claims_same_day` (+0.34), `unbundling_score` (+0.28), `mean_inpatient_los` (+0.22).
  - Provides transparent, auditable explanations for every flagged claim.

