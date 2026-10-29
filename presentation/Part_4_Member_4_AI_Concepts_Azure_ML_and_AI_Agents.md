# Presentation Part 4: AI Concepts, Azure ML Architecture & AI Agent Systems
**Presenter**: Member 4  
**Syllabus Focus**: Unit-2 Experiment 1 & Experiment 2 (AI/ML Concepts, Azure ML SDK v2 & Generative AI Agents)  
**Time**: ~3 minutes  

---

### Slide 1: AI & ML Concepts in Healthcare Fraud
- **Paradigm Comparison**:
  - *Rule Engines*: Rigid if-then checks, easily bypassed by adapting fraud rings.
  - *Machine Learning*: Statistical pattern recognition on high-dimensional claims data.
  - *Deep Learning*: Complex representations, but harder to interpret in legal audits.
- **Key ML Principles Applied**:
  - *Bias-Variance Tradeoff*: Depth-limited tree structures preventing memorization of noise.
  - *Class Imbalance Strategy*: `scale_pos_weight` and threshold calibration over destructive under-sampling.
  - *Algorithmic Fairness*: Auditing model predictions across demographic slices to prevent patient bias.

---

### Slide 2: Azure Machine Learning Pipeline Architecture (SDK v2)
- **Cloud Infrastructure**: Azure ML Workspace, Resource Group, and `Standard_DS3_v2` compute cluster.
- **4-Stage Pipeline Job (`pipeline_job.yaml`)**:
  - **Stage 1**: Ingestion & Pre-flight Quality Audit (CommandComponent).
  - **Stage 2**: Provider Feature Engineering (CommandComponent).
  - **Stage 3**: Stratified 5-Fold Cross-Validation & LightGBM Training (CommandComponent).
  - **Stage 4**: Test Set Evaluation & Azure Model Registry Registration (CommandComponent).

---

### Slide 3: Azure Managed Online Endpoint & Scoring
- **Endpoint Configuration**: `aml-syght-online-ep` with auth key security.
- **Scoring Engine (`score.py`)**:
  - `init()` loads serialized model bundle and preprocessors on startup.
  - `run()` processes batched claim payloads with sub-5ms inference latency.
- **Deployment Specification**: Auto-scaling configuration on dedicated CPU instances with isolated conda environment.

---

### Slide 4: Generative AI Multi-Agent Forensic System
- **Architecture**: 4 specialized autonomous forensic agents collaborating on complex cases:
  1. **Clinical Coding Auditor**: Flags unbundling and unsupported procedure codes.
  2. **Statistical Anomaly Specialist**: Evaluates deviation z-scores and billing volume spikes.
  3. **Collusion Ring Investigator**: Analyzes shared physician networks between facilities.
  4. **Lead Adjudicator**: Synthesizes agent deliberations into plain-language forensic narratives and action plans.
- **Output**: Generates human-readable audit summaries and frozen disbursement recommendations.
