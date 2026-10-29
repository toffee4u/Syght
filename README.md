# 🩺 Syght — Healthcare Insurance Fraud Detection System

[![Team: Team Pulse](https://img.shields.io/badge/Team-Team%20Pulse-7928CA?style=for-the-badge)](#)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](#)

> Engineered by **Team Pulse** • Explainable Machine Learning & Real-Time Pre-Authorization Fraud Detection Platform.

---

## 📌 Project Overview

**Syght** is an end-to-end machine learning system designed to detect fraudulent billing practices, phantom procedures, and hospital collusion rings in healthcare insurance claims.

In real-world health insurance, fraud accounts for only **~9.5% of total claims**, creating an extreme class imbalance where standard accuracy metrics are deceptive. Syght addresses this by:
1. Transforming raw, multi-table claims data into **61 forensic behavioral features**.
2. Training and benchmarking **5 supervised classification algorithms** using Stratified 5-Fold Cross-Validation.
3. Deploying a calibrated **LightGBM champion model** with sub-5ms inference latency and transparent **SHAP explainability**.
4. Providing a modern, interactive **React web dashboard** with real-time pre-authorization simulation and collusion network visualization.

---

## 🚀 Key Features

- **⚡ Real-Time Pre-Auth Gateway**: Evaluates incoming insurance claims in under 5ms, returning an automated approval or investigation hold recommendation.
- **🔍 Explainable AI (SHAP Waterfall)**: Provides an exact breakdown of feature contributions for each flagged provider, showing auditors *why* a claim was marked suspicious.
- **🕸️ Collusion Network Graph**: Force-directed network visualizer that exposes doctor-sharing cartels and patient funneling across multiple facilities.
- **📁 Dataset Studio**: In-browser dataset scanner supporting multi-table, single-claim, and custom CSV uploads with a built-in AI sample data prompt generator.
- **🤖 Autonomous AI Investigation Agents**: Multi-agent triage pipeline that synthesizes findings from clinical, statistical, and network perspectives into audit reports.

---

## 📐 System Architecture

```text
[Multi-Table Claims Data]
 (Inpatient + Outpatient + Beneficiary + Provider Labels)
           │
           ▼
[Data Pre-processing & Feature Engineering]
 (Pandas Cleaning, LOS Derivation, Log1p Normalization, 61 Forensic Features)
           │
           ▼
[Supervised Machine Learning Benchmark]
 (Stratified 5-Fold CV: Logistic Reg, Random Forest, XGBoost, CatBoost, LightGBM)
           │
           ▼
[Selected Champion: LightGBM (0.7011 PR-AUC, Threshold = 0.42)]
           │
           ▼
[Production Backend & Explainability]
 (FastAPI REST Service, SHAP TreeExplainer, Azure ML SDK v2 Spec)
           │
           ▼
[Interactive Web Application]
 (React 19 + Vite + Tailwind CSS: Pre-Auth Gateway, Review Queue, Network Graph)
```

---

## 📊 Dataset & Pre-processing

The model is trained and evaluated on real-world multi-table healthcare claims:
- **`Train_Inpatientdata.csv`** (40,474 records): Hospital admission/discharge dates, diagnosis codes, and reimbursement sums.
- **`Train_Outpatientdata.csv`** (517,737 records): Clinic consultations, diagnostic tests, and attending physicians.
- **`Train_Beneficiarydata.csv`** (138,556 profiles): Patient demographic histories tracking 11 chronic illnesses.
- **`Train.csv`** (5,410 facilities): Historical audit labels (`PotentialFraud = Yes/No`).

### Pre-processing Steps:
1. **Missing Values**: Imputed missing deductible amounts to `0.0`; encoded missing operating physicians as `'NONE'` to prevent 80% data loss in outpatient records.
2. **Datetime Arithmetic**: Derived patient **Length of Stay (LOS)**: $\text{LengthOfStay} = \text{DischargeDt} - \text{AdmissionDt}$.
3. **Distribution Normalization**: Financial reimbursements exhibit heavy right-skewness. Vectorized NumPy log-transformation was applied: $\text{Log\_Amount} = \log(1 + \max(\text{Amount}, 0))$.

---

## 🏆 Model Benchmark & Evaluation

Models were evaluated across **Stratified 5-Fold Cross-Validation** and a strictly frozen test set (1,132 providers) using **PR-AUC** (Precision-Recall AUC) as the primary metric due to the 9.5% fraud prevalence.

| Model Architecture | PR-AUC | ROC-AUC | F1-Score | Inference Latency | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| **LightGBM (Selected Champion)** | **0.7011** | **0.9412** | **0.654** | **3.8 ms** | **Production Champion** |
| CatBoost | 0.6978 | 0.9385 | 0.648 | 8.2 ms | Candidate |
| XGBoost | 0.6924 | 0.9351 | 0.641 | 6.5 ms | Candidate |
| Random Forest | 0.6710 | 0.9240 | 0.622 | 12.1 ms | Baseline |
| Logistic Regression | 0.5820 | 0.8650 | 0.518 | 1.1 ms | Linear Baseline |

* **Optimal Decision Threshold**: Calibrated to **0.42** (maximizing F1-score on imbalanced data).
* **Top SHAP Predictive Drivers**: `pct_duplicate_bene_claims_same_day` (+0.34), `unbundling_score` (+0.28), `mean_inpatient_los` (+0.22), `top_physician_concentration` (+0.19).

---

## 📓 Notebooks & Lab Experiments

All experimental notebooks, data preprocessing code, and the lab manual are organized in the [`notebooks/`](notebooks/) directory:
- **`notebooks/experiments/`**: Step-by-step experiment notebooks covering Data Pre-processing, Exploratory Data Analysis, Classifier Development, Model Benchmark, AI Concepts, Azure ML, and Clinical NLP.
- **`notebooks/syght_model_training.ipynb`**: Master training notebook demonstrating the complete pipeline from raw CSV ingestion to model evaluation and LightGBM artifact export.
- **`notebooks/LAB_MANUAL.md`**: Complete experiment guide with theoretical foundations, algorithms, and viva questions.

---

## 👥 Presentation Slides

The presentation decks for the project are located in the [`presentation/`](presentation/) directory, structured for team members:
- **Part 1**: Overall Project Introduction & Architecture
- **Part 2**: Data Pre-processing, Pandas, NumPy & Matplotlib
- **Part 3**: Exploratory Data Analysis & Forensic Patterns
- **Part 4**: Supervised Learning & Algorithm Benchmark
- **Part 5**: AI Concepts, Azure AI Tools, Clinical NLP & Live Demo

See [`presentation/README.md`](presentation/README.md) for the complete agenda and slide links.

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
├── data/                     # Raw and sample healthcare claims datasets
├── frontend/                 # React 19 + Vite + Tailwind CSS dashboard
├── ml_pipeline/              # Feature engineering, model training, and evaluation code
├── models/                   # Serialized LightGBM model bundle (syght_model_bundle.joblib)
├── notebooks/                # Experiment notebooks and LAB_MANUAL.md
│   ├── experiments/          # Dedicated lab notebooks (Exp 1 to Exp 7)
│   ├── LAB_MANUAL.md         # Comprehensive lab manual & viva questions
│   └── syght_model_training.ipynb
├── presentation/             # 5-member slide decks and presentation guide
├── reports/                  # Model benchmark reports, figures, and ROC/PR curves
├── sample_datasets/          # Test CSV and JSON batches for web app scanning
├── scripts/                  # Utility scripts for data downloading and testing
├── tests/                    # Automated pytest test suite
└── requirements.txt          # Python package dependencies
```

---

## 🛠️ Tech Stack

- **Machine Learning**: LightGBM, XGBoost, CatBoost, Scikit-learn, SHAP, Imbalanced-learn
- **Data Engineering**: Pandas, NumPy, SciPy
- **Backend**: FastAPI, Uvicorn, Pydantic v2
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Chart.js
- **Testing**: Pytest, HTTPX
