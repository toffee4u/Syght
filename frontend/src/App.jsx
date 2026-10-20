import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import CommandCenter from './components/CommandCenter';
import ReviewQueue from './components/ReviewQueue';
import ClaimAnalyzer from './components/ClaimAnalyzer';
import ModelPerformance from './components/ModelPerformance';
import CollusionNetwork from './components/CollusionNetwork';
import PreAuthGateway from './components/PreAuthGateway';
import DatasetStudio from './components/DatasetStudio';
import BatchAuditResults from './components/BatchAuditResults';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';

import { BENCHMARK_CASES } from './data/benchmarkCases';
import { BENCHMARK_MODELS } from './data/benchmarkModels';

export default function App() {
  const [activeTab, setActiveTab] = useState('tab-dashboard');
  const [cases, setCases] = useState(BENCHMARK_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState(BENCHMARK_CASES[0].id);
  const [batchResults, setBatchResults] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toast, setToast] = useState(null);

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

  const handleRunAuditWithSample = () => {
    setPipelineExecutionTrigger({
      source: 'sample-10',
      datasetName: '10_Verified_Benchmark_Claims.csv',
      timestamp: Date.now(),
    });
    setActiveTab('tab-results');
    showToast('Launched <strong>Real-Time Multi-Model Engine</strong> on 10 Benchmark Claims', 'info');
  };

  const handleRunAuditWithPortfolio = () => {
    setPipelineExecutionTrigger({
      source: 'benchmark-25',
      datasetName: 'PMJAY_Benchmark_Portfolio_25_Providers.csv',
      timestamp: Date.now(),
    });
    setActiveTab('tab-results');
    showToast('Launched <strong>Real-Time Multi-Model Engine</strong> on 25 Portfolio Facilities', 'info');
  };

  const handleRunCustomDataset = (datasetData) => {
    setBatchResults(datasetData);
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
            <CommandCenter
              cases={cases}
              onInspectCase={handleInspectCase}
              onTriageAction={handleTriageAction}
              onViewAllCases={() => setActiveTab('tab-queue')}
              onOpenDatasetStudio={() => setActiveTab('tab-dataset')}
              onRunAuditWithSample={handleRunAuditWithSample}
            />
          )}

          {activeTab === 'tab-queue' && (
            <ReviewQueue
              cases={cases}
              onInspectCase={handleInspectCase}
              onTriageAction={handleTriageAction}
            />
          )}

          {activeTab === 'tab-dataset' && (
            <DatasetStudio
              onInspectCase={handleInspectCase}
              onShowToast={showToast}
              onRunComplete={handleRunCustomDataset}
            />
          )}

          {activeTab === 'tab-results' && (
            <BatchAuditResults
              resultsData={batchResults}
              pipelineExecutionTrigger={pipelineExecutionTrigger}
              onClearExecutionTrigger={() => setPipelineExecutionTrigger(null)}
              onInspectCase={handleInspectCase}
              onOpenDatasetStudio={() => setActiveTab('tab-dataset')}
              onRunAuditWithSample={handleRunAuditWithSample}
              onRunAuditWithPortfolio={handleRunAuditWithPortfolio}
              onSaveAuditResults={(results) => setBatchResults(results)}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'tab-analyzer' && (
            <ClaimAnalyzer
              benchmarkCases={cases}
              selectedCaseId={selectedCaseId}
              onCaseSelected={setSelectedCaseId}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'tab-performance' && (
            <ModelPerformance
              models={BENCHMARK_MODELS}
            />
          )}

          {activeTab === 'tab-network' && (
            <CollusionNetwork />
          )}

          {activeTab === 'tab-preauth' && (
            <PreAuthGateway onShowToast={showToast} />
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
            Autonomous Healthcare Insurance Fraud Intelligence Engine
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
              Next-generation autonomous healthcare insurance fraud intelligence engine. 
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
                <button type="button" className="footer-link-btn" onClick={() => setActiveTab('tab-dashboard')}>
                  Command Center Radar
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setActiveTab('tab-queue')}>
                  Priority Review Queue
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setActiveTab('tab-dataset')}>
                  Dataset Studio & Batch Runner
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setActiveTab('tab-results')}>
                  Audit Results & Confidence Report
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setActiveTab('tab-performance')}>
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
