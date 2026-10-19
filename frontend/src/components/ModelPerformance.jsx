import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { 
  LineChart, 
  Trophy, 
  Award, 
  BarChart3, 
  PieChart, 
  Layers, 
  TrendingUp, 
  Maximize2, 
  Image as ImageIcon 
} from 'lucide-react';

export default function ModelPerformance({ 
  models, 
  figures, 
  onEnlargeFigure 
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
              borderRadius: 4
            },
            {
              label: 'PR-AUC',
              data: [0.7418, 0.7290, 0.7185, 0.6850, 0.6720, 0.6350, 0.5890],
              backgroundColor: 'rgba(168, 85, 247, 0.75)',
              borderColor: '#a855f7',
              borderWidth: 1,
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } } }
          },
          scales: {
            y: { min: 0.5, max: 1.0, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    // 2. Evaluation Trade-off Dashboard Radar/Bar
    let chart2 = null;
    if (chart2Ref.current) {
      chart2 = new Chart(chart2Ref.current, {
        type: 'bar',
        data: {
          labels: ['ROC-AUC', 'PR-AUC', 'F1-Score', 'Recall', 'Precision'],
          datasets: [
            {
              label: 'LightGBM Champion',
              data: [87.2, 74.2, 71.8, 73.5, 70.2],
              backgroundColor: [
                'rgba(0, 242, 254, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(56, 189, 248, 0.8)'
              ],
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { min: 50, max: 100, ticks: { callback: v => `${v}%`, color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    // 3. Feature Importances Chart
    let chart3 = null;
    if (chart3Ref.current) {
      chart3 = new Chart(chart3Ref.current, {
        type: 'bar',
        data: {
          labels: [
            'inpatient_reimbursed_sum',
            'mean_inpatient_los',
            'same_day_duplicate_rate',
            'claims_per_attending_ratio',
            'total_inpatient_surgeries',
            'graph_degree_centrality',
            'unique_attending_physicians',
            'max_inpatient_los'
          ],
          datasets: [
            {
              label: 'Mean Absolute SHAP Value',
              data: [0.38, 0.34, 0.29, 0.24, 0.21, 0.18, 0.14, 0.11],
              backgroundColor: 'rgba(0, 242, 254, 0.7)',
              borderColor: '#00f2fe',
              borderWidth: 1,
              borderRadius: 4
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { family: 'JetBrains Mono', size: 10 } } }
          }
        }
      });
    }

    // 4. Operational Recovery Lift Chart
    let chart4 = null;
    if (chart4Ref.current) {
      chart4 = new Chart(chart4Ref.current, {
        type: 'line',
        data: {
          labels: ['Top 5%', 'Top 10%', 'Top 15%', 'Top 20%', 'Top 30%', 'Top 50%', '100%'],
          datasets: [
            {
              label: 'Syght Cumulative Recovery ($M)',
              data: [28.4, 38.6, 42.1, 45.9, 47.8, 49.2, 50.1],
              borderColor: '#00f2fe',
              backgroundColor: 'rgba(0, 242, 254, 0.15)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#00f2fe',
              pointRadius: 4
            },
            {
              label: 'Random Audit Baseline ($M)',
              data: [2.5, 5.0, 7.5, 10.0, 15.0, 25.0, 50.1],
              borderColor: '#64748b',
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } } }
          },
          scales: {
            y: { ticks: { callback: v => `$${v}M`, color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
          }
        }
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
    <div className="tab-view active">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LineChart size={26} className="text-accent" strokeWidth={1.8} />
            Model Performance & Statistical Benchmark Audit
          </h1>
          <p className="page-description">
            Complete empirical benchmarks across 9 algorithms, cross-validation metrics, 
            calibrated thresholds, and financial clawback lift projections.
          </p>
        </div>
      </div>

      {/* Hero Benchmark Metric Cards */}
      <div className="performance-hero-panel">
        <div className="hero-stat">
          <span className="hero-label">PRODUCTION CHAMPION</span>
          <span className="hero-val glow-cyan">LightGBM</span>
          <span className="hero-sub">Calibrated Probability Engine</span>
        </div>
        <div className="hero-stat">
          <span className="hero-label">CROSS-VALIDATION ROC-AUC</span>
          <span className="hero-val glow-emerald">0.8724</span>
          <span className="hero-sub">±0.014 across 5 Stratified Folds</span>
        </div>
        <div className="hero-stat">
          <span className="hero-label">PRECISION-RECALL AUC</span>
          <span className="hero-val glow-purple">0.7418</span>
          <span className="hero-sub">+29.9% higher than standard rules</span>
        </div>
        <div className="hero-stat">
          <span className="hero-label">OPTIMAL AUDIT THRESHOLD</span>
          <span className="hero-val">0.5364</span>
          <span className="hero-sub">Cost-Utility Maximized Frontier</span>
        </div>
        <div className="hero-stat">
          <span className="hero-label">SINGLE-PREDICT LATENCY</span>
          <span className="hero-val mono-text">1.84 ms</span>
          <span className="hero-sub">Real-Time Sub-5ms SLA</span>
        </div>
      </div>

      {/* 2x2 Interactive Chart Grid */}
      <div className="charts-2x2-grid" style={{ marginTop: '1.5rem' }}>
        <div className="dashboard-card">
          <div className="card-header-flex">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} className="text-accent" />
              1. Multi-Model ROC vs. PR Comparison
            </h3>
            <span className="badge badge-cyan">9-Model Benchmark</span>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
            <canvas ref={chart1Ref}></canvas>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header-flex">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={18} className="text-accent" />
              2. Production Champion Metric Profile
            </h3>
            <span className="badge badge-success">LightGBM</span>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
            <canvas ref={chart2Ref}></canvas>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header-flex">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} className="text-accent" />
              3. Top SHAP Feature Importances
            </h3>
            <span className="badge badge-purple">TreeSHAP</span>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
            <canvas ref={chart3Ref}></canvas>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header-flex">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} className="text-accent" />
              4. Operational Dollar Recovery Lift ($M)
            </h3>
            <span className="badge badge-cyan">9x Lift Factor</span>
          </div>
          <div className="chart-canvas-wrapper" style={{ height: '260px' }}>
            <canvas ref={chart4Ref}></canvas>
          </div>
        </div>
      </div>

      {/* 9-Estimator Cross-Validation Benchmark Suite Table */}
      <section className="dashboard-card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header-flex">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={20} className="text-warning" />
            9-Estimator Cross-Validation Benchmark Suite
          </h2>
          <span className="badge badge-cyan">5-Fold Stratified Provider CV</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
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
                <tr key={m.name} className={m.isChampion ? 'highlight-row' : ''}>
                  <td>
                    <div className="provider-cell">
                      <span className="provider-id">{m.name}</span>
                      <span className="provider-type">{m.strengths}</span>
                    </div>
                  </td>
                  <td className="mono-text font-bold">{m.rocAuc.toFixed(4)}</td>
                  <td className="mono-text">{m.prAuc.toFixed(4)}</td>
                  <td className="mono-text">{m.f1.toFixed(4)}</td>
                  <td className="mono-text">{(m.recall * 100).toFixed(1)}%</td>
                  <td className="mono-text">{(m.precision * 100).toFixed(1)}%</td>
                  <td className="mono-text">{m.latency}</td>
                  <td className="mono-text">{m.size}</td>
                  <td>
                    {m.isChampion ? (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Award size={12} /> CHAMPION
                      </span>
                    ) : (
                      <span className="badge badge-neutral">Evaluated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Generated Figure Artifacts Gallery */}
      <section className="dashboard-card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header-flex">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={20} className="text-accent" />
            Official Research Figure Artifacts Gallery
          </h2>
          <span className="badge badge-cyan">High-Resolution Artifacts</span>
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
                  <Maximize2 size={24} className="figure-zoom-icon" />
                  <span>Click to Enlarge</span>
                </div>
              </div>
              <div className="figure-meta-bar">
                <div className="figure-title-bold">{fig.title}</div>
                <div className="figure-desc-sub">{fig.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
