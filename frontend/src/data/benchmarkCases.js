// 25 Verified Healthcare Insurance Cases across Clinical & Fraud Archetypes (Ayushman Bharat PM-JAY & Medicare)
export const BENCHMARK_CASES = [
  {
    "id": "PRV_02_PHANTOM_SURGERY_MILL",
    "name": "Apex Life Surgical Specialty Care",
    "city": "Mumbai, MH",
    "category": "critical",
    "tag": "Surgeon-to-Procedure Ratio Anomaly (230:1)",
    "reimbursement": 5100000,
    "risk": 1.0,
    "decision": "FLAGGED FOR AUDIT",
    "priority": "CRITICAL",
    "physicians": 2,
    "surgeries": 460,
    "claims": 480,
    "los": 7.2,
    "duplicateRate": 0.18,
    "status": "investigating",
    "directive": "Freeze all pending claim disbursements immediately (₹5.1M exposure). Subpoena surgical theatre logs, nurse duty rosters, and biometric attendance records for the 2 named attending physicians.",
    "drivers": [
      {
        "feature": "total_inpatient_surgeries",
        "desc": "460 Inpatient Surgeries Billed by 2 Physicians",
        "shap": "+0.342"
      },
      {
        "feature": "inpatient_reimbursed_sum",
        "desc": "Surgical Payouts Sum (₹5,100,000)",
        "shap": "+0.285"
      },
      {
        "feature": "claims_per_attending_ratio",
        "desc": "Extreme Claim Volume per Doctor (230 claims/doc)",
        "shap": "+0.198"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Isolated Closed Loop Doctor Network",
        "shap": "+0.115"
      }
    ],
    "features": {
      "total_claims_count": 480,
      "inpatient_claims_count": 460,
      "outpatient_claims_count": 20,
      "inpatient_reimbursed_sum": 5100000,
      "outpatient_reimbursed_sum": 45000,
      "inpatient_deductible_sum": 490000,
      "mean_inpatient_los": 7.2,
      "max_inpatient_los": 14,
      "total_inpatient_surgeries": 460,
      "unique_beneficiaries_count": 420,
      "unique_attending_physicians": 2,
      "unique_operating_physicians": 2,
      "claims_per_attending_ratio": 240.0,
      "graph_degree_centrality": 0.72,
      "same_day_duplicate_rate": 0.18
    },
    "hospital_id": "HOSP-MH-40192"
  },
  {
    "id": "PRV_03_KICKBACK_COLLUSION_RING",
    "name": "Metro Health Bipartite Syndicate",
    "city": "Delhi NCR",
    "category": "critical",
    "tag": "Cross-Hospital Referral Syndicate (34 Roving MDs)",
    "reimbursement": 9800000,
    "risk": 0.998,
    "decision": "FLAGGED FOR AUDIT",
    "priority": "CRITICAL",
    "physicians": 34,
    "surgeries": 580,
    "claims": 890,
    "los": 7.2,
    "duplicateRate": 0.32,
    "status": "investigating",
    "directive": "Initiate multi-facility anti-kickback investigation. Cross-verify referral kickbacks and physician remuneration across the 11 syndicated hospital branches.",
    "drivers": [
      {
        "feature": "graph_degree_centrality",
        "desc": "High Cross-Hospital Physician Sharing (95% Shared)",
        "shap": "+0.320"
      },
      {
        "feature": "unique_attending_physicians",
        "desc": "Network of 34 Roving Shared Doctors",
        "shap": "+0.265"
      },
      {
        "feature": "inpatient_reimbursed_sum",
        "desc": "Aggregated Network Payout (₹9,800,000)",
        "shap": "+0.210"
      },
      {
        "feature": "shared_doctor_syndicate_score",
        "desc": "Bipartite Centrality Above 99th Percentile",
        "shap": "+0.145"
      }
    ],
    "features": {
      "total_claims_count": 890,
      "inpatient_claims_count": 760,
      "outpatient_claims_count": 130,
      "inpatient_reimbursed_sum": 9350000,
      "outpatient_reimbursed_sum": 450000,
      "inpatient_deductible_sum": 420000,
      "mean_inpatient_los": 7.2,
      "max_inpatient_los": 18,
      "total_inpatient_surgeries": 580,
      "unique_beneficiaries_count": 720,
      "unique_attending_physicians": 34,
      "unique_operating_physicians": 18,
      "claims_per_attending_ratio": 26.2,
      "graph_degree_centrality": 0.94,
      "same_day_duplicate_rate": 0.32
    },
    "hospital_id": "HOSP-DL-10923"
  },
  {
    "id": "PRV_08_ICU_LENGTH_OF_STAY_UPCODING",
    "name": "St. Jude Critical Care & Trauma",
    "city": "Bengaluru, KA",
    "category": "critical",
    "tag": "Prolonged ICU Length-of-Stay Outlier (16.8d Mean)",
    "reimbursement": 6400000,
    "risk": 0.999,
    "decision": "FLAGGED FOR AUDIT",
    "priority": "CRITICAL",
    "physicians": 6,
    "surgeries": 140,
    "claims": 310,
    "los": 16.8,
    "duplicateRate": 0.05,
    "status": "investigating",
    "directive": "Dispatch clinical auditor for on-site chart review. Verify patient admission vitals, Glasgow Coma Scale, and arterial blood gas reports against billed ICU days.",
    "drivers": [
      {
        "feature": "mean_inpatient_los",
        "desc": "Extreme Mean Length of Stay (16.8 Days)",
        "shap": "+0.380"
      },
      {
        "feature": "max_inpatient_los",
        "desc": "Prolonged Inpatient Outlier (Max 48 Days)",
        "shap": "+0.245"
      },
      {
        "feature": "inpatient_reimbursed_sum",
        "desc": "High Per-Admission Cost Profile (₹6,400,000)",
        "shap": "+0.190"
      },
      {
        "feature": "icu_stay_ratio",
        "desc": "Disproportionate ICU Admission Proportion",
        "shap": "+0.125"
      }
    ],
    "features": {
      "total_claims_count": 310,
      "inpatient_claims_count": 310,
      "outpatient_claims_count": 0,
      "inpatient_reimbursed_sum": 6400000,
      "outpatient_reimbursed_sum": 0,
      "inpatient_deductible_sum": 320000,
      "mean_inpatient_los": 16.8,
      "max_inpatient_los": 48,
      "total_inpatient_surgeries": 140,
      "unique_beneficiaries_count": 280,
      "unique_attending_physicians": 6,
      "unique_operating_physicians": 4,
      "claims_per_attending_ratio": 51.7,
      "graph_degree_centrality": 0.58,
      "same_day_duplicate_rate": 0.05
    },
    "hospital_id": "HOSP-KA-82014"
  },
  {
    "id": "PRV_05_UNBUNDLING_DIAGNOSTIC_LAB",
    "name": "PulsePath Advanced Pathology & Imaging",
    "city": "Hyderabad, TS",
    "category": "high",
    "tag": "Component Pathology Unbundling (44% Duplicate)",
    "reimbursement": 3270000,
    "risk": 0.954,
    "decision": "FLAGGED FOR AUDIT",
    "priority": "HIGH",
    "physicians": 18,
    "surgeries": 0,
    "claims": 1450,
    "los": 1.2,
    "duplicateRate": 0.44,
    "status": "investigating",
    "directive": "Enforce automated CMS bundling edit rules. Recoup differential between comprehensive metabolic panel fee and fragmented individual analyte tests.",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "44% Duplicate Same-Day Beneficiary Tests",
        "shap": "+0.360"
      },
      {
        "feature": "outpatient_claims_count",
        "desc": "High Outpatient Claim Volume (1,450 claims)",
        "shap": "+0.215"
      },
      {
        "feature": "outpatient_reimbursed_sum",
        "desc": "Outpatient Billing Extraction (₹2,850,000)",
        "shap": "+0.170"
      },
      {
        "feature": "unique_beneficiaries_count",
        "desc": "Excessive Repeat Tests on Same Patients",
        "shap": "+0.095"
      }
    ],
    "features": {
      "total_claims_count": 1450,
      "inpatient_claims_count": 60,
      "outpatient_claims_count": 1390,
      "inpatient_reimbursed_sum": 420000,
      "outpatient_reimbursed_sum": 2850000,
      "inpatient_deductible_sum": 45000,
      "mean_inpatient_los": 1.2,
      "max_inpatient_los": 3,
      "total_inpatient_surgeries": 0,
      "unique_beneficiaries_count": 1120,
      "unique_attending_physicians": 18,
      "unique_operating_physicians": 0,
      "claims_per_attending_ratio": 80.5,
      "graph_degree_centrality": 0.78,
      "same_day_duplicate_rate": 0.44
    },
    "hospital_id": "HOSP-TS-90214"
  },
  {
    "id": "PRV_09_DEAD_PATIENT_BILLING_CLINIC",
    "name": "Sunrise Community Health Roster",
    "city": "Patna, BR",
    "category": "critical",
    "tag": "Post-Discharge Claim Submission Anomaly",
    "reimbursement": 1930000,
    "risk": 0.965,
    "decision": "FLAGGED FOR AUDIT",
    "priority": "CRITICAL",
    "physicians": 3,
    "surgeries": 80,
    "claims": 220,
    "los": 4.2,
    "duplicateRate": 0.22,
    "status": "investigating",
    "directive": "Refer to State Medical Anti-Fraud Taskforce & Law Enforcement. Match beneficiary death registry timestamps against billed service dates.",
    "drivers": [
      {
        "feature": "post_mortem_claim_count",
        "desc": "Active Claims Billed After Beneficiary DOD",
        "shap": "+0.410"
      },
      {
        "feature": "same_day_duplicate_rate",
        "desc": "High Duplicate Submission Velocity",
        "shap": "+0.230"
      },
      {
        "feature": "inpatient_reimbursed_sum",
        "desc": "Post-Mortem Payout Extraction (₹1,850,000)",
        "shap": "+0.175"
      },
      {
        "feature": "claims_per_attending_ratio",
        "desc": "Unchecked Batch Invoicing Spike",
        "shap": "+0.110"
      }
    ],
    "features": {
      "total_claims_count": 220,
      "inpatient_claims_count": 190,
      "outpatient_claims_count": 30,
      "inpatient_reimbursed_sum": 1850000,
      "outpatient_reimbursed_sum": 80000,
      "inpatient_deductible_sum": 92000,
      "mean_inpatient_los": 4.2,
      "max_inpatient_los": 9,
      "total_inpatient_surgeries": 80,
      "unique_beneficiaries_count": 160,
      "unique_attending_physicians": 3,
      "unique_operating_physicians": 2,
      "claims_per_attending_ratio": 73.3,
      "graph_degree_centrality": 0.48,
      "same_day_duplicate_rate": 0.22
    },
    "hospital_id": "HOSP-BR-66102"
  },
  {
    "id": "PRV_01_RURAL_PRIMARY_CLINIC",
    "name": "Shanti Gramin Primary Health Kendra",
    "city": "Satara, MH",
    "category": "clean",
    "tag": "Verified Rural Outpatient Baseline",
    "reimbursement": 215000,
    "risk": 0.042,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 3,
    "surgeries": 4,
    "claims": 180,
    "los": 2.1,
    "duplicateRate": 0.01,
    "status": "cleared",
    "directive": "Low-risk profile. Expedited claim reimbursement authorized. Routine random sample quarterly monitoring.",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Near-Zero Duplicate Tests (1%)",
        "shap": "-0.260"
      },
      {
        "feature": "inpatient_claims_count",
        "desc": "Zero Inpatient Hospitalization Surges",
        "shap": "-0.210"
      },
      {
        "feature": "claims_per_attending_ratio",
        "desc": "Balanced Patient-to-Doctor Ratio (60 pts/doc)",
        "shap": "-0.165"
      },
      {
        "feature": "reimbursed_per_claim_mean",
        "desc": "Modest Average Cost (₹1,194/claim)",
        "shap": "-0.120"
      }
    ],
    "features": {
      "total_claims_count": 180,
      "inpatient_claims_count": 25,
      "outpatient_claims_count": 155,
      "inpatient_reimbursed_sum": 120000,
      "outpatient_reimbursed_sum": 95000,
      "inpatient_deductible_sum": 12000,
      "mean_inpatient_los": 2.1,
      "max_inpatient_los": 4,
      "total_inpatient_surgeries": 4,
      "unique_beneficiaries_count": 165,
      "unique_attending_physicians": 3,
      "unique_operating_physicians": 1,
      "claims_per_attending_ratio": 60.0,
      "graph_degree_centrality": 0.22,
      "same_day_duplicate_rate": 0.01
    },
    "hospital_id": "HOSP-MH-77218"
  },
  {
    "id": "PRV_04_COMMUNITY_DISTRICT_HOSPITAL",
    "name": "District Civil General Hospital",
    "city": "Bhopal, MP",
    "category": "clean",
    "tag": "Accredited District General Baseline",
    "reimbursement": 3460000,
    "risk": 0.078,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 14,
    "surgeries": 125,
    "claims": 820,
    "los": 3.6,
    "duplicateRate": 0.02,
    "status": "cleared",
    "directive": "Normal clinical practice patterns observed. No audit triggers.",
    "drivers": [
      {
        "feature": "mean_inpatient_los",
        "desc": "Typical Hospital Length of Stay (3.6 Days)",
        "shap": "-0.220"
      },
      {
        "feature": "unique_attending_physicians",
        "desc": "Diverse Clinical Staffing (14 Physicians)",
        "shap": "-0.185"
      },
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Low Unbundling Indicator (2%)",
        "shap": "-0.145"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Standard Regional Referral Pattern",
        "shap": "-0.095"
      }
    ],
    "features": {
      "total_claims_count": 820,
      "inpatient_claims_count": 480,
      "outpatient_claims_count": 340,
      "inpatient_reimbursed_sum": 2840000,
      "outpatient_reimbursed_sum": 620000,
      "inpatient_deductible_sum": 185000,
      "mean_inpatient_los": 3.6,
      "max_inpatient_los": 10,
      "total_inpatient_surgeries": 125,
      "unique_beneficiaries_count": 740,
      "unique_attending_physicians": 14,
      "unique_operating_physicians": 8,
      "claims_per_attending_ratio": 58.5,
      "graph_degree_centrality": 0.35,
      "same_day_duplicate_rate": 0.02
    },
    "hospital_id": "HOSP-MP-33019"
  },
  {
    "id": "PRV_06_METRO_MATERNITY_CENTER",
    "name": "Janani Mother & Child Care Wing",
    "city": "Chennai, TN",
    "category": "clean",
    "tag": "Maternity & Neonatal Care Baseline",
    "reimbursement": 3610000,
    "risk": 0.091,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 9,
    "surgeries": 220,
    "claims": 650,
    "los": 3.2,
    "duplicateRate": 0.03,
    "status": "cleared",
    "directive": "Verified clinical pathway compliance for obstetrics & neonatal admissions. Expedited payment authorized.",
    "drivers": [
      {
        "feature": "mean_inpatient_los",
        "desc": "Short Post-Natal Stay (3.2 Days)",
        "shap": "-0.210"
      },
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Negligible Duplicate Code Filings (3%)",
        "shap": "-0.160"
      },
      {
        "feature": "unique_attending_physicians",
        "desc": "Balanced Roster of 9 Obstetricians",
        "shap": "-0.130"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Clean Localized Delivery Referrals",
        "shap": "-0.085"
      }
    ],
    "features": {
      "total_claims_count": 650,
      "inpatient_claims_count": 510,
      "outpatient_claims_count": 140,
      "inpatient_reimbursed_sum": 3200000,
      "outpatient_reimbursed_sum": 410000,
      "inpatient_deductible_sum": 140000,
      "mean_inpatient_los": 3.2,
      "max_inpatient_los": 7,
      "total_inpatient_surgeries": 220,
      "unique_beneficiaries_count": 590,
      "unique_attending_physicians": 9,
      "unique_operating_physicians": 6,
      "claims_per_attending_ratio": 72.2,
      "graph_degree_centrality": 0.28,
      "same_day_duplicate_rate": 0.03
    },
    "hospital_id": "HOSP-TN-41920"
  },
  {
    "id": "PRV_07_CHARITABLE_EYE_INSTITUTE",
    "name": "Drishti Netralaya Foundation",
    "city": "Varanasi, UP",
    "category": "clean",
    "tag": "Routine Cataract High-Volume Claims",
    "reimbursement": 2280000,
    "risk": 0.054,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 12,
    "surgeries": 880,
    "claims": 940,
    "los": 1.1,
    "duplicateRate": 0.01,
    "status": "cleared",
    "directive": "High surgical volume verified against approved NGO outreach camps and biometric donor registries.",
    "drivers": [
      {
        "feature": "mean_inpatient_los",
        "desc": "Strict Daycare Turnover (1.1 Days)",
        "shap": "-0.270"
      },
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Clean Single-Procedure Billing (1%)",
        "shap": "-0.190"
      },
      {
        "feature": "unique_attending_physicians",
        "desc": "12 Certified Ophthalmic Surgeons",
        "shap": "-0.145"
      },
      {
        "feature": "claims_per_attending_ratio",
        "desc": "Optimal Community Camp Output",
        "shap": "-0.110"
      }
    ],
    "features": {
      "total_claims_count": 940,
      "inpatient_claims_count": 880,
      "outpatient_claims_count": 60,
      "inpatient_reimbursed_sum": 2100000,
      "outpatient_reimbursed_sum": 180000,
      "inpatient_deductible_sum": 85000,
      "mean_inpatient_los": 1.1,
      "max_inpatient_los": 2,
      "total_inpatient_surgeries": 880,
      "unique_beneficiaries_count": 890,
      "unique_attending_physicians": 12,
      "unique_operating_physicians": 12,
      "claims_per_attending_ratio": 78.3,
      "graph_degree_centrality": 0.24,
      "same_day_duplicate_rate": 0.01
    },
    "hospital_id": "HOSP-UP-55102"
  },
  {
    "id": "PRV_10_HIGH_VOLUME_CARDIO_CARE",
    "name": "Heritage Heart & Vascular Institute",
    "city": "Kolkata, WB",
    "category": "clean",
    "tag": "Cardiovascular Surgery Care Baseline",
    "reimbursement": 8210000,
    "risk": 0.162,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 16,
    "surgeries": 310,
    "claims": 520,
    "los": 4.8,
    "duplicateRate": 0.04,
    "status": "cleared",
    "directive": "High claim totals justified by accredited cath lab stenting and bypass registers. Normal clinical distribution.",
    "drivers": [
      {
        "feature": "unique_attending_physicians",
        "desc": "16 Dedicated Interventional Cardiologists",
        "shap": "-0.180"
      },
      {
        "feature": "mean_inpatient_los",
        "desc": "Protocol-Adherent Post-Stent Recovery (4.8D)",
        "shap": "-0.140"
      },
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Normal Cath Lab Protocol (4%)",
        "shap": "-0.115"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Accredited Regional Tertiary Hub",
        "shap": "-0.075"
      }
    ],
    "features": {
      "total_claims_count": 520,
      "inpatient_claims_count": 480,
      "outpatient_claims_count": 40,
      "inpatient_reimbursed_sum": 7900000,
      "outpatient_reimbursed_sum": 310000,
      "inpatient_deductible_sum": 340000,
      "mean_inpatient_los": 4.8,
      "max_inpatient_los": 14,
      "total_inpatient_surgeries": 310,
      "unique_beneficiaries_count": 490,
      "unique_attending_physicians": 16,
      "unique_operating_physicians": 10,
      "claims_per_attending_ratio": 32.5,
      "graph_degree_centrality": 0.42,
      "same_day_duplicate_rate": 0.04
    },
    "hospital_id": "HOSP-WB-88192"
  },
  {
    "id": "PRV_11_PHANTOM_DIALYSIS_CHAIN",
    "name": "NephroLife Renal Dialysis Network",
    "city": "Ahmedabad, GJ",
    "category": "critical",
    "tag": "Dialysis Churn & Repetitive Billing",
    "reimbursement": 5460000,
    "risk": 0.984,
    "decision": "FLAGGED FOR AUDIT",
    "priority": "CRITICAL",
    "physicians": 4,
    "surgeries": 0,
    "claims": 1120,
    "los": 1.0,
    "duplicateRate": 0.48,
    "status": "investigating",
    "directive": "Audit dialysis session machine logs. 13 sessions billed per patient per month without corresponding dialyzer cartridge consumption.",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "48% Duplicate Dialysis Sessions",
        "shap": "+0.395"
      },
      {
        "feature": "claims_per_beneficiary",
        "desc": "Extreme Session Density (13.2 sessions/pt)",
        "shap": "+0.285"
      },
      {
        "feature": "outpatient_reimbursed_sum",
        "desc": "Outpatient Billing Extraction (₹4.9M)",
        "shap": "+0.190"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Multi-Clinic Patient Cycling Loop",
        "shap": "+0.115"
      }
    ],
    "features": {
      "total_claims_count": 1120,
      "inpatient_claims_count": 80,
      "outpatient_claims_count": 1040,
      "inpatient_reimbursed_sum": 560000,
      "outpatient_reimbursed_sum": 4900000,
      "inpatient_deductible_sum": 65000,
      "mean_inpatient_los": 1.0,
      "max_inpatient_los": 2,
      "total_inpatient_surgeries": 0,
      "unique_beneficiaries_count": 85,
      "unique_attending_physicians": 4,
      "unique_operating_physicians": 0,
      "claims_per_attending_ratio": 280.0,
      "graph_degree_centrality": 0.69,
      "same_day_duplicate_rate": 0.48
    },
    "hospital_id": "HOSP-GJ-22910"
  },
  {
    "id": "PRV_12_AYUSH_WELLNESS_SANATORIUM",
    "name": "Prakriti Holistic Healing Sanatorium",
    "city": "Kochi, KL",
    "category": "clean",
    "tag": "Non-Empaneled Package Substitution",
    "reimbursement": 770000,
    "risk": 0.068,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 5,
    "surgeries": 0,
    "claims": 140,
    "los": 7.5,
    "duplicateRate": 0.02,
    "status": "cleared",
    "directive": "Compliant inpatient naturopathy/Panchakarma stay duration conforming to AYUSH package standards.",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Minimal Duplicate Treatments (2%)",
        "shap": "-0.230"
      },
      {
        "feature": "total_inpatient_surgeries",
        "desc": "Zero Surgical Package Claims",
        "shap": "-0.180"
      },
      {
        "feature": "unique_attending_physicians",
        "desc": "Accredited AYUSH Practitioners",
        "shap": "-0.140"
      },
      {
        "feature": "reimbursed_per_claim_mean",
        "desc": "Reasonable Per-Session Rate (₹5,500)",
        "shap": "-0.090"
      }
    ],
    "features": {
      "total_claims_count": 140,
      "inpatient_claims_count": 110,
      "outpatient_claims_count": 30,
      "inpatient_reimbursed_sum": 680000,
      "outpatient_reimbursed_sum": 90000,
      "inpatient_deductible_sum": 42000,
      "mean_inpatient_los": 7.5,
      "max_inpatient_los": 14,
      "total_inpatient_surgeries": 0,
      "unique_beneficiaries_count": 120,
      "unique_attending_physicians": 5,
      "unique_operating_physicians": 0,
      "claims_per_attending_ratio": 28.0,
      "graph_degree_centrality": 0.19,
      "same_day_duplicate_rate": 0.02
    },
    "hospital_id": "HOSP-KL-19284"
  },
  {
    "id": "PRV_13_ORTHO_IMPLANT_INFLATION",
    "name": "Sanjivani Joint & Spine Super-Specialty",
    "city": "Indore, MP",
    "category": "high",
    "tag": "Orthopedic Implant Inflation Outlier",
    "reimbursement": 6280000,
    "risk": 0.912,
    "decision": "FLAGGED FOR AUDIT",
    "priority": "HIGH",
    "physicians": 3,
    "surgeries": 250,
    "claims": 280,
    "los": 6.1,
    "duplicateRate": 0.15,
    "status": "investigating",
    "directive": "Request physical implant barcodes and distributor invoices for 250 knee/hip arthroplasties.",
    "drivers": [
      {
        "feature": "inpatient_reimbursed_sum",
        "desc": "High Implant Billing Total (₹6.2M)",
        "shap": "+0.315"
      },
      {
        "feature": "total_inpatient_surgeries",
        "desc": "250 Joint Surgeries by 3 Surgeons",
        "shap": "+0.245"
      },
      {
        "feature": "claims_per_attending_ratio",
        "desc": "Dense Operating Schedules (83 ops/doc)",
        "shap": "+0.170"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Co-Referral Loop with Device Vendors",
        "shap": "+0.105"
      }
    ],
    "features": {
      "total_claims_count": 280,
      "inpatient_claims_count": 260,
      "outpatient_claims_count": 20,
      "inpatient_reimbursed_sum": 6200000,
      "outpatient_reimbursed_sum": 80000,
      "inpatient_deductible_sum": 280000,
      "mean_inpatient_los": 6.1,
      "max_inpatient_los": 16,
      "total_inpatient_surgeries": 250,
      "unique_beneficiaries_count": 240,
      "unique_attending_physicians": 3,
      "unique_operating_physicians": 3,
      "claims_per_attending_ratio": 93.3,
      "graph_degree_centrality": 0.64,
      "same_day_duplicate_rate": 0.15
    },
    "hospital_id": "HOSP-MP-44812"
  },
  {
    "id": "PRV_14_COMMUNITY_HEALTH_POST",
    "name": "Nagarpalika Dispensary Ward 12",
    "city": "Pune, MH",
    "category": "clean",
    "tag": "Municipal Primary Outpatient Baseline",
    "reimbursement": 230000,
    "risk": 0.035,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 4,
    "surgeries": 0,
    "claims": 310,
    "los": 1.1,
    "duplicateRate": 0.01,
    "status": "cleared",
    "directive": "Legitimate outpatient primary care serving urban municipal ward. All claims approved for payout.",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Zero Repeated Prescriptions (1%)",
        "shap": "-0.280"
      },
      {
        "feature": "reimbursed_per_claim_mean",
        "desc": "Low Municipal Visit Rate (₹741/claim)",
        "shap": "-0.210"
      },
      {
        "feature": "inpatient_claims_count",
        "desc": "Minimal Inpatient Stays (10 claims)",
        "shap": "-0.160"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Isolated Ward Walk-In Facility",
        "shap": "-0.110"
      }
    ],
    "features": {
      "total_claims_count": 310,
      "inpatient_claims_count": 10,
      "outpatient_claims_count": 300,
      "inpatient_reimbursed_sum": 45000,
      "outpatient_reimbursed_sum": 185000,
      "inpatient_deductible_sum": 8000,
      "mean_inpatient_los": 1.1,
      "max_inpatient_los": 2,
      "total_inpatient_surgeries": 0,
      "unique_beneficiaries_count": 290,
      "unique_attending_physicians": 4,
      "unique_operating_physicians": 0,
      "claims_per_attending_ratio": 77.5,
      "graph_degree_centrality": 0.14,
      "same_day_duplicate_rate": 0.01
    },
    "hospital_id": "HOSP-MH-11029"
  },
  {
    "id": "PRV_15_PACEMAKER_BILLING_RING",
    "name": "City CardioVascular Rhythm Center",
    "city": "Jaipur, RJ",
    "category": "critical",
    "tag": "Pacemaker Implant Upcoding Cluster",
    "reimbursement": 7820000,
    "risk": 0.995,
    "decision": "FLAGGED FOR AUDIT",
    "priority": "CRITICAL",
    "physicians": 2,
    "surgeries": 180,
    "claims": 190,
    "los": 4.9,
    "duplicateRate": 0.24,
    "status": "investigating",
    "directive": "Emergency audit on pacemaker implants. Verify lead telemetry data and manufacturer warranties against patient records.",
    "drivers": [
      {
        "feature": "inpatient_reimbursed_sum",
        "desc": "₹7.8M Billed for 180 Pacemaker Implants",
        "shap": "+0.380"
      },
      {
        "feature": "unique_attending_physicians",
        "desc": "Only 2 Doctors Billing 90 Implants Each",
        "shap": "+0.290"
      },
      {
        "feature": "same_day_duplicate_rate",
        "desc": "24% Duplicate Device Serial Numbers",
        "shap": "+0.195"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Syndicated Physician Referral Hub",
        "shap": "+0.130"
      }
    ],
    "features": {
      "total_claims_count": 190,
      "inpatient_claims_count": 190,
      "outpatient_claims_count": 0,
      "inpatient_reimbursed_sum": 7800000,
      "outpatient_reimbursed_sum": 20000,
      "inpatient_deductible_sum": 390000,
      "mean_inpatient_los": 4.9,
      "max_inpatient_los": 11,
      "total_inpatient_surgeries": 180,
      "unique_beneficiaries_count": 175,
      "unique_attending_physicians": 2,
      "unique_operating_physicians": 2,
      "claims_per_attending_ratio": 95.0,
      "graph_degree_centrality": 0.81,
      "same_day_duplicate_rate": 0.24
    },
    "hospital_id": "HOSP-RJ-77120"
  },
  {
    "id": "PRV_16_SUBURBAN_DIAGNOSTIC_CENTER",
    "name": "CareScan MRI & CT Diagnostics",
    "city": "Lucknow, UP",
    "category": "clean",
    "tag": "Repeat Neuroimaging Referral Churn",
    "reimbursement": 1450000,
    "risk": 0.048,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 8,
    "surgeries": 0,
    "claims": 780,
    "los": 0.0,
    "duplicateRate": 0.02,
    "status": "cleared",
    "directive": "Imaging scans conform to standard referral protocols. Zero duplicate billing detected.",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Low Retest Rate (2%)",
        "shap": "-0.240"
      },
      {
        "feature": "unique_attending_physicians",
        "desc": "Broad Referring Physician Base (8 MDs)",
        "shap": "-0.180"
      },
      {
        "feature": "inpatient_claims_count",
        "desc": "100% Outpatient Diagnostic Modality",
        "shap": "-0.135"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Standard Citywide Outpatient Spread",
        "shap": "-0.090"
      }
    ],
    "features": {
      "total_claims_count": 780,
      "inpatient_claims_count": 0,
      "outpatient_claims_count": 780,
      "inpatient_reimbursed_sum": 0,
      "outpatient_reimbursed_sum": 1450000,
      "inpatient_deductible_sum": 55000,
      "mean_inpatient_los": 0.0,
      "max_inpatient_los": 0,
      "total_inpatient_surgeries": 0,
      "unique_beneficiaries_count": 710,
      "unique_attending_physicians": 8,
      "unique_operating_physicians": 0,
      "claims_per_attending_ratio": 97.5,
      "graph_degree_centrality": 0.26,
      "same_day_duplicate_rate": 0.02
    },
    "hospital_id": "HOSP-UP-66230"
  },
  {
    "id": "PRV_17_CHEMOTHERAPY_DAYCARE",
    "name": "Aastha Medical Oncology Daycare",
    "city": "Nagpur, MH",
    "category": "clean",
    "tag": "Chemotherapy Cycle Frequency Anomaly",
    "reimbursement": 5160000,
    "risk": 0.115,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 6,
    "surgeries": 0,
    "claims": 420,
    "los": 1.2,
    "duplicateRate": 0.04,
    "status": "cleared",
    "directive": "Daycare chemo regimens verified against cancer registry stages and oncologist prescriptions.",
    "drivers": [
      {
        "feature": "mean_inpatient_los",
        "desc": "Standard 1-Day Chemo Infusion (1.2D)",
        "shap": "-0.190"
      },
      {
        "feature": "unique_attending_physicians",
        "desc": "6 Certified Medical Oncologists",
        "shap": "-0.150"
      },
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Controlled Cycle Interval Protocol (4%)",
        "shap": "-0.120"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Legitimate Regional Referral Center",
        "shap": "-0.080"
      }
    ],
    "features": {
      "total_claims_count": 420,
      "inpatient_claims_count": 380,
      "outpatient_claims_count": 40,
      "inpatient_reimbursed_sum": 4950000,
      "outpatient_reimbursed_sum": 210000,
      "inpatient_deductible_sum": 160000,
      "mean_inpatient_los": 1.2,
      "max_inpatient_los": 2,
      "total_inpatient_surgeries": 0,
      "unique_beneficiaries_count": 140,
      "unique_attending_physicians": 6,
      "unique_operating_physicians": 0,
      "claims_per_attending_ratio": 70.0,
      "graph_degree_centrality": 0.31,
      "same_day_duplicate_rate": 0.04
    },
    "hospital_id": "HOSP-MH-55410"
  },
  {
    "id": "PRV_18_CROSS_DISTRICT_GHOST_BILLS",
    "name": "Shree Sai Multispecialty Nursing Home",
    "city": "Ranchi, JH",
    "category": "critical",
    "tag": "Cross-District Beneficiary Infiltration",
    "reimbursement": 3970000,
    "risk": 0.978,
    "decision": "FLAGGED FOR AUDIT",
    "priority": "CRITICAL",
    "physicians": 2,
    "surgeries": 190,
    "claims": 360,
    "los": 8.4,
    "duplicateRate": 0.28,
    "status": "investigating",
    "directive": "Deploy ground SIU unit to inspect hospital premises. Verify actual bed count (billed 190 concurrent surgeries with only 2 doctors).",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "28% Same-Day Ghost Duplicate Admissions",
        "shap": "+0.340"
      },
      {
        "feature": "mean_inpatient_los",
        "desc": "Inflated Stay Length (8.4 Days)",
        "shap": "+0.270"
      },
      {
        "feature": "claims_per_attending_ratio",
        "desc": "180 Claims per Doctor (High Outlier)",
        "shap": "+0.210"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Isolated Network Node (Zero Legitimate Referrals)",
        "shap": "+0.150"
      }
    ],
    "features": {
      "total_claims_count": 360,
      "inpatient_claims_count": 320,
      "outpatient_claims_count": 40,
      "inpatient_reimbursed_sum": 3850000,
      "outpatient_reimbursed_sum": 120000,
      "inpatient_deductible_sum": 175000,
      "mean_inpatient_los": 8.4,
      "max_inpatient_los": 22,
      "total_inpatient_surgeries": 190,
      "unique_beneficiaries_count": 310,
      "unique_attending_physicians": 2,
      "unique_operating_physicians": 2,
      "claims_per_attending_ratio": 180.0,
      "graph_degree_centrality": 0.76,
      "same_day_duplicate_rate": 0.28
    },
    "hospital_id": "HOSP-JH-33912"
  },
  {
    "id": "PRV_19_PEDIATRIC_IMMUNIZATION_CLINIC",
    "name": "Little Stars Child Health Clinic",
    "city": "Chandigarh, PB",
    "category": "clean",
    "tag": "Pediatric Immunization Care Baseline",
    "reimbursement": 205000,
    "risk": 0.029,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 4,
    "surgeries": 0,
    "claims": 240,
    "los": 1.4,
    "duplicateRate": 0.01,
    "status": "cleared",
    "directive": "Vaccination and child growth monitoring protocols validated. Routine clearance.",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Single Dose Compliance (1%)",
        "shap": "-0.260"
      },
      {
        "feature": "reimbursed_per_claim_mean",
        "desc": "Low Pediatric Cost Baseline (₹854/claim)",
        "shap": "-0.200"
      },
      {
        "feature": "inpatient_claims_count",
        "desc": "Minimal Inpatient Interventions (15 claims)",
        "shap": "-0.150"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Clean Neighborhood Practice",
        "shap": "-0.095"
      }
    ],
    "features": {
      "total_claims_count": 240,
      "inpatient_claims_count": 15,
      "outpatient_claims_count": 225,
      "inpatient_reimbursed_sum": 65000,
      "outpatient_reimbursed_sum": 140000,
      "inpatient_deductible_sum": 10000,
      "mean_inpatient_los": 1.4,
      "max_inpatient_los": 3,
      "total_inpatient_surgeries": 0,
      "unique_beneficiaries_count": 230,
      "unique_attending_physicians": 4,
      "unique_operating_physicians": 0,
      "claims_per_attending_ratio": 60.0,
      "graph_degree_centrality": 0.16,
      "same_day_duplicate_rate": 0.01
    },
    "hospital_id": "HOSP-PB-99120"
  },
  {
    "id": "PRV_20_EMERGENCY_AMBULANCE_GHOST_RUNS",
    "name": "Apex Rapid Emergency Response",
    "city": "Surat, GJ",
    "category": "high",
    "tag": "Emergency Transport Claims Anomaly",
    "reimbursement": 3830000,
    "risk": 0.884,
    "decision": "FLAGGED FOR AUDIT",
    "priority": "HIGH",
    "physicians": 5,
    "surgeries": 45,
    "claims": 510,
    "los": 3.1,
    "duplicateRate": 0.36,
    "status": "investigating",
    "directive": "Compare GPS ambulance logs and toll booth sensor timestamps with billed emergency transfer claims.",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "36% Repeated Emergency Transfer Codes",
        "shap": "+0.310"
      },
      {
        "feature": "outpatient_reimbursed_sum",
        "desc": "Inflated Triage Surcharges (₹880,000)",
        "shap": "+0.220"
      },
      {
        "feature": "claims_per_beneficiary",
        "desc": "Patients Billed Multiple Transfers in 48 Hours",
        "shap": "+0.165"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Collusion with High-Cost Private Hospitals",
        "shap": "+0.110"
      }
    ],
    "features": {
      "total_claims_count": 510,
      "inpatient_claims_count": 220,
      "outpatient_claims_count": 290,
      "inpatient_reimbursed_sum": 2950000,
      "outpatient_reimbursed_sum": 880000,
      "inpatient_deductible_sum": 110000,
      "mean_inpatient_los": 3.1,
      "max_inpatient_los": 8,
      "total_inpatient_surgeries": 45,
      "unique_beneficiaries_count": 480,
      "unique_attending_physicians": 5,
      "unique_operating_physicians": 2,
      "claims_per_attending_ratio": 102.0,
      "graph_degree_centrality": 0.7,
      "same_day_duplicate_rate": 0.36
    },
    "hospital_id": "HOSP-GJ-88310"
  },
  {
    "id": "PRV_21_DENTAL_SURGICAL_CLINIC",
    "name": "SmileCare Maxillofacial & Dental",
    "city": "Dehradun, UK",
    "category": "clean",
    "tag": "Maxillofacial Surgical Care Baseline",
    "reimbursement": 440000,
    "risk": 0.052,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 3,
    "surgeries": 30,
    "claims": 190,
    "los": 1.5,
    "duplicateRate": 0.02,
    "status": "cleared",
    "directive": "Orthognathic and trauma dental surgical procedures verified with pre-op radiograph records.",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Single-Procedure Invoicing (2%)",
        "shap": "-0.250"
      },
      {
        "feature": "unique_attending_physicians",
        "desc": "Specialist Maxillofacial Team (3 MDs)",
        "shap": "-0.170"
      },
      {
        "feature": "reimbursed_per_claim_mean",
        "desc": "Benchmark-Aligned Payouts (₹2,315/claim)",
        "shap": "-0.130"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Independent Regional Dental Unit",
        "shap": "-0.080"
      }
    ],
    "features": {
      "total_claims_count": 190,
      "inpatient_claims_count": 35,
      "outpatient_claims_count": 155,
      "inpatient_reimbursed_sum": 280000,
      "outpatient_reimbursed_sum": 160000,
      "inpatient_deductible_sum": 22000,
      "mean_inpatient_los": 1.5,
      "max_inpatient_los": 3,
      "total_inpatient_surgeries": 30,
      "unique_beneficiaries_count": 180,
      "unique_attending_physicians": 3,
      "unique_operating_physicians": 2,
      "claims_per_attending_ratio": 63.3,
      "graph_degree_centrality": 0.18,
      "same_day_duplicate_rate": 0.02
    },
    "hospital_id": "HOSP-UK-44109"
  },
  {
    "id": "PRV_22_BURN_CARE_RECOVERY_UNIT",
    "name": "LifeSaviour Burn & Reconstructive Ward",
    "city": "Agra, UP",
    "category": "clean",
    "tag": "Critical Burn Care Unit Baseline",
    "reimbursement": 4100000,
    "risk": 0.185,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 5,
    "surgeries": 110,
    "claims": 160,
    "los": 14.5,
    "duplicateRate": 0.03,
    "status": "cleared",
    "directive": "High length of stay (14.5D) is medically justified by deep-dermal burn wound debridement and grafting cycles.",
    "drivers": [
      {
        "feature": "unique_attending_physicians",
        "desc": "Specialist Plastic & Reconstructive Panel",
        "shap": "-0.160"
      },
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Clean Staged Surgical Billing (3%)",
        "shap": "-0.125"
      },
      {
        "feature": "unique_beneficiaries_count",
        "desc": "Appropriate Patient Inflow (150 patients)",
        "shap": "-0.095"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Specialized State Burn Center",
        "shap": "-0.065"
      }
    ],
    "features": {
      "total_claims_count": 160,
      "inpatient_claims_count": 160,
      "outpatient_claims_count": 0,
      "inpatient_reimbursed_sum": 4100000,
      "outpatient_reimbursed_sum": 0,
      "inpatient_deductible_sum": 195000,
      "mean_inpatient_los": 14.5,
      "max_inpatient_los": 35,
      "total_inpatient_surgeries": 110,
      "unique_beneficiaries_count": 150,
      "unique_attending_physicians": 5,
      "unique_operating_physicians": 4,
      "claims_per_attending_ratio": 32.0,
      "graph_degree_centrality": 0.32,
      "same_day_duplicate_rate": 0.03
    },
    "hospital_id": "HOSP-UP-22194"
  },
  {
    "id": "PRV_23_MEDICINE_WHOLESALE_DISPENSE",
    "name": "MedSupply Generic Distribution Hub",
    "city": "Indore, MP",
    "category": "high",
    "tag": "Consumables Volume Over-Dispensation",
    "reimbursement": 3450000,
    "risk": 0.865,
    "decision": "FLAGGED FOR AUDIT",
    "priority": "HIGH",
    "physicians": 14,
    "surgeries": 0,
    "claims": 890,
    "los": 0.0,
    "duplicateRate": 0.31,
    "status": "investigating",
    "directive": "Inspect drug stock registers and retail billing rolls. Subpoena invoices for high-cost immunosuppressants and oncology adjuncts.",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "31% Duplicate Prescription Fills",
        "shap": "+0.295"
      },
      {
        "feature": "outpatient_reimbursed_sum",
        "desc": "Outpatient Drug Bill Total (₹3.45M)",
        "shap": "+0.210"
      },
      {
        "feature": "claims_per_beneficiary",
        "desc": "High Monthly Refill Frequency (4.2 refills/pt)",
        "shap": "+0.155"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Shared Doctors with Local Nursing Homes",
        "shap": "+0.100"
      }
    ],
    "features": {
      "total_claims_count": 890,
      "inpatient_claims_count": 0,
      "outpatient_claims_count": 890,
      "inpatient_reimbursed_sum": 0,
      "outpatient_reimbursed_sum": 3450000,
      "inpatient_deductible_sum": 120000,
      "mean_inpatient_los": 0.0,
      "max_inpatient_los": 0,
      "total_inpatient_surgeries": 0,
      "unique_beneficiaries_count": 620,
      "unique_attending_physicians": 14,
      "unique_operating_physicians": 0,
      "claims_per_attending_ratio": 63.6,
      "graph_degree_centrality": 0.68,
      "same_day_duplicate_rate": 0.31
    },
    "hospital_id": "HOSP-MP-66491"
  },
  {
    "id": "PRV_24_GERIATRIC_REHAB_SANATORIUM",
    "name": "Vridha Seva Old Age Care & Rehab",
    "city": "Coimbatore, TN",
    "category": "clean",
    "tag": "Geriatric Palliative Inpatient Baseline",
    "reimbursement": 1315000,
    "risk": 0.082,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 4,
    "surgeries": 0,
    "claims": 210,
    "los": 12.0,
    "duplicateRate": 0.02,
    "status": "cleared",
    "directive": "Post-stroke and dementia rehabilitation stays comply with geriatric package guidelines. Payments authorized.",
    "drivers": [
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Low Administrative Error Rate (2%)",
        "shap": "-0.210"
      },
      {
        "feature": "unique_attending_physicians",
        "desc": "4 Geriatric Specialists with Regular Rounds",
        "shap": "-0.160"
      },
      {
        "feature": "total_inpatient_surgeries",
        "desc": "Conservative Non-Surgical Management",
        "shap": "-0.130"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "Standard Local Institutional Model",
        "shap": "-0.085"
      }
    ],
    "features": {
      "total_claims_count": 210,
      "inpatient_claims_count": 180,
      "outpatient_claims_count": 30,
      "inpatient_reimbursed_sum": 1250000,
      "outpatient_reimbursed_sum": 65000,
      "inpatient_deductible_sum": 45000,
      "mean_inpatient_los": 12.0,
      "max_inpatient_los": 28,
      "total_inpatient_surgeries": 0,
      "unique_beneficiaries_count": 170,
      "unique_attending_physicians": 4,
      "unique_operating_physicians": 0,
      "claims_per_attending_ratio": 52.5,
      "graph_degree_centrality": 0.22,
      "same_day_duplicate_rate": 0.02
    },
    "hospital_id": "HOSP-TN-33012"
  },
  {
    "id": "PRV_25_NEURO_TRAUMA_FOUNDATION",
    "name": "National Brain & Spine Trauma Apex",
    "city": "New Delhi, DL",
    "category": "clean",
    "tag": "Neurosurgical Trauma Apex Baseline",
    "reimbursement": 9110000,
    "risk": 0.148,
    "decision": "AUTO-CLEARED",
    "priority": "LOW",
    "physicians": 18,
    "surgeries": 280,
    "claims": 390,
    "los": 8.9,
    "duplicateRate": 0.03,
    "status": "cleared",
    "directive": "Emergency craniotomies and spinal fixation substantiated by neuro-ICU clinical monitors. Expedited reimbursement.",
    "drivers": [
      {
        "feature": "unique_attending_physicians",
        "desc": "18 Credentialed Neurosurgeons & Intensivists",
        "shap": "-0.175"
      },
      {
        "feature": "same_day_duplicate_rate",
        "desc": "Protocol Adherence in Critical Trauma (3%)",
        "shap": "-0.140"
      },
      {
        "feature": "mean_inpatient_los",
        "desc": "Valid Post-Neurosurgical Recovery (8.9D)",
        "shap": "-0.110"
      },
      {
        "feature": "graph_degree_centrality",
        "desc": "National Level Apex Trauma Referral",
        "shap": "-0.070"
      }
    ],
    "features": {
      "total_claims_count": 390,
      "inpatient_claims_count": 360,
      "outpatient_claims_count": 30,
      "inpatient_reimbursed_sum": 8900000,
      "outpatient_reimbursed_sum": 210000,
      "inpatient_deductible_sum": 410000,
      "mean_inpatient_los": 8.9,
      "max_inpatient_los": 26,
      "total_inpatient_surgeries": 280,
      "unique_beneficiaries_count": 370,
      "unique_attending_physicians": 18,
      "unique_operating_physicians": 14,
      "claims_per_attending_ratio": 21.7,
      "graph_degree_centrality": 0.39,
      "same_day_duplicate_rate": 0.03
    },
    "hospital_id": "HOSP-DL-11099"
  }
];
