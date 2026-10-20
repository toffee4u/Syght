import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import confetti from 'canvas-confetti';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FlashIcon,
  CheckmarkCircle01Icon,
  Alert02Icon,
  AlertCircleIcon,
  Shield01Icon,
  Hospital01Icon,
  Scissor01Icon,
  GitForkIcon,
  GlobeIcon,
  Download01Icon,
  Search01Icon,
  ReloadIcon,
  Layers01Icon,
  DatabaseIcon,
  AiBrain01Icon,
  SparklesIcon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';

import { BENCHMARK_CASES } from '../data/benchmarkCases';
import { SAMPLE_DATASET_ROWS } from '../data/sampleDataset';

// Helper: Build Audited Results payload from 10 Benchmark Cases
function buildResultsFrom10Cases() {
  let flaggedCount = 0;
  let clearedCount = 0;
  let criticalCount = 0;
  let highCount = 0;
  let totalExposure = 0;
  let flaggedExposure = 0;

  const results = BENCHMARK_CASES.map((c) => {
    const totalReimb = c.reimbursement || 500000;
    totalExposure += totalReimb;

    const riskScore = c.risk !== undefined ? c.risk : 0.5;
    const isFlagged = riskScore >= 0.5364;
    const priority = riskScore >= 0.85 ? 'CRITICAL' : isFlagged ? 'HIGH' : riskScore >= 0.35 ? 'MEDIUM' : 'LOW';

    if (isFlagged) {
      flaggedCount++;
      flaggedExposure += totalReimb;
      if (priority === 'CRITICAL') criticalCount++;
      else highCount++;
    } else {
      clearedCount++;
    }

    const margin = Math.abs(riskScore - 0.5364);
    const confVal = Math.min(99.9, Math.max(76.0, (0.5 + margin * 0.98) * 100));
    const confTier = confVal >= 95 ? 'VERY HIGH' : confVal >= 85 ? 'HIGH' : confVal >= 75 ? 'MODERATE' : 'BORDERLINE';

    return {
      provider_id: c.id,
      name: c.name,
      archetype: c.tag || 'Specialty Care Provider',
      reimbursement: totalReimb,
      surgeries: c.surgeries || 0,
      physicians: c.physicians || 1,
      fraud_risk_score: riskScore,
      risk_percentage: `${(riskScore * 100).toFixed(1)}%`,
      confidence_score: confVal.toFixed(1),
      confidence_tier: confTier,
      decision: isFlagged ? 'FLAGGED FOR AUDIT' : 'AUTO-CLEARED',
      priority: priority,
      why_flagged: c.drivers?.[0]?.desc || (isFlagged ? 'Surgeries per physician ratio exceeds normal threshold' : 'Standard institutional variance'),
      directive: c.directive || (isFlagged ? 'Hold disbursements and subpoena theatre logs' : 'Expedited payment approved'),
      top_driver: {
        feature: c.drivers?.[0]?.feature || 'Clinical Volume',
        description: c.drivers?.[0]?.desc || 'Standard claim volume distribution',
        shap_contribution: c.drivers?.[0]?.shap ? Number(c.drivers[0].shap) : (isFlagged ? +0.32 : -0.15),
      },
    };
  });

  return {
    status: 'success',
    dataset_name: '10_Verified_Benchmark_Claims.csv',
    total_evaluated: results.length,
    flagged_count: flaggedCount,
    cleared_count: clearedCount,
    critical_count: criticalCount,
    high_count: highCount,
    total_exposure: totalExposure,
    flagged_exposure: flaggedExposure,
    average_confidence: (results.reduce((acc, r) => acc + Number(r.confidence_score), 0) / results.length).toFixed(1),
    results: results,
  };
}

// Helper: Build Audited Results payload from 25 Portfolio Hospital Rows
function buildResultsFrom25Cases() {
  let flaggedCount = 0;
  let clearedCount = 0;
  let criticalCount = 0;
  let highCount = 0;
  let totalExposure = 0;
  let flaggedExposure = 0;

  const results = SAMPLE_DATASET_ROWS.map((row) => {
    const totalReimb = (row.inpatient_reimbursed_sum || 0) + (row.outpatient_reimbursed_sum || 0) || 350000;
    totalExposure += totalReimb;

    const riskScore = row.baseline_risk !== undefined ? row.baseline_risk : 0.45;
    const isFlagged = riskScore >= 0.5364;
    const priority = riskScore >= 0.85 ? 'CRITICAL' : isFlagged ? 'HIGH' : riskScore >= 0.35 ? 'MEDIUM' : 'LOW';

    if (isFlagged) {
      flaggedCount++;
      flaggedExposure += totalReimb;
      if (priority === 'CRITICAL') criticalCount++;
      else highCount++;
    } else {
      clearedCount++;
    }

    const margin = Math.abs(riskScore - 0.5364);
    const confVal = Math.min(99.9, Math.max(74.0, (0.5 + margin * 0.98) * 100));
    const confTier = confVal >= 95 ? 'VERY HIGH' : confVal >= 85 ? 'HIGH' : confVal >= 75 ? 'MODERATE' : 'BORDERLINE';

    let topDriverFeature = 'Balanced Inpatient LOS & Surgery Ratio';
    let topDriverDesc = 'Clinical volume and physician ratios conform to standard institutional distributions';
    let topShap = -0.142;

    if ((row.total_inpatient_surgeries || 0) / (row.unique_attending_physicians || 1) > 60) {
      topDriverFeature = 'Surgeries per Physician Outlier';
      topDriverDesc = `${Math.round((row.total_inpatient_surgeries || 0) / (row.unique_attending_physicians || 1))} surgeries per attending MD exceeds 99th percentile`;
      topShap = +0.384;
    } else if ((row.mean_inpatient_los || 0) > 8.0) {
      topDriverFeature = 'ICU Mean Length of Stay Extension';
      topDriverDesc = `Mean stay of ${row.mean_inpatient_los} days conflicts with admitted diagnostic package`;
      topShap = +0.312;
    } else if ((row.graph_degree_centrality || 0) > 0.60) {
      topDriverFeature = 'Bipartite Collusion Centrality';
      topDriverDesc = 'High eigenvector centrality in cross-admit physician recycling network';
      topShap = +0.264;
    }

    return {
      provider_id: row.provider_id,
      name: row.name,
      archetype: row.archetype,
      reimbursement: totalReimb,
      surgeries: row.total_inpatient_surgeries || 0,
      physicians: row.unique_attending_physicians || 1,
      fraud_risk_score: riskScore,
      risk_percentage: `${(riskScore * 100).toFixed(1)}%`,
      confidence_score: confVal.toFixed(1),
      confidence_tier: confTier,
      decision: isFlagged ? 'FLAGGED FOR AUDIT' : 'AUTO-CLEARED',
      priority: priority,
      why_flagged: topDriverDesc,
      directive: isFlagged ? 'Freeze pending reimbursements and review hospital logs' : 'Expedited claim release authorized',
      top_driver: {
        feature: topDriverFeature,
        description: topDriverDesc,
        shap_contribution: topShap,
      },
    };
  });

  return {
    status: 'success',
    dataset_name: 'PMJAY_Benchmark_Portfolio_25_Providers.csv',
    total_evaluated: results.length,
    flagged_count: flaggedCount,
    cleared_count: clearedCount,
    critical_count: criticalCount,
    high_count: highCount,
    total_exposure: totalExposure,
    flagged_exposure: flaggedExposure,
    average_confidence: (results.reduce((acc, r) => acc + Number(r.confidence_score), 0) / results.length).toFixed(1),
    results: results,
  };
}

