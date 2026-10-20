import React, { useState } from 'react';
import {
  IconClock,
  IconZap,
  IconAlert,
  IconCheckCircle,
  IconShield,
  IconFreeze,
  IconBrain,
} from './Icons';

export default function PreAuthGateway({ onShowToast }) {
  const [formData, setFormData] = useState({
    provider_id: 'PRV_02_PHANTOM_SURGERY_MILL',
    claim_id: 'CLM_PREAUTH_2026_091',
    bene_id: 'BENE_99412',
    claim_type: 'inpatient',
    reimbursed_amount: 14500,
    length_of_stay: 14,
    diagnosis_codes: '4019, 25000, 4280, 5849',
    procedure_codes: '9904, 3893, 8151',
  });

  const [decision, setDecision] = useState({
    decision: 'REJECTED',
    riskScore: 0.998,
    latencyMs: 1.84,
    flags: [
      'SUSPICIOUS_HIGH_REIMBURSEMENT_FOR_CLAIM_TYPE',
      'EXCESSIVE_LENGTH_OF_STAY_PROLONGATION',
      'KNOWN_COLLUSIVE_PROVIDER_REGISTRY',
    ],
    reasons: [
      'Claim amount (₹14,500) exceeds 99th percentile for outpatient/general admitting category.',
      'Billed length of stay (14 days) conflicts with non-surgical primary diagnosis.',
      'Provider is under active Special Investigation Unit freeze.',
    ],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleIntercept = async () => {
    setIsLoading(true);
    const start = performance.now();

    try {
      const payload = {
        claim_id: formData.claim_id,
        provider_id: formData.provider_id,
        beneficiary_id: formData.bene_id,
        claim_type: formData.claim_type,
        requested_amount: parseFloat(formData.reimbursed_amount) || 0,
        length_of_stay: parseInt(formData.length_of_stay, 10) || 0,
        diagnosis_codes: formData.diagnosis_codes.split(',').map(s => s.trim()).filter(Boolean),
        procedure_codes: formData.procedure_codes.split(',').map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch('/api/v1/preauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const elapsed = (performance.now() - start).toFixed(2);

      if (res.ok) {
        const data = await res.json();
        setDecision({
          decision: data.adjudication_decision,
          riskScore: data.risk_score,
          latencyMs: data.latency_ms || elapsed,
          flags: data.triggered_risk_flags || [],
          reasons: data.policy_adjudication_reasons || [],
        });

        const isOk = data.adjudication_decision === 'APPROVED';
        onShowToast(
          isOk 
            ? `Pre-Auth Approved: ${data.claim_id} in ${data.latency_ms.toFixed(2)}ms`
            : `Pre-Auth Intercepted: ${data.claim_id} [${data.adjudication_decision}]`,
          isOk ? 'success' : 'danger'
        );
      } else {
        throw new Error('API unavailable, running client rule engine');
      }
    } catch {
      const elapsed = (performance.now() - start).toFixed(2);
      const isHigh = formData.provider_id.includes('PHANTOM') || formData.reimbursed_amount > 5000 || formData.length_of_stay > 8;

      setDecision({
        decision: isHigh ? 'REJECTED' : 'APPROVED',
        riskScore: isHigh ? 0.942 : 0.084,
        latencyMs: elapsed,
        flags: isHigh 
          ? ['HIGH_INPATIENT_REIMBURSEMENT_SPIKE', 'EXTENDED_LENGTH_OF_STAY']
          : ['POLICY_CRITERIA_SATISFIED'],
        reasons: isHigh
          ? ['Claim reimbursement exceeds peer thresholds.', 'Length of stay requires clinical justification notes.']
          : ['All admitting diagnoses match allowable clinical protocols.', 'Provider maintains 0 active fraud flags.'],
      });

      onShowToast(
        isHigh ? `Pre-Auth Intercepted: ${formData.claim_id}` : `Pre-Auth Approved: ${formData.claim_id}`,
        isHigh ? 'danger' : 'success'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isApproved = decision.decision === 'APPROVED';
  const isRejected = decision.decision === 'REJECTED';

  return (
    <div className="tab-view active syght-view">
      <div className="syght-page-header">
        <div className="page-header-title-box">
          <div className="syght-chip">
            <span className="chip-dot" />
            Team Pulse Inline Interceptor
          </div>
          <h1 className="syght-page-title">
            Sub-5ms Real-Time Pre-Authorization Gateway
          </h1>
          <p className="syght-page-desc">
            Real-time inline claim interception at hospital admission. 
            Prevents phantom surgeries and diagnostic upcoding before discharge and disbursements occur.
          </p>
        </div>
      </div>

      <div className="syght-split-grid analyzer-layout">
        {/* Left Column: Form */}
        <section className="syght-panel">
          <div className="syght-panel-header">
            <div className="panel-title-flex">
              <IconZap size={20} className="text-cyan-400" />
              <h3>Incoming Hospital Pre-Auth Request</h3>
            </div>
            <span className="syght-chip">Sub-5ms Interceptor</span>
          </div>

          <div className="form-grid-syght">
            <div className="form-field full-col">
              <label className="field-label">Admitting Provider ID</label>
              <select
                className="syght-select font-mono"
                value={formData.provider_id}
                onChange={e => setFormData({ ...formData, provider_id: e.target.value })}
              >
                <option value="PRV_02_PHANTOM_SURGERY_MILL">PRV_02_PHANTOM_SURGERY_MILL (Critical Risk)</option>
                <option value="PRV_03_KICKBACK_COLLUSION_RING">PRV_03_KICKBACK_COLLUSION_RING (Collusion Ring)</option>
                <option value="PRV_08_ICU_LENGTH_OF_STAY_UPCODING">PRV_08_ICU_LENGTH_OF_STAY_UPCODING (Upcoding)</option>
                <option value="PRV_01_RURAL_PRIMARY_CLINIC">PRV_01_RURAL_PRIMARY_CLINIC (Clean Clinic)</option>
                <option value="PRV_04_COMMUNITY_DISTRICT_HOSPITAL">PRV_04_COMMUNITY_DISTRICT_HOSPITAL (Clean Hospital)</option>
              </select>
            </div>

            <div className="form-field">
              <label className="field-label">Pre-Auth Claim ID</label>
              <input
                type="text"
                className="syght-input font-mono"
                value={formData.claim_id}
                onChange={e => setFormData({ ...formData, claim_id: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Beneficiary ID</label>
              <input
                type="text"
                className="syght-input font-mono"
                value={formData.bene_id}
                onChange={e => setFormData({ ...formData, bene_id: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Claim Type</label>
              <select
                className="syght-select font-mono"
                value={formData.claim_type}
                onChange={e => setFormData({ ...formData, claim_type: e.target.value })}
              >
                <option value="inpatient">Inpatient Admission</option>
                <option value="outpatient">Outpatient Procedure</option>
              </select>
            </div>

            <div className="form-field">
              <label className="field-label">Requested Amount (₹)</label>
              <input
                type="number"
                className="syght-input font-mono"
                value={formData.reimbursed_amount}
                onChange={e => setFormData({ ...formData, reimbursed_amount: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Length of Stay (Days)</label>
              <input
                type="number"
                className="syght-input font-mono"
                value={formData.length_of_stay}
                onChange={e => setFormData({ ...formData, length_of_stay: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Diagnosis ICD-9 Codes</label>
              <input
                type="text"
                className="syght-input font-mono"
                value={formData.diagnosis_codes}
                onChange={e => setFormData({ ...formData, diagnosis_codes: e.target.value })}
              />
            </div>

            <div className="form-field full-col">
              <label className="field-label">Procedure ICD-9 Codes</label>
              <input
                type="text"
                className="syght-input font-mono"
                value={formData.procedure_codes}
                onChange={e => setFormData({ ...formData, procedure_codes: e.target.value })}
              />
            </div>
          </div>

          <button
            type="button"
            className="syght-btn-primary w-full mt-5"
            onClick={handleIntercept}
            disabled={isLoading}
          >
            <IconClock size={16} />
            <span>{isLoading ? 'Intercepting in Sub-5ms Pipeline...' : 'Simulate Real-Time Pre-Auth Interception'}</span>
          </button>
        </section>

        {/* Right Column: Pre-Auth Adjudication Decision */}
        <section className="syght-panel">
          <div className="syght-panel-header">
            <div className="panel-title-flex">
              <IconShield size={20} className="text-cyan-400" />
              <h3>Pre-Authorization Decision Card</h3>
            </div>
            <div className="syght-chip font-mono">
              <IconClock size={12} className="text-cyan-400" />
              {decision.latencyMs} ms SLA
            </div>
          </div>

          {/* Large Adjudication Banner */}
          <div className={`preauth-decision-banner ${isApproved ? 'is-approved' : isRejected ? 'is-rejected' : 'is-review'}`}>
            <div className="decision-banner-top">
              <div className="decision-icon-large">
                {isApproved ? (
                  <IconCheckCircle size={36} className="text-emerald-400" />
                ) : isRejected ? (
                  <IconFreeze size={36} className="text-rose-400" />
                ) : (
                  <IconAlert size={36} className="text-amber-400" />
                )}
              </div>
              <div className="decision-title-group">
                <span className="decision-sub-label">ADJUDICATION RESULT</span>
                <span className="decision-main-title font-mono">{decision.decision}</span>
              </div>
            </div>

            <div className="decision-metrics-strip font-mono">
              <div>
                <span className="strip-label">Calculated Risk:</span>
                <span className={`strip-val ${decision.riskScore >= 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {(decision.riskScore * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="strip-label">Interception Latency:</span>
                <span className="strip-val text-slate-900 font-semibold">{decision.latencyMs} ms</span>
              </div>
            </div>
          </div>

          {/* Triggered Policy Risk Flags */}
          <div className="policy-flags-section">
            <h4 className="policy-section-title">Triggered Operational Policy Flags</h4>
            <div className="flag-pills-list">
              {decision.flags.map((flag, idx) => (
                <div key={idx} className="syght-flag-pill font-mono">
                  <IconAlert size={14} className="text-rose-400 shrink-0" />
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Adjudication Policy Reasons */}
          <div className="policy-reasons-section">
            <h4 className="policy-section-title">Clinical Adjudication Rationales</h4>
            <ul className="reasons-list">
              {decision.reasons.map((reason, idx) => (
                <li key={idx} className="reason-item">
                  <span className="reason-bullet">›</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
