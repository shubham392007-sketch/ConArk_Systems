import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StatusModal } from './StatusModal';

export const TopNav: React.FC = () => {
  const [showStatus, setShowStatus] = useState(false);
  const location = useLocation();

  return (
    <>
      <header
        className="nav-header-padding"
        style={{
          backgroundColor: '#EDECE7',
          borderBottom: '1.5px solid #111111',
          padding: '18px 36px',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div style={{
          maxWidth: '1650px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Left Tagline Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.05em' }}>
            <Link to="/" style={{ color: '#111111', textDecoration: 'none', fontFamily: 'Anton, sans-serif', fontSize: '22px', letterSpacing: '0.04em' }}>
              CONARK
            </Link>
            <span className="nav-tagline-hide" style={{ color: '#999' }}>|</span>
            <span className="nav-tagline-hide" style={{ color: '#111111', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
              NUMBERS FROM MODELS. WORDS FROM GEMINI.
            </span>
          </div>

          {/* Center Logo: ENLARGED Magenta Diamond with CA */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{
              width: '52px',
              height: '52px',
              backgroundColor: '#FF2AA1',
              transform: 'rotate(45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 42, 161, 0.35)',
              margin: '4px 0'
            }}>
              <span style={{
                color: '#FFFFFF',
                fontFamily: 'Anton, sans-serif',
                fontSize: '24px',
                fontWeight: 'bold',
                transform: 'rotate(-45deg)',
                letterSpacing: '-0.02em'
              }}>
                CA
              </span>
            </div>
          </Link>

          {/* Right Navigation & Status Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to="/construction-ai"
              style={{
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '800',
                textTransform: 'uppercase',
                border: '1.5px solid #111111',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: location.pathname === '/construction-ai' ? '#FF2AA1' : '#FFFFFF',
                color: location.pathname === '/construction-ai' ? '#FFFFFF' : '#111111',
                textDecoration: 'none'
              }}
            >
              CONARK AI
            </Link>

            <Link
              to="/brains"
              style={{
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '800',
                textTransform: 'uppercase',
                border: '1.5px solid #111111',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: location.pathname === '/brains' ? '#111111' : '#FFFFFF',
                color: location.pathname === '/brains' ? '#E4FF5B' : '#111111',
                textDecoration: 'none'
              }}
            >
              THE BRAINS
            </Link>

            <button
              onClick={() => setShowStatus(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '700',
                textTransform: 'uppercase',
                border: '1.5px solid #111111',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#111111',
                cursor: 'pointer'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
              STATUS
            </button>
          </div>
        </div>
      </header>

      {/* System Status Drawer Modal */}
      {showStatus && <StatusModal onClose={() => setShowStatus(false)} />}
    </>
  );
};
