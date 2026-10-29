# Presentation Part 5: AI Concepts, Azure AI Tools, Clinical NLP & Live Demo
**Presenter**: Member 5  
**Syllabus Focus**: Unit-2 Experiment 1, 2, 3 & Live Platform Demo (AI Concepts, Azure ML, NLP & Web Platform)  
**Point Explained**: AI Principles, Azure ML SDK v2 pipeline, autonomous 4-agent system, Clinical NLP on doctor notes & live web platform demonstration.  
**Time**: ~3 minutes  

---

### Slide 1: AI & ML Concepts in Healthcare Fraud (Experiment 1)
- **Paradigm Comparison**:
  - *Rule Engines*: Rigid if-then checks, easily bypassed by adapting fraud rings.
  - *Machine Learning*: Statistical pattern recognition on high-dimensional claims data.
  - *Deep Learning*: Complex representations, but harder to interpret in legal audits.
- **Key ML Principles Applied**:
  - *Bias-Variance Tradeoff*: Depth-limited tree structures preventing memorization of noise.
  - *Class Imbalance Strategy*: `scale_pos_weight` and threshold calibration over destructive under-sampling.
  - *Algorithmic Fairness*: Auditing model predictions across demographic slices to prevent patient bias.

---

### Slide 2: Azure Machine Learning Pipeline Architecture (SDK v2 - Experiment 2)
- **Cloud Infrastructure**: Azure ML Workspace, Resource Group, and `Standard_DS3_v2` compute cluster.
- **4-Stage Pipeline Job (`pipeline_job.yaml`)**:
  - **Stage 1**: Ingestion & Pre-flight Quality Audit (CommandComponent).
  - **Stage 2**: Provider Feature Engineering (CommandComponent).
  - **Stage 3**: Stratified 5-Fold Cross-Validation & LightGBM Training (CommandComponent).
  - **Stage 4**: Test Set Evaluation & Azure Model Registry Registration (CommandComponent).
- **Online Inference Endpoint**: `aml-syght-online-ep` with `score.py` processing batched claims with sub-5ms latency.

---

### Slide 3: Autonomous GenAI Multi-Agent Forensic System (Experiment 2)
- **Architecture**: 4 specialized autonomous forensic agents collaborating on complex cases:
  1. **Clinical Coding Auditor**: Flags unbundling and unsupported procedure codes.
  2. **Statistical Anomaly Specialist**: Evaluates deviation z-scores and billing volume spikes.
  3. **Collusion Ring Investigator**: Analyzes shared physician networks between facilities.
  4. **Lead Adjudicator**: Synthesizes agent deliberations into plain-language forensic narratives and action plans.
- **Output**: Generates human-readable audit summaries and frozen disbursement recommendations.

---

### Slide 4: Clinical NLP on Doctor Notes & Azure AI Tools (Experiment 3)
- **Clinical NLP on Doctor Notes**:
  - Scans unstructured EHR notes and discharge summaries to detect discrepancies against billed claim codes.
  - *Upcoding Detection*: Billed intensive care unit (ICU) charges when clinical notes state routine check-up.
  - *Phantom Billing Detection*: Surgical procedure codes billed without corresponding clinical operative documentation.
- **Azure AI Document Intelligence & Search**:
  - OCR line-item extraction from scanned paper bills and pathology reports.
  - Semantic vector search across historical fraud investigations and regulatory precedent databases.

---

### Slide 5: Live Web Platform Demonstration
- **FastAPI Production Backend**: Asynchronous REST endpoints, interactive OpenAPI/Swagger docs, and sub-5ms model inference.
- **Interactive React 19 Frontend**:
  - *Command Center*: Real-time overview of fraud metrics, distribution graphs, and volume meters.
  - *Pre-Auth Gateway*: Live simulation of incoming claims scored in real time with instant approval/freeze decisions.
  - *Review Queue & SHAP Visualizer*: Interactive waterfall explanations of individual claim risk drivers.
  - *Collusion Network*: Force-directed network diagram exposing doctor-sharing cartels across multiple clinics.
  - *Dataset Studio*: Interactive scanner with AI sample prompt generation.
