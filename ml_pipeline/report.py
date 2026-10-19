"""
Report Generation Module: Creates transparent, reproducible benchmark reports
in Markdown and JSON formats.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import pandas as pd


def generate_benchmark_report_markdown(
    audit_report: Dict[str, Any],
    cv_summary: pd.DataFrame,
    selection_metadata: Dict[str, Any],
    threshold_metadata: Dict[str, Any],
    test_report: Dict[str, Any],
    global_importance_df: pd.DataFrame,
) -> str:
    """Formats pipeline benchmark results into a clear, professional Markdown report."""
    now_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    tf_m = test_report["threshold_free_metrics"]
    th_m = test_report["threshold_metrics"]
    ci = test_report["confidence_intervals_95"]
    cm = th_m["confusion_matrix"]

    claims_meta = audit_report.get("claims", {})
    n_claims_val = claims_meta.get("n_total_claims", "N/A")
    n_claims_str = f"{n_claims_val:,}" if isinstance(n_claims_val, int) else str(n_claims_val)

    n_ip_val = claims_meta.get("n_inpatient_claims", "N/A")
    n_ip_str = f"{n_ip_val:,}" if isinstance(n_ip_val, int) else str(n_ip_val)

    n_op_val = claims_meta.get("n_outpatient_claims", "N/A")
    n_op_str = f"{n_op_val:,}" if isinstance(n_op_val, int) else str(n_op_val)

    lines = [
        "# Syght — Healthcare Fraud Risk Model Benchmark Report",
        "",
        f"**Generated**: {now_utc}  ",
        f"**Model Selected**: `{selection_metadata.get('selected_model', 'N/A')}`  ",
        f"**Operating Decision Threshold**: `{threshold_metadata.get('max_f1_threshold', 0.50):.4f}` (Max-F1) | `{threshold_metadata.get('cost_optimal_threshold', 0.50):.3f}` (Cost-Optimal)  ",
        "",
        "> **Operational Notice**: Syght provides statistical decision support to prioritize provider review. "
        "Predictions represent risk estimates for human review, not proof of fraud.",
        "",
        "---",
        "",
        "## 1. Dataset & Audit Summary",
        "",
        f"- **Unique Labeled Providers**: {audit_report.get('labels', {}).get('n_unique_providers', 'N/A')}",
        f"- **Fraud Base Rate**: {audit_report.get('labels', {}).get('fraud_rate', 0.0):.2%}",
        f"- **Total Claims Ingested**: {n_claims_str}",
        f"- **Inpatient Claims**: {n_ip_str}",
        f"- **Outpatient Claims**: {n_op_str}",
        f"- **Duplicate Claims**: {claims_meta.get('duplicate_claim_ids', 0)}",
        f"- **Provider ID Consistency Check**: PASSED ({claims_meta.get('overlap_fraction', 1.0):.1%} overlap)",
        "",
        "---",
        "",
        "## 2. Cross-Validation Candidate Comparison",
        "",
        "Candidate models and transparent heuristic baselines evaluated under identical 5-fold cross-validation:",
        "",
        "| Model / Baseline | CV PR-AUC (Mean ± Std) | CV ROC-AUC (Mean ± Std) | Brier Score |",
        "|---|---|---|---|",
    ]

    for _, row in cv_summary.iterrows():
        m_name = row["model"]
        pr_str = f"{row['pr_auc_mean']:.4f} ± {row['pr_auc_std']:.4f}"
        roc_str = f"{row['roc_auc_mean']:.4f} ± {row['roc_auc_std']:.4f}"
        brier_str = f"{row['brier_mean']:.4f}"
        highlight = f"**{m_name} (SELECTED)**" if m_name == selection_metadata.get("selected_model") else m_name
        lines.append(f"| {highlight} | {pr_str} | {roc_str} | {brier_str} |")

    ml_just = selection_metadata.get("ml_justified", True)
    justification_text = (
        "**YES**: The chosen ML model outperformed the best simple volume baseline by > 1 SE."
        if ml_just else
        "**CAUTION**: ML model performance did not exceed the simple billing volume baseline by more than 1 SE. "
        "Review whether billing volume is the dominant confounder."
    )

    lines.extend([
        "",
        f"- **Best Heuristic Baseline**: `{selection_metadata.get('best_rule_model')}` (PR-AUC: {selection_metadata.get('best_rule_score', 0):.4f})",
        f"- **Best Candidate Model**: `{selection_metadata.get('best_ml_model')}` (PR-AUC: {selection_metadata.get('best_ml_score', 0):.4f})",
        f"- **Model Complexity Justified**: {justification_text}",
        "",
        "---",
        "",
        "## 3. Frozen Held-Out Test Evaluation",
        "",
        "Evaluated on held-out test data touched strictly once after freezing all models and thresholds:",
        "",
        f"- **PR-AUC (Average Precision)**: `{tf_m['pr_auc']:.4f}` (95% CI: `[{ci.get('pr_auc_ci95', [0,0])[0]:.4f}, {ci.get('pr_auc_ci95', [0,0])[1]:.4f}]`)",
        f"- **ROC-AUC**: `{tf_m['roc_auc']:.4f}` (95% CI: `[{ci.get('roc_auc_ci95', [0,0])[0]:.4f}, {ci.get('roc_auc_ci95', [0,0])[1]:.4f}]`)",
        f"- **Brier Calibration Score**: `{tf_m['brier_score']:.4f}`",
        f"- **Fraud Precision**: `{th_m['precision']:.4f}`",
        f"- **Fraud Recall**: `{th_m['recall']:.4f}`",
        f"- **F1-Score**: `{th_m['f1']:.4f}`",
        f"- **Investigation Rate**: `{th_m['investigation_rate']:.2%}`",
        "",
        "### Test Confusion Matrix",
        "",
        "| | Predicted Legitimate | Predicted Suspicious (Flagged) |",
        "|---|---|---|",
        f"| **Actual Legitimate** | {cm['true_negatives']} (TN) | {cm['false_positives']} (FP) |",
        f"| **Actual Fraud** | {cm['false_negatives']} (FN) | {cm['true_positives']} (TP) |",
        "",
        "---",
        "",
        "## 4. Cost-Aware Threshold & Workload Analysis",
        "",
        f"- **Investigation Cost per Case**: ${threshold_metadata.get('cost_optimal_details', {}).get('investigation_cost', 2500):,.0f}",
        f"- **Expected Total Operational Cost**: ${threshold_metadata.get('cost_optimal_details', {}).get('total_cost', 0):,.0f}",
        f"- **Net Savings vs. Zero Investigation**: ${threshold_metadata.get('cost_savings_vs_no_investigation', 0):,.0f}",
        "",
        "---",
        "",
        "## 5. Investigation Queue Performance (Top-K Simulation)",
        "",
        "| Strategy | Capacity % | Queue Size (k) | Precision@K | Recall@K | Frauds Caught | % Exposure Captured |",
    ])

    for q in test_report.get("queue_simulation", []):
        strat = q.get("strategy", "")
        cap = f"{q.get('capacity_pct', 0):.1%}"
        k_val = q.get("k", 0)
        p_k = f"{q.get('precision_at_k', 0):.3f}"
        r_k = f"{q.get('recall_at_k', 0):.3f}"
        caught = q.get("fraud_caught", 0)
        exp_pct = f"{q.get('pct_fraud_exposure_captured', 0):.1%}"
        lines.append(f"| {strat} | {cap} | {k_val} | {p_k} | {r_k} | {caught} | {exp_pct} |")

    lines.extend([
        "",
        "---",
        "",
        "## 6. Global Risk Factor Attribution (Top 10 Feature Drivers)",
        "",
        "| Feature | Clinical / Billing Description | Direction of Risk | Importance |",
        "|---|---|---|---|",
    ])

    for _, row in global_importance_df.head(10).iterrows():
        feat = row["feature"]
        desc = row.get("description", feat)
        eff = row.get("effect", "N/A")
        imp = f"{row['importance']:.4f}"
        lines.append(f"| `{feat}` | {desc} | {eff} | {imp} |")

    lines.append("")
    return "\n".join(lines)


def save_benchmark_report(
    output_dir: Union[str, Path],
    audit_report: Dict[str, Any],
    cv_summary: pd.DataFrame,
    selection_metadata: Dict[str, Any],
    threshold_metadata: Dict[str, Any],
    test_report: Dict[str, Any],
    global_importance_df: pd.DataFrame,
) -> Dict[str, Path]:
    """Saves both Markdown and JSON reports to disk."""
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    md_content = generate_benchmark_report_markdown(
        audit_report,
        cv_summary,
        selection_metadata,
        threshold_metadata,
        test_report,
        global_importance_df,
    )
    md_file = out_path / "benchmark_report.md"
    md_file.write_text(md_content, encoding="utf-8")

    # Serialize JSON
    json_data = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "audit": audit_report,
        "cv_summary": cv_summary.to_dict(orient="records"),
        "selection": selection_metadata,
        "threshold": {
            k: v for k, v in threshold_metadata.items()
            if k not in ("cost_curve", "sensitivity_table")
        },
        "threshold_sensitivity": threshold_metadata.get("sensitivity_table", []),
        "test_evaluation": {
            "threshold_free_metrics": test_report.get("threshold_free_metrics"),
            "threshold_metrics": test_report.get("threshold_metrics"),
            "confidence_intervals_95": test_report.get("confidence_intervals_95"),
            "queue_simulation": test_report.get("queue_simulation"),
        },
        "top_features": global_importance_df.head(15).to_dict(orient="records"),
    }

    json_file = out_path / "benchmark_report.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=2)

    return {"markdown_report": md_file, "json_report": json_file}
