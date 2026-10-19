import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  const isDanger = toast.type === 'danger';
  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-notification ${toast.type}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isDanger ? (
          <AlertCircle size={18} className="text-danger" />
        ) : isSuccess ? (
          <CheckCircle2 size={18} className="text-success" />
        ) : (
          <Info size={18} className="text-accent" />
        )}
        <span dangerouslySetInnerHTML={{ __html: toast.message }}></span>
      </div>
    </div>
  );
}
