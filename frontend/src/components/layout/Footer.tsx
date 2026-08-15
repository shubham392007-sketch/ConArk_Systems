import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#EDECE7',
      borderTop: '1.5px solid #111111',
      padding: '24px 32px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1500px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', color: '#111111', letterSpacing: '0.05em' }}>
            CONARK SYSTEMS
          </span>
          <span style={{ fontSize: '11px', color: '#666666', fontFamily: 'Inter, sans-serif' }}>
            AI-Powered Construction Intelligence Platform
          </span>
        </div>

        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          fontWeight: '700',
          color: '#111111',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          ML PREDICTS · OPTIMIZATION DECIDES · GEMINI EXPLAINS
        </div>

        <div style={{ fontSize: '11px', color: '#777777', fontFamily: 'JetBrains Mono, monospace' }}>
          © 2026 ConArk Systems. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
