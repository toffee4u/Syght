"""
Syght End-to-End Training & Benchmarking CLI Runner.

Executes the full Syght ML pipeline:
1. (Optional) Downloads Kaggle benchmark dataset
2. Pre-flight data quality audit & ingestion
3. 58 Provider-level engineered features
4. Leakage-safe stratified train/test split
5. 5-Fold Stratified Cross-Validation on 7 models & baselines
6. 1-SE Model Selection & Hyperparameter Tuning
7. Out-of-fold Decision Threshold Optimization
8. Frozen Test Set Single-Pass Evaluation
9. SHAP Explainability & Risk Driver Attribution
10. Operational Investigation Queue Simulation
11. Model & Report Packaging with Deployment Zip Export
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import subprocess
import sys
from pathlib import Path

# Add Syght root to path if needed
syght_root = Path(__file__).resolve().parent
if str(syght_root) not in sys.path:
    sys.path.insert(0, str(syght_root))

from ml_pipeline.config import SyghtConfig
from ml_pipeline.data_ingestion import load_raw_tables
from ml_pipeline.data_audit import DataAuditor
from ml_pipeline.feature_engineering import build_provider_features
from ml_pipeline.split import create_provider_split, check_split_leakage
from ml_pipeline.preprocessing import SyghtPreprocessor
from ml_pipeline.train import evaluate_cv_candidates, fit_final_model, run_feature_ablation
from ml_pipeline.tune import tune_model
from ml_pipeline.threshold import select_validation_threshold
from ml_pipeline.evaluate import evaluate_frozen_test_set
from ml_pipeline.explain import SyghtExplainer
from ml_pipeline.report import save_benchmark_report
from ml_pipeline.artifacts import save_model_bundle, package_deployment_artifacts

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
logger = logging.getLogger("syght.runner")


def setup_kaggle_credentials(username: str | None = None, key: str | None = None) -> None:
    """Configures Kaggle credentials in ~/.kaggle/kaggle.json if provided."""
    kaggle_dir = Path.home() / ".kaggle"
    kaggle_dir.mkdir(parents=True, exist_ok=True)
    kaggle_json = kaggle_dir / "kaggle.json"

    # 1. Check explicit args
    if username and key:
        with open(kaggle_json, "w", encoding="utf-8") as f:
            json.dump({"username": username, "key": key}, f)
        kaggle_json.chmod(0o600)
        logger.info("Configured Kaggle credentials from parameters.")
        return

    # 2. Check Colab userdata / secrets
    try:
        from google.colab import userdata
        c_user = userdata.get("KAGGLE_USERNAME")
        c_key = userdata.get("KAGGLE_KEY")
        if c_user and c_key:
            with open(kaggle_json, "w", encoding="utf-8") as f:
                json.dump({"username": c_user, "key": c_key}, f)
            kaggle_json.chmod(0o600)
            logger.info("Configured Kaggle credentials from Google Colab Secrets.")
            return
    except Exception:
        pass

    # 3. Check existing file or env
    if kaggle_json.is_file():
        logger.info("Found existing ~/.kaggle/kaggle.json.")
    elif "KAGGLE_USERNAME" in os.environ and "KAGGLE_KEY" in os.environ:
        logger.info("Found KAGGLE_USERNAME and KAGGLE_KEY in environment.")
    else:
        logger.warning("No Kaggle credentials detected. Dataset download may fail if needed.")


def download_dataset_if_needed(raw_data_dir: Path, dataset_slug: str) -> None:
    """Downloads dataset from Kaggle if Train-*.csv files are missing."""
    raw_data_dir.mkdir(parents=True, exist_ok=True)
    existing_files = list(raw_data_dir.glob("Train-*.csv"))
    if existing_files:
        logger.info("Dataset already exists in %s (%d files).", raw_data_dir, len(existing_files))
        return

    logger.info("Downloading dataset '%s' to %s...", dataset_slug, raw_data_dir)
    cmd = [
        sys.executable,
        "-m",
        "kaggle",
        "datasets",
        "download",
        "-d",
        dataset_slug,
        "--unzip",
        "-p",
        str(raw_data_dir),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        logger.error("Kaggle download failed: %s\n%s", res.stdout, res.stderr)
        raise RuntimeError(f"Kaggle download failed: {res.stderr}")

    logger.info("Dataset downloaded and unzipped successfully.")


def generate_evaluation_plots(
    test_report: dict,
    output_dir: Path,
) -> list[Path]:
    """Generates and exports PR, ROC, Confusion Matrix, and Cost curve plots."""
    figures_dir = output_dir / "figures"
    figures_dir.mkdir(parents=True, exist_ok=True)
    generated: list[Path] = []

    try:
        import matplotlib.pyplot as plt
        import seaborn as sns
        from sklearn.metrics import precision_recall_curve, roc_curve, confusion_matrix

        y_true = np.array(test_report["y_true"])
        y_prob = np.array(test_report["y_prob"])
        y_pred = np.array(test_report["y_pred"])
        threshold = test_report.get("selected_threshold", 0.5)

        # 1. Precision-Recall Curve
        prec, rec, _ = precision_recall_curve(y_true, y_prob)
        pr_auc = test_report["threshold_free_metrics"]["pr_auc"]
        plt.figure(figsize=(7, 5))
        plt.plot(rec, prec, color="#1f77b4", lw=2.5, label=f"Syght Model (PR-AUC = {pr_auc:.3f})")
        plt.axhline(y=float(np.mean(y_true)), color="red", linestyle="--", label=f"No-Skill Baseline ({np.mean(y_true):.3f})")
        plt.xlabel("Recall", fontsize=11)
        plt.ylabel("Precision", fontsize=11)
        plt.title("Precision-Recall Curve (Frozen Test Set)", fontsize=13, fontweight="bold")
        plt.legend(loc="upper right")
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        pr_path = figures_dir / "pr_curve.png"
        plt.savefig(pr_path, dpi=200)
        plt.close()
        generated.append(pr_path)

        # 2. ROC Curve
        fpr, tpr, _ = roc_curve(y_true, y_prob)
        roc_auc = test_report["threshold_free_metrics"]["roc_auc"]
        plt.figure(figsize=(7, 5))
        plt.plot(fpr, tpr, color="#2ca02c", lw=2.5, label=f"Syght Model (ROC-AUC = {roc_auc:.3f})")
        plt.plot([0, 1], [0, 1], "k--", alpha=0.5, label="Random Guess")
        plt.xlabel("False Positive Rate", fontsize=11)
        plt.ylabel("True Positive Rate", fontsize=11)
        plt.title("ROC Curve (Frozen Test Set)", fontsize=13, fontweight="bold")
        plt.legend(loc="lower right")
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        roc_path = figures_dir / "roc_curve.png"
        plt.savefig(roc_path, dpi=200)
        plt.close()
        generated.append(roc_path)

        # 3. Confusion Matrix
        cm = confusion_matrix(y_true, y_pred)
        plt.figure(figsize=(6, 5))
        sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", cbar=False,
                    xticklabels=["Clean", "Fraud"], yticklabels=["Clean", "Fraud"])
        plt.xlabel("Predicted Class", fontsize=11)
        plt.ylabel("True Class", fontsize=11)
        plt.title(f"Confusion Matrix (Threshold = {threshold:.3f})", fontsize=13, fontweight="bold")
        plt.tight_layout()
        cm_path = figures_dir / "confusion_matrix.png"
        plt.savefig(cm_path, dpi=200)
        plt.close()
        generated.append(cm_path)

        logger.info("Generated %d evaluation plots in %s", len(generated), figures_dir)
    except Exception as e:
        logger.warning("Could not generate plots (missing matplotlib/seaborn?): %s", e)

    return generated


def main() -> None:
    parser = argparse.ArgumentParser(description="Syght ML Training & Benchmarking CLI Runner")
    parser.add_argument("--data-dir", type=str, default="data/raw", help="Directory containing raw CSVs")
    parser.add_argument("--output-dir", type=str, default="outputs", help="Directory to save artifacts and reports")
    parser.add_argument("--download", action="store_true", help="Download dataset from Kaggle if missing")
    parser.add_argument("--kaggle-username", type=str, default=None, help="Kaggle API username")
    parser.add_argument("--kaggle-key", type=str, default=None, help="Kaggle API key")
    parser.add_argument("--skip-tuning", action="store_true", help="Skip hyperparameter search for faster execution")
    args = parser.parse_args()

    # Determine runtime context (Colab or local)
    in_colab = "google.colab" in sys.modules or Path("/content").exists()
    raw_data_dir = Path("/content/data/raw") if in_colab and args.data_dir == "data/raw" else Path(args.data_dir)
    output_dir = Path("/content/outputs") if in_colab and args.output_dir == "outputs" else Path(args.output_dir)

    print("=" * 65)
    print("🚀 SYGHT HEALTHCARE FRAUD DETECTION — TRAINING PIPELINE")
    print("=" * 65)

    # 1. Kaggle Setup & Download
    setup_kaggle_credentials(username=args.kaggle_username, key=args.kaggle_key)
    if args.download or not list(raw_data_dir.glob("Train-*.csv")):
        download_dataset_if_needed(raw_data_dir, "rohitrox/healthcare-provider-fraud-detection-analysis")

    config = SyghtConfig()

    # 2. Ingestion & Pre-Flight Audit
    print("\n[Stage 1/7] Ingesting and Auditing Raw Data...")
    labels_raw, bene_raw, ip_raw, op_raw = load_raw_tables(raw_data_dir, config)
    auditor = DataAuditor(config=config)
    audit_report = auditor.audit(labels_raw, bene_raw, ip_raw, op_raw)
    print(f"  • Raw Providers: {len(labels_raw)} | Beneficiaries: {len(bene_raw)}")
    print(f"  • Inpatient Claims: {len(ip_raw)} | Outpatient Claims: {len(op_raw)}")
    print(f"  • Audit Passed: {audit_report['passed']}")

    # 3. Feature Engineering
    print("\n[Stage 2/7] Computing 58 Provider-Level Features...")
    provider_df = build_provider_features(labels_raw, bene_raw, ip_raw, op_raw, config=config)
    fraud_rate = float(provider_df["fraud"].mean())
    print(f"  • Provider Matrix: {provider_df.shape[0]} rows × {len(config.all_features)} engineered features")
    print(f"  • Fraud Prevalence: {fraud_rate * 100:.2f}% ({provider_df['fraud'].sum()} fraud / {len(provider_df)} total)")

    # 4. Leakage-Safe Stratified Split
    print("\n[Stage 3/7] Partitioning Data (80% Train / 20% Frozen Test)...")
    train_df, test_df = create_provider_split(
        provider_df,
        test_size=config.test_size,
        seed=config.random_seed,
        stratify_col="fraud",
        id_col=config.id_col,
    )
    check_split_leakage(train_df, test_df, id_col=config.id_col)
    print(f"  • Training Fold:   {len(train_df)} providers (Fraud: {train_df['fraud'].sum()})")
    print(f"  • Frozen Test Set: {len(test_df)} providers (Fraud: {test_df['fraud'].sum()})")

    # 5. 5-Fold Stratified Cross-Validation Benchmarking
    print("\n[Stage 4/7] Benchmarking 7 Candidate Models & Rule Baselines (5-Fold CV)...")
    selected_features = config.all_features
    cv_summary, oof_df, selection_metadata = evaluate_cv_candidates(
        train_df,
        selected_features,
        config=config,
    )
    print("\n" + cv_summary.to_string(index=False))
    print(f"\n  ★ Selected Model (1-SE Rule): {selection_metadata['selected_model']}")
    print(f"  ★ Lift over Best Rule Baseline: +{(selection_metadata['best_ml_score'] - selection_metadata['best_rule_score']):.4f} PR-AUC")

    # 6. Feature Ablation & Hyperparameter Tuning
    final_model = selection_metadata["fitted_models"][selection_metadata["selected_model"]]
    if not args.skip_tuning:
        print("\n[Stage 5/7] Tuning Hyperparameters on Training Fold...")
        tuned_model, best_params, tuned_score = tune_model(
            train_df,
            selected_features,
            final_model,
            selection_metadata["selected_model"],
            n_iter=10,
            config=config,
        )
        if best_params:
            print(f"  • Best Params: {best_params}")
            print(f"  • Tuned PR-AUC: {tuned_score:.4f}")
            final_model = tuned_model

    # Fit final preprocessor & model on entire training set
    preprocessor = SyghtPreprocessor(config=config)
    X_train_proc = preprocessor.fit_transform(train_df[selected_features])
    final_model.fit(X_train_proc, train_df["fraud"].to_numpy())

    # 7. Threshold & Cost Optimization
    print("\n[Stage 6/7] Optimizing Decision Threshold on Out-of-Fold Probabilities...")
    threshold_metadata = select_validation_threshold(
        oof_df,
        selection_metadata["selected_model"],
        config=config,
    )
    selected_threshold = threshold_metadata["max_f1_threshold"]
    print(f"  • Max-F1 Threshold:       {selected_threshold:.4f} (Validation F1: {threshold_metadata['max_f1_score']:.4f})")
    print(f"  • Cost-Optimal Threshold: {threshold_metadata['cost_optimal_threshold']:.4f} (Validation Cost: ${threshold_metadata['min_cost']:,.0f})")

    # 8. Frozen Test Set Single-Pass Evaluation
    print("\n[Stage 7/7] Single-Pass Evaluation on Frozen Test Set...")
    test_report = evaluate_frozen_test_set(
        test_df,
        preprocessor,
        final_model,
        selected_threshold=selected_threshold,
        config=config,
    )

    tf_m = test_report["threshold_free_metrics"]
    th_m = test_report["threshold_metrics"]
    ci = test_report["confidence_intervals_95"]

    print("\n" + "=" * 55)
    print("🏆 FINAL BENCHMARK PERFORMANCE (FROZEN TEST SET)")
    print("=" * 55)
    print(f"  • PR-AUC:     {tf_m['pr_auc']:.4f}  (95% CI: [{ci['pr_auc'][0]:.4f}, {ci['pr_auc'][1]:.4f}])")
    print(f"  • ROC-AUC:    {tf_m['roc_auc']:.4f}  (95% CI: [{ci['roc_auc'][0]:.4f}, {ci['roc_auc'][1]:.4f}])")
    print(f"  • Precision:  {th_m['precision']:.4f}")
    print(f"  • Recall:     {th_m['recall']:.4f}")
    print(f"  • F1-Score:   {th_m['f1']:.4f}")
    print(f"  • Brier Loss: {tf_m['brier_score']:.4f}")
    print("=" * 55)

    # SHAP Explainability Summary
    print("\nGenerating SHAP Global Feature Attributions...")
    explainer = SyghtExplainer(
        model=final_model,
        preprocessor=preprocessor,
        feature_names=selected_features,
        background_sample=train_df.head(100),
    )
    global_importance_df = explainer.compute_global_importance(test_df, top_n=10)
    print(global_importance_df[["feature", "importance", "direction", "plain_language_meaning"]].to_string(index=False))

    # Generate Visual Figures
    figures = generate_evaluation_plots(test_report, output_dir)

    # Save Benchmark Reports
    report_files = save_benchmark_report(
        output_dir=output_dir / "reports",
        audit_report=audit_report,
        cv_summary=cv_summary,
        selection_metadata=selection_metadata,
        threshold_metadata=threshold_metadata,
        test_report=test_report,
        global_importance_df=global_importance_df,
    )

    # Save Model Bundle
    model_bundle_path = save_model_bundle(
        model=final_model,
        preprocessor=preprocessor,
        feature_names=selected_features,
        decision_threshold=selected_threshold,
        metadata={
            "selected_model": selection_metadata["selected_model"],
            "max_f1_threshold": threshold_metadata["max_f1_threshold"],
            "cost_optimal_threshold": threshold_metadata["cost_optimal_threshold"],
            "pr_auc_test": tf_m["pr_auc"],
        },
        output_path=output_dir / "models" / "syght_model_bundle.joblib",
    )

    # Package Deployment Zip Archive
    zip_output_path = Path("/content/syght_deployment_bundle.zip") if in_colab else (output_dir / "syght_deployment_bundle.zip")
    zip_path = package_deployment_artifacts(
        artifacts_dir=output_dir,
        output_zip_path=zip_output_path,
    )
    print(f"\n📦 Deployment Bundle Created: {zip_path}")
    print(f"   Size: {zip_path.stat().st_size / (1024 * 1024):.2f} MB")

    # If running in Colab, trigger download
    if in_colab:
        try:
            from google.colab import files
            print("\n📥 Initiating browser download of syght_deployment_bundle.zip...")
            files.download(str(zip_path))
            print("Download started! Check your browser's download folder.")
        except Exception as e:
            print(f"Browser download notice: {e}. You can manually download from {zip_path}")

    print("\n✅ SYGHT TRAINING & BENCHMARKING COMPLETE!")


if __name__ == "__main__":
    import numpy as np
    main()
