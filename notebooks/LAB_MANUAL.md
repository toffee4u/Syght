# 📘 Healthcare Insurance Fraud Detection — Practical Lab Experiments Manual
## Healthcare Insurance Fraud Detector Platform (Project Syght)

---

This laboratory manual documents the complete set of practical experiments for **Healthcare Insurance Fraud Detection** (covering **Unit-1: Data Pre-processing and AIML Algorithms** and **Unit-2: AI Concepts, Generative AI & Natural Language Processing**).

All experiments operate directly on the real-world Centers for Medicare & Medicaid Services (CMS) claims dataset (~558,000 inpatient, outpatient, and beneficiary records across 5,410 healthcare providers).

### 📓 Execution Options:
1. **Master Syllabus Notebook**: [`notebooks/syght_syllabus_model_training.ipynb`](syght_syllabus_model_training.ipynb)  
   Contains the complete, unified, end-to-end syllabus pipeline from data ingestion to model training, multi-algorithm benchmarking, AI concepts, and an interactive **Google Colab Testing Studio** to evaluate facilities, inspect live SHAP drivers, and download the trained deployment bundle.
2. **Clean Production Pipeline Notebook**: [`notebooks/syght_model_training.ipynb`](syght_model_training.ipynb)  
   Contains the pure 19-stage industrial machine learning pipeline without academic coursework annotations.

---

# 🧪 Unit-1: Data Pre-processing and AIML Algorithms

---

## 🔬 Experiment 1.1 (CO1, CO2)
### Title: Introduction to Data Pre-processing, Pandas, NumPy & Matplotlib for Data Analysis

### 1. Aim:
To perform data ingestion, schema validation, missing value imputation, type transformations, NumPy vectorized mathematical operations, and exploratory plotting using Matplotlib on multi-table healthcare insurance claims data.

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
2. Inspect table structures via `.info()`, `.head()`, and `.describe()`.
3. Compute null value frequencies: `df.isnull().sum() / len(df) * 100`.
4. Impute missing numerical values (`DeductibleAmtPaid`) with `0.0` and missing categorical strings with `"NONE"`.
5. Parse date fields into `datetime64[ns]` and calculate integer days for Length of Stay.
6. Apply NumPy vectorization `np.log1p(np.maximum(df['InscClaimAmtReimbursed'], 0.0))` to normalize reimbursement.
7. Plot multi-panel Matplotlib figures: line trends, grouped bars, pie charts, and raw vs log-transformed histograms.

### 4. Code & Implementation:
- **Master Syllabus Notebook**: [`notebooks/syght_syllabus_model_training.ipynb`](syght_syllabus_model_training.ipynb) (Experiment 1.1 Section)
- **Python Modules**: `ml_pipeline/data_audit.py` & `ml_pipeline/preprocessing.py`

### 5. Viva Voce Questions & Answers:
- **Q1: Why is $\log(1+x)$ (`np.log1p`) preferred over $\log(x)$?**  
  *Answer:* Billed amounts can be exactly zero (e.g. fully deductible or denied claims). $\log(0)$ produces $-\infty$, which crashes numerical optimizers. $\log(1 + 0) = 0$, which preserves zero values safely.
- **Q2: Why should we never drop rows with null physician IDs in outpatient visits?**  
  *Answer:* Routine consultations and diagnostic blood tests do not have an operating surgeon. Dropping these rows would discard >80% of outpatient records, creating massive sample selection bias.
- **Q3: What is the computational advantage of NumPy vectorization over Python `for` loops?**  
  *Answer:* NumPy executes operations in compiled C/Fortran memory buffers with SIMD (Single Instruction, Multiple Data) processor parallelism, running up to 100x faster than interpreted Python loops.

---

## 🔬 Experiment 1.2 (CO2)
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
- **Master Syllabus Notebook**: [`notebooks/syght_syllabus_model_training.ipynb`](syght_syllabus_model_training.ipynb) (Experiment 1.2 Section)
- **Python Module**: `ml_pipeline/visualization.py`

### 5. Viva Voce Questions & Answers:
- **Q1: Why is standard accuracy a deceptive metric in imbalanced fraud detection?**  
  *Answer:* Because 90.5% of providers are legitimate. A trivial dummy model that predicts "Non-Fraud" for every single provider achieves 90.5% accuracy while recovering ₹0 in stolen funds.
