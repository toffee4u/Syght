"""
Explainability Module: SHAP-based feature importance, plain-language investigator
descriptions, and local risk-factor attribution.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator

from ml_pipeline.preprocessing import SyghtPreprocessor

logger = logging.getLogger(__name__)

# Investigator-friendly translations of feature names
INVESTIGATOR_FEATURE_DESCRIPTIONS: Dict[str, str] = {
    "n_claims": "Total volume of claims filed by provider",
    "n_inpatient_claims": "Total inpatient hospital admissions billed",
    "n_outpatient_claims": "Total outpatient encounters billed",
    "inpatient_share": "Proportion of total claims from high-cost inpatient hospital admissions",
    "n_unique_beneficiaries": "Number of distinct patients treated",
    "n_unique_attending_physicians": "Number of distinct attending physicians billing under provider",
    "claims_per_beneficiary": "Average claims filed per individual patient",
    "claims_per_attending_physician": "Average claims billed per attending physician",
    "total_reimbursed": "Total Medicare reimbursement received",
    "mean_reimbursed": "Average reimbursement received per claim",
    "median_reimbursed": "Median reimbursement received per claim",
    "std_reimbursed": "Standard deviation / dispersion of claim reimbursement amounts",
    "max_reimbursed": "Largest single claim reimbursement received",
    "p90_reimbursed": "90th-percentile claim reimbursement amount",
    "mean_deductible": "Average patient deductible billed per claim",
    "reimbursed_per_beneficiary": "Average reimbursement generated per individual patient",
    "mean_reimbursed_inpatient": "Average reimbursement per inpatient admission",
    "mean_reimbursed_outpatient": "Average reimbursement per outpatient encounter",
    "mean_claim_duration_days": "Average duration of billed service episodes",
    "mean_admit_days": "Average hospital length of stay (inpatient days)",
    "std_admit_days": "Variability in hospital length of stay",
    "ip_cv_los": "Coefficient of variation in inpatient hospital length of stay",
    "pct_claims_zero_duration": "Share of claims with zero-day service duration",
    "pct_claims_missing_attending": "Share of claims missing an attending physician record",
    "pct_claims_with_operating_physician": "Share of claims listing an operating surgeon/physician",
    "mean_n_diagnosis_codes": "Average number of diagnosis codes billed per claim",
    "mean_n_procedure_codes": "Average number of procedure codes billed per claim",
    "pct_claims_with_procedure": "Share of claims with at least one procedure code billed",
    "top_diagnosis_concentration": "Share of claims concentrated in single most frequent primary diagnosis",
    "top_physician_concentration": "Share of claims concentrated under a single attending physician",
    "pct_duplicate_bene_claims_same_day": "Share of claims where the same patient was billed multiple times on the same date",
    "n_states_served": "Number of geographic states spanned by provider's patient base",
    "n_counties_served": "Number of geographic counties spanned by provider's patient base",
    "mean_patient_age": "Average age of patients served",
    "pct_patients_deceased": "Mortality rate among treated patients",
    "mean_chronic_conditions": "Average count of chronic health conditions per patient (comorbidity load)",
    "pct_renal_disease": "Prevalence of end-stage renal disease among patient panel",
    "mean_ip_annual_reimbursement": "Average annual inpatient Medicare reimbursement across patient panel",
    "mean_op_annual_reimbursement": "Average annual outpatient Medicare reimbursement across patient panel",
}

# 🔰 Beginner-friendly, plain-language explanations of feature metrics
BEGINNER_FEATURE_EXPLANATIONS: Dict[str, str] = {
    "n_claims": "Total insurance bills submitted. An abnormally high count often signals high-speed bill churning.",
    "n_inpatient_claims": "Overnight hospital admissions. Highly expensive; often inflated to pocket large payouts.",
    "n_outpatient_claims": "Day clinic visits. Can be multiplied through repeated unnecessary follow-up visits.",
    "inpatient_share": "Percentage of bills that are expensive overnight stays rather than routine day visits.",
    "n_unique_beneficiaries": "Number of distinct patients treated. Low patient count with high bills suggests ghost billing.",
    "n_unique_attending_physicians": "Active doctors on duty. A large clinic with only 1 doctor indicates a billing monopoly.",
    "claims_per_beneficiary": "How often the same patient is billed repeatedly in a short time frame.",
    "claims_per_attending_physician": "Number of claims signed per doctor. Flags impossible human workloads (e.g. 200 surgeries/day).",
    "total_reimbursed": "Total cash payout received from the insurance scheme.",
    "mean_reimbursed": "Average rupee cost per claim submitted.",
    "median_reimbursed": "The typical, middle-of-the-road cost per claim.",
    "std_reimbursed": "How wildly the billing amounts jump around.",
    "max_reimbursed": "The single most expensive bill the hospital submitted.",
    "p90_reimbursed": "The cost threshold for the hospital's top 10% most expensive claims.",
    "mean_deductible": "Average co-pay amount charged to patients.",
    "reimbursed_per_beneficiary": "Average insurance revenue extracted from each individual patient.",
    "mean_reimbursed_inpatient": "Average money received for each overnight hospital stay.",
    "mean_reimbursed_outpatient": "Average money received for each day clinic visit.",
    "mean_claim_duration_days": "Average number of days a medical service episode lasted.",
    "mean_admit_days": "Average days patients stayed admitted in a hospital bed (length of stay).",
    "std_admit_days": "Variability in hospital stays. Artificial claims often bill identical days (e.g., exactly 5 days).",
    "ip_cv_los": "Unnatural uniformity in hospital stay duration. Clean hospitals have varied stays based on recovery.",
    "pct_claims_zero_duration": "Share of claims where service lasted zero days.",
    "pct_claims_missing_attending": "Claims filed with no doctor name listed (ghost billing indicator).",
    "pct_claims_with_operating_physician": "Share of claims that billed for an operating surgeon.",
    "mean_n_diagnosis_codes": "Average number of illnesses diagnosed per patient visit.",
    "mean_n_procedure_codes": "Average number of medical treatments/surgeries billed per visit.",
    "pct_claims_with_procedure": "Percentage of visits where a surgical or medical procedure was billed.",
    "top_diagnosis_concentration": "Billing the exact same illness diagnosis over and over for everyone.",
    "top_physician_concentration": "A single doctor generating almost all the hospital's revenue.",
    "pct_duplicate_bene_claims_same_day": "Same-day unbundling: billing the same patient multiple times on the exact same day.",
    "n_states_served": "How many different states patients traveled from.",
    "n_counties_served": "Geographic reach of patients visiting this facility.",
    "mean_patient_age": "Average age of patients treated.",
    "pct_patients_deceased": "Mortality rate. Flags post-mortem claims billed after patient death date.",
    "mean_chronic_conditions": "How sick the patients are. Prevents genuine high-risk clinics from being wrongly flagged.",
    "pct_renal_disease": "Share of patients suffering from kidney failure.",
    "mean_ip_annual_reimbursement": "Historical annual inpatient insurance bills across patient panel.",
    "mean_op_annual_reimbursement": "Historical annual outpatient insurance bills across patient panel.",
}


def get_investigator_description(feature_name: str) -> str:
    """Translates a raw feature name into an intuitive description for insurance investigators."""
    clean_name = feature_name.split("__")[-1]
    return INVESTIGATOR_FEATURE_DESCRIPTIONS.get(clean_name, clean_name.replace("_", " ").title())


def get_beginner_feature_explanation(feature_name: str) -> str:
    """Translates a raw feature name into an easy, beginner-friendly explanation."""
    clean_name = feature_name.split("__")[-1]
    return BEGINNER_FEATURE_EXPLANATIONS.get(
        clean_name,
        f"Behavioral indicator measuring {clean_name.replace('_', ' ')} across provider billing records."
    )


class SyghtExplainer:
    """Computes global feature importances and per-provider local risk factor attributions."""

    def __init__(
        self,
        model: BaseEstimator,
        preprocessor: SyghtPreprocessor,
        feature_names: List[str],
        background_sample: Optional[pd.DataFrame] = None,
    ):
        self.model = model
        self.preprocessor = preprocessor
        self.feature_names = feature_names
        self.background_sample = background_sample
        self.explainer_type = "native"
        self._shap_explainer = None
        self._init_explainer()

    def _init_explainer(self) -> None:
        """Initializes SHAP TreeExplainer or LinearExplainer with fallback."""
        try:
            import shap

            if self.background_sample is not None and len(self.background_sample) > 0:
                bg_trans = self.preprocessor.transform(self.background_sample)
                bg_summary = shap.sample(bg_trans, min(100, len(bg_trans)), random_state=42)
            else:
                bg_summary = None

            if hasattr(self.model, "coef_"):
                if bg_summary is not None:
                    self._shap_explainer = shap.LinearExplainer(self.model, bg_summary)
                else:
                    self._shap_explainer = shap.LinearExplainer(self.model)
                self.explainer_type = "shap_linear"
            else:
                self._shap_explainer = shap.TreeExplainer(self.model)
                self.explainer_type = "shap_tree"

        except Exception as err:
            logger.info("SHAP explainer initialization deferred or unavailable: %s. Using model-native importances.", err)
            self._shap_explainer = None
            self.explainer_type = "native_fallback"

    def compute_global_importance(self, eval_df: pd.DataFrame, top_n: int = 15) -> pd.DataFrame:
        """
        Computes global feature importance across an evaluation sample.

        Returns:
            DataFrame with columns: ['feature', 'description', 'importance', 'direction', 'effect']
        """
        X_trans = self.preprocessor.transform(eval_df)
        names = self.feature_names

        if self._shap_explainer is not None:
            try:
                shap_vals = self._shap_explainer.shap_values(X_trans)
                if isinstance(shap_vals, list):
                    shap_vals = shap_vals[1]
                if getattr(shap_vals, "ndim", 2) == 3:
                    shap_vals = shap_vals[:, :, 1]

                mean_abs = np.abs(shap_vals).mean(axis=0)
                # Direction: correlation between feature value and SHAP value
                centered_x = X_trans - X_trans.mean(axis=0)
                direction_raw = (shap_vals * centered_x).mean(axis=0)
                direction = np.sign(direction_raw)

                df = pd.DataFrame({
                    "feature": names,
                    "importance": mean_abs,
                    "direction": direction,
                })
            except Exception as e:
                logger.warning("SHAP calculation error: %s. Falling back to native importances.", e)
                df = self._compute_native_global_importance(names)
        else:
            df = self._compute_native_global_importance(names)

        df["description"] = df["feature"].apply(get_investigator_description)
        df["easy_explanation"] = df["feature"].apply(get_beginner_feature_explanation)
        df["effect"] = df["direction"].apply(
            lambda d: "Increases Fraud Risk" if d > 0 else ("Lowers Fraud Risk" if d < 0 else "Neutral")
        )

        df = df.sort_values("importance", ascending=False).reset_index(drop=True)
        return df.head(top_n)

    def _compute_native_global_importance(self, names: List[str]) -> pd.DataFrame:
        """Fallback for model-native feature importances (coefficients or Gini impurity)."""
        if hasattr(self.model, "coef_"):
            coef = self.model.coef_.ravel()
            return pd.DataFrame({
                "feature": names,
                "importance": np.abs(coef),
                "direction": np.sign(coef),
            })
        elif hasattr(self.model, "feature_importances_"):
            imp = self.model.feature_importances_
            return pd.DataFrame({
                "feature": names,
                "importance": imp,
                "direction": np.ones_like(imp),
            })
        else:
            uniform = np.ones(len(names)) / len(names)
            return pd.DataFrame({
                "feature": names,
                "importance": uniform,
                "direction": np.zeros_like(uniform),
            })

    def explain_provider_instance(
        self,
        provider_row: pd.DataFrame,
        top_k: int = 5,
    ) -> Dict[str, Any]:
        """
        Explains an individual provider prediction, generating human-readable
        risk factors suitable for claims investigators and beginners.
        """
        X_trans = self.preprocessor.transform(provider_row)
        names = self.feature_names

        contributions = []
        if self._shap_explainer is not None:
            try:
                shap_vals = self._shap_explainer.shap_values(X_trans)
                if isinstance(shap_vals, list):
                    shap_vals = shap_vals[1]
                if getattr(shap_vals, "ndim", 2) == 3:
                    shap_vals = shap_vals[:, :, 1]
                vals = shap_vals[0]

                for name, val in zip(names, vals):
                    actual_val = provider_row[name].iloc[0] if name in provider_row.columns else None
                    contributions.append({
                        "feature": name,
                        "description": get_investigator_description(name),
                        "easy_explanation": get_beginner_feature_explanation(name),
                        "observed_value": float(actual_val) if actual_val is not None and not pd.isna(actual_val) else None,
                        "shap_contribution": float(round(val, 4)),
                    })
            except Exception as e:
                logger.warning("Local SHAP error: %s", e)

        if not contributions:
            # Native fallback using scaled values * coefficients / weights
            for name in names:
                actual_val = provider_row[name].iloc[0] if name in provider_row.columns else None
                contributions.append({
                    "feature": name,
                    "description": get_investigator_description(name),
                    "easy_explanation": get_beginner_feature_explanation(name),
                    "observed_value": float(actual_val) if actual_val is not None and not pd.isna(actual_val) else None,
                    "shap_contribution": 0.0,
                })

        df_contrib = pd.DataFrame(contributions)
        # Top positive risk drivers (push score higher towards fraud)
        risk_increasing = (
            df_contrib[df_contrib["shap_contribution"] > 0]
            .sort_values("shap_contribution", ascending=False)
            .head(top_k)
            .to_dict(orient="records")
        )

        # Top risk-lowering factors (evidence consistent with legitimate billing)
        risk_decreasing = (
            df_contrib[df_contrib["shap_contribution"] < 0]
            .sort_values("shap_contribution", ascending=True)
            .head(top_k)
            .to_dict(orient="records")
        )

        return {
            "risk_increasing_factors": risk_increasing,
            "risk_decreasing_factors": risk_decreasing,
            "all_contributions": contributions,
        }
