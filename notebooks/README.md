# Jupyter Notebooks & Lab Manual

This directory contains the two primary notebooks and practical manual for the Healthcare Insurance Fraud Detection project (**Project Syght**):

## 🌟 The Two Primary Notebooks

1. **`syght_syllabus_model_training.ipynb` (Syllabus Lab Training & Interactive Colab Testing Engine)**
   - **Official Syllabus Implementation**: Strictly follows the practical curriculum for **Unit-1 (Experiments 1.1–1.4)** and **Unit-2 (Experiments 2.1–2.3)**.
   - **100% Standalone & Independent**: Runs entirely self-contained without needing to clone any git repository or install local packages.
   - **Direct Dataset Upload (Zero API Keys / Zero Auth Required)**: Anyone can simply upload their dataset files (or a `.zip` archive) directly in Google Colab or local environment without requiring any Kaggle API setup or GitHub authentication.
   - **Full Dataset Training**: Trains across all 5,410 healthcare providers and ~558,000 inpatient, outpatient, and beneficiary claims.
   - **12 ML Algorithm 10-Fold CV Benchmark**: Benchmarks all 12 syllabus algorithms (`LightGBM`, `GradientBoosting`, `RandomForest`, `ExtraTrees`, `AdaBoost`, `LogisticRegression`, `RidgeClassifier`, `LinearDiscriminantAnalysis`, `DecisionTree`, `KNN`, `GaussianNB`, `Dummy`) with execution times `TT (Sec)`.
   - **Direct Model Testing Studio on Google Colab**:
     - *Test 1: Interactive Provider Risk Scanner & Live Adjudication* (with plain-language SHAP drivers and 4-Agent dossiers)
     - *Test 2: Custom Facility / Claim Simulation Sandbox* (test custom claims and billing metrics)
     - *Test 3: Full Holdout Test Set Batch Evaluation* (with confusion matrix and metric reports)
     - *Test 4: One-Click Model Bundle & Deployment Zip Packaging* (triggers automatic browser download in Colab)
   - **Viva Voce Q&A**: Includes verified viva voce questions and answers for every lab experiment.

2. **`syght_model_training.ipynb` (Clean Production Model Training & Export Engine)**
   - **Pure Industrial ML Training**: Stripped of syllabus/academic coursework text, focusing purely on industrial-grade ML engineering.
   - **Full Dataset Training**: Loads all 5,410 providers and ~558,000 claims from `data/raw` or uploaded archive.
   - **19 Production Stages**:
     - Pre-flight quality audit
     - 58 behavioral engineered features
     - Zero-leakage provider partitioning (80/20)
     - 5-Fold Stratified Cross-Validation across 7 ML candidates and heuristic rule baselines
     - 1-SE model selection & feature group ablation
     - Hyperparameter tuning & out-of-fold threshold optimization
     - Single-pass frozen test set evaluation with 95% bootstrap confidence intervals
     - Global SHAP feature attribution & plain-language reason codes
     - Operational queue simulation
     - Automated export of `syght_model_bundle.joblib` and `syght_deployment_bundle.zip`

---

## 📘 Laboratory Documentation

- **`LAB_MANUAL.md`**: Formal lab experiments manual containing experiment aims, theoretical backgrounds, step-by-step methodologies on the full dataset, mathematical formulations, and viva voce questions with verified answers.
