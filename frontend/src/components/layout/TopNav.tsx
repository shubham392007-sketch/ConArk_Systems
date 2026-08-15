import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusModal } from './StatusModal';

export const TopNav: React.FC = () => {
  const [showStatus, setShowStatus] = useState(false);

  return (
    <>
      <header style={{
        backgroundColor: '#EDECE7',
        borderBottom: '1.5px solid #111111',
        padding: '16px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1650px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Left Tagline Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em' }}>
            <span style={{ color: '#111111' }}>NUMBERS FROM MODELS.</span>
            <span style={{ color: '#777777', textDecoration: 'line-through' }}>WORDS FROM GEMINI.</span>
          </div>

          {/* Center Logo: Magenta Diamond with CA */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#FF2AA1',
              transform: 'rotate(45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}>
              <span style={{
                color: '#FFFFFF',
                fontFamily: 'Anton, sans-serif',
                fontSize: '16px',
                fontWeight: 'bold',
                transform: 'rotate(-45deg)'
              }}>
                CA
              </span>
            </div>
          </Link>

          {/* Right Status Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                borderRadius: '4px',
                backgroundColor: '#FFFFFF',
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
