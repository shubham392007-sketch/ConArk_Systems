import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          padding: '32px 40px',
          boxShadow: '8px 8px 0px #111111',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="streaming-pulse-dot" style={{ backgroundColor: '#FF2AA1', width: '10px', height: '10px' }} />
            <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', color: '#111111', letterSpacing: '0.04em' }}>
              CONARK SYSTEMS
            </span>
          </div>

          <div className="skeleton-shimmer" style={{ width: '100%', height: '8px', borderRadius: '4px' }} />

          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            fontWeight: '800',
            color: '#555555',
            letterSpacing: '0.05em'
          }}>
            VERIFYING ENCRYPTED SESSION...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