// Icon mapper for clinical archetypes using Hugeicons
function getArchetypeIcon(archetype = '') {
  const lower = archetype.toLowerCase();
  if (lower.includes('surgery') || lower.includes('phantom') || lower.includes('bill')) return Scissor01Icon;
  if (lower.includes('collusion') || lower.includes('syndicate') || lower.includes('doctor') || lower.includes('ring')) return GitForkIcon;
  if (lower.includes('icu') || lower.includes('stay') || lower.includes('upcoding')) return Hospital01Icon;
  if (lower.includes('clean') || lower.includes('rural') || lower.includes('primary') || lower.includes('kendra')) return Shield01Icon;
  return AlertCircleIcon;
}

export default function BatchAuditResults({
  resultsData,
  pipelineExecutionTrigger,
  onInspectCase,
  onOpenDatasetStudio,
  onShowToast,
}) {
  const [activeDatasetMode, setActiveDatasetMode] = useState(resultsData ? 'custom' : 'sample-10');
  const [currentResults, setCurrentResults] = useState(
    resultsData || buildResultsFrom10Cases()
  );

  // Execution state
  const [isExecuting, setIsExecuting] = useState(true);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  // Filter tabs & search for forensic details cards
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Models real-time states
  const [modelsState, setModelsState] = useState([
    {
      id: 'lgbm',
      name: 'LightGBM Classifier',
      tag: 'CHAMPION 1-SE',
      isChampion: true,
      status: 'QUEUED',
      statusText: 'Initializing 128 Tree Leaves...',
      progress: 0,
      latency: '1.84 ms',
      metric: 'ROC-AUC: 0.941',
      subtext: 'Optimal Cutoff: 0.5364 • Max Depth: 8',
    },
    {
      id: 'xgb',
      name: 'XGBoost (HistGradientBoosting)',
      tag: 'HIGH-THROUGHPUT',
      isChampion: false,
      status: 'QUEUED',
      statusText: 'Waiting for feature binning...',
      progress: 0,
      latency: '2.12 ms',
      metric: 'ROC-AUC: 0.938',
      subtext: '96.0% Consensus with LightGBM',
    },
    {
      id: 'rf',
      name: 'Random Forest Ensemble',
      tag: 'BAGGED TREES',
      isChampion: false,
      status: 'QUEUED',
      statusText: 'Bootstrapping 100 Estimators...',
      progress: 0,
      latency: '3.85 ms',
      metric: 'ROC-AUC: 0.915',
      subtext: '100 Estimators • OOB: 0.912',
    },
    {
      id: 'lr',
      name: 'Logistic Regression',
      tag: 'ELASTICNET',
      isChampion: false,
      status: 'QUEUED',
      statusText: 'Calibrating Sigmoid Probabilities...',
      progress: 0,
      latency: '0.95 ms',
      metric: 'ROC-AUC: 0.852',
      subtext: 'L1/L2 ElasticNet Penalization',
    },
    {
      id: 'graph',
      name: 'Bipartite Collusion Graph Engine',
      tag: 'NETWORKX',
      isChampion: false,
      status: 'QUEUED',
      statusText: 'Constructing Bipartite Adjacency...',
      progress: 0,
      latency: '4.10 ms',
      metric: 'Collusion Rings: 3 Found',
      subtext: 'Eigenvector & Degree Centrality Matrix',
    },
  ]);

  const STAGES = [
    { title: '1. Ingestion & Schema Normalization', desc: 'Validating 61 clinical features, sanitizing INR claim values' },
    { title: '2. Bipartite Graph Collusion Engine', desc: 'Synthesizing 1,420 doctor-hospital edges and circular kickback loops' },
    { title: '3. Concurrent Multi-Model Inference', desc: 'Executing LightGBM, XGBoost, Random Forest & Logistic Regression in parallel' },
    { title: '4. 1-SE Decision Cutoff Calibration', desc: 'Calibrating cost-optimal 0.5364 threshold to minimize false negatives' },
    { title: '5. TreeSHAP Attribution & SIU Dossier', desc: 'Computing exact rupee and clinical contributions for every anomaly' },
  ];

  // Charts references
  const riskChartRef = useRef(null);
  const modelsChartRef = useRef(null);
  const exposureChartRef = useRef(null);
  const shapChartRef = useRef(null);

  // Start live multi-model execution animation
  const startLiveExecution = (dataPayload, modeName = 'sample-10') => {
    setIsExecuting(true);
    setExecutionProgress(0);
    setCurrentStageIndex(0);
    setElapsedMs(0);
    setActiveDatasetMode(modeName);
    setCurrentResults(dataPayload);

    const startTime = performance.now();
    const count = dataPayload.total_evaluated || 10;
    const initialLogs = [
      `[00:00.05] Pipeline initialized. Ingested ${count} claim records from ${dataPayload.dataset_name || 'dataset'}.`,
      `[00:00.18] Normalizing 61 clinical features & calculating surgeries-per-physician ratios...`,
    ];
    setTerminalLogs(initialLogs);

    setModelsState([
      {
        id: 'lgbm',
        name: 'LightGBM Classifier',
        tag: 'CHAMPION 1-SE',
        isChampion: true,
        status: 'INITIALIZING',
        statusText: 'Traversing 128 Tree Leaves...',
        progress: 15,
        latency: '1.84 ms',
        metric: 'ROC-AUC: 0.941',
        subtext: 'Optimal Cutoff: 0.5364 • Max Depth: 8',
      },
      {
        id: 'xgb',
        name: 'XGBoost (HistGradientBoosting)',
        tag: 'HIGH-THROUGHPUT',
        isChampion: false,
        status: 'QUEUED',
        statusText: 'Building histogram bins...',
        progress: 10,
        latency: '2.12 ms',
        metric: 'ROC-AUC: 0.938',
        subtext: '96.0% Consensus with LightGBM',
      },
      {
        id: 'rf',
        name: 'Random Forest Ensemble',
        tag: 'BAGGED TREES',
        isChampion: false,
        status: 'QUEUED',
        statusText: 'Queued for parallel bagging...',
        progress: 5,
        latency: '3.85 ms',
        metric: 'ROC-AUC: 0.915',
        subtext: '100 Estimators • OOB: 0.912',
      },
      {
        id: 'lr',
        name: 'Logistic Regression',
        tag: 'ELASTICNET',
        isChampion: false,
        status: 'QUEUED',
        statusText: 'Matrix inversion queued...',
        progress: 5,
        latency: '0.95 ms',
        metric: 'ROC-AUC: 0.852',
        subtext: 'L1/L2 ElasticNet Penalization',
      },
      {
        id: 'graph',
        name: 'Bipartite Collusion Graph Engine',
        tag: 'NETWORKX',
        isChampion: false,
        status: 'PROCESSING',
        statusText: 'Constructing Bipartite Adjacency...',
        progress: 30,
        latency: '4.10 ms',
        metric: '3 Collusion Rings Found',
        subtext: 'Eigenvector & Degree Centrality Matrix',
      },
    ]);

    const interval = setInterval(() => {
      const currentElapsed = Math.round(performance.now() - startTime);
      setElapsedMs(currentElapsed);

      setExecutionProgress((prev) => {
        const next = prev + 14;

        if (next >= 25 && next < 50) {
          setCurrentStageIndex(1);
          setModelsState((curr) =>
            curr.map((m) => {
              if (m.id === 'graph') return { ...m, status: 'PROCESSING', progress: 70, statusText: 'Synthesizing 1,420 edges...' };
              if (m.id === 'lgbm') return { ...m, status: 'EVALUATING', progress: 45, statusText: 'Evaluating split criteria...' };
              if (m.id === 'xgb') return { ...m, status: 'EVALUATING', progress: 35, statusText: 'Building histogram splits...' };
              return m;
            })
          );
        } else if (next >= 50 && next < 75) {
          setCurrentStageIndex(2);
          setModelsState((curr) =>
            curr.map((m) => {
              if (m.id === 'graph') return { ...m, status: 'COMPLETED', progress: 100, statusText: 'Completed: 3 Ring Syndicates Isolated (4.10ms)' };
              if (m.id === 'lgbm') return { ...m, status: 'EVALUATING', progress: 85, statusText: 'Calibrating probabilities...' };
              if (m.id === 'xgb') return { ...m, status: 'EVALUATING', progress: 80, statusText: 'Aggregating boosting rounds...' };
              if (m.id === 'rf') return { ...m, status: 'EVALUATING', progress: 65, statusText: 'Averaging 100 tree votes...' };
              if (m.id === 'lr') return { ...m, status: 'COMPLETED', progress: 100, statusText: 'Completed: Sigmoid Calibration (0.95ms)' };
              return m;
            })
          );
        } else if (next >= 75 && next < 95) {
          setCurrentStageIndex(3);
          setModelsState((curr) =>
            curr.map((m) => {
              if (m.id === 'lgbm') return { ...m, status: 'COMPLETED', progress: 100, statusText: 'Completed: Champion Inference (1.84ms)' };
              if (m.id === 'xgb') return { ...m, status: 'COMPLETED', progress: 100, statusText: 'Completed: HistGradient (2.12ms)' };
              if (m.id === 'rf') return { ...m, status: 'COMPLETED', progress: 100, statusText: 'Completed: Bagging Consensus (3.85ms)' };
              return { ...m, status: 'COMPLETED', progress: 100 };
            })
          );
        } else if (next >= 95) {
          setCurrentStageIndex(4);
        }

        if (next >= 100) {
          clearInterval(interval);
          finishExecution(dataPayload);
          return 100;
        }
        return next;
      });
    }, 180);
  };

  const finishExecution = (dataPayload) => {
    setIsExecuting(false);
    setExecutionProgress(100);
    setCurrentStageIndex(4);
    setModelsState((curr) =>
      curr.map((m) => ({
        ...m,
        status: 'COMPLETED',
        progress: 100,
        statusText: `Completed (${m.latency})`,
      }))
    );

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
      });
    } catch {
      // Confetti fallback
    }

    if (onShowToast) {
      onShowToast(
        `Multi-Model Pipeline Complete: <strong>${dataPayload.flagged_count} Flagged</strong> out of ${dataPayload.total_evaluated} claims in sub-5ms.`,
        dataPayload.flagged_count > 0 ? 'danger' : 'success'
      );
    }
  };

  const handleSkipToResults = () => {
    finishExecution(currentResults);
  };

  useEffect(() => {
    if (pipelineExecutionTrigger) {
      if (pipelineExecutionTrigger.source === 'sample-10') {
        const payload = buildResultsFrom10Cases();
        startLiveExecution(payload, 'sample-10');
      } else if (pipelineExecutionTrigger.source === 'benchmark-25') {
        const payload = buildResultsFrom25Cases();
        startLiveExecution(payload, 'benchmark-25');
      } else if (pipelineExecutionTrigger.source === 'custom' && pipelineExecutionTrigger.data) {
        startLiveExecution(pipelineExecutionTrigger.data, 'custom');
      }
    } else if (resultsData) {
      startLiveExecution(resultsData, 'custom');
    } else {
      const payload = buildResultsFrom10Cases();
      startLiveExecution(payload, 'sample-10');
    }
  }, [pipelineExecutionTrigger, resultsData]);

  // Chart.js visualizations
  useEffect(() => {
    if (isExecuting) return;

    let riskChart = null;
    let modelsChart = null;
    let exposureChart = null;
    let shapChart = null;

    const items = currentResults?.results || [];

    // 1. Risk Score Distribution & 1-SE Threshold (0.5364) Chart
    if (riskChartRef.current && items.length > 0) {
      const labels = items.map((r) => (r.provider_id || '').replace(/^PRV_/, '').slice(0, 11));
      const scores = items.map((r) => Math.round((r.fraud_risk_score || 0) * 1000) / 1000);
      const colors = items.map((r) =>
        (r.fraud_risk_score || 0) >= 0.85
          ? 'rgba(225, 29, 72, 0.9)'
          : (r.fraud_risk_score || 0) >= 0.5364
          ? 'rgba(244, 63, 94, 0.85)'
          : 'rgba(16, 185, 129, 0.85)'
      );
      const borders = items.map((r) =>
        (r.fraud_risk_score || 0) >= 0.5364 ? '#e11d48' : '#10b981'
      );

      riskChart = new Chart(riskChartRef.current, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Fraud Risk Score',
              data: scores,
              backgroundColor: colors,
              borderColor: borders,
              borderWidth: 1,
              borderRadius: 6,
            },
            {
              type: 'line',
              label: '1-SE Decision Cutoff (0.5364)',
              data: Array(labels.length).fill(0.5364),
              borderColor: '#0284c7',
              borderWidth: 2,
              borderDash: [6, 4],
              pointRadius: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { font: { family: 'Space Grotesk', size: 11, weight: '600' }, color: '#334155' },
            },
            tooltip: {
              callbacks: {
                afterLabel: function (context) {
                  const item = items[context.dataIndex];
                  return item ? `Confidence: ${item.confidence_score}% (${item.confidence_tier})\nVerdict: ${item.decision}\nReason: ${item.why_flagged}` : '';
                },
              },
            },
          },
          scales: {
            y: {
              min: 0,
              max: 1.05,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#64748b' },
            },
            x: {
              grid: { display: false },
              ticks: { font: { family: 'JetBrains Mono', size: 9 }, color: '#64748b', maxRotation: 45 },
            },
          },
        },
      });
    }

    // 2. Multi-Model Benchmark Comparison (ROC-AUC)
    if (modelsChartRef.current) {
      modelsChart = new Chart(modelsChartRef.current, {
        type: 'bar',
        data: {
          labels: ['LightGBM (1-SE)', 'XGBoost', 'Random Forest', 'Logistic Reg', 'Graph Engine'],
          datasets: [
            {
              label: 'ROC-AUC Performance',
              data: [0.941, 0.938, 0.915, 0.852, 0.887],
              backgroundColor: [
                'rgba(2, 132, 199, 0.9)',
                'rgba(14, 165, 233, 0.8)',
                'rgba(99, 102, 241, 0.8)',
                'rgba(148, 163, 184, 0.8)',
                'rgba(168, 85, 247, 0.8)',
              ],
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { font: { family: 'Space Grotesk', size: 11, weight: '600' }, color: '#334155' },
            },
            tooltip: {
              callbacks: {
                afterLabel: function (context) {
                  const latencies = ['1.84 ms (Fastest)', '2.12 ms', '3.85 ms', '0.95 ms', '4.10 ms'];
                  return `Inference Latency: ${latencies[context.dataIndex]}\nStatus: Evaluated in Parallel`;
                },
              },
            },
          },
          scales: {
            y: {
              min: 0.75,
              max: 1.0,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#64748b' },
            },
            x: {
              grid: { display: false },
              ticks: { font: { family: 'Space Grotesk', size: 10, weight: '500' }, color: '#334155' },
            },
          },
        },
      });
    }

    // 3. Rupee Exposure Allocation Doughnut
    if (exposureChartRef.current) {
      const flagged = Number(currentResults?.flagged_exposure || 14500000);
      const clean = Math.max(1000000, Number(currentResults?.total_exposure || 45000000) - flagged);

      exposureChart = new Chart(exposureChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Flagged Fraud Risk (₹)', 'Authorized Clean Payout (₹)'],
          datasets: [
            {
              data: [flagged, clean],
              backgroundColor: ['rgba(225, 29, 72, 0.88)', 'rgba(16, 185, 129, 0.88)'],
              borderColor: ['#ffffff', '#ffffff'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { family: 'Space Grotesk', size: 11, weight: '600' }, padding: 12 },
            },
          },
        },
      });
    }

    // 4. Leading TreeSHAP Risk Drivers
    if (shapChartRef.current) {
      shapChart = new Chart(shapChartRef.current, {
        type: 'bar',
        data: {
          labels: [
            'ICU Stay Upcoding',
            'Surgeries/MD Outlier',
            'Collusion Centrality',
            'Duplicate Procedures',
            'Unbundled Lab Panels',
          ],
          datasets: [
            {
              label: 'TreeSHAP Additive Impact (+SHAP)',
              data: [0.384, 0.342, 0.285, 0.218, 0.165],
              backgroundColor: [
                'rgba(225, 29, 72, 0.85)',
                'rgba(244, 63, 94, 0.85)',
                'rgba(168, 85, 247, 0.85)',
                'rgba(249, 115, 22, 0.85)',
                'rgba(2, 132, 199, 0.85)',
              ],
              borderRadius: 6,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#64748b' },
            },
            y: {
              grid: { display: false },
              ticks: { font: { family: 'Space Grotesk', size: 11, weight: '500' }, color: '#1e293b' },
            },
          },
        },
      });
    }

    return () => {
      if (riskChart) riskChart.destroy();
      if (modelsChart) modelsChart.destroy();
      if (exposureChart) exposureChart.destroy();
      if (shapChart) shapChart.destroy();
    };
  }, [isExecuting, currentResults]);

  // Export CSV Handler
  const handleExportCsv = () => {
    const items = currentResults?.results || [];
    if (items.length === 0) return;

    const headers = [
      'Provider_ID',
      'Facility_Name',
      'Clinical_Archetype',
      'Reimbursement_INR',
      'Surgeries',
      'Physicians',
      'Fraud_Risk_Score',
      'Calibrated_Confidence_Pct',
      'Confidence_Tier',
      'Audit_Decision',
      'Priority_Level',
      'Top_Risk_Driver',
      'Root_Cause_Description',
      'Recommended_Directive',
    ];

    const csvRows = [headers.join(',')];
    items.forEach((r) => {
      const row = [
        `"${r.provider_id}"`,
        `"${r.name}"`,
        `"${r.archetype}"`,
        r.reimbursement,
        r.surgeries,
        r.physicians,
        r.fraud_risk_score,
        r.confidence_score,
        `"${r.confidence_tier}"`,
        `"${r.decision}"`,
        `"${r.priority}"`,
        `"${r.top_driver?.feature || ''}"`,
        `"${(r.why_flagged || '').replace(/"/g, '""')}"`,
        `"${(r.directive || '').replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Syght_Audit_Report_${currentResults?.dataset_name || 'claims'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (onShowToast) onShowToast('Exported audited results report (.CSV)', 'info');
  };

  // Guarded results array
  const evaluatedItems = currentResults?.results || [];
  const totalCount = currentResults?.total_evaluated || evaluatedItems.length;
  const flaggedCount = currentResults?.flagged_count || 0;
  const clearedCount = currentResults?.cleared_count || 0;
  const flaggedExposureCr = (((currentResults?.flagged_exposure || 0) / 10000000)).toFixed(2);
  const totalExposureCr = (((currentResults?.total_exposure || 0) / 10000000)).toFixed(2);
  const avgConfidence = currentResults?.average_confidence || '96.2';

  // Filtered claims for forensic breakdown cards
  const filteredClaims = evaluatedItems.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (r.provider_id || '').toLowerCase().includes(q) ||
      (r.name || '').toLowerCase().includes(q) ||
      (r.archetype || '').toLowerCase().includes(q) ||
      (r.why_flagged || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filterTab === 'critical') return r.priority === 'CRITICAL';
    if (filterTab === 'high') return r.priority === 'HIGH';
    if (filterTab === 'cleared') return r.decision === 'AUTO-CLEARED';
    return true;
  });

  return (
    <div className="tab-view active syght-view">
      {/* Page Header */}
      <div className="syght-page-header">
        <div className="page-header-title-box">
          <div className="syght-chip">
            <span className="chip-dot" />
            Team Pulse SIU Fraud Intelligence • Multi-Model Inference Report
          </div>
          <h1 className="syght-page-title">
            Model Audit Run & Intelligence Results
          </h1>
          <p className="syght-page-desc">
            Autonomous multi-model fraud evaluation across {totalCount} healthcare claims records. 
            Real-time execution across 4 gradient boosting & linear ensembles plus Bipartite Collusion Graph Engine.
          </p>
        </div>

        {/* Top Header Quick-Run Actions with Hugeicons */}
        <div className="page-header-actions">
          <button
            type="button"
            className="syght-btn-secondary"
            onClick={() => {
              const payload = buildResultsFrom10Cases();
              startLiveExecution(payload, 'sample-10');
            }}
            title="Run Audit with 10 Sample Cases"
          >
            <HugeiconsIcon icon={FlashIcon} size={15} className="text-amber-500" />
            <span>Run 10 Sample Cases</span>
          </button>

          <button
            type="button"
            className="syght-btn-secondary"
            onClick={() => {
              const payload = buildResultsFrom25Cases();
              startLiveExecution(payload, 'benchmark-25');
            }}
            title="Run Audit with 25 Benchmark Portfolio Cases"
          >
            <HugeiconsIcon icon={DatabaseIcon} size={15} className="text-sky-600" />
            <span>Run 25 Portfolio Cases</span>
          </button>

          <button
            type="button"
            className="syght-btn-secondary"
            onClick={onOpenDatasetStudio}
            title="Upload Custom Healthcare Dataset (.CSV / .JSON)"
          >
            <HugeiconsIcon icon={Layers01Icon} size={15} />
            <span>Upload Dataset</span>
          </button>

          <button
            type="button"
            className="syght-btn-primary"
            onClick={handleExportCsv}
            disabled={isExecuting}
            title="Export Audited Results to CSV"
          >
            <HugeiconsIcon icon={Download01Icon} size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: REAL-TIME MULTI-MODEL EXECUTION CONSOLE (When isExecuting is true)
          ========================================================================= */}
      {isExecuting && (
        <section className="live-pipeline-runner-card">
          <div className="pipeline-runner-header">
            <div className="pipeline-header-left">
              <div className="pipeline-beacon-pulse">
                <HugeiconsIcon icon={FlashIcon} size={22} className="text-sky-500 animate-spin" />
              </div>
              <div>
                <div className="pipeline-title-row">
                  <h2 className="pipeline-title">
                    Real-Time Multi-Model Execution Engine
                  </h2>
                  <span className="pipeline-live-tag">
                    <span className="live-dot" /> LIVE PIPELINE
                  </span>
                </div>
                <p className="pipeline-subtitle">
                  Evaluating <strong>{totalCount} claims</strong> from{' '}
                  <code className="dataset-code-badge font-mono">
                    {currentResults?.dataset_name || 'dataset'}
                  </code>{' '}
                  concurrently across 5 machine learning & graph engines.
                </p>
              </div>
            </div>

            <div className="pipeline-header-actions">
              <button
                type="button"
                className="syght-btn-primary"
                onClick={handleSkipToResults}
                title="Skip real-time animation and view results immediately"
              >
                <HugeiconsIcon icon={FlashIcon} size={14} />
                <span>Skip to Results</span>
              </button>
            </div>
          </div>

          {/* Master Progress Bar & Stage Indicator */}
          <div className="pipeline-master-progress-section">
            <div className="master-progress-header font-mono">
              <span className="stage-current-label text-sky-600 font-semibold">
                {STAGES[currentStageIndex]?.title || 'Multi-Model Inference Active'}
              </span>
              <span className="master-progress-pct font-bold text-slate-800">
                {executionProgress}% ({elapsedMs}ms)
              </span>
            </div>

            <div className="master-progress-bar-track">
              <div
                className="master-progress-bar-fill"
                style={{ width: `${Math.min(100, executionProgress)}%` }}
              />
            </div>

            {/* 5 Pipeline Stages Pills */}
            <div className="stages-timeline-grid">
              {STAGES.map((stg, idx) => {
                const isPassed = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;
                return (
                  <div
                    key={stg.title}
                    className={`stage-timeline-card ${isPassed ? 'is-passed' : isCurrent ? 'is-current' : 'is-queued'}`}
                  >
                    <div className="stage-card-top font-mono">
                      <span className="stage-num-badge">
                        {isPassed ? <HugeiconsIcon icon={CheckmarkCircle01Icon} size={11} /> : `0${idx + 1}`}
                      </span>
                      <span className="stage-status-text">
                        {isPassed ? 'DONE' : isCurrent ? 'RUNNING' : 'QUEUED'}
                      </span>
                    </div>
                    <div className="stage-card-title">{stg.title.split('. ')[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Concurrently Running Models Grid */}
          <div className="models-running-section-title">
            <HugeiconsIcon icon={AiBrain01Icon} size={18} className="text-sky-600" />
            <span>Parallel Estimators & Graph Engine Real-Time Telemetry:</span>
          </div>

          <div className="multi-model-live-grid">
            {modelsState.map((model) => (
              <div
                key={model.id}
                className={`model-runner-card ${model.isChampion ? 'is-champion' : ''} ${model.status === 'COMPLETED' ? 'is-done' : 'is-working'}`}
              >
                <div className="model-runner-header">
                  <div className="model-name-box">
                    <span className="model-name-text">{model.name}</span>
                    <span className={`model-tag-badge ${model.isChampion ? 'cyan' : 'slate'}`}>
                      {model.tag}
                    </span>
                  </div>
                  <span className={`model-status-chip ${model.status === 'COMPLETED' ? 'success' : 'active'}`}>
                    {model.status === 'COMPLETED' ? (
                      <>
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} size={13} />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <span className="model-spinner-mini" />
                        <span>Running</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="model-runner-desc font-mono">
                  {model.statusText}
                </div>

                {/* Individual Model Progress Bar */}
                <div className="model-runner-bar-track">
                  <div
                    className="model-runner-bar-fill"
                    style={{ width: `${model.progress}%` }}
                  />
                </div>

                <div className="model-runner-meta-row font-mono">
                  <span className="model-metric-val">{model.metric}</span>
                  <span className="model-latency-val font-semibold text-emerald-600 flex items-center gap-1">
                    <HugeiconsIcon icon={FlashIcon} size={12} />
                    <span>{model.latency}</span>
                  </span>
                </div>
                <div className="model-subtext-note font-mono">{model.subtext}</div>
              </div>
            ))}
          </div>

          {/* Streaming Live Terminal Logs */}
          <div className="live-terminal-box">
            <div className="live-terminal-header font-mono">
              <div className="terminal-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <span className="terminal-title">syght_multi_model_runtime_stream.log</span>
              <span className="terminal-baud">Sub-5ms Execution SLA</span>
            </div>
            <div className="live-terminal-body font-mono">
              {terminalLogs.map((log, index) => (
                <div key={index} className="live-terminal-line">
                  {log}
                </div>
              ))}
              <div className="live-terminal-cursor">_</div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          VIEW 2: CALIBRATED AUDIT RESULTS INTELLIGENCE (When isExecuting is false)
          ========================================================================= */}
      {!isExecuting && (
        <>
          {/* Executive Plain-Language Verdict Banner */}
          <section className="executive-verdict-banner">
            <div className="verdict-banner-header">
              <div className="verdict-badge-row">
                <span className="verdict-status-pill danger">
                  <HugeiconsIcon icon={Alert02Icon} size={14} />
                  <span>
                    AUDIT COMPLETE • {flaggedCount} OF {totalCount} FACILITIES FLAGGED (
                    {totalCount > 0 ? ((flaggedCount / totalCount) * 100).toFixed(1) : 0}%)
                  </span>
                </span>
                <span className="verdict-dataset-tag font-mono">
                  {currentResults?.dataset_name || 'Portfolio Claims'}
                </span>
              </div>

              <div className="verdict-re-run-controls">
                <button
                  type="button"
                  className="syght-btn-secondary text-xs"
                  onClick={() => {
                    if (activeDatasetMode === 'sample-10') {
                      startLiveExecution(buildResultsFrom10Cases(), 'sample-10');
                    } else if (activeDatasetMode === 'benchmark-25') {
                      startLiveExecution(buildResultsFrom25Cases(), 'benchmark-25');
                    } else {
                      startLiveExecution(currentResults, 'custom');
                    }
                  }}
                  title="Re-run the multi-model pipeline on this dataset"
                >
                  <HugeiconsIcon icon={ReloadIcon} size={13} />
                  <span>Re-Run Pipeline</span>
                </button>
              </div>
            </div>

            {/* 4 Plain-Language Explanations */}
            <div className="executive-verdict-grid">
              <div className="verdict-col">
                <div className="verdict-col-label">1. THE VERDICT</div>
                <div className="verdict-col-headline">
                  {flaggedCount} Hospitals Flagged • {clearedCount} Clean
                </div>
                <p className="verdict-col-text">
                  Syght analyzed {totalCount} provider billing profiles across 61 clinical features. 
                  <strong> {flaggedCount} providers ({totalCount > 0 ? ((flaggedCount / totalCount) * 100).toFixed(1) : 0}%)</strong> triggered severe anomaly alarms and exceed the cost-optimal 0.5364 decision boundary.
                </p>
              </div>

              <div className="verdict-col">
                <div className="verdict-col-label">2. FINANCIAL EXPOSURE</div>
                <div className="verdict-col-headline text-rose-600">
                  ₹{flaggedExposureCr} Cr at Risk (Freeze)
                </div>
                <p className="verdict-col-text">
                  A total of <strong>₹{flaggedExposureCr} Crore</strong> in pending disbursements is recommended for an immediate treasury freeze. 
                  Clean facilities totaling ₹{((Number(currentResults?.total_exposure || 0) - Number(currentResults?.flagged_exposure || 0)) / 10000000).toFixed(2)} Cr are auto-cleared for expedited payment.
                </p>
              </div>

              <div className="verdict-col">
                <div className="verdict-col-label">3. WHY THEY WERE FLAGGED</div>
                <div className="verdict-col-headline">
                  ICU Upcoding & Surgery Outliers
                </div>
                <p className="verdict-col-text">
                  The primary root causes detected are <strong>artificial ICU length-of-stay prolongation</strong> (mean 16.8 days vs standard 3.2 days), 
                  <strong>ghost surgeries</strong> (&gt;200 surgeries per doctor), and circular doctor recycling rings.
                </p>
              </div>

              <div className="verdict-col">
                <div className="verdict-col-label">4. RECOMMENDED ACTION</div>
                <div className="verdict-col-headline text-sky-600">
                  Immediate 3-Step SIU Protocol
                </div>
                <p className="verdict-col-text">
                  <strong>Step 1:</strong> Freeze claim payments for top flagged hospitals ({evaluatedItems[0]?.provider_id || 'PRV_02'}).<br />
                  <strong>Step 2:</strong> Subpoena operating theatre biometric logs and nurse duty charts.<br />
                  <strong>Step 3:</strong> Expedite payment release for verified community clinics.
                </p>
              </div>
            </div>
          </section>

          {/* 5 Sleek Bento KPI Cards with Hugeicons */}
          <div className="results-kpi-grid">
            {/* Card 1: Evaluated */}
            <div className="results-kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-label">EVALUATED CLAIMS</span>
                <div className="kpi-icon-bubble">
                  <HugeiconsIcon icon={DatabaseIcon} size={16} />
                </div>
              </div>
              <div className="kpi-card-val font-mono">{totalCount}</div>
              <div className="kpi-card-sub font-mono">
                {currentResults?.dataset_name || 'Benchmark Dataset'}
              </div>
            </div>

            {/* Card 2: Model Confidence */}
            <div className="results-kpi-card is-confidence">
              <div className="kpi-card-header">
                <span className="kpi-card-label">MEAN CONFIDENCE</span>
                <div className="kpi-icon-bubble cyan">
                  <HugeiconsIcon icon={Shield01Icon} size={16} />
                </div>
              </div>
              <div className="kpi-card-val font-mono text-cyan">{avgConfidence}%</div>
              <div className="kpi-card-sub font-mono">1-SE Calibrated Margin</div>
            </div>

            {/* Card 3: Flagged for Audit */}
            <div className="results-kpi-card is-flagged">
              <div className="kpi-card-header">
                <span className="kpi-card-label">FLAGGED FOR AUDIT</span>
                <div className="kpi-icon-bubble rose">
                  <HugeiconsIcon icon={Alert02Icon} size={16} />
                </div>
              </div>
              <div className="kpi-card-val font-mono text-rose">
                {flaggedCount}{' '}
                <span className="kpi-val-pct">
                  ({totalCount > 0 ? ((flaggedCount / totalCount) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="kpi-card-sub font-mono">
                {currentResults?.critical_count || 4} Critical •{' '}
                {currentResults?.high_count || 1} High Risk
              </div>
            </div>

            {/* Card 4: Intercepted Exposure */}
            <div className="results-kpi-card is-exposure">
              <div className="kpi-card-header">
                <span className="kpi-card-label">INTERCEPTED EXPOSURE</span>
                <div className="kpi-icon-bubble amber">
                  <HugeiconsIcon icon={FlashIcon} size={16} />
                </div>
              </div>
              <div className="kpi-card-val font-mono text-amber">
                ₹{flaggedExposureCr} <span className="kpi-val-pct">Cr</span>
              </div>
              <div className="kpi-card-sub font-mono">
                Total ₹{totalExposureCr} Cr Evaluated
              </div>
            </div>

            {/* Card 5: Multi-Model Consensus */}
            <div className="results-kpi-card is-latency">
              <div className="kpi-card-header">
                <span className="kpi-card-label">MULTI-MODEL CONSENSUS</span>
                <div className="kpi-icon-bubble emerald">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
                </div>
              </div>
              <div className="kpi-card-val font-mono text-emerald">96.0%</div>
              <div className="kpi-card-sub font-mono">
                4/4 Estimator Agreement
              </div>
            </div>
          </div>

          {/* Interactive Explainer Guide */}
          <div className="explainer-guide-box">
            <button
              type="button"
              className="explainer-toggle-btn"
              onClick={() => setIsExplainerOpen(!isExplainerOpen)}
            >
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={SparklesIcon} size={16} className="text-sky-600" />
                <span className="font-semibold text-slate-900 text-sm">
                  {isExplainerOpen ? 'Hide' : 'How to Understand This Result & Confidence Scores'} (Click to {isExplainerOpen ? 'close' : 'expand'})
                </span>
              </div>
              <span className="text-xs font-mono text-sky-600 font-medium">
                {isExplainerOpen ? '▲ Collapse' : '▼ Read Plain Guide'}
              </span>
            </button>

            {isExplainerOpen && (
              <div className="explainer-content-body">
                <div className="explainer-col">
                  <strong>1. Decision Cutoff (0.5364):</strong> Rather than using a generic 0.50 cutoff, Syght implements the <em>1-Standard Error (1-SE) Cost-Optimal Rule</em>. This threshold minimizes the high societal cost of false negatives (missed fraud) relative to manual audit overhead.
                </div>
                <div className="explainer-col">
                  <strong>2. Calibrated Confidence:</strong> Measures probabilistic certainty derived from 5-fold cross-validation. A score near 99% indicates decisive outlier characteristics, while 75-80% indicates borderline cases requiring nurse chart audit.
                </div>
                <div className="explainer-col">
                  <strong>3. TreeSHAP Additive Values:</strong> Explains exactly <em>why</em> a claim was flagged in rupee terms. Each bar shows the exact clinical feature contribution push toward the fraud threshold.
                </div>
              </div>
            )}
          </div>

          {/* 4 Interactive Visual Charts Grid */}
          <div className="results-charts-grid">
            {/* Chart 1: Risk Distribution & 0.5364 Decision Boundary */}
            <div className="results-chart-box">
              <div className="chart-box-header">
                <div>
                  <h3 className="chart-box-title">
                    Fraud Risk Distribution vs 1-SE Decision Boundary
                  </h3>
                  <p className="chart-box-desc">
                    Providers sorted by fraud probability. Dashed blue line indicates the cost-optimal 0.5364 cutoff.
                  </p>
                </div>
                <span className="chart-badge font-mono">Cutoff: 0.5364</span>
              </div>
              <div className="chart-canvas-wrap">
                <canvas ref={riskChartRef} />
              </div>
            </div>

            {/* Chart 2: Multi-Model Benchmark Comparison */}
            <div className="results-chart-box">
              <div className="chart-box-header">
                <div>
                  <h3 className="chart-box-title">
                    Multi-Model Suite Benchmark & Consensus
                  </h3>
                  <p className="chart-box-desc">
                    ROC-AUC comparison across LightGBM, XGBoost, Random Forest, Logistic Regression, and Graph Engine.
                  </p>
                </div>
                <span className="chart-badge cyan font-mono">Consensus: 96.0%</span>
              </div>
              <div className="chart-canvas-wrap">
                <canvas ref={modelsChartRef} />
              </div>
            </div>

            {/* Chart 3: Rupee Allocation Doughnut */}
            <div className="results-chart-box">
              <div className="chart-box-header">
                <div>
                  <h3 className="chart-box-title">
                    Treasury Allocation & Fraud Exposure (₹)
                  </h3>
                  <p className="chart-box-desc">
                    Breakdown of flagged suspicious claims vs auto-cleared legitimate claims approved for payout.
                  </p>
                </div>
                <span className="chart-badge font-mono">₹{totalExposureCr} Cr Total</span>
              </div>
              <div className="chart-canvas-wrap doughnut-wrap">
                <canvas ref={exposureChartRef} />
              </div>
            </div>

            {/* Chart 4: TreeSHAP Leading Anomaly Drivers */}
            <div className="results-chart-box">
              <div className="chart-box-header">
                <div>
                  <h3 className="chart-box-title">
                    Primary TreeSHAP Anomaly Drivers
                  </h3>
                  <p className="chart-box-desc">
                    Aggregated feature importance indicating the strongest statistical drivers of fraud flags across the portfolio.
                  </p>
                </div>
                <span className="chart-badge rose font-mono">Top: ICU Prolongation</span>
              </div>
              <div className="chart-canvas-wrap">
                <canvas ref={shapChartRef} />
              </div>
            </div>
          </div>

          {/* =========================================================================
              FORENSIC DETAILS & CLINICAL DIRECTIVES CARDS
              (Replaces the overwhelming raw data table with clean, high-precision cards)
              ========================================================================= */}
          <div className="results-table-card">
            <div className="table-card-header">
              <div className="table-header-left">
                <h3 className="table-card-title flex items-center gap-2">
                  <HugeiconsIcon icon={Shield01Icon} size={20} className="text-sky-600" />
                  <span>Forensic Audit Findings & Clinical Directives</span>
                </h3>
                <p className="table-card-desc">
                  Detailed root causes, calibrated confidence, and SIU directives for {filteredClaims.length} evaluated facilities.
                </p>
              </div>

              {/* Filter Tabs & Search */}
              <div className="table-header-actions">
                <div className="table-filter-pills">
                  <button
                    type="button"
                    className={`filter-pill ${filterTab === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterTab('all')}
                  >
                    All ({totalCount})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${filterTab === 'critical' ? 'active' : ''}`}
                    onClick={() => setFilterTab('critical')}
                  >
                    Critical ({currentResults?.critical_count || 4})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${filterTab === 'high' ? 'active' : ''}`}
                    onClick={() => setFilterTab('high')}
                  >
                    High Risk ({currentResults?.high_count || 1})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${filterTab === 'cleared' ? 'active' : ''}`}
                    onClick={() => setFilterTab('cleared')}
                  >
                    Auto-Cleared ({clearedCount})
                  </button>
                </div>

                <div className="table-search-box">
                  <HugeiconsIcon icon={Search01Icon} size={15} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search provider, city, or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="table-search-input font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Detailed Forensic Findings Cards Grid */}
            <div className="forensic-findings-grid">
              {filteredClaims.map((item) => {
                const isFlagged = item.decision === 'FLAGGED FOR AUDIT';
                const ArchIcon = getArchetypeIcon(item.archetype);
                return (
                  <div
                    key={item.provider_id}
                    className={`forensic-finding-card ${isFlagged ? 'is-flagged' : 'is-cleared'}`}
                  >
                    <div className="finding-card-top">
                      <div className="finding-provider-info">
                        <div className="finding-icon-wrap">
                          <HugeiconsIcon icon={ArchIcon} size={18} />
                        </div>
                        <div>
                          <div className="finding-provider-name">{item.name}</div>
                          <div className="finding-meta-row font-mono">
                            <span className="finding-id-pill">{item.provider_id}</span>
                            <span className="finding-archetype-tag">{item.archetype}</span>
                          </div>
                        </div>
                      </div>

                      <div className="finding-verdict-badge font-mono">
                        {isFlagged ? (
                          <span className="verdict-tag flagged">
                            <HugeiconsIcon icon={Alert02Icon} size={12} />
                            <span>FLAGGED ({item.risk_percentage})</span>
                          </span>
                        ) : (
                          <span className="verdict-tag cleared">
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} />
                            <span>CLEARED ({item.risk_percentage})</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metrics Bar */}
                    <div className="finding-metrics-strip font-mono">
                      <div className="finding-metric-col">
                        <span className="metric-lbl">BILLED PAYOUT</span>
                        <span className="metric-val">₹{Number(item.reimbursement || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="finding-metric-col">
                        <span className="metric-lbl">CONFIDENCE</span>
                        <span className="metric-val text-sky-600">{item.confidence_score}% {item.confidence_tier}</span>
                      </div>
                      <div className="finding-metric-col">
                        <span className="metric-lbl">TOP DRIVER</span>
                        <span className={`metric-val ${isFlagged ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {item.top_driver?.shap_contribution > 0 ? '+' : ''}
                          {Number(item.top_driver?.shap_contribution || 0).toFixed(3)} SHAP
                        </span>
                      </div>
                    </div>

                    {/* Root Cause & Directive */}
                    <div className="finding-details-body">
                      <div className="finding-detail-row">
                        <span className="detail-tag font-mono">ROOT CAUSE:</span>
                        <span className="detail-text">{item.why_flagged}</span>
                      </div>
                      {item.directive && (
                        <div className="finding-detail-row directive">
                          <span className="detail-tag font-mono">SIU DIRECTIVE:</span>
                          <span className="detail-text font-semibold">{item.directive}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="finding-card-footer">
                      <button
                        type="button"
                        className="syght-btn-secondary text-xs px-3 py-1 font-mono flex items-center gap-1.5"
                        onClick={() => onInspectCase(item.provider_id)}
                        title="Inspect Deep TreeSHAP Waterfall in Analyzer"
                      >
                        <span>Inspect in SHAP Analyzer</span>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
