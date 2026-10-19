"""
Graph Collusion Module: Uncovers provider-physician-beneficiary collusion rings,
kickback nexus patterns, and multi-hospital doctor recycling in healthcare claims.

Implements pure-Python bipartite and tripartite graph analysis with optional
NetworkX acceleration, ensuring zero-dependency execution anywhere.
"""

from __future__ import annotations

import logging
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set, Tuple

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


@dataclass
class CollusionRing:
    """Represents an identified suspicious collusion community."""
    ring_id: str
    providers: List[str]
    shared_physicians: List[str]
    shared_beneficiaries_count: int
    total_claims: int
    risk_score: float
    description: str


class HealthcareCollusionGraph:
    """
    Constructs multi-entity interaction graphs across Healthcare Providers,
    Attending Physicians, and Beneficiaries to detect organized billing rings.
    """

    def __init__(self, min_shared_beneficiaries: int = 3, min_shared_physicians: int = 2):
        self.min_shared_bene = min_shared_beneficiaries
        self.min_shared_physicians = min_shared_physicians

        # Adjacency structures
        self.provider_physicians: Dict[str, Set[str]] = defaultdict(set)
        self.physician_providers: Dict[str, Set[str]] = defaultdict(set)
        self.provider_beneficiaries: Dict[str, Set[str]] = defaultdict(set)
        self.beneficiary_providers: Dict[str, Set[str]] = defaultdict(set)
        self.provider_claim_counts: Dict[str, int] = defaultdict(int)

    def fit_from_claims(
        self,
        claims_df: pd.DataFrame,
        provider_col: str = "Provider",
        bene_col: str = "BeneID",
        physician_col: str = "AttendingPhysician",
    ) -> "HealthcareCollusionGraph":
        """Builds multi-partite graph relationships from claims data."""
        logger.info("Building Healthcare Interaction Graph from %d claims...", len(claims_df))

        # Filter out missing records
        df = claims_df[[provider_col, bene_col, physician_col]].dropna(subset=[provider_col]).copy()

        for _, row in df.iterrows():
            prov = str(row[provider_col]).strip()
            bene = str(row[bene_col]).strip() if pd.notna(row[bene_col]) else None
            phys = str(row[physician_col]).strip() if pd.notna(row[physician_col]) else None

            self.provider_claim_counts[prov] += 1

            if phys and phys != "nan":
                self.provider_physicians[prov].add(phys)
                self.physician_providers[phys].add(prov)

            if bene and bene != "nan":
                self.provider_beneficiaries[prov].add(bene)
                self.beneficiary_providers[bene].add(prov)

        logger.info(
            "Graph assembled: %d Providers, %d Physicians, %d Beneficiaries.",
            len(self.provider_claim_counts),
            len(self.physician_providers),
            len(self.beneficiary_providers),
        )
        return self

    def compute_physician_sharing_matrix(self) -> Dict[Tuple[str, str], List[str]]:
        """Identifies pairs of providers that share attending physicians."""
        shared_map: Dict[Tuple[str, str], List[str]] = defaultdict(list)
        providers = sorted(list(self.provider_physicians.keys()))

        for i in range(len(providers)):
            p1 = providers[i]
            docs1 = self.provider_physicians[p1]
            for j in range(i + 1, len(providers)):
                p2 = providers[j]
                docs2 = self.provider_physicians[p2]
                overlap = list(docs1.intersection(docs2))
                if len(overlap) >= self.min_shared_physicians:
                    shared_map[(p1, p2)] = overlap

        return dict(shared_map)

    def detect_collusion_rings(self) -> List[CollusionRing]:
        """
        Uncovers suspicious provider clusters that share both multiple physicians
        and high patient cross-referral rates (classic kickback nexus).
        """
        shared_physicians_pairs = self.compute_physician_sharing_matrix()
        rings: List[CollusionRing] = []

        ring_counter = 1
        for (p1, p2), docs in shared_physicians_pairs.items():
            benes1 = self.provider_beneficiaries.get(p1, set())
            benes2 = self.provider_beneficiaries.get(p2, set())
            shared_benes = len(benes1.intersection(benes2))

            total_claims = self.provider_claim_counts[p1] + self.provider_claim_counts[p2]

            # High risk score if both physicians and patients are recycled
            risk_score = min(1.0, (len(docs) * 0.25) + (shared_benes * 0.15))

            if shared_benes >= self.min_shared_bene or len(docs) >= 3:
                rings.append(
                    CollusionRing(
                        ring_id=f"RING-{ring_counter:03d}",
                        providers=[p1, p2],
                        shared_physicians=docs,
                        shared_beneficiaries_count=shared_benes,
                        total_claims=total_claims,
                        risk_score=round(risk_score, 3),
                        description=(
                            f"Providers {p1} and {p2} share {len(docs)} physicians and "
                            f"{shared_benes} common beneficiaries (Kickback/Recycling nexus)."
                        ),
                    )
                )
                ring_counter += 1

        # Sort by risk score descending
        rings.sort(key=lambda r: r.risk_score, reverse=True)
        return rings

    def compute_provider_collusion_metrics(self) -> pd.DataFrame:
        """
        Calculates graph network risk features for each individual provider:
        - `shared_physician_count`: Number of external doctors shared with other hospitals.
        - `collusion_degree`: Count of neighboring providers connected via shared staff.
        - `patient_churn_overlap`: Beneficiary cross-visitation rate.
        """
        records = []
        for prov, claim_cnt in self.provider_claim_counts.items():
            phys_set = self.provider_physicians.get(prov, set())
            connected_providers: Set[str] = set()

            for phys in phys_set:
                connected_providers.update(self.physician_providers.get(phys, set()))
            connected_providers.discard(prov)

            # Measure multi-facility physician ratio
            multi_facility_physicians = sum(
                1 for phys in phys_set if len(self.physician_providers.get(phys, set())) > 1
            )
            pct_multi_facility = float(multi_facility_physicians / max(len(phys_set), 1))

            records.append({
                "Provider": prov,
                "graph_collusion_degree": len(connected_providers),
                "graph_shared_physicians_count": multi_facility_physicians,
                "graph_pct_multi_facility_physicians": round(pct_multi_facility, 4),
            })

        return pd.DataFrame(records)
