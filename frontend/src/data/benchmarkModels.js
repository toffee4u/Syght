// 9 Estimator Cross-Validation Benchmark Suite Metrics
export const BENCHMARK_MODELS = [
  {
    name: "LightGBM Classifier",
    isChampion: true,
    rocAuc: 0.8724,
    prAuc: 0.7418,
    f1: 0.7182,
    recall: 0.7350,
    precision: 0.7021,
    latency: "1.84 ms",
    size: "1.05 MB",
    strengths: "Best calibrated probabilities, native categorical handling, fast tree traversal"
  },
  {
    name: "XGBoost Classifier",
    isChampion: false,
    rocAuc: 0.8651,
    prAuc: 0.7290,
    f1: 0.7045,
    recall: 0.7180,
    precision: 0.6915,
    latency: "3.12 ms",
    size: "1.85 MB",
    strengths: "Exact greedy splits, robust L1/L2 regularization"
  },
  {
    name: "CatBoost Classifier",
    isChampion: false,
    rocAuc: 0.8590,
    prAuc: 0.7185,
    f1: 0.6980,
    recall: 0.7050,
    precision: 0.6911,
    latency: "4.85 ms",
    size: "2.40 MB",
    strengths: "Ordered boosting, minimal hyperparameter tuning required"
  },
  {
    name: "Random Forest Ensemble",
    isChampion: false,
    rocAuc: 0.8415,
    prAuc: 0.6850,
    f1: 0.6720,
    recall: 0.6690,
    precision: 0.6750,
    latency: "8.40 ms",
    size: "12.8 MB",
    strengths: "Bagging variance reduction, high tree interpretability"
  },
  {
    name: "Extra Trees Ensemble",
    isChampion: false,
    rocAuc: 0.8350,
    prAuc: 0.6720,
    f1: 0.6590,
    recall: 0.6510,
    precision: 0.6672,
    latency: "7.15 ms",
    size: "14.2 MB",
    strengths: "Extreme random split thresholds, reduces variance further"
  },
  {
    name: "AdaBoost Classifier",
    isChampion: false,
    rocAuc: 0.8120,
    prAuc: 0.6350,
    f1: 0.6280,
    recall: 0.6400,
    precision: 0.6165,
    latency: "5.20 ms",
    size: "820 KB",
    strengths: "Exponential loss weighting on hard-to-classify samples"
  },
  {
    name: "Gradient Boosting (GBM)",
    isChampion: false,
    rocAuc: 0.8490,
    prAuc: 0.7010,
    f1: 0.6840,
    recall: 0.6920,
    precision: 0.6762,
    latency: "6.90 ms",
    size: "3.10 MB",
    strengths: "Classic pseudo-residual stage-wise gradient descent"
  },
  {
    name: "Logistic Regression (L2)",
    isChampion: false,
    rocAuc: 0.7810,
    prAuc: 0.5890,
    f1: 0.5750,
    recall: 0.5900,
    precision: 0.5608,
    latency: "0.45 ms",
    size: "15 KB",
    strengths: "Convex log-loss optimization, ultra-fast baseline"
  },
  {
    name: "Heuristic Rules Engine",
    isChampion: false,
    rocAuc: 0.6890,
    prAuc: 0.4420,
    f1: 0.4610,
    recall: 0.4950,
    precision: 0.4314,
    latency: "0.22 ms",
    size: "0 KB",
    strengths: "Static threshold rules on length-of-stay and surgeries"
  }
];
