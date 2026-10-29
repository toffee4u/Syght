# Presentation Part 1: Overall Project Introduction & Architecture
**Presenter**: Member 1  
**Role**: Project Lead  
**Topic**: Overall Project Overview, Healthcare Fraud Stakes & End-to-End System Architecture  
**Time**: ~3 minutes  

---

### Slide 1: Project Overview & Vision
- **Project Title**: Syght — Explainable Healthcare Insurance Fraud Detection Platform.
- **Core Mission**: Detect organized billing fraud, phantom surgeries, and hospital collusion rings in real time.
- **Key Capabilities**: Sub-5ms inference latency, SHAP-based clinical explainability, and automated pre-authorization screening.
- **Academic Scope**: Fulfills **Unit-1** (Data Pre-processing & AIML Algorithms) and **Unit-2** (AI Fundamentals with Azure AI Tools).

---

### Slide 2: Real-World Stakes & The Fraud Challenge
- **Massive Financial Drain**: Billions lost annually across national health schemes (PM-JAY) and private health insurers.
- **Severe Class Imbalance**: ~90.5% genuine claims vs ~9.5% fraudulent claims.
- **Why Naive Accuracy Fails**: A naive model classifying 100% of claims as genuine achieves 90.5% accuracy but catches zero fraud.
- **Forensic Fraud Archetypes**:
  - *Phantom Surgeries*: High surgery counts exceeding physical doctor capacities.
  - *ICU Upcoding*: Artificially extending hospital stays to exhaust package limits.
  - *Duplicate Unbundling*: Splitting single diagnostic panels into multiple separate claims.
  - *Physician Monopolies*: Single clinicians generating 90%+ of a facility's revenue.

---

### Slide 3: End-to-End System Pipeline
- **Module 1 (Data Pre-processing)**: Multi-table ingestion (Inpatient, Outpatient, Beneficiary) and log normalization (Unit-1 Exp 1).
- **Module 2 (Exploratory Data Analysis)**: Descriptive statistics, 61 engineered behavioral signals, and correlation heatmaps (Unit-1 Exp 2).
- **Module 3 (Supervised Learning)**: Multi-algorithm benchmark, LightGBM champion (0.7011 PR-AUC), and SHAP explainability (Unit-1 Exp 3 & 4).
- **Module 4 (Cloud & Generative AI)**: Azure ML SDK v2 pipeline, autonomous 4-agent investigation system, and Clinical NLP (Unit-2 Exp 1, 2, 3).
- **Module 5 (Web Application)**: Production FastAPI backend and interactive React 19 single-page dashboard.

---

### Slide 4: Real-Time Web Platform Features
- **Command Center**: Real-time KPI summary cards, fraud score distributions, and operational volume meters.
- **Pre-Auth Gateway**: Instant evaluation of incoming hospital claims with sub-5ms risk decisions.
- **Review Queue**: Interactive SHAP waterfall chart breaking down risk drivers for each flagged provider.
- **Collusion Network Graph**: Visual graph mapping doctor-sharing rings and patient funneling cartels.
- **Dataset Studio**: In-browser scanner supporting CSV, JSON, and text batches with AI sample prompt generation.

---

### Slide 5: Team Presentation Roadmap
- **Member 2**: Unit-1 Exp 1 — Data Pre-processing, Pandas, NumPy & Matplotlib.
- **Member 3**: Unit-1 Exp 2 — Exploratory Data Analysis & Forensic Patterns.
- **Member 4**: Unit-1 Exp 3 & 4 — Supervised Learning & Algorithm Benchmark.
- **Member 5**: Unit-2 Exp 1, 2, 3 — Azure Machine Learning, Clinical NLP & Live Demo.
