import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon, ReloadIcon } from '@hugeicons/core-free-icons';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '2rem',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #fee2e2',
          margin: '2rem auto',
          maxWidth: '680px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#fff1f2',
            color: '#e11d48',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <HugeiconsIcon icon={Alert02Icon} size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Report Rendering Recovered
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '480px', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Syght caught a rendering issue and safely recovered. Click below to reload the audited intelligence dashboard.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.6rem 1.25rem',
              background: '#0f172a',
              color: '#ffffff',
              borderRadius: '9999px',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
            }}
          >
            <HugeiconsIcon icon={ReloadIcon} size={15} />
            <span>Reload Dashboard</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
