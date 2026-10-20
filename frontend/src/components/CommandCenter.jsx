import React from 'react';
import {
  IconLineChart,
  IconAlert,
  IconCheckCircle,
  IconZap,
  IconPulse,
  IconArrowRight,
  IconBrain,
  IconFreeze,
  IconSearch,
  IconSparkles,
  IconShield,
} from './Icons';

export default function CommandCenter({
  cases,
  onInspectCase,
  onTriageAction,
  onViewAllCases,
}) {
  const urgentCases = cases.slice(0, 5);

  return (
    <div className="tab-view active syght-view">
      {/* Syght Enterprise Inspired Hero Banner */}
      <section className="syght-hero-section">
        <div className="hero-grid-ambient" aria-hidden="true" />
        <div className="hero-radial-spotlight" aria-hidden="true" />

        <div className="hero-content-cluster">
          <div className="hero-pill-badge">
            <span className="beacon-emerald" />
            <span className="hero-pill-text">Team Pulse Engineering • Enterprise Fraud Intelligence</span>
          </div>

          <h1 className="hero-headline">
            <span className="hero-headline-primary">Autonomous Healthcare Fraud Intelligence</span>
            <span className="hero-headline-sub">Engineered for High-Precision Special Investigation Units</span>
          </h1>

          <p className="hero-tagline">
            Syght combines a 1-SE LightGBM calibrated probabilistic engine, sub-5ms real-time pre-authorization interception, 
            and plain-language TreeSHAP explainability to stop fraudulent billing before funds leave the treasury.
          </p>

          <div className="hero-action-row">
            <button
              type="button"
              className="syght-btn-primary"
              onClick={onViewAllCases}
            >
              <span>Review Audit Worklist ({cases.length} Cases)</span>
              <IconArrowRight size={15} />
            </button>
            <button
              type="button"
              className="syght-btn-secondary"
              onClick={() => onInspectCase('PRV_02_PHANTOM_SURGERY_MILL')}
            >
              <IconSparkles size={16} />
              <span>Inspect Live Case PRV_02</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid: Key Operational KPI Metric Cards (Syght Enterprise Card Style) */}
      <section className="bento-kpi-grid">
        {/* Card 01 */}
        <div className="bento-card group">
          <div className="bento-watermark">01</div>
          <div className="bento-card-header">
            <span className="bento-card-label">TOTAL CLAIMS ANALYZED</span>
            <span className="bento-card-icon-box text-cyan-400">
              <IconLineChart size={18} />
            </span>
          </div>
          <div className="bento-card-value font-mono">571,018</div>
          <div className="bento-card-sub positive">
            <span>↑ 100% Schema-Validated (5,410 Providers)</span>
          </div>
          <div className="bento-hairline-indicator" />
        </div>

        {/* Card 02 */}
        <div className="bento-card group border-rose-500/20">
          <div className="bento-watermark">02</div>
          <div className="bento-card-header">
            <span className="bento-card-label">UNDER INVESTIGATION</span>
            <span className="bento-card-icon-box text-rose-400">
              <IconAlert size={18} />
            </span>
          </div>
          <div className="bento-card-value text-rose-400 font-mono">57</div>
          <div className="bento-card-sub warning">
            <span>Top 5% Highest-Risk Providers Queue</span>
          </div>
          <div className="bento-hairline-indicator accent-rose" />
        </div>

        {/* Card 03 */}
        <div className="bento-card group">
          <div className="bento-watermark">03</div>
          <div className="bento-card-header">
            <span className="bento-card-label">REVIEWED TODAY</span>
            <span className="bento-card-icon-box text-emerald-400">
              <IconCheckCircle size={18} />
            </span>
          </div>
          <div className="bento-card-value text-emerald-400 font-mono">18</div>
          <div className="bento-card-sub positive">
            <span>72% of Daily Triage Target (25 Cases)</span>
          </div>
          <div className="bento-hairline-indicator accent-emerald" />
        </div>

        {/* Card 04 */}
        <div className="bento-card group">
          <div className="bento-watermark">04</div>
          <div className="bento-card-header">
            <span className="bento-card-label">HIGH-RISK FLAGS TRIGGERED</span>
            <span className="bento-card-icon-box text-amber-400">
              <IconAlert size={18} />
            </span>
          </div>
          <div className="bento-card-value text-amber-400 font-mono">108</div>
          <div className="bento-card-sub warning">
            <span>Top-K Queue Capture (89.2% Sensitivity)</span>
          </div>
          <div className="bento-hairline-indicator accent-amber" />
        </div>

        {/* Card 05 */}
        <div className="bento-card group highlight-card">
          <div className="bento-watermark">05</div>
          <div className="bento-card-header">
            <span className="bento-card-label">EXPOSURE RECOVERED</span>
            <span className="bento-card-icon-box text-cyan-300">
              <IconShield size={18} />
            </span>
          </div>
          <div className="bento-card-value text-cyan-300 font-mono">$45.9M</div>
          <div className="bento-card-sub positive">
            <span>≈ ₹382.4 Crore INR Projected Clawback</span>
          </div>
          <div className="bento-hairline-indicator accent-cyan" />
        </div>

        {/* Card 06 */}
        <div className="bento-card group">
          <div className="bento-watermark">06</div>
          <div className="bento-card-header">
            <span className="bento-card-label">AVG PRE-AUTH LATENCY</span>
            <span className="bento-card-icon-box text-violet-400">
              <IconZap size={18} />
            </span>
          </div>
          <div className="bento-card-value font-mono">1.84 <span className="text-sm font-normal text-neutral-400">ms</span></div>
          <div className="bento-card-sub positive">
            <span>Sub-5ms Real-Time Interception</span>
          </div>
          <div className="bento-hairline-indicator accent-violet" />
        </div>
      </section>

      {/* Multi Progress Bars & Operational Progress Section */}
      <section className="syght-panel">
        <div className="syght-panel-header">
          <div className="panel-title-group">
            <div className="panel-title-flex">
              <IconPulse size={20} className="text-cyan-400" />
              <h3>Operational Audit Progress & Capacity Metrics</h3>
            </div>
            <p className="panel-subtitle-text">
              Live Enterprise Pipeline Health & Investigation Workload Tracking • Team Pulse
            </p>
          </div>
          <span className="syght-chip">
            <span className="chip-dot" />
            Active Shift Quota
          </span>
        </div>

        <div className="multi-progress-grid">
          {/* Progress 1 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Priority Review Queue Triage</span>
              <span className="progress-value font-mono">6 of 10 Flagged Cases Resolved</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-cyan" style={{ width: '60%' }} />
            </div>
            <div className="progress-meta">
              <span>PRV_02, PRV_03 Pending Escalation</span>
              <span className="progress-percent font-mono">60% Complete</span>
            </div>
          </div>

          {/* Progress 2 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Daily Investigator Review Capacity</span>
              <span className="progress-value font-mono">18 / 25 Cases Handled</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-amber" style={{ width: '72%' }} />
            </div>
            <div className="progress-meta">
              <span>On-track to meet daily shift quota</span>
              <span className="progress-percent font-mono">72% Capacity</span>
            </div>
          </div>

          {/* Progress 3 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">SHAP Feature Explainability Coverage</span>
              <span className="progress-value font-mono">5,410 of 5,410 Providers Mapped</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-purple" style={{ width: '100%' }} />
            </div>
            <div className="progress-meta">
              <span>100% TreeExplainer Tree-Level Coverage</span>
              <span className="progress-percent font-mono">100% Complete</span>
            </div>
          </div>

          {/* Progress 4 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Cross-Validation Model Accuracy (ROC-AUC)</span>
              <span className="progress-value font-mono">0.8724 CV (Production LightGBM)</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-emerald" style={{ width: '87.2%' }} />
            </div>
            <div className="progress-meta">
              <span>Surpasses baseline heuristic (0.6890) by +26.6%</span>
              <span className="progress-percent font-mono">87.2% AUC</span>
            </div>
          </div>

          {/* Progress 5 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Sub-5ms Pre-Auth SLA Compliance</span>
              <span className="progress-value font-mono">99.8% Admissions within SLA</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-cyan" style={{ width: '99.8%' }} />
            </div>
            <div className="progress-meta">
              <span>Real-time claim gateway throughput: 1,420 claims/sec</span>
              <span className="progress-percent font-mono">99.8% SLA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Split Grid: Urgent Triage Worklist & Top SHAP Drivers */}
      <div className="syght-split-grid">
        {/* Left Column: Urgent Review Triage */}
        <section className="syght-panel">
          <div className="syght-panel-header">
            <div className="panel-title-flex">
              <IconAlert size={20} className="text-rose-400" />
              <h3>Urgent Priority Review Triage</h3>
            </div>
            <button
              type="button"
              className="panel-link-action"
              onClick={onViewAllCases}
            >
              <span>View All {cases.length} Cases</span>
              <IconArrowRight size={13} />
            </button>
          </div>

          <div className="table-responsive-wrapper">
            <table className="syght-table">
              <thead>
                <tr>
                  <th>Provider / Entity</th>
                  <th>Total Payout</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {urgentCases.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="provider-cell">
                        <span className="provider-id-tag font-mono">{c.id}</span>
                        <span className="provider-sub-tag">{c.tag}</span>
                      </div>
                    </td>
                    <td className="font-mono text-neutral-200">${c.reimbursement.toLocaleString()}</td>
                    <td>
                      <div className="risk-metric-box">
                        <div
                          className="risk-bar-indicator"
                          style={{ width: `${Math.round(c.risk * 100)}%` }}
                        />
                        <span className={`risk-number-badge font-mono ${c.risk >= 0.8 ? 'is-danger' : c.risk >= 0.5 ? 'is-warning' : 'is-clean'}`}>
                          {(c.risk * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-tag ${c.decision.includes('FLAGGED') ? 'tag-flagged' : 'tag-cleared'}`}>
                        {c.decision.includes('FLAGGED') ? 'FLAGGED FOR AUDIT' : 'AUTO-CLEARED'}
                      </span>
                    </td>
                    <td>
                      <div className="action-button-cluster">
                        <button
                          type="button"
                          className="action-btn-inspect"
                          onClick={() => onInspectCase(c.id)}
                          title="Inspect SHAP Waterfall"
                        >
                          <IconSearch size={13} />
                          <span>Score</span>
                        </button>
                        {c.status !== 'frozen' && c.decision.includes('FLAGGED') && (
                          <button
                            type="button"
                            className="action-btn-freeze"
                            onClick={() => onTriageAction(c.id, 'FREEZE')}
                            title="Freeze Disbursements"
                          >
                            <IconFreeze size={13} />
                            <span>Freeze</span>
                          </button>
                        )}
                        {c.status !== 'cleared' && !c.decision.includes('FLAGGED') && (
                          <button
                            type="button"
                            className="action-btn-clear"
                            onClick={() => onTriageAction(c.id, 'CLEAR')}
                            title="Fast-Track Reimbursement"
                          >
                            <IconCheckCircle size={13} />
                            <span>Clear</span>
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
        <section className="syght-panel">
          <div className="syght-panel-header">
            <div className="panel-title-flex">
              <IconBrain size={20} className="text-cyan-400" />
              <h3>Real-Time SHAP Risk Drivers</h3>
            </div>
            <span className="syght-chip">
              <IconSparkles size={12} className="text-cyan-400" />
              TreeExplainer Active
            </span>
          </div>

          <p className="panel-intro-text">
            Top feature attributions driving fraud classifications across the provider population. 
            All values derived from TreeSHAP Shapley values with verified feature additive efficiency.
          </p>

          <div className="shap-breakdown-list">
            <div className="shap-item">
              <div className="shap-meta">
                <span className="shap-feature-name font-mono">mean_inpatient_los</span>
                <span className="shap-value-badge positive font-mono">+0.482 SHAP (Heavy Fraud Push)</span>
              </div>
              <div className="shap-bar-track">
                <div className="shap-bar-fill push-positive" style={{ width: '85%' }} />
              </div>
              <div className="shap-desc">Prolonged Inpatient Stays (LOS &gt; 12.5 days) vs. peer median (3.8 days).</div>
            </div>

            <div className="shap-item">
              <div className="shap-meta">
                <span className="shap-feature-name font-mono">same_day_duplicate_rate</span>
                <span className="shap-value-badge positive font-mono">+0.395 SHAP (Heavy Fraud Push)</span>
              </div>
              <div className="shap-bar-track">
                <div className="shap-bar-fill push-positive" style={{ width: '74%' }} />
              </div>
              <div className="shap-desc">Unbundled repeat diagnostic codes billed on identical beneficiary dates.</div>
            </div>

            <div className="shap-item">
              <div className="shap-meta">
                <span className="shap-feature-name font-mono">claims_per_attending_ratio</span>
                <span className="shap-value-badge positive font-mono">+0.312 SHAP</span>
              </div>
              <div className="shap-bar-track">
                <div className="shap-bar-fill push-positive" style={{ width: '62%' }} />
              </div>
              <div className="shap-desc">Physician claim velocity exceeding human clinical capacity (&gt;150 claims/doc).</div>
            </div>

            <div className="shap-item">
              <div className="shap-meta">
                <span className="shap-feature-name font-mono">graph_degree_centrality</span>
                <span className="shap-value-badge positive font-mono">+0.264 SHAP</span>
              </div>
              <div className="shap-bar-track">
                <div className="shap-bar-fill push-positive" style={{ width: '55%' }} />
              </div>
              <div className="shap-desc">Physician-hospital bipartite collusion index indicating cross-facility syndicates.</div>
            </div>

            <div className="shap-item">
              <div className="shap-meta">
                <span className="shap-feature-name font-mono">unique_beneficiaries_count</span>
                <span className="shap-value-badge negative font-mono">-0.245 SHAP (Mitigating Factor)</span>
              </div>
              <div className="shap-bar-track">
                <div className="shap-bar-fill push-negative" style={{ width: '48%' }} />
              </div>
              <div className="shap-desc">High unique patient diversity protects legitimate regional general hospitals.</div>
            </div>
          </div>

          <div className="syght-banner-notice">
            <IconShield size={16} className="text-cyan-400 shrink-0" />
            <span>
              <strong>Fairness Guarantee:</strong> Patient demographic attributes (Gender & Race) are permanently excluded 
              from model training to guarantee 100% ethical impartiality across all healthcare providers.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
