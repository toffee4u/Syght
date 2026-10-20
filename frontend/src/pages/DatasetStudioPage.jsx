import React from 'react';
import DatasetStudio from '../components/DatasetStudio';

export default function DatasetStudioPage({
  onInspectCase,
  onShowToast,
  onRunComplete,
}) {
  return (
    <main className="syght-page page-dataset-studio" id="page-dataset">
      <DatasetStudio
        onInspectCase={onInspectCase}
        onShowToast={onShowToast}
        onRunComplete={onRunComplete}
      />
    </main>
  );
}