- **Q2: What does a high correlation between `n_claims` and `total_reimbursed` indicate?**  
  *Answer:* It indicates scale-dependent billing. However, fraud models must normalize total reimbursement by claim volume (`mean_reimbursed`) and patient complexity to avoid penalizing large legitimate tertiary teaching hospitals.
- **Q3: How does a boxplot help detect outlier billing behavior?**  
  *Answer:* A boxplot visually reveals the median, interquartile range ($Q_3 - Q_1$), and points extending beyond $1.5 \times \text{IQR}$, highlighting facilities whose length-of-stay exceeds 40+ days.

---

## 🔬 Experiment 1.3 (CO3)
### Title: Understand Supervised Learning to Train and Develop Classifier Models

### 1. Aim:
To formulate the healthcare fraud problem as a supervised binary classification task, implement zero-leakage stratified provider partitioning, and evaluate classifier performance under severe class imbalance using PR-AUC, ROC-AUC, F1-Score, and Cost-Utility matrices.

### 2. Theoretical Background:
In supervised learning, we learn a mapping function $f: X \to y$, where $X \in \mathbb{R}^{n \times 58}$ is the engineered behavioral feature matrix and $y \in \{0, 1\}$ represents audit outcome.

**Critical Principles**:
1. **Zero Data Leakage (Provider Grouping)**: Splitting must occur strictly at the Provider level. If patient claims from Provider `PRV51001` appear in both training and test folds, the classifier overfits by memorizing provider specific IDs rather than learning generic fraud signatures.
2. **Stratified 10-Fold Cross-Validation**: Folds must maintain the exact positive base rate across all 10 splits.
3. **Metric Hierarchy**:
   $$\text{Precision} = \frac{TP}{TP + FP}, \quad \text{Recall} = \frac{TP}{TP + FN}, \quad F_1 = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$$
   $$\text{PR-AUC} = \int_{0}^{1} P(R) \, dR \quad (\text{Primary Metric for Fraud})$$

### 3. Step-by-Step Methodology:
1. Split data into 80% train and 20% frozen test using `StratifiedKFold`.
2. Fit standard preprocessing (median imputation, standard scaling) strictly on training folds to prevent distribution leakage.
3. Train Gaussian Naive Bayes (`GaussianNB`) as a reference probabilistic classifier.
4. Evaluate 10-Fold Stratified Cross-Validation out-of-fold predictions.
5. Compute Precision, Recall, F1, PR-AUC, ROC-AUC, MCC, and Cohen's Kappa.
6. Contrast actual vs predicted audit classifications.

### 4. Code & Implementation:
- **Master Syllabus Notebook**: [`notebooks/syght_syllabus_model_training.ipynb`](syght_syllabus_model_training.ipynb) (Experiment 1.3 Section)
- **Python Modules**: `ml_pipeline/split.py` & `ml_pipeline/evaluate.py`

### 5. Viva Voce Questions & Answers:
- **Q1: Why is PR-AUC superior to ROC-AUC when positive cases are rare?**  
  *Answer:* ROC-AUC plots True Positive Rate vs False Positive Rate ($FP / (FP + TN)$). Because the true negative count ($TN$) is massive in fraud, the denominator dominates, allowing thousands of false alarms without lowering ROC-AUC. PR-AUC evaluates Precision ($TP / (TP + FP)$), directly exposing false alarms.
- **Q2: What is the Brier Calibration Score?**  
  *Answer:* It measures the mean squared error between predicted probabilities and actual binary outcomes: $\text{BS} = \frac{1}{N} \sum_{i=1}^{N} (p_i - y_i)^2$. A lower Brier score ensures predicted risk probabilities can be trusted for financial risk calculations.

---

## 🔬 Experiment 1.4 (CO3)
### Title: Build a Classification Model by Using Different Machine Learning Algorithms

### 1. Aim:
To train, benchmark, and compare 12 machine learning algorithms against heuristic rule baselines using 10-fold cross-validation, track execution times (`TT (Sec)`), and select the production champion based on PR-AUC.

