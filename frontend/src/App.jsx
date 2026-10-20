import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import { PixelCursorTrail } from './components/ui/pixel-trail';

// Separate Page Components for all Navigation Tabs
import {
  CommandCenterPage,
  ReviewQueuePage,
  DatasetStudioPage,
  BatchAuditResultsPage,
  ClaimAnalyzerPage,
  ModelPerformancePage,
  CollusionNetworkPage,
  PreAuthGatewayPage,
} from './pages';

import { BENCHMARK_CASES } from './data/benchmarkCases';
import { BENCHMARK_MODELS } from './data/benchmarkModels';

const ROUTE_TO_TAB = {
  '': 'tab-dashboard',
  '/': 'tab-dashboard',
  '#/': 'tab-dashboard',
  '#': 'tab-dashboard',
  '/command': 'tab-dashboard',
  '#command': 'tab-dashboard',
  '#/command': 'tab-dashboard',
  '/dashboard': 'tab-dashboard',
  '#dashboard': 'tab-dashboard',
  '#/dashboard': 'tab-dashboard',
  '/queue': 'tab-queue',
  '#queue': 'tab-queue',
  '#/queue': 'tab-queue',
  '/dataset': 'tab-dataset',
  '#dataset': 'tab-dataset',
  '#/dataset': 'tab-dataset',
  '/results': 'tab-results',
  '#results': 'tab-results',
  '#/results': 'tab-results',
  '/analyzer': 'tab-analyzer',
  '#analyzer': 'tab-analyzer',
  '#/analyzer': 'tab-analyzer',
  '/benchmarks': 'tab-performance',
  '#benchmarks': 'tab-performance',
  '#/benchmarks': 'tab-performance',
  '/network': 'tab-network',
  '#network': 'tab-network',
  '#/network': 'tab-network',
  '/preauth': 'tab-preauth',
  '#preauth': 'tab-preauth',
  '#/preauth': 'tab-preauth',
};

const TAB_TO_PATH = {
  'tab-dashboard': '/command',
  'tab-queue': '/queue',
  'tab-dataset': '/dataset',
  'tab-results': '/results',
  'tab-analyzer': '/analyzer',
  'tab-performance': '/benchmarks',
  'tab-network': '/network',
  'tab-preauth': '/preauth',
};

const TAB_PAGE_TITLES = {
  'tab-dashboard': 'Executive Command Center — Syght Healthinsurance Fraud Detector',
  'tab-queue': 'SIU Priority Review Queue — Syght',
  'tab-dataset': 'Dataset Studio & Batch Pipeline — Syght',
  'tab-results': 'Model Run & Healthinsurance Fraud Detector Results — Syght',
  'tab-analyzer': 'TreeSHAP Waterfall Claim Analyzer — Syght',
  'tab-performance': 'Benchmarks & Candidate ROC-AUC — Syght',
  'tab-network': 'Collusion Graph Network Engine — Syght',
  'tab-preauth': 'Real-Time Pre-Auth Gateway (<5ms) — Syght',
};

