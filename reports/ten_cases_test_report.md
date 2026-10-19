# Syght — 10 Multi-Scenario Insurance Fraud Benchmark Test Report

- **Evaluated Model**: `LightGBM`
- **Operating Decision Threshold**: `0.5364`
- **Features Analyzed**: `61 Advanced Features (Clinical, Financial, Graph Collusion, Temporal)`
- **Overall Test Accuracy**: `100.0%` (10/10 cases correctly classified)
- **Fraud Precision / Recall**: Precision = `100.0%`, Recall = `100.0%`

---

## 📋 Comprehensive 10-Case Benchmark Results

| Provider ID                        | Scenario                                         | Ground Truth          |   Claims | Reimbursement   | Risk Score   | AI Decision       | Priority   | Primary SHAP Reasons                                                                                                               |
|:-----------------------------------|:-------------------------------------------------|:----------------------|---------:|:----------------|:-------------|:------------------|:-----------|:-----------------------------------------------------------------------------------------------------------------------------------|
| PRV_01_RURAL_PRIMARY_CLINIC        | Rural Ayushman Bharat Primary Center             | LEGITIMATE (Clean)    |      120 | $38,000         | 0.0%         | AUTO-CLEARED      | LOW        | Claims Per Operating Physician = 40.0 (SHAP +1.72) | Average patient deductible billed per claim = 37.5 (SHAP +0.71)               |
| PRV_02_PHANTOM_SURGERY_MILL        | Ghost Surgeries & Phantom ICU Inpatient Billing  | FRAUD (Critical Risk) |      520 | $5,100,000      | 100.0%       | FLAGGED FOR AUDIT | CRITICAL   | Total inpatient hospital admissions billed = 460.0 (SHAP +5.52) | Total Medicare reimbursement received = 5,100,000.0 (SHAP +4.55) |
| PRV_03_KICKBACK_COLLUSION_RING     | Multi-Hospital Physician Recycling Kickback Ring | FRAUD (Critical Risk) |      380 | $2,750,000      | 100.0%       | FLAGGED FOR AUDIT | CRITICAL   | Total inpatient hospital admissions billed = 240.0 (SHAP +5.24) | Total Medicare reimbursement received = 2,750,000.0 (SHAP +4.61) |
| PRV_04_COMMUNITY_GENERAL_HOSPITAL  | Accredited Community General Hospital            | LEGITIMATE (Clean)    |      350 | $180,000        | 0.1%         | AUTO-CLEARED      | LOW        | Claims Per Operating Physician = 43.8 (SHAP +1.64) | Total Medicare reimbursement received = 180,000.0 (SHAP +1.59)                |
| PRV_05_UNBUNDLING_DIAGNOSTIC_LAB   | Same-Day Split Billing & Diagnostic Unbundling   | FRAUD (High Risk)     |      940 | $920,000        | 68.3%        | FLAGGED FOR AUDIT | HIGH       | Total Medicare reimbursement received = 920,000.0 (SHAP +4.24) | Average claims filed per individual patient = 4.9 (SHAP +2.00)    |
| PRV_06_SOLO_DOCTOR_MONOPOLY        | Single-Physician Billing Monopoly & Kickbacks    | FRAUD (High Risk)     |      510 | $1,200,000      | 100.0%       | FLAGGED FOR AUDIT | CRITICAL   | Total inpatient hospital admissions billed = 130.0 (SHAP +5.20) | Total Medicare reimbursement received = 1,200,000.0 (SHAP +4.83) |
| PRV_07_DIAGNOSTIC_IMAGING_CENTER   | Accredited MRI & CT Diagnostic Imaging Center    | LEGITIMATE (Clean)    |      450 | $95,000         | 0.0%         | AUTO-CLEARED      | LOW        | Claims Per Operating Physician = 75.0 (SHAP +1.39) | Total Deductible = 12,000.0 (SHAP +1.05)                                      |
| PRV_08_ICU_LENGTH_OF_STAY_UPCODING | Artificial ICU Prolongation & Severity Upcoding  | FRAUD (Critical Risk) |      420 | $4,600,000      | 99.9%        | FLAGGED FOR AUDIT | CRITICAL   | Total inpatient hospital admissions billed = 420.0 (SHAP +5.49) | Total Medicare reimbursement received = 4,600,000.0 (SHAP +4.68) |
| PRV_09_DAYCARE_DIALYSIS_CENTER     | Accredited Outpatient Hemodialysis Renal Center  | LEGITIMATE (Clean)    |      280 | $72,000         | 14.9%        | AUTO-CLEARED      | LOW        | Average claims filed per individual patient = 4.7 (SHAP +3.15) | Claims Per Operating Physician = 140.0 (SHAP +1.46)               |
| PRV_10_MATERNITY_NURSING_HOME      | Accredited Mother & Child Nursing Home           | LEGITIMATE (Clean)    |      270 | $195,000        | 0.1%         | AUTO-CLEARED      | LOW        | Total Medicare reimbursement received = 195,000.0 (SHAP +1.67) | Claims Per Operating Physician = 67.5 (SHAP +1.54)                |

