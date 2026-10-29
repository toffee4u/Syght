# Presentation Part 1: Problem Domain, Healthcare Fraud Stakes & Data Pre-processing
**Presenter**: Member 1  
**Syllabus Focus**: Unit-1 Experiment 1 (Introduction to Data Pre-processing, Pandas, NumPy & Matplotlib for Data Analysis)  
**Time**: ~3 minutes  

---

### Slide 1: Project Overview & Objectives
- **System**: Syght — Explainable Healthcare Insurance Fraud Detection Platform.
- **Problem**: Healthcare fraud causes massive financial losses in public health schemes and private insurance.
- **Goal**: Real-time fraud detection with sub-5ms inference latency and clinical explainability.
- **Curriculum Alignment**: Fulfills Unit-1 (Data Pre-processing & AIML Algorithms) and Unit-2 (AI Fundamentals & Azure AI Tools).

---

### Slide 2: Real-World Healthcare Fraud Challenge
- **Severe Class Imbalance**: ~90.5% genuine claims vs ~9.5% fraudulent claims.
- **Failure of Naive Accuracy**: A naive model predicting all claims as genuine gets 90.5% accuracy but stops zero fraud.
- **Key Fraud Archetypes**:
  - *Phantom Surgeries*: Surgeries billed beyond physical doctor capacity.
  - *ICU Upcoding*: Artificially extending hospital stays to claim higher reimbursements.
  - *Unbundling*: Splitting single diagnostic procedures into multiple bills.
  - *Physician Monopoly*: A single doctor driving 90%+ of total hospital revenue.

---

### Slide 3: Multi-Table Data Architecture
- **Inpatient Data**: 40,474 hospital admission records (admission/discharge dates, diagnosis codes, reimbursements).
- **Outpatient Data**: 517,737 clinic consultation records (day clinics, diagnostics, attending physicians).
- **Beneficiary Data**: 138,556 patient demographic records tracking 11 chronic illnesses (diabetes, heart disease, etc.).
- **Ground Truth Labels**: 5,410 unique healthcare providers with audit outcome (`PotentialFraud = Yes/No`).
- **Scale**: Over 558,000 real-world healthcare records ingested using Pandas.

---

### Slide 4: Data Cleaning & Pre-processing (Pandas)
- **Missing Value Handling**:
  - Missing deductible amounts imputed to `0.0`.
  - Missing operating physicians encoded as `'NONE'` (prevented 80% data loss from routine outpatient visits).
- **Datetime Parsing & Feature Derivation**:
  - Parsed string dates into `datetime64[ns]`.
  - Derived Length of Stay (LOS): $\text{LengthOfStay} = \text{DischargeDt} - \text{AdmissionDt}$.
- **Data Integrity Checks**: Verified zero duplicate records and 100% provider identifier overlap.

---

### Slide 5: Skewness Handling & Visualizations (NumPy & Matplotlib)
- **NumPy Vectorization**:
  - Financial claim amounts have extreme right-skew (ranging from ₹0 to ₹10 Lakhs+).
  - Applied log1p transformation: $\text{Log\_Amount} = \log(1 + \max(\text{Amount}, 0))$.
  - Normalized skewed distributions into bell curves to ensure gradient stability during training.
- **Matplotlib Visualizations**:
  - Histograms generated to verify raw vs log-transformed distributions.
  - Boxplots plotted to detect financial billing outliers and verify clipping thresholds.
