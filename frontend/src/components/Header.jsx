import React, { useState, useEffect } from 'react';
import {
  HugeShield,
  HugeZap,
  HugeClipboardList,
  HugeSearch,
  HugeLineChart,
  HugeNetwork,
  HugeClock,
  HugeVolume,
  HugeVolumeMute,
  HugeArrowUpRight,
  HugeMenu,
  HugeClose,
  HugePulse,
} from './HugeIcons';

export default function Header({
  activeTab,
  setActiveTab,
  healthData,
  soundEnabled,
  toggleSound,
  queueCount,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
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
    { id: 'tab-dashboard', label: 'Command Center', icon: HugeZap, desc: 'Live Fraud Radar & Triage' },
    { id: 'tab-queue', label: 'Review Queue', icon: HugeClipboardList, badge: queueCount, desc: 'Prioritized Worklist' },
    { id: 'tab-analyzer', label: 'Claim Analyzer', icon: HugeSearch, desc: 'SHAP Feature Contributions' },
    { id: 'tab-performance', label: 'Model Benchmarks', icon: HugeLineChart, desc: 'ROC/PR & Cost Curves' },
    { id: 'tab-network', label: 'Collusion Graph', icon: HugeNetwork, desc: 'Multi-Provider Rings' },
    { id: 'tab-preauth', label: 'Pre-Auth Gateway', icon: HugeClock, desc: 'Sub-5ms Real-Time API' },
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
    <header className="superbrain-header">
      <nav aria-label="Main Navigation" className="superbrain-navbar">
        {/* Brand & Team Pulse Tag */}
        <div className="navbar-brand-cluster">
          <button 
            type="button" 
            className="brand-anchor" 
            onClick={() => handleSelectTab('tab-dashboard')}
            title="Syght — Team Pulse Enterprise Fraud Detection"
          >
            <div className="brand-gem-container">
              <HugeShield size={22} className="brand-gem-icon" />
              <span className="brand-gem-aura" />
            </div>
            <div className="brand-identity">
              <div className="brand-name">
                SYGHT
              </div>
            </div>
          </button>

          {/* Team Pulse Signature Badge */}
          <div className="team-pulse-pill" title="Engineered by Team Pulse">
            <span className="pulse-dot-beacon" />
            <span className="team-pulse-label">Team Pulse</span>
          </div>
        </div>

        {/* Center Pill Nav (Desktop: >= 1024px) */}
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
              >
                <Icon size={16} className="pill-icon" />
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
              <HugeVolume size={18} />
            ) : (
              <HugeVolumeMute size={18} />
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
            <HugeArrowUpRight size={14} className="cta-icon" />
          </a>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <HugeClose size={20} /> : <HugeMenu size={20} />}
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
                <HugeShield size={20} className="text-cyan-400" />
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
                <HugeClose size={18} />
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
                  {soundEnabled ? <HugeVolume size={16} /> : <HugeVolumeMute size={16} />}
                  <span>{soundEnabled ? 'Alert Audio On' : 'Alert Audio Muted'}</span>
                </button>
                <a
                  href="/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-api-link"
                >
                  <span>API Docs</span>
                  <HugeArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
