"""
Evaluation Module: Benchmark metrics, bootstrap confidence intervals, and
investigation queue simulation on frozen held-out test partitions.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.metrics import (
    average_precision_score,
    brier_score_loss,
    confusion_matrix,
    f1_score,
    precision_recall_curve,
    precision_score,
    recall_score,
    roc_auc_score,
)

from ml_pipeline.config import SyghtConfig
from ml_pipeline.preprocessing import SyghtPreprocessor

logger = logging.getLogger(__name__)


def compute_threshold_free_metrics(y_true: np.ndarray, y_prob: np.ndarray) -> Dict[str, float]:
    """Computes ranking quality and calibration metrics independent of decision threshold."""
    return {
        "pr_auc": float(round(average_precision_score(y_true, y_prob), 4)),
        "roc_auc": float(round(roc_auc_score(y_true, y_prob), 4)),
        "brier_score": float(round(brier_score_loss(y_true, y_prob), 4)),
    }


def compute_threshold_metrics(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    threshold: float,
) -> Dict[str, Any]:
    """Computes operational classification metrics at a given decision threshold."""
    y_pred = (y_prob >= threshold).astype(int)
    cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
    tn, fp, fn, tp = cm.ravel()

    return {
        "threshold": float(round(threshold, 4)),
        "precision": float(round(precision_score(y_true, y_pred, zero_division=0), 4)),
        "recall": float(round(recall_score(y_true, y_pred, zero_division=0), 4)),
        "f1": float(round(f1_score(y_true, y_pred, zero_division=0), 4)),
        "specificity": float(round(tn / max(tn + fp, 1), 4)),
        "confusion_matrix": {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp),
        },
        "investigation_rate": float(round((tp + fp) / max(len(y_true), 1), 4)),
    }


def compute_bootstrap_confidence_intervals(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    threshold: float,
    n_bootstraps: int = 1000,
    seed: int = 42,
) -> Dict[str, List[float]]:
    """
    Computes 95% bootstrap confidence intervals for key test set metrics.
    """
    rng = np.random.default_rng(seed)
    n_samples = len(y_true)
    bootstrap_results = []

    for _ in range(n_bootstraps):
        idx = rng.integers(0, n_samples, n_samples)
        y_b_true = y_true[idx]
        y_b_prob = y_prob[idx]

        # Ensure both classes exist in resample
        if y_b_true.min() == y_b_true.max():
            continue

        free_m = compute_threshold_free_metrics(y_b_true, y_b_prob)
        thresh_m = compute_threshold_metrics(y_b_true, y_b_prob, threshold)
        bootstrap_results.append({
            "pr_auc": free_m["pr_auc"],
            "roc_auc": free_m["roc_auc"],
            "brier_score": free_m["brier_score"],
            "precision": thresh_m["precision"],
            "recall": thresh_m["recall"],
            "f1": thresh_m["f1"],
        })

    df_b = pd.DataFrame(bootstrap_results)
    ci: Dict[str, List[float]] = {}
    for metric_name in ["pr_auc", "roc_auc", "brier_score", "precision", "recall", "f1"]:
        lower = float(round(df_b[metric_name].quantile(0.025), 4))
        upper = float(round(df_b[metric_name].quantile(0.975), 4))
        ci[f"{metric_name}_ci95"] = [lower, upper]

    return ci


def evaluate_queue_at_capacity(
    df: pd.DataFrame,
    score_col: str,
    k: int,
    target_col: str = "fraud",
    exposure_col: str = "exposure_amount",
) -> Dict[str, Any]:
    """Computes Top-K prioritization metrics for a queue of capacity k."""
    top_k = df.nlargest(k, score_col)
    total_fraud = int(df[target_col].sum())
    fraud_caught = int(top_k[target_col].sum())

    total_exposure = float(df.loc[df[target_col] == 1, exposure_col].sum())
    caught_exposure = float(top_k.loc[top_k[target_col] == 1, exposure_col].sum())

    return {
        "k": k,
        "capacity_pct": float(round(k / max(len(df), 1), 4)),
        "precision_at_k": float(round(fraud_caught / max(k, 1), 4)),
        "recall_at_k": float(round(fraud_caught / max(total_fraud, 1), 4)),
        "fraud_caught": fraud_caught,
        "exposure_captured": float(round(caught_exposure, 2)),
        "pct_fraud_exposure_captured": float(round(caught_exposure / max(total_exposure, 1e-6), 4)),
    }


def banded_queue_selection(
    df: pd.DataFrame,
    k: int,
    prob_col: str = "p_fraud",
    exposure_col: str = "exposure_amount",
    n_bands: int = 5,
) -> pd.DataFrame:
    """Allocates investigation capacity evenly across provider size bands."""
    bands = pd.qcut(df[exposure_col].rank(method="first"), n_bands, labels=False)
    per_band = max(1, k // n_bands)

    selected_dfs = []
    for _, band_group in df.groupby(bands, observed=True):
        selected_dfs.append(band_group.nlargest(per_band, prob_col))

    out = pd.concat(selected_dfs)
    if len(out) < k:
        remainder = df.drop(out.index).nlargest(k - len(out), prob_col)
        out = pd.concat([out, remainder])

    return out.head(k)


def evaluate_queue_strategies(
    test_df: pd.DataFrame,
    prob_col: str,
    target_col: str = "fraud",
    exposure_col: str = "exposure_amount",
    capacities: Optional[List[float]] = None,
    seed: int = 42,
) -> pd.DataFrame:
    """
    Compares investigation queue strategies across realistic capacity levels:
    - Probability: rank by P(fraud)
    - Exposure: rank by P(fraud) * exposure_amount
    - Banded: size-stratified allocation
    - Rule Total Billed Only: sort strictly by reimbursement
    - Random: random queue floor
    """
    caps = capacities or [0.01, 0.05, 0.10, 0.20]
    df = test_df.copy()
    df["score_probability"] = df[prob_col]
    df["score_exposure"] = df[prob_col] * df[exposure_col].fillna(0.0)

    rows = []
    rng = np.random.default_rng(seed)

    for cap in caps:
        k = max(1, int(round(cap * len(df))))

        # 1. Probability Ranking
        prob_res = evaluate_queue_at_capacity(df, "score_probability", k, target_col, exposure_col)
        rows.append({"strategy": "Probability", **prob_res})

        # 2. Exposure Ranking
        exp_res = evaluate_queue_at_capacity(df, "score_exposure", k, target_col, exposure_col)
        rows.append({"strategy": "Exposure", **exp_res})

        # 3. Banded Ranking
        banded_picks = banded_queue_selection(df, k, prob_col, exposure_col)
        total_fraud = int(df[target_col].sum())
        caught = int(banded_picks[target_col].sum())
        total_exp = float(df.loc[df[target_col] == 1, exposure_col].sum())
        caught_exp = float(banded_picks.loc[banded_picks[target_col] == 1, exposure_col].sum())
        rows.append({
            "strategy": "Banded",
            "k": k,
            "capacity_pct": float(round(k / len(df), 4)),
            "precision_at_k": float(round(caught / max(k, 1), 4)),
            "recall_at_k": float(round(caught / max(total_fraud, 1), 4)),
            "fraud_caught": caught,
            "exposure_captured": float(round(caught_exp, 2)),
            "pct_fraud_exposure_captured": float(round(caught_exp / max(total_exp, 1e-6), 4)),
        })

        # 4. Decisive Baseline: Total Billed Only
        rule_res = evaluate_queue_at_capacity(df, exposure_col, k, target_col, exposure_col)
        rows.append({"strategy": "Rule_TotalBilledOnly", **rule_res})

        # 5. Random Ordering Floor
        rand_metrics = []
        for _ in range(50):
            df_rand = df.assign(random_score=rng.random(len(df)))
            rand_metrics.append(evaluate_queue_at_capacity(df_rand, "random_score", k, target_col, exposure_col))
        df_rand_m = pd.DataFrame(rand_metrics)
        rows.append({
            "strategy": "Random",
            "k": k,
            "capacity_pct": float(round(k / len(df), 4)),
            "precision_at_k": float(round(df_rand_m["precision_at_k"].mean(), 4)),
            "recall_at_k": float(round(df_rand_m["recall_at_k"].mean(), 4)),
            "fraud_caught": int(round(df_rand_m["fraud_caught"].mean())),
            "exposure_captured": float(round(df_rand_m["exposure_captured"].mean(), 2)),
            "pct_fraud_exposure_captured": float(round(df_rand_m["pct_fraud_exposure_captured"].mean(), 4)),
        })

    return pd.DataFrame(rows)


def evaluate_frozen_test_set(
    test_df: pd.DataFrame,
    preprocessor: SyghtPreprocessor,
    model: Any,
    selected_threshold: float,
    config: Optional[SyghtConfig] = None,
) -> Dict[str, Any]:
    """
    Executes a comprehensive, single-pass evaluation on the frozen held-out test partition.
    """
    cfg = config or SyghtConfig()
    y_test = test_df["fraud"].to_numpy()

    X_test_trans = preprocessor.transform(test_df)
    p_test = model.predict_proba(X_test_trans)[:, 1]

    # Threshold-free metrics
    free_metrics = compute_threshold_free_metrics(y_test, p_test)

    # Threshold-dependent metrics
    thresh_metrics = compute_threshold_metrics(y_test, p_test, selected_threshold)

    # Bootstrap Confidence Intervals (95%)
    ci = compute_bootstrap_confidence_intervals(y_test, p_test, selected_threshold, n_bootstraps=1000, seed=cfg.random_seed)

    # Investigation Queue Simulation
    eval_df = test_df[[cfg.id_col, "fraud", "exposure_amount"]].copy()
    eval_df["p_fraud"] = p_test
    queue_df = evaluate_queue_strategies(
        eval_df,
        prob_col="p_fraud",
        target_col="fraud",
        exposure_col="exposure_amount",
        capacities=cfg.queue_capacities,
        seed=cfg.random_seed,
    )

    test_report = {
        "n_test_providers": len(test_df),
        "n_test_frauds": int(y_test.sum()),
        "test_fraud_rate": float(round(y_test.mean(), 4)),
        "threshold_free_metrics": free_metrics,
        "threshold_metrics": thresh_metrics,
        "confidence_intervals_95": ci,
        "queue_simulation": queue_df.to_dict(orient="records"),
        "test_predictions": eval_df,
    }

    logger.info(
        "Frozen Test Evaluation: PR-AUC=%.4f (95%% CI: %s), ROC-AUC=%.4f, Precision=%.4f, Recall=%.4f, F1=%.4f at Threshold=%.4f",
        free_metrics["pr_auc"],
        ci["pr_auc_ci95"],
        free_metrics["roc_auc"],
        thresh_metrics["precision"],
        thresh_metrics["recall"],
        thresh_metrics["f1"],
        selected_threshold,
    )

    return test_report
