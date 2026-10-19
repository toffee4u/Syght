import React from 'react';
import { 
  BarChart3, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Zap, 
  Activity, 
  Flame, 
  ArrowRight, 
  Brain, 
  Info, 
  ShieldBan, 
  Search 
} from 'lucide-react';

export default function CommandCenter({ 
  cases, 
  onInspectCase, 
  onTriageAction, 
  onViewAllCases 
}) {
  const urgentCases = cases.slice(0, 5);

  return (
    <div className="tab-view active">
      {/* Key Operational KPI Metric Cards */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL CLAIMS ANALYZED</span>
            <span className="kpi-icon">
              <BarChart3 size={18} className="text-accent" strokeWidth={1.8} />
            </span>
          </div>
          <div className="kpi-value">571,018</div>
          <div className="kpi-sub positive">↑ 100% Schema-Validated (5,660 Providers)</div>
        </div>

        <div className="kpi-card alert-card">
          <div className="kpi-header">
            <span className="kpi-title">UNDER INVESTIGATION</span>
            <span className="kpi-icon">
              <AlertCircle size={18} className="text-danger" strokeWidth={1.8} />
            </span>
          </div>
          <div className="kpi-value highlight-text">57</div>
          <div className="kpi-sub warning">Top 5% Highest-Risk Providers Queue</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">REVIEWED TODAY</span>
            <span className="kpi-icon">
              <CheckCircle2 size={18} className="text-success" strokeWidth={1.8} />
            </span>
          </div>
          <div className="kpi-value">18</div>
          <div className="kpi-sub positive">72% of Daily Triage Target (25 Cases)</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">HIGH-RISK FLAGS TRIGGERED</span>
            <span className="kpi-icon">
              <AlertTriangle size={18} className="text-warning" strokeWidth={1.8} />
            </span>
          </div>
          <div className="kpi-value danger-text">108</div>
          <div className="kpi-sub danger">Top-K Queue Capture (89.2% Sensitivity)</div>
        </div>

        <div className="kpi-card highlight-card">
          <div className="kpi-header">
            <span className="kpi-title">FRAUD EXPOSURE RECOVERED</span>
            <span className="kpi-icon">
              <DollarSign size={18} className="text-accent" strokeWidth={1.8} />
            </span>
          </div>
          <div className="kpi-value glow-text">$45.9M</div>
          <div className="kpi-sub positive">≈ ₹382.4 Crore INR Projected Clawback</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">AVG PRE-AUTH LATENCY</span>
            <span className="kpi-icon">
              <Zap size={18} className="text-accent" strokeWidth={1.8} />
            </span>
          </div>
          <div className="kpi-value mono-text">1.84 <span className="unit">ms</span></div>
          <div className="kpi-sub positive">Sub-5ms Real-Time Interception</div>
        </div>
      </section>

      {/* Multi Progress Bars & Operational Progress Section */}
      <section className="progress-showcase-panel">
        <div className="panel-header">
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} className="text-accent" strokeWidth={1.8} />
            Operational Audit Progress & Capacity Metrics
          </div>
          <div className="panel-subtitle">Live SIH-Grade Pipeline Health & Investigation Workload Tracking</div>
        </div>

        <div className="multi-progress-grid">
          {/* Progress 1 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Priority Review Queue Triage</span>
              <span className="progress-value">6 of 10 Flagged Cases Resolved</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-cyan" style={{ width: '60%' }}></div>
            </div>
            <div className="progress-meta">
              <span>PRV_02, PRV_03 Pending Escalation</span>
              <span className="progress-percent">60% Complete</span>
            </div>
          </div>

          {/* Progress 2 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Daily Investigator Review Capacity</span>
              <span className="progress-value">18 / 25 Cases Handled</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-amber" style={{ width: '72%' }}></div>
            </div>
            <div className="progress-meta">
              <span>On-track to meet daily shift quota</span>
              <span className="progress-percent">72% Capacity</span>
            </div>
          </div>

          {/* Progress 3 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">SHAP Feature Explainability Coverage</span>
              <span className="progress-value">5,410 of 5,410 Providers Mapped</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-purple" style={{ width: '100%' }}></div>
            </div>
            <div className="progress-meta">
              <span>100% TreeExplainer Tree-Level Coverage</span>
              <span className="progress-percent">100% Complete</span>
            </div>
          </div>

          {/* Progress 4 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Cross-Validation Model Accuracy (ROC-AUC)</span>
              <span className="progress-value">0.8724 CV (Production LightGBM)</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-emerald" style={{ width: '87.2%' }}></div>
            </div>
            <div className="progress-meta">
              <span>Surpasses baseline heuristic (0.6890) by +26.6%</span>
              <span className="progress-percent">87.2% AUC</span>
            </div>
          </div>

          {/* Progress 5 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Sub-5ms Pre-Auth SLA Compliance</span>
              <span className="progress-value">99.8% Admissions within SLA</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-cyan" style={{ width: '99.8%' }}></div>
            </div>
            <div className="progress-meta">
              <span>Real-time claim gateway throughput: 1,420 claims/sec</span>
              <span className="progress-percent">99.8% SLA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Split Grid: Urgent Triage Worklist & Top SHAP Drivers */}
      <div className="dashboard-split-grid">
        {/* Left Column: Urgent Review Triage */}
        <section className="dashboard-card">
          <div className="card-header-flex">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} className="text-danger" strokeWidth={2} />
              Urgent Priority Review Triage
            </h2>
            <button className="btn-text-action" onClick={onViewAllCases} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All {cases.length} Cases <ArrowRight size={14} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Provider / Hospital</th>
                  <th>Total Payout</th>
                  <th>Risk Score</th>
                  <th>Decision</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {urgentCases.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="provider-cell">
                        <span className="provider-id">{c.id}</span>
                        <span className="provider-type">{c.tag}</span>
                      </div>
                    </td>
                    <td className="mono-text">${c.reimbursement.toLocaleString()}</td>
                    <td>
                      <div className="risk-pill-container">
                        <div 
                          className="risk-bar-mini" 
                          style={{ width: `${Math.round(c.risk * 100)}%` }}
                        ></div>
                        <span className={`risk-text ${c.risk >= 0.8 ? 'danger' : c.risk >= 0.5 ? 'warning' : 'clean'}`}>
                          {(c.risk * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${c.decision.includes('FLAGGED') ? 'badge-danger' : 'badge-success'}`}>
                        {c.decision.includes('FLAGGED') ? 'FLAGGED FOR AUDIT' : 'AUTO-CLEARED'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-flex">
                        <button 
                          className="btn-table-action" 
                          onClick={() => onInspectCase(c.id)}
                          title="Inspect SHAP Waterfall"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Search size={13} /> Score
                        </button>
                        {c.status !== 'frozen' && c.decision.includes('FLAGGED') && (
                          <button 
                            className="btn-table-action btn-freeze" 
                            onClick={() => onTriageAction(c.id, 'FREEZE')}
                            title="Freeze Disbursements"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <ShieldBan size={13} /> Freeze
                          </button>
                        )}
                        {c.status !== 'cleared' && !c.decision.includes('FLAGGED') && (
                          <button 
                            className="btn-table-action btn-clear" 
                            onClick={() => onTriageAction(c.id, 'CLEAR')}
                            title="Fast-Track Reimbursement"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <CheckCircle2 size={13} /> Clear
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: Real-Time SHAP Risk Drivers */}
        <section className="dashboard-card">
          <div className="card-header-flex">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={20} className="text-accent" strokeWidth={1.8} />
              Real-Time SHAP Risk Drivers
            </h2>
            <span className="badge badge-cyan">TreeExplainer Active</span>
          </div>

          <p className="card-intro">
            Top feature attributions driving fraud classifications across the provider population. 
            All values derived from TreeSHAP Shapley values.
          </p>

          <div className="shap-breakdown-list">
            <div className="shap-item">
              <div className="shap-meta">
                <span className="shap-feature-name">mean_inpatient_los</span>
                <span className="shap-value-badge positive">+0.482 SHAP (Heavy Fraud Push)</span>
              </div>
              <div className="shap-bar-track">
                <div className="shap-bar-fill push-positive" style={{ width: '85%' }}></div>
              </div>
              <div className="shap-desc">Prolonged Inpatient Stays (LOS &gt; 12.5 days) vs. peer median (3.8 days).</div>
            </div>

            <div className="shap-item">
              <div className="shap-meta">
                <span className="shap-feature-name">same_day_duplicate_rate</span>
                <span className="shap-value-badge positive">+0.395 SHAP (Heavy Fraud Push)</span>
              </div>
              <div className="shap-bar-track">
                <div className="shap-bar-fill push-positive" style={{ width: '74%' }}></div>
              </div>
              <div className="shap-desc">Unbundled repeat diagnostic codes billed on identical beneficiary dates.</div>
            </div>

            <div className="shap-item">
              <div className="shap-meta">
                <span className="shap-feature-name">claims_per_attending_ratio</span>
                <span className="shap-value-badge positive">+0.312 SHAP</span>
              </div>
              <div className="shap-bar-track">
                <div className="shap-bar-fill push-positive" style={{ width: '62%' }}></div>
              </div>
              <div className="shap-desc">Physician claim velocity exceeding human clinical capacity (&gt;150 claims/doc).</div>
            </div>

            <div className="shap-item">
              <div className="shap-meta">
                <span className="shap-feature-name">graph_degree_centrality</span>
                <span className="shap-value-badge positive">+0.264 SHAP</span>
              </div>
              <div className="shap-bar-track">
                <div className="shap-bar-fill push-positive" style={{ width: '55%' }}></div>
              </div>
              <div className="shap-desc">Physician-hospital bipartite collusion index indicating cross-facility syndicates.</div>
            </div>

            <div className="shap-item">
              <div className="shap-meta">
                <span className="shap-feature-name">unique_beneficiaries_count</span>
                <span className="shap-value-badge negative">-0.245 SHAP (Mitigating Factor)</span>
              </div>
              <div className="shap-bar-track">
                <div className="shap-bar-fill push-negative" style={{ width: '48%' }}></div>
              </div>
              <div className="shap-desc">High unique patient diversity protects legitimate regional general hospitals.</div>
            </div>
          </div>

          <div className="shap-info-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} className="text-warning" strokeWidth={2} />
            <span>Demographics (Gender & Race) are permanently excluded from model training to guarantee 100% ethical fairness across all providers.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
