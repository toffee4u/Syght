import React from 'react';
import ClaimAnalyzer from '../components/ClaimAnalyzer';

export default function ClaimAnalyzerPage({
  benchmarkCases,
  selectedCaseId,
  onCaseSelected,
  onShowToast,
}) {
  return (
    <main className="syght-page page-claim-analyzer" id="page-analyzer">
      <ClaimAnalyzer
        benchmarkCases={benchmarkCases}
        selectedCaseId={selectedCaseId}
        onCaseSelected={onCaseSelected}
        onShowToast={onShowToast}
      />
    </main>
  );
}