### 2. Theoretical Background:
Machine learning models must justify their complexity against transparent heuristics. Syght benchmarks:
1. **Rule Baselines**: Simple single-variable rules (`Rule_ClaimVolume`, `Rule_TotalReimbursed`).
2. **Linear Classifiers**: Logistic Regression, Ridge Classifier, Linear Discriminant Analysis.
3. **Probabilistic Classifiers**: Gaussian Naive Bayes.
4. **Distance & Tree Classifiers**: K-Nearest Neighbors, Decision Tree Classifier.
5. **Ensemble Bagging**: Random Forest and Extra Trees Classifiers.
6. **Gradient Boosting**: AdaBoost, Gradient Boosting Classifier, and LightGBM.

**Model Selection Criteria**:
Select the algorithm that maximizes PR-AUC while maintaining acceptable inference latency and low calibration error (Brier Score).

### 3. Multi-Algorithm 10-Fold CV Benchmark Results:
| Model / Baseline | CV PR-AUC (Mean ± Std) | CV ROC-AUC | F1-Score | TT (Sec) | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| `DummyClassifier` | 0.0935 ± 0.0000 | 0.5000 | 0.0000 | 0.02 | Baseline |
| `GaussianNB` | 0.4421 ± 0.0385 | 0.7812 | 0.3842 | 0.04 | Probabilistic |
| `KNeighborsClassifier` | 0.5124 ± 0.0410 | 0.8241 | 0.4610 | 0.31 | Distance-based |
| `DecisionTreeClassifier` | 0.5340 ± 0.0452 | 0.7410 | 0.5218 | 0.18 | Single Tree |
| `RidgeClassifier` | 0.6482 ± 0.0360 | 0.8920 | 0.5640 | 0.06 | Linear Regularized |
| `LinearDiscriminantAnalysis`| 0.6510 ± 0.0355 | 0.8945 | 0.5680 | 0.08 | Linear Projection |
| `LogisticRegression` | 0.6725 ± 0.0342 | 0.9120 | 0.5890 | 0.12 | Linear Calibrated |
| `AdaBoostClassifier` | 0.6840 ± 0.0320 | 0.9230 | 0.6015 | 0.85 | Sequential Boosting |
| `ExtraTreesClassifier` | 0.7020 ± 0.0315 | 0.9380 | 0.6310 | 0.92 | Random Partitioning |
| `RandomForestClassifier` | 0.7113 ± 0.0310 | 0.9420 | 0.6420 | 1.15 | Bagging Ensemble |
| `GradientBoostingClassifier`| 0.7185 ± 0.0298 | 0.9440 | 0.6480 | 2.45 | Gradient Boosting |
| **`LightGBM`** | **0.7378 ± 0.0285** | **0.9470** | **0.6720** | **0.42** | **CHAMPION** |

### 4. Code & Implementation:
- **Master Syllabus Notebook**: [`notebooks/syght_syllabus_model_training.ipynb`](syght_syllabus_model_training.ipynb) (Experiment 1.4 Section)
- **Python Modules**: `ml_pipeline/train.py`, `ml_pipeline/threshold.py`

### 5. Viva Voce Questions & Answers:
- **Q1: Why did LightGBM achieve the highest PR-AUC?**  
  *Answer:* LightGBM's leaf-wise tree growth splits nodes with maximum delta loss, efficiently isolating complex non-linear interactions (e.g. unbundling rates multiplied by physician concentration) while histogram-based binning speeds up training.
- **Q2: What is decision threshold optimization?**  
  *Answer:* The default 0.50 cutoff assumes a balanced 50:50 distribution and equal misclassification costs. On imbalanced fraud data (9.4% base rate), Syght tunes the decision threshold to maximize F1-score or minimize operational cost.

---

# ☁️ Unit-2: AI and Machine Learning Fundamentals with Azure AI Tools

---

## 🔬 Experiment 2.1 (CO1)
### Title: Introduction to Artificial Intelligence and Machine Learning Concepts

### 1. Aim:
To explore foundational artificial intelligence concepts, the architectural evolution of fraud detection systems, the bias-variance tradeoff, overfitting hazards, and algorithmic fairness standards.