---

## 📊 Confusion Matrix on 10-Scenario Test Suite

| Actual / Predicted | AI Predicted Fraud (Flagged) | AI Predicted Clean (Auto-Cleared) |
| :--- | :---: | :---: |
| **Actual Fraud (5 Cases)** | **5 (True Positives)** | **0 (False Negatives)** |
| **Actual Legitimate (5 Cases)** | **0 (False Positives)** | **5 (True Negatives)** |

---

## 🔍 Scenario Breakdown & Clinical Insights

### 🚨 Fraudulent Schemes Flagged:
1. **PRV_02_PHANTOM_SURGERY_MILL (100.0% Risk — CRITICAL)**:
   - Flagged due to massive inpatient admissions (460/520 claims, 88.5% inpatient share) with only 2 doctors and $5.1M in claims, indicating phantom inpatient admissions.
2. **PRV_03_KICKBACK_COLLUSION_RING (100.0% Risk — CRITICAL)**:
   - Flagged by the Collusion Knowledge Graph: 95% of physicians are shared across multi-facility syndicates (degree = 11), recycling patients across clinics.
3. **PRV_05_UNBUNDLING_DIAGNOSTIC_LAB (68.3% Risk — HIGH)**:
   - Flagged for diagnostic unbundling: 44% same-day duplicate beneficiary claims with 4.9 claims per patient on zero-day duration tests.
4. **PRV_06_SOLO_DOCTOR_MONOPOLY (100.0% Risk — CRITICAL)**:
   - Flagged for physician monopoly: Single attending doctor billing 100% of 510 claims worth $1.2M with extreme top-diagnosis concentration.
5. **PRV_08_ICU_LENGTH_OF_STAY_UPCODING (99.9% Risk — CRITICAL)**:
   - Flagged for artificial ICU prolongation: 100% inpatient claims, mean length of stay of 16.8 days (max 48 days), and extreme reimbursement.

### ✅ Legitimate Healthcare Providers Cleared (5 Cases):
1. **PRV_01_RURAL_PRIMARY_CLINIC (0.0% Risk — LOW)**:
   - Low-cost outpatient primary healthcare center serving rural beneficiaries. Low reimbursement ($38,000) and zero collusion links.
2. **PRV_04_COMMUNITY_GENERAL_HOSPITAL (0.1% Risk — LOW)**:
   - Balanced multi-physician community hospital with healthy inpatient/outpatient mix, normal length of stay, and legitimate deductible ratios.
3. **PRV_07_DIAGNOSTIC_IMAGING_CENTER (0.0% Risk — LOW)**:
   - Outpatient MRI/CT radiology lab with 15 referring physicians, zero duplicate same-day claims, and 0 graph collusion links.
4. **PRV_09_DAYCARE_DIALYSIS_CENTER (14.9% Risk — LOW)**:
   - Accredited outpatient hemodialysis renal clinic with legitimate chronic condition profile (6.2 conditions, 92% renal disease) and clean non-collusive billing.
5. **PRV_10_MATERNITY_NURSING_HOME (0.1% Risk — LOW)**:
   - Accredited obstetrics & maternal care center with 12 doctors, appropriate short admissions, and clean billing distribution.
