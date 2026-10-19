"""
Syght Visualization Module: Production & Hackathon-grade visual analytics for
healthcare insurance fraud detection. Generates benchmark comparison charts,
decision tree paths, confusion matrices, calibration curves, and collusion network graphs.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.calibration import calibration_curve
from sklearn.metrics import (
    accuracy_score,
    auc,
    balanced_accuracy_score,
    confusion_matrix,
    f1_score,
    precision_recall_curve,
    roc_curve,
)
from sklearn.tree import plot_tree

logger = logging.getLogger(__name__)

# Set clean aesthetic styling
plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
plt.rcParams["font.family"] = "sans-serif"
plt.rcParams["font.sans-serif"] = ["DejaVu Sans", "Arial", "Helvetica"]
plt.rcParams["axes.edgecolor"] = "#cccccc"
plt.rcParams["axes.linewidth"] = 0.8


def plot_model_benchmarks(
    cv_summary: pd.DataFrame,
    output_path: Optional[Union[str, Path]] = None,
) -> plt.Figure:
    """
    Plots a multi-metric benchmark comparison across all candidate models
    (PR-AUC, ROC-AUC, Accuracy, Balanced Accuracy).
    """
    df = cv_summary.copy()
    fig, axes = plt.subplots(1, 3, figsize=(20, 6))

    # Color palette: Heuristics (Gray), Linear (Steel Blue), Tree Ensembles (Coral/Teal)
    colors = []
    for m in df["model"]:
        if m.startswith("Rule_"):
            colors.append("#95a5a6")
        elif "Logistic" in m:
            colors.append("#3498db")
        else:
            colors.append("#e67e22" if "Forest" in m or "Extra" in m else "#2ecc71")

    # 1. PR-AUC (Average Precision - Primary Metric)
    ax = axes[0]
    bars = ax.barh(df["model"], df["pr_auc_mean"], color=colors, edgecolor="black", alpha=0.85)
    if "pr_auc_std" in df.columns:
        ax.errorbar(
            df["pr_auc_mean"],
            df["model"],
            xerr=df["pr_auc_std"],
            fmt="none",
            ecolor="#2c3e50",
            capsize=4,
            lw=1.5,
        )
    ax.set_title("PR-AUC / Average Precision (Primary Benchmark)", fontsize=13, fontweight="bold", pad=12)
    ax.set_xlabel("PR-AUC Score (Higher is Better)", fontsize=11)
    ax.set_xlim(0, 1.0)
    for bar in bars:
        w = bar.get_width()
        ax.text(w + 0.02, bar.get_y() + bar.get_height() / 2, f"{w:.3f}", va="center", fontsize=10, fontweight="bold")

    # 2. ROC-AUC
    ax = axes[1]
    bars = ax.barh(df["model"], df["roc_auc_mean"], color=colors, edgecolor="black", alpha=0.85)
    ax.set_title("ROC-AUC (Discriminative Capability)", fontsize=13, fontweight="bold", pad=12)
    ax.set_xlabel("ROC-AUC Score", fontsize=11)
    ax.set_xlim(0, 1.0)
    for bar in bars:
        w = bar.get_width()
        ax.text(w + 0.02, bar.get_y() + bar.get_height() / 2, f"{w:.3f}", va="center", fontsize=10, fontweight="bold")

    # 3. Accuracy & Balanced Accuracy
    ax = axes[2]
    if "balanced_acc_mean" in df.columns:
        y_pos = np.arange(len(df))
        height = 0.35
        b1 = ax.barh(y_pos - height / 2, df["accuracy_mean"], height, label="Raw Accuracy", color="#34495e", alpha=0.8)
        b2 = ax.barh(y_pos + height / 2, df["balanced_acc_mean"], height, label="Balanced Accuracy", color="#1abc9c", alpha=0.8)
        ax.set_yticks(y_pos)
        ax.set_yticklabels(df["model"])
        ax.set_title("Accuracy vs Balanced Accuracy (Imbalance Resilient)", fontsize=13, fontweight="bold", pad=12)
        ax.set_xlabel("Accuracy Rate", fontsize=11)
        ax.set_xlim(0, 1.0)
        ax.legend(loc="lower right")
    else:
        # Fallback if accuracy not in summary
        brier = df.get("brier_mean", [0.0] * len(df))
        ax.barh(df["model"], brier, color="#e74c3c", edgecolor="black", alpha=0.85)
        ax.set_title("Brier Calibration Score (Lower is Better)", fontsize=13, fontweight="bold", pad=12)
        ax.set_xlabel("Brier Score", fontsize=11)

    plt.tight_layout()
    if output_path:
        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        fig.savefig(out, dpi=200, bbox_inches="tight")
        logger.info("Saved benchmark comparison figure to %s", out)
    return fig


def plot_decision_tree_explanation(
    model: Any,
    feature_names: List[str],
    output_path: Optional[Union[str, Path]] = None,
    tree_index: int = 0,
    max_depth: int = 3,
) -> Optional[plt.Figure]:
    """
    Renders an actual Decision Tree from a fitted RandomForest or ExtraTrees ensemble.
    Allows judges and auditors to visually inspect exact medical billing decision splits!
    """
    tree_to_plot = None
    if hasattr(model, "estimators_") and len(model.estimators_) > tree_index:
        tree_to_plot = model.estimators_[tree_index]
    elif hasattr(model, "tree_"):
        tree_to_plot = model

    if tree_to_plot is None:
        logger.warning("Model does not expose decision trees for plotting.")
        return None

    fig, ax = plt.subplots(figsize=(22, 10))
    plot_tree(
        tree_to_plot,
        max_depth=max_depth,
        feature_names=feature_names,
        class_names=["Legitimate", "Fraudulent"],
        filled=True,
        rounded=True,
        proportion=True,
        precision=2,
        fontsize=10,
        ax=ax,
    )
    ax.set_title(
        f"Syght Deep Forest: Diagnostic Decision Path (Tree #{tree_index}, Max Depth={max_depth})\n"
        "Visualizing Automated Medical Audit Rules (Gini Impurity, Threshold Splits & Patient Ratios)",
        fontsize=14,
        fontweight="bold",
        pad=15,
    )
    plt.tight_layout()
    if output_path:
        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        fig.savefig(out, dpi=200, bbox_inches="tight")
        logger.info("Saved decision tree explanation figure to %s", out)
    return fig


def plot_evaluation_dashboard(
    y_test: np.ndarray,
    p_test: np.ndarray,
    selected_threshold: float,
    output_path: Optional[Union[str, Path]] = None,
    cost_curve: Optional[pd.DataFrame] = None,
) -> plt.Figure:
    """
    Publication-grade 4-in-1 Evaluation Dashboard:
    1. Precision-Recall Curve (with Operating Point Star)
    2. ROC Curve (with AUC)
    3. Confusion Matrix Heatmap (Counts + Percentages + Accuracy/F1 banner)
    4. Probability Calibration Reliability Diagram
    """
    fig, axes = plt.subplots(2, 2, figsize=(16, 14))
    pred_test = (p_test >= selected_threshold).astype(int)

    # 1. Precision-Recall Curve
    prec, rec, thresholds = precision_recall_curve(y_test, p_test)
    pr_auc = float(auc(rec, prec))
    ax1 = axes[0, 0]
    ax1.plot(rec, prec, color="#2980b9", lw=2.5, label=f"Deep Ensemble (PR-AUC = {pr_auc:.4f})")
    ax1.axhline(y_test.mean(), color="#7f8c8d", linestyle="--", label=f"Baseline Prevalence ({y_test.mean():.1%})")

    # Mark operating threshold
    idx = np.argmin(np.abs(thresholds - selected_threshold)) if len(thresholds) > 0 else 0
    if idx < len(prec) and idx < len(rec):
        ax1.plot(rec[idx], prec[idx], "r*", markersize=16, label=f"Selected Threshold ({selected_threshold:.3f})")
        ax1.annotate(
            f"Precision: {prec[idx]:.1%}\nRecall: {rec[idx]:.1%}",
            xy=(rec[idx], prec[idx]),
            xytext=(rec[idx] - 0.25, prec[idx] - 0.15),
            arrowprops=dict(facecolor="black", shrink=0.08, width=1.5),
            fontweight="bold",
            fontsize=10,
        )
    ax1.set_title("Precision-Recall Curve (Primary Imbalance Benchmark)", fontsize=12, fontweight="bold")
    ax1.set_xlabel("Recall (Fraction of Total Fraud Caught)", fontsize=11)
    ax1.set_ylabel("Precision (Accuracy of Flagged Hospitals)", fontsize=11)
    ax1.set_xlim(0, 1.02)
    ax1.set_ylim(0, 1.02)
    ax1.legend(loc="lower left", fontsize=10)
    ax1.grid(True, alpha=0.3)

    # 2. ROC Curve
    fpr, tpr, _ = roc_curve(y_test, p_test)
    roc_auc = float(auc(fpr, tpr))
    ax2 = axes[0, 1]
    ax2.plot(fpr, tpr, color="#27ae60", lw=2.5, label=f"Syght Model (ROC-AUC = {roc_auc:.4f})")
    ax2.plot([0, 1], [0, 1], color="#95a5a6", linestyle="--", label="Random Classifier (0.5000)")
    ax2.set_title("Receiver Operating Characteristic (ROC)", fontsize=12, fontweight="bold")
    ax2.set_xlabel("False Positive Rate (Legit Penalized)", fontsize=11)
    ax2.set_ylabel("True Positive Rate (Sensitivity)", fontsize=11)
    ax2.set_xlim(0, 1.02)
    ax2.set_ylim(0, 1.02)
    ax2.legend(loc="lower right", fontsize=10)
    ax2.grid(True, alpha=0.3)

    # 3. Detailed Confusion Matrix Heatmap
    cm = confusion_matrix(y_test, pred_test)
    acc = accuracy_score(y_test, pred_test)
    bal_acc = balanced_accuracy_score(y_test, pred_test)
    f1 = f1_score(y_test, pred_test, zero_division=0)
    total = len(y_test)

    cm_labels = [
        [f"True Legit\n{cm[0, 0]} ({cm[0, 0]/total:.1%})", f"False Alarm\n{cm[0, 1]} ({cm[0, 1]/total:.1%})"],
        [f"Missed Fraud\n{cm[1, 0]} ({cm[1, 0]/total:.1%})", f"Caught Fraud\n{cm[1, 1]} ({cm[1, 1]/total:.1%})"],
    ]

    ax3 = axes[1, 0]
    sns.heatmap(
        cm,
        annot=np.array(cm_labels),
        fmt="",
        cmap="Blues",
        cbar=False,
        ax=ax3,
        xticklabels=["Predicted Legit", "Predicted Suspicious"],
        yticklabels=["Actual Legit", "Actual Fraud"],
        annot_kws={"fontsize": 11, "fontweight": "bold"},
    )
    ax3.set_title(
        f"Confusion Matrix (Operating Threshold = {selected_threshold:.3f})\n"
        f"Accuracy: {acc:.1%} | Balanced Acc: {bal_acc:.1%} | F1: {f1:.3f}",
        fontsize=12,
        fontweight="bold",
    )

    # 4. Calibration Curve or Cost Curve
    ax4 = axes[1, 1]
    if cost_curve is not None and "threshold" in cost_curve.columns:
        ax4.plot(cost_curve["threshold"], cost_curve["total_cost"], color="#c0392b", lw=2.5, label="Expected Operational Cost ($)")
        min_cost_thr = cost_curve.loc[cost_curve["total_cost"].idxmin(), "threshold"]
        ax4.axvline(min_cost_thr, color="#2c3e50", linestyle="--", label=f"Cost-Optimal Cutoff ({min_cost_thr:.3f})")
        ax4.set_title("Operational Cost Curve ($2,500 Audit Cost vs Fraud Clawback)", fontsize=12, fontweight="bold")
        ax4.set_xlabel("Decision Threshold", fontsize=11)
        ax4.set_ylabel("Net Projected Exposure ($)", fontsize=11)
        ax4.legend(loc="upper right", fontsize=10)
    else:
        # Calibration curve
        prob_true, prob_pred = calibration_curve(y_test, p_test, n_bins=10)
        ax4.plot(prob_pred, prob_true, "s-", color="#8e44ad", lw=2, label="Model Calibration")
        ax4.plot([0, 1], [0, 1], "--", color="#7f8c8d", label="Perfect Calibration")
        ax4.set_title("Reliability Curve (Probability Calibration)", fontsize=12, fontweight="bold")
        ax4.set_xlabel("Mean Predicted Probability", fontsize=11)
        ax4.set_ylabel("Observed Fraud Frequency", fontsize=11)
        ax4.legend(loc="upper left", fontsize=10)
    ax4.grid(True, alpha=0.3)

    plt.tight_layout()
    if output_path:
        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        fig.savefig(out, dpi=200, bbox_inches="tight")
        logger.info("Saved evaluation dashboard figure to %s", out)
    return fig


def plot_collusion_network(
    labels_df: pd.DataFrame,
    inpatient_df: pd.DataFrame,
    output_path: Optional[Union[str, Path]] = None,
    max_providers: int = 25,
) -> Optional[plt.Figure]:
    """
    Renders an interactive-style network topology graph of hospital facilities
    connected through shared multi-facility physicians.
    """
    try:
        import networkx as nx
    except ImportError:
        logger.warning("networkx not installed; skipping collusion graph.")
        return None

    # Find physicians billing at multiple hospitals
    sample_ip = inpatient_df.dropna(subset=["Provider", "AttendingPhysician"]).head(15000)
    bipartite_counts = sample_ip.groupby(["Provider", "AttendingPhysician"]).size().reset_index(name="claims")

    # Filter to providers in labels_df
    known_providers = set(labels_df["Provider"].unique())
    bipartite_counts = bipartite_counts[bipartite_counts["Provider"].isin(known_providers)]

    doc_prov_count = bipartite_counts.groupby("AttendingPhysician")["Provider"].nunique()
    shared_docs = doc_prov_count[doc_prov_count > 1].index

    shared_edges = bipartite_counts[bipartite_counts["AttendingPhysician"].isin(shared_docs)]
    if shared_edges.empty:
        return None

    top_providers = shared_edges["Provider"].value_counts().head(max_providers).index
    filtered_edges = shared_edges[shared_edges["Provider"].isin(top_providers)]

    # Build Graph
    G = nx.Graph()
    fraud_map = dict(zip(labels_df["Provider"], labels_df["PotentialFraud"].map({"Yes": 1, "No": 0})))

    for _, row in filtered_edges.iterrows():
        p = row["Provider"]
        d = row["AttendingPhysician"]
        is_fraud = fraud_map.get(p, 0)
        G.add_node(p, node_type="provider", fraud=is_fraud)
        G.add_node(d, node_type="physician", fraud=0)
        G.add_edge(p, d, weight=row["claims"])

    fig, ax = plt.subplots(figsize=(16, 12))
    pos = nx.spring_layout(G, k=0.35, seed=42)

    # Provider nodes
    prov_nodes = [n for n, attr in G.nodes(data=True) if attr.get("node_type") == "provider"]
    prov_fraud = [n for n in prov_nodes if G.nodes[n].get("fraud") == 1]
    prov_legit = [n for n in prov_nodes if G.nodes[n].get("fraud") == 0]
    doc_nodes = [n for n, attr in G.nodes(data=True) if attr.get("node_type") == "physician"]

    nx.draw_networkx_nodes(G, pos, nodelist=prov_fraud, node_color="#e74c3c", node_size=600, label="Fraudulent Hospital", ax=ax)
    nx.draw_networkx_nodes(G, pos, nodelist=prov_legit, node_color="#3498db", node_size=400, label="Legitimate Hospital", ax=ax)
    nx.draw_networkx_nodes(G, pos, nodelist=doc_nodes, node_color="#2ecc71", node_size=150, node_shape="^", label="Shared Multi-Facility Doctor", ax=ax)
    nx.draw_networkx_edges(G, pos, alpha=0.35, edge_color="#7f8c8d", width=1.2, ax=ax)

    # Label top provider hubs
    top_labels = {p: p for p in prov_fraud[:8]}
    nx.draw_networkx_labels(G, pos, labels=top_labels, font_size=9, font_weight="bold", ax=ax)

    ax.set_title(
        "Bipartite Collusion Nexus: Multi-Facility Physician Sharing Network\n"
        "Detecting High-Risk Kickback Rings & Cross-Facility Patient Recycling in PM-JAY",
        fontsize=14,
        fontweight="bold",
        pad=15,
    )
    ax.legend(loc="upper left", fontsize=11, frameon=True)
    ax.axis("off")
    plt.tight_layout()

    if output_path:
        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        fig.savefig(out, dpi=200, bbox_inches="tight")
        logger.info("Saved collusion network figure to %s", out)
    return fig


def plot_fraud_recovery_lift(
    y_test: np.ndarray,
    p_test: np.ndarray,
    exposure_amounts: np.ndarray,
    output_path: Optional[Union[str, Path]] = None,
) -> plt.Figure:
    """
    Renders the Financial Lift / Workload Prioritization Curve:
    Shows % of total fraudulent claim money recovered vs % of top providers audited.
    """
    df = pd.DataFrame({
        "fraud": y_test,
        "prob": p_test,
        "exposure": exposure_amounts,
    }).sort_values("prob", ascending=False).reset_index(drop=True)

    df["fraud_exposure"] = df["fraud"] * df["exposure"]
    total_fraud_dollars = df["fraud_exposure"].sum()
    total_providers = len(df)

    df["cum_fraud_recovered"] = df["fraud_exposure"].cumsum()
    df["pct_fraud_recovered"] = df["cum_fraud_recovered"] / max(total_fraud_dollars, 1.0)
    df["pct_providers_audited"] = (df.index + 1) / total_providers

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(df["pct_providers_audited"], df["pct_fraud_recovered"], color="#2c3e50", lw=3, label="Syght AI Priority Queue")
    ax.plot([0, 1], [0, 1], color="#95a5a6", linestyle="--", label="Random Audit Selection")

    # Mark 5% audit capacity
    idx_5pct = int(0.05 * total_providers)
    rec_5pct = df.loc[idx_5pct, "pct_fraud_recovered"]
    ax.plot(0.05, rec_5pct, "ro", markersize=10)
    ax.annotate(
        f"Auditing Top 5% Providers Recovers\n{rec_5pct:.1%} of Total Fraud Dollars!",
        xy=(0.05, rec_5pct),
        xytext=(0.15, rec_5pct - 0.15),
        arrowprops=dict(facecolor="black", shrink=0.08, width=1.5),
        fontweight="bold",
        fontsize=11,
        color="#c0392b",
    )

    ax.set_title("Operational ROI: Fraud Money Recovery vs. Investigation Capacity", fontsize=13, fontweight="bold", pad=12)
    ax.set_xlabel("Fraction of Providers Audited by Medical Reviewers", fontsize=11)
    ax.set_ylabel("Fraction of Total Fraudulent Reimbursements Recovered", fontsize=11)
    ax.set_xlim(0, 1.0)
    ax.set_ylim(0, 1.05)
    ax.legend(loc="lower right", fontsize=11)
    ax.grid(True, alpha=0.3)

    plt.tight_layout()
    if output_path:
        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        fig.savefig(out, dpi=200, bbox_inches="tight")
        logger.info("Saved fraud recovery lift figure to %s", out)
    return fig
