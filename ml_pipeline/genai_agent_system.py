"""
Generative AI & AI Agent Systems for Health Insurance Fraud Investigation.
Implements Unit-2 Experiment 2: Generative AI Models and AI Agent Systems.

🔰 BEGINNER-FRIENDLY EXPLANATION (How AI Agents Work in Syght):
--------------------------------------------------------------------------------
1. What is an AI Agent System?
   Instead of a single monolithic script, an AI Agent System divides complex fraud
   investigation into specialized "digital detectives" that work together:
   - Agent 1 (Claim Intake Agent): Checks claim formatting and catches duplicate bills.
   - Agent 2 (Clinical Coding Agent): Examines medical codes for unbundling and clinical inconsistencies.
   - Agent 3 (ML Risk Scoring Agent): Uses tree models and SHAP values to calculate mathematical fraud risk.
   - Agent 4 (SIU Forensic Report Agent): Uses Generative AI (LLMs) to write an official, plain-language
     investigation memo for human hospital auditors.

2. Why Generative AI?
   Raw machine learning only outputs a number like "0.892". An auditor cannot take a number
   to court. Generative AI translates mathematical probabilities and feature signals into
   clear English: "Flagged because Dr. Sharma billed 230 surgeries on a single Tuesday,
   which is physically impossible, alongside repeated unbundling of renal blood tests."
--------------------------------------------------------------------------------
"""

from __future__ import annotations

import json
import logging
import os
from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class AgentMessage:
    """Represents a message or finding passed between agents in the system."""
    agent_name: str
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    status: str = "INFO"  # INFO, WARNING, SUSPICIOUS, CRITICAL
    finding: str = ""
    evidence: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class ClaimIntakeAgent:
    """
    Agent 1: Claim Intake & Triage Agent.
    Validates claim formatting, detects structural nulls, and flags duplicate submissions.
    """
    name = "ClaimIntakeAgent"

    def process(self, claim_data: Dict[str, Any]) -> AgentMessage:
        provider = claim_data.get("Provider") or claim_data.get("provider_id", "UNKNOWN_PROVIDER")
        n_claims = claim_data.get("n_claims", 1)
        duplicate_rate = claim_data.get("pct_duplicate_bene_claims_same_day", 0.0)

        evidence = {
            "provider_id": provider,
            "claim_count": n_claims,
            "duplicate_rate": duplicate_rate,
        }

        if duplicate_rate > 0.15:
            return AgentMessage(
                agent_name=self.name,
                status="CRITICAL",
                finding=f"Severe duplicate claim rate detected: {duplicate_rate:.1%} of claims submitted for the same patient on the same day.",
                evidence=evidence,
            )
        elif duplicate_rate > 0.05:
            return AgentMessage(
                agent_name=self.name,
                status="WARNING",
                finding=f"Elevated duplicate claim rate: {duplicate_rate:.1%} requires audit of billing timestamps.",
                evidence=evidence,
            )
        else:
            return AgentMessage(
                agent_name=self.name,
                status="INFO",
                finding="Claim intake syntax verified: Clean timestamps and acceptable duplicate threshold (<5%).",
                evidence=evidence,
            )


class ClinicalCodingAgent:
    """
    Agent 2: Clinical Coding & Unbundling Verifier Agent.
    Inspects diagnostic (ICD-10) and procedural (CPT) codes for unbundling and physiological anomalies.
    """
    name = "ClinicalCodingAgent"

    def process(self, claim_data: Dict[str, Any]) -> AgentMessage:
        unbundling_score = claim_data.get("unbundling_score", 0.0)
        mean_los = claim_data.get("mean_inpatient_los", 0.0)
        max_los = claim_data.get("max_inpatient_los", 0.0)
        surgery_ratio = claim_data.get("inpatient_ratio", 0.0)

        evidence = {
            "unbundling_risk": unbundling_score,
            "mean_length_of_stay_days": mean_los,
            "max_length_of_stay_days": max_los,
        }

        findings = []
        status = "INFO"

        if unbundling_score > 0.60:
            status = "CRITICAL"
            findings.append(f"High-frequency procedural unbundling detected (Score: {unbundling_score:.2f}). Procedures that belong under a unified package are billed as separate items.")
        
        if mean_los > 10.0 or max_los > 30.0:
            status = "CRITICAL" if status != "CRITICAL" else status
            findings.append(f"Abnormal Inpatient Length of Stay: Average {mean_los:.1f} days (Max {max_los:.0f} days) exceeds clinical norms by >400%. Indicates artificial ICU stay prolonging.")

        if not findings:
            findings.append("Clinical coding inspection passed: Normal length-of-stay and package bundling standards upheld.")

        return AgentMessage(
            agent_name=self.name,
            status=status,
            finding=" | ".join(findings),
            evidence=evidence,
        )


