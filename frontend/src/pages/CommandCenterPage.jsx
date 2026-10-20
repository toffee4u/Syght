import React from 'react';
import CommandCenter from '../components/CommandCenter';

export default function CommandCenterPage({
  cases,
  onInspectCase,
  onTriageAction,
  onViewAllCases,
  onOpenDatasetStudio,
  onRunAuditWithSample,
}) {
  return (
    <div className="syght-page page-command-center" id="page-command">
      <CommandCenter
        cases={cases}
        onInspectCase={onInspectCase}
        onTriageAction={onTriageAction}
        onViewAllCases={onViewAllCases}
        onOpenDatasetStudio={onOpenDatasetStudio}
        onRunAuditWithSample={onRunAuditWithSample}
      />
    </div>
  );
}
