import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ResetPasswordPage: React.FC = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Your password has been successfully updated.');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    }
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '40px auto 80px',
      padding: '0 16px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#00CC66',
          color: '#FFFFFF',
          border: '2px solid #111111',
          borderRadius: '9999px',
          padding: '4px 14px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          fontWeight: '800',
          marginBottom: '14px',
          boxShadow: '2px 2px 0px #111111'
        }}>
          <ShieldCheck size={14} color="#FFF" /> SET NEW PASSWORD
        </div>
        <h1 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: '34px',
          lineHeight: '1.1',
          color: '#111111',
          letterSpacing: '0.02em',
          margin: 0
        }}>
          UPDATE CREDENTIALS
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#666666',
          marginTop: '8px'
        }}>
          Enter your new secure password below to complete the reset.
        </p>
      </div>

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

        {successMsg && (
          <div style={{
            backgroundColor: '#EEFFEE',
            border: '2px solid #00CC66',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <CheckCircle2 size={28} color="#00CC66" style={{ margin: '0 auto 8px' }} />
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: '700',
              color: '#008844'
            }}>
              {successMsg} Redirecting to dashboard...
            </div>
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                fontWeight: '800',
                color: '#111111',
                marginBottom: '6px'
              }}>
                NEW PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#888888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min. 8 characters)"
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

            <div>
              <label style={{
                display: 'block',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                fontWeight: '800',
                color: '#111111',
                marginBottom: '6px'
              }}>
                CONFIRM NEW PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#888888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password to confirm"
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

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#00CC66',
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
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'UPDATING PASSWORD...' : (
                <>
                  UPDATE PASSWORD <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
