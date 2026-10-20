# Syght Sample Healthcare Datasets for Model Testing

This directory contains verified sample healthcare datasets, claims payloads, and plain-text export files designed for testing Syght's Multi-Model Machine Learning Engine (LightGBM 1-SE, HistGradientBoosting, Random Forest, ElasticNet, and Bipartite Collusion Graph Network).

---

## Available Sample Datasets

### 1. `pmjay_25_hospital_portfolio.csv`
- **Count:** 25 Empaneled Healthcare Facilities
- **Total Exposure:** ₹9.85 Cr
- **Archetypes Covered:**
  - Phantom Surgery Mills (230 surgeries per doctor outlier)
  - Doctor Recycling & Bipartite Kickback Syndicate Rings
  - ICU Length of Stay Prolongation (up to 48 days)
  - Diagnostic Unbundling & Phantom Pathology Panels
  - Post-Decease Billing Claims
  - Compliant Rural Primary Care Kendras (Clean Baselines)
- **Usage:** Ideal for benchmarking end-to-end portfolio screening in Syght Command Center and Dataset Studio.

### 2. `metropolitan_icu_surgical_claims.csv`
- **Count:** 15 Metropolitan Tertiary Centers
- **Total Exposure:** ₹14.20 Cr
- **Archetypes Covered:**
  - Ventilator Prolongation & High-Deductible ICU Retention
  - Stent Stacking & Cardiac Upcoding
  - Bilateral Joint Replacement Unbundling
  - Multi-Level Spinal Fusion Billing Outliers
- **Expected Decision:** 100% Flagged for On-Site Forensic SIU Audit.

### 3. `rural_primary_care_network.csv`
- **Count:** 20 Rural Primary Health Kendras (PHCs/CHCs)
- **Total Exposure:** ₹1.82 Cr
- **Archetypes Covered:**
  - Protocol-Concordant Community Care (Mean LOS: 2.1 - 3.1 days)
  - Diverse Attending Physician Rosters (10 - 20 doctors)
  - Zero duplicate submissions (<0.5%)
  - Verified institutional deliveries & acute fever management
- **Expected Decision:** 100% Auto-Cleared for Immediate Payout (Zero False Positives).

### 4. `diagnostic_lab_unbundling_syndicate.csv`
- **Count:** 14 Diagnostic Imaging & Pathology Laboratories
- **Total Exposure:** ₹3.92 Cr
- **Archetypes Covered:**
  - Unbundled Routine Blood Panels (CBC, LFT, KFT split into 4 separate claims)
  - Phantom 3D Doppler & Ultrasound scans on same beneficiary
  - High Bipartite Collusion Degree Centrality (>0.75)
- **Expected Decision:** Flagged for Subpoena & Lab Dispatch Verification.

### 5. `dialysis_chemotherapy_daycare_claims.csv`
- **Count:** 12 Daycare Specialty Centers
- **Total Exposure:** ₹4.65 Cr
- **Archetypes Covered:**
  - Repeated Hemodialysis Session Churn (5x per week duplicate billing)
  - High-Cost Chemotherapy Infusion Phantom Billing
  - Beneficiary Overlap Across Affiliated Daycare Clinics
- **Expected Decision:** Critical Risk Freeze Directive.

### 6. `claims_batch_payload.json`
- **Format:** JSON Array of 40 individual claim items
- **Fields:** `claim_id`, `pre_auth_id`, `provider_id`, `admission_date`, `discharge_date`, `primary_icd10_code`, `procedure_code`, `billed_amount_inr`, `status`, `anomaly_indicators`
- **Usage:** Test drag-and-drop or file upload of native JSON arrays into **Dataset Studio**.

### 7. `single_claim_sample.json`
- **Format:** Single Patient Claim Record (JSON)
- **Fields:** Comprehensive telemetry, patient demographics, ICD-10 clinical episode, operating theatre logs, and package codes
- **Usage:** Test the **Real-Time Pre-Auth Gateway (<5ms)** or API endpoints (`/api/v1/predict/single`).

### 8. `claims_data_export.txt`
- **Format:** Tab-separated text export (TSV) of 25 healthcare facilities
- **Usage:** Test plain text copy-paste or `.txt` file drag-and-drop into **Dataset Studio**.

---

## How to Test in the Syght Application

1. **Direct 1-Click Run in Command Center:**
   - Go to the **Command Center** (`/command`).
   - Click **"Run Audit on 25 Sample Data"** in the Hero section to instantly launch the 25-hospital portfolio audit.
   - Or scroll down to the **"Multi-Dataset Benchmark & Audit Launcher"** to run any of the 5 curated datasets with 1 click.

2. **Custom File Upload in Dataset Studio:**
   - Go to **Dataset Studio** (`/dataset`).
   - Drag and drop any `.csv`, `.json`, or `.txt` file from `sample_datasets/` onto the dropzone.
   - Click **"Run Model Inference"** to watch the multi-model engine score every record in real time.
