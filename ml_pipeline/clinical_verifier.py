"""
Clinical Verifier Module: Cross-verifies structured insurance billing codes
against unstructured OCR discharge summaries, operative notes, and doctor case sheets.

Detects phantom surgeries, unperformed procedures, and inflated lengths of stay.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)


@dataclass
class ClinicalAuditResult:
    """Report generated from cross-verifying medical notes against claimed codes."""
    claim_id: str
    billed_procedures: List[str]
    billed_stay_days: int
    clinical_summary_word_count: int
    discrepancy_score: float  # 0.0 (Clean match) to 1.0 (Blatant Fraud)
    is_suspicious: bool
    findings: List[str]
    auditor_action: str


class ClinicalDischargeVerifier:
    """
    Automated medical auditor engine that flags discrepancies between
    claimed financial codes and actual clinical discharge notes.
    """

    # Keyword mappings for high-cost surgical procedures (ICD / CPT mappings)
    PROCEDURE_KEYWORDS = {
        "CABG": ["coronary artery bypass", "grafting", "sternotomy", "bypass pump", "bypass surgery"],
        "HYSTERECTOMY": ["hysterectomy", "uterus removal", "adnexal", "myomectomy"],
        "APPENDECTOMY": ["appendectomy", "appendix", "cecum", "mcburney"],
        "CHOLECYSTECTOMY": ["cholecystectomy", "gallbladder", "laparoscopic chole"],
        "KNEE_REPLACEMENT": ["knee arthroplasty", "knee replacement", "prosthesis", "tibial"],
        "CATARACT": ["phacoemulsification", "intraocular lens", "cataract", "iol"],
        "CHEMOTHERAPY": ["chemotherapy", "infusion", "oncology cycle", "antineoplastic"],
    }

    # Negation phrases in medical summaries (e.g. "ruled out", "no evidence of")
    NEGATION_TERMS = ["no evidence of", "ruled out", "denies", "negative for", "without", "absent", "unremarkable"]

    def __init__(self, discrepancy_threshold: float = 0.50):
        self.discrepancy_threshold = discrepancy_threshold

    def audit_claim_against_notes(
        self,
        claim_id: str,
        billed_procedures: List[str],
        billed_stay_days: int,
        discharge_summary_text: str,
    ) -> ClinicalAuditResult:
        """
        Cross-verifies the claim's billed procedures and duration against
        clinical discharge notes extracted via OCR or digital EHR records.
        """
        text_lower = discharge_summary_text.lower()
        findings: List[str] = []
        discrepancy_penalty = 0.0

        # 1. Procedure Verification Check
        for proc in billed_procedures:
            proc_key = proc.upper().strip()
            # Match keywords associated with procedure
            expected_terms = self.PROCEDURE_KEYWORDS.get(proc_key, [proc_key.lower()])

            found_evidence = False
            for term in expected_terms:
                if term in text_lower:
                    # Check if negated
                    is_negated = any(f"{neg} {term}" in text_lower for neg in self.NEGATION_TERMS)
                    if not is_negated:
                        found_evidence = True
                        break

            if not found_evidence:
                discrepancy_penalty += 0.45
                findings.append(
                    f"Phantom Procedure Alert: Billed for '{proc}', but no operative record or surgical terms found in discharge summary."
                )

        # 2. Stay Duration Cross-Check
        # Look for explicit same-day discharge or ambulatory notes
        same_day_terms = ["discharged same day", "day care procedure", "outpatient discharge", "discharged on arrival", "stable for home in 4 hours"]
        if billed_stay_days > 2 and any(t in text_lower for t in same_day_terms):
            discrepancy_penalty += 0.40
            findings.append(
                f"LOS Inflation: Claim billed for {billed_stay_days} inpatient days, but discharge summary states ambulatory/same-day discharge."
            )

        # Look for explicit admission length in text e.g. "Stay duration: 1 day"
        los_match = re.search(r"stay duration[:\s]+(\d+)\s*day", text_lower)
        if los_match:
            stated_days = int(los_match.group(1))
            if billed_stay_days > stated_days + 3:
                discrepancy_penalty += 0.35
                findings.append(
                    f"Bed Day Discrepancy: Billed for {billed_stay_days} days, but physician summary recorded only {stated_days} days."
                )

        # 3. Brevity / Missing Clinical Detail Check
        word_count = len(discharge_summary_text.split())
        if billed_stay_days > 5 and word_count < 30:
            discrepancy_penalty += 0.25
            findings.append(
                f"Suspiciously Sparse Documentation: Lengthy stay ({billed_stay_days} days) has only {word_count} words in discharge summary."
            )

        final_discrepancy_score = min(1.0, round(discrepancy_penalty, 3))
        is_suspicious = final_discrepancy_score >= self.discrepancy_threshold

        if is_suspicious:
            action = "FREEZE_PAYMENT_AND_DISPATCH_CLINICAL_AUDITOR"
        elif final_discrepancy_score > 0.2:
            action = "FLAG_FOR_DESK_RECONCILIATION"
        else:
            action = "PASS_CLINICAL_CROSS_VERIFICATION"
            findings.append("Billed procedures and admission duration match documented clinical findings.")

        return ClinicalAuditResult(
            claim_id=claim_id,
            billed_procedures=billed_procedures,
            billed_stay_days=billed_stay_days,
            clinical_summary_word_count=word_count,
            discrepancy_score=final_discrepancy_score,
            is_suspicious=is_suspicious,
            findings=findings,
            auditor_action=action,
        )


if __name__ == "__main__":
    verifier = ClinicalDischargeVerifier()

    # Case 1: Legitimate Knee Replacement
    clean_notes = """
    Patient admitted for planned left total knee arthroplasty due to severe osteoarthritis.
    Successful prosthesis implantation under spinal anesthesia. Stay duration: 4 days.
    Post-operative recovery uneventful. Discharged in stable condition with physiotherapy guidance.
    """
    res1 = verifier.audit_claim_against_notes(
        claim_id="CLM901",
        billed_procedures=["KNEE_REPLACEMENT"],
        billed_stay_days=4,
        discharge_summary_text=clean_notes,
    )
    print("Test 1 Result:", res1.auditor_action, f"(Score: {res1.discrepancy_score})")

    # Case 2: Fraudulent Upcoded Appendectomy claim (Actually simple stomach ache)
    fake_notes = """
    Patient presented with mild abdominal discomfort after heavy dinner.
    Vitals normal. Abdomen soft. Given antacids and oral rehydration.
    Discharged same day after 2 hours observation. No surgical intervention required.
    """
    res2 = verifier.audit_claim_against_notes(
        claim_id="CLM902",
        billed_procedures=["APPENDECTOMY"],
        billed_stay_days=5,
        discharge_summary_text=fake_notes,
    )
    print("Test 2 Result:", res2.auditor_action, f"(Score: {res2.discrepancy_score})")
    print("Findings:", res2.findings)
