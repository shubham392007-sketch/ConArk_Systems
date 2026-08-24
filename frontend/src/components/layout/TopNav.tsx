import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StatusModal } from './StatusModal';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  LogOut,
  Settings,
  History,
  FolderKanban,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Cpu,
  Maximize2,
  FileText,
  Users,
  Home
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const [showStatus, setShowStatus] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileDrawerOpen]);

  // Close desktop dropdown on outside click
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
    setIsMobileDrawerOpen(false);
    await signOut();
    navigate('/', { replace: true });
  };

  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Engineer';
  const firstName = fullName.trim().split(/\s+/)[0] || 'Engineer';
  const roleName = profile?.role || user?.user_metadata?.role || 'Site Engineer';
  const userEmail = user?.email || '';

  return (
    <>
      <header
        className="nav-header-padding"
        style={{
          backgroundColor: '#EDECE7',
          borderBottom: '1.5px solid #111111',
          padding: '12px 28px',
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
          {/* Left Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.05em' }}>
            <Link to="/" style={{ color: '#111111', textDecoration: 'none', fontFamily: 'Anton, sans-serif', fontSize: '22px', letterSpacing: '0.04em' }}>
              CONARK
            </Link>
            <span className="nav-tagline-hide" style={{ color: '#999' }}>|</span>
            <span className="nav-tagline-hide" style={{ color: '#111111', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
              NUMBERS FROM MODELS. WORDS FROM GEMINI.
            </span>
          </div>

          {/* Center Logo: Magenta Diamond with CA */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{
              width: '42px',
              height: '42px',
              backgroundColor: '#FF2AA1',
              transform: 'rotate(45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 42, 161, 0.35)',
              margin: '2px 0',
              transition: 'transform 0.15s ease'
            }}>
              <span style={{
                color: '#FFFFFF',
                fontFamily: 'Anton, sans-serif',
                fontSize: '20px',
                fontWeight: 'bold',
                transform: 'rotate(-45deg)',
                letterSpacing: '-0.02em'
              }}>
                CA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="desktop-nav-only" style={{ alignItems: 'center', gap: '10px' }}>
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

            {/* Desktop Auth Button / User Dropdown */}
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

          {/* Mobile Right Controls: Mini Avatar + Hamburger Button */}
          <div className="mobile-nav-only" style={{ alignItems: 'center', gap: '8px' }}>
            {isAuthenticated ? (
              <Link
                to="/profile"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#111111',
                  border: '1.5px solid #111111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#E4FF5B',
                  fontWeight: 'bold',
                  fontFamily: 'JetBrains Mono, monospace',
                  textDecoration: 'none'
                }}
                title={fullName}
              >
                {firstName[0]?.toUpperCase() || 'U'}
              </Link>
            ) : (
              <Link
                to="/login"
                style={{
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: '800',
                  border: '1.5px solid #111111',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#FF2AA1',
                  color: '#FFFFFF',
                  textDecoration: 'none'
                }}
              >
                LOGIN
              </Link>
            )}

            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              style={{
                backgroundColor: isMobileDrawerOpen ? '#111111' : '#FFFFFF',
                color: isMobileDrawerOpen ? '#FFFFFF' : '#111111',
                border: '2px solid #111111',
                borderRadius: '6px',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 2px 0px #111111'
              }}
              aria-label="Toggle navigation drawer"
            >
              {isMobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div
            className="animate-slide-in-right"
            style={{
              width: '85%',
              maxWidth: '340px',
              height: '100%',
              backgroundColor: '#EDECE7',
              borderLeft: '3px solid #111111',
              boxShadow: '-8px 0px 24px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <div style={{
                padding: '18px 20px',
                backgroundColor: '#FFFFFF',
                borderBottom: '2.5px solid #111111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: '#FF2AA1',
                    transform: 'rotate(45deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#FFFFFF', fontFamily: 'Anton, sans-serif', fontSize: '13px', transform: 'rotate(-45deg)' }}>
                      CA
                    </span>
                  </div>
                  <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', letterSpacing: '0.04em', color: '#111111' }}>
                    CONARK SYSTEMS
                  </span>
                </div>

                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{
                    backgroundColor: '#F3F4F6',
                    border: '1.5px solid #111111',
                    borderRadius: '6px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* User Profile Summary or Guest Banner */}
              {isAuthenticated ? (
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#FFFFFF',
                  borderBottom: '2px solid #111111',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#FF2AA1',
                    border: '2px solid #111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: '#FFF',
                    fontWeight: 'bold',
                    fontFamily: 'JetBrains Mono, monospace',
                    flexShrink: 0
                  }}>
                    {firstName[0]?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '800', color: '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fullName}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#666', textTransform: 'uppercase' }}>
                      {roleName}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {userEmail}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#FFF8EE',
                  borderBottom: '2px solid #111111'
                }}>
                  <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '16px', color: '#111111', marginBottom: '8px' }}>
                    CONARK INTELLIGENCE
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#666', margin: '0 0 12px 0' }}>
                    Sign in to run ML models, access ConArk AI, and view persistent telemetry archives.
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      style={{
                        flex: 1,
                        backgroundColor: '#FF2AA1',
                        color: '#FFFFFF',
                        border: '1.5px solid #111111',
                        borderRadius: '6px',
                        padding: '8px 0',
                        textAlign: 'center',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        fontWeight: '800',
                        textDecoration: 'none',
                        boxShadow: '2px 2px 0px #111111'
                      }}
                    >
                      SIGN IN
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      style={{
                        flex: 1,
                        backgroundColor: '#E4FF5B',
                        color: '#111111',
                        border: '1.5px solid #111111',
                        borderRadius: '6px',
                        padding: '8px 0',
                        textAlign: 'center',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        fontWeight: '800',
                        textDecoration: 'none',
                        boxShadow: '2px 2px 0px #111111'
                      }}
                    >
                      SIGN UP
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Links List */}
              <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Link
                  to="/"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #111111',
                    backgroundColor: location.pathname === '/' ? '#111111' : '#FFFFFF',
                    color: location.pathname === '/' ? '#FFFFFF' : '#111111',
                    textDecoration: 'none',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    fontWeight: '800',
                    boxShadow: '3px 3px 0px #111111'
                  }}
                >
                  <Home size={16} /> COMMAND CENTER
                </Link>

                <Link
                  to="/construction-ai"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #111111',
                    backgroundColor: location.pathname === '/construction-ai' ? '#FF2AA1' : '#FFFFFF',
                    color: location.pathname === '/construction-ai' ? '#FFFFFF' : '#111111',
                    textDecoration: 'none',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    fontWeight: '800',
                    boxShadow: '3px 3px 0px #111111'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Sparkles size={16} /> CONARK AI ASSISTANT
                  </div>
                  <span style={{
                    fontSize: '9px',
                    backgroundColor: '#E4FF5B',
                    color: '#111111',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #111111'
                  }}>
                    GEMINI
                  </span>
                </Link>

                <Link
                  to="/models"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #111111',
                    backgroundColor: location.pathname === '/models' ? '#111111' : '#FFFFFF',
                    color: location.pathname === '/models' ? '#FFFFFF' : '#111111',
                    textDecoration: 'none',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    fontWeight: '800',
                    boxShadow: '3px 3px 0px #111111'
                  }}
                >
                  <Cpu size={16} /> 5 PREDICTIVE ML MODELS
                </Link>

                <Link
                  to="/space-optimization"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #111111',
                    backgroundColor: location.pathname === '/space-optimization' ? '#111111' : '#FFFFFF',
                    color: location.pathname === '/space-optimization' ? '#FFFFFF' : '#111111',
                    textDecoration: 'none',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    fontWeight: '800',
                    boxShadow: '3px 3px 0px #111111'
                  }}
                >
                  <Maximize2 size={16} /> SPACE LAYOUT OPTIMIZER
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      to="/history"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #111111',
                        backgroundColor: location.pathname.startsWith('/history') || location.pathname.startsWith('/predictions') ? '#E4FF5B' : '#FFFFFF',
                        color: '#111111',
                        textDecoration: 'none',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '12px',
                        fontWeight: '800',
                        boxShadow: '3px 3px 0px #111111'
                      }}
                    >
                      <History size={16} /> PREDICTION HISTORY
                    </Link>

                    <Link
                      to="/projects"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #111111',
                        backgroundColor: location.pathname.startsWith('/projects') ? '#E4FF5B' : '#FFFFFF',
                        color: '#111111',
                        textDecoration: 'none',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '12px',
                        fontWeight: '800',
                        boxShadow: '3px 3px 0px #111111'
                      }}
                    >
                      <FolderKanban size={16} /> PROJECT WORKSPACES
                    </Link>
                  </>
                )}

                <Link
                  to="/brains"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #111111',
                    backgroundColor: location.pathname === '/brains' ? '#111111' : '#FFFFFF',
                    color: location.pathname === '/brains' ? '#E4FF5B' : '#111111',
                    textDecoration: 'none',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    fontWeight: '800',
                    boxShadow: '3px 3px 0px #111111'
                  }}
                >
                  <Users size={16} /> THE BRAINS & RESEARCH
                </Link>

                <Link
                  to="/reports"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #111111',
                    backgroundColor: location.pathname === '/reports' ? '#111111' : '#FFFFFF',
                    color: location.pathname === '/reports' ? '#FFFFFF' : '#111111',
                    textDecoration: 'none',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    fontWeight: '800',
                    boxShadow: '3px 3px 0px #111111'
                  }}
                >
                  <FileText size={16} /> PDF REPORTS
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #111111',
                        backgroundColor: location.pathname === '/profile' ? '#111111' : '#FFFFFF',
                        color: location.pathname === '/profile' ? '#FFFFFF' : '#111111',
                        textDecoration: 'none',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '12px',
                        fontWeight: '800',
                        boxShadow: '3px 3px 0px #111111'
                      }}
                    >
                      <User size={16} /> ENGINEER PROFILE
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #111111',
                        backgroundColor: location.pathname === '/settings' ? '#111111' : '#FFFFFF',
                        color: location.pathname === '/settings' ? '#FFFFFF' : '#111111',
                        textDecoration: 'none',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '12px',
                        fontWeight: '800',
                        boxShadow: '3px 3px 0px #111111'
                      }}
                    >
                      <Settings size={16} /> ACCOUNT SETTINGS
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Drawer Footer: Status & Sign Out */}
            <div style={{
              padding: '16px 14px',
              backgroundColor: '#FFFFFF',
              borderTop: '2px solid #111111',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <button
                onClick={() => {
                  setShowStatus(true);
                  setIsMobileDrawerOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #111111',
                  backgroundColor: '#F9F8F5',
                  color: '#111111',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                  <span>SYSTEM STATUS</span>
                </div>
                <span style={{ color: '#22c55e', fontWeight: '800' }}>100% NOMINAL</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleSignOut}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1.5px solid #FF3366',
                    backgroundColor: '#FFEEEE',
                    color: '#CC0033',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={15} /> SIGN OUT
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* System Status Modal */}
      {showStatus && <StatusModal onClose={() => setShowStatus(false)} />}
    </>
  );
};

