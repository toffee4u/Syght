import React, { useState, useEffect } from 'react';
import { IconAlert, IconCheckCircle } from './Icons';

export default function AlertTicker() {
  const alerts = [
    {
      type: 'danger',
      icon: IconAlert,
      target: 'Apex Life Specialty (HOSP-MH-40192)',
      desc: '460 Inpatient Surgeries Billed by 2 Attending Doctors (₹51.00 Lakhs Payout) — 100.0% Fraud Risk',
    },
    {
      type: 'danger',
      icon: IconAlert,
      target: 'Metro Health Syndicate (HOSP-DL-10923)',
      desc: 'Doctor Recycling Syndicate (95% Shared Physicians across 11 Hospitals) — Critical Audit Triggered',
    },
    {
      type: 'danger',
      icon: IconAlert,
      target: 'St. Jude Critical Care (HOSP-KA-82014)',
      desc: 'Artificial ICU Stay Prolongation (16.8 Days Mean LOS, Max 48 Days) — 99.9% Fraud Risk',
    },
    {
      type: 'warning',
      icon: IconAlert,
      target: 'PulsePath Diagnostics (HOSP-TS-90214)',
      desc: '44% Duplicate Same-Day Beneficiary Tests Detected — Automated Fee Bundling Recoup Triggered',
    },
    {
      type: 'success',
      icon: IconCheckCircle,
      target: 'Shanti Gramin Clinic (HOSP-MH-77218)',
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
    <div className="syght-ticker-container">
      <section className="syght-alert-ticker">
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
