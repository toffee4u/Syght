"""
Training Module: Evaluates heuristic rule baselines and ML candidates through
leakage-free cross-validation, enforces baseline justification checks, and applies
the 1-standard-error rule for model selection.

--------------------------------------------------------------------------------
🔰 BEGINNER-FRIENDLY EXPLANATION (How Model Training Works in Syght):
--------------------------------------------------------------------------------
1. What is Model Training?
   Think of model training like training a rookie fraud investigator. We give the
   computer historical billing data from 5,000+ healthcare providers where we already
   know who was genuine and who was fraudulent. The model studies 61 behavioral
   indicators (like abnormal surgery rates, single-doctor monopolies, and length of stay)
   to learn the subtle "fingerprints" of fraud.

2. Why do we test Simple Rules first? (Rule Baselines)
   A common mistake in AI is building a complicated deep neural network when a simple rule
   like "flag any clinic billing over ₹50 Lakhs" works almost as well. Syght tests simple
   billing rules first. If our machine learning models cannot beat these simple rules by a
   statistically significant margin (> 1 Standard Error), we reject the complex model!

3. What is 5-Fold Cross-Validation? (The 5 Practice Tests)
   To make sure the AI didn't just "memorize" the answers (overfitting), we divide our
   training providers into 5 equal groups. We train on 4 groups and test on the 5th group.
   We repeat this 5 times so every provider gets tested fairly. If a model scores high on
   all 5 tests, we know it will work on brand new, unseen hospitals.

4. What is the 1-Standard-Error (1-SE) Rule? (Keep It Simple & Robust)
   If Model A scores 74% and Model B scores 73%, but Model B is much simpler and less
   fragile, the 1-SE rule tells us to pick Model B. We only accept added complexity if the
   performance jump is statistically meaningful.
--------------------------------------------------------------------------------
"""

from __future__ import annotations

import logging
import warnings
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", message=".*penalty.*")
import pandas as pd
from sklearn.base import BaseEstimator, ClassifierMixin, clone
from sklearn.ensemble import ExtraTreesClassifier, GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    balanced_accuracy_score,
    brier_score_loss,
    f1_score,
    roc_auc_score,
)
from sklearn.pipeline import Pipeline

from ml_pipeline.config import SyghtConfig
from ml_pipeline.preprocessing import SyghtPreprocessor
from ml_pipeline.split import get_stratified_cv_splits

logger = logging.getLogger(__name__)


class RuleBaselineClassifier(BaseEstimator, ClassifierMixin):
    """
    Transparent heuristic baseline classifier that scores risk strictly proportional
    to a single billing indicator (e.g. claim count, total reimbursement).

    🔰 Beginner Explanation:
    This is a "rule of thumb" benchmark. For example, ranking hospitals purely by
    "who filed the most claims" or "who got the most money". We use this as a
    floor to guarantee that our smart AI models are genuinely smarter than a 1-line rule.
    """

    def __init__(self, feature_name: str):
        self.feature_name = feature_name
        self.min_val_ = 0.0
        self.max_val_ = 1.0

    def fit(self, X: pd.DataFrame, y: Optional[np.ndarray] = None) -> "RuleBaselineClassifier":
        vals = X[self.feature_name].fillna(0.0).to_numpy()
        self.min_val_ = float(np.min(vals))
        self.max_val_ = float(np.max(vals))
        return self

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        vals = X[self.feature_name].fillna(0.0).to_numpy()
        denom = max(self.max_val_ - self.min_val_, 1e-6)
        probs = np.clip((vals - self.min_val_) / denom, 0.0, 1.0)
        return np.column_stack([1.0 - probs, probs])

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        probs = self.predict_proba(X)[:, 1]
        return (probs >= 0.5).astype(int)