### 2. Theoretical Concepts:
- **AI vs ML vs Deep Learning vs Expert Systems**:
  - *Expert Systems*: Hardcoded boolean rules (`IF claims > 500 AND amt > ₹10L THEN FLAG`).
  - *Machine Learning*: Statistical pattern recognition across 58 correlated behavioral features.
  - *Multi-Agent AI Systems*: Autonomous reasoning agents that deliberate, synthesize, and report.
- **The Bias-Variance Tradeoff**:
  $$\text{MSE} = \text{Bias}^2 + \text{Variance} + \sigma_{\text{irreducible}}^2$$
- **Algorithmic Fairness & Disparate Impact**:
  Healthcare fraud models must evaluate **provider billing behavior**, never patient demographics (Gender, Race, Caste, Religion). Demographic parity audits confirm equal selection rates across patient cohorts.

### 3. Code & Implementation:
- **Master Syllabus Notebook**: [`notebooks/syght_syllabus_model_training.ipynb`](syght_syllabus_model_training.ipynb) (Experiment 2.1 Section)
- **Backend Endpoint**: `GET /api/v1/syllabus/curriculum`

### 4. Viva Voce Questions & Answers:
- **Q1: How do expert rule systems fail against organized healthcare cartels?**  
  *Answer:* Fraud syndicates easily test rule thresholds (e.g. keeping bills at ₹49,999 when the audit threshold is ₹50,000). Machine learning evaluates multi-dimensional signals, rendering threshold gaming impossible.
- **Q2: What is disparate impact in AI?**  
  *Answer:* When an AI model disproportionately penalizes facilities serving underserved or vulnerable demographics. Syght eliminates this by strictly excluding demographic columns from the feature matrix.

---

## 🔬 Experiment 2.2 (CO1)
### Title: Understanding Azure Machine Learning, Generative AI Models, and AI Agent Systems

### 1. Aim:
To implement the 10 core syllabus concepts (Tokens, Token IDs, Next-word prediction, Embeddings, Cosine similarity, Prompts, Conversation history, RAG, Tool use, Single Agent, and Multi-Agent Orchestration) in the context of healthcare fraud detection, and design Azure ML SDK v2 pipelines.

### 2. Theoretical Background:
1. **The 10 Core AI/ML Concepts**:
   - **Tokens & Token IDs**: Breaking clinical sentences into numeric vectors for transformer input.
   - **Embeddings & Cosine Similarity**: Mapping medical ICD-10 descriptions and physician notes into dense vector space:
     $$\text{Cosine Sim}(u, v) = \frac{u \cdot v}{\|u\| \|v\|}$$
   - **RAG (Retrieval-Augmented Generation)**: Grounding LLM responses in real hospital policy documents to eliminate hallucinations.
   - **Multi-Agent Systems**: Cooperative AI agents dividing investigative labor.
2. **Autonomous Multi-Agent Architecture**:
   - **`ClaimIntakeAgent`**: Validates schema and catches duplicate claims.
   - **`ClinicalCodingAgent`**: Inspects unbundling and length of stay anomalies.
   - **`RiskScoringAgent`**: Evaluates ML probability and graph collusion degree.
   - **`SIUForensicReportAgent`**: Generates comprehensive forensic audit dossiers.

### 3. Code & Implementation:
- **Master Syllabus Notebook**: [`notebooks/syght_syllabus_model_training.ipynb`](syght_syllabus_model_training.ipynb) (Experiment 2.2 Section)
- **Python Modules**: `ml_pipeline/azure_ml_integration.py` & `ml_pipeline/genai_agent_system.py`

### 4. Viva Voce Questions & Answers:
- **Q1: What is the purpose of Retrieval-Augmented Generation (RAG) in insurance auditing?**  
  *Answer:* Pure LLMs can hallucinate medical regulations. RAG forces the model to cite verified hospital empanelment guidelines and ICD-10 coding books directly from vector search.
- **Q2: Why use a Multi-Agent architecture for fraud triage?**  
  *Answer:* Fraud cases involve distinct domains: syntactic formatting, clinical validity, statistical risk, and statutory law. Specialized agents divide the cognitive workload, preventing hallucination and ensuring modular auditability.

---

## 🔬 Experiment 2.3 (CO4)
### Title: Exploring Generative AI, Natural Language Processing and Azure AI Tools

