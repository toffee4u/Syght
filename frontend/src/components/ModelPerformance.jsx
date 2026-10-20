import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {
  IconLineChart,
  IconSparkles,
  IconLayers,
  IconCheckCircle,
  IconArrowUpRight,
} from './Icons';

export default function ModelPerformance({
  models,
  figures,
  onEnlargeFigure,
}) {
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);
  const chart4Ref = useRef(null);

  useEffect(() => {
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
              backgroundColor: 'rgba(0, 242, 254, 0.75)',
              borderColor: '#00f2fe',
              borderWidth: 1,
              borderRadius: 6,
            },
            {
              label: 'PR-AUC',
              data: [0.7418, 0.7290, 0.7185, 0.6850, 0.6720, 0.6350, 0.5890],
              backgroundColor: 'rgba(168, 85, 247, 0.75)',
              borderColor: '#a855f7',
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Space Grotesk', size: 11 } } },
          },
          scales: {
            y: { min: 0.5, max: 1.0, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
          },
        },
      });
    }

    // 2. ROC Curve Live Simulation
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
              borderColor: '#00f2fe',
              backgroundColor: 'rgba(0, 242, 254, 0.1)',
              fill: true,
              tension: 0.35,
              borderWidth: 2.5,
              pointRadius: 3,
            },
            {
              label: 'Random Guess (AUC 0.500)',
              data: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
              borderColor: 'rgba(255, 255, 255, 0.25)',
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
            legend: { labels: { color: '#94a3b8', font: { family: 'Space Grotesk', size: 11 } } },
          },
          scales: {
            y: { min: 0, max: 1.0, title: { display: true, text: 'True Positive Rate (Sensitivity)', color: '#64748b' }, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
            x: { title: { display: true, text: 'False Positive Rate (1 - Specificity)', color: '#64748b' }, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
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
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              fill: true,
              borderWidth: 2.5,
              tension: 0.3,
            },
            {
              label: 'Baseline Billing Heuristic',
              data: [8.2, 16.4, 32.5, 51.0, 64.2, 72.8, 81.0],
              borderColor: '#f59e0b',
              borderDash: [4, 4],
              borderWidth: 2,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Space Grotesk', size: 11 } } },
          },
          scales: {
            y: { title: { display: true, text: '% Fraud Dollars Captured', color: '#64748b' }, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
            x: { title: { display: true, text: 'Auditor Workload Bandwidth', color: '#64748b' }, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
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
              label: 'Total Expected Financial Loss ($M)',
              data: [28.4, 18.2, 12.1, 8.4, 5.2, 7.9, 14.6, 26.8, 48.0],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: true,
              borderWidth: 2.5,
              tension: 0.4,
              pointBackgroundColor: ['#ef4444', '#ef4444', '#ef4444', '#ef4444', '#00f2fe', '#ef4444', '#ef4444', '#ef4444', '#ef4444'],
              pointRadius: [3, 3, 3, 3, 8, 3, 3, 3, 3],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Space Grotesk', size: 11 } } },
          },
          scales: {
            y: { title: { display: true, text: 'Net Economic Cost ($ Millions)', color: '#64748b' }, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
            x: { title: { display: true, text: 'Decision Threshold (Optimal = 0.5364)', color: '#64748b' }, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
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
      {/* Header */}
      <div className="syght-page-header">
        <div className="page-header-title-box">
          <div className="syght-chip">
            <span className="chip-dot" />
            Empirical Validation Benchmark
          </div>
          <h1 className="syght-page-title">
            Model Benchmarks, Evaluation Curves & Research Artifacts
          </h1>
          <p className="syght-page-desc">
            Empirical comparison of 7 candidate model architectures trained with 5-fold stratified cross-validation. 
            Selected champion via the 1-Standard-Error rule balancing accuracy and deployment simplicity.
          </p>
        </div>
      </div>

      {/* 4 Interactive Real Charts Grid */}
      <div className="charts-2x2-grid">
        <div className="syght-panel chart-panel">
          <div className="syght-panel-header">
            <div className="panel-title-flex">
              <IconLineChart size={18} className="text-cyan-400" />
              <h4>Multi-Model ROC-AUC vs. PR-AUC</h4>
            </div>
            <span className="syght-chip">Cross-Validated</span>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
            <canvas ref={chart1Ref} />
          </div>
        </div>

        <div className="syght-panel chart-panel">
          <div className="syght-panel-header">
            <div className="panel-title-flex">
              <IconLineChart size={18} className="text-cyan-400" />
              <h4>Receiver Operating Characteristic (ROC)</h4>
            </div>
            <span className="syght-chip">AUC: 0.8724</span>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
            <canvas ref={chart2Ref} />
          </div>
        </div>

        <div className="syght-panel chart-panel">
          <div className="syght-panel-header">
            <div className="panel-title-flex">
              <IconLineChart size={18} className="text-emerald-400" />
              <h4>Operational Queue Cumulative Fraud Capture</h4>
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
              <IconLineChart size={18} className="text-rose-400" />
              <h4>Threshold Cost-Loss Function Minimization</h4>
            </div>
            <span className="syght-chip font-mono">T* = 0.5364</span>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
            <canvas ref={chart4Ref} />
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison Table */}
      <section className="syght-panel" style={{ marginTop: '1.5rem' }}>
        <div className="syght-panel-header">
          <div className="panel-title-flex">
            <IconLayers size={20} className="text-cyan-400" />
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
                  <td className="font-mono font-bold text-neutral-100">{m.rocAuc.toFixed(4)}</td>
                  <td className="font-mono text-neutral-200">{m.prAuc.toFixed(4)}</td>
                  <td className="font-mono text-neutral-300">{m.f1.toFixed(4)}</td>
                  <td className="font-mono text-neutral-300">{(m.recall * 100).toFixed(1)}%</td>
                  <td className="font-mono text-neutral-300">{(m.precision * 100).toFixed(1)}%</td>
                  <td className="font-mono text-neutral-300">{m.latency}</td>
                  <td className="font-mono text-neutral-300">{m.size}</td>
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

      {/* Generated Figure Artifacts Gallery */}
      <section className="syght-panel" style={{ marginTop: '1.5rem' }}>
        <div className="syght-panel-header">
          <div className="panel-title-flex">
            <IconSparkles size={20} className="text-cyan-400" />
            <h3>Official Research Figure Artifacts Gallery</h3>
          </div>
          <span className="syght-chip">High-Resolution Reports</span>
        </div>

        <div className="figure-cards-grid">
          {figures.map((fig) => (
            <div
              key={fig.id}
              className="figure-card"
              onClick={() => onEnlargeFigure(fig)}
            >
              <div className="figure-thumb-wrapper">
                <img
                  src={fig.src}
                  alt={fig.title}
                  onError={(e) => { e.target.src = fig.fallbackSrc; }}
                  className="figure-thumb-img"
                />
                <div className="figure-overlay-hover">
                  <IconArrowUpRight size={24} className="figure-zoom-icon" />
                  <span>Click to Inspect High-Res</span>
                </div>
              </div>
              <div className="figure-meta-bar">
                <div className="figure-title-bold font-mono">{fig.title}</div>
                <div className="figure-desc-sub">{fig.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
