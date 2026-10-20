import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  GlobeIcon,
  Scissor01Icon,
  GitForkIcon,
  Hospital01Icon,
  Shield01Icon,
  SparklesIcon,
  FlashIcon,
} from '@hugeicons/core-free-icons';
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

const SHAP_DATASETS = {
  global: {
    key: 'global',
    title: 'Global Portfolio Baseline (25 Facilities)',
    subtitle: 'Cross-validated TreeSHAP feature attributions across full PM-JAY provider network',
    topPositive: { name: 'Inpatient Payout Share (>80%)', val: '+0.342' },
    topNegative: { name: 'Community Outpatient Volume', val: '-0.195' },
    labels: [
      'Inpatient Payout Share (>80%)',
      'Surgeries / MD Outlier Ratio',
      'Attending Doctor Monopoly',
      'Bipartite Graph Centrality',
      'Same-Day Procedure Splitting',
      'ICU Stay Duration Drift',
      'Post-Mortem Claim Submissions',
      'Standard Clinical Protocol LOS',
      'Attending Physician Diversity',
      'Community Outpatient Volume',
    ],
    values: [0.342, 0.315, 0.285, 0.264, 0.218, 0.198, 0.182, -0.140, -0.162, -0.195],
    descriptions: [
      'Facilities with >80% inpatient billing face +3.8x higher odds of systemic phantom hospitalization.',
      'Surgical volume exceeding 200 operations per doctor indicates fabricated theatre logs.',
      'Single physician billing >65% of all hospital claims indicates kickback recycling.',
      'Doctor appearing across 3+ distinct hospitals within 24 hours in bipartite collusion ring.',
      'Artificial splitting of single diagnostic procedures into multiple distinct codes.',
      'ICU stays >8.5 days exceeding standard protocol for admitted ICD diagnosis.',
      'Claims submitted with dates of service timestamped after beneficiary DOD.',
      'Mean length of stay conforming strictly to ICD protocol and package norms.',
      'Broad roster of credentialed attending and operating specialists.',
      'High proportion of verified outpatient visits indicating genuine community healthcare.',
    ],
  },
  prv02: {
    key: 'prv02',
    title: 'Ghost Surgery Mill (PRV_02 — Apex Life Surgical)',
    subtitle: '460 surgeries billed by 2 doctors in 30 days (impossible surgical capacity)',
    topPositive: { name: 'Surgeries per MD Ratio (230x)', val: '+0.412' },
    topNegative: { name: 'Community Outpatient Share', val: '-0.042' },
    labels: [
      'Surgeries per Doctor (230/MD)',
      'Inpatient Reimbursed Sum (₹5.1M)',
      'Claims per Physician (240x)',
      'Isolated Loop Doctor Network',
      'Inpatient Deductible Volume',
      'Same-Day Duplicate Submissions',
      'Community Outpatient Share',
    ],
    values: [0.412, 0.324, 0.288, 0.195, 0.142, 0.085, -0.042],
    descriptions: [
      '460 inpatient surgeries billed by only 2 doctors in 30 days (impossible surgical capacity).',
      '₹5,100,000 surgical payouts concentrated in ghost abdominal procedures.',
      'Claim volume per attending MD exceeds 99.8th percentile.',
      'Physicians do not admit patients at any other recognized hospital.',
      'High deductible sum billed directly without supporting laboratory panels.',
      'Repeated claims submitted for same beneficiary on identical day.',
      'Negligible outpatient presence (<4% of total claims).',
    ],
  },
  prv03: {
    key: 'prv03',
    title: 'Doctor Recycling Syndicate (PRV_03 — Metro Health Syndicate)',
    subtitle: '34 syndicated doctors rotating across 11 hospital branches in kickback network',
    topPositive: { name: 'Bipartite Graph Centrality (95%)', val: '+0.388' },
    topNegative: { name: 'Outpatient Payout Offsets', val: '-0.065' },
    labels: [
      'Bipartite Graph Centrality (95%)',
      'Roving Doctor Network (34 MDs)',
      'Cross-Admit Referral Kickbacks',
      'High Inpatient Sum (₹8.9M)',
      'High Deductible Accumulation',
      'Unique Beneficiary Overlap',
      'Outpatient Payout Offsets',
    ],
    values: [0.388, 0.325, 0.294, 0.235, 0.148, 0.112, -0.065],
    descriptions: [
      '34 doctors shared across 11 syndicated hospital branches in coordinated collusion loop.',
      'High eigenvector centrality indicating hospital acts as central clearing hub for kickbacks.',
      'Systematic cross-referrals between affiliated diagnostic clinics and surgical centres.',
      '₹8,900,000 in aggregated payouts across syndicated facilities.',
      'Inflated patient co-pay and deductible invoices.',
      'Beneficiaries cycled through multiple sister clinics within 14 days.',
      'Limited legitimate primary care checkups.',
    ],
  },
  prv08: {
    key: 'prv08',
    title: 'ICU Stay Upcoding Network (PRV_08 — St. Jude Critical Care)',
    subtitle: 'Mean ICU duration of 16.8 days with artificial ventilator prolongation up to 48 days',
    topPositive: { name: 'ICU Mean Stay (16.8 Days)', val: '+0.445' },
    topNegative: { name: 'Attending Doctor Credentialing', val: '-0.088' },
    labels: [
      'ICU Mean Stay (16.8 Days)',
      'Prolonged Stay Outlier (Max 48D)',
      'ICU Admission Ratio (100% IP)',
      'High Per-Admission Cost (₹4.2M)',
      'Ventilator Billing Duration',
      'Surgical Ratio Concordance',
      'Attending Doctor Credentialing',
    ],
    values: [0.445, 0.312, 0.245, 0.210, 0.165, -0.052, -0.088],
    descriptions: [
      'Mean ICU stay of 16.8 days conflicts with admitted diagnostic package (standard 3.2 days).',
      'Extreme outlier patients retained up to 48 days in intensive care without medical justification.',
      '100% of admitted patients routed to intensive care beds.',
      'Average cost per admission exceeds regional benchmark by 340%.',
      'Extended mechanical ventilation billed without arterial blood gas records.',
      'Surgeries per physician remain within normal institutional bounds.',
      'Doctors have valid state medical registrations.',
    ],
  },
  prv04: {
    key: 'prv04',
    title: 'Accredited Rural Kendra (PRV_04 — Clean Baseline)',
    subtitle: 'Compliant primary healthcare facility with balanced community volume and zero anomalies',
    topPositive: { name: 'Inpatient Payouts Proportion', val: '+0.048' },
    topNegative: { name: 'Outpatient Consultation Volume', val: '-0.310' },
    labels: [
      'Outpatient Consultation Volume',
      'Physician Roster Diversity (18 MDs)',
      'Protocol Concordant LOS (2.8D)',
      'Low Claim-to-MD Ratio (14.2x)',
      'Negligible Duplicate Rate (0.2%)',
      'Low Inpatient Surgical Volume',
      'Inpatient Payouts Proportion',
    ],
    values: [-0.310, -0.265, -0.220, -0.185, -0.142, -0.095, 0.048],
    descriptions: [
      'Broad volume of community primary care visits conforms to rural health center norms.',
      '18 independent local doctors with diverse specialties and balanced caseloads.',
      'Average inpatient stay of 2.8 days aligns strictly with PM-JAY package protocols.',
      'Low claims per doctor indicates healthy physician workload and no phantom billing.',
      'Minimal duplicate submissions within normal administrative error margins.',
      'Surgery count proportional to minor community procedures.',
      'Inpatient reimbursement represents small, appropriate fraction of total budget.',
    ],
  },
};

