import React from 'react';
import { HugeAlert, HugeCheckCircle, HugeSparkles } from './HugeIcons';

export default function Toast({ toast }) {
  if (!toast) return null;

  const isDanger = toast.type === 'danger';
  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-notification superbrain-toast ${toast.type}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isDanger ? (
          <HugeAlert size={18} className="text-rose-400 shrink-0" />
        ) : isSuccess ? (
          <HugeCheckCircle size={18} className="text-emerald-400 shrink-0" />
        ) : (
          <HugeSparkles size={18} className="text-cyan-400 shrink-0" />
        )}
        <span dangerouslySetInnerHTML={{ __html: toast.message }} />
      </div>
    </div>
  );
}
