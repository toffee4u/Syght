import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  IconNetwork,
  IconRefresh,
  IconAlert,
  IconShield,
  IconSearch,
  IconZap,
  IconCheckCircle,
} from './Icons';

export default function CollusionNetwork() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [highlightRings, setHighlightRings] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'hospital', 'doctor', 'syndicate'
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isSimulating, setIsSimulating] = useState(true);

  // Network Topology Data
  const initialNodes = useMemo(() => [
    { id: 'HOSP_03', label: 'Metro Health Syndicate (PRV_03)', type: 'hospital', x: 0.38, y: 0.36, r: 24, isSyndicate: true, centrality: 0.94, claims: 3410, payout: '₹9.8M', doctors: 34 },
    { id: 'HOSP_05', label: 'Silverline Diagnostic Hub (PRV_05)', type: 'hospital', x: 0.62, y: 0.24, r: 20, isSyndicate: true, centrality: 0.78, claims: 1890, payout: '₹4.9M', doctors: 18 },
    { id: 'HOSP_02', label: 'Apex Life Specialty (PRV_02)', type: 'hospital', x: 0.18, y: 0.68, r: 22, isSyndicate: false, centrality: 0.65, claims: 1420, payout: '₹5.1M', doctors: 2 },
    { id: 'HOSP_08', label: 'St. Jude Critical Care (PRV_08)', type: 'hospital', x: 0.82, y: 0.32, r: 20, isSyndicate: false, centrality: 0.58, claims: 980, payout: '₹6.4M', doctors: 6 },
    { id: 'HOSP_01', label: 'Shanti Gramin Clinic (PRV_01)', type: 'hospital', x: 0.84, y: 0.72, r: 18, isSyndicate: false, centrality: 0.22, claims: 410, payout: '₹1.2M', doctors: 3 },
    { id: 'HOSP_04', label: 'Galaxy Diagnostics (PRV_04)', type: 'hospital', x: 0.48, y: 0.78, r: 20, isSyndicate: false, centrality: 0.35, claims: 820, payout: '₹3.9M', doctors: 9 },

    // Syndicate Shared Doctors
    { id: 'DOC_01', label: 'Dr. Sharma (Rotating Surgeon)', type: 'doctor', x: 0.32, y: 0.48, r: 14, isSyndicate: true, centrality: 0.89, claims: 640, payout: '₹6.8M', affiliations: 'PRV_03, PRV_05' },
    { id: 'DOC_02', label: 'Dr. Patel (Cardiology Roster)', type: 'doctor', x: 0.44, y: 0.46, r: 14, isSyndicate: true, centrality: 0.86, claims: 580, payout: '₹5.9M', affiliations: 'PRV_03, PRV_05' },
    { id: 'DOC_03', label: 'Dr. Verma (Phantom Attending)', type: 'doctor', x: 0.30, y: 0.24, r: 14, isSyndicate: true, centrality: 0.91, claims: 710, payout: '₹7.4M', affiliations: 'PRV_03, PRV_05' },
    { id: 'DOC_04', label: 'Dr. Rao (Cross-Admit MD)', type: 'doctor', x: 0.52, y: 0.32, r: 14, isSyndicate: true, centrality: 0.84, claims: 520, payout: '₹5.2M', affiliations: 'PRV_03, PRV_05' },
    { id: 'DOC_05', label: 'Dr. Gupta (High-Volume Signer)', type: 'doctor', x: 0.42, y: 0.22, r: 14, isSyndicate: true, centrality: 0.88, claims: 690, payout: '₹6.9M', affiliations: 'PRV_03, PRV_05' },

    // Normal Facility Doctors
    { id: 'DOC_06', label: 'Dr. Mehta (General Surgery)', type: 'doctor', x: 0.12, y: 0.78, r: 12, isSyndicate: false, centrality: 0.31, claims: 180, payout: '₹1.8M', affiliations: 'PRV_02' },
    { id: 'DOC_07', label: 'Dr. Nair (Orthopedic)', type: 'doctor', x: 0.24, y: 0.82, r: 12, isSyndicate: false, centrality: 0.29, claims: 160, payout: '₹1.6M', affiliations: 'PRV_02' },
    { id: 'DOC_08', label: 'Dr. Singh (Critical Care)', type: 'doctor', x: 0.74, y: 0.22, r: 12, isSyndicate: false, centrality: 0.38, claims: 240, payout: '₹2.7M', affiliations: 'PRV_08' },
    { id: 'DOC_09', label: 'Dr. Iyer (Family Medicine)', type: 'doctor', x: 0.90, y: 0.82, r: 12, isSyndicate: false, centrality: 0.15, claims: 90, payout: '₹0.8M', affiliations: 'PRV_01' },
    { id: 'DOC_10', label: 'Dr. Khan (Internal Med)', type: 'doctor', x: 0.56, y: 0.86, r: 12, isSyndicate: false, centrality: 0.28, claims: 170, payout: '₹1.5M', affiliations: 'PRV_04' },

    // Beneficiary Clusters
    { id: 'BENE_A', label: 'Beneficiary Cluster A (High Churn)', type: 'bene', x: 0.24, y: 0.38, r: 10, isSyndicate: true, centrality: 0.74, claims: 890, payout: '₹9.2M' },
    { id: 'BENE_B', label: 'Beneficiary Cluster B (Repeat Claims)', type: 'bene', x: 0.38, y: 0.58, r: 10, isSyndicate: true, centrality: 0.71, claims: 780, payout: '₹8.1M' },
    { id: 'BENE_C', label: 'Beneficiary Cluster C (Synthetic IDs)', type: 'bene', x: 0.56, y: 0.44, r: 10, isSyndicate: true, centrality: 0.77, claims: 840, payout: '₹8.7M' },
    { id: 'BENE_D', label: 'Beneficiary Cluster D (Local Admitted)', type: 'bene', x: 0.10, y: 0.56, r: 10, isSyndicate: false, centrality: 0.25, claims: 190, payout: '₹1.9M' },
    { id: 'BENE_E', label: 'Beneficiary Cluster E (District Clinic)', type: 'bene', x: 0.76, y: 0.80, r: 10, isSyndicate: false, centrality: 0.18, claims: 110, payout: '₹1.1M' },
  ], []);

  const edges = useMemo(() => [
    // PRV_03 Syndicate Ring Core
    { from: 'HOSP_03', to: 'DOC_01', weight: 4.5, isSyndicate: true },
    { from: 'HOSP_03', to: 'DOC_02', weight: 4.0, isSyndicate: true },
    { from: 'HOSP_03', to: 'DOC_03', weight: 5.0, isSyndicate: true },
    { from: 'HOSP_03', to: 'DOC_04', weight: 4.0, isSyndicate: true },
    { from: 'HOSP_03', to: 'DOC_05', weight: 4.5, isSyndicate: true },

    // Cross-Facility Syndication with PRV_05
    { from: 'HOSP_05', to: 'DOC_04', weight: 3.5, isSyndicate: true },
    { from: 'HOSP_05', to: 'DOC_05', weight: 4.0, isSyndicate: true },
    { from: 'HOSP_05', to: 'DOC_02', weight: 3.0, isSyndicate: true },

    // Beneficiary Funneling
    { from: 'DOC_01', to: 'BENE_A', weight: 3.0, isSyndicate: true },
    { from: 'DOC_02', to: 'BENE_A', weight: 3.5, isSyndicate: true },
    { from: 'DOC_03', to: 'BENE_B', weight: 4.0, isSyndicate: true },
    { from: 'DOC_04', to: 'BENE_C', weight: 3.0, isSyndicate: true },
    { from: 'DOC_05', to: 'BENE_C', weight: 3.5, isSyndicate: true },

    // Independent Legitimate / Tabular Isolated Lines
    { from: 'HOSP_02', to: 'DOC_06', weight: 2.0, isSyndicate: false },
    { from: 'HOSP_02', to: 'DOC_07', weight: 2.0, isSyndicate: false },
    { from: 'DOC_06', to: 'BENE_D', weight: 1.5, isSyndicate: false },
    { from: 'HOSP_08', to: 'DOC_08', weight: 2.0, isSyndicate: false },
    { from: 'HOSP_01', to: 'DOC_09', weight: 1.8, isSyndicate: false },
    { from: 'DOC_09', to: 'BENE_E', weight: 1.2, isSyndicate: false },
    { from: 'HOSP_04', to: 'DOC_10', weight: 2.0, isSyndicate: false },
  ], []);

  // Internal interactive node positions
  const nodesRef = useRef([]);
  const draggedNodeRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const getCanvasHeight = () => {
    if (typeof window === 'undefined') return 560;
    if (window.innerWidth <= 480) return 360;
    if (window.innerWidth <= 768) return 400;
    if (window.innerWidth <= 1024) return 460;
    return 560;
  };

  const [canvasHeight, setCanvasHeight] = useState(getCanvasHeight);

  // Initialize or reset positions
  const resetLayout = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.parentElement?.clientWidth || canvas.clientWidth || 900;
    const h = getCanvasHeight();

    nodesRef.current = initialNodes.map(n => ({
      ...n,
      currentX: n.x * w,
      currentY: n.y * h,
      targetX: n.x * w,
      targetY: n.y * h,
      vx: 0,
      vy: 0,
    }));
  };

  useEffect(() => {
    resetLayout();
  }, [initialNodes]);

  // Canvas Drawing Loop with HiDPI and Flowing Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrame;
    let angle = 0;
    let particleOffset = 0;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement?.clientWidth || canvas.clientWidth || 360;
      const height = getCanvasHeight();
      setCanvasHeight(height);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Re-scale target positions
      if (nodesRef.current.length === 0) {
        resetLayout();
      } else {
        nodesRef.current.forEach(node => {
          const original = initialNodes.find(n => n.id === node.id);
          if (original) {
            node.targetX = original.x * width;
            node.targetY = original.y * height;
            if (!node.currentX || isNaN(node.currentX)) node.currentX = node.targetX;
            if (!node.currentY || isNaN(node.currentY)) node.currentY = node.targetY;
          }
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // 1. Clear background & draw crisp light atmospheric grid
      ctx.clearRect(0, 0, width, height);

      // Canvas background fill: pristine soft slate/white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Geometric micro-dot matrix pattern
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      const dotSpacing = 28;
      for (let x = 14; x < width; x += dotSpacing) {
        for (let y = 14; y < height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      angle += 0.025;
      particleOffset = (particleOffset + 0.008) % 1;

      const nodes = nodesRef.current;

      // Physics interpolation for smooth dragging/hovering
      nodes.forEach(node => {
        if (draggedNodeRef.current?.id === node.id) return;
        const dx = node.targetX - node.currentX;
        const dy = node.targetY - node.currentY;
        node.currentX += dx * 0.08;
        node.currentY += dy * 0.08;
      });

      // Filter check helper
      const isVisible = (node) => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'syndicate') return node.isSyndicate;
        if (activeFilter === 'hospital') return node.type === 'hospital';
        if (activeFilter === 'doctor') return node.type === 'doctor';
        return true;
      };

      // 2. Draw Edges
      edges.forEach((edge) => {
        const source = nodes.find(n => n.id === edge.from);
        const target = nodes.find(n => n.id === edge.to);
        if (!source || !target) return;

        const sourceVisible = isVisible(source);
        const targetVisible = isVisible(target);

        // Calculate opacity based on filter & highlight
        let edgeAlpha = 0.5;
        if (!sourceVisible || !targetVisible) {
          edgeAlpha = 0.08;
        } else if (highlightRings) {
          edgeAlpha = edge.isSyndicate ? 0.95 : 0.12;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(source.currentX, source.currentY);
        ctx.lineTo(target.currentX, target.currentY);

        if (edge.isSyndicate) {
          if (highlightRings) {
            ctx.strokeStyle = `rgba(225, 29, 72, ${edgeAlpha})`;
            ctx.lineWidth = 3.5;
            ctx.shadowColor = 'rgba(225, 29, 72, 0.4)';
            ctx.shadowBlur = 10;
          } else {
            ctx.strokeStyle = `rgba(225, 29, 72, ${edgeAlpha})`;
            ctx.lineWidth = 2.4;
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.strokeStyle = `rgba(148, 163, 184, ${edgeAlpha})`;
          ctx.lineWidth = 1.4;
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.restore();

        // 3. Flowing particles along Syndicate edges (simulating real-time kickbacks)
        if (isSimulating && edge.isSyndicate && sourceVisible && targetVisible && (!highlightRings || edge.isSyndicate)) {
          const numParticles = 2;
          for (let p = 0; p < numParticles; p++) {
            const t = (particleOffset + (p / numParticles)) % 1;
            const px = source.currentX + (target.currentX - source.currentX) * t;
            const py = source.currentY + (target.currentY - source.currentY) * t;

            ctx.save();
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#e11d48';
            ctx.shadowColor = '#e11d48';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.restore();
          }
        }
      });

      // 4. Draw Nodes
      nodes.forEach((node) => {
        const visible = isVisible(node);
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        let nodeAlpha = 1;
        if (!visible) {
          nodeAlpha = 0.2;
        } else if (highlightRings && !node.isSyndicate) {
          nodeAlpha = 0.25;
        }

        ctx.save();
        ctx.globalAlpha = nodeAlpha;

        const isMobileScreen = width < 640;
        const radiusScale = isMobileScreen ? 0.78 : 1;
        const pulseScale = node.isSyndicate ? Math.sin(angle * 1.5) * (isMobileScreen ? 1.8 : 2.5) : 0;
        const baseRadius = (node.r * radiusScale) + (isHovered || isSelected ? (isMobileScreen ? 3 : 4) : 0);

        // Expanding radar rings for Syndicate Epicenter (PRV_03)
        if (node.id === 'HOSP_03' && visible) {
          const rippleCount = 2;
          for (let r = 1; r <= rippleCount; r++) {
            const rippleR = baseRadius + ((angle * 14 + r * 16) % (isMobileScreen ? 28 : 36));
            const rippleAlpha = Math.max(0, 0.4 - (rippleR / (isMobileScreen ? 42 : 55)));
            ctx.beginPath();
            ctx.arc(node.currentX, node.currentY, rippleR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(225, 29, 72, ${rippleAlpha})`;
            ctx.lineWidth = isMobileScreen ? 1.4 : 1.8;
            ctx.stroke();
          }
        }

        // Outer glow on hover or syndicate
        if (isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(node.currentX, node.currentY, baseRadius + (isMobileScreen ? 5 : 7), 0, Math.PI * 2);
          ctx.fillStyle = node.isSyndicate ? 'rgba(225, 29, 72, 0.15)' : 'rgba(2, 132, 199, 0.15)';
          ctx.fill();
        }

        // Node Body Circle
        ctx.beginPath();
        ctx.arc(node.currentX, node.currentY, baseRadius + pulseScale, 0, Math.PI * 2);

        // Theme-tuned Palette (Clean Light Theme with High Vibrancy)
        let fillGradient;
        if (node.isSyndicate) {
          fillGradient = ctx.createRadialGradient(
            node.currentX - 4, node.currentY - 4, 2,
            node.currentX, node.currentY, baseRadius
          );
          fillGradient.addColorStop(0, '#fb7185');
          fillGradient.addColorStop(1, '#e11d48');
        } else if (node.type === 'hospital') {
          fillGradient = ctx.createRadialGradient(
            node.currentX - 4, node.currentY - 4, 2,
            node.currentX, node.currentY, baseRadius
          );
          fillGradient.addColorStop(0, '#38bdf8');
          fillGradient.addColorStop(1, '#0284c7');
        } else if (node.type === 'doctor') {
          fillGradient = ctx.createRadialGradient(
            node.currentX - 3, node.currentY - 3, 2,
            node.currentX, node.currentY, baseRadius
          );
          fillGradient.addColorStop(0, '#a855f7');
          fillGradient.addColorStop(1, '#7c3aed');
        } else {
          fillGradient = ctx.createRadialGradient(
            node.currentX - 2, node.currentY - 2, 1,
            node.currentX, node.currentY, baseRadius
          );
          fillGradient.addColorStop(0, '#34d399');
          fillGradient.addColorStop(1, '#059669');
        }

        ctx.fillStyle = fillGradient;
        ctx.shadowColor = node.isSyndicate ? 'rgba(225, 29, 72, 0.35)' : 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = isMobileScreen ? 6 : 10;
        ctx.shadowOffsetY = isMobileScreen ? 2 : 3;
        ctx.fill();

        // Node Crisp White Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isMobileScreen ? 2 : 2.5;
        ctx.shadowBlur = 0;
        ctx.stroke();

        // Inner Glyph / Symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = isMobileScreen ? '700 8.5px JetBrains Mono, monospace' : '700 10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const glyph = node.isSyndicate ? '!' : node.type === 'hospital' ? 'H' : node.type === 'doctor' ? 'MD' : 'B';
        ctx.fillText(glyph, node.currentX, node.currentY);

        // 5. Node Labels with High-Contrast White Outline
        const displayLabel = isMobileScreen
          ? (node.type === 'hospital'
              ? node.id.replace('HOSP_', 'PRV_')
              : node.type === 'doctor'
              ? node.label.split(' (')[0]
              : node.label.replace('Beneficiary ', '').split(' (')[0])
          : node.label;

        const labelY = node.currentY + baseRadius + (isMobileScreen ? 11 : 14);
        ctx.font = isMobileScreen
          ? '600 9.5px Inter, system-ui, -apple-system, sans-serif'
          : '600 11px Inter, system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';

        // White halo stroke for 100% legibility
        ctx.lineWidth = isMobileScreen ? 2.5 : 3.5;
        ctx.strokeStyle = '#ffffff';
        ctx.strokeText(displayLabel, node.currentX, labelY);

        // Dark slate text fill
        ctx.fillStyle = node.isSyndicate ? '#be123c' : '#0f172a';
        ctx.fillText(displayLabel, node.currentX, labelY);

        // Subtitle archetype tag (show on desktop, or for syndicate hubs on mobile)
        if (!isMobileScreen || node.isSyndicate) {
          ctx.font = isMobileScreen ? '500 7.5px JetBrains Mono, monospace' : '500 8.5px JetBrains Mono, monospace';
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#ffffff';
          ctx.strokeText(node.type.toUpperCase(), node.currentX, labelY + (isMobileScreen ? 9 : 11));

          ctx.fillStyle = '#64748b';
          ctx.fillText(node.type.toUpperCase(), node.currentX, labelY + (isMobileScreen ? 9 : 11));
        }

        ctx.restore();
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [edges, initialNodes, highlightRings, activeFilter, isSimulating, hoveredNode, selectedNode]);

  // Pointer & Dragging Interactions
  const findNodeAtPos = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return nodesRef.current.find((node) => {
      const dx = node.currentX - x;
      const dy = node.currentY - y;
      return Math.sqrt(dx * dx + dy * dy) <= node.r + 8;
    });
  };

  const handlePointerDown = (e) => {
    const node = findNodeAtPos(e.clientX, e.clientY);
    if (node) {
      draggedNodeRef.current = node;
      const rect = canvasRef.current.getBoundingClientRect();
      dragOffsetRef.current = {
        x: node.currentX - (e.clientX - rect.left),
        y: node.currentY - (e.clientY - rect.top),
      };
      setSelectedNode(node);
      if (e.target?.setPointerCapture && e.pointerId !== undefined) {
        try {
          e.target.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    } else {
      setSelectedNode(null);
    }
  };

  const handlePointerMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    if (draggedNodeRef.current) {
      draggedNodeRef.current.currentX = curX + dragOffsetRef.current.x;
      draggedNodeRef.current.currentY = curY + dragOffsetRef.current.y;
      draggedNodeRef.current.targetX = draggedNodeRef.current.currentX;
      draggedNodeRef.current.targetY = draggedNodeRef.current.currentY;
      return;
    }

    const hover = findNodeAtPos(e.clientX, e.clientY);
    setHoveredNode(hover || null);
  };

  const handlePointerUp = (e) => {
    if (draggedNodeRef.current && e?.target?.releasePointerCapture && e?.pointerId !== undefined) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
    draggedNodeRef.current = null;
  };

  return (
    <div className="tab-view active syght-view">
      {/* Top Page Header */}
      <div className="syght-page-header">
        <div className="page-header-title-box">
          <div className="syght-chip">
            <span className="chip-dot" />
            Bipartite Centrality Engine
          </div>
          <h1 className="syght-page-title">
            Collusion Graph Network & Syndicate Ring Visualizer
          </h1>
          <p className="syght-page-desc">
            Graph topology engine uncovering physician-hospital collusion rings, kickback recycling, 
            and multi-facility billing syndicates invisible to standard tabular models.
          </p>
        </div>

        {/* Action Controls */}
        <div className="page-header-actions" style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`syght-btn-primary ${highlightRings ? 'active-ring-spotlight' : ''}`}
            onClick={() => setHighlightRings(!highlightRings)}
            style={{
              backgroundColor: highlightRings ? '#e11d48' : undefined,
              borderColor: highlightRings ? '#be123c' : undefined,
            }}
          >
            <IconAlert size={15} />
            <span>{highlightRings ? 'Spotlight Active: PRV_03 Syndicate' : 'Spotlight Syndicate Ring (PRV_03)'}</span>
          </button>

          <button
            type="button"
            className="syght-btn-secondary"
            onClick={resetLayout}
            title="Reset Canvas Layout"
          >
            <IconRefresh size={14} />
            <span>Reset Physics</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Graph Card */}
      <section className="syght-panel" ref={containerRef} style={{ padding: '1rem', position: 'relative' }}>
        {/* Interactive Filter Toolbar & Legend */}
        <div className="network-controls-toolbar">
          <div className="network-filter-pills">
            <button
              type="button"
              className={`filter-pill-item ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Entities ({initialNodes.length})
            </button>
            <button
              type="button"
              className={`filter-pill-item ${activeFilter === 'syndicate' ? 'active' : ''}`}
              onClick={() => setActiveFilter('syndicate')}
            >
              <span className="dot-indicator dot-rose" />
              Syndicate Ring ({initialNodes.filter(n => n.isSyndicate).length})
            </button>
            <button
              type="button"
              className={`filter-pill-item ${activeFilter === 'hospital' ? 'active' : ''}`}
              onClick={() => setActiveFilter('hospital')}
            >
              <span className="dot-indicator dot-cyan" />
              Hospitals (6)
            </button>
            <button
              type="button"
              className={`filter-pill-item ${activeFilter === 'doctor' ? 'active' : ''}`}
              onClick={() => setActiveFilter('doctor')}
            >
              <span className="dot-indicator dot-purple" />
              Physicians (10)
            </button>
          </div>

          <div className="network-legend-bar">
            <div className="legend-chip">
              <span className="dot-cyan" />
              <span>Hospitals</span>
            </div>
            <div className="legend-chip">
              <span className="dot-purple" />
              <span>Shared Doctors</span>
            </div>
            <div className="legend-chip">
              <span className="dot-rose" />
              <span>Syndicate Hub</span>
            </div>
            <div className="legend-chip">
              <span className="dot-emerald" />
              <span>Beneficiaries</span>
            </div>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="canvas-wrapper" style={{ position: 'relative', marginTop: '0.75rem', width: '100%', overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            className="network-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              width: '100%',
              height: `${canvasHeight}px`,
              display: 'block',
              cursor: draggedNodeRef.current ? 'grabbing' : 'grab',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              backgroundColor: '#ffffff',
              touchAction: 'pan-y',
            }}
          />

          {/* Floating Hover Card */}
          {hoveredNode && (
            <div
              className="canvas-hover-tooltip font-mono"
              style={{
                position: 'absolute',
                left: `${Math.max(8, Math.min(hoveredNode.currentX + 16, (canvasRef.current?.clientWidth || 340) - 235))}px`,
                top: `${Math.max(8, Math.min(hoveredNode.currentY - 24, canvasHeight - 110))}px`,
                pointerEvents: 'none',
                zIndex: 30,
              }}
            >
              <div className="tooltip-title">{hoveredNode.label}</div>
              <div className="tooltip-meta">
                <span>Type: <strong>{hoveredNode.type.toUpperCase()}</strong></span>
                <span>Centrality: <strong>{hoveredNode.centrality}</strong></span>
              </div>
              <div className="tooltip-payout">
                <span>Claims: {hoveredNode.claims}</span>
                <span>•</span>
                <span>Payout: {hoveredNode.payout}</span>
              </div>
              {hoveredNode.isSyndicate && (
                <div className="tooltip-syndicate-badge">
                  CRITICAL SYNDICATE RING
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Entity Deep-Dive Telemetry Inspector */}
        {selectedNode && (
          <div className="node-details-card" style={{ marginTop: '1rem' }}>
            <div className="inspector-header">
              <div className="inspector-title-cluster">
                <span className={`inspector-status-badge ${selectedNode.isSyndicate ? 'badge-danger' : 'badge-clean'}`}>
                  {selectedNode.isSyndicate ? 'SYNDICATE RING EPICENTER' : 'VERIFIED NETWORK NODE'}
                </span>
                <h3 className="inspector-node-title font-mono">{selectedNode.label}</h3>
              </div>
              <button
                type="button"
                className="inspector-close-btn"
                onClick={() => setSelectedNode(null)}
                title="Close Inspector"
              >
                ✕
              </button>
            </div>

            <div className="inspector-grid font-mono">
              <div className="inspector-stat-box">
                <span className="stat-label">Eigenvector Centrality</span>
                <span className="stat-val text-sky-600 font-bold">{selectedNode.centrality}</span>
              </div>
              <div className="inspector-stat-box">
                <span className="stat-label">Billed Exposure</span>
                <span className="stat-val font-bold text-slate-900">{selectedNode.payout}</span>
              </div>
              <div className="inspector-stat-box">
                <span className="stat-label">Associated Claims</span>
                <span className="stat-val font-bold text-slate-900">{selectedNode.claims}</span>
              </div>
              <div className="inspector-stat-box">
                <span className="stat-label">Syndicate Interlock</span>
                <span className={`stat-val font-bold ${selectedNode.isSyndicate ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {selectedNode.isSyndicate ? '34 Colluding MDs' : 'Independent Roster'}
                </span>
              </div>
            </div>

            <div className="inspector-footer">
              <span className="inspector-directive-text">
                {selectedNode.isSyndicate
                  ? 'Directive: Cross-admit collusion confirmed across 11 syndicated branches. Freezing all pending disbursements and dispatching forensic audit summons.'
                  : 'Directive: Entity operates within expected clinical distribution limits. Standard audit schedule maintained.'}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Topology Intelligence Cards (Bento 3-Column Strip) */}
      <div className="bento-kpi-grid" style={{ marginTop: '1.5rem' }}>
        <div className="bento-card group">
          <div className="bento-watermark">01</div>
          <div className="bento-card-header">
            <span className="bento-card-label">BIPARTITE TOPOLOGY PROJECTION</span>
            <span className="bento-card-icon-box text-sky-600">
              <IconNetwork size={18} />
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
            <span className="bento-card-icon-box text-rose-600">
              <IconAlert size={18} />
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
            <span className="bento-card-label">GRAPH DEGREE SHAP LIFT</span>
            <span className="bento-card-icon-box text-emerald-600">
              <IconShield size={18} />
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
