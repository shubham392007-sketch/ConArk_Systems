import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, Lock, ShieldAlert, KeyRound, CheckCircle2, AlertCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export const SettingsPage: React.FC = () => {
  const { updatePassword, signOut } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setPassError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }

    setPassLoading(true);
    setPassSuccess(null);
    setPassError(null);

    const { error } = await updatePassword(password);
    setPassLoading(false);

    if (error) {
      setPassError(error.message);
    } else {
      setPassSuccess('Password updated successfully.');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    setDeleteLoading(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch('http://localhost:8000/api/v1/auth/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (!res.ok) {
        throw new Error('Could not delete account.');
      }
      await signOut();
      navigate('/', { replace: true });
    } catch (err: any) {
      alert('Error deleting account: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px 80px' }}>
      {/* Top Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #111111',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '8px 8px 0px #111111',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#E4FF5B',
          border: '2px solid #111111',
          borderRadius: '9999px',
          padding: '4px 12px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          fontWeight: '800',
          color: '#111111',
          marginBottom: '10px'
        }}>
          <Settings size={14} /> SECURITY & PREFERENCES
        </div>
        <h1 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: '36px',
          color: '#111111',
          margin: 0,
          letterSpacing: '0.02em'
        }}>
          ACCOUNT SETTINGS
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#666666',
          margin: '6px 0 0'
        }}>
          Configure security credentials, session encryption, and data retention settings.
        </p>
      </div>

      {/* Password Update Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #111111',
        borderRadius: '16px',
        padding: '32px 28px',
        boxShadow: '8px 8px 0px #111111',
        marginBottom: '28px'
      }}>
        <h2 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: '22px',
          color: '#111111',
          margin: '0 0 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <KeyRound size={20} color="#FF2AA1" /> CHANGE PASSWORD
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#666666', marginBottom: '20px' }}>
          Update your login password to maintain high platform security.
        </p>

        {passSuccess && (
          <div style={{
            backgroundColor: '#EEFFEE',
            border: '2px solid #00CC66',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: '#008844',
            fontWeight: '600'
          }}>
            <CheckCircle2 size={18} /> {passSuccess}
          </div>
        )}

        {passError && (
          <div style={{
            backgroundColor: '#FFEEEE',
            border: '2px solid #FF3366',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: '#CC0033'
          }}>
            <AlertCircle size={18} /> {passError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', marginBottom: '6px' }}>
              NEW PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
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
                  color: '#666'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', marginBottom: '6px' }}>
              CONFIRM NEW PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
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
                  backgroundColor: '#F9F8F5',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passLoading}
            style={{
              backgroundColor: '#111111',
              color: '#FFFFFF',
              border: '2px solid #111111',
              borderRadius: '8px',
              padding: '12px',
              fontFamily: 'Anton, sans-serif',
              fontSize: '16px',
              letterSpacing: '0.04em',
              cursor: passLoading ? 'not-allowed' : 'pointer',
              boxShadow: '3px 3px 0px #111111',
              alignSelf: 'flex-start'
            }}
          >
            {passLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #FF3366',
        borderRadius: '16px',
        padding: '32px 28px',
        boxShadow: '8px 8px 0px #FF3366'
      }}>
        <h2 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: '22px',
          color: '#CC0033',
          margin: '0 0 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldAlert size={20} color="#CC0033" /> DANGER ZONE
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#666666', marginBottom: '20px' }}>
          Permanently delete your user account and all personal project workspace telemetry records.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            backgroundColor: '#FF3366',
            color: '#FFFFFF',
            border: '2px solid #111111',
            borderRadius: '8px',
            padding: '12px 18px',
            fontFamily: 'Anton, sans-serif',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '3px 3px 0px #111111',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Trash2 size={16} /> DELETE ACCOUNT PERMANENTLY
        </button>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '3px solid #FF3366',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '10px 10px 0px #111111'
          }}>
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '24px', color: '#CC0033', margin: '0 0 12px' }}>
              CONFIRM ACCOUNT DELETION
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#444', lineHeight: '1.5', marginBottom: '16px' }}>
              This action is <strong>IRREVERSIBLE</strong>. It will delete your profile, prediction records, custom projects, and AI chat sessions.
            </p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: '800', color: '#111', marginBottom: '8px' }}>
              Type "DELETE" below to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #FF3366',
                borderRadius: '6px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '20px',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  backgroundColor: '#EEEEEE',
                  border: '2px solid #111111',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                style={{
                  backgroundColor: deleteConfirmText === 'DELETE' ? '#FF3366' : '#CCCCCC',
                  color: '#FFFFFF',
                  border: '2px solid #111111',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '16px',
                  cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed'
                }}
              >
                {deleteLoading ? 'DELETING...' : 'CONFIRM DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
