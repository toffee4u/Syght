import React from 'react';
import BatchAuditResults from '../components/BatchAuditResults';

export default function BatchAuditResultsPage({
  resultsData,
  pipelineExecutionTrigger,
  onClearExecutionTrigger,
  onInspectCase,
  onOpenDatasetStudio,
  onRunAuditWithSample,
  onRunAuditWithPortfolio,
  onSaveAuditResults,
  onShowToast,
}) {
  return (
    <div className="syght-page page-batch-results" id="page-results">
      <BatchAuditResults
        resultsData={resultsData}
        pipelineExecutionTrigger={pipelineExecutionTrigger}
        onClearExecutionTrigger={onClearExecutionTrigger}
        onInspectCase={onInspectCase}
        onOpenDatasetStudio={onOpenDatasetStudio}
        onRunAuditWithSample={onRunAuditWithSample}
        onRunAuditWithPortfolio={onRunAuditWithPortfolio}
        onSaveAuditResults={onSaveAuditResults}
        onShowToast={onShowToast}
      />
    </div>
  );
}
