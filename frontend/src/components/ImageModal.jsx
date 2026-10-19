import React from 'react';
import { X } from 'lucide-react';

export default function ImageModal({ figure, onClose }) {
  if (!figure) return null;

  return (
    <div className="modal-backdrop open" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{figure.title}</div>
          <button className="modal-close" onClick={onClose} title="Close Modal">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <img 
            src={figure.src} 
            alt={figure.title} 
            className="modal-full-img"
            onError={e => { e.target.src = figure.fallbackSrc; }} 
          />
          <div className="modal-desc" style={{ marginTop: '0.75rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            {figure.sub}
          </div>
        </div>
      </div>
    </div>
  );
}
