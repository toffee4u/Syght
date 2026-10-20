import React, { useState, useEffect } from 'react';
import { HugeAlert, HugeCheckCircle } from './HugeIcons';

export default function AlertTicker() {
  const alerts = [
    {
      type: 'danger',
      icon: HugeAlert,
      target: 'PRV_02_PHANTOM_SURGERY_MILL',
      desc: '460 Inpatient Surgeries Billed by 2 Attending Doctors ($5,100,000 Payout) — 100.0% Fraud Risk',
    },
    {
      type: 'danger',
      icon: HugeAlert,
      target: 'PRV_03_KICKBACK_COLLUSION_RING',
      desc: 'Doctor Recycling Syndicate (95% Shared Physicians across 11 Hospitals) — Critical Audit Triggered',
    },
    {
      type: 'danger',
      icon: HugeAlert,
      target: 'PRV_08_ICU_LENGTH_OF_STAY_UPCODING',
      desc: 'Artificial ICU Stay Prolongation (16.8 Days Mean LOS, Max 48 Days) — 99.9% Fraud Risk',
    },
    {
      type: 'warning',
      icon: HugeAlert,
      target: 'PRV_05_UNBUNDLING_DIAGNOSTIC_LAB',
      desc: '44% Duplicate Same-Day Beneficiary Tests Detected — Automated Fee Bundling Recoup Triggered',
    },
    {
      type: 'success',
      icon: HugeCheckCircle,
      target: 'PRV_01_RURAL_PRIMARY_CLINIC',
      desc: 'Rural Primary Healthcare Center Clean & Auto-Cleared — Expedited Green-Channel Disbursement',
    },
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
    <div className="superbrain-ticker-container">
      <section className="superbrain-alert-ticker">
        <div className="ticker-label-chip">
          <span className="ticker-pulse-beacon" />
          <span className="ticker-label-text">LIVE RADAR</span>
        </div>
        <div className="ticker-content-track" key={currentIndex}>
          <Icon
            size={16}
            className={
              activeAlert.type === 'danger'
                ? 'text-rose-400'
                : activeAlert.type === 'warning'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }
          />
          <span className="ticker-target-tag font-mono">{activeAlert.target}</span>
          <span className="ticker-desc-text">: {activeAlert.desc}</span>
        </div>
      </section>
    </div>
  );
}
