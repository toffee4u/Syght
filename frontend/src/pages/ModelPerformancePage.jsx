import React from 'react';
import ModelPerformance from '../components/ModelPerformance';

export default function ModelPerformancePage({ models }) {
  return (
    <main className="syght-page page-model-performance" id="page-benchmarks">
      <ModelPerformance models={models} />
    </main>
  );
}
