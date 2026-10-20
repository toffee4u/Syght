import React from 'react';
import { IconAlert, IconCheckCircle, IconSparkles } from './Icons';

export default function Toast({ toast }) {
  if (!toast) return null;

  const isDanger = toast.type === 'danger';
  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-notification syght-toast ${toast.type}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isDanger ? (
          <IconAlert size={18} className="text-rose-400 shrink-0" />
        ) : isSuccess ? (
          <IconCheckCircle size={18} className="text-emerald-400 shrink-0" />
        ) : (
          <IconSparkles size={18} className="text-cyan-400 shrink-0" />
        )}
        <span dangerouslySetInnerHTML={{ __html: toast.message }} />
      </div>
    </div>
  );
}