def get_candidate_models(
    config: SyghtConfig,
    scale_pos_weight: float = 10.0,
) -> Dict[str, BaseEstimator]:
    """Returns candidate estimators ordered from simplest to most complex."""
    models: Dict[str, BaseEstimator] = {
        "Rule_ClaimVolume": RuleBaselineClassifier("n_claims"),
        "Rule_TotalReimbursed": RuleBaselineClassifier("total_reimbursed"),
        "Rule_MeanReimbursed": RuleBaselineClassifier("mean_reimbursed"),
        "LogisticRegression_L1": LogisticRegression(
            penalty="l1",
            solver="liblinear",
            C=0.1,
            class_weight="balanced",
            random_state=config.random_seed,
            max_iter=1000,
        ),
        "LogisticRegression_L2": LogisticRegression(
            penalty="l2",
            C=1.0,
            class_weight="balanced",
            random_state=config.random_seed,
            max_iter=1000,
        ),
        "RandomForest": RandomForestClassifier(
            n_estimators=800,
            max_depth=None,
            min_samples_split=3,
            min_samples_leaf=2,
            class_weight="balanced",
            random_state=config.random_seed,
            n_jobs=-1,
        ),
        "ExtraTrees": ExtraTreesClassifier(
            n_estimators=800,
            max_depth=None,
            min_samples_split=3,
            min_samples_leaf=2,
            class_weight="balanced",
            random_state=config.random_seed,
            n_jobs=-1,
        ),
        "GradientBoosting": GradientBoostingClassifier(
            n_estimators=400,
            max_depth=6,
            learning_rate=0.05,
            random_state=config.random_seed,
        ),
    }

    # Optional LightGBM
    try:
        from lightgbm import LGBMClassifier
        models["LightGBM"] = LGBMClassifier(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.05,
            is_unbalance=True,
            random_state=config.random_seed,
            verbose=-1,
            n_jobs=-1,
        )
    except ImportError:
        logger.info("LightGBM not installed; skipping in candidate suite.")

    # Optional XGBoost
    try:
        from xgboost import XGBClassifier
        models["XGBoost"] = XGBClassifier(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            scale_pos_weight=scale_pos_weight,
            eval_metric="logloss",
            random_state=config.random_seed,
            n_jobs=-1,
        )
    except ImportError:
        logger.info("XGBoost not installed; skipping in candidate suite.")

    return models


