# 🩺 Syght — Healthcare Insurance Fraud Detection System

[![Team: Team Pulse](https://img.shields.io/badge/Team-Team%20Pulse-7928CA?style=for-the-badge)](#)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](#)
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/toffee4u/Syght/blob/main/notebooks/syght_syllabus_model_training.ipynb)

> Engineered by **Team Pulse** • Explainable Machine Learning, Syllabus-Aligned Training Pipeline & Real-Time Pre-Authorization Fraud Detection Platform.

---

## 📌 Project Overview

**Syght** is an enterprise-grade machine learning system designed to detect fraudulent billing practices, unbundling, upcoding, phantom procedures, and hospital collusion rings in healthcare insurance claims.

In real-world healthcare insurance, fraud accounts for only **~9.4% of total claims**, creating an extreme class imbalance where standard accuracy metrics are deceptive. Syght addresses this by:
1. Transforming raw, multi-table claims data into **58 behavioral forensic features**.
2. Training and benchmarking **12 supervised classification algorithms** using Stratified 10-Fold Cross-Validation according to the prescribed course syllabus.
3. Deploying a calibrated **LightGBM champion model** with sub-5ms inference latency and transparent **SHAP explainability**.
4. Providing a modern, interactive **React web dashboard** with real-time pre-authorization simulation, review queues, and collusion network visualization.
5. Providing an interactive **Google Colab Direct Model Testing Studio** for live single-provider risk inspection and custom facility simulation.

---

## 🚀 Key Features

- **⚡ Real-Time Pre-Auth Gateway**: Evaluates incoming insurance claims in under 5ms, returning an automated approval or investigation hold recommendation.
- **🔍 Explainable AI (SHAP Waterfall)**: Provides an exact breakdown of feature contributions for each flagged provider, showing auditors *why* a claim was marked suspicious in plain language.
- **🕸️ Collusion Network Graph**: Force-directed network visualizer that exposes doctor-sharing cartels and patient funneling across multiple facilities.
- **📁 Dataset Studio**: In-browser dataset scanner supporting multi-table, single-claim, and custom CSV uploads with a built-in AI sample data prompt generator.
- **🤖 Autonomous AI Investigation Agents**: Multi-agent triage pipeline that synthesizes findings from clinical, statistical, and network perspectives into audit reports.
- **🎯 Google Colab Direct Testing Studio**: Run live fraud risk scans on any provider ID or test custom facility metrics directly in your browser with zero setup.

---

## 📐 System Architecture

```text
[Multi-Table Claims Data]
 (Inpatient + Outpatient + Beneficiary + Provider Labels: ~558,211 Claims, 5,410 Providers)
           │
           ▼
[Data Pre-processing & Feature Engineering]
 (Pandas Cleaning, LOS Derivation, Log1p Normalization, 58 Forensic Features)
           │
           ▼
[Syllabus Supervised Machine Learning Benchmark]
 (Stratified 10-Fold CV: Naive Bayes, Logistic Reg, Ridge, Trees, RF, ExtraTrees, GBM, AdaBoost, LightGBM)
           │
           ▼
[Selected Champion: LightGBM (1-SE Rule Winner, Optimal Calibrated Threshold)]
           │
           ▼
[Production Backend & Explainability]
 (FastAPI REST Service, SHAP TreeExplainer, Azure ML SDK v2 Spec, 4-Agent Orchestrator)
           │
           ▼
[Interactive Web Application & Colab Testing Studio]
 (React 19 + Vite Dashboard & Google Colab Interactive Inference Studio)
```

---

## 📊 Dataset & Pre-processing

The model is trained and evaluated on the full official CMS Medicare Healthcare Provider claims dataset:
- **`Train_Inpatientdata.csv`** (40,474 records): Hospital admission/discharge dates, diagnosis codes, and reimbursement sums.
- **`Train_Outpatientdata.csv`** (517,737 records): Clinic consultations, diagnostic tests, and attending physicians.
- **`Train_Beneficiarydata.csv`** (138,556 profiles): Patient demographic histories tracking 11 chronic illnesses.
- **`Train.csv`** (5,410 facilities): Historical audit labels (`PotentialFraud = Yes/No`).
- **`Test.csv`**: Unseen holdout evaluation dataset.

### Pre-processing Steps:
1. **Missing Values**: Imputed missing deductible amounts to `0.0`; encoded missing operating physicians as `'NONE'` to prevent 80% data loss in outpatient records.
2. **Datetime Arithmetic**: Derived patient **Length of Stay (LOS)**: $\text{LengthOfStay} = \text{DischargeDt} - \text{AdmissionDt}$.
3. **Distribution Normalization**: Financial reimbursements exhibit heavy right-skewness. Vectorized NumPy log-transformation was applied: $\text{LogAmount} = \log(1 + \max(\text{Amount}, 0))$.
4. **Ethical Assertion**: Patient demographic columns (`Gender`, `Race`, `DOB`) are strictly excluded from model features to eliminate disparate impact.

---

## 🎓 Syllabus Alignment: Practical Lab Curriculum

This project strictly implements the official university syllabus for **Data Pre-processing, AIML Algorithms, and Azure AI Tools**:

### Unit-1: Data Pre-processing and AIML Algorithms
- **Experiment 1.1 (CO1, CO2)**: *Introduction to Data Pre-processing, Pandas, NumPy & Matplotlib for Data Analysis*  
  Multi-table CSV ingestion, schema validation (`df.info()`, `df.describe()`), missing value imputation (`df.isnull().sum()`), NumPy array operations, correlation coefficients (`np.corrcoef`), Length of Stay derivation, vectorized $\log(1+x)$ transformations, and Matplotlib plotting (telemetry line plots, specialty claim bar charts, audit pie charts, distribution histograms).
- **Experiment 1.2 (CO2)**: *Perform Exploratory Data Analysis (EDA) on a Real-World Dataset*  
  Comprehensive EDA across all 5,410 providers and ~558,000 claims, ~9.4% fraud base rate analysis, Pearson correlation matrices, Seaborn `coolwarm` heatmaps, reimbursement outlier boxplots, and claim volume vs financial scatter plots.
- **Experiment 1.3 (CO3)**: *Understand Supervised Learning to Train and Develop Classifier Models*  
  58 behavioral feature engineering, zero-leakage 80/20 train/test provider split (`check_split_leakage`), feature standardization (`StandardScaler`), Gaussian Naive Bayes (`GaussianNB`), 10-Fold Stratified Cross-Validation (`StratifiedKFold(n_splits=10)`), Actual vs Predicted comparison tables, and full metrics (Accuracy, Precision, Recall, F1, ROC-AUC, PR-AUC, Cohen's Kappa, MCC).
- **Experiment 1.4 (CO3)**: *Build a Classification Model by Using Different Machine Learning Algorithms*  
  10-Fold Stratified CV benchmarking across 12 classification algorithms from the syllabus (`GaussianNB`, `LogisticRegression`, `RidgeClassifier`, `DecisionTreeClassifier`, `KNeighborsClassifier`, `RandomForestClassifier`, `ExtraTreesClassifier`, `GradientBoostingClassifier`, `AdaBoostClassifier`, `LinearDiscriminantAnalysis`, `DummyClassifier`, `LightGBM`), execution times `TT (Sec)`, sorted comparison table, 1-SE champion model selection, optimal decision threshold tuning, and model bundle export.

### Unit-2: AI and Machine Learning Fundamentals with Azure AI Tools
- **Experiment 2.1 (CO1)**: *Introduction to Artificial Intelligence and Machine Learning Concepts (Responsible AI)*  
  Demonstrating Responsible AI principles: Fairness selection rate comparison across groups, Syght ethical demographic check (zero disparate impact), and prediction reliability & variance audits.
- **Experiment 2.2 (CO1)**: *Understanding Azure Machine Learning, Generative AI Models, and AI Agent Systems*  
  10 syllabus code implementations: tokenization, token IDs, next-word prediction, embeddings & cosine similarity, system vs user prompts, conversation history, RAG prompt injection on medical policy, tool use, single agent selection, and autonomous 4-agent collaborative fraud investigation (`HealthFraudAgentSystem`).
- **Experiment 2.3 (CO4)**: *Exploring Generative AI, Natural Language Processing, and Azure AI Tools*  
  Text analysis with `TfidfVectorizer` on medical records, pre-trained HuggingFace DistilBERT pipeline (`distilbert-base-uncased-finetuned-sst-2-english`) for doctor note sentiment/risk classification with Seaborn countplot, and Clinical Notes Semantic Concordance Analyzer detecting Upcoding and Phantom Billing.

---

## 🏆 Multi-Algorithm Benchmark Comparison

All algorithms benchmarked under uniform 10-Fold Stratified Cross-Validation on the full training dataset:

| Model | Accuracy | AUC | Recall | Precision | F1 Score | Kappa | MCC | TT (Sec) | Status |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **LightGBM** | **0.9385** | **0.9470** | **0.5824** | **0.7241** | **0.6455** | **0.6120** | **0.6185** | **2.8s** | **Production Champion** |
| Random Forest | 0.9340 | 0.9489 | 0.4480 | 0.7712 | 0.5668 | 0.5340 | 0.5582 | 4.2s | Bagging Ensemble |
| Extra Trees | 0.9325 | 0.9430 | 0.4210 | 0.7650 | 0.5431 | 0.5102 | 0.5370 | 3.5s | Randomized Ensemble |
| Gradient Boosting | 0.9310 | 0.9443 | 0.5420 | 0.6650 | 0.5971 | 0.5612 | 0.5684 | 14.1s | Boosting Ensemble |
| AdaBoost | 0.9280 | 0.9360 | 0.4950 | 0.6510 | 0.5624 | 0.5240 | 0.5321 | 8.6s | Boosting Ensemble |
| Logistic Regression | 0.8840 | 0.9451 | 0.8620 | 0.4410 | 0.5835 | 0.5210 | 0.5610 | 1.8s | Balanced Linear |
| Decision Tree | 0.9150 | 0.8250 | 0.5120 | 0.5430 | 0.5270 | 0.4780 | 0.4795 | 0.9s | Single Tree |
| K-Nearest Neighbors | 0.9120 | 0.8410 | 0.2840 | 0.5820 | 0.3820 | 0.3410 | 0.3680 | 1.2s | Distance Based |
| Linear Discriminant | 0.9140 | 0.9240 | 0.4120 | 0.5610 | 0.4750 | 0.4310 | 0.4420 | 0.6s | Linear Separator |
| Naive Bayes | 0.8720 | 0.8820 | 0.7810 | 0.4050 | 0.5335 | 0.4620 | 0.5050 | 0.3s | Probabilistic Baseline |
| Dummy Classifier | 0.9060 | 0.5000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.1s | Majority Baseline |

---

## 📓 The 2 Main Notebooks

Syght provides two distinct, purpose-built notebooks in [`notebooks/`](notebooks/):

1. **[`syght_syllabus_model_training.ipynb`](notebooks/syght_syllabus_model_training.ipynb) (Syllabus Model Training & Interactive Colab Testing Engine)**
   - **Academic Syllabus**: Implements Experiments 1.1 to 2.3 on the **FULL dataset** (~558,000 claims, 5,410 providers).
   - **Colab Direct Testing Studio**: Run live risk assessments on any provider ID (`inspect_provider`), simulate custom hospital billing metrics (`test_custom_facility`), run holdout batch evaluation, and download the trained model bundle with 1 click.
   - **Open in Colab**: Click the Colab badge at the top of the notebook to run immediately in your browser!

2. **[`syght_model_training.ipynb`](notebooks/syght_model_training.ipynb) (Clean Production Model Training Engine)**
   - **Pure ML Training**: Stripped of syllabus/academic coursework text, focusing purely on 19 production ML engineering stages: data audit, 58 feature engineering, zero-leakage split, 5-fold CV, 1-SE selection, tuning, threshold optimization, SHAP explainability, queue simulation, and model bundle export.

---

## ⚡ Quickstart

### 1. Prerequisites & Installation
Ensure you have **Python 3.11+** and **Node.js 18+** installed:

```bash
# Clone the repository
git clone https://github.com/toffee4u/Syght.git
cd Syght

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Run Backend Server
```bash
uvicorn backend.main:app --reload --port 8000
```
- API Documentation (Swagger): `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### 3. Run Frontend Dashboard
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Run Test Suite
```bash
pytest
```

---

## 📁 Repository Structure

```text
Syght/
├── backend/                  # FastAPI REST API services and schemas
├── data/                     # Raw and sample healthcare claims datasets (~558,000 claims)
├── frontend/                 # React 19 + Vite + Tailwind CSS dashboard
├── ml_pipeline/              # Feature engineering, model training, and evaluation code
├── models/                   # Serialized LightGBM model bundle (syght_model_bundle.joblib)
├── notebooks/                # Experiment notebooks and lab manual
│   ├── LAB_MANUAL.md         # Comprehensive lab manual & viva questions
│   ├── syght_syllabus_model_training.ipynb  # Syllabus training & Colab testing studio
│   └── syght_model_training.ipynb           # Clean production model training engine
├── presentation/             # 5-member slide decks and presentation guide
├── reports/                  # Model benchmark reports, figures, and ROC/PR curves
├── sample_datasets/          # Test CSV and JSON batches for web app scanning
├── scripts/                  # Utility scripts for data downloading and testing
├── tests/                    # Automated pytest test suite
└── requirements.txt          # Python package dependencies
```

---

## 🛠️ Tech Stack

- **Machine Learning**: LightGBM, XGBoost, Scikit-learn, SHAP, Imbalanced-learn
- **Natural Language Processing**: HuggingFace Transformers, PyTorch, TF-IDF
- **Data Engineering**: Pandas, NumPy, SciPy
- **Backend**: FastAPI, Uvicorn, Pydantic v2
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Chart.js
- **Testing**: Pytest, HTTPX
