# Presentation Part 5: Clinical NLP, Azure AI Tools & Live Platform Demo
**Presenter**: Member 5  
**Syllabus Focus**: Unit-2 Experiment 3 & Live Platform Demo (Generative AI, NLP, Azure AI Tools & Full-Stack Platform)  
**Point Explained**: How Clinical NLP scans doctor notes for phantom billing/upcoding, Azure AI Document Intelligence extracts scanned bills, and how the live web platform functions.  
**Time**: ~3 minutes  

---

### Slide 1: Clinical NLP on Medical Notes & Discharge Summaries
- **Doctor Notes Analysis**: Natural Language Processing applied to un-structured EHR notes and discharge summaries.
- **Discrepancy Detection**:
  - *Upcoding Detection*: Billed intensive care unit (ICU) charges when clinical notes state routine check-up.
  - *Phantom Billing Detection*: Surgical procedure codes billed without corresponding clinical operative documentation.
- **Entity Extraction**: Automated regex and clinical NER for ICD-10 diagnosis codes, procedure codes, and stay durations.

---

### Slide 2: Azure AI Document Intelligence & Azure AI Search
- **Azure AI Document Intelligence**:
  - Pre-built invoice and layout models extract line items from scanned physical bills and lab reports.
  - Flags duplicate invoice numbers and mismatched patient names.
- **Azure AI Search**:
  - Semantic vector search across historical fraud investigations and regulatory precedent databases.
  - Retrieves relevant past audit outcomes to guide current claim reviews.

---

### Slide 3: Full-Stack Production Architecture
- **Backend (FastAPI)**:
  - High-performance asynchronous REST endpoints (`/api/v1/predict`, `/api/v1/preauth/evaluate`, `/api/v1/agents/investigate`).
  - Automated interactive Swagger & ReDoc documentation.
  - Built-in CORS, health checks, and sub-5ms model inference.
- **Frontend (React 19 & Tailwind CSS)**:
  - Responsive, modern dashboard built with Vite.
  - Real-time simulation of incoming insurance claims.
  - Dataset Studio for scanning multi-table, single-claim, and custom CSV formats with AI sample prompt generation.

---

### Slide 4: Live Web Platform Demonstration
- **Command Center**: Real-time KPI cards, fraud score distributions, and operational volume meters.
- **Pre-Auth Gateway**: Instant evaluation of high-risk claims with automated approval or fraud freeze decisions.
- **Review Queue & SHAP Waterfall**: Interactive visualizer showing individual feature contributions per flagged provider.
- **Collusion Network Graph**: Force-directed network diagram exposing doctor-sharing cartels across multiple clinics.