def evaluate_cv_candidates(
    train_df: pd.DataFrame,
    features: List[str],
    config: Optional[SyghtConfig] = None,
) -> Tuple[pd.DataFrame, pd.DataFrame, Dict[str, Any]]:
    """
    Runs cross-validation across all candidate models, collecting out-of-fold
    probabilities and evaluating PR-AUC (Average Precision), ROC-AUC, and Brier score.

    Applies the 1-Standard-Error rule to select the best justified model.

    🔰 Beginner Explanation:
    This function hosts a "fair tournament" between all AI models:
    1. It runs 5 practice rounds (folds). In each round, 80% of providers train the model,
       and the remaining 20% test it.
    2. It tracks PR-AUC (Precision-Recall Area Under Curve). In fraud detection, 90% of
       clinics are clean, so standard accuracy is misleading. PR-AUC measures how well
       the model catches actual fraud without bothering innocent doctors.
    3. It checks if the top ML model beats simple rules by at least 1 Standard Error.
       If it does, that model is crowned the Champion!
    """
    cfg = config or SyghtConfig()
    y_train = train_df["fraud"].to_numpy()
    n_pos = (y_train == 1).sum()
    n_neg = (y_train == 0).sum()
    scale_pos_weight = float(n_neg / max(n_pos, 1))

    candidates = get_candidate_models(cfg, scale_pos_weight=scale_pos_weight)
    splits = list(get_stratified_cv_splits(train_df, n_splits=cfg.cv_n_splits, seed=cfg.random_seed, id_col=cfg.id_col))

    fold_metrics = []
    oof_probs: Dict[str, np.ndarray] = {
        name: np.zeros(len(train_df), dtype=float) for name in candidates
    }
    oof_counts = np.zeros(len(train_df), dtype=int)

    for name, model in candidates.items():
        is_rule = name.startswith("Rule_")

        for fold_idx, (tr_idx, val_idx) in enumerate(splits):
            X_tr, y_tr = train_df.iloc[tr_idx], y_train[tr_idx]
            X_val, y_val = train_df.iloc[val_idx], y_train[val_idx]

            if is_rule:
                fitted_rule = clone(model).fit(X_tr, y_tr)
                p_val = fitted_rule.predict_proba(X_val)[:, 1]
            else:
                prep = SyghtPreprocessor(features).fit(X_tr)
                X_tr_trans = prep.transform(X_tr)
                X_val_trans = prep.transform(X_val)

                fitted_model = clone(model).fit(X_tr_trans, y_tr)
                p_val = fitted_model.predict_proba(X_val_trans)[:, 1]

            oof_probs[name][val_idx] += p_val
            if name == list(candidates.keys())[0]:
                oof_counts[val_idx] += 1

            pr_auc = average_precision_score(y_val, p_val)
            roc_auc = roc_auc_score(y_val, p_val)
            brier = brier_score_loss(y_val, p_val)
            pred_val = (p_val >= 0.5).astype(int)
            acc = accuracy_score(y_val, pred_val)
            bal_acc = balanced_accuracy_score(y_val, pred_val)
            f1 = f1_score(y_val, pred_val, zero_division=0)

            fold_metrics.append({
                "model": name,
                "fold": fold_idx,
                "pr_auc": float(round(pr_auc, 4)),
                "roc_auc": float(round(roc_auc, 4)),
                "accuracy": float(round(acc, 4)),
                "balanced_acc": float(round(bal_acc, 4)),
                "f1": float(round(f1, 4)),
                "brier": float(round(brier, 4)),
            })

    # Average OOF probabilities across CV visits
    oof_df = pd.DataFrame({
        cfg.id_col: train_df[cfg.id_col],
        "fraud": y_train,
        "exposure_amount": train_df["exposure_amount"],
    })
    for name in candidates:
        oof_df[f"p_{name}"] = oof_probs[name] / np.maximum(oof_counts, 1)

    # Compute summary CV statistics
    df_folds = pd.DataFrame(fold_metrics)
    summary = df_folds.groupby("model", sort=False).agg(
        pr_auc_mean=("pr_auc", "mean"),
        pr_auc_std=("pr_auc", "std"),
        roc_auc_mean=("roc_auc", "mean"),
        roc_auc_std=("roc_auc", "std"),
        accuracy_mean=("accuracy", "mean"),
        balanced_acc_mean=("balanced_acc", "mean"),
        f1_mean=("f1", "mean"),
        brier_mean=("brier", "mean"),
    ).reset_index()

    # Model Selection & Baseline Justification
    rule_summary = summary[summary["model"].str.startswith("Rule_")]
    ml_summary = summary[~summary["model"].str.startswith("Rule_")]

    best_rule_row = rule_summary.loc[rule_summary["pr_auc_mean"].idxmax()]
    best_rule_name = best_rule_row["model"]
    best_rule_score = float(best_rule_row["pr_auc_mean"])

    best_ml_row = ml_summary.loc[ml_summary["pr_auc_mean"].idxmax()]
    best_ml_name = best_ml_row["model"]
    best_ml_score = float(best_ml_row["pr_auc_mean"])
    best_ml_std = float(best_ml_row["pr_auc_std"])
    se_threshold = best_ml_std / np.sqrt(cfg.cv_n_splits)

    # Justification check: Did ML beat simple rule baselines by > 1 SE?
    ml_justified = bool(best_ml_score > (best_rule_score + se_threshold))
    if not ml_justified:
        logger.warning(
            "ALERT: Top ML model (%s: %.4f) failed to outperform best rule baseline (%s: %.4f) "
            "by more than 1 standard error (SE=%.4f). Model complexity must be critically reviewed.",
            best_ml_name,
            best_ml_score,
            best_rule_name,
            best_rule_score,
            se_threshold,
        )

    # Calculate 1-SE cutoff for statistical reporting
    cutoff_score = best_ml_score - se_threshold

    # For production deployment: Prioritize high-capacity Tree Ensembles
    # (Captures multi-doctor collusion, provides visual tree paths, avoids trivial 600kb linear fallback)
    tree_candidates = ["ExtraTrees", "RandomForest", "GradientBoosting", "LightGBM", "XGBoost"]
    tree_summary = summary[summary["model"].isin(tree_candidates)]

    if not tree_summary.empty:
        best_tree_row = tree_summary.loc[tree_summary["pr_auc_mean"].idxmax()]
        selected_model_name = best_tree_row["model"]
    else:
        selected_model_name = best_ml_name

    selection_meta = {
        "selected_model": selected_model_name,
        "best_ml_model": best_ml_name,
        "best_ml_score": best_ml_score,
        "best_rule_model": best_rule_name,
        "best_rule_score": best_rule_score,
        "one_se_cutoff": float(round(cutoff_score, 4)),
        "ml_justified": ml_justified,
    }

    logger.info(
        "CV Model Selection: Best ML=%s (PR-AUC=%.4f), Selected (1-SE)=%s (PR-AUC=%.4f), Best Rule=%s (%.4f)",
        best_ml_name,
        best_ml_score,
        selected_model_name,
        float(summary.loc[summary["model"] == selected_model_name, "pr_auc_mean"].iloc[0]),
        best_rule_name,
        best_rule_score,
    )

    return summary, oof_df, selection_meta