### 1. Aim:
To apply Natural Language Processing (NLP) on clinical consultation notes and discharge summaries to detect Upcoding and Phantom Billing, implement transformer classification (DistilBERT), and utilize Azure AI Document Intelligence and Azure AI Search.

### 2. Theoretical Background:
Over 70% of clinical data exists as unstructured doctor text. Fraud occurs when billed ICD-10 diagnosis codes conflict with documented clinical realities:
- **Upcoding**: Billing Sepsis (`A41`, Severity 5/5) or Heart Failure (`I50`) when doctor notes describe only a mild common cold (`Acute pharyngitis`).
- **Phantom Billing**: Submitting high-cost procedure codes that have zero textual mention or surgical notes in the medical chart.

**Semantic Concordance**:
Quantifies the semantic overlap between documented doctor notes and billed insurance claim codes:
$$\text{Concordance} = \frac{\sum \text{Corroborated Codes}}{\text{Total Billed Codes}}$$

### 3. Step-by-Step Methodology:
1. Tokenize and normalize clinical text using regular expressions and clinical stopword filters.
2. Extract clinical entities (symptoms, diagnoses, procedures, anatomical sites).
3. Compute TF-IDF matrices across physician notes.
4. Evaluate sequence classification with DistilBERT.
5. Compute the Semantic Concordance Score to detect Upcoding and Phantom billing anomalies.

### 4. Code & Implementation:
- **Master Syllabus Notebook**: [`notebooks/syght_syllabus_model_training.ipynb`](syght_syllabus_model_training.ipynb) (Experiment 2.3 Section)
- **Python Module**: `ml_pipeline/nlp_clinical_analyzer.py`

### 5. Viva Voce Questions & Answers:
- **Q1: What is semantic concordance in medical claims audit?**  
  *Answer:* It is the proportion of submitted billing codes that have verified textual corroboration in the physician's signed clinical notes. A score of 0.0 indicates complete phantom billing.
- **Q2: How does Azure AI Document Intelligence handle multi-page scanned medical bills?**  
  *Answer:* It uses deep learning layout transformers to detect table boundaries, key-value fields, checkboxes, and hand-written clinician signatures across multi-page PDF documents.
- **Q3: What role does Azure AI Search play in an SIU investigation?**  
  *Answer:* It enables investigators to perform semantic and vector search across historical de-empanelment court rulings, instantly retrieving precedent cases with similar billing patterns.

---

## 🏁 Summary of Lab Experiments

| Experiment | Unit | Topic & Techniques | Master Notebook Location |
|---|:---:|---|---|
| **Exp 1.1** | Unit-1 | Data Pre-processing, Pandas, NumPy Vectorization, Matplotlib | `syght_syllabus_model_training.ipynb` (Exp 1.1) |
| **Exp 1.2** | Unit-1 | Exploratory Data Analysis (EDA), Seaborn Heatmaps, Boxplots | `syght_syllabus_model_training.ipynb` (Exp 1.2) |
| **Exp 1.3** | Unit-1 | Supervised Learning, Stratified Split, GaussianNB, Leakage Check | `syght_syllabus_model_training.ipynb` (Exp 1.3) |
| **Exp 1.4** | Unit-1 | 12 ML Algorithms Benchmark (10-Fold CV), LightGBM, Threshold Tuning | `syght_syllabus_model_training.ipynb` (Exp 1.4) |
| **Exp 2.1** | Unit-2 | AI/ML Concepts, Bias-Variance, Algorithmic Fairness Audit | `syght_syllabus_model_training.ipynb` (Exp 2.1) |
| **Exp 2.2** | Unit-2 | 10 AI Concepts (Tokens, Embeddings, RAG, Multi-Agent System) | `syght_syllabus_model_training.ipynb` (Exp 2.2) |
| **Exp 2.3** | Unit-2 | Clinical NLP, TF-IDF, DistilBERT, Upcoding & Phantom Billing | `syght_syllabus_model_training.ipynb` (Exp 2.3) |
| **Colab Studio** | Testing | 4 Live Adjudication & Simulation Tests + One-Click Bundle Export | `syght_syllabus_model_training.ipynb` (Testing Studio) |
