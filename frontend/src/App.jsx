import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import AlertTicker from './components/AlertTicker';
import CommandCenter from './components/CommandCenter';
import ReviewQueue from './components/ReviewQueue';
import ClaimAnalyzer from './components/ClaimAnalyzer';
import ModelPerformance from './components/ModelPerformance';
import CollusionNetwork from './components/CollusionNetwork';
import PreAuthGateway from './components/PreAuthGateway';
import ImageModal from './components/ImageModal';
import Toast from './components/Toast';

import { BENCHMARK_CASES } from './data/benchmarkCases';
import { BENCHMARK_MODELS, FIGURE_ARTIFACTS } from './data/benchmarkModels';

export default function App() {
  const [activeTab, setActiveTab] = useState('tab-dashboard');
  const [cases, setCases] = useState(BENCHMARK_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState(BENCHMARK_CASES[0].id);
  const [healthData, setHealthData] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [enlargedFigure, setEnlargedFigure] = useState(null);
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
        `<strong>Disbursements Frozen</strong> for ${targetCase.id} ($${targetCase.reimbursement.toLocaleString()})! Investigation file opened.`,
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
      />

      {/* Live Alert Ticker */}
      <AlertTicker />

      {/* Main Container */}
      <main className="main-layout">
        {activeTab === 'tab-dashboard' && (
          <CommandCenter
            cases={cases}
            onInspectCase={handleInspectCase}
            onTriageAction={handleTriageAction}
            onViewAllCases={() => setActiveTab('tab-queue')}
          />
        )}

        {activeTab === 'tab-queue' && (
          <ReviewQueue
            cases={cases}
            onInspectCase={handleInspectCase}
            onTriageAction={handleTriageAction}
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
            figures={FIGURE_ARTIFACTS}
            onEnlargeFigure={setEnlargedFigure}
          />
        )}

        {activeTab === 'tab-network' && (
          <CollusionNetwork />
        )}

        {activeTab === 'tab-preauth' && (
          <PreAuthGateway onShowToast={showToast} />
        )}
      </main>

      {/* Image Zoom Modal */}
      <ImageModal
        figure={enlargedFigure}
        onClose={() => setEnlargedFigure(null)}
      />

      {/* Toast Alert Notifications */}
      <Toast toast={toast} />
    </div>
  );
}
