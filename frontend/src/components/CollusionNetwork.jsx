import React, { useRef, useEffect, useState } from 'react';
import { 
  Network, 
  RotateCcw, 
  AlertCircle, 
  Shield, 
  Info, 
  Users, 
  Building2 
} from 'lucide-react';

export default function CollusionNetwork() {
  const canvasRef = useRef(null);
  const [highlightRings, setHighlightRings] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas
    const updateSize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 540;
    };
    updateSize();

    // Node definitions
    const initialNodes = [
      // Hospitals (Red = Suspicious, Cyan = Normal)
      { id: 'HOSP_03', label: 'PRV_03 (Syndicate)', type: 'hospital', x: 280, y: 160, vx: 0, vy: 0, r: 24, isSyndicate: true },
      { id: 'HOSP_02', label: 'PRV_02 (Surgery Mill)', type: 'hospital', x: 180, y: 380, vx: 0, vy: 0, r: 22, isSyndicate: false },
      { id: 'HOSP_08', label: 'PRV_08 (ICU Upcoding)', type: 'hospital', x: 620, y: 140, vx: 0, vy: 0, r: 22, isSyndicate: false },
      { id: 'HOSP_01', label: 'PRV_01 (Rural Clinic)', type: 'hospital', x: 740, y: 380, vx: 0, vy: 0, r: 18, isSyndicate: false },
      { id: 'HOSP_04', label: 'PRV_04 (District Gen)', type: 'hospital', x: 420, y: 440, vx: 0, vy: 0, r: 20, isSyndicate: false },
      { id: 'HOSP_05', label: 'PRV_05 (Unbundling)', type: 'hospital', x: 500, y: 60, vx: 0, vy: 0, r: 18, isSyndicate: false },

      // Physicians (Shared doctors in syndicate)
      { id: 'DOC_01', label: 'Dr. Sharma (Shared)', type: 'doctor', x: 230, y: 220, vx: 0, vy: 0, r: 14, isSyndicate: true },
      { id: 'DOC_02', label: 'Dr. Patel (Shared)', type: 'doctor', x: 330, y: 190, vx: 0, vy: 0, r: 14, isSyndicate: true },
      { id: 'DOC_03', label: 'Dr. Verma (Shared)', type: 'doctor', x: 290, y: 260, vx: 0, vy: 0, r: 14, isSyndicate: true },
      { id: 'DOC_04', label: 'Dr. Rao (Shared)', type: 'doctor', x: 360, y: 240, vx: 0, vy: 0, r: 14, isSyndicate: true },
      { id: 'DOC_05', label: 'Dr. Gupta (Shared)', type: 'doctor', x: 410, y: 180, vx: 0, vy: 0, r: 14, isSyndicate: true },
      
      // Normal doctors
      { id: 'DOC_06', label: 'Dr. Mehta', type: 'doctor', x: 140, y: 440, vx: 0, vy: 0, r: 12, isSyndicate: false },
      { id: 'DOC_07', label: 'Dr. Nair', type: 'doctor', x: 220, y: 450, vx: 0, vy: 0, r: 12, isSyndicate: false },
      { id: 'DOC_08', label: 'Dr. Singh', type: 'doctor', x: 670, y: 190, vx: 0, vy: 0, r: 12, isSyndicate: false },
      { id: 'DOC_09', label: 'Dr. Iyer', type: 'doctor', x: 790, y: 430, vx: 0, vy: 0, r: 12, isSyndicate: false },
      { id: 'DOC_10', label: 'Dr. Khan', type: 'doctor', x: 480, y: 460, vx: 0, vy: 0, r: 12, isSyndicate: false },

      // Beneficiary clusters
      { id: 'BENE_A', label: 'Beneficiary Cluster A', type: 'bene', x: 200, y: 110, vx: 0, vy: 0, r: 9, isSyndicate: true },
      { id: 'BENE_B', label: 'Beneficiary Cluster B', type: 'bene', x: 340, y: 90, vx: 0, vy: 0, r: 9, isSyndicate: true },
      { id: 'BENE_C', label: 'Beneficiary Cluster C', type: 'bene', x: 420, y: 120, vx: 0, vy: 0, r: 9, isSyndicate: true },
      { id: 'BENE_D', label: 'Beneficiary Cluster D', type: 'bene', x: 120, y: 340, vx: 0, vy: 0, r: 9, isSyndicate: false },
      { id: 'BENE_E', label: 'Beneficiary Cluster E', x: 690, y: 90, type: 'bene', vx: 0, vy: 0, r: 9, isSyndicate: false }
    ];

    const links = [
      // Syndicate Connections
      { source: 'HOSP_03', target: 'DOC_01', isSyndicate: true },
      { source: 'HOSP_03', target: 'DOC_02', isSyndicate: true },
      { source: 'HOSP_03', target: 'DOC_03', isSyndicate: true },
      { source: 'HOSP_03', target: 'DOC_04', isSyndicate: true },
      { source: 'HOSP_03', target: 'DOC_05', isSyndicate: true },
      { source: 'HOSP_05', target: 'DOC_04', isSyndicate: true },
      { source: 'HOSP_05', target: 'DOC_05', isSyndicate: true },
      { source: 'DOC_01', target: 'BENE_A', isSyndicate: true },
      { source: 'DOC_02', target: 'BENE_B', isSyndicate: true },
      { source: 'DOC_03', target: 'BENE_C', isSyndicate: true },
      { source: 'DOC_04', target: 'BENE_A', isSyndicate: true },
      { source: 'DOC_05', target: 'BENE_C', isSyndicate: true },

      // Normal Connections
      { source: 'HOSP_02', target: 'DOC_06', isSyndicate: false },
      { source: 'HOSP_02', target: 'DOC_07', isSyndicate: false },
      { source: 'DOC_06', target: 'BENE_D', isSyndicate: false },
      { source: 'HOSP_08', target: 'DOC_08', isSyndicate: false },
      { source: 'DOC_08', target: 'BENE_E', isSyndicate: false },
      { source: 'HOSP_01', target: 'DOC_09', isSyndicate: false },
      { source: 'HOSP_04', target: 'DOC_10', isSyndicate: false }
    ];

    let nodes = initialNodes;
    let draggingNode = null;
    let animationFrameId = null;

    // Simulation loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simple spring and repulsion physics
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 130) {
            const force = (130 - dist) / 130 * 0.05;
            nodes[i].vx -= (dx / dist) * force;
            nodes[i].vy -= (dy / dist) * force;
            nodes[j].vx += (dx / dist) * force;
            nodes[j].vy += (dy / dist) * force;
          }
        }
      }

      // Link attraction
      links.forEach(l => {
        const s = nodes.find(n => n.id === l.source);
        const t = nodes.find(n => n.id === l.target);
        if (s && t) {
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 75;
          const force = (dist - targetDist) * 0.015;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;
          t.vx -= (dx / dist) * force;
          t.vy -= (dy / dist) * force;

          // Draw Link
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);
          if (highlightRings && l.isSyndicate) {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 10;
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      // Update positions & draw nodes
      nodes.forEach(n => {
        if (n !== draggingNode) {
          n.x += n.vx;
          n.y += n.vy;
          n.vx *= 0.88;
          n.vy *= 0.88;

          // Bounds
          n.x = Math.max(n.r + 10, Math.min(canvas.width - n.r - 10, n.x));
          n.y = Math.max(n.r + 10, Math.min(canvas.height - n.r - 10, n.y));
        }

        // Draw node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);

        if (highlightRings && n.isSyndicate) {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 15;
        } else if (n.type === 'hospital') {
          ctx.fillStyle = '#00f2fe';
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 8;
        } else if (n.type === 'doctor') {
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = '#10b981';
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + n.r + 14);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse events
    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const hit = nodes.find(n => {
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        return Math.sqrt(dx * dx + dy * dy) <= n.r;
      });

      if (hit) {
        draggingNode = hit;
        setSelectedNode(hit);
      }
    };

    const handleMouseMove = (e) => {
      if (!draggingNode) return;
      const rect = canvas.getBoundingClientRect();
      draggingNode.x = e.clientX - rect.left;
      draggingNode.y = e.clientY - rect.top;
      draggingNode.vx = 0;
      draggingNode.vy = 0;
    };

    const handleMouseUp = () => {
      draggingNode = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', updateSize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', updateSize);
    };
  }, [highlightRings]);

  return (
    <div className="tab-view active">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={26} className="text-accent" strokeWidth={1.8} />
            Bipartite Hospital-Physician Collusion Network
          </h1>
          <p className="page-description">
            Interactive force-directed graph revealing physician-recycling cartels, phantom surgical mills, 
            and kickback syndicates across 5,410 healthcare providers. Drag nodes to explore.
          </p>
        </div>

        <div className="action-buttons-flex">
          <button 
            className="btn-secondary" 
            onClick={() => setHighlightRings(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={15} /> Reset Physics
          </button>
          <button 
            className="btn-primary" 
            onClick={() => setHighlightRings(!highlightRings)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <AlertCircle size={15} /> 
            {highlightRings ? 'Clear Highlight' : 'Highlight Syndicate Rings (PRV_03)'}
          </button>
        </div>
      </div>

      {/* Main Canvas Card */}
      <section className="dashboard-card" style={{ padding: '1rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.5rem', zIndex: 10, display: 'flex', gap: '12px' }}>
          <div className="legend-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00f2fe', display: 'inline-block' }}></span>
            Hospitals
          </div>
          <div className="legend-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#a855f7', display: 'inline-block' }}></span>
            Shared Physicians
          </div>
          <div className="legend-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
            Syndicate Ring
          </div>
          <div className="legend-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
            Beneficiaries
          </div>
        </div>

        <canvas 
          ref={canvasRef} 
          style={{ width: '100%', height: '540px', cursor: 'grab', background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.8) 0%, rgba(7, 11, 20, 0.95) 100%)', borderRadius: '8px' }}
        ></canvas>

        {selectedNode && (
          <div className="node-details-card" style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span className="mono-text font-bold" style={{ color: '#00f2fe' }}>Selected Node: {selectedNode.label}</span>
            <span style={{ marginLeft: '1rem', color: '#94a3b8', fontSize: '0.82rem' }}>Type: {selectedNode.type.toUpperCase()} | Syndicate Flag: {selectedNode.isSyndicate ? 'CRITICAL RISK RING' : 'NORMAL'}</span>
          </div>
        )}
      </section>

      {/* Network Topology Intelligence Cards */}
      <div className="kpi-grid" style={{ marginTop: '1.5rem' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">NETWORK TOPOLOGY INTELLIGENCE</span>
            <span className="kpi-icon"><Network size={18} className="text-accent" /></span>
          </div>
          <div className="kpi-sub" style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>
            Bipartite graph projections compute degree centrality and clustering coefficients across 5,410 hospitals and 55,000+ physicians.
          </div>
        </div>

        <div className="kpi-card alert-card">
          <div className="kpi-header">
            <span className="kpi-title">SYNDICATE RING DETECTION (PRV_03)</span>
            <span className="kpi-icon"><AlertCircle size={18} className="text-danger" /></span>
          </div>
          <div className="kpi-sub danger" style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>
            34 doctors shared across 11 syndicated branches billing simultaneous surgical interventions in physically disjoint districts.
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">GRAPH DEGREE SHAP CONTRIBUTION</span>
            <span className="kpi-icon"><Shield size={18} className="text-accent" /></span>
          </div>
          <div className="kpi-sub positive" style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>
            Network centrality features contribute +0.264 mean SHAP to fraud classifications, capturing collusion missed by tabular analysis.
          </div>
        </div>
      </div>
    </div>
  );
}
