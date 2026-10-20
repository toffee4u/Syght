import React, { useState } from 'react';
import {
  HugeClipboardList,
  HugeAlert,
  HugeCheckCircle,
  HugeSearch,
  HugeFreeze,
  HugeFilter,
  HugeArrowRight,
  HugeSparkles,
} from './HugeIcons';

export default function ReviewQueue({
  cases,
  onInspectCase,
  onTriageAction,
}) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.tag.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'critical') return c.category === 'critical';
    if (filter === 'high') return c.category === 'high';
    if (filter === 'clean') return c.category === 'clean';
    if (filter === 'investigating') return c.status === 'investigating';
    if (filter === 'reviewed') return c.status === 'cleared' || c.status === 'frozen';
    return true;
  });

  const criticalCount = cases.filter(c => c.category === 'critical').length;
  const highCount = cases.filter(c => c.category === 'high').length;
  const cleanCount = cases.filter(c => c.category === 'clean').length;
  const investigatingCount = cases.filter(c => c.status === 'investigating').length;
  const reviewedCount = cases.filter(c => c.status === 'cleared' || c.status === 'frozen').length;

  const totalExposure = cases
    .filter(c => c.decision.includes('FLAGGED'))
    .reduce((acc, c) => acc + c.reimbursement, 0);

  return (
    <div className="tab-view active superbrain-view">
      {/* Header section */}
      <div className="superbrain-page-header">
        <div className="page-header-title-box">
          <div className="superbrain-chip">
            <span className="chip-dot" />
            Team Pulse Worklist
          </div>
          <h1 className="superbrain-page-title">
            Priority Review Queue & Auditor Worklist
          </h1>
          <p className="superbrain-page-desc">
            Calibrated risk rankings based on LightGBM probability scores and SHAP impact. 
            Auditors can inspect feature attributions, freeze disbursements, or fast-track clean claims.
          </p>
        </div>
      </div>

      {/* Summary KPI Strip (Superbrain Bento Cards) */}
      <div className="bento-kpi-grid queue-kpis">
        <div className="bento-card group">
          <div className="bento-watermark">01</div>
          <div className="bento-card-header">
            <span className="bento-card-label">TOTAL FLAGGED EXPOSURE</span>
            <span className="bento-card-icon-box text-rose-400">
              <HugeAlert size={18} />
            </span>
          </div>
          <div className="bento-card-value text-rose-400 font-mono">
            ${(totalExposure / 1000000).toFixed(2)}M
          </div>
          <div className="bento-card-sub danger">
            <span>Direct Financial Clawback Target</span>
          </div>
          <div className="bento-hairline-indicator accent-rose" />
        </div>

        <div className="bento-card group">
          <div className="bento-watermark">02</div>
          <div className="bento-card-header">
            <span className="bento-card-label">PENDING AUDIT</span>
            <span className="bento-card-icon-box text-amber-400">
              <HugeSearch size={18} />
            </span>
          </div>
          <div className="bento-card-value text-amber-400 font-mono">
            {investigatingCount}
          </div>
          <div className="bento-card-sub warning">
            <span>Active Audit Files Under Review</span>
          </div>
          <div className="bento-hairline-indicator accent-amber" />
        </div>

        <div className="bento-card group">
          <div className="bento-watermark">03</div>
          <div className="bento-card-header">
            <span className="bento-card-label">ACTIONED TODAY</span>
            <span className="bento-card-icon-box text-emerald-400">
              <HugeCheckCircle size={18} />
            </span>
          </div>
          <div className="bento-card-value text-emerald-400 font-mono">
            {reviewedCount}
          </div>
          <div className="bento-card-sub positive">
            <span>Frozen or Expedited Authorizations</span>
          </div>
          <div className="bento-hairline-indicator accent-emerald" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="superbrain-controls-panel">
        <div className="superbrain-filter-pills">
          <button
            type="button"
            className={`superbrain-filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Cases ({cases.length})
          </button>
          <button
            type="button"
            className={`superbrain-filter-pill ${filter === 'critical' ? 'active' : ''}`}
            onClick={() => setFilter('critical')}
          >
            <span className="status-dot-sm text-rose-400">●</span>
            Critical ({criticalCount})
          </button>
          <button
            type="button"
            className={`superbrain-filter-pill ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            <span className="status-dot-sm text-amber-400">●</span>
            High Risk ({highCount})
          </button>
          <button
            type="button"
            className={`superbrain-filter-pill ${filter === 'clean' ? 'active' : ''}`}
            onClick={() => setFilter('clean')}
          >
            <span className="status-dot-sm text-emerald-400">●</span>
            Cleared ({cleanCount})
          </button>
          <button
            type="button"
            className={`superbrain-filter-pill ${filter === 'investigating' ? 'active' : ''}`}
            onClick={() => setFilter('investigating')}
          >
            Under Review
          </button>
          <button
            type="button"
            className={`superbrain-filter-pill ${filter === 'reviewed' ? 'active' : ''}`}
            onClick={() => setFilter('reviewed')}
          >
            Reviewed Today
          </button>
        </div>

        <div className="superbrain-search-wrapper">
          <HugeSearch size={16} className="superbrain-search-icon" />
          <input
            type="text"
            placeholder="Search provider ID, name, archetype..."
            className="superbrain-search-input font-mono"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Review Queue Table */}
      <section className="superbrain-panel" style={{ marginTop: '1rem' }}>
        <div className="table-responsive-wrapper">
          <table className="superbrain-table">
            <thead>
              <tr>
                <th>Provider ID & Facility</th>
                <th>Clinical / Fraud Archetype</th>
                <th>Surgeries & Staff</th>
                <th>Reimbursement</th>
                <th>Calibrated Risk</th>
                <th>Triage State</th>
                <th>SIU Adjudication</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="provider-cell">
                      <span className="provider-id-tag font-mono">{c.id}</span>
                      <span className="provider-sub-tag">{c.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="archetype-pill font-mono">{c.tag}</span>
                  </td>
                  <td className="font-mono text-neutral-300">
                    {c.surgeries} Surgeries ({c.physicians} MDs)
                  </td>
                  <td className="font-mono font-semibold text-neutral-100">
                    ${c.reimbursement.toLocaleString()}
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
                    {c.status === 'frozen' ? (
                      <span className="status-tag tag-frozen">PAYOUTS FROZEN</span>
                    ) : c.status === 'cleared' ? (
                      <span className="status-tag tag-cleared">EXPEDITED CLEAR</span>
                    ) : (
                      <span className="status-tag tag-review">UNDER REVIEW</span>
                    )}
                  </td>
                  <td>
                    <div className="action-button-cluster">
                      <button
                        type="button"
                        className="action-btn-inspect"
                        onClick={() => onInspectCase(c.id)}
                        title="Load into SHAP Analyzer"
                      >
                        <HugeSearch size={13} />
                        <span>Inspect</span>
                      </button>
                      {c.status !== 'frozen' && c.decision.includes('FLAGGED') && (
                        <button
                          type="button"
                          className="action-btn-freeze"
                          onClick={() => onTriageAction(c.id, 'FREEZE')}
                          title="Freeze Disbursements Immediately"
                        >
                          <HugeFreeze size={13} />
                          <span>Freeze</span>
                        </button>
                      )}
                      {c.status !== 'cleared' && !c.decision.includes('FLAGGED') && (
                        <button
                          type="button"
                          className="action-btn-clear"
                          onClick={() => onTriageAction(c.id, 'CLEAR')}
                          title="Authorize Payment"
                        >
                          <HugeCheckCircle size={13} />
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
    </div>
  );
}
