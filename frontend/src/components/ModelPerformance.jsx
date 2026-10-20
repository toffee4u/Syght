import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {
  IconLineChart,
  IconLayers,
  IconCheckCircle,
} from './Icons';

export default function ModelPerformance({ models }) {
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);
  const chart4Ref = useRef(null);

  useEffect(() => {
    // Common Light Theme Chart.js options
    const commonScales = {
      gridColor: 'rgba(0, 0, 0, 0.06)',
      tickColor: '#64748b',
      titleColor: '#0f172a',
    };

    // 1. Multi-Model ROC vs PR Chart
    let chart1 = null;
    if (chart1Ref.current) {
      chart1 = new Chart(chart1Ref.current, {
        type: 'bar',
        data: {
          labels: ['LightGBM', 'XGBoost', 'CatBoost', 'RandomForest', 'ExtraTrees', 'AdaBoost', 'LogisticReg'],
          datasets: [
            {
              label: 'ROC-AUC',
              data: [0.8724, 0.8651, 0.8590, 0.8415, 0.8350, 0.8120, 0.7810],
              backgroundColor: 'rgba(2, 132, 199, 0.85)',
              borderColor: '#0284c7',
              borderWidth: 1,
              borderRadius: 6,
            },
            {
              label: 'PR-AUC',
              data: [0.7418, 0.7290, 0.7185, 0.6850, 0.6720, 0.6350, 0.5890],
              backgroundColor: 'rgba(124, 58, 237, 0.85)',
              borderColor: '#7c3aed',
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#1e293b',
                font: { family: 'Space Grotesk', size: 12, weight: '500' },
                padding: 16,
              },
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleFont: { family: 'Space Grotesk', weight: '600' },
              padding: 10,
              cornerRadius: 8,
            },
          },
          scales: {
            y: {
              min: 0.5,
              max: 1.0,
              grid: { color: commonScales.gridColor },
              ticks: { color: commonScales.tickColor, font: { family: 'JetBrains Mono', size: 11 } },
            },
            x: {
              grid: { display: false },
              ticks: { color: commonScales.tickColor, font: { family: 'Space Grotesk', size: 11 } },
            },
          },
        },
      });
    }

    // 2. ROC Curve
    let chart2 = null;
    if (chart2Ref.current) {
      chart2 = new Chart(chart2Ref.current, {
        type: 'line',
        data: {
          labels: ['0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'],
          datasets: [
            {
              label: 'LightGBM Champion (AUC 0.872)',
              data: [0.0, 0.58, 0.74, 0.83, 0.88, 0.92, 0.95, 0.97, 0.99, 1.0, 1.0],
              borderColor: '#0284c7',
              backgroundColor: 'rgba(2, 132, 199, 0.08)',
              fill: true,
              tension: 0.35,
              borderWidth: 2.5,
              pointRadius: 3,
              pointBackgroundColor: '#0284c7',
            },
            {
              label: 'Random Baseline (AUC 0.500)',
              data: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
              borderColor: 'rgba(100, 116, 139, 0.4)',
              borderDash: [5, 5],
              borderWidth: 1.5,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#1e293b',
                font: { family: 'Space Grotesk', size: 12, weight: '500' },
                padding: 16,
              },
            },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 10,
              cornerRadius: 8,
            },
          },
          scales: {
            y: {
              min: 0,
              max: 1.0,
              title: { display: true, text: 'True Positive Rate (Sensitivity)', color: commonScales.titleColor, font: { weight: '600' } },
              grid: { color: commonScales.gridColor },
              ticks: { color: commonScales.tickColor, font: { family: 'JetBrains Mono', size: 11 } },
            },
            x: {
              title: { display: true, text: 'False Positive Rate (1 - Specificity)', color: commonScales.titleColor, font: { weight: '600' } },
              grid: { color: commonScales.gridColor },
              ticks: { color: commonScales.tickColor, font: { family: 'JetBrains Mono', size: 11 } },
            },
          },
        },
      });
    }

    // 3. Operational Queue Lift
    let chart3 = null;
    if (chart3Ref.current) {
      chart3 = new Chart(chart3Ref.current, {
        type: 'line',
        data: {
          labels: ['Top 1%', 'Top 2%', 'Top 5%', 'Top 10%', 'Top 15%', 'Top 20%', 'Top 30%'],
          datasets: [
            {
              label: 'Syght Production LightGBM',
              data: [34.5, 52.1, 74.8, 89.2, 94.1, 97.0, 99.2],
              borderColor: '#059669',
              backgroundColor: 'rgba(5, 150, 105, 0.08)',
              fill: true,
              borderWidth: 2.5,
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: '#059669',
            },
            {
              label: 'Baseline Billing Heuristic',
              data: [8.2, 16.4, 32.5, 51.0, 64.2, 72.8, 81.0],
              borderColor: '#d97706',
              borderDash: [4, 4],
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#1e293b',
                font: { family: 'Space Grotesk', size: 12, weight: '500' },
                padding: 16,
              },
            },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 10,
              cornerRadius: 8,
            },
          },
          scales: {
            y: {
              title: { display: true, text: '% Fraud Exposure Captured (₹)', color: commonScales.titleColor, font: { weight: '600' } },
              grid: { color: commonScales.gridColor },
              ticks: { color: commonScales.tickColor, font: { family: 'JetBrains Mono', size: 11 } },
            },
            x: {
              title: { display: true, text: 'Auditor Workload Bandwidth', color: commonScales.titleColor, font: { weight: '600' } },
              grid: { color: commonScales.gridColor },
              ticks: { color: commonScales.tickColor, font: { family: 'Space Grotesk', size: 11 } },
            },
          },
        },
      });
    }

    // 4. Threshold Economic Loss Curve
    let chart4 = null;
    if (chart4Ref.current) {
      chart4 = new Chart(chart4Ref.current, {
        type: 'line',
        data: {
          labels: ['0.1', '0.2', '0.3', '0.4', '0.536', '0.6', '0.7', '0.8', '0.9'],
          datasets: [
            {
              label: 'Total Expected Financial Loss (₹M)',
              data: [28.4, 18.2, 12.1, 8.4, 5.2, 7.9, 14.6, 26.8, 48.0],
              borderColor: '#e11d48',
              backgroundColor: 'rgba(225, 29, 72, 0.08)',
              fill: true,
              borderWidth: 2.5,
              tension: 0.4,
              pointBackgroundColor: ['#e11d48', '#e11d48', '#e11d48', '#e11d48', '#0284c7', '#e11d48', '#e11d48', '#e11d48', '#e11d48'],
              pointRadius: [3, 3, 3, 3, 7, 3, 3, 3, 3],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#1e293b',
                font: { family: 'Space Grotesk', size: 12, weight: '500' },
                padding: 16,
              },
            },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 10,
              cornerRadius: 8,
            },
          },
          scales: {
            y: {
              title: { display: true, text: 'Net Economic Cost (₹ Millions)', color: commonScales.titleColor, font: { weight: '600' } },
              grid: { color: commonScales.gridColor },
              ticks: { color: commonScales.tickColor, font: { family: 'JetBrains Mono', size: 11 } },
            },
            x: {
              title: { display: true, text: 'Decision Threshold (Optimal = 0.5364)', color: commonScales.titleColor, font: { weight: '600' } },
              grid: { color: commonScales.gridColor },
              ticks: { color: commonScales.tickColor, font: { family: 'JetBrains Mono', size: 11 } },
            },
          },
        },
      });
    }

    return () => {
      if (chart1) chart1.destroy();
      if (chart2) chart2.destroy();
      if (chart3) chart3.destroy();
      if (chart4) chart4.destroy();
    };
  }, []);

  return (
    <div className="tab-view active syght-view">
      <div className="syght-page-header">
        <div>
          <div className="syght-chip">
            <span className="chip-dot" />
            Empirical Validation Suite
          </div>
          <h1 className="syght-page-title">Model Performance & Econometric Curves</h1>
          <p className="syght-page-desc">
            Rigorous 5-fold stratified cross-validation benchmarks comparing 7 machine learning architectures 
            evaluated strictly under class-imbalanced PR-AUC and cost-sensitive loss curves.
          </p>
        </div>
      </div>

      {/* 2x2 Clean Modern Analytics Grid */}
      <div className="charts-2x2-grid">
        <div className="syght-panel chart-panel">
          <div className="syght-panel-header">
            <div className="panel-title-flex">
              <IconLineChart size={18} className="text-sky-600" />
              <h4>Architectural Benchmark Comparison</h4>
            </div>
            <span className="syght-chip">ROC vs PR AUC</span>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
            <canvas ref={chart1Ref} />
          </div>
        </div>

        <div className="syght-panel chart-panel">
          <div className="syght-panel-header">
            <div className="panel-title-flex">
              <IconLineChart size={18} className="text-violet-600" />
              <h4>Receiver Operating Characteristic (ROC)</h4>
            </div>
            <span className="syght-chip font-mono">AUC = 0.8724</span>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
            <canvas ref={chart2Ref} />
          </div>
        </div>

        <div className="syght-panel chart-panel">
          <div className="syght-panel-header">
            <div className="panel-title-flex">
              <IconLineChart size={18} className="text-emerald-600" />
              <h4>Investigator Top-K Operational Queue Lift</h4>
            </div>
            <span className="syght-chip">Top-5% Lift: 74.8%</span>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
            <canvas ref={chart3Ref} />
          </div>
        </div>

        <div className="syght-panel chart-panel">
          <div className="syght-panel-header">
            <div className="panel-title-flex">
              <IconLineChart size={18} className="text-rose-600" />
              <h4>Cost-Sensitive Loss Minimization</h4>
            </div>
            <span className="syght-chip font-mono">Optimal T* = 0.5364</span>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
            <canvas ref={chart4Ref} />
          </div>
        </div>
      </div>

      {/* 7-Model Architectural Benchmark Suite Table */}
      <section className="syght-panel" style={{ marginTop: '1.5rem' }}>
        <div className="syght-panel-header">
          <div className="panel-title-flex">
            <IconLayers size={20} className="text-sky-600" />
            <h3>7-Model Architectural Benchmark Suite</h3>
          </div>
          <span className="syght-chip">5-Fold Stratified Provider CV</span>
        </div>

        <div className="table-responsive-wrapper">
          <table className="syght-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>ROC-AUC</th>
                <th>PR-AUC</th>
                <th>F1-Score</th>
                <th>Recall</th>
                <th>Precision</th>
                <th>Latency</th>
                <th>Bundle Size</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.name} className={m.isChampion ? 'is-champion-row' : ''}>
                  <td>
                    <div className="provider-cell">
                      <span className="provider-id-tag font-mono">{m.name}</span>
                      <span className="provider-sub-tag">{m.strengths}</span>
                    </div>
                  </td>
                  <td className="font-mono font-bold text-slate-900">{m.rocAuc.toFixed(4)}</td>
                  <td className="font-mono font-semibold text-sky-700">{m.prAuc.toFixed(4)}</td>
                  <td className="font-mono text-slate-700">{m.f1.toFixed(4)}</td>
                  <td className="font-mono text-slate-700">{(m.recall * 100).toFixed(1)}%</td>
                  <td className="font-mono text-slate-700">{(m.precision * 100).toFixed(1)}%</td>
                  <td className="font-mono text-slate-600">{m.latency}</td>
                  <td className="font-mono text-slate-600">{m.size}</td>
                  <td>
                    {m.isChampion ? (
                      <span className="status-tag tag-champion font-mono">
                        <IconCheckCircle size={12} className="inline mr-1" /> CHAMPION
                      </span>
                    ) : (
                      <span className="status-tag tag-review font-mono">Evaluated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
