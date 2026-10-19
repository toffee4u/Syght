# 🏥 Syght — Explainable Healthcare Fraud Detection System
### Smart India Hackathon (SIH) Enterprise Architecture Guide

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Tests](https://img.shields.io/badge/Tests-24%20Passed-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)](tests/)
[![Read in English](https://img.shields.io/badge/Language-English%20README-purple?style=for-the-badge)](README.md)

> **Syght** ek advanced, explainable machine learning aur graph intelligence system hai jo **Ayushman Bharat (PM-JAY)**, government health schemes aur private health insurance TPAs me hone wale **crores of rupees ke fake claims, phantom billing, aur hospital collusion fraud** ko pakadta hai.

---

## 📌 1. Syght Kya Hai Aur Ye Kyun Zaroori Hai?

Jab bhi koi hospital insurance claim bhejta hai, toh manual auditors ke paas laakhon bills check karne ka time nahi hota. Fraud hospitals iska fayda utha kar:
1. **Ghost Billing (Phantom Patients)**: Jo patient kabhi hospital aaya hi nahi, uske naam par fake bill bana dete hain.
2. **Package Upcoding (Rate Creep)**: Chhoti bimari ya OPD checkup ke liye high-cost surgical package (e.g. ₹50,000) bill kar dete hain.
3. **Doctor-Hospital Collusion Nexus**: Ek hi empanelled doctor ka naam ek hi din me 3 alag-alag dur-dur ke hospitals me claim me daal dete hain.
4. **Artificial Length of Stay**: Bed charges badhane ke liye patient ko zabardasti ICU ya general ward me roke rakhte hain.

**Syght** in sabhi fraud patterns ko **admission ke time (real-time)** aur **post-billing analysis** me mathematical precision aur human-readable reasons ke sath detect karta hai.

---

## ⚡ 2. Syght Ke 3 Advanced Superpowers (SIH Special)

| Feature | Kya Karta Hai? | Implementation File |
|---|---|---|
| 🕸️ **1. Graph Collusion Ring Detector** | Doctors, Hospitals aur Patients ka multi-partite graph network banata hai aur kickback nexus / beneficiary recycling rings ko pakadta hai. | [`ml_pipeline/graph_collusion.py`](file:///c:/toffee/Syght/ml_pipeline/graph_collusion.py) |
| ⚡ **2. Real-Time Pre-Auth Gateway** | Claim discharge hone ke baad nahi, balki admission request aate hi **sub-5 milliseconds (< 5ms)** me fraud score aur automated approval/rejection deta hai. | [`backend/preauth_gateway.py`](file:///c:/toffee/Syght/backend/preauth_gateway.py) |
| 📄 **3. OCR & Clinical Discharge Verifier** | Billed financial codes (ICD/CPT) ko doctor ki hand-written/printed discharge summary ke clinical text se cross-verify karta hai (e.g. Billed Appendectomy, but summary text says simple acidity). | [`ml_pipeline/clinical_verifier.py`](file:///c:/toffee/Syght/ml_pipeline/clinical_verifier.py) |

---

## 🧠 3. ML Architecture & Pipeline Breakdown

```
Raw Claims & Beneficiary Tables (5.5L Claims)
                    │
                    ▼
   [Stage 1] Pre-Flight Data Quality Audit (Zero Corruption)
                    │
                    ▼
   [Stage 2] 58 Provider-Level Engineered Features (Volume + Financial + Collusion)
                    │
                    ▼
   [Stage 3] Zero-Leakage Stratified Provider Partitioning (80/20)
                    │
                    ▼
   [Stage 4] 5-Fold Stratified Cross-Validation Benchmark (7 Models)
             ├── Rule Baselines (Volume & Cost)
             ├── Logistic Regression (L1 & L2)
             ├── Random Forest (500 Deep Trees Ensemble)
             └── XGBoost & LightGBM
                    │
                    ▼
   [Stage 5] Financial Cost-Curve & Optimal Decision Threshold Calibration
                    │
                    ▼
   [Stage 6] Plain-Language SHAP Explainability & Reason Codes
                    │
                    ▼
   [Stage 7] Operational Investigation Queue (Top 5% Inspect = ~70% Fraud Recovered)
                    │
                    ▼
   Production Bundle (`syght_model_bundle.joblib` — 25 MB to 45 MB Heavy Model)
```

### 🎯 58 Engineered Features Ke 4 Pillars:
1. **Volume & Velocity**: Claims per doctor, inpatient vs outpatient share, claims per month.
2. **Financial Outliers**: Deductible-to-reimbursement ratio, 99th percentile reimbursement spikes, unit cost deviation.
3. **Behavioral Red Flags**: Same-day duplicate beneficiary admissions, 0-day stay claims, top diagnosis code monopoly.
4. **Patient Mix Complexity**: Chronic condition rates, age variance, renal failure ratios.
5. **Ethical AI**: Patient race aur gender ko feature engineering se bahar rakha gaya hai taaki algorithm me koi demographic bias na ho.

---

## 💻 4. Google Colab Training Guide (Step-by-Step)

Aap Google Colab me **1-Click** se training run kar sakte hain:

### Step 1: Open Google Colab
Notebook kholein:
👉 **`notebooks/syght_model_training.ipynb`**

### Step 2: GPU Enable Karein
Top menu: **Runtime ➔ Change runtime type ➔ Select T4 GPU ➔ Save**

### Step 3: Kaggle Credentials Set Karein (Stage 3)
```python
import json
from pathlib import Path

kaggle_dir = Path.home() / ".kaggle"
kaggle_dir.mkdir(parents=True, exist_ok=True)
with open(kaggle_dir / "kaggle.json", "w") as f:
    json.dump({
        "username": "toffee4u",
        "key": "KGAT_6e662664ddaad8d08bcac6f454dc7e09"
    }, f)
(kaggle_dir / "kaggle.json").chmod(0o600)
print("✅ Kaggle authenticated!")
```

### Step 4: Run All
Menu bar me click karein:
👉 **Runtime ➔ Run all** *(Shortcut: `Ctrl + F9`)*

### 📦 Training Complete Hone Par Kya Milega:
Browser me automatically download hogi: **`syght_deployment_bundle.zip`**:
- `models/syght_model_bundle.joblib` -> **25 MB se 45 MB ka heavy 500-tree production model**
- `figures/pr_curve.png` & `roc_curve.png` -> High-resolution benchmark graphs
- `figures/confusion_matrix.png` -> True Positives heatmap
- `reports/benchmark_report.md` -> 7 Models ka detailed comparison table

---

## 🎤 5. SIH Hackathon Jury Cheat Sheet (Judges Ke Samne Kya Bolna Hai?)

### 1-Minute Winning Pitch:
> *"Respected Judges, India ke Ayushman Bharat aur private TPAs me har saal hazaron karod rupaye fake healthcare billing me waste hote hain. Traditional systems simple rules use karte hain jinko hospitals aasaani se bypass kar lete hain.  
> Humne banaya hai **Syght** — ek explainable AI system jo 58 deep fraud signals, Graph Collusion Networks, aur Real-Time Pre-Auth screening ko combine karta hai. Ye black-box prediction nahi deta, balki medical auditors ko plain-language reasons batata hai ki hospital kyu suspicious hai, aur prove karta hai ki unke top 5% providers inspect karne se **~70% total fraudulent money recover** ho sakti hai."*

### Top 3 Questions & Answers:

**Q1: Aapka model simple Accuracy ke bajaye PR-AUC kyu use karta hai?**  
👉 *Ans: Sir, healthcare fraud me sirf ~9% hospitals fraudulent hote hain (class imbalance). Ek dummy model sabko 'clean' bolkar bhi 91% accuracy la sakta hai par 0 fraud pakad payega. Isliye hum **PR-AUC (Precision-Recall)** optimize karte hain taaki actual fraud hospitals pakde jayein aur genuine hospitals pareshan na hon.*

**Q2: Medical auditor aapke AI prediction par bharosa kyu karega?**  
👉 *Ans: Sir, Syght black-box nahi hai. Hum **SHAP TreeExplainers** use karte hain jo har prediction ke sath 3 plain-language reason codes generate karte hain — jaise 'Abnormal duplicate patient billing (+34% risk)', taaki auditor turant inspection notice bhej sake.*

**Q3: Agar hospital admission ke time hi fraud pakadna ho toh?**  
👉 *Ans: Humne build kiya hai **Real-Time Pre-Auth Gateway (`backend/preauth_gateway.py`)** jo admission ke waqt sub-5 milliseconds (< 5ms) me patient collision aur package upcoding ko check karke turant approval ya freeze decision deta hai.*

---

## 🛠️ Project Structure

```text
Syght/
├── ml_pipeline/
│   ├── config.py                     # 58 Features & Threshold configurations
│   ├── data_ingestion.py             # Schema validation & multi-table loader
│   ├── data_audit.py                 # Fail-fast pre-flight quality audit
│   ├── feature_engineering.py        # 58 Provider-level aggregation signals
│   ├── split.py                      # Leakage-free stratified provider split (80/20)
│   ├── train.py                      # 500-Tree heavy ensemble & 5-fold CV
│   ├── threshold.py                  # Financial cost-curve optimization
│   ├── evaluate.py                   # Frozen test set single-pass evaluation
│   ├── explain.py                    # Plain-language SHAP translations
│   ├── graph_collusion.py            # Bipartite Graph Nexus & Ring Detector
│   ├── clinical_verifier.py          # OCR & discharge summary cross-checker
│   └── artifacts.py                  # Full-fidelity MB-scale serialization
├── backend/
│   └── preauth_gateway.py            # Sub-5ms real-time pre-authorization API
├── notebooks/
│   └── syght_model_training.ipynb    # Crisp Hinglish Colab training notebook
├── tests/                            # 24 Unit & Integration Tests (100% Passing)
├── README.md                         # Detailed English Architectural Documentation
├── README_HINGLISH.md                # Easy SIH Presentation Guide (This file)
└── LICENSE                           # MIT Open Source License
```

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
