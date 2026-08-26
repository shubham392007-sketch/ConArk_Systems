import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const rawFrom = (location.state as any)?.from?.pathname;
  const from = (rawFrom && rawFrom !== '/dashboard') ? rawFrom : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('Invalid email or password. Please verify your credentials and try again.');
      } else if (error.message.includes('Email not confirmed')) {
        setErrorMsg('Please verify your email address before logging in. Check your inbox for the verification link.');
      } else {
        setErrorMsg(error.message);
      }
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '40px auto 80px',
      padding: '0 16px'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#E4FF5B',
          border: '2px solid #111111',
          borderRadius: '9999px',
          padding: '4px 14px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          fontWeight: '800',
          color: '#111111',
          marginBottom: '14px',
          boxShadow: '2px 2px 0px #111111'
        }}>
          <ShieldCheck size={14} color="#111111" /> SECURE CONARK ACCESS
        </div>
        <h1 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: '36px',
          lineHeight: '1.1',
          color: '#111111',
          letterSpacing: '0.02em',
          margin: 0
        }}>
          WELCOME BACK
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#666666',
          marginTop: '8px'
        }}>
          Sign in to access your project workspaces, ML history, and AI insights.
        </p>
      </div>

      {/* Login Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #111111',
        borderRadius: '16px',
        padding: '32px 28px',
        boxShadow: '8px 8px 0px #111111'
      }}>
        {errorMsg && (
          <div style={{
            backgroundColor: '#FFEEEE',
            border: '2px solid #FF3366',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <AlertCircle size={18} color="#FF3366" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: '600',
              color: '#CC0033',
              lineHeight: '1.4'
            }}>
              {errorMsg}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email Field */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              fontWeight: '800',
              color: '#111111',
              marginBottom: '6px'
            }}>
              WORK EMAIL
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#888888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  border: '2px solid #111111',
                  borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#111111',
                  backgroundColor: '#F9F8F5',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                fontWeight: '800',
                color: '#111111'
              }}>
                PASSWORD
              </label>
              <Link
                to="/forgot-password"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#FF2AA1',
                  textDecoration: 'none'
                }}
              >
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#888888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 38px',
                  border: '2px solid #111111',
                  borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#111111',
                  backgroundColor: '#F9F8F5',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#666666'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Session Option */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: '#444444'
          }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                accentColor: '#111111',
                width: '16px',
                height: '16px',
                cursor: 'pointer'
              }}
            />
            Keep me signed in on this device
          </label>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#FF2AA1',
              color: '#FFFFFF',
              border: '2.5px solid #111111',
              borderRadius: '8px',
              padding: '14px',
              fontFamily: 'Anton, sans-serif',
              fontSize: '18px',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '4px 4px 0px #111111',
              opacity: loading ? 0.7 : 1,
              transition: 'transform 0.1s ease'
            }}
          >
            {loading ? (
              'AUTHENTICATING...'
            ) : (
              <>
                SIGN IN <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Create Account Link */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1.5px solid #EEEEEE',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: '#666666'
        }}>
          Don't have a ConArk account yet?{' '}
          <Link
            to="/signup"
            style={{
              color: '#111111',
              fontWeight: '750',
              textDecoration: 'underline'
            }}
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
