import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, Briefcase, Calendar, ShieldCheck, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [organization, setOrganization] = useState(profile?.organization || '');
  const [role, setRole] = useState(profile?.role || 'Site Engineer');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const { error } = await updateProfile({
      full_name: fullName.trim(),
      organization: organization.trim(),
      role
    });

    setSaving(false);
    if (error) {
      setErrorMsg(error.message || 'Failed to update profile.');
    } else {
      setSuccessMsg('Profile updated successfully.');
      await refreshProfile();
    }
  };

  const createdFormatted = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Active';

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
          <ShieldCheck size={14} /> USER CREDENTIALS & ROLE
        </div>
        <h1 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: '36px',
          color: '#111111',
          margin: 0,
          letterSpacing: '0.02em'
        }}>
          ENGINEER PROFILE
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#666666',
          margin: '6px 0 0'
        }}>
          Manage your ConArk platform identity, site organization, and engineering role.
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
        {successMsg && (
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
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {errorMsg && (
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
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email (Read-Only) */}
          <div>
            <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', marginBottom: '6px' }}>
              ACCOUNT EMAIL (VERIFIED)
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  border: '2px solid #DDDDDD',
                  borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  backgroundColor: '#EEEEEE',
                  color: '#666666',
                  cursor: 'not-allowed',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', marginBottom: '6px' }}>
              FULL NAME
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
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
                  backgroundColor: '#F9F8F5',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Organization & Role */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', marginBottom: '6px' }}>
                ORGANIZATION
              </label>
              <div style={{ position: 'relative' }}>
                <Building size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Company or agency name"
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

            <div>
              <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', marginBottom: '6px' }}>
                ROLE / TITLE
              </label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    border: '2px solid #111111',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
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

          {/* Account Metadata */}
          <div style={{
            backgroundColor: '#F9F8F5',
            border: '1.5px solid #EEEEEE',
            borderRadius: '8px',
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#666666'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> Member Since: <strong>{createdFormatted}</strong>
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              UID: {user?.id.slice(0, 8)}...
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
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
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '4px 4px 0px #111111',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'SAVING PROFILE...' : (
              <>
                <Save size={18} /> SAVE CHANGES
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