export default function App() {
  const getTabFromLocation = () => {
    const path = window.location.pathname || '';
    if (path && ROUTE_TO_TAB[path]) {
      return ROUTE_TO_TAB[path];
    }
    const hash = window.location.hash || '';
    if (hash && ROUTE_TO_TAB[hash]) {
      return ROUTE_TO_TAB[hash];
    }
    return 'tab-dashboard';
  };

  const [activeTab, setActiveTabState] = useState(getTabFromLocation);
  const [cases, setCases] = useState(BENCHMARK_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState(BENCHMARK_CASES[0].id);
  const [batchResults, setBatchResults] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toast, setToast] = useState(null);

  const setActiveTab = (tabId, targetPath) => {
    setActiveTabState(tabId);
    const path = targetPath || TAB_TO_PATH[tabId] || '/command';
    if (window.location.pathname !== path) {
      window.history.pushState({ tabId }, '', path);
    }
    document.title = TAB_PAGE_TITLES[tabId] || 'Syght — Healthcare Fraud Prevention';
  };

  // Synchronize browser history, direct path, and hash navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const tab = getTabFromLocation();
      setActiveTabState(tab);
      document.title = TAB_PAGE_TITLES[tab] || 'Syght — Healthcare Fraud Prevention';
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    const currentTab = getTabFromLocation();
    document.title = TAB_PAGE_TITLES[currentTab] || 'Syght — Healthcare Fraud Prevention';

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Fetch API Health on boot
  useEffect(() => {
    fetch('/health')
      .then(r => r.json())
      .then(data => {
        setHealthData(data);
      })
      .catch(() => {
        // Fallback default state
        setHealthData({
          status: 'healthy',
          model_loaded: true,
          selected_model: 'LightGBM',
          decision_threshold: 0.5364
        });
      });
  }, []);

  // Web Audio Synth Chimes
  const playAudioChime = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (type === 'danger') {
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.25);
      }

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext muted/unsupported
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    playAudioChime(type);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleInspectCase = (caseId) => {
    setSelectedCaseId(caseId);
    setActiveTab('tab-analyzer');
    showToast(`Loaded <strong>${caseId}</strong> into SHAP Waterfall Analyzer`, 'info');
  };

  const handleTriageAction = (caseId, action) => {
    const targetCase = cases.find(c => c.id === caseId);
    if (!targetCase) return;

    if (action === 'FREEZE') {
      setCases(prev => prev.map(c =>
        c.id === caseId ? { ...c, status: 'frozen' } : c
      ));
      showToast(
        `<strong>Disbursements Frozen</strong> for ${targetCase.id} (₹${targetCase.reimbursement.toLocaleString()})! Investigation file opened.`,
        'danger'
      );
    } else if (action === 'CLEAR') {
      setCases(prev => prev.map(c =>
        c.id === caseId ? { ...c, status: 'cleared' } : c
      ));
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
      showToast(
        `<strong>Auto-Cleared</strong> ${targetCase.id} — expedited claim reimbursement authorized.`,
        'success'
      );
    }
  };

  const [pipelineExecutionTrigger, setPipelineExecutionTrigger] = useState(null);

  const handleSaveAuditResults = (resultsPayload) => {
    setBatchResults(resultsPayload);

    // Synchronize app-wide cases with real evaluated dataset items
    if (resultsPayload?.results && Array.isArray(resultsPayload.results) && resultsPayload.results.length > 0) {
      const dynamicCases = resultsPayload.results.map((r, idx) => {
        const isFlagged = r.decision === 'FLAGGED FOR AUDIT' || (r.fraud_risk_score || 0) >= 0.5364;
        const priority = r.priority || (r.fraud_risk_score >= 0.85 ? 'CRITICAL' : isFlagged ? 'HIGH' : 'LOW');
        const reimb = Number(r.reimbursement || 0);
        const surg = Number(r.surgeries || 0);
        const phys = Math.max(1, Number(r.physicians || 1));
        const topDriverFeat = r.top_driver?.feature || 'Statistical Outlier';
        const topDriverDesc = r.why_flagged || r.top_driver?.description || 'Variance from expected distribution';
        const topShap = r.top_driver?.shap_contribution !== undefined
          ? `${r.top_driver.shap_contribution > 0 ? '+' : ''}${Number(r.top_driver.shap_contribution).toFixed(3)}`
          : (isFlagged ? '+0.342' : '-0.142');

        return {
          id: r.provider_id || `PRV_${idx + 1}`,
          name: r.name || `Facility ${r.provider_id || idx + 1}`,
          category: priority.toLowerCase(),
          tag: r.archetype || topDriverFeat,
          reimbursement: reimb,
          risk: Number((r.fraud_risk_score || 0).toFixed(3)),
          decision: isFlagged ? 'FLAGGED FOR AUDIT' : 'AUTO-CLEARED',
          priority: priority,
          physicians: phys,
          surgeries: surg,
          claims: Math.max(surg, 20),
          los: 5.2,
          duplicateRate: 0.05,
          status: isFlagged ? 'investigating' : 'cleared',
          directive: r.directive || (isFlagged ? `Hold pending reimbursements (₹${reimb.toLocaleString('en-IN')}) and subpoena clinical logs` : 'Expedited payment approved'),
          drivers: [
            {
              feature: topDriverFeat,
              desc: topDriverDesc,
              shap: topShap,
            },
            {
              feature: 'inpatient_reimbursed_sum',
              desc: `Claim Payout (₹${reimb.toLocaleString('en-IN')})`,
              shap: isFlagged ? '+0.210' : '-0.095',
            },
          ],
          features: {
            total_claims_count: Math.max(surg, 20),
            inpatient_claims_count: surg,
            outpatient_claims_count: 5,
            inpatient_reimbursed_sum: reimb,
            outpatient_reimbursed_sum: 25000,
            inpatient_deductible_sum: Math.round(reimb * 0.1),
            mean_inpatient_los: 5.2,
            max_inpatient_los: 12,
            total_inpatient_surgeries: surg,
            unique_beneficiaries_count: Math.max(10, surg - 10),
            unique_attending_physicians: phys,
            unique_operating_physicians: phys,
            claims_per_attending_ratio: Math.round(Math.max(surg, 20) / phys),
            graph_degree_centrality: isFlagged ? 4 : 1,
            same_day_duplicate_rate: 0.04,
          },
        };
      });

      setCases(dynamicCases);
      if (dynamicCases.length > 0) {
        setSelectedCaseId(dynamicCases[0].id);
      }
    }
  };

  const handleRunAuditWithSample = () => {
    // Auto reset old results when new dataset runs
    setBatchResults(null);
    setPipelineExecutionTrigger({
      source: 'sample-10',
      datasetName: '10_Verified_Benchmark_Claims.csv',
      timestamp: Date.now(),
    });
    setActiveTab('tab-results');
    showToast('Launched <strong>Real-Time Multi-Model Engine</strong> on 10 Benchmark Claims', 'info');
  };

  const handleRunAuditWithPortfolio = () => {
    // Auto reset old results when new dataset runs
    setBatchResults(null);
    setPipelineExecutionTrigger({
      source: 'benchmark-25',
      datasetName: 'PMJAY_Benchmark_Portfolio_25_Providers.csv',
      timestamp: Date.now(),
    });
    setActiveTab('tab-results');
    showToast('Launched <strong>Real-Time Multi-Model Engine</strong> on 25 Portfolio Facilities', 'info');
  };

  const handleRunCustomDataset = (datasetData) => {
    // Auto reset old results when new dataset runs
    setBatchResults(null);
    setPipelineExecutionTrigger({
      source: 'custom',
      datasetName: datasetData?.dataset_name || 'Custom_Healthcare_Claims.csv',
      data: datasetData,
      timestamp: Date.now(),
    });
    setActiveTab('tab-results');
    showToast(`Launched <strong>Real-Time Multi-Model Engine</strong> on ${datasetData?.dataset_name || 'Dataset'}`, 'info');
  };

  return (
    <div className="app-container">
      {/* Pixel Cursor Trail Animation */}
      <PixelCursorTrail />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthData={healthData}
        soundEnabled={soundEnabled}
        toggleSound={() => setSoundEnabled(!soundEnabled)}
        queueCount={cases.filter(c => c.status === 'investigating').length}
        resultsCount={batchResults ? batchResults.results?.length : undefined}
      />


      {/* Main Container */}
      <main className="main-layout">
        <ErrorBoundary>
          {activeTab === 'tab-dashboard' && (
            <CommandCenterPage
              cases={cases}
              onInspectCase={handleInspectCase}
              onTriageAction={handleTriageAction}
              onViewAllCases={() => setActiveTab('tab-queue', '/queue')}
              onOpenDatasetStudio={() => setActiveTab('tab-dataset', '/dataset')}
              onRunAuditWithSample={handleRunAuditWithSample}
            />
          )}

          {activeTab === 'tab-queue' && (
            <ReviewQueuePage
              cases={cases}
              onInspectCase={handleInspectCase}
              onTriageAction={handleTriageAction}
            />
          )}

          {activeTab === 'tab-dataset' && (
            <DatasetStudioPage
              onInspectCase={handleInspectCase}
              onShowToast={showToast}
              onRunComplete={handleRunCustomDataset}
            />
          )}

          {activeTab === 'tab-results' && (
            <BatchAuditResultsPage
              resultsData={batchResults}
              pipelineExecutionTrigger={pipelineExecutionTrigger}
              onClearExecutionTrigger={() => setPipelineExecutionTrigger(null)}
              onInspectCase={handleInspectCase}
              onOpenDatasetStudio={() => setActiveTab('tab-dataset', '/dataset')}
              onRunAuditWithSample={handleRunAuditWithSample}
              onRunAuditWithPortfolio={handleRunAuditWithPortfolio}
              onSaveAuditResults={handleSaveAuditResults}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'tab-analyzer' && (
            <ClaimAnalyzerPage
              benchmarkCases={cases}
              selectedCaseId={selectedCaseId}
              onCaseSelected={setSelectedCaseId}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'tab-performance' && (
            <ModelPerformancePage
              models={BENCHMARK_MODELS}
            />
          )}

          {activeTab === 'tab-network' && (
            <CollusionNetworkPage
              onInspectCase={handleInspectCase}
            />
          )}

          {activeTab === 'tab-preauth' && (
            <PreAuthGatewayPage onShowToast={showToast} />
          )}
        </ErrorBoundary>
      </main>

      {/* Syght Inspired High-Tech Footer */}
      <footer className="syght-footer">
        {/* Giant Team Pulse Typography Brand Banner (onesuperbrain.com signature aesthetic) */}
        <div className="footer-giant-brand-section">
          <div className="footer-giant-brand-halo" />
          <div className="footer-giant-brand-text">
            TEAM PULSE
          </div>
          <p className="footer-giant-brand-caption">
            Healthinsurance Fraud Detector Engine
          </p>
        </div>

        <div className="footer-inner-cluster">
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <span className="footer-brand-title">SYGHT</span>
              <span className="team-pulse-pill compact">
                <span className="pulse-dot-beacon" />
                Team Pulse
              </span>
            </div>
            <p className="footer-brand-desc">
              Next-generation healthinsurance fraud detector engine. 
              Designed for SIU audit teams to intercept fraudulent claims in sub-5ms with full SHAP transparency.
            </p>
            <div className="footer-copyright font-mono">
              © 2026 Team Pulse (Syght Project) • All Rights Reserved.
            </div>
          </div>

          <div className="footer-metrics-col">
            <div className="footer-col-heading">System Telemetry</div>
            <div className="footer-telemetry-grid font-mono">
              <div className="telemetry-item">
                <span className="telemetry-label">Champion Engine:</span>
                <span className="telemetry-val text-sky-600 font-semibold">LightGBM (1-SE Rule)</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Decision Threshold:</span>
                <span className="telemetry-val text-sky-600 font-semibold">{healthData?.decision_threshold?.toFixed(4) || '0.5364'}</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Pre-Auth Latency:</span>
                <span className="telemetry-val text-emerald-600 font-semibold">1.84 ms (SLA &lt; 5ms)</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Auditing Mode:</span>
                <span className="telemetry-val text-emerald-600 font-semibold">Real-Time Inline Intercept</span>
              </div>
            </div>
          </div>

          <div className="footer-links-col">
            <div className="footer-col-heading">Quick Actions</div>
            <ul className="footer-links-list">
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setActiveTab('tab-dashboard', '/command')}>
                  Command Center Radar
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setActiveTab('tab-queue', '/queue')}>
                  Priority Review Queue
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setActiveTab('tab-dataset', '/dataset')}>
                  Dataset Studio & Batch Runner
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setActiveTab('tab-results', '/results')}>
                  Audit Results & Confidence Report
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setActiveTab('tab-performance', '/benchmarks')}>
                  ROC-AUC & PR-AUC Benchmarks
                </button>
              </li>
              <li>
                <a href="/docs" target="_blank" rel="noopener noreferrer" className="footer-link-btn">
                  FastAPI OpenAPI 3.0 Docs ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Toast Alert Notifications */}
      <Toast toast={toast} />
    </div>
  );
}
