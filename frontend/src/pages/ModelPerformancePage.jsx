import React from 'react';
import ModelPerformance from '../components/ModelPerformance';

export default function ModelPerformancePage({ models }) {
  return (
    <div className="syght-page page-model-performance" id="page-benchmarks">
      <ModelPerformance models={models} />
    </div>
  );
}
