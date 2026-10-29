# 📘 Healthcare Insurance Fraud Detection — Lab Experiments Manual
## Healthcare Insurance Fraud Detector Platform (Project Syght)

---

## 📌 Course Curriculum & Syllabus Alignment Matrix

This project directly fulfills the prescribed university/practical curriculum for **Data Pre-processing, AIML Algorithms, and Azure AI Tools**. Every experiment listed in the syllabus has an end-to-end, reproducible implementation, an interactive Jupyter Notebook, production Python modules, and comprehensive Viva Voce questions with answers.

| Syllabus Unit | Experiment No. | Official Syllabus Course Content / Experiment Title | Project Syght Implementation & Artifacts | Primary Technologies & Libraries | Status |
|:---:|:---:|---|---|---|:---:|
| **Unit-1** | **Exp 1** | **Introduction to Data Pre-processing, Pandas, NumPy & Matplotlib for Data Analysis** | [Experiment 1 Notebook](file:///c:/toffee/Syght/notebooks/experiments/Experiment_1_Data_Preprocessing_Pandas_NumPy_Matplotlib.ipynb)<br>`ml_pipeline/data_audit.py`<br>`ml_pipeline/preprocessing.py` | Python 3.11, Pandas, NumPy, Matplotlib | **100% Complete** |
| **Unit-1** | **Exp 2** | **Perform exploratory data analysis (EDA) on a real-world dataset to identify patterns, correlations, and trends using descriptive statistics and visualizations** | [Experiment 2 Notebook](file:///c:/toffee/Syght/notebooks/experiments/Experiment_2_Exploratory_Data_Analysis_EDA.ipynb)<br>`reports/figures/`<br>`ml_pipeline/visualization.py` | Pandas, Seaborn, Matplotlib, SciPy | **100% Complete** |
| **Unit-1** | **Exp 3** | **Understand supervised learning to train and develop classifier models** | [Experiment 3 Notebook](file:///c:/toffee/Syght/notebooks/experiments/Experiment_3_Supervised_Learning_Classifier_Development.ipynb)<br>`ml_pipeline/split.py`<br>`ml_pipeline/evaluate.py` | Scikit-Learn, PR-AUC, ROC-AUC, Stratified K-Fold | **100% Complete** |
| **Unit-1** | **Exp 4** | **Build a classification model by using different machine learning algorithms** | [Experiment 4 Notebook](file:///c:/toffee/Syght/notebooks/experiments/Experiment_4_Multi_Algorithm_Classification_Benchmark.ipynb)<br>`ml_pipeline/train.py`<br>`reports/benchmark_report.md` | LightGBM, XGBoost, Random Forest, Logistic Reg, 1-SE Rule | **100% Complete** |
| **Unit-2** | **Exp 1** | **Introduction to Artificial Intelligence and Machine Learning Concepts** | [Experiment 5 Notebook](file:///c:/toffee/Syght/notebooks/experiments/Experiment_5_AI_ML_Concepts_Healthcare_Fraud.ipynb)<br>`docs/pipeline_architecture.md` | Theoretical AI/ML, Bias-Variance, Fairness Ethics | **100% Complete** |
| **Unit-2** | **Exp 2** | **Understanding Azure Machine Learning, Generative AI Models, and AI Agent Systems** | [Experiment 6 Notebook](file:///c:/toffee/Syght/notebooks/experiments/Experiment_6_Azure_ML_Generative_AI_and_AI_Agents.ipynb)<br>`ml_pipeline/azure_ml_integration.py`<br>`ml_pipeline/genai_agent_system.py` | Azure ML SDK v2, Azure OpenAI GPT-4, 4-Agent Orchestrator | **100% Complete** |
| **Unit-2** | **Exp 3** | **Exploring Generative AI, Natural Language Processing and Azure AI Tools** | [Experiment 7 Notebook](file:///c:/toffee/Syght/notebooks/experiments/Experiment_7_Generative_AI_NLP_and_Azure_AI_Tools.ipynb)<br>`ml_pipeline/nlp_clinical_analyzer.py` | Clinical NLP, Azure AI Document Intelligence, Azure AI Search | **100% Complete** |

---

# 🧪 Unit-1: Data Pre-processing and AIML Algorithms

---

## 🔬 Experiment No. 1
### Title: Introduction to Data Pre-processing, Pandas, NumPy & Matplotlib for Data Analysis

### 1. Aim:
To perform data ingestion, schema validation, missing value imputation, type transformations, NumPy vectorized operations, and exploratory plotting using Matplotlib on multi-table healthcare insurance claims data.

### 2. Theoretical Background:
Real-world healthcare insurance datasets are fragmented across relational databases:
1. **Inpatient Admissions**: Hospitalization records containing Admission/Discharge timestamps, Diagnosis-Related Groups (DRG), and high-deductible claims.
2. **Outpatient Clinic Visits**: High-volume, same-day ambulatory services.
3. **Beneficiary Clinical Profiles**: Patient demographic records containing 11 chronic disease indicators (Alzheimer's, Heart Failure, Cancer, Diabetes, etc.).
4. **Provider Ground Truth Labels**: Official audit determinations (`PotentialFraud = Yes/No`).

Pre-processing must handle:
- **Missingness**: Optional surgical fields (e.g. `OperatingPhysician`) must be encoded explicitly (as `"NONE"`) rather than dropped.
- **Extreme Skewness**: Medical reimbursement amounts range from ₹0 to ₹1,000,000+. Applying $\log(1 + x)$ transforms heavy-tailed distributions into stable, approximately normal inputs.
- **Date Derivation**: Calculating Length of Stay ($\text{LOS} = \text{DischargeDt} - \text{AdmissionDt}$) for clinical duration analysis.

### 3. Step-by-Step Methodology:
1. Load CSV tables using `pandas.read_csv()`.
2. Compute null value frequencies: `df.isnull().sum() / len(df) * 100`.
3. Impute missing numerical values (`DeductibleAmtPaid`) with 0.0 and missing categorical strings with `"NONE"`.
4. Parse date fields into `datetime64[ns]` and calculate integer days for Length of Stay.
5. Apply NumPy vectorization `np.log1p(np.maximum(df['InscClaimAmtReimbursed'], 0.0))` to normalize reimbursement.
6. Plot raw vs log-transformed distributions using Matplotlib histograms.

### 4. Code & Implementation:
- **Notebook**: `notebooks/experiments/Experiment_1_Data_Preprocessing_Pandas_NumPy_Matplotlib.ipynb`
- **Module**: `ml_pipeline/data_audit.py` & `ml_pipeline/preprocessing.py`

### 5. Viva Voce Questions & Answers:
- **Q1: Why is $\log(1+x)$ (`np.log1p`) preferred over $\log(x)$?**  
  *Answer:* Billed amounts can be exactly zero (e.g. fully deductible or denied claims). $\log(0)$ produces $-\infty$, which crashes numerical optimizers. $\log(1 + 0) = 0$, which preserves zero values safely.
- **Q2: Why should we never drop rows with null physician IDs in outpatient visits?**  
  *Answer:* Routine consultations and diagnostic blood tests do not have an operating surgeon. Dropping these rows would discard >80% of outpatient records, creating massive sample selection bias.
- **Q3: What is the computational advantage of NumPy vectorization over Python `for` loops?**  
  *Answer:* NumPy executes operations in compiled C/Fortran memory buffers with SIMD (Single Instruction, Multiple Data) processor parallelism, running up to 100x faster than interpreted Python loops.

---

## 🔬 Experiment No. 2
### Title: Perform Exploratory Data Analysis (EDA) on a Real-World Dataset to Identify Patterns, Correlations, and Trends Using Descriptive Statistics and Visualizations

### 1. Aim:
To conduct comprehensive exploratory data analysis on 558,000 healthcare claims across 5,410 providers, identifying fraud prevalence, descriptive metrics, correlation heatmaps, and forensic billing trends.

### 2. Theoretical Background:
Fraudulent behavior in healthcare rarely appears in isolation on a single bill; it manifests as systemic operational anomalies:
- **Severe Class Asymmetry**: Fraudulent providers account for ~9.5% of the population.
- **Unbundling Schemes**: Submitting multiple same-day outpatient claims for the same patient to multiply consultation fees.
- **Artificial Inpatient Duration**: Keeping patients admitted in ICUs for extended durations (>15 days) to maximize daily bed reimbursements.
- **Physician Monopolies**: Facilities where 1 single doctor generates 90%+ of total revenue, indicative of identity theft or referral kickbacks.

### 3. Step-by-Step Methodology:
1. Compute descriptive statistics: Mean, standard deviation, median, IQR, and skewness grouped by provider label.
2. Calculate Pearson ($r$) and Spearman ($\rho$) correlation matrices to quantify linear and monotonic relationships between billing volume, reimbursements, and fraud flags.
3. Generate Seaborn correlation heatmaps and boxplots comparing genuine vs fraudulent providers.
4. Visualize same-day duplicate patient submission rates across legitimate and suspicious facilities.

### 4. Code & Implementation:
- **Notebook**: `notebooks/experiments/Experiment_2_Exploratory_Data_Analysis_EDA.ipynb`
- **Module**: `ml_pipeline/visualization.py`

### 5. Viva Voce Questions & Answers:
- **Q1: Why is standard accuracy a deceptive metric in imbalanced fraud detection?**  
  *Answer:* Because 90.5% of providers are legitimate. A trivial dummy model that predicts "Non-Fraud" for every single provider achieves 90.5% accuracy while recovering ₹0 in stolen funds.
- **Q2: What does a high correlation between `n_claims` and `total_reimbursed` indicate?**  
  *Answer:* It indicates scale-dependent billing. However, fraud models must normalize total reimbursement by claim volume (`mean_reimbursed`) and patient complexity to avoid penalizing large legitimate tertiary teaching hospitals.
- **Q3: How does a boxplot help detect outlier billing behavior?**  
  *Answer:* A boxplot visually reveals the median, interquartile range ($Q_3 - Q_1$), and points extending beyond $1.5 \times \text{IQR}$, highlighting facilities whose length-of-stay exceeds 40+ days.

---

## 🔬 Experiment No. 3
### Title: Understand Supervised Learning to Train and Develop Classifier Models

### 1. Aim:
To formulate the healthcare fraud problem as a supervised binary classification task, implement zero-leakage stratified provider partitioning, and evaluate classifier performance under severe class imbalance using PR-AUC, ROC-AUC, F1-Score, and Cost-Utility matrices.

### 2. Theoretical Background:
In supervised learning, we learn a mapping function $f: X \to y$, where $X \in \mathbb{R}^{n \times 61}$ is the engineered behavioral feature matrix and $y \in \{0, 1\}$ represents audit outcome.

**Critical Principles**:
1. **Zero Data Leakage (Provider Grouping)**: Splitting must occur strictly at the Provider level. If patient claims from Provider `PRV51001` appear in both training and test folds, the classifier overfits by memorizing provider specific IDs rather than learning generic fraud signatures.
2. **Stratified 5-Fold Cross-Validation**: Folds must maintain the exact 9.56% positive base rate across all 5 splits.
3. **Metric Hierarchy**:
   $$\text{Precision} = \frac{TP}{TP + FP}, \quad \text{Recall} = \frac{TP}{TP + FN}, \quad F_1 = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$$
   $$\text{PR-AUC} = \int_{0}^{1} P(R) \, dR \quad (\text{Primary Metric for Fraud})$$

### 3. Step-by-Step Methodology:
1. Split data into 80% train and 20% frozen test using `StratifiedKFold`.
2. Fit standard preprocessing (imputation, standard scaling) strictly on training folds to prevent distribution leakage.
3. Train Logistic Regression with inverse class-weighting (`class_weight='balanced'`).
4. Generate out-of-fold probability predictions $\hat{p} \in [0, 1]$.
5. Compute Precision, Recall, F1, PR-AUC, ROC-AUC, Brier score, and plot the Precision-Recall curve.

### 4. Code & Implementation:
- **Notebook**: `notebooks/experiments/Experiment_3_Supervised_Learning_Classifier_Development.ipynb`
- **Module**: `ml_pipeline/split.py` & `ml_pipeline/evaluate.py`

### 5. Viva Voce Questions & Answers:
- **Q1: Why is PR-AUC superior to ROC-AUC when positive cases are rare?**  
  *Answer:* ROC-AUC plots True Positive Rate vs False Positive Rate ($FP / (FP + TN)$). Because the true negative count ($TN$) is massive in fraud, the denominator dominates, allowing thousands of false alarms without lowering ROC-AUC. PR-AUC evaluates Precision ($TP / (TP + FP)$), directly exposing false alarms.
- **Q2: What is the Brier Calibration Score?**  
  *Answer:* It measures the mean squared error between predicted probabilities and actual binary outcomes: $\text{BS} = \frac{1}{N} \sum_{i=1}^{N} (p_i - y_i)^2$. A lower Brier score ensures predicted risk probabilities can be trusted for financial risk calculations.

---

## 🔬 Experiment No. 4
### Title: Build a Classification Model by Using Different Machine Learning Algorithms

### 1. Aim:
To train, benchmark, and compare 7 machine learning algorithms (Logistic Regression L1/L2, Random Forest, Extra Trees, Gradient Boosting, XGBoost, LightGBM) against heuristic rule baselines using 5-fold cross-validation and the 1-Standard-Error selection rule.

### 2. Theoretical Background:
Machine learning models must justify their complexity against transparent heuristics. Syght benchmarks:
1. **Rule Baselines**: Simple single-variable rules (`Rule_ClaimVolume`, `Rule_TotalReimbursed`).
2. **Linear Classifiers**: Sparse $L_1$ (Lasso) and $L_2$ (Ridge) regularized Logistic Regression.
3. **Ensemble Bagging**: Random Forest and Extra Trees Classifiers.
4. **Gradient Boosting**: Scikit-Learn GradientBoosting, XGBoost, and LightGBM.

**The 1-Standard-Error (1-SE) Rule**:
Select the simplest model whose performance falls within 1 standard error of the highest-scoring model:
$$\text{Score}(\text{Selected}) \ge \text{Score}_{\max} - \text{SE}(\text{Score}_{\max})$$

### 3. Benchmark Results Summary:
| Model / Baseline | CV PR-AUC (Mean ± Std) | CV ROC-AUC | Brier Score | Selected |
|---|:---:|:---:|:---:|:---:|
| `Rule_ClaimVolume` | 0.4067 ± 0.0432 | 0.8072 | 0.0864 | No |
| `Rule_TotalReimbursed` | 0.6732 ± 0.0398 | 0.9298 | 0.0793 | No (Best Rule) |
| `LogisticRegression_L1` | 0.7142 ± 0.0421 | 0.9451 | 0.0891 | No |
| `RandomForest` | 0.7113 ± 0.0530 | 0.9489 | 0.0458 | No |
| `GradientBoosting` | 0.7159 ± 0.0561 | 0.9443 | 0.0520 | No |
| `XGBoost` | 0.7313 ± 0.0411 | 0.9477 | 0.0490 | No |
| **`LightGBM`** | **0.7378 ± 0.0318** | **0.9470** | **0.0500** | **CHAMPION** |

### 4. Code & Implementation:
- **Notebook**: `notebooks/experiments/Experiment_4_Multi_Algorithm_Classification_Benchmark.ipynb`
- **Module**: `ml_pipeline/train.py`, `ml_pipeline/threshold.py`, `reports/benchmark_report.md`

### 5. Viva Voce Questions & Answers:
- **Q1: Why did LightGBM achieve the highest PR-AUC?**  
  *Answer:* LightGBM's leaf-wise tree growth splits nodes with maximum delta loss, efficiently isolating complex non-linear interactions (e.g. unbundling rates multiplied by physician concentration).
- **Q2: What is threshold optimization?**  
  *Answer:* Default 0.50 threshold is arbitrary for imbalanced data. Syght tunes the threshold to maximize $F_1$ (0.5364) and minimize operational investigation costs (0.060).

---

# ☁️ Unit-2: AI and Machine Learning Fundamentals with Azure AI Tools

---

## 🔬 Experiment No. 1 (Exp 5 in Sequence)
### Title: Introduction to Artificial Intelligence and Machine Learning Concepts

### 1. Aim:
To explore foundational artificial intelligence concepts, the architectural evolution of fraud detection systems, the bias-variance tradeoff, overfitting hazards, and algorithmic fairness standards.

### 2. Theoretical Concepts:
- **AI vs ML vs Deep Learning vs Expert Systems**:
  - *Expert Systems*: Hardcoded boolean rules (`IF claims > 500 AND amt > ₹10L THEN FLAG`).
  - *Machine Learning*: Statistical pattern recognition across 61 correlated behavioral features.
  - *Multi-Agent AI Systems*: Autonomous reasoning agents that deliberate, synthesize, and report.
- **The Bias-Variance Tradeoff**:
  $$\text{MSE} = \text{Bias}^2 + \text{Variance} + \sigma_{\text{irreducible}}^2$$
- **Algorithmic Fairness & Disparate Impact**:
  Healthcare fraud models must evaluate **provider billing behavior**, never patient demographics (Gender, Race, Caste, Religion).

### 3. Code & Implementation:
- **Notebook**: `notebooks/experiments/Experiment_5_AI_ML_Concepts_Healthcare_Fraud.ipynb`
- **Endpoint**: `GET /api/v1/syllabus/curriculum`

### 4. Viva Voce Questions & Answers:
- **Q1: How do expert rule systems fail against organized healthcare cartels?**  
  *Answer:* Fraud syndicates easily test rule thresholds (e.g. keeping bills at ₹49,999 when the audit threshold is ₹50,000). Machine learning evaluates multi-dimensional signals, rendering threshold gaming impossible.
- **Q2: What is disparate impact in AI?**  
  *Answer:* When an AI model disproportionately penalizes facilities serving underserved or vulnerable demographics. Syght eliminates this by strictly excluding demographic columns from the feature matrix.

---

## 🔬 Experiment No. 2 (Exp 6 in Sequence)
### Title: Understanding Azure Machine Learning, Generative AI Models, and AI Agent Systems

### 1. Aim:
To design and configure an Azure Machine Learning (Azure ML) SDK v2 cloud pipeline, model registry, and managed online endpoint, integrate Generative AI (LLMs) for clinical audit narrative synthesis, and orchestrate an Autonomous 4-Agent Fraud Investigation System.

### 2. Theoretical Background:
1. **Azure Machine Learning Architecture**:
   - **Workspace**: Central hub for assets, compute, and runs.
   - **Compute Cluster**: Scalable auto-scaling nodes (`Standard_DS3_v2`).
   - **Azure ML SDK v2 Pipeline**: Directed Acyclic Graph (DAG) executing Data Audit $\to$ Feature Engineering $\to$ Cross-Validation $\to$ Model Registration.
   - **Managed Online Endpoint**: Real-time scoring container executing `score.py` for sub-5ms pre-auth decisions.
2. **Generative AI Models (Azure OpenAI)**:
   Translates raw model numbers and SHAP vectors into human-readable clinical narratives and legal audit directives.
3. **Autonomous AI Agent System**:
   - **`ClaimIntakeAgent`**: Validates schema and catches duplicate claims.
   - **`ClinicalCodingAgent`**: Inspects unbundling and length of stay anomalies.
   - **`RiskScoringAgent`**: Evaluates ML probability and graph collusion degree.
   - **`SIUForensicReportAgent`**: Generative AI synthesis of official SIU briefs.

### 3. Azure ML SDK v2 Specification:
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/pipelineJob.schema.json
type: pipeline
display_name: Syght Enterprise Health Fraud Training Pipeline
settings:
  default_compute: azureml:cpu-cluster-syght
jobs:
  audit_step: { component: ./components/data_audit.yaml }
  feature_step: { component: ./components/feature_engineering.yaml }
  train_step: { component: ./components/train.yaml }
  eval_register_step: { component: ./components/eval_register.yaml }
```

### 4. Code & Implementation:
- **Notebook**: `notebooks/experiments/Experiment_6_Azure_ML_Generative_AI_and_AI_Agents.ipynb`
- **Modules**: `ml_pipeline/azure_ml_integration.py` & `ml_pipeline/genai_agent_system.py`
- **Endpoints**: `GET /api/v1/azure-ml/pipeline-spec`, `POST /api/v1/agents/investigate`, `POST /api/v1/genai/audit-summary`

### 5. Viva Voce Questions & Answers:
- **Q1: What is the purpose of the Azure ML Model Registry?**  
  *Answer:* It maintains immutable versions of trained model artifacts, their lineage (training data commit, hyperparameters), and deployment tags, enabling audit compliance and zero-downtime rollback.
- **Q2: Why use a Multi-Agent architecture for fraud triage?**  
  *Answer:* Fraud cases involve distinct domains: syntactic formatting, clinical validity, statistical risk, and statutory law. Specialized agents divide the cognitive workload, preventing hallucination and ensuring modular auditability.

---

## 🔬 Experiment No. 3 (Exp 7 in Sequence)
### Title: Exploring Generative AI, Natural Language Processing and Azure AI Tools

### 1. Aim:
To apply Natural Language Processing (NLP) on clinical consultation notes and discharge summaries to detect Upcoding and Phantom Billing, integrate Azure AI Document Intelligence for scanned bill OCR, and utilize Azure AI Search for medical case precedent retrieval.

### 2. Theoretical Background:
Over 70% of clinical data exists as unstructured doctor text. Fraud occurs when billed ICD-10 diagnosis codes conflict with documented clinical realities:
- **Upcoding**: Billing Sepsis (`A41`, Severity 5/5) or Heart Failure (`I50`) when doctor notes describe only a mild common cold (`Acute pharyngitis`).
- **Phantom Billing**: Submitting high-cost procedure codes that have zero textual mention or surgical notes in the medical chart.

**Azure AI Tools**:
- **Azure AI Document Intelligence (Form Recognizer)**: Prebuilt Health Insurance model extracting key-value pairs and tables from scanned claim forms and invoices.
- **Azure AI Search (Cognitive Search)**: Vector search and semantic ranker over medical ICD ontologies and regulatory fraud precedents.

### 3. Step-by-Step Methodology:
1. Tokenize and normalize clinical text using regular expressions and clinical stopword filters.
2. Extract clinical entities (symptoms, diagnoses, procedures, anatomical sites).
3. Query the ICD-10 semantic knowledge base to compute the **Semantic Concordance Score**.
4. Flag Upcoding and Phantom Billing anomalies.
5. Parse scanned medical invoices into structured JSON using Azure AI Document Intelligence.
6. Retrieve matching fraud case law using Azure AI Search vector retrieval.

### 4. Code & Implementation:
- **Notebook**: `notebooks/experiments/Experiment_7_Generative_AI_NLP_and_Azure_AI_Tools.ipynb`
- **Module**: `ml_pipeline/nlp_clinical_analyzer.py`
- **Endpoint**: `POST /api/v1/nlp/analyze-notes`

### 5. Viva Voce Questions & Answers:
- **Q1: What is semantic concordance in medical claims audit?**  
  *Answer:* It is the proportion of submitted billing codes that have verified textual corroboration in the physician's signed clinical notes. A score of 0.0 indicates complete phantom billing.
- **Q2: How does Azure AI Document Intelligence handle multi-page scanned medical bills?**  
  *Answer:* It uses deep learning layout transformers to detect table boundaries, key-value fields, checkboxes, and hand-written clinician signatures across multi-page PDF documents.
- **Q3: What role does Azure AI Search play in an SIU investigation?**  
  *Answer:* It enables investigators to perform semantic and vector search across historical de-empanelment court rulings, instantly retrieving precedent cases with similar billing patterns.

---

## 🏁 Summary of Lab Experiments

Summary of syllabus experiments implemented in Project Syght:
- **7 Executable Jupyter Notebooks** located in `notebooks/experiments/`
- **Production Backend Endpoints** in `backend/main.py`
- **Zero-Dependency Simulation & Real Datasets** (558k CMS claims & PM-JAY portfolios)
- **Complete Test Coverage**: 40 automated pytest tests passing in `tests/`

