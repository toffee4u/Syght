"""
Threshold Selection Module: Validation-only threshold optimization combining
maximum F1-score and cost-aware operating point analysis.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.metrics import precision_recall_curve

from ml_pipeline.config import SyghtConfig

logger = logging.getLogger(__name__)


def find_max_f1_threshold(y_true: np.ndarray, y_prob: np.ndarray) -> Tuple[float, float]:
    """
    Finds the decision threshold maximizing the fraud class F1-score.

    Returns:
        (best_threshold, max_f1)
    """
    precisions, recalls, thresholds = precision_recall_curve(y_true, y_prob)
    # Exclude last precision/recall pair which corresponds to threshold = 1.0
    prec = precisions[:-1]
    rec = recalls[:-1]

    denom = np.clip(prec + rec, 1e-12, None)
    f1_scores = 2 * (prec * rec) / denom

    best_idx = int(np.nanargmax(f1_scores))
    best_threshold = float(round(thresholds[best_idx], 4))
    best_f1 = float(round(f1_scores[best_idx], 4))

    return best_threshold, best_f1


def compute_expected_cost(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    exposure: np.ndarray,
    threshold: float,
    investigation_cost: float = 2500.0,
    recovery_fraction: float = 0.20,
) -> Dict[str, Any]:
    """
    Computes total operational cost for an insurance investigation unit at a given threshold.

    Cost Model:
        cost = (TP + FP) * investigation_cost
             + sum_{missed frauds} (exposure_amount * recovery_fraction)
    """
    flag = y_prob >= threshold
    n_investigated = int(flag.sum())
    is_fraud = y_true == 1

    tp = int((flag & is_fraud).sum())
    fp = int((flag & (~is_fraud)).sum())
    fn = int(((~flag) & is_fraud).sum())
    tn = int(((~flag) & (~is_fraud)).sum())

    precision = float(round(tp / max(n_investigated, 1), 4))
    recall = float(round(tp / max(int(is_fraud.sum()), 1), 4))

    missed_mask = (~flag) & is_fraud
    missed_fraud_exposure = float(exposure[missed_mask].sum())

    inv_total_cost = n_investigated * investigation_cost
    missed_fraud_cost = missed_fraud_exposure * recovery_fraction
    total_cost = inv_total_cost + missed_fraud_cost

    return {
        "threshold": float(round(threshold, 3)),
        "n_investigated": n_investigated,
        "investigation_rate": float(round(flag.mean(), 4)),
        "tp": tp,
        "fp": fp,
        "fn": fn,
        "tn": tn,
        "precision": precision,
        "recall": recall,
        "investigation_cost": float(round(inv_total_cost, 2)),
        "missed_fraud_cost": float(round(missed_fraud_cost, 2)),
        "total_cost": float(round(total_cost, 2)),
    }


def sweep_cost_curve(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    exposure: np.ndarray,
    investigation_cost: float = 2500.0,
    recovery_fraction: float = 0.20,
    grid: Optional[np.ndarray] = None,
) -> pd.DataFrame:
    """Evaluates expected cost across a fine threshold grid."""
    if grid is None:
        grid = np.round(np.arange(0.02, 0.96, 0.01), 3)

    records = [
        compute_expected_cost(
            y_true, y_prob, exposure, float(t), investigation_cost, recovery_fraction
        )
        for t in grid
    ]
    return pd.DataFrame(records)


def analyze_threshold_sensitivity(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    exposure: np.ndarray,
    investigation_cost: float = 2500.0,
    recovery_fractions: Optional[List[float]] = None,
) -> pd.DataFrame:
    """
    Examines how the cost-optimal decision threshold and workload shift across
    different fraud recovery assumptions.
    """
    fractions = recovery_fractions or [0.05, 0.10, 0.15, 0.20, 0.25, 0.35, 0.50]
    sensitivity_records = []

    for r in fractions:
        curve = sweep_cost_curve(y_true, y_prob, exposure, investigation_cost, r)
        best_row = curve.loc[curve["total_cost"].idxmin()]
        sensitivity_records.append({
            "recovery_fraction": r,
            "optimal_threshold": float(best_row["threshold"]),
            "investigation_rate": float(best_row["investigation_rate"]),
            "n_investigated": int(best_row["n_investigated"]),
            "recall": float(best_row["recall"]),
            "precision": float(best_row["precision"]),
            "total_cost": float(best_row["total_cost"]),
        })

    return pd.DataFrame(sensitivity_records)


def select_validation_threshold(
    oof_df: pd.DataFrame,
    selected_model_name: str,
    config: Optional[SyghtConfig] = None,
) -> Dict[str, Any]:
    """
    Selects the decision threshold using out-of-fold training probabilities only.

    Returns:
        Threshold metadata dictionary including Max-F1 threshold, cost-optimal
        threshold, sensitivity table, and full cost curve.
    """
    cfg = config or SyghtConfig()
    prob_col = f"p_{selected_model_name}"

    if prob_col not in oof_df.columns:
        raise KeyError(f"Probability column '{prob_col}' not found in out-of-fold DataFrame.")

    y_true = oof_df["fraud"].to_numpy()
    y_prob = oof_df[prob_col].to_numpy()
    exposure = oof_df["exposure_amount"].fillna(0.0).to_numpy()

    # 1. Max F1 Threshold
    f1_thresh, max_f1 = find_max_f1_threshold(y_true, y_prob)

    # 2. Cost-Optimal Threshold
    cost_curve = sweep_cost_curve(
        y_true,
        y_prob,
        exposure,
        investigation_cost=cfg.investigation_cost,
        recovery_fraction=cfg.default_recovery_fraction,
    )
    best_cost_row = cost_curve.loc[cost_curve["total_cost"].idxmin()]
    cost_thresh = float(best_cost_row["threshold"])

    # 3. Reference baselines: investigate everyone vs nobody vs threshold 0.5
    always = compute_expected_cost(y_true, y_prob, exposure, 0.0, cfg.investigation_cost, cfg.default_recovery_fraction)
    never = compute_expected_cost(y_true, y_prob, exposure, 1.01, cfg.investigation_cost, cfg.default_recovery_fraction)
    at_half = compute_expected_cost(y_true, y_prob, exposure, 0.50, cfg.investigation_cost, cfg.default_recovery_fraction)

    # 4. Sensitivity table
    sens_df = analyze_threshold_sensitivity(
        y_true,
        y_prob,
        exposure,
        investigation_cost=cfg.investigation_cost,
        recovery_fractions=cfg.cost_ratios_to_test,
    )

    savings_vs_never = float(never["total_cost"] - best_cost_row["total_cost"])

    result = {
        "selected_model": selected_model_name,
        "max_f1_threshold": f1_thresh,
        "max_f1_score": max_f1,
        "cost_optimal_threshold": cost_thresh,
        "cost_optimal_details": best_cost_row.to_dict(),
        "investigate_all_cost": float(always["total_cost"]),
        "investigate_none_cost": float(never["total_cost"]),
        "default_half_cost": float(at_half["total_cost"]),
        "cost_savings_vs_no_investigation": savings_vs_never,
        "sensitivity_table": sens_df.to_dict(orient="records"),
        "cost_curve": cost_curve,
    }

    logger.info(
        "Threshold Selection: Max-F1=%.4f (F1=%.4f), Cost-Optimal=%.3f (Total Cost=$%s, Savings=$%s)",
        f1_thresh,
        max_f1,
        cost_thresh,
        f"{best_cost_row['total_cost']:,.0f}",
        f"{savings_vs_never:,.0f}",
    )

    return result
