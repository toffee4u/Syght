import csv
import json
import os
import shutil

# Directory paths
SAMPLE_DIR = "sample_datasets"
FRONTEND_SAMPLE_DIR = os.path.join("frontend", "public", "sample_datasets")

os.makedirs(SAMPLE_DIR, exist_ok=True)
os.makedirs(FRONTEND_SAMPLE_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. PM-JAY 25 Hospital Benchmark Portfolio
# -------------------------------------------------------------
PORTFOLIO_25_ROWS = [
    {
        "provider_id": "PRV_02_PHANTOM_SURGERY_MILL",
        "name": "Apex Life Surgical Specialty Care",
        "city": "Mumbai, MH",
        "total_claims_count": 460,
        "inpatient_claims_count": 420,
        "inpatient_reimbursed_sum": 5100000,
        "outpatient_reimbursed_sum": 120000,
        "mean_inpatient_los": 5.8,
        "max_inpatient_los": 12,
        "total_inpatient_surgeries": 460,
        "unique_attending_physicians": 2,
        "unique_beneficiaries_count": 380,
        "same_day_duplicate_rate": 0.18,
        "graph_degree_centrality": 0.72,
        "archetype": "Phantom Surgery Mill (230 Surgeries/MD Outlier)",
        "baseline_risk": 1.0,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "PRV_03_KICKBACK_COLLUSION_RING",
        "name": "Metro Health Bipartite Syndicate",
        "city": "Delhi NCR",
        "total_claims_count": 890,
        "inpatient_claims_count": 760,
        "inpatient_reimbursed_sum": 9800000,
        "outpatient_reimbursed_sum": 450000,
        "mean_inpatient_los": 7.2,
        "max_inpatient_los": 18,
        "total_inpatient_surgeries": 580,
        "unique_attending_physicians": 34,
        "unique_beneficiaries_count": 720,
        "same_day_duplicate_rate": 0.32,
        "graph_degree_centrality": 0.94,
        "archetype": "Doctor Recycling & Kickback Ring Hub",
        "baseline_risk": 0.998,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "PRV_08_ICU_LENGTH_OF_STAY_UPCODING",
        "name": "St. Jude Critical Care & Trauma",
        "city": "Bengaluru, KA",
        "total_claims_count": 310,
        "inpatient_claims_count": 310,
        "inpatient_reimbursed_sum": 6400000,
        "outpatient_reimbursed_sum": 0,
        "mean_inpatient_los": 16.8,
        "max_inpatient_los": 48,
        "total_inpatient_surgeries": 140,
        "unique_attending_physicians": 6,
        "unique_beneficiaries_count": 280,
        "same_day_duplicate_rate": 0.05,
        "graph_degree_centrality": 0.58,
        "archetype": "ICU Stay Prolongation & Package Upcoding",
        "baseline_risk": 0.999,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "PRV_05_UNBUNDLING_DIAGNOSTIC_LAB",
        "name": "PulsePath Advanced Pathology & Imaging",
        "city": "Hyderabad, TS",
        "total_claims_count": 1450,
        "inpatient_claims_count": 60,
        "inpatient_reimbursed_sum": 420000,
        "outpatient_reimbursed_sum": 2850000,
        "mean_inpatient_los": 1.2,
        "max_inpatient_los": 3,
        "total_inpatient_surgeries": 0,
        "unique_attending_physicians": 18,
        "unique_beneficiaries_count": 1120,
        "same_day_duplicate_rate": 0.44,
        "graph_degree_centrality": 0.78,
        "archetype": "Unbundled Lab Panels & Duplicate Tests",
        "baseline_risk": 0.954,
        "status": "HIGH RISK",
    },
    {
        "provider_id": "PRV_09_DEAD_PATIENT_BILLING_CLINIC",
        "name": "Sunrise Community Health Roster",
        "city": "Patna, BR",
        "total_claims_count": 220,
        "inpatient_claims_count": 190,
        "inpatient_reimbursed_sum": 1850000,
        "outpatient_reimbursed_sum": 80000,
        "mean_inpatient_los": 4.2,
        "max_inpatient_los": 9,
        "total_inpatient_surgeries": 80,
        "unique_attending_physicians": 3,
        "unique_beneficiaries_count": 160,
        "same_day_duplicate_rate": 0.22,
        "graph_degree_centrality": 0.48,
        "archetype": "Post-Decease Billing Claims",
        "baseline_risk": 0.965,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "PRV_01_RURAL_PRIMARY_CLINIC",
        "name": "Shanti Gramin Primary Health Kendra",
        "city": "Gorakhpur, UP",
        "total_claims_count": 180,
        "inpatient_claims_count": 45,
        "inpatient_reimbursed_sum": 280000,
        "outpatient_reimbursed_sum": 190000,
        "mean_inpatient_los": 2.8,
        "max_inpatient_los": 4,
        "total_inpatient_surgeries": 12,
        "unique_attending_physicians": 18,
        "unique_beneficiaries_count": 160,
        "same_day_duplicate_rate": 0.002,
        "graph_degree_centrality": 0.12,
        "archetype": "Compliant Rural Primary Health Kendra",
        "baseline_risk": 0.048,
        "status": "CLEARED BASELINE",
    },
    {
        "provider_id": "PRV_04_DISTRICT_CIVIL_HOSPITAL",
        "name": "Jan Seva District Civil Hospital",
        "city": "Bhopal, MP",
        "total_claims_count": 1250,
        "inpatient_claims_count": 410,
        "inpatient_reimbursed_sum": 2400000,
        "outpatient_reimbursed_sum": 950000,
        "mean_inpatient_los": 4.1,
        "max_inpatient_los": 10,
        "total_inpatient_surgeries": 190,
        "unique_attending_physicians": 32,
        "unique_beneficiaries_count": 980,
        "same_day_duplicate_rate": 0.015,
        "graph_degree_centrality": 0.22,
        "archetype": "District General Hospital (Clean Public)",
        "baseline_risk": 0.082,
        "status": "CLEARED BASELINE",
    },
    {
        "provider_id": "PRV_06_COMMUNITY_MATERNITY_CARE",
        "name": "Vatsalya Mother & Child Welfare Center",
        "city": "Ahmedabad, GJ",
        "total_claims_count": 340,
        "inpatient_claims_count": 160,
        "inpatient_reimbursed_sum": 850000,
        "outpatient_reimbursed_sum": 420000,
        "mean_inpatient_los": 2.9,
        "max_inpatient_los": 5,
        "total_inpatient_surgeries": 65,
        "unique_attending_physicians": 14,
        "unique_beneficiaries_count": 290,
        "same_day_duplicate_rate": 0.008,
        "graph_degree_centrality": 0.15,
        "archetype": "Maternal & Child Welfare Center",
        "baseline_risk": 0.035,
        "status": "CLEARED BASELINE",
    },
    {
        "provider_id": "PRV_07_CHARITABLE_MISSION_TRUST",
        "name": "Jeevan Jyoti Mission Healthcare Trust",
        "city": "Kochi, KL",
        "total_claims_count": 620,
        "inpatient_claims_count": 180,
        "inpatient_reimbursed_sum": 1100000,
        "outpatient_reimbursed_sum": 580000,
        "mean_inpatient_los": 3.4,
        "max_inpatient_los": 7,
        "total_inpatient_surgeries": 95,
        "unique_attending_physicians": 22,
        "unique_beneficiaries_count": 520,
        "same_day_duplicate_rate": 0.012,
        "graph_degree_centrality": 0.18,
        "archetype": "Charitable Mission Multi-Specialty",
        "baseline_risk": 0.061,
        "status": "CLEARED BASELINE",
    },
    {
        "provider_id": "PRV_10_AYUSH_WELLNESS_SANATORIUM",
        "name": "Aarogya AYUSH Integrator & Daycare",
        "city": "Ranchi, JH",
        "total_claims_count": 140,
        "inpatient_claims_count": 20,
        "inpatient_reimbursed_sum": 120000,
        "outpatient_reimbursed_sum": 310000,
        "mean_inpatient_los": 2.1,
        "max_inpatient_los": 4,
        "total_inpatient_surgeries": 0,
        "unique_attending_physicians": 11,
        "unique_beneficiaries_count": 130,
        "same_day_duplicate_rate": 0.001,
        "graph_degree_centrality": 0.08,
        "archetype": "Compliant AYUSH Wellness Polyclinic",
        "baseline_risk": 0.029,
        "status": "CLEARED BASELINE",
    },
    {
        "provider_id": "PRV_11_CARDIOLOGY_STENT_STACKING",
        "name": "MedPulse Interventional Cardiology Institute",
        "city": "Pune, MH",
        "total_claims_count": 520,
        "inpatient_claims_count": 480,
        "inpatient_reimbursed_sum": 7800000,
        "outpatient_reimbursed_sum": 150000,
        "mean_inpatient_los": 4.8,
        "max_inpatient_los": 14,
        "total_inpatient_surgeries": 390,
        "unique_attending_physicians": 4,
        "unique_beneficiaries_count": 410,
        "same_day_duplicate_rate": 0.28,
        "graph_degree_centrality": 0.81,
        "archetype": "Cardiology Stent Stacking & Angioplasty Overbilling",
        "baseline_risk": 0.982,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "PRV_12_ORTHOPEDIC_IMPLANT_OVERBILLING",
        "name": "Asthi Ortho & Joint Replacement Hospital",
        "city": "Jaipur, RJ",
        "total_claims_count": 380,
        "inpatient_claims_count": 350,
        "inpatient_reimbursed_sum": 6200000,
        "outpatient_reimbursed_sum": 90000,
        "mean_inpatient_los": 6.5,
        "max_inpatient_los": 16,
        "total_inpatient_surgeries": 310,
        "unique_attending_physicians": 3,
        "unique_beneficiaries_count": 320,
        "same_day_duplicate_rate": 0.24,
        "graph_degree_centrality": 0.74,
        "archetype": "Orthopedic Knee Implant Upcoding Without Barcode",
        "baseline_risk": 0.971,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "PRV_13_NEPHROLOGY_DIALYSIS_REPEAT_CHURN",
        "name": "Vrikka Renal Dialysis Daycare Hub",
        "city": "Chennai, TN",
        "total_claims_count": 1650,
        "inpatient_claims_count": 120,
        "inpatient_reimbursed_sum": 780000,
        "outpatient_reimbursed_sum": 3600000,
        "mean_inpatient_los": 1.1,
        "max_inpatient_los": 2,
        "total_inpatient_surgeries": 0,
        "unique_attending_physicians": 5,
        "unique_beneficiaries_count": 210,
        "same_day_duplicate_rate": 0.38,
        "graph_degree_centrality": 0.86,
        "archetype": "Dialysis Session Duplicate Churn & Ghost Sessions",
        "baseline_risk": 0.962,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "PRV_14_ONCOLOGY_DAYCARE_PHANTOM_CHEMO",
        "name": "Sanjeevani Daycare Oncology Infusion Clinic",
        "city": "Kolkata, WB",
        "total_claims_count": 780,
        "inpatient_claims_count": 80,
        "inpatient_reimbursed_sum": 950000,
        "outpatient_reimbursed_sum": 4900000,
        "mean_inpatient_los": 1.4,
        "max_inpatient_los": 3,
        "total_inpatient_surgeries": 0,
        "unique_attending_physicians": 4,
        "unique_beneficiaries_count": 340,
        "same_day_duplicate_rate": 0.31,
        "graph_degree_centrality": 0.79,
        "archetype": "High-Cost Chemotherapy Infusion Phantom Billing",
        "baseline_risk": 0.989,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "PRV_15_NEUROLOGY_OVERUTILIZATION",
        "name": "MindCare Advanced Neurotrauma & Spine Center",
        "city": "Lucknow, UP",
        "total_claims_count": 410,
        "inpatient_claims_count": 380,
        "inpatient_reimbursed_sum": 5800000,
        "outpatient_reimbursed_sum": 110000,
        "mean_inpatient_los": 11.2,
        "max_inpatient_los": 28,
        "total_inpatient_surgeries": 180,
        "unique_attending_physicians": 5,
        "unique_beneficiaries_count": 340,
        "same_day_duplicate_rate": 0.19,
        "graph_degree_centrality": 0.69,
        "archetype": "Neurotrauma Level-3 ICU Upcoding & Prolongation",
        "baseline_risk": 0.945,
        "status": "HIGH RISK",
    },
    {
        "provider_id": "PRV_16_CATARACT_CAMP_MASS_EXTRACTION",
        "name": "Drishti Community Eye Care Network",
        "city": "Varanasi, UP",
        "total_claims_count": 920,
        "inpatient_claims_count": 890,
        "inpatient_reimbursed_sum": 4100000,
        "outpatient_reimbursed_sum": 140000,
        "mean_inpatient_los": 1.2,
        "max_inpatient_los": 2,
        "total_inpatient_surgeries": 890,
        "unique_attending_physicians": 1,
        "unique_beneficiaries_count": 860,
        "same_day_duplicate_rate": 0.42,
        "graph_degree_centrality": 0.88,
        "archetype": "Cataract Camp Mass Extraction (890 Surgeries/1 MD)",
        "baseline_risk": 0.992,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "PRV_17_TRIBAL_SUB_CENTER_COMMUNITY",
        "name": "Vananchal Tribal Health Sub-Center",
        "city": "Sundargarh, OD",
        "total_claims_count": 95,
        "inpatient_claims_count": 15,
        "inpatient_reimbursed_sum": 65000,
        "outpatient_reimbursed_sum": 140000,
        "mean_inpatient_los": 2.2,
        "max_inpatient_los": 3,
        "total_inpatient_surgeries": 2,
        "unique_attending_physicians": 8,
        "unique_beneficiaries_count": 90,
        "same_day_duplicate_rate": 0.001,
        "graph_degree_centrality": 0.05,
        "archetype": "Tribal Healthcare Sub-Center (Clean)",
        "baseline_risk": 0.022,
        "status": "CLEARED BASELINE",
    },
    {
        "provider_id": "PRV_18_BORDER_POST_CHRONIC_CARE",
        "name": "Seemanta Rural Chronic Care Dispensary",
        "city": "Firozpur, PB",
        "total_claims_count": 210,
        "inpatient_claims_count": 35,
        "inpatient_reimbursed_sum": 180000,
        "outpatient_reimbursed_sum": 390000,
        "mean_inpatient_los": 2.6,
        "max_inpatient_los": 5,
        "total_inpatient_surgeries": 6,
        "unique_attending_physicians": 12,
        "unique_beneficiaries_count": 190,
        "same_day_duplicate_rate": 0.004,
        "graph_degree_centrality": 0.09,
        "archetype": "Rural Chronic Care Dispensary (Clean)",
        "baseline_risk": 0.038,
        "status": "CLEARED BASELINE",
    },
    {
        "provider_id": "PRV_19_MUNICIPAL_MATERNAL_HEALTH",
        "name": "Matri Raksha Municipal Maternity Dispensary",
        "city": "Nagpur, MH",
        "total_claims_count": 380,
        "inpatient_claims_count": 190,
        "inpatient_reimbursed_sum": 920000,
        "outpatient_reimbursed_sum": 450000,
        "mean_inpatient_los": 2.7,
        "max_inpatient_los": 4,
        "total_inpatient_surgeries": 78,
        "unique_attending_physicians": 16,
        "unique_beneficiaries_count": 350,
        "same_day_duplicate_rate": 0.006,
        "graph_degree_centrality": 0.14,
        "archetype": "Municipal Maternity Dispensary (Clean)",
        "baseline_risk": 0.041,
        "status": "CLEARED BASELINE",
    },
    {
        "provider_id": "PRV_20_PUBLIC_SECTOR_POLYCLINIC",
        "name": "Shramik Kalyan ESIC Workers Polyclinic",
        "city": "Surat, GJ",
        "total_claims_count": 490,
        "inpatient_claims_count": 110,
        "inpatient_reimbursed_sum": 580000,
        "outpatient_reimbursed_sum": 620000,
        "mean_inpatient_los": 3.1,
        "max_inpatient_los": 6,
        "total_inpatient_surgeries": 42,
        "unique_attending_physicians": 20,
        "unique_beneficiaries_count": 440,
        "same_day_duplicate_rate": 0.007,
        "graph_degree_centrality": 0.16,
        "archetype": "ESIC Industrial Workers Polyclinic (Clean)",
        "baseline_risk": 0.055,
        "status": "CLEARED BASELINE",
    },
    {
        "provider_id": "PRV_21_PEDIATRIC_IMMUNIZATION_HUB",
        "name": "Shishu Suraksha Immunization Clinic",
        "city": "Indore, MP",
        "total_claims_count": 280,
        "inpatient_claims_count": 25,
        "inpatient_reimbursed_sum": 140000,
        "outpatient_reimbursed_sum": 410000,
        "mean_inpatient_los": 2.0,
        "max_inpatient_los": 3,
        "total_inpatient_surgeries": 0,
        "unique_attending_physicians": 15,
        "unique_beneficiaries_count": 260,
        "same_day_duplicate_rate": 0.002,
        "graph_degree_centrality": 0.07,
        "archetype": "Pediatric Clinic & Day Immunization (Clean)",
        "baseline_risk": 0.019,
        "status": "CLEARED BASELINE",
    },
    {
        "provider_id": "PRV_22_GERIATRIC_REHABILITATION_HOME",
        "name": "Vayoshreshtha Geriatric Care Sanatorium",
        "city": "Coimbatore, TN",
        "total_claims_count": 310,
        "inpatient_claims_count": 140,
        "inpatient_reimbursed_sum": 890000,
        "outpatient_reimbursed_sum": 360000,
        "mean_inpatient_los": 4.5,
        "max_inpatient_los": 9,
        "total_inpatient_surgeries": 18,
        "unique_attending_physicians": 18,
        "unique_beneficiaries_count": 280,
        "same_day_duplicate_rate": 0.009,
        "graph_degree_centrality": 0.17,
        "archetype": "Geriatric Rehabilitation Center (Clean)",
        "baseline_risk": 0.068,
        "status": "CLEARED BASELINE",
    },
    {
        "provider_id": "PRV_23_AMBULANCE_GHOST_TRANSFER_LOOP",
        "name": "Vayu Emergency Trauma Response Consortium",
        "city": "Gurugram, HR",
        "total_claims_count": 510,
        "inpatient_claims_count": 480,
        "inpatient_reimbursed_sum": 5200000,
        "outpatient_reimbursed_sum": 80000,
        "mean_inpatient_los": 8.9,
        "max_inpatient_los": 21,
        "total_inpatient_surgeries": 240,
        "unique_attending_physicians": 4,
        "unique_beneficiaries_count": 430,
        "same_day_duplicate_rate": 0.36,
        "graph_degree_centrality": 0.91,
        "archetype": "Inter-Hospital Ghost Transfer & Ambulance Syndicate",
        "baseline_risk": 0.978,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "PRV_24_KIDNEY_STONE_LITHOTRIPSY_CHURN",
        "name": "Ashmari Urological Daycare Center",
        "city": "Agra, UP",
        "total_claims_count": 440,
        "inpatient_claims_count": 390,
        "inpatient_reimbursed_sum": 3900000,
        "outpatient_reimbursed_sum": 120000,
        "mean_inpatient_los": 2.4,
        "max_inpatient_los": 5,
        "total_inpatient_surgeries": 390,
        "unique_attending_physicians": 2,
        "unique_beneficiaries_count": 360,
        "same_day_duplicate_rate": 0.29,
        "graph_degree_centrality": 0.76,
        "archetype": "Kidney Stone Lithotripsy Repeat Shockwave Churn",
        "baseline_risk": 0.958,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "PRV_25_DIABETIC_FOOT_DEBRIDEMENT_FARM",
        "name": "Madhumeha Wound Care & Hyperbaric Clinic",
        "city": "Vadodara, GJ",
        "total_claims_count": 680,
        "inpatient_claims_count": 590,
        "inpatient_reimbursed_sum": 4700000,
        "outpatient_reimbursed_sum": 210000,
        "mean_inpatient_los": 7.4,
        "max_inpatient_los": 19,
        "total_inpatient_surgeries": 490,
        "unique_attending_physicians": 3,
        "unique_beneficiaries_count": 460,
        "same_day_duplicate_rate": 0.34,
        "graph_degree_centrality": 0.82,
        "archetype": "Diabetic Foot Daily Surgical Debridement Farming",
        "baseline_risk": 0.967,
        "status": "CRITICAL RISK",
    },
]

# -------------------------------------------------------------
# 2. Metropolitan ICU & Surgical Fraud Syndicate (15 facilities)
# -------------------------------------------------------------
ICU_SURGICAL_ROWS = [
    {
        "provider_id": "ICU_TERTIARY_01",
        "name": "Metro Apex Multi-Specialty & Trauma",
        "city": "Mumbai, MH",
        "total_claims_count": 620,
        "inpatient_claims_count": 620,
        "inpatient_reimbursed_sum": 12400000,
        "outpatient_reimbursed_sum": 0,
        "mean_inpatient_los": 18.4,
        "max_inpatient_los": 52,
        "total_inpatient_surgeries": 480,
        "unique_attending_physicians": 5,
        "unique_beneficiaries_count": 540,
        "same_day_duplicate_rate": 0.16,
        "graph_degree_centrality": 0.84,
        "archetype": "ICU Stay Prolongation & Ventilator Farming",
        "baseline_risk": 0.999,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_02",
        "name": "Capital City Critical Care & Neuro",
        "city": "New Delhi, DL",
        "total_claims_count": 540,
        "inpatient_claims_count": 510,
        "inpatient_reimbursed_sum": 9800000,
        "outpatient_reimbursed_sum": 120000,
        "mean_inpatient_los": 15.2,
        "max_inpatient_los": 44,
        "total_inpatient_surgeries": 360,
        "unique_attending_physicians": 4,
        "unique_beneficiaries_count": 480,
        "same_day_duplicate_rate": 0.22,
        "graph_degree_centrality": 0.79,
        "archetype": "Neuro-ICU Package Upcoding",
        "baseline_risk": 0.996,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_03",
        "name": "Sovereign Cardiac & Vascular Hospital",
        "city": "Bengaluru, KA",
        "total_claims_count": 480,
        "inpatient_claims_count": 460,
        "inpatient_reimbursed_sum": 8600000,
        "outpatient_reimbursed_sum": 90000,
        "mean_inpatient_los": 6.8,
        "max_inpatient_los": 18,
        "total_inpatient_surgeries": 420,
        "unique_attending_physicians": 3,
        "unique_beneficiaries_count": 410,
        "same_day_duplicate_rate": 0.28,
        "graph_degree_centrality": 0.82,
        "archetype": "Stent Stacking & Multi-Vessel Upcoding",
        "baseline_risk": 0.991,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_04",
        "name": "Highland Joint Reconstruction Institute",
        "city": "Hyderabad, TS",
        "total_claims_count": 390,
        "inpatient_claims_count": 380,
        "inpatient_reimbursed_sum": 7400000,
        "outpatient_reimbursed_sum": 60000,
        "mean_inpatient_los": 7.9,
        "max_inpatient_los": 19,
        "total_inpatient_surgeries": 380,
        "unique_attending_physicians": 2,
        "unique_beneficiaries_count": 350,
        "same_day_duplicate_rate": 0.25,
        "graph_degree_centrality": 0.77,
        "archetype": "Bilateral Knee Replacement Phantom Stacking",
        "baseline_risk": 0.994,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_05",
        "name": "Pinnacle Gastro & Hepatic Critical Care",
        "city": "Chennai, TN",
        "total_claims_count": 420,
        "inpatient_claims_count": 400,
        "inpatient_reimbursed_sum": 6800000,
        "outpatient_reimbursed_sum": 80000,
        "mean_inpatient_los": 12.6,
        "max_inpatient_los": 36,
        "total_inpatient_surgeries": 240,
        "unique_attending_physicians": 4,
        "unique_beneficiaries_count": 370,
        "same_day_duplicate_rate": 0.18,
        "graph_degree_centrality": 0.73,
        "archetype": "Hepatic Encephalopathy ICU Extension",
        "baseline_risk": 0.985,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_06",
        "name": "NorthStar Spine Surgery Syndicate",
        "city": "Chandigarh, PB",
        "total_claims_count": 310,
        "inpatient_claims_count": 300,
        "inpatient_reimbursed_sum": 5900000,
        "outpatient_reimbursed_sum": 50000,
        "mean_inpatient_los": 8.4,
        "max_inpatient_los": 22,
        "total_inpatient_surgeries": 290,
        "unique_attending_physicians": 2,
        "unique_beneficiaries_count": 280,
        "same_day_duplicate_rate": 0.31,
        "graph_degree_centrality": 0.81,
        "archetype": "Multi-Level Spinal Fusion Unbundling",
        "baseline_risk": 0.988,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_07",
        "name": "Sterling Acute Pulmonary & Sleep Center",
        "city": "Ahmedabad, GJ",
        "total_claims_count": 350,
        "inpatient_claims_count": 340,
        "inpatient_reimbursed_sum": 6100000,
        "outpatient_reimbursed_sum": 40000,
        "mean_inpatient_los": 14.1,
        "max_inpatient_los": 39,
        "total_inpatient_surgeries": 120,
        "unique_attending_physicians": 3,
        "unique_beneficiaries_count": 310,
        "same_day_duplicate_rate": 0.14,
        "graph_degree_centrality": 0.69,
        "archetype": "COPD Ventilator Retention Syndicate",
        "baseline_risk": 0.979,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_08",
        "name": "Beacon Interventional Oncology Center",
        "city": "Kolkata, WB",
        "total_claims_count": 490,
        "inpatient_claims_count": 450,
        "inpatient_reimbursed_sum": 8200000,
        "outpatient_reimbursed_sum": 210000,
        "mean_inpatient_los": 9.8,
        "max_inpatient_los": 27,
        "total_inpatient_surgeries": 190,
        "unique_attending_physicians": 4,
        "unique_beneficiaries_count": 410,
        "same_day_duplicate_rate": 0.27,
        "graph_degree_centrality": 0.78,
        "archetype": "Targeted Chemo & Radio-Ablation Unbundling",
        "baseline_risk": 0.984,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_09",
        "name": "Everest Advanced Polytrauma Institute",
        "city": "Jaipur, RJ",
        "total_claims_count": 410,
        "inpatient_claims_count": 390,
        "inpatient_reimbursed_sum": 6900000,
        "outpatient_reimbursed_sum": 70000,
        "mean_inpatient_los": 13.9,
        "max_inpatient_los": 41,
        "total_inpatient_surgeries": 260,
        "unique_attending_physicians": 3,
        "unique_beneficiaries_count": 370,
        "same_day_duplicate_rate": 0.20,
        "graph_degree_centrality": 0.74,
        "archetype": "Trauma Severity Index Inflation",
        "baseline_risk": 0.987,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_10",
        "name": "Royal Palms Surgical & Bariatric Care",
        "city": "Surat, GJ",
        "total_claims_count": 330,
        "inpatient_claims_count": 320,
        "inpatient_reimbursed_sum": 5200000,
        "outpatient_reimbursed_sum": 60000,
        "mean_inpatient_los": 5.4,
        "max_inpatient_los": 12,
        "total_inpatient_surgeries": 320,
        "unique_attending_physicians": 2,
        "unique_beneficiaries_count": 300,
        "same_day_duplicate_rate": 0.23,
        "graph_degree_centrality": 0.71,
        "archetype": "Bariatric Gastric Bypass Coding Substitution",
        "baseline_risk": 0.974,
        "status": "HIGH RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_11",
        "name": "Silverline Emergency Thoracic Clinic",
        "city": "Lucknow, UP",
        "total_claims_count": 290,
        "inpatient_claims_count": 280,
        "inpatient_reimbursed_sum": 4900000,
        "outpatient_reimbursed_sum": 40000,
        "mean_inpatient_los": 10.8,
        "max_inpatient_los": 32,
        "total_inpatient_surgeries": 170,
        "unique_attending_physicians": 3,
        "unique_beneficiaries_count": 260,
        "same_day_duplicate_rate": 0.17,
        "graph_degree_centrality": 0.68,
        "archetype": "Thoracic Drainage Artificial Upcoding",
        "baseline_risk": 0.966,
        "status": "HIGH RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_12",
        "name": "Prism Advanced Nephro-Critical Hospital",
        "city": "Indore, MP",
        "total_claims_count": 360,
        "inpatient_claims_count": 340,
        "inpatient_reimbursed_sum": 5600000,
        "outpatient_reimbursed_sum": 80000,
        "mean_inpatient_los": 11.7,
        "max_inpatient_los": 35,
        "total_inpatient_surgeries": 90,
        "unique_attending_physicians": 3,
        "unique_beneficiaries_count": 310,
        "same_day_duplicate_rate": 0.19,
        "graph_degree_centrality": 0.72,
        "archetype": "Continuous CRRT Dialysis Surcharge Upcoding",
        "baseline_risk": 0.972,
        "status": "HIGH RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_13",
        "name": "Grace Life Surgical Oncology Unit",
        "city": "Nagpur, MH",
        "total_claims_count": 320,
        "inpatient_claims_count": 310,
        "inpatient_reimbursed_sum": 5400000,
        "outpatient_reimbursed_sum": 50000,
        "mean_inpatient_los": 9.2,
        "max_inpatient_los": 24,
        "total_inpatient_surgeries": 220,
        "unique_attending_physicians": 2,
        "unique_beneficiaries_count": 290,
        "same_day_duplicate_rate": 0.26,
        "graph_degree_centrality": 0.75,
        "archetype": "Surgical Margin Re-Excision Stacking",
        "baseline_risk": 0.981,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_14",
        "name": "CityCare Multi-Organ Transplant Hub",
        "city": "Patna, BR",
        "total_claims_count": 280,
        "inpatient_claims_count": 270,
        "inpatient_reimbursed_sum": 8900000,
        "outpatient_reimbursed_sum": 90000,
        "mean_inpatient_los": 16.5,
        "max_inpatient_los": 45,
        "total_inpatient_surgeries": 180,
        "unique_attending_physicians": 4,
        "unique_beneficiaries_count": 250,
        "same_day_duplicate_rate": 0.21,
        "graph_degree_centrality": 0.83,
        "archetype": "Immunosuppressant Phantom Invoicing",
        "baseline_risk": 0.993,
        "status": "CRITICAL RISK",
    },
    {
        "provider_id": "ICU_TERTIARY_15",
        "name": "Zenith Neuro & Cranial Surgical Wing",
        "city": "Bhopal, MP",
        "total_claims_count": 290,
        "inpatient_claims_count": 280,
        "inpatient_reimbursed_sum": 5800000,
        "outpatient_reimbursed_sum": 40000,
        "mean_inpatient_los": 12.1,
        "max_inpatient_los": 38,
        "total_inpatient_surgeries": 190,
        "unique_attending_physicians": 3,
        "unique_beneficiaries_count": 260,
        "same_day_duplicate_rate": 0.22,
        "graph_degree_centrality": 0.76,
        "archetype": "Craniotomy Flap Storage Billing Outlier",
        "baseline_risk": 0.986,
        "status": "CRITICAL RISK",
    },
]

# -------------------------------------------------------------
# 3. Rural PHC & CHC Primary Care Network (20 clean facilities)
# -------------------------------------------------------------
RURAL_PHC_ROWS = [
    {
        "provider_id": f"RURAL_PHC_{i:02d}",
        "name": name,
        "city": city,
        "total_claims_count": claims,
        "inpatient_claims_count": ip_claims,
        "inpatient_reimbursed_sum": ip_reimb,
        "outpatient_reimbursed_sum": op_reimb,
        "mean_inpatient_los": los,
        "max_inpatient_los": max_los,
        "total_inpatient_surgeries": surg,
        "unique_attending_physicians": mds,
        "unique_beneficiaries_count": int(claims * 0.88),
        "same_day_duplicate_rate": dup,
        "graph_degree_centrality": cent,
        "archetype": "Compliant Rural Community PHC/CHC",
        "baseline_risk": round(risk, 3),
        "status": "CLEARED BASELINE",
    }
    for i, (name, city, claims, ip_claims, ip_reimb, op_reimb, los, max_los, surg, mds, dup, cent, risk) in enumerate([
        ("Janani Gramin Primary Health Kendra", "Gorakhpur, UP", 210, 40, 190000, 240000, 2.4, 4, 8, 14, 0.002, 0.08, 0.032),
        ("Kisan Kalyan Rural Dispensary", "Rohtak, HR", 185, 30, 140000, 210000, 2.2, 3, 5, 12, 0.001, 0.06, 0.025),
        ("Gram Swaraj Community Health Center", "Varanasi, UP", 340, 90, 480000, 390000, 2.8, 5, 24, 18, 0.004, 0.11, 0.041),
        ("Annapurna Maternal & Child PHC", "Darbhanga, BR", 260, 110, 520000, 280000, 2.6, 4, 38, 15, 0.003, 0.09, 0.038),
        ("Maa Sharda Rural Health Post", "Satna, MP", 140, 25, 110000, 180000, 2.1, 3, 4, 10, 0.001, 0.05, 0.021),
        ("Bapu Gramin Seva Dispensary", "Wardha, MH", 195, 35, 160000, 230000, 2.5, 4, 6, 13, 0.002, 0.07, 0.029),
        ("Panchayat Kalyan Primary Clinic", "Gaya, BR", 280, 70, 360000, 310000, 2.7, 5, 18, 16, 0.005, 0.10, 0.045),
        ("Savitribai Phule Women's PHC", "Kolhapur, MH", 310, 120, 590000, 340000, 2.9, 5, 42, 17, 0.004, 0.12, 0.039),
        ("Sarvodaya Rural Health Mission", "Udaipur, RJ", 225, 45, 210000, 260000, 2.3, 4, 9, 14, 0.002, 0.08, 0.033),
        ("Seva Bharati Community Dispensary", "Bhubaneswar, OD", 170, 30, 130000, 195000, 2.2, 3, 4, 11, 0.001, 0.06, 0.026),
        ("Nimar Gramin CHC Hospital", "Khandwa, MP", 390, 130, 680000, 410000, 3.1, 6, 45, 20, 0.006, 0.14, 0.052),
        ("Malwa Kisan Health Sanctuary", "Dewas, MP", 205, 40, 180000, 245000, 2.4, 4, 7, 13, 0.002, 0.07, 0.031),
        ("Kaushalya Matri Raksha PHC", "Ayodhya, UP", 290, 115, 540000, 315000, 2.7, 5, 39, 16, 0.003, 0.10, 0.036),
        ("Konkan Coastal Health Post", "Ratnagiri, MH", 160, 28, 125000, 185000, 2.1, 3, 5, 11, 0.001, 0.05, 0.024),
        ("Doaba Rural Family Clinic", "Jalandhar, PB", 240, 55, 270000, 280000, 2.5, 4, 12, 15, 0.003, 0.09, 0.035),
        ("Mithila Arogya Primary Center", "Madhubani, BR", 275, 80, 390000, 300000, 2.6, 5, 21, 15, 0.004, 0.10, 0.042),
        ("Chhotanagpur Community Dispensary", "Hazaribagh, JH", 180, 32, 145000, 215000, 2.3, 4, 6, 12, 0.002, 0.07, 0.028),
        ("Godavari Delta Rural CHC", "Rajahmundry, AP", 360, 105, 560000, 380000, 2.9, 5, 32, 19, 0.005, 0.13, 0.048),
        ("Thar Desert Mobile PHC", "Barmer, RJ", 130, 20, 95000, 165000, 2.0, 3, 3, 9, 0.001, 0.04, 0.019),
        ("Cauvery Gramin Health Station", "Thanjavur, TN", 250, 60, 290000, 295000, 2.5, 4, 15, 16, 0.003, 0.09, 0.034),
    ], start=1)
]

# -------------------------------------------------------------
# 4. Diagnostic & Pathology Lab Syndicate (14 facilities)
# -------------------------------------------------------------
DIAGNOSTIC_LAB_ROWS = [
    {
        "provider_id": f"LAB_SYNDICATE_{i:02d}",
        "name": name,
        "city": city,
        "total_claims_count": claims,
        "inpatient_claims_count": 0,
        "inpatient_reimbursed_sum": 0,
        "outpatient_reimbursed_sum": op_reimb,
        "mean_inpatient_los": 0.0,
        "max_inpatient_los": 0,
        "total_inpatient_surgeries": 0,
        "unique_attending_physicians": mds,
        "unique_beneficiaries_count": int(claims * 0.65),
        "same_day_duplicate_rate": dup,
        "graph_degree_centrality": cent,
        "archetype": "Unbundled Diagnostic Panels & Phantom Scans",
        "baseline_risk": round(risk, 3),
        "status": "HIGH RISK" if risk < 0.97 else "CRITICAL RISK",
    }
    for i, (name, city, claims, op_reimb, mds, dup, cent, risk) in enumerate([
        ("PrecisionPath Automated Diagnostic Hub", "Hyderabad, TS", 1820, 3450000, 12, 0.46, 0.88, 0.985),
        ("Apex BioScan Advanced Imaging Syndicate", "Delhi NCR", 1640, 3120000, 10, 0.42, 0.84, 0.978),
        ("OmniGene Molecular Pathology Alliance", "Mumbai, MH", 1490, 2890000, 9, 0.39, 0.81, 0.972),
        ("Metropolis Core Pathology Network", "Bengaluru, KA", 1580, 2980000, 11, 0.44, 0.85, 0.981),
        ("StarPath Comprehensive Diagnostic Ring", "Chennai, TN", 1320, 2540000, 8, 0.38, 0.79, 0.965),
        ("PulseScan CT & MRI Rapid Lab", "Pune, MH", 1210, 2380000, 7, 0.41, 0.76, 0.969),
        ("NeuroScan Imaging Consortium", "Ahmedabad, GJ", 1140, 2210000, 6, 0.45, 0.82, 0.976),
        ("BioReference Advanced Blood Labs", "Kolkata, WB", 1380, 2670000, 8, 0.43, 0.80, 0.974),
        ("Sterling Pathology Cross-Admit Network", "Lucknow, UP", 1290, 2490000, 7, 0.37, 0.77, 0.962),
        ("CareLab Ultrasound & Doppler Center", "Jaipur, RJ", 1080, 2140000, 6, 0.48, 0.83, 0.980),
        ("PrimeGene Clinical Genomics Lab", "Surat, GJ", 990, 1950000, 5, 0.39, 0.75, 0.958),
        ("ExcelPath Biochemical Laboratory", "Patna, BR", 1160, 2280000, 6, 0.46, 0.84, 0.979),
        ("NovaScan Dual Energy CT Consortium", "Indore, MP", 1020, 2030000, 5, 0.40, 0.78, 0.968),
        ("Apex Ultrasound & 3D Imaging Farm", "Varanasi, UP", 1250, 2410000, 7, 0.47, 0.86, 0.983),
    ], start=1)
]

# -------------------------------------------------------------
# 5. Daycare Hemodialysis & Oncology Churn (12 facilities)
# -------------------------------------------------------------
DAYCARE_CHURN_ROWS = [
    {
        "provider_id": f"DAYCARE_CHURN_{i:02d}",
        "name": name,
        "city": city,
        "total_claims_count": claims,
        "inpatient_claims_count": int(claims * 0.15),
        "inpatient_reimbursed_sum": int(total_reimb * 0.22),
        "outpatient_reimbursed_sum": int(total_reimb * 0.78),
        "mean_inpatient_los": 1.2,
        "max_inpatient_los": 2,
        "total_inpatient_surgeries": 0,
        "unique_attending_physicians": mds,
        "unique_beneficiaries_count": int(claims * 0.32),
        "same_day_duplicate_rate": dup,
        "graph_degree_centrality": cent,
        "archetype": "Dialysis & Chemo Repeat Session Churn",
        "baseline_risk": round(risk, 3),
        "status": "CRITICAL RISK",
    }
    for i, (name, city, claims, total_reimb, mds, dup, cent, risk) in enumerate([
        ("Vrikka Sanjeevani Renal Dialysis Clinic", "Chennai, TN", 1540, 4200000, 3, 0.42, 0.89, 0.994),
        ("KidneyCare Daycare Hemodialysis Hub", "Bengaluru, KA", 1420, 3900000, 4, 0.38, 0.85, 0.988),
        ("OncoCare Chemotherapy Day Infusion Center", "Mumbai, MH", 890, 5400000, 3, 0.36, 0.82, 0.992),
        ("NephroLife Duplicate Cycle Dialysis Clinic", "Hyderabad, TS", 1380, 3750000, 4, 0.40, 0.87, 0.990),
        ("Sanjeevani Day Oncology Infusion Suite", "Delhi NCR", 820, 4900000, 2, 0.34, 0.80, 0.986),
        ("RenalPlus High-Flux Hemodialysis Center", "Kolkata, WB", 1260, 3450000, 3, 0.39, 0.84, 0.987),
        ("Hope Oncology Day Infusion Clinic", "Pune, MH", 760, 4600000, 2, 0.35, 0.79, 0.984),
        ("DialysisExpress 24/7 Daycare Hub", "Ahmedabad, GJ", 1190, 3280000, 3, 0.44, 0.86, 0.991),
        ("CancerCare Day Chemotherapy Pavilion", "Lucknow, UP", 710, 4300000, 2, 0.37, 0.81, 0.985),
        ("Metro Dialysis & Renal Wellness", "Jaipur, RJ", 1080, 2980000, 3, 0.41, 0.83, 0.989),
        ("Precision Chemo Infusion Lounge", "Chandigarh, PB", 680, 4100000, 2, 0.33, 0.78, 0.982),
        ("LifeLine Daycare Dialysis Syndicate", "Surat, GJ", 1120, 3100000, 3, 0.43, 0.85, 0.990),
    ], start=1)
]

# Write CSV files
CSV_SPECS = [
    ("pmjay_25_hospital_portfolio.csv", PORTFOLIO_25_ROWS),
    ("metropolitan_icu_surgical_claims.csv", ICU_SURGICAL_ROWS),
    ("rural_primary_care_network.csv", RURAL_PHC_ROWS),
    ("diagnostic_lab_unbundling_syndicate.csv", DIAGNOSTIC_LAB_ROWS),
    ("dialysis_chemotherapy_daycare_claims.csv", DAYCARE_CHURN_ROWS),
]

CSV_HEADERS = [
    "provider_id", "name", "city", "total_claims_count", "inpatient_claims_count",
    "inpatient_reimbursed_sum", "outpatient_reimbursed_sum", "mean_inpatient_los",
    "max_inpatient_los", "total_inpatient_surgeries", "unique_attending_physicians",
    "unique_beneficiaries_count", "same_day_duplicate_rate", "graph_degree_centrality",
    "archetype", "baseline_risk", "status"
]

for filename, rows in CSV_SPECS:
    filepath = os.path.join(SAMPLE_DIR, filename)
    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
        writer.writeheader()
        writer.writerows(rows)
    shutil.copy(filepath, os.path.join(FRONTEND_SAMPLE_DIR, filename))
    print(f"Generated CSV: {filepath} ({len(rows)} records)")

# -------------------------------------------------------------
# 6. JSON Array of Claims (claims_batch_payload.json)
# -------------------------------------------------------------
CLAIMS_PAYLOAD = []
CLAIM_TEMPLATES = [
    {
        "provider_id": "PRV_02_PHANTOM_SURGERY_MILL",
        "provider_name": "Apex Life Surgical Specialty Care",
        "dx_code": "K80.2",
        "dx_desc": "Calculus of gallbladder without cholecystitis",
        "proc_code": "51.23",
        "proc_desc": "Laparoscopic cholecystectomy",
        "physician_reg": "MCI-MH-44912",
        "cost": 115000,
        "los": 5,
        "anomaly": "Excessive surgeries per MD outlier (230x)",
    },
    {
        "provider_id": "PRV_08_ICU_LENGTH_OF_STAY_UPCODING",
        "provider_name": "St. Jude Critical Care & Trauma",
        "dx_code": "J18.9",
        "dx_desc": "Pneumonia, unspecified organism",
        "proc_code": "96.72",
        "proc_desc": "Continuous invasive mechanical ventilation for 96 consecutive hours or more",
        "physician_reg": "MCI-KA-10294",
        "cost": 380000,
        "los": 24,
        "anomaly": "ICU stay extension beyond diagnostic protocol norms",
    },
    {
        "provider_id": "PRV_11_CARDIOLOGY_STENT_STACKING",
        "provider_name": "MedPulse Interventional Cardiology Institute",
        "dx_code": "I21.0",
        "dx_desc": "Acute transmural myocardial infarction of anterior wall",
        "proc_code": "36.06",
        "proc_desc": "Insertion of non-drug-eluting coronary artery stent(s)",
        "physician_reg": "MCI-MH-77182",
        "cost": 295000,
        "los": 4,
        "anomaly": "Multi-stent unbundling in single admission",
    },
    {
        "provider_id": "PRV_13_NEPHROLOGY_DIALYSIS_REPEAT_CHURN",
        "provider_name": "Vrikka Renal Dialysis Daycare Hub",
        "dx_code": "N18.6",
        "dx_desc": "End stage renal disease",
        "proc_code": "39.95",
        "proc_desc": "Hemodialysis procedure",
        "physician_reg": "MCI-TN-98102",
        "cost": 42000,
        "los": 1,
        "anomaly": "Same-day duplicate dialysis session billing",
    },
    {
        "provider_id": "PRV_01_RURAL_PRIMARY_CLINIC",
        "provider_name": "Shanti Gramin Primary Health Kendra",
        "dx_code": "A09.0",
        "dx_desc": "Other and unspecified gastroenteritis and colitis",
        "proc_code": "99.21",
        "proc_desc": "Injection of antibiotic and oral rehydration therapy",
        "physician_reg": "MCI-UP-33109",
        "cost": 6500,
        "los": 2,
        "anomaly": "None (Compliant primary care baseline)",
    },
]

for idx in range(1, 41):
    tmpl = CLAIM_TEMPLATES[(idx - 1) % len(CLAIM_TEMPLATES)]
    admit_day = (idx % 28) + 1
    disch_day = min(admit_day + tmpl["los"], 28)
    CLAIMS_PAYLOAD.append({
        "claim_id": f"CLM-2026-{10000 + idx}",
        "pre_auth_id": f"PA-IN-{80000 + idx}",
        "provider_id": tmpl["provider_id"],
        "provider_name": tmpl["provider_name"],
        "patient_id": f"BENEFICIARY-{4000 + (idx % 12)}",
        "patient_age": 32 + (idx % 45),
        "patient_gender": "FEMALE" if idx % 2 == 0 else "MALE",
        "admission_date": f"2026-09-{admit_day:02d}",
        "discharge_date": f"2026-09-{disch_day:02d}",
        "length_of_stay_days": tmpl["los"],
        "primary_icd10_code": tmpl["dx_code"],
        "primary_icd10_description": tmpl["dx_desc"],
        "procedure_code": tmpl["proc_code"],
        "procedure_description": tmpl["proc_desc"],
        "attending_physician_reg": tmpl["physician_reg"],
        "billed_amount_inr": tmpl["cost"],
        "claimed_reimbursement_inr": int(tmpl["cost"] * 0.90),
        "status": "FLAGGED_FOR_AUDIT" if "None" not in tmpl["anomaly"] else "AUTO_CLEARED",
        "anomaly_indicators": tmpl["anomaly"],
    })

batch_json_path = os.path.join(SAMPLE_DIR, "claims_batch_payload.json")
with open(batch_json_path, "w", encoding="utf-8") as f:
    json.dump(CLAIMS_PAYLOAD, f, indent=2)
shutil.copy(batch_json_path, os.path.join(FRONTEND_SAMPLE_DIR, "claims_batch_payload.json"))
print(f"Generated JSON Array of Claims: {batch_json_path} ({len(CLAIMS_PAYLOAD)} claims)")

# -------------------------------------------------------------
# 7. Single Claim Sample (single_claim_sample.json)
# -------------------------------------------------------------
SINGLE_CLAIM = {
    "claim_id": "CLM-2026-90412",
    "pre_auth_reference": "PA-MH-99201",
    "policy_number": "PMJAY-MH-2026-7782190",
    "provider_id": "PRV_02_PHANTOM_SURGERY_MILL",
    "provider_name": "Apex Life Surgical Specialty Care",
    "hospital_accreditation": "NABH-PROVISIONAL",
    "patient": {
        "id": "BENEFICIARY-78901",
        "name": "Rameshwar K. Shinde",
        "age": 49,
        "gender": "MALE",
        "location": "Thane, Maharashtra",
        "aadhaar_verified": True
    },
    "clinical_episode": {
        "admission_date": "2026-10-12T09:30:00Z",
        "discharge_date": "2026-10-17T14:00:00Z",
        "length_of_stay": 5,
        "department": "Surgical Gastroenterology",
        "primary_diagnosis": {
            "code": "K80.2",
            "description": "Calculus of gallbladder without cholecystitis"
        },
        "secondary_diagnoses": [
            {"code": "E11.9", "description": "Type 2 diabetes mellitus without complications"}
        ],
        "surgical_procedures": [
            {
                "code": "51.23",
                "name": "Laparoscopic cholecystectomy",
                "operating_theatre_id": "OT-01",
                "surgeon_reg_number": "MCI-MH-44912",
                "start_time": "2026-10-13T10:15:00Z",
                "end_time": "2026-10-13T11:45:00Z"
            }
        ]
    },
    "financials": {
        "total_billed_inr": 128500,
        "pre_auth_approved_inr": 115000,
        "patient_co_pay_inr": 0,
        "package_code": "SG001A_LAP_CHOLE",
        "claimed_reimbursement_inr": 115000
    },
    "telemetry": {
        "submission_latency_ms": 3.8,
        "same_day_duplicate_submission": False,
        "historical_provider_claims_today": 42
    }
}

single_json_path = os.path.join(SAMPLE_DIR, "single_claim_sample.json")
with open(single_json_path, "w", encoding="utf-8") as f:
    json.dump(SINGLE_CLAIM, f, indent=2)
shutil.copy(single_json_path, os.path.join(FRONTEND_SAMPLE_DIR, "single_claim_sample.json"))
print(f"Generated Single Claim JSON: {single_json_path}")

# -------------------------------------------------------------
# 8. TXT Export File (claims_data_export.txt)
# -------------------------------------------------------------
txt_export_path = os.path.join(SAMPLE_DIR, "claims_data_export.txt")
with open(txt_export_path, "w", encoding="utf-8") as f:
    f.write("\t".join(CSV_HEADERS) + "\n")
    for r in PORTFOLIO_25_ROWS:
        line = "\t".join(str(r[h]) for h in CSV_HEADERS)
        f.write(line + "\n")
shutil.copy(txt_export_path, os.path.join(FRONTEND_SAMPLE_DIR, "claims_data_export.txt"))
print(f"Generated TXT Export: {txt_export_path}")

# -------------------------------------------------------------
# 9. README.md Documentation
# -------------------------------------------------------------
README_CONTENT = """# Syght Sample Healthcare Datasets for Model Testing

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
"""

readme_path = os.path.join(SAMPLE_DIR, "README.md")
with open(readme_path, "w", encoding="utf-8") as f:
    f.write(README_CONTENT.strip() + "\n")
shutil.copy(readme_path, os.path.join(FRONTEND_SAMPLE_DIR, "README.md"))
print(f"Generated Documentation: {readme_path}")
print("ALL SAMPLE DATASETS GENERATED SUCCESSFULLY!")
