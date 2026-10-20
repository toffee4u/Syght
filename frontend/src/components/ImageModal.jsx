import React from 'react';
import { IconClose } from './Icons';

export default function ImageModal({ figure, onClose }) {
  if (!figure) return null;

  return (
    <div className="modal-backdrop open" onClick={onClose}>
      <div className="modal-card syght-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title font-mono">{figure.title}</div>
          <button type="button" className="modal-close" onClick={onClose} title="Close Modal">
            <IconClose size={18} />
          </button>
        </div>
        <div className="modal-body">
          <img 
            src={figure.src} 
            alt={figure.title} 
            className="modal-full-img"
            onError={e => { e.target.src = figure.fallbackSrc; }} 
          />
          <div className="modal-desc font-mono" style={{ marginTop: '0.75rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            {figure.sub}
          </div>
        </div>
      </div>
    </div>
  );
}
