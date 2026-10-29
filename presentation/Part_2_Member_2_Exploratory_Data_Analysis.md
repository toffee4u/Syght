# Presentation Part 2: Exploratory Data Analysis & Forensic Patterns
**Presenter**: Member 2  
**Syllabus Focus**: Unit-1 Experiment 2 (Exploratory Data Analysis to Identify Patterns, Correlations, and Trends)  
**Point Explained**: How EDA uncovered the 9.56% fraud class imbalance and exposed operational forensic billing patterns.  
**Time**: ~3 minutes  

---

### Slide 1: Ingestion Scale & Pre-Flight Quality Audit
- **Audit Verification Results**:
  - Total claims analyzed: 571,018 records (42,763 Inpatient + 528,255 Outpatient).
  - Total providers evaluated: 5,410 unique healthcare institutions.
  - Duplicate check: Exactly 0 duplicate rows across all tables.
  - Foreign key integrity: 100% clean provider ID join between claims and ground truth labels.
- **Audit Outcome**: 100% Passed pre-flight quality checks before feature engineering.

---

### Slide 2: Descriptive Statistics & Class Imbalance
- **Severe Class Imbalance**:
  - Legitimate Providers (0): 4,904 facilities (90.44%).
  - Fraudulent Providers (1): 506 facilities (9.56%).
  - Baseline fraud prevalence: ~1 in 10 providers.
- **Behavioral Comparison (Mean Values)**:
  - *Claim Volume*: Honest = 96 claims vs Fraud = 422 claims (**4.4x higher**).
  - *Total Reimbursements*: Honest = ₹1.82 Lakhs vs Fraud = ₹14.80 Lakhs (**8.1x higher**).
  - *Mean Inpatient Stay*: Honest = 2.4 days vs Fraud = 11.8 days (**4.9x higher**).
  - *Physician Monopoly Rate*: Honest = 21% vs Fraud = 88% (**4.2x higher**).

---

### Slide 3: Correlation & Trend Analysis
- **Pearson & Spearman Heatmaps**:
  - Strong positive correlation between claim volume and total reimbursement ($r = 0.82$).
  - Notable positive correlation with fraud: Same-day duplicate billing ($r = 0.64$) and Length of Stay ($r = 0.58$).
  - Near-zero correlation with patient demographics: Proves fraud is driven by **provider billing behavior**, not patient backgrounds.
- **Visuals**: Seaborn correlation heatmaps used to filter out redundant collinear features.

---

### Slide 4: Key Forensic Patterns Discovered
- **Pattern 1 (Unbundling Anomalies)**:
  - Suspicious clinics bill same-day duplicate visits for the same patient in >25% of cases.
  - Splitting single treatment packages into separate bills to extract higher reimbursements.
- **Pattern 2 (Artificial Stay Extensions)**:
  - Unusually long hospitalizations for minor diagnoses to exhaust package caps.
- **Pattern 3 (Doctor Collusion)**:
  - Single attending physicians generating almost all billing at multiple linked facilities.
