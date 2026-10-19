import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AlertTicker() {
  const alerts = [
    {
      type: 'danger',
      icon: AlertCircle,
      target: 'PRV_02_PHANTOM_SURGERY_MILL',
      desc: '460 Inpatient Surgeries Billed by 2 Attending Doctors ($5,100,000 Payout) — 100.0% Fraud Risk'
    },
    {
      type: 'danger',
      icon: AlertCircle,
      target: 'PRV_03_KICKBACK_COLLUSION_RING',
      desc: 'Doctor Recycling Syndicate (95% Shared Physicians across 11 Hospitals) — Critical Audit Triggered'
    },
    {
      type: 'danger',
      icon: AlertCircle,
      target: 'PRV_08_ICU_LENGTH_OF_STAY_UPCODING',
      desc: 'Artificial ICU Stay Prolongation (16.8 Days Mean LOS, Max 48 Days) — 99.9% Fraud Risk'
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      target: 'PRV_05_UNBUNDLING_DIAGNOSTIC_LAB',
      desc: '44% Duplicate Same-Day Beneficiary Tests Detected — Automated Fee Bundling Recoup Triggered'
    },
    {
      type: 'success',
      icon: CheckCircle2,
      target: 'PRV_01_RURAL_PRIMARY_CLINIC',
      desc: 'Rural Primary Healthcare Center Clean & Auto-Cleared — Expedited Green-Channel Disbursement'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alerts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [alerts.length]);

  const activeAlert = alerts[currentIndex];
  const Icon = activeAlert.icon;

  return (
    <section className="alert-ticker-bar">
      <div className="ticker-label">
        <span className="ticker-beacon"></span> LIVE FRAUD ALERT
      </div>
      <div className="ticker-content" key={currentIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon 
          size={16} 
          className={activeAlert.type === 'danger' ? 'text-danger' : activeAlert.type === 'warning' ? 'text-warning' : 'text-success'} 
          strokeWidth={2}
        />
        <span className="ticker-item highlight">{activeAlert.target}</span>: {activeAlert.desc}
      </div>
    </section>
  );
}
