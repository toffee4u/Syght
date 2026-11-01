# 🩺 Syght — Healthcare Insurance Fraud Detection System (Hinglish Guide)

> Machine Learning aur Explainable AI par based Health Insurance Fraud Detection Platform.

---

## 📌 Project Overview (Project Kya Hai?)

**Syght** ek machine learning platform hai jo hospital claims aur clinic billing me hone wale fraud (jaise fake surgeries, unbundling, artificial ICU stay) ko real-time me pakadta hai.

Real-world health insurance me fraud sirf **~9.5%** hota hai. Agar koi model sabhi claims ko genuine predict kar de toh 90.5% accuracy mil jayegi, par ₹0 ka fraud pakda jayega. Is problem ko solve karne ke liye Syght:
1. Multi-table data se **61 forensic behavioral features** extract karta hai.
2. **5 machine learning models** ko 5-Fold Cross-Validation par benchmark karta hai.
3. Best model (**LightGBM**, PR-AUC = 0.7011) ko deploy karta hai jo **sub-5ms latency** me fraud score deta hai.
4. **SHAP explainability** aur **React web dashboard** ke sath har claim ka clear reason dikhata hai.

---

## 🚀 Key Features

- **⚡ Real-Time Pre-Auth Gateway**: Naye aane wale claims ko 5 millisecond ke andar scan karke instant approval ya audit hold batata hai.
- **🔍 Explainable AI (SHAP Waterfall)**: Flagged claim ka exact reason dikhata hai (jaise same-day duplicate billing ya abnormal ICU stay).
- **🕸️ Collusion Network Graph**: Ek se zyada clinics me ghoomkar fraud karne wale doctors aur referral rings ko network graph me dikhata hai.
- **📁 Dataset Studio**: Kisi bhi CSV/JSON dataset ko browser me scan karne ki suvidha aur AI prompt generator.
- **🤖 Autonomous AI Investigation Agents**: 4 specialized AI agents jo clinical, statistical aur collusion angles se audit report taiyar karte hain.

---

## 📊 Dataset Aur Pre-processing

Model ko real-world claims data par train kiya gaya hai:
- **`Train_Inpatientdata.csv`** (40,474 records): Hospital admission, discharge dates, diagnosis codes aur payment.
- **`Train_Outpatientdata.csv`** (517,737 records): Day clinics, routine tests aur attending doctors.
- **`Train_Beneficiarydata.csv`** (138,556 profiles): Patient clinical profiles aur 11 chronic illnesses.
- **`Train.csv`** (5,410 facilities): Audited ground truth labels (`PotentialFraud = Yes/No`).

### Pre-processing:
1. **Missing Values**: Deductible amount ko `0.0` se fill kiya aur missing operating doctors ko `'NONE'` mark kiya taaki outpatient data loss na ho.
2. **Length of Stay**: Admission aur Discharge dates ko parse karke patient ka exact hospital stay (LOS) nikala.
3. **Log Normalization**: Financial amounts ke heavy right-skewness ko door karne ke liye NumPy `log1p` transformation use kiya.

---

## 🏆 Model Benchmark & Results

| Model Architecture | PR-AUC | ROC-AUC | F1-Score | Inference Latency | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| **LightGBM (Selected Champion)** | **0.7011** | **0.9412** | **0.654** | **3.8 ms** | **Production Champion** |
| CatBoost | 0.6978 | 0.9385 | 0.648 | 8.2 ms | Candidate |
| XGBoost | 0.6924 | 0.9351 | 0.641 | 6.5 ms | Candidate |
| Random Forest | 0.6710 | 0.9240 | 0.622 | 12.1 ms | Baseline |
| Logistic Regression | 0.5820 | 0.8650 | 0.518 | 1.1 ms | Linear Baseline |

* **Optimal Threshold**: **0.42** (9.5% fraud rate par best balance).
* **Top Fraud Indicators**: Same-day duplicate claims (+0.34 SHAP), unbundling score (+0.28 SHAP), aur average ICU stay (+0.22 SHAP).

---

## 📓 Notebooks & Lab Manual

Project me do main master notebooks aur comprehensive lab manual [`notebooks/`](notebooks/) folder me available hain:
- **`notebooks/syght_syllabus_model_training.ipynb`**: University syllabus ke according banaya gaya master training notebook. Isme pure ~558,000 claims dataset par direct file upload (bina kisi Kaggle API ya GitHub auth ke), Unit-1 (Exp 1.1-1.4) aur Unit-2 (Exp 2.1-2.3) ke according model training, 12 ML algorithms benchmark, aur Google Colab par direct testing ke liye interactive studio shamil hai.
- **`notebooks/syght_model_training.ipynb`**: Pure production 19-stage machine learning training notebook (academic syllabus text bina).
- **`notebooks/LAB_MANUAL.md`**: Theoretical background, algorithms, methodologies, aur viva questions with verified answers.

---

## 👥 Presentation Slides

Presentation slide decks [`presentation/`](presentation/) folder me 5 members ke hisaab se divided hain:
- **Part 1**: Overall Project Introduction & System Architecture
- **Part 2**: Data Pre-processing, Pandas, NumPy & Matplotlib
- **Part 3**: Exploratory Data Analysis & Forensic Patterns
- **Part 4**: Supervised Learning & Algorithm Benchmark
- **Part 5**: AI Concepts, Azure AI Tools, Clinical NLP & Live Demo

Complete details ke liye [`presentation/README.md`](presentation/README.md) dekhein.

---

## ⚡ Quickstart (Kaise Chalaye?)

```bash
# 1. Clone repository & install dependencies
git clone https://github.com/toffee4u/Syght.git
cd Syght
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 2. Backend server start karein
uvicorn backend.main:app --reload --port 8000

# 3. Frontend start karein (naye terminal me)
cd frontend
npm install
npm run dev

# 4. Tests run karein
pytest
```
