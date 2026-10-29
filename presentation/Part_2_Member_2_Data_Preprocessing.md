# Presentation Part 2: Data Pre-processing, Pandas, NumPy & Matplotlib
**Presenter**: Member 2  
**Syllabus Focus**: Unit-1 Experiment 1 (Introduction to Data Pre-processing, Pandas, NumPy & Matplotlib for Data Analysis)  
**Point Explained**: Multi-Table Ingestion, Data Cleaning, Length of Stay Derivation & Distribution Normalization.  
**Time**: ~3 minutes  

---

### Slide 1: Multi-Table Ingestion Architecture (Pandas)
- **Ingestion Sources**:
  - `Train_Inpatientdata.csv`: 40,474 admission records (admission/discharge dates, diagnosis codes, reimbursements).
  - `Train_Outpatientdata.csv`: 517,737 clinic consultation records (day clinics, diagnostics, attending physicians).
  - `Train_Beneficiarydata.csv`: 138,556 patient demographic records tracking 11 chronic illnesses.
  - `Train.csv`: 5,410 unique healthcare providers with audited ground truth labels (`PotentialFraud = Yes/No`).
- **Scale**: Over 558,000 real-world healthcare records ingested, merged, and validated using Pandas.

---

### Slide 2: Data Cleaning & Pre-processing (Pandas)
- **Missing Value Handling**:
  - Missing deductible amounts imputed to `0.0`.
  - Missing operating physicians encoded as `'NONE'` (prevented 80% data loss from routine outpatient visits).
- **Datetime Parsing & Feature Derivation**:
  - Converted date strings to `datetime64[ns]`.
  - Derived Length of Stay (LOS): $\text{LengthOfStay} = \text{DischargeDt} - \text{AdmissionDt}$.
- **Integrity Verification**: 0 duplicate rows detected and 100% key join overlap across provider tables.

---

### Slide 3: Skewness Handling with NumPy Vectorization
- **Financial Distribution Challenge**:
  - Claim reimbursement amounts exhibit extreme right-skew (ranging from ₹0 to ₹10 Lakhs+).
  - Skewed distributions cause gradient instability and poor convergence during model training.
- **Log1p Transformation**:
  - Applied vectorized NumPy calculation: $\text{Log\_Amount} = \log(1 + \max(\text{Amount}, 0))$.
  - Transformed heavily skewed financial amounts into approximately normal bell-curve distributions.

---

### Slide 4: Matplotlib Visual Analysis
- **Distribution Histograms**: Visualized raw vs log-transformed reimbursements to confirm variance stabilization.
- **Outlier Boxplots**: Identified extreme billing anomalies and confirmed feature clipping thresholds.
- **Provider Aggregations**: Calculated zero-division safe sums, averages, and ratio features for downstream modeling.