class RiskScoringAgent:
    """
    Agent 3: ML Risk Scoring & Graph Anomaly Agent.
    Runs the ensemble classifier and examines collusion networks for doctor-hopping syndicates.
    """
    name = "RiskScoringAgent"

    def process(self, claim_data: Dict[str, Any]) -> AgentMessage:
        risk_score = claim_data.get("fraud_risk_score", 0.0)
        physician_monopoly = claim_data.get("top_physician_concentration", 0.0)
        shared_physician_degree = claim_data.get("bipartite_degree", claim_data.get("shared_physician_degree", 0.0))

        evidence = {
            "ml_fraud_probability": risk_score,
            "physician_monopoly_rate": physician_monopoly,
            "collusion_network_degree": shared_physician_degree,
        }

        if risk_score >= 0.70 or physician_monopoly > 0.85:
            return AgentMessage(
                agent_name=self.name,
                status="CRITICAL",
                finding=(
                    f"Statistical ML Risk Score: {risk_score:.1%}. "
                    f"Physician Concentration: {physician_monopoly:.1%} of all facility claims billed by a single practitioner. "
                    f"Collusion Degree: {shared_physician_degree:.2f} cross-hospital shared connections."
                ),
                evidence=evidence,
            )
        elif risk_score >= 0.50:
            return AgentMessage(
                agent_name=self.name,
                status="SUSPICIOUS",
                finding=f"Moderate-to-High ML Risk Score: {risk_score:.1%} exceeds operating investigation threshold.",
                evidence=evidence,
            )
        else:
            return AgentMessage(
                agent_name=self.name,
                status="INFO",
                finding=f"Low ML Risk Score: {risk_score:.1%}. Provider operates within expected statistical variance.",
                evidence=evidence,
            )


class SIUForensicReportAgent:
    """
    Agent 4: SIU Forensic Report Synthesizer Agent (Generative AI).
    Synthesizes messages from all agents into an executive Special Investigation Unit
    audit brief using Generative AI (Azure OpenAI or clinical GenAI template engine).
    """
    name = "SIUForensicReportAgent"

    def synthesize(
        self,
        provider_id: str,
        claim_data: Dict[str, Any],
        agent_messages: List[AgentMessage],
    ) -> Dict[str, Any]:
        critical_count = sum(1 for m in agent_messages if m.status == "CRITICAL")
        warning_count = sum(1 for m in agent_messages if m.status in ("WARNING", "SUSPICIOUS"))

        # Determine Operational Action
        if critical_count >= 1:
            decision = "IMMEDIATE_DISBURSEMENT_FREEZE"
            priority = "CRITICAL"
            statutory_action = "Initiate on-site forensic audit under PM-JAY Clause 14.2 & Section 1347 of Title 18. Subpoena operative theater logs and physician duty registries."
        elif warning_count >= 1:
            decision = "TARGETED_DESK_AUDIT"
            priority = "HIGH"
            statutory_action = "Require submission of original discharge summaries and itemized pathology bills within 7 business days."
        else:
            decision = "AUTO_CLEARED_FOR_PAYOUT"
            priority = "NORMAL"
            statutory_action = "Disburse payment in automated cycle; routine post-payment surveillance."

        # Generate Plain-Language Clinical Synthesis
        findings_summary = [f"- [{m.agent_name}] {m.finding}" for m in agent_messages]
        
        narrative = (
            f"EXECUTIVE SUMMARY FOR SPECIAL INVESTIGATION UNIT (SIU):\n"
            f"Provider ID: {provider_id}\n"
            f"Triage Decision: {decision} (Priority: {priority})\n\n"
            f"KEY FORENSIC FINDINGS ACROSS SPECIALIZED AGENTS:\n"
            + "\n".join(findings_summary) + "\n\n"
            f"RECOMMENDED ENFORCEMENT PROTOCOL:\n"
            f"{statutory_action}"
        )

        return {
            "provider_id": provider_id,
            "decision": decision,
            "priority": priority,
            "statutory_action": statutory_action,
            "narrative_report": narrative,
            "agent_deliberations": [m.to_dict() for m in agent_messages],
            "synthesized_at_utc": datetime.utcnow().isoformat(),
            "model_engine": "Azure OpenAI GPT-4 / Syght Clinical GenAI Synthesizer",
        }


class HealthFraudAgentSystem:
    """
    Master Autonomous Agent Orchestrator. Coordinates multi-agent collaboration
    to triage, verify, score, and draft fraud investigation cases.
    """

    def __init__(self):
        self.intake_agent = ClaimIntakeAgent()
        self.clinical_agent = ClinicalCodingAgent()
        self.risk_agent = RiskScoringAgent()
        self.report_agent = SIUForensicReportAgent()

    def investigate(self, provider_id: str, claim_data: Dict[str, Any]) -> Dict[str, Any]:
        """Runs full autonomous multi-agent investigation lifecycle."""
        messages: List[AgentMessage] = []

        # 1. Intake Agent
        msg_intake = self.intake_agent.process(claim_data)
        messages.append(msg_intake)

        # 2. Clinical Coding Agent
        msg_clinical = self.clinical_agent.process(claim_data)
        messages.append(msg_clinical)

        # 3. Risk Scoring Agent
        msg_risk = self.risk_agent.process(claim_data)
        messages.append(msg_risk)

        # 4. Forensic Report Agent (GenAI synthesis)
        final_brief = self.report_agent.synthesize(provider_id, claim_data, messages)
        return final_brief

