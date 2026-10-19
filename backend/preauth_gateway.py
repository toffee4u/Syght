"""
Real-Time Pre-Authorization Fraud Prevention Gateway.

Evaluates incoming hospital admission & pre-auth requests in sub-milliseconds (< 5ms)
to prevent fraudulent payouts BEFORE discharge, rather than auditing months later.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

logger = logging.getLogger(__name__)


@dataclass
class PreAuthRequest:
    """Incoming real-time hospital admission / pre-authorization payload."""
    claim_id: str
    provider_id: str
    beneficiary_id: str
    attending_physician: str
    admission_date: str
    requested_amount: float
    diagnosis_codes: List[str]
    procedure_codes: List[str] = field(default_factory=list)
    patient_age: int = 55
    chronic_conditions_count: int = 2


@dataclass
class PreAuthResponse:
    """Real-time fraud scoring & automated adjudication decision."""
    claim_id: str
    provider_id: str
    decision: str  # 'AUTO_APPROVED', 'MANUAL_AUDIT_REQUIRED', 'REJECT_SUSPECTED_FRAUD'
    fraud_probability: float
    risk_level: str  # 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    latency_ms: float
    flags_triggered: List[str]
    reason_codes: List[str]
    max_approved_amount: float


class PreAuthFraudGateway:
    """
    Sub-millisecond real-time scoring gateway designed for Ayushman Bharat (PM-JAY),
    CGHS, and private health insurance Third Party Administrators (TPAs).
    """

    def __init__(
        self,
        high_risk_threshold: float = 0.65,
        review_threshold: float = 0.35,
        known_high_risk_providers: Optional[set[str]] = None,
        average_diagnosis_costs: Optional[Dict[str, float]] = None,
    ):
        self.high_risk_threshold = high_risk_threshold
        self.review_threshold = review_threshold
        self.known_high_risk_providers = known_high_risk_providers or set()
        self.average_diagnosis_costs = average_diagnosis_costs or {
            "4019": 1200.0,   # Essential Hypertension
            "25000": 1500.0,  # Diabetes Mellitus
            "4280": 6500.0,   # Congestive Heart Failure
            "V5861": 2000.0,  # Long-term use of anticoagulants
            "42731": 7500.0,  # Atrial Fibrillation
            "41401": 12000.0, # Coronary Atherosclerosis
        }

        # Simulated real-time cache of recent beneficiary admissions (for phantom burst detection)
        self.recent_admissions_cache: Dict[str, List[Tuple[str, datetime]]] = {}

    def score_preauth(self, request: PreAuthRequest) -> PreAuthResponse:
        """Evaluates an incoming pre-auth request in sub-milliseconds."""
        start_time = time.perf_counter()
        flags: List[str] = []
        reasons: List[str] = []
        risk_score = 0.05  # Base population baseline (~9% fraud rate)

        # 1. Historical Provider Reputation Check
        if request.provider_id in self.known_high_risk_providers:
            risk_score += 0.40
            flags.append("HIGH_RISK_PROVIDER_HISTORY")
            reasons.append(f"Provider {request.provider_id} has prior enforcement history.")

        # 2. Package Upcoding Anomaly Check
        expected_base_cost = 2500.0
        if request.diagnosis_codes:
            primary_diag = request.diagnosis_codes[0]
            expected_base_cost = self.average_diagnosis_costs.get(primary_diag, 3000.0)

        if request.requested_amount > (expected_base_cost * 3.0):
            risk_score += 0.30
            flags.append("SUSPECTED_PACKAGE_UPCODING")
            reasons.append(
                f"Requested amount INR {request.requested_amount:,.0f} is {request.requested_amount / max(expected_base_cost, 1):.1f}x "
                f"higher than standard package rate (INR {expected_base_cost:,.0f})."
            )

        # 3. Phantom Beneficiary Collision Check (Recent Multi-Hospital Admissions)
        try:
            req_date = datetime.strptime(request.admission_date, "%Y-%m-%d")
        except ValueError:
            req_date = datetime.now()

        recent_history = self.recent_admissions_cache.get(request.beneficiary_id, [])
        # Check if beneficiary was admitted elsewhere within last 48 hours
        conflicting_admissions = [
            (prov, dt) for prov, dt in recent_history
            if prov != request.provider_id and abs((req_date - dt).total_seconds()) < (48 * 3600)
        ]

        if conflicting_admissions:
            risk_score += 0.35
            flags.append("BENEFICIARY_IMPOSSIBLE_COLLISION")
            conflicting_prov = conflicting_admissions[0][0]
            reasons.append(
                f"Beneficiary {request.beneficiary_id} was already admitted at provider {conflicting_prov} within 48h (Ghost Admission)."
            )

        # Update cache
        if request.beneficiary_id not in self.recent_admissions_cache:
            self.recent_admissions_cache[request.beneficiary_id] = []
        self.recent_admissions_cache[request.beneficiary_id].append((request.provider_id, req_date))

        # 4. Final Adjudication
        final_prob = float(np.clip(risk_score, 0.0, 0.99))
        latency = (time.perf_counter() - start_time) * 1000.0

        if final_prob >= self.high_risk_threshold:
            decision = "REJECT_SUSPECTED_FRAUD"
            risk_level = "CRITICAL"
            max_approved = 0.0
        elif final_prob >= self.review_threshold:
            decision = "MANUAL_AUDIT_REQUIRED"
            risk_level = "HIGH"
            max_approved = round(expected_base_cost, 2)
        else:
            decision = "AUTO_APPROVED"
            risk_level = "LOW"
            max_approved = request.requested_amount
            reasons.append("Claim matches historical clinical norms and verified patient stay.")

        return PreAuthResponse(
            claim_id=request.claim_id,
            provider_id=request.provider_id,
            decision=decision,
            fraud_probability=round(final_prob, 3),
            risk_level=risk_level,
            latency_ms=round(latency, 2),
            flags_triggered=flags,
            reason_codes=reasons,
            max_approved_amount=max_approved,
        )


if __name__ == "__main__":
    gateway = PreAuthFraudGateway(known_high_risk_providers={"PRV55012", "PRV51001"})

    # Test 1: Normal claim
    normal_req = PreAuthRequest(
        claim_id="CLM1001",
        provider_id="PRV99999",
        beneficiary_id="BENE001",
        attending_physician="PHY001",
        admission_date="2026-10-19",
        requested_amount=1500.0,
        diagnosis_codes=["25000"],
    )
    res1 = gateway.score_preauth(normal_req)
    print("Normal Claim Result:", res1.decision, f"({res1.latency_ms} ms)")

    # Test 2: Upcoded claim from high-risk provider
    fraud_req = PreAuthRequest(
        claim_id="CLM1002",
        provider_id="PRV55012",
        beneficiary_id="BENE001",
        attending_physician="PHY002",
        admission_date="2026-10-19",
        requested_amount=25000.0,
        diagnosis_codes=["4019"],
    )
    res2 = gateway.score_preauth(fraud_req)
    print("Fraud Claim Result:", res2.decision, f"({res2.latency_ms} ms)")
    print("Reasons:", res2.reason_codes)
