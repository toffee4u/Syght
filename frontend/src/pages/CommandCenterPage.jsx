import React from 'react';
import CommandCenter from '../components/CommandCenter';

export default function CommandCenterPage({
  cases,
  onInspectCase,
  onViewAllCases,
  onOpenDatasetStudio,
  onRunAuditWithSample,
}) {
  return (
    <main className="syght-page page-command-center" id="page-command">
      <CommandCenter
        cases={cases}
        onInspectCase={onInspectCase}
        onViewAllCases={onViewAllCases}
        onOpenDatasetStudio={onOpenDatasetStudio}
        onRunAuditWithSample={onRunAuditWithSample}
      />
    </main>
  );
}
