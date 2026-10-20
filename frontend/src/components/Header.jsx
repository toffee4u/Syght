import React, { useState, useEffect } from 'react';
import {
  IconShield,
  IconZap,
  IconClipboardList,
  IconSearch,
  IconLineChart,
  IconNetwork,
  IconClock,
  IconVolume,
  IconVolumeMute,
  IconArrowUpRight,
  IconMenu,
  IconClose,
  IconPulse,
  IconDatabase,
  IconBarChart,
} from './Icons';

export default function Header({
  activeTab,
  setActiveTab,
  healthData,
  soundEnabled,
  toggleSound,
  queueCount,
  resultsCount,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1140) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const tabs = [
    { id: 'tab-dashboard', label: 'Command', icon: IconZap, desc: 'Live Fraud Radar & Triage' },
    { id: 'tab-queue', label: 'Review', icon: IconClipboardList, badge: queueCount, desc: 'Prioritized Worklist' },
    { id: 'tab-dataset', label: 'Dataset', icon: IconDatabase, desc: 'Upload Claims Dataset' },
    { id: 'tab-results', label: 'Results', icon: IconBarChart, badge: resultsCount, desc: 'Confidence & Graph Report' },
    { id: 'tab-analyzer', label: 'Analyzer', icon: IconSearch, desc: 'SHAP Feature Contributions' },
    { id: 'tab-performance', label: 'Benchmarks', icon: IconLineChart, desc: 'ROC/PR & Cost Curves' },
    { id: 'tab-network', label: 'Network', icon: IconNetwork, desc: 'Multi-Provider Rings' },
    { id: 'tab-preauth', label: 'Pre-Auth', icon: IconClock, desc: 'Sub-5ms Real-Time API' },
  ];

  const isHealthy = healthData?.model_loaded;
  const statusText = isHealthy
    ? `${healthData.selected_model || 'LightGBM'} Ready`
    : 'Initializing...';

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="syght-header">
      <nav aria-label="Main Navigation" className="syght-navbar">
        {/* Brand & Team Pulse Tag */}
        <div className="navbar-brand-cluster">
          <button 
            type="button" 
            className="brand-anchor" 
            onClick={() => handleSelectTab('tab-dashboard')}
            title="Syght — Enterprise Fraud Detection Platform"
          >
            <div className="brand-gem-container">
              <IconShield size={20} className="brand-gem-icon" />
              <span className="brand-gem-aura" />
            </div>
            <div className="brand-identity">
              <div className="brand-name">
                SYGHT
              </div>
            </div>
          </button>
        </div>

        {/* Center Pill Nav (Desktop: >= 1150px) */}
        <div className="navbar-nav-pills">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-pill-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => handleSelectTab(tab.id)}
                title={tab.desc}
              >
                <Icon size={14} className="pill-icon shrink-0" />
                <span className="pill-label">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="pill-counter-badge">{tab.badge}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Actions & Utilities */}
        <div className="navbar-actions-cluster">
          {/* Health Status Pill */}
          <div 
            className={`engine-status-pill ${isHealthy ? 'engine-live' : 'engine-standby'}`}
            title={`Decision Threshold: ${healthData?.decision_threshold?.toFixed(4) || '0.5364'}`}
          >
            <span className={`engine-beacon ${isHealthy ? 'is-pulsing' : ''}`} />
            <span className="engine-status-text">{statusText}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            className="control-icon-btn"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute alert sounds' : 'Unmute alert sounds'}
            title={soundEnabled ? 'Mute Audio Alerts' : 'Unmute Audio Alerts'}
          >
            {soundEnabled ? (
              <IconVolume size={18} />
            ) : (
              <IconVolumeMute size={18} />
            )}
          </button>

          {/* API Docs Button */}
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-cta-btn"
            title="FastAPI Interactive Swagger Documentation"
          >
            <span>API Docs</span>
            <IconArrowUpRight size={14} className="cta-icon" />
          </a>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="mobile-drawer-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-brand">
                <IconShield size={20} className="text-cyan-400" />
                <span className="mobile-brand-title">SYGHT</span>
                <span className="team-pulse-pill compact">
                  <span className="pulse-dot-beacon" />
                  Team Pulse
                </span>
              </div>
              <button 
                type="button" 
                className="mobile-close-btn" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <IconClose size={18} />
              </button>
            </div>

            <div className="mobile-drawer-nav">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectTab(tab.id)}
                  >
                    <div className="mobile-nav-icon-box">
                      <Icon size={18} />
                    </div>
                    <div className="mobile-nav-content">
                      <div className="mobile-nav-title">
                        {tab.label}
                        {tab.badge !== undefined && tab.badge > 0 && (
                          <span className="mobile-counter-badge">{tab.badge}</span>
                        )}
                      </div>
                      <div className="mobile-nav-desc">{tab.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mobile-drawer-footer">
              <div className="mobile-status-row">
                <span className="status-label">Engine Health</span>
                <div className={`engine-status-pill ${isHealthy ? 'engine-live' : 'engine-standby'}`}>
                  <span className={`engine-beacon ${isHealthy ? 'is-pulsing' : ''}`} />
                  <span className="engine-status-text">{statusText}</span>
                </div>
              </div>
              <div className="mobile-actions-row">
                <button
                  type="button"
                  className="mobile-sound-btn"
                  onClick={toggleSound}
                >
                  {soundEnabled ? <IconVolume size={16} /> : <IconVolumeMute size={16} />}
                  <span>{soundEnabled ? 'Alert Audio On' : 'Alert Audio Muted'}</span>
                </button>
                <a
                  href="/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-api-link"
                >
                  <span>API Docs</span>
                  <IconArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
