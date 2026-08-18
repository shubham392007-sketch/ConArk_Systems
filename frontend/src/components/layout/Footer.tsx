import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#EDECE7',
      borderTop: '2px dashed #111111',
      padding: '36px 32px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1500px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111', letterSpacing: '0.05em' }}>
              CONARK SYSTEMS
            </span>
            <span style={{ fontSize: '12px', color: '#666666', fontFamily: 'Inter, sans-serif' }}>
              AI-Powered Construction Intelligence Platform
            </span>
          </div>

          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            fontWeight: '800',
            color: '#111111',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            ML PREDICTS · OPTIMIZATION DECIDES · GEMINI EXPLAINS · CONARK AI ANSWERS
          </div>

          <div style={{ fontSize: '11px', color: '#777777', fontFamily: 'JetBrains Mono, monospace' }}>
            © 2026 ConArk Systems. All rights reserved.
          </div>
        </div>

        {/* Footer Navigation Links */}
        <div style={{
          borderTop: '1.5px solid #111111',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '24px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          fontWeight: '800'
        }}>
          <Link to="/" style={{ color: '#111111', textDecoration: 'none' }}>COMMAND CENTER</Link>
          <span style={{ color: '#999' }}>·</span>
          <Link to="/construction-ai" style={{ color: '#FF2AA1', textDecoration: 'none' }}>CONARK AI</Link>
          <span style={{ color: '#999' }}>·</span>
          <Link to="/predictions" style={{ color: '#111111', textDecoration: 'none' }}>PREDICTIONS</Link>
          <span style={{ color: '#999' }}>·</span>
          <Link to="/space-optimization" style={{ color: '#111111', textDecoration: 'none' }}>SPACE</Link>
          <span style={{ color: '#999' }}>·</span>
          <Link to="/alerts" style={{ color: '#111111', textDecoration: 'none' }}>ALERTS</Link>
          <span style={{ color: '#999' }}>·</span>
          <Link to="/ai-insights" style={{ color: '#111111', textDecoration: 'none' }}>AI INSIGHTS</Link>
          <span style={{ color: '#999' }}>·</span>
          <Link to="/reports" style={{ color: '#111111', textDecoration: 'none' }}>REPORTS</Link>
          <span style={{ color: '#999' }}>·</span>
          <Link to="/brains" style={{ color: '#111111', textDecoration: 'none' }}>THE BRAINS BEHIND CONARK</Link>
        </div>
      </div>
    </footer>
  );
};
