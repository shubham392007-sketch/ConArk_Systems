import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { StatusModal } from './StatusModal';

export const TopNav: React.FC = () => {
  const [showStatus, setShowStatus] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'COMMAND CENTER', path: '/' },
    { label: 'INPUT', path: '/input' },
    { label: 'PREDICTIONS', path: '/predictions' },
    { label: 'SPACE', path: '/space-optimization' },
    { label: 'ALERTS', path: '/alerts' },
    { label: 'AI INSIGHTS', path: '/ai-insights' },
    { label: 'REPORTS', path: '/reports' },
    { label: 'MODELS', path: '/models' }
  ];

  return (
    <>
      <header style={{
        backgroundColor: '#EDECE7',
        borderBottom: '1.5px solid #111111',
        padding: '12px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1500px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Left Tagline Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em' }}>
            <span style={{ color: '#111111' }}>NUMBERS FROM MODELS.</span>
            <span style={{ color: '#777777', textDecoration: 'line-through' }}>WORDS FROM GEMINI.</span>
          </div>

          {/* Center Logo: Magenta Diamond with CA */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#FF2AA1',
              transform: 'rotate(45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }}>
              <span style={{
                color: '#FFFFFF',
                fontFamily: 'Anton, sans-serif',
                fontSize: '14px',
                fontWeight: 'bold',
                transform: 'rotate(-45deg)'
              }}>
                CA
              </span>
            </div>
          </Link>

          {/* Right Status Trigger & Mobile Menu Toggle */}
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
                padding: '4px 10px',
                borderRadius: '4px',
                backgroundColor: '#FFFFFF'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
              STATUS
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #111111', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Global Navigation Strip */}
        <nav style={{
          maxWidth: '1500px',
          margin: '10px auto 0 auto',
          display: mobileMenuOpen ? 'flex' : 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '8px',
          borderTop: '1px solid #d4d3cd'
        }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  fontSize: '12px',
                  fontWeight: isActive ? '800' : '600',
                  color: isActive ? '#FF2AA1' : '#111111',
                  textDecoration: isActive ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                  letterSpacing: '0.04em'
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* System Status Drawer Modal */}
      {showStatus && <StatusModal onClose={() => setShowStatus(false)} />}
    </>
  );
};
