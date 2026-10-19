import React, { useState } from 'react';
import { 
  ClipboardList, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Check, 
  ShieldBan, 
  Filter 
} from 'lucide-react';

export default function ReviewQueue({ 
  cases, 
  onInspectCase, 
  onTriageAction 
}) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter((c) => {
    // Search match
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      c.id.toLowerCase().includes(q) || 
      c.name.toLowerCase().includes(q) || 
      c.tag.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Filter match
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
    <div className="tab-view active">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={26} className="text-accent" strokeWidth={1.8} />
            Priority Review Queue & Investigator Worklist
          </h1>
          <p className="page-description">
            Calibrated risk rankings based on LightGBM probability scores and SHAP impact. 
            Auditors can score, freeze disbursements, or fast-track clean reimbursements.
          </p>
        </div>
      </div>

      {/* Summary KPI Strip for Queue */}
      <div className="kpi-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL FLAGGED EXPOSURE</span>
            <span className="kpi-icon"><AlertCircle size={18} className="text-danger" /></span>
          </div>
          <div className="kpi-value danger-text">${(totalExposure / 1000000).toFixed(2)}M</div>
          <div className="kpi-sub danger">Direct Financial Clawback Target</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">PENDING INVESTIGATION</span>
            <span className="kpi-icon"><Search size={18} className="text-accent" /></span>
          </div>
          <div className="kpi-value highlight-text">{investigatingCount}</div>
          <div className="kpi-sub warning">Active Audit Files Under Review</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">ACTIONED TODAY</span>
            <span className="kpi-icon"><CheckCircle2 size={18} className="text-success" /></span>
          </div>
          <div className="kpi-value">{reviewedCount}</div>
          <div className="kpi-sub positive">Frozen or Expedited Authorizations</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="queue-controls-bar">
        <div className="queue-filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Cases ({cases.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'critical' ? 'active' : ''}`}
            onClick={() => setFilter('critical')}
          >
            <AlertCircle size={14} className="text-danger" style={{ marginRight: '4px' }} />
            Critical Risk ({criticalCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            <AlertTriangle size={14} className="text-warning" style={{ marginRight: '4px' }} />
            High Risk ({highCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'clean' ? 'active' : ''}`}
            onClick={() => setFilter('clean')}
          >
            <CheckCircle2 size={14} className="text-success" style={{ marginRight: '4px' }} />
            Auto-Cleared ({cleanCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'investigating' ? 'active' : ''}`}
            onClick={() => setFilter('investigating')}
          >
            <Search size={14} className="text-accent" style={{ marginRight: '4px' }} />
            Under Investigation
          </button>
          <button 
            className={`filter-btn ${filter === 'reviewed' ? 'active' : ''}`}
            onClick={() => setFilter('reviewed')}
          >
            <Check size={14} className="text-success" style={{ marginRight: '4px' }} />
            Reviewed Today
          </button>
        </div>

        <div className="queue-search-input-wrapper">
          <Search size={16} className="search-icon-inside" />
          <input 
            type="text" 
            placeholder="Search provider, claim ID, or archetype..." 
            className="queue-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Review Queue Table */}
      <section className="dashboard-card" style={{ marginTop: '1rem' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Provider ID & Name</th>
                <th>Clinical / Fraud Archetype</th>
                <th>Inpatient Surgeries</th>
                <th>Total Payout</th>
                <th>Fraud Risk</th>
                <th>Status</th>
                <th>Audit Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="provider-cell">
                      <span className="provider-id">{c.id}</span>
                      <span className="provider-type">{c.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="archetype-tag">{c.tag}</span>
                  </td>
                  <td className="mono-text">{c.surgeries} Surgeries ({c.physicians} docs)</td>
                  <td className="mono-text font-bold">${c.reimbursement.toLocaleString()}</td>
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
                    {c.status === 'frozen' ? (
                      <span className="badge badge-danger">PAYOUTS FROZEN</span>
                    ) : c.status === 'cleared' ? (
                      <span className="badge badge-success">EXPEDITED CLEAR</span>
                    ) : (
                      <span className="badge badge-cyan">UNDER REVIEW</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons-flex">
                      <button 
                        className="btn-table-action"
                        onClick={() => onInspectCase(c.id)}
                        title="Load into SHAP Analyzer"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Search size={13} /> Inspect
                      </button>
                      {c.status !== 'frozen' && c.decision.includes('FLAGGED') && (
                        <button 
                          className="btn-table-action btn-freeze"
                          onClick={() => onTriageAction(c.id, 'FREEZE')}
                          title="Freeze Disbursements Immediately"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <ShieldBan size={13} /> Freeze
                        </button>
                      )}
                      {c.status !== 'cleared' && !c.decision.includes('FLAGGED') && (
                        <button 
                          className="btn-table-action btn-clear"
                          onClick={() => onTriageAction(c.id, 'CLEAR')}
                          title="Authorize Payment"
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
    </div>
  );
}
