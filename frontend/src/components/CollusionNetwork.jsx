import React, { useRef, useEffect, useState } from 'react';
import {
  HugeNetwork,
  HugeRefresh,
  HugeAlert,
  HugeShield,
  HugeSparkles,
} from './HugeIcons';

export default function CollusionNetwork() {
  const canvasRef = useRef(null);
  const [highlightRings, setHighlightRings] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateSize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 540;
    };
    updateSize();

    const initialNodes = [
      { id: 'HOSP_03', label: 'PRV_03 (Syndicate Hub)', type: 'hospital', x: 280, y: 160, vx: 0, vy: 0, r: 24, isSyndicate: true },
      { id: 'HOSP_02', label: 'PRV_02 (Surgery Mill)', type: 'hospital', x: 180, y: 380, vx: 0, vy: 0, r: 22, isSyndicate: false },
      { id: 'HOSP_08', label: 'PRV_08 (ICU Upcoding)', type: 'hospital', x: 620, y: 140, vx: 0, vy: 0, r: 22, isSyndicate: false },
      { id: 'HOSP_01', label: 'PRV_01 (Rural Clinic)', type: 'hospital', x: 740, y: 380, vx: 0, vy: 0, r: 18, isSyndicate: false },
      { id: 'HOSP_04', label: 'PRV_04 (District Gen)', type: 'hospital', x: 420, y: 440, vx: 0, vy: 0, r: 20, isSyndicate: false },
      { id: 'HOSP_05', label: 'PRV_05 (Unbundling)', type: 'hospital', x: 500, y: 60, vx: 0, vy: 0, r: 18, isSyndicate: false },

      { id: 'DOC_01', label: 'Dr. Sharma (Shared)', type: 'doctor', x: 230, y: 220, vx: 0, vy: 0, r: 14, isSyndicate: true },
      { id: 'DOC_02', label: 'Dr. Patel (Shared)', type: 'doctor', x: 330, y: 190, vx: 0, vy: 0, r: 14, isSyndicate: true },
      { id: 'DOC_03', label: 'Dr. Verma (Shared)', type: 'doctor', x: 290, y: 260, vx: 0, vy: 0, r: 14, isSyndicate: true },
      { id: 'DOC_04', label: 'Dr. Rao (Shared)', type: 'doctor', x: 360, y: 240, vx: 0, vy: 0, r: 14, isSyndicate: true },
      { id: 'DOC_05', label: 'Dr. Gupta (Shared)', type: 'doctor', x: 410, y: 180, vx: 0, vy: 0, r: 14, isSyndicate: true },

      { id: 'DOC_06', label: 'Dr. Mehta', type: 'doctor', x: 140, y: 440, vx: 0, vy: 0, r: 12, isSyndicate: false },
      { id: 'DOC_07', label: 'Dr. Nair', type: 'doctor', x: 220, y: 450, vx: 0, vy: 0, r: 12, isSyndicate: false },
      { id: 'DOC_08', label: 'Dr. Singh', type: 'doctor', x: 670, y: 190, vx: 0, vy: 0, r: 12, isSyndicate: false },
      { id: 'DOC_09', label: 'Dr. Iyer', type: 'doctor', x: 790, y: 430, vx: 0, vy: 0, r: 12, isSyndicate: false },
      { id: 'DOC_10', label: 'Dr. Khan', type: 'doctor', x: 480, y: 460, vx: 0, vy: 0, r: 12, isSyndicate: false },

      { id: 'BENE_A', label: 'Beneficiary Cluster A', type: 'bene', x: 200, y: 110, vx: 0, vy: 0, r: 9, isSyndicate: true },
      { id: 'BENE_B', label: 'Beneficiary Cluster B', type: 'bene', x: 340, y: 90, vx: 0, vy: 0, r: 9, isSyndicate: true },
      { id: 'BENE_C', label: 'Beneficiary Cluster C', type: 'bene', x: 420, y: 120, vx: 0, vy: 0, r: 9, isSyndicate: true },
      { id: 'BENE_D', label: 'Beneficiary Cluster D', type: 'bene', x: 120, y: 340, vx: 0, vy: 0, r: 9, isSyndicate: false },
      { id: 'BENE_E', label: 'Beneficiary Cluster E', type: 'bene', x: 690, y: 90, vx: 0, vy: 0, r: 9, isSyndicate: false },
    ];

    const edges = [
      { from: 'HOSP_03', to: 'DOC_01', weight: 4, isSyndicate: true },
      { from: 'HOSP_03', to: 'DOC_02', weight: 3, isSyndicate: true },
      { from: 'HOSP_03', to: 'DOC_03', weight: 5, isSyndicate: true },
      { from: 'HOSP_03', to: 'DOC_04', weight: 4, isSyndicate: true },
      { from: 'HOSP_03', to: 'DOC_05', weight: 3, isSyndicate: true },
      { from: 'HOSP_05', to: 'DOC_04', weight: 3, isSyndicate: true },
      { from: 'HOSP_05', to: 'DOC_05', weight: 4, isSyndicate: true },

      { from: 'DOC_01', to: 'BENE_A', weight: 2, isSyndicate: true },
      { from: 'DOC_02', to: 'BENE_A', weight: 3, isSyndicate: true },
      { from: 'DOC_03', to: 'BENE_B', weight: 4, isSyndicate: true },
      { from: 'DOC_04', to: 'BENE_C', weight: 3, isSyndicate: true },
      { from: 'DOC_05', to: 'BENE_C', weight: 2, isSyndicate: true },

      { from: 'HOSP_02', to: 'DOC_06', weight: 2, isSyndicate: false },
      { from: 'HOSP_02', to: 'DOC_07', weight: 2, isSyndicate: false },
      { from: 'DOC_06', to: 'BENE_D', weight: 1, isSyndicate: false },
      { from: 'HOSP_08', to: 'DOC_08', weight: 2, isSyndicate: false },
      { from: 'DOC_08', to: 'BENE_E', weight: 1, isSyndicate: false },
      { from: 'HOSP_01', to: 'DOC_09', weight: 2, isSyndicate: false },
      { from: 'HOSP_04', to: 'DOC_10', weight: 2, isSyndicate: false },
    ];

    let animationFrame;
    let nodes = initialNodes.map(n => ({ ...n }));
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.015;

      edges.forEach((edge) => {
        const source = nodes.find(n => n.id === edge.from);
        const target = nodes.find(n => n.id === edge.to);
        if (!source || !target) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (highlightRings && edge.isSyndicate) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
        } else if (edge.isSyndicate) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      nodes.forEach((node) => {
        ctx.beginPath();
        const pulse = node.isSyndicate ? Math.sin(angle) * 3 : 0;
        ctx.arc(node.x, node.y, node.r + pulse, 0, Math.PI * 2);

        if (node.isSyndicate) {
          ctx.fillStyle = highlightRings ? '#ef4444' : '#f87171';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 14;
        } else if (node.type === 'hospital') {
          ctx.fillStyle = '#00f2fe';
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 8;
        } else if (node.type === 'doctor') {
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 4;
        }

        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.r + 14);
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const clicked = nodes.find((n) => {
        const dx = n.x - clickX;
        const dy = n.y - clickY;
        return Math.sqrt(dx * dx + dy * dy) <= n.r + 5;
      });

      setSelectedNode(clicked || null);
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [highlightRings]);

  return (
    <div className="tab-view active superbrain-view">
      <div className="superbrain-page-header">
        <div className="page-header-title-box">
          <div className="superbrain-chip">
            <span className="chip-dot" />
            Bipartite Centrality Engine
          </div>
          <h1 className="superbrain-page-title">
            Collusion Graph Network & Syndicate Ring Visualizer
          </h1>
          <p className="superbrain-page-desc">
            Graph topology model revealing physician-hospital bipartite ties, kickback rings, 
            and multi-facility billing syndicates undetectable via isolated tabular features.
          </p>
        </div>
        <button
          type="button"
          className="superbrain-btn-primary"
          onClick={() => setHighlightRings(!highlightRings)}
        >
          <HugeRefresh size={15} />
          <span>{highlightRings ? 'Disable Ring Spotlight' : 'Spotlight Syndicate Rings (PRV_03)'}</span>
        </button>
      </div>

      <section className="superbrain-panel" style={{ padding: '1rem', position: 'relative' }}>
        <div className="network-legend-bar">
          <div className="legend-chip">
            <span className="dot-cyan" />
            <span>Hospitals</span>
          </div>
          <div className="legend-chip">
            <span className="dot-purple" />
            <span>Shared Physicians</span>
          </div>
          <div className="legend-chip">
            <span className="dot-rose" />
            <span>Syndicate Ring</span>
          </div>
          <div className="legend-chip">
            <span className="dot-emerald" />
            <span>Beneficiaries</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="network-canvas"
          style={{ width: '100%', height: '540px', cursor: 'grab', borderRadius: '14px' }}
        />

        {selectedNode && (
          <div className="node-details-card font-mono">
            <span className="text-cyan-400 font-bold">Selected Node: {selectedNode.label}</span>
            <span className="text-neutral-400 ml-4">
              Type: {selectedNode.type.toUpperCase()} | Status: {selectedNode.isSyndicate ? 'CRITICAL RISK RING' : 'NORMAL'}
            </span>
          </div>
        )}
      </section>

      {/* Network Topology Intelligence Cards (Bento) */}
      <div className="bento-kpi-grid" style={{ marginTop: '1.5rem' }}>
        <div className="bento-card group">
          <div className="bento-watermark">01</div>
          <div className="bento-card-header">
            <span className="bento-card-label">NETWORK TOPOLOGY INTELLIGENCE</span>
            <span className="bento-card-icon-box text-cyan-400">
              <HugeNetwork size={18} />
            </span>
          </div>
          <div className="bento-card-sub" style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>
            Bipartite graph projections compute degree centrality and clustering coefficients across 5,410 hospitals and 55,000+ physicians.
          </div>
          <div className="bento-hairline-indicator accent-cyan" />
        </div>

        <div className="bento-card group">
          <div className="bento-watermark">02</div>
          <div className="bento-card-header">
            <span className="bento-card-label">SYNDICATE RING (PRV_03)</span>
            <span className="bento-card-icon-box text-rose-400">
              <HugeAlert size={18} />
            </span>
          </div>
          <div className="bento-card-sub danger" style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>
            34 doctors shared across 11 syndicated branches billing simultaneous surgical interventions in physically disjoint districts.
          </div>
          <div className="bento-hairline-indicator accent-rose" />
        </div>

        <div className="bento-card group">
          <div className="bento-watermark">03</div>
          <div className="bento-card-header">
            <span className="bento-card-label">GRAPH DEGREE SHAP CONTRIBUTION</span>
            <span className="bento-card-icon-box text-emerald-400">
              <HugeShield size={18} />
            </span>
          </div>
          <div className="bento-card-sub positive" style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>
            Network centrality features contribute +0.264 mean SHAP to fraud classifications, capturing collusion missed by tabular analysis.
          </div>
          <div className="bento-hairline-indicator accent-emerald" />
        </div>
      </div>
    </div>
  );
}
