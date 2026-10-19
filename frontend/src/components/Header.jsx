import React from 'react';
import { 
  Shield, 
  Zap, 
  ClipboardList, 
  Search, 
  LineChart, 
  Network, 
  Clock, 
  Volume2, 
  VolumeX, 
  ExternalLink 
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  healthData, 
  soundEnabled, 
  toggleSound, 
  queueCount 
}) {
  const tabs = [
    { id: 'tab-dashboard', label: 'Command Center', icon: Zap },
    { id: 'tab-queue', label: 'Priority Review Queue', icon: ClipboardList, badge: queueCount },
    { id: 'tab-analyzer', label: 'Claim & Provider Analyzer', icon: Search },
    { id: 'tab-performance', label: 'Model Performance & Benchmark', icon: LineChart },
    { id: 'tab-network', label: 'Collusion Graph Network', icon: Network },
    { id: 'tab-preauth', label: 'Real-Time Pre-Auth Gateway', icon: Clock }
  ];

  const isHealthy = healthData?.model_loaded;
  const statusText = isHealthy 
    ? `${healthData.selected_model || 'LightGBM'} Active • Threshold ${healthData.decision_threshold?.toFixed(4) || '0.5364'}`
    : 'Model Initializing...';

  return (
    <header className="top-nav">
      <div className="nav-brand">
        <div className="brand-logo">
          <Shield className="logo-icon-svg" size={24} strokeWidth={1.8} />
          <div className="logo-pulse"></div>
        </div>
        <div className="brand-text">
          <div className="brand-title">
            SYGHT<span className="brand-badge">ENTERPRISE</span>
          </div>
          <div className="brand-sub">Healthcare Insurance Fraud Intelligence Engine</div>
        </div>
      </div>

      <nav className="nav-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">
                <Icon size={16} strokeWidth={2} />
              </span>
              {tab.label}
              {tab.badge !== undefined && (
                <span className="tab-badge">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="nav-actions">
        <div className={`status-pill ${isHealthy ? 'status-healthy' : 'status-pending'}`}>
          <span className={`status-dot ${isHealthy ? 'pulsing' : ''}`}></span>
          <span>{statusText}</span>
        </div>
        <button 
          className="btn-icon" 
          onClick={toggleSound} 
          title={soundEnabled ? 'Mute Alert Audio' : 'Unmute Alert Audio'}
        >
          {soundEnabled ? <Volume2 size={18} strokeWidth={1.8} /> : <VolumeX size={18} strokeWidth={1.8} />}
        </button>
        <a 
          href="/docs" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-api-docs"
          title="Interactive OpenAPI 3.0 Documentation"
        >
          API Docs <ExternalLink size={13} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
        </a>
      </div>
    </header>
  );
}