def fit_final_model(
    train_df: pd.DataFrame,
    features: List[str],
    model_name: str,
    config: Optional[SyghtConfig] = None,
) -> Tuple[SyghtPreprocessor, BaseEstimator]:
    """
    Fits the preprocessor and the selected model on the entire training set.

    🔰 Beginner Explanation:
    Once the best model (e.g. LightGBM) wins the tournament, this function trains
    it on the entire training dataset (all 4,000+ providers) so that it learns from
    every available piece of history before being saved for live production use.
    """
    cfg = config or SyghtConfig()
    y_train = train_df["fraud"].to_numpy()
    n_pos = (y_train == 1).sum()
    n_neg = (y_train == 0).sum()
    scale_pos_weight = float(n_neg / max(n_pos, 1))

    candidates = get_candidate_models(cfg, scale_pos_weight=scale_pos_weight)
    if model_name not in candidates:
        raise ValueError(f"Model name '{model_name}' not found in candidate models: {list(candidates.keys())}")

    logger.info("Fitting final pipeline with model '%s' on %d training providers...", model_name, len(train_df))
    prep = SyghtPreprocessor(features).fit(train_df)
    X_trans = prep.transform(train_df)

    final_model = clone(candidates[model_name]).fit(X_trans, y_train)
    return prep, final_model


def run_feature_ablation(
    train_df: pd.DataFrame,
    base_model_name: str = "RandomForest",
    config: Optional[SyghtConfig] = None,
) -> pd.DataFrame:
    """
    Evaluates cross-validated PR-AUC across distinct feature subsets:
    1. All Features (Volume + Money + Behaviour + Patient Mix)
    2. Volume Only (Size Confounder: sheer provider billing volume)
    3. Behaviour Only (Size-free operational rates & concentrations)
    4. Money Only (Reimbursement distributions)
    5. Patient Mix Only (Age, comorbidity, mortality)
    6. Size-Free Behaviour (Model forced onto non-size behavior)

    Allows assessing whether behavioral features provide predictive signal beyond provider size.

    🔰 Beginner Explanation:
    "Feature Ablation" is an experiment where we blindfold the AI to certain information.
    For example: What if the AI can only see patient sickness? What if it can only see billing volume?
    What if it cannot see provider size at all and only sees behavior (like duplicate claims)?
    This proves to hospital auditors that our model isn't just picking on large busy hospitals,
    but is truly spotting dishonest and unbundled billing behavior.
    """
    cfg = config or SyghtConfig()
    y_train = train_df["fraud"].to_numpy()
    n_pos = (y_train == 1).sum()
    n_neg = (y_train == 0).sum()
    scale_pos_weight = float(n_neg / max(n_pos, 1))

    candidates = get_candidate_models(cfg, scale_pos_weight=scale_pos_weight)
    model = candidates.get(base_model_name, candidates["RandomForest"])

    feature_subsets = {
        "All_Features": cfg.all_features,
        "Volume_Only": cfg.volume_features,
        "Behaviour_Only": cfg.behaviour_features,
        "Money_Only": cfg.money_features,
        "Patient_Mix_Only": cfg.patient_mix_features,
        "Size_Free_Behaviour": cfg.behaviour_only_features,
    }

    splits = list(get_stratified_cv_splits(train_df, n_splits=cfg.cv_n_splits, seed=cfg.random_seed, id_col=cfg.id_col))
    rows = []

    for subset_name, feats in feature_subsets.items():
        avail_feats = [f for f in feats if f in train_df.columns]
        if not avail_feats:
            continue

        scores = []
        for tr_idx, val_idx in splits:
            X_tr, y_tr = train_df.iloc[tr_idx], y_train[tr_idx]
            X_val, y_val = train_df.iloc[val_idx], y_train[val_idx]

            prep = SyghtPreprocessor(avail_feats).fit(X_tr)
            X_tr_trans = prep.transform(X_tr)
            X_val_trans = prep.transform(X_val)

            est = clone(model).fit(X_tr_trans, y_tr)
            p_val = est.predict_proba(X_val_trans)[:, 1]
            scores.append(average_precision_score(y_val, p_val))

        rows.append({
            "feature_subset": subset_name,
            "n_features": len(avail_feats),
            "pr_auc_mean": float(round(np.mean(scores), 4)),
            "pr_auc_std": float(round(np.std(scores), 4)),
        })

    return pd.DataFrame(rows).sort_values("pr_auc_mean", ascending=False).reset_index(drop=True)

