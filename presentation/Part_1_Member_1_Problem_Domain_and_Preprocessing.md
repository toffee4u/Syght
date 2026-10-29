# Presentation Part 1: Overall Project Introduction & Data Pre-processing
**Presenter**: Member 1  
**Syllabus Focus**: Unit-1 Experiment 1 (Introduction to Data Pre-processing, Pandas, NumPy & Matplotlib for Data Analysis)  
**Time**: ~3 minutes  

---

### Slide 1: Overall Project Introduction (What is Syght)
- **Project Title**: Syght — Explainable Healthcare Insurance Fraud Detection Platform.
- **Problem**: Healthcare insurance fraud costs public schemes and private insurers thousands of crores each year.
- **Objective**: Build an end-to-end, reproducible machine learning system that catches fraudulent billing with sub-5ms latency.
- **Academic Scope**: Directly fulfills **Unit-1** (Data Pre-processing & AIML Algorithms) and **Unit-2** (AI Fundamentals & Azure AI Tools).

---

### Slide 2: End-to-End System Architecture
- **Layer 1 (Data Pre-processing)**: Multi-table ingestion, date parsing, and log transformation (Unit-1 Exp 1).
- **Layer 2 (Exploratory Analysis)**: Forensic trend discovery and correlation heatmaps (Unit-1 Exp 2).
- **Layer 3 (Machine Learning)**: 61 behavioral features, 5-model benchmark, LightGBM champion, and SHAP explainability (Unit-1 Exp 3 & 4).
- **Layer 4 (Cloud & Generative AI)**: Azure ML SDK v2 pipeline, 4-agent investigation system, and Clinical NLP (Unit-2 Exp 1, 2, 3).
- **Layer 5 (Web Platform)**: Production FastAPI backend and interactive React 19 dashboard.

---

### Slide 3: Multi-Table Ingestion (Pandas)
- **Inpatient Data**: 40,474 hospital admission records (dates, diagnosis codes, reimbursements).
- **Outpatient Data**: 517,737 clinic consultation records (day clinics, diagnostics, attending physicians).
- **Beneficiary Data**: 138,556 patient demographic records tracking 11 chronic illnesses.
- **Provider Ground Truth**: 5,410 unique healthcare institutions with audited fraud labels (`PotentialFraud = Yes/No`).
- **Scale**: Over 558,000 claims ingested, joined, and validated using Pandas.

---

### Slide 4: Data Cleaning & Pre-processing (Pandas)
- **Missing Value Handling**:
  - Missing deductible amounts imputed to `0.0`.
  - Missing operating physicians encoded as `'NONE'` (prevented 80% data loss from routine outpatient visits).
- **Datetime Parsing & Feature Derivation**:
  - Converted date strings to `datetime64[ns]`.
  - Derived Length of Stay (LOS): $\text{LengthOfStay} = \text{DischargeDt} - \text{AdmissionDt}$.
- **Integrity Verification**: 0 duplicate rows and 100% key overlap across provider tables.

---

### Slide 5: Skewness Handling & Visualizations (NumPy & Matplotlib)
- **NumPy Vectorization**:
  - Financial claim amounts have extreme right-skew (ranging from ₹0 to ₹10 Lakhs+).
  - Applied log1p transformation: $\text{Log\_Amount} = \log(1 + \max(\text{Amount}, 0))$.
  - Normalized skewed distributions into bell curves to ensure numerical stability during training.
- **Matplotlib Visual Analysis**:
  - Histograms generated to verify raw vs log-transformed distributions.
  - Boxplots plotted to detect financial billing outliers and verify clipping thresholds.
