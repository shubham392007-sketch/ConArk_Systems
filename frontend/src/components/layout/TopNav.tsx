import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StatusModal } from './StatusModal';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Settings, History, FolderKanban, ChevronDown } from 'lucide-react';

export const TopNav: React.FC = () => {
  const [showStatus, setShowStatus] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await signOut();
    navigate('/', { replace: true });
  };

  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Engineer';
  const firstName = fullName.trim().split(/\s+/)[0] || 'Engineer';
  const roleName = profile?.role || user?.user_metadata?.role || 'Site Engineer';

  return (
    <>
      <header
        className="nav-header-padding"
        style={{
          backgroundColor: '#EDECE7',
          borderBottom: '1.5px solid #111111',
          padding: '16px 32px',
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
              width: '48px',
              height: '48px',
              backgroundColor: '#FF2AA1',
              transform: 'rotate(45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 42, 161, 0.35)',
              margin: '2px 0'
            }}>
              <span style={{
                color: '#FFFFFF',
                fontFamily: 'Anton, sans-serif',
                fontSize: '22px',
                fontWeight: 'bold',
                transform: 'rotate(-45deg)',
                letterSpacing: '-0.02em'
              }}>
                CA
              </span>
            </div>
          </Link>

          {/* Right Navigation */}
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

            {isAuthenticated && (
              <>
                <Link
                  to="/history"
                  style={{
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    border: '1.5px solid #111111',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: location.pathname.startsWith('/history') || location.pathname.startsWith('/predictions') ? '#E4FF5B' : '#FFFFFF',
                    color: '#111111',
                    textDecoration: 'none'
                  }}
                >
                  PREDICTIONS
                </Link>

                <Link
                  to="/projects"
                  style={{
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    border: '1.5px solid #111111',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: location.pathname.startsWith('/projects') ? '#E4FF5B' : '#FFFFFF',
                    color: '#111111',
                    textDecoration: 'none'
                  }}
                >
                  PROJECTS
                </Link>
              </>
            )}

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

            {/* Auth Button or User Menu Dropdown */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    border: '1.5px solid #111111',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    cursor: 'pointer',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    fontWeight: '800'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#FF2AA1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#FFF',
                    fontWeight: 'bold'
                  }}>
                    {firstName[0]?.toUpperCase() || 'U'}
                  </div>
                  <span>{firstName}</span>
                  <ChevronDown size={14} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 6px)',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #111111',
                    borderRadius: '10px',
                    boxShadow: '4px 4px 0px #111111',
                    minWidth: '220px',
                    zIndex: 100,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '12px 14px', backgroundColor: '#F9F8F5', borderBottom: '1.5px solid #111111' }}>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '700', color: '#111111' }}>
                        {fullName}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#666', marginTop: '2px' }}>
                        {roleName}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: '#111111',
                        textDecoration: 'none',
                        borderBottom: '1px solid #EEEEEE'
                      }}
                    >
                      <User size={15} /> Engineer Profile
                    </Link>

                    <Link
                      to="/projects"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: '#111111',
                        textDecoration: 'none',
                        borderBottom: '1px solid #EEEEEE'
                      }}
                    >
                      <FolderKanban size={15} /> Project Workspaces
                    </Link>

                    <Link
                      to="/history"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: '#111111',
                        textDecoration: 'none',
                        borderBottom: '1px solid #EEEEEE'
                      }}
                    >
                      <History size={15} /> Prediction History
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: '#111111',
                        textDecoration: 'none',
                        borderBottom: '1px solid #EEEEEE'
                      }}
                    >
                      <Settings size={15} /> Account Settings
                    </Link>

                    <button
                      onClick={handleSignOut}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '10px 14px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: '#FF3366',
                        backgroundColor: '#FFF',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  border: '1.5px solid #111111',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  backgroundColor: '#FF2AA1',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  boxShadow: '2px 2px 0px #111111'
                }}
              >
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* System Status Drawer Modal */}
      {showStatus && <StatusModal onClose={() => setShowStatus(false)} />}
    </>
  );
};
