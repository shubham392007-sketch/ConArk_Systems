import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please provide your registered work email address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { error } = await resetPassword(email.trim());
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Password reset instructions have been sent to your email. Please check your inbox.');
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
          <KeyRound size={14} color="#111111" /> CREDENTIAL RECOVERY
        </div>
        <h1 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: '34px',
          lineHeight: '1.1',
          color: '#111111',
          letterSpacing: '0.02em',
          margin: 0
        }}>
          RESET PASSWORD
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#666666',
          marginTop: '8px'
        }}>
          Enter your registered email address to receive a secure password reset link.
        </p>
      </div>

      {/* Card */}
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
              color: '#008844',
              lineHeight: '1.4'
            }}>
              {successMsg}
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
                WORK EMAIL ADDRESS
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
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'SENDING RESET LINK...' : (
                <>
                  SEND RESET LINK <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        )}

        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1.5px solid #EEEEEE',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: '#666666'
        }}>
          Remember your password?{' '}
          <Link
            to="/login"
            style={{
              color: '#111111',
              fontWeight: '750',
              textDecoration: 'underline'
            }}
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