export default function CommandCenter({
  cases,
  onInspectCase,
  onTriageAction,
  onViewAllCases,
  onOpenDatasetStudio,
  onRunAuditWithSample,
}) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditSummary, setAuditSummary] = useState(null);

  // TreeSHAP Interactive Graph State
  const [activeShapKey, setActiveShapKey] = useState('global');
  const shapChartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const activeShapData = SHAP_DATASETS[activeShapKey] || SHAP_DATASETS.global;

  useEffect(() => {
    if (!shapChartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = activeShapData.labels;
    const values = activeShapData.values;
    const descriptions = activeShapData.descriptions;

    const backgroundColors = values.map((val) =>
      val >= 0 ? 'rgba(225, 29, 72, 0.88)' : 'rgba(16, 185, 129, 0.88)'
    );
    const borderColors = values.map((val) =>
      val >= 0 ? '#e11d48' : '#10b981'
    );

    chartInstanceRef.current = new Chart(shapChartRef.current, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'TreeSHAP Additive Contribution',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1.5,
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 600,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.96)',
            titleFont: { family: 'Space Grotesk', size: 12, weight: '700' },
            bodyFont: { family: 'Space Grotesk', size: 11 },
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                const val = context.raw;
                const sign = val >= 0 ? '+' : '';
                return `SHAP Value: ${sign}${val.toFixed(3)} (${val >= 0 ? 'Pushes toward Fraud' : 'Pulls toward Clean'})`;
              },
              afterLabel: function (context) {
                const desc = descriptions[context.dataIndex] || '';
                return `Clinical Insight: ${desc}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: function (context) {
                if (context.tick && context.tick.value === 0) return 'rgba(15, 23, 42, 0.5)';
                return 'rgba(0, 0, 0, 0.05)';
              },
              lineWidth: function (context) {
                if (context.tick && context.tick.value === 0) return 2;
                return 1;
              },
            },
            ticks: {
              font: { family: 'JetBrains Mono', size: 10, weight: '600' },
              color: '#64748b',
              callback: function (val) {
                return (val >= 0 ? '+' : '') + Number(val).toFixed(2);
              },
            },
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { family: 'Space Grotesk', size: 11, weight: '600' },
              color: '#1e293b',
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [activeShapKey, activeShapData]);

  const urgentCases = cases.slice(0, 5);

  const handleRunAudit = () => {
    if (onRunAuditWithSample) {
      onRunAuditWithSample();
      return;
    }
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
            <span className="hero-pill-text">Team Pulse Engineering • Healthinsurance Fraud Detector</span>
          </div>

          <h1 className="hero-headline">
            <span className="hero-headline-primary">Healthinsurance Fraud Detector</span>
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

      {/* Leading TreeSHAP Risk Drivers & Feature Contributions Card */}
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
          <span className="syght-chip font-mono">TreeSHAP Explainer</span>
        </div>

        {/* Archetype / Scenario Selector Pills */}
        <div className="shap-archetype-pills-row">
          <span className="shap-pills-label font-mono">Select Typology Signature:</span>
          <div className="shap-pills-list">
            <button
              type="button"
              className={`shap-pill-btn ${activeShapKey === 'global' ? 'active' : ''}`}
              onClick={() => setActiveShapKey('global')}
            >
              <HugeiconsIcon icon={GlobeIcon} size={15} />
              <span>Global Portfolio Baseline</span>
            </button>
            <button
              type="button"
              className={`shap-pill-btn ${activeShapKey === 'prv02' ? 'active' : ''}`}
              onClick={() => setActiveShapKey('prv02')}
            >
              <HugeiconsIcon icon={Scissor01Icon} size={15} />
              <span>Ghost Surgery Mill (PRV_02)</span>
            </button>
            <button
              type="button"
              className={`shap-pill-btn ${activeShapKey === 'prv03' ? 'active' : ''}`}
              onClick={() => setActiveShapKey('prv03')}
            >
              <HugeiconsIcon icon={GitForkIcon} size={15} />
              <span>Kickback Syndicate (PRV_03)</span>
            </button>
            <button
              type="button"
              className={`shap-pill-btn ${activeShapKey === 'prv08' ? 'active' : ''}`}
              onClick={() => setActiveShapKey('prv08')}
            >
              <HugeiconsIcon icon={Hospital01Icon} size={15} />
              <span>ICU Stay Upcoding (PRV_08)</span>
            </button>
            <button
              type="button"
              className={`shap-pill-btn ${activeShapKey === 'prv04' ? 'active' : ''}`}
              onClick={() => setActiveShapKey('prv04')}
            >
              <HugeiconsIcon icon={Shield01Icon} size={15} />
              <span>Clean Rural Kendra (PRV_04)</span>
            </button>
          </div>
        </div>

        {/* Mathematical SHAP Metric Chips Bar */}
        <div className="shap-metrics-bar">
          <div className="shap-metric-item">
            <span className="shap-metric-lbl">ACTIVE SIGNATURE</span>
            <span className="shap-metric-val">{activeShapData.title.split(' (')[0]}</span>
          </div>
          <div className="shap-metric-item">
            <span className="shap-metric-lbl">TOP RISK DRIVER</span>
            <span className="shap-metric-val text-rose font-mono">
              {activeShapData.topPositive.val} ({activeShapData.topPositive.name.split(' (')[0]})
            </span>
          </div>
          <div className="shap-metric-item">
            <span className="shap-metric-lbl">TOP PROTECTIVE FACTOR</span>
            <span className="shap-metric-val text-emerald font-mono">
              {activeShapData.topNegative.val} ({activeShapData.topNegative.name.split(' (')[0]})
            </span>
          </div>
          <div className="shap-metric-item">
            <span className="shap-metric-lbl">BASE E[f(x)] / CUTOFF</span>
            <span className="shap-metric-val font-mono">
              0.128 / <strong className="text-sky-600">0.5364</strong>
            </span>
          </div>
        </div>

        {/* The Interactive TreeSHAP Chart Canvas Box */}
        <div className="shap-interactive-chart-box">
          <div className="shap-chart-header">
            <div>
              <div className="shap-chart-title">
                {activeShapData.title}
              </div>
              <div className="shap-chart-subtitle">
                {activeShapData.subtitle}
              </div>
            </div>
            <div className="shap-legend-row">
              <span className="shap-legend-chip rose">
                <span className="shap-legend-dot bg-rose" />
                <span>+ Pushes Toward Audit (Risk)</span>
              </span>
              <span className="shap-legend-chip emerald">
                <span className="shap-legend-dot bg-emerald" />
                <span>- Pulls Toward Clean (Protective)</span>
              </span>
            </div>
          </div>

          <div className="shap-chart-canvas-wrapper">
            <canvas ref={shapChartRef} />
          </div>
        </div>

        <div className="syght-banner-notice mt-4">
          <IconShield size={18} className="text-sky-600 shrink-0 mt-0.5" />
          <div className="flex items-center justify-between gap-4 w-full flex-wrap">
            <div>
              <strong>Defensible Due Process:</strong> All risk scores are accompanied by exact mathematical TreeSHAP attributions 
              ensuring clear, defensible evidence for legal clawback proceedings and administrative hearings.
            </div>
            <button
              type="button"
              className="syght-btn-secondary text-xs px-3 py-1 font-mono"
              onClick={() => onInspectCase('PRV_02_PHANTOM_SURGERY_MILL')}
              title="Open Deep SHAP Waterfall Analyzer"
            >
              <span>Inspect in SHAP Analyzer ↗</span>
            </button>
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
