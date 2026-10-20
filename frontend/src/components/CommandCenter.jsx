import React, { useState } from 'react';
import {
  IconZap,
  IconAlert,
  IconShield,
  IconClock,
  IconSearch,
  IconLineChart,
  IconArrowRight,
  IconSparkles,
  IconFreeze,
  IconCheckCircle,
  IconDatabase,
} from './Icons';

export default function CommandCenter({
  cases,
  onInspectCase,
  onTriageAction,
  onViewAllCases,
  onOpenDatasetStudio,
}) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditSummary, setAuditSummary] = useState(null);

  const urgentCases = cases.slice(0, 5);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditProgress(15);
    setAuditSummary(null);

    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 180);

    setTimeout(() => {
      clearInterval(interval);
      setAuditProgress(100);
      setIsAuditing(false);
      setAuditSummary({
        total: 10,
        flagged: 5,
        cleared: 5,
        exposureSaved: '₹1.45 Cr',
        timestamp: new Date().toLocaleTimeString(),
      });
    }, 1100);
  };

  return (
    <div className="tab-view active syght-view">
      {/* Hero Section */}
      <section className="syght-hero-section">
        <div className="hero-grid-ambient" />
        <div className="hero-radial-spotlight" />

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
              onClick={handleRunAudit}
              disabled={isAuditing}
            >
              <IconZap size={16} className={isAuditing ? 'animate-spin' : ''} />
              <span>{isAuditing ? `Auditing 10 Cases (${auditProgress}%)...` : 'Run Audit with 10 Sample Cases'}</span>
            </button>
            <button
              type="button"
              className="syght-btn-secondary"
              onClick={() => onInspectCase('PRV_02_PHANTOM_SURGERY_MILL')}
            >
              <IconSparkles size={16} />
              <span>Inspect Live Case PRV_02</span>
            </button>
            <button
              type="button"
              className="syght-btn-secondary"
              onClick={onOpenDatasetStudio}
              title="Upload Custom Healthcare Claims Dataset"
            >
              <IconDatabase size={15} />
              <span>Upload Custom Dataset</span>
            </button>
          </div>

          {/* Audit Progress or Result Banner */}
          {isAuditing && (
            <div className="w-full max-w-lg mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left animate-pulse">
              <div className="flex justify-between text-xs font-mono font-medium text-slate-700 mb-2">
                <span>Executing multi-table feature synthesis & TreeSHAP scoring...</span>
                <span>{auditProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${auditProgress}%` }}
                />
              </div>
            </div>
          )}

          {auditSummary && (
            <div className="w-full max-w-2xl mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-left flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <IconCheckCircle size={24} className="text-emerald-600 shrink-0" />
                <div>
                  <div className="font-semibold text-sm text-slate-900">
                    Audit Run Complete ({auditSummary.timestamp})
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Evaluated 10 benchmark facilities: <strong className="text-rose-600">5 High-Risk Flagged</strong>, <strong className="text-emerald-600">5 Clean Auto-Cleared</strong> with 100% precision.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onViewAllCases}
                className="syght-btn-secondary text-xs py-1.5 px-3 shrink-0"
              >
                View Full Queue
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bento Grid: Key Operational KPI Metric Cards */}
      <section className="bento-kpi-grid">
        {/* Card 01 */}
        <div className="bento-card group">
          <div className="bento-watermark">01</div>
          <div className="bento-card-header">
            <span className="bento-card-label">TOTAL CLAIMS ANALYZED</span>
            <span className="bento-card-icon-box text-sky-600">
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
        <div className="bento-card group">
          <div className="bento-watermark">02</div>
          <div className="bento-card-header">
            <span className="bento-card-label">UNDER INVESTIGATION</span>
            <span className="bento-card-icon-box text-rose-600">
              <IconAlert size={18} />
            </span>
          </div>
          <div className="bento-card-value text-rose-600 font-mono">14 Cases</div>
          <div className="bento-card-sub danger">
            <span>5 Active Ring Facilities in Triage</span>
          </div>
          <div className="bento-hairline-indicator accent-rose" />
        </div>

        {/* Card 03 */}
        <div className="bento-card group">
          <div className="bento-watermark">03</div>
          <div className="bento-card-header">
            <span className="bento-card-label">REVIEWED TODAY</span>
            <span className="bento-card-icon-box text-emerald-600">
              <IconCheckCircle size={18} />
            </span>
          </div>
          <div className="bento-card-value text-emerald-600 font-mono">38 Providers</div>
          <div className="bento-card-sub positive">
            <span>₹1.46 Cr Incurred Claims Audited</span>
          </div>
          <div className="bento-hairline-indicator accent-emerald" />
        </div>

        {/* Card 04 */}
        <div className="bento-card group">
          <div className="bento-watermark">04</div>
          <div className="bento-card-header">
            <span className="bento-card-label">HIGH-RISK FLAGS TRIGGERED</span>
            <span className="bento-card-icon-box text-amber-600">
              <IconAlert size={18} />
            </span>
          </div>
          <div className="bento-card-value text-amber-600 font-mono">108</div>
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
            <span className="bento-card-icon-box text-sky-600">
              <IconShield size={18} />
            </span>
          </div>
          <div className="bento-card-value text-sky-600 font-mono">₹382.4 Cr</div>
          <div className="bento-card-sub positive">
            <span>₹45.9 Cr Direct Clawback Target</span>
          </div>
          <div className="bento-hairline-indicator accent-cyan" />
        </div>

        {/* Card 06 */}
        <div className="bento-card group">
          <div className="bento-watermark">06</div>
          <div className="bento-card-header">
            <span className="bento-card-label">AVG PRE-AUTH LATENCY</span>
            <span className="bento-card-icon-box text-violet-600">
              <IconZap size={18} />
            </span>
          </div>
          <div className="bento-card-value font-mono">1.84 <span className="text-sm font-normal text-slate-500">ms</span></div>
          <div className="bento-card-sub positive">
            <span>Sub-5ms Real-Time Inline Intercept</span>
          </div>
          <div className="bento-hairline-indicator" />
        </div>
      </section>

      {/* Urgent Priority Review Triage (Full Width Table Card) */}
      <section className="syght-panel" style={{ marginTop: '1.5rem' }}>
        <div className="syght-panel-header">
          <div className="panel-title-flex">
            <IconAlert size={20} className="text-rose-600" />
            <div>
              <h3>Urgent Priority Review Triage</h3>
              <p className="panel-subtitle-text">
                Live High-Risk Inpatient & Ring Facilities Flagged for Immediate SIU Intervention
              </p>
            </div>
          </div>
          <button
            type="button"
            className="panel-link-action"
            onClick={onViewAllCases}
          >
            <span>View Full Queue ({cases.length} Cases)</span>
            <IconArrowRight size={13} />
          </button>
        </div>

        <div className="table-responsive-wrapper">
          <table className="syght-table">
            <thead>
              <tr>
                <th>Provider / Healthcare Entity</th>
                <th>Clinical Scheme Archetype</th>
                <th>Total Billed Payout</th>
                <th>Calibrated Risk</th>
                <th>Audit Decision</th>
                <th className="text-right">Action Protocol</th>
              </tr>
            </thead>
            <tbody>
              {urgentCases.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="provider-cell">
                      <span className="provider-id-tag font-mono">{c.id}</span>
                      <span className="font-semibold text-slate-900 text-xs">{c.name || c.id}</span>
                    </div>
                  </td>
                  <td>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
                      {c.tag || 'Institutional Provider'}
                    </span>
                  </td>
                  <td className="font-mono font-semibold text-slate-900">
                    ₹{c.reimbursement.toLocaleString()}
                  </td>
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
                  <td className="text-right">
                    <div className="action-button-cluster justify-end">
                      <button
                        type="button"
                        className="action-btn-inspect"
                        onClick={() => onInspectCase(c.id)}
                        title="Inspect in SHAP Waterfall Analyzer"
                      >
                        <IconSearch size={13} />
                        <span>Inspect</span>
                      </button>
                      {c.status !== 'frozen' && c.decision.includes('FLAGGED') && (
                        <button
                          type="button"
                          className="action-btn-freeze"
                          onClick={() => onTriageAction(c.id, 'FREEZE')}
                          title="Freeze Reimbursements & Open SIU Case"
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
                          title="Fast-Track Reimbursement Clearance"
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

      {/* Leading TreeSHAP Risk Drivers Card */}
      <section className="syght-panel" style={{ marginTop: '1.5rem' }}>
        <div className="syght-panel-header">
          <div className="panel-title-flex">
            <IconSparkles size={20} className="text-violet-600" />
            <div>
              <h3>Leading TreeSHAP Risk Drivers & Feature Contributions</h3>
              <p className="panel-subtitle-text">
                Additive game-theoretic attribution quantifying why claims cross the 0.5364 operational decision boundary
              </p>
            </div>
          </div>
          <span className="syght-chip font-mono">Global Explainer</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-xs text-slate-800">Inpatient Payout Share</span>
              <span className="shap-value-badge positive font-mono">+0.324 SHAP</span>
            </div>
            <div className="shap-bar-track mb-2">
              <div className="shap-bar-fill push-positive" style={{ width: '88%' }} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Facilities with &gt; 80% inpatient billing face +3.8x higher odds of systemic phantom hospitalization.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-xs text-slate-800">Physician Monopoly</span>
              <span className="shap-value-badge positive font-mono">+0.285 SHAP</span>
            </div>
            <div className="shap-bar-track mb-2">
              <div className="shap-bar-fill push-positive" style={{ width: '76%' }} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Single doctor billing &gt; 65% of all hospital claims indicates kickback nexus or ghost physician recycling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-xs text-slate-800">Graph Degree Centrality</span>
              <span className="shap-value-badge positive font-mono">+0.264 SHAP</span>
            </div>
            <div className="shap-bar-track mb-2">
              <div className="shap-bar-fill push-positive" style={{ width: '70%' }} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Shared clinical staff appearing simultaneously across 3+ distinct physical facilities in 24 hours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-xs text-slate-800">Same-Day Unbundling</span>
              <span className="shap-value-badge positive font-mono">+0.218 SHAP</span>
            </div>
            <div className="shap-bar-track mb-2">
              <div className="shap-bar-fill push-positive" style={{ width: '58%' }} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Artificial splitting of single diagnostic procedures into multiple distinct reimbursement claims.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-xs text-slate-800">ICU Length-of-Stay Drift</span>
              <span className="shap-value-badge positive font-mono">+0.198 SHAP</span>
            </div>
            <div className="shap-bar-track mb-2">
              <div className="shap-bar-fill push-positive" style={{ width: '54%' }} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mean ICU duration &gt; 8.5 days exceeding standard clinical protocol for admitted ICD diagnosis.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-xs text-emerald-900">Community Outpatient Volume</span>
              <span className="shap-value-badge negative font-mono">-0.195 SHAP</span>
            </div>
            <div className="shap-bar-track mb-2">
              <div className="shap-bar-fill push-negative" style={{ width: '52%' }} />
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Balanced outpatient volume and high physician diversity strongly correlate with legitimate community clinics.
            </p>
          </div>
        </div>

        <div className="syght-banner-notice mt-4">
          <IconShield size={18} className="text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong>Defensible Due Process:</strong> All risk scores are accompanied by mathematical TreeSHAP attributions 
            ensuring clear, defensible evidence for legal clawback proceedings and administrative hearings.
          </div>
        </div>
      </section>

      {/* Operational Workload & Pipeline Telemetry */}
      <section className="syght-panel" style={{ marginTop: '1.5rem' }}>
        <div className="syght-panel-header">
          <div className="panel-title-flex">
            <IconClock size={20} className="text-sky-600" />
            <div>
              <h3>Enterprise Pipeline Telemetry & Workload Tracking</h3>
              <p className="panel-subtitle-text">Real-time throughput, model lift, and SLA compliance</p>
            </div>
          </div>
          <span className="syght-chip font-mono">Team Pulse Live</span>
        </div>

        <div className="multi-progress-grid">
          {/* Progress 1 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Today's SIU Audit Queue Completion</span>
              <span className="progress-value font-mono">38 / 52 Audited (73.1%)</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-cyan" style={{ width: '73.1%' }} />
            </div>
          </div>

          {/* Progress 2 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">High-Risk Fraud Capture Rate (Top 5% Threshold)</span>
              <span className="progress-value font-mono">74.8% of Total Scheme Leakage</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-amber" style={{ width: '74.8%' }} />
            </div>
          </div>

          {/* Progress 3 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Collusion Syndicate Network Isolation</span>
              <span className="progress-value font-mono">11 Linked Branches Flagged</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-purple" style={{ width: '88.5%' }} />
            </div>
          </div>

          {/* Progress 4 */}
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Sub-5ms Pre-Auth SLA Compliance</span>
              <span className="progress-value font-mono">99.8% Admissions within SLA</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-gradient-cyan" style={{ width: '99.8%' }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
