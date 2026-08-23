import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building, Briefcase, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignupPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('Site Engineer');
  const [experience] = useState('3-5 years');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password strength helper
  const getPasswordStrength = () => {
    if (!password) return { label: 'EMPTY', color: '#CCCCCC', score: 0 };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: 'WEAK', color: '#FF3366', score: 1 };
    if (score === 2 || score === 3) return { label: 'MEDIUM', color: '#FFAA00', score: 2 };
    return { label: 'STRONG', color: '#00CC66', score: 3 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Please accept the ConArk Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { error, session } = await signUp(email.trim(), password, {
      full_name: fullName.trim(),
      organization: organization.trim(),
      role,
      experience
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else if (session) {
      // Auto-authenticated
      navigate('/dashboard', { replace: true });
    } else {
      // Email confirmation sent
      setSuccessMsg('Account created successfully! Please check your email to verify your account.');
    }
  };

  return (
    <div style={{
      maxWidth: '520px',
      margin: '36px auto 80px',
      padding: '0 16px'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#FF2AA1',
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
          <Shield size={14} color="#FFF" /> NEW CONARK ACCOUNT
        </div>
        <h1 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: '34px',
          lineHeight: '1.1',
          color: '#111111',
          letterSpacing: '0.02em',
          margin: 0
        }}>
          JOIN CONARK SYSTEMS
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#666666',
          marginTop: '8px'
        }}>
          Access AI construction intelligence, predictive telemetry, and persistent project history.
        </p>
      </div>

      {/* Form Card */}
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
              marginBottom: '12px'
            }}>
              {successMsg}
            </div>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                backgroundColor: '#111111',
                color: '#FFF',
                padding: '8px 18px',
                borderRadius: '6px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              PROCEED TO LOGIN
            </Link>
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Full Name */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                fontWeight: '800',
                color: '#111111',
                marginBottom: '6px'
              }}>
                FULL NAME *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#888888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
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
                WORK EMAIL *
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

            {/* Organization & Role */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#111111',
                  marginBottom: '6px'
                }}>
                  ORGANIZATION
                </label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} color="#888888" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Company or agency name"
                    style={{
                      width: '100%',
                      padding: '12px 10px 12px 32px',
                      border: '2px solid #111111',
                      borderRadius: '8px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      color: '#111111',
                      backgroundColor: '#F9F8F5',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
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
                  PRIMARY ROLE
                </label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={16} color="#888888" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 10px 12px 32px',
                      border: '2px solid #111111',
                      borderRadius: '8px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      color: '#111111',
                      backgroundColor: '#F9F8F5',
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Site Engineer">Site Engineer</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Safety Director">Safety Director</option>
                    <option value="General Contractor">General Contractor</option>
                    <option value="Structural Consultant">Structural Consultant</option>
                    <option value="Researcher">Researcher</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#111111'
                }}>
                  PASSWORD *
                </label>
                {password && (
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    fontWeight: '800',
                    color: strength.color
                  }}>
                    STRENGTH: {strength.label}
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#888888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min. 8 characters)"
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

            {/* Confirm Password */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                fontWeight: '800',
                color: '#111111',
                marginBottom: '6px'
              }}>
                CONFIRM PASSWORD *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#888888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm"
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

            {/* Terms Checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#444444',
              lineHeight: '1.4',
              marginTop: '4px'
            }}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                style={{
                  accentColor: '#111111',
                  width: '16px',
                  height: '16px',
                  marginTop: '2px',
                  cursor: 'pointer'
                }}
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" target="_blank" style={{ color: '#111', fontWeight: '700' }}>Terms of Service</Link>{' '}
                and{' '}
                <Link to="/privacy" target="_blank" style={{ color: '#111', fontWeight: '700' }}>Privacy Policy</Link>.
              </span>
            </label>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#E4FF5B',
                color: '#111111',
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
                marginTop: '8px'
              }}
            >
              {loading ? 'CREATING ACCOUNT...' : (
                <>
                  CREATE ACCOUNT <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Existing Account Link */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1.5px solid #EEEEEE',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: '#666666'
        }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#111111',
              fontWeight: '750',
              textDecoration: 'underline'
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
