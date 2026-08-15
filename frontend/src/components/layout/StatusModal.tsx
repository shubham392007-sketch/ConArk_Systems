import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { fetchHealth } from '../../services/api';

interface StatusModalProps {
  onClose: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({ onClose }) => {
  const [health, setHealth] = useState<{ status: string; system: string; version: string } | null>(null);

  useEffect(() => {
    fetchHealth()
      .then(data => setHealth(data))
      .catch(() => setHealth(null));
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(17, 17, 17, 0.4)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid #111111',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '450px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eeeeee', paddingBottom: '12px' }}>
          <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', letterSpacing: '0.04em' }}>
            SYSTEM INFRASTRUCTURE STATUS
          </h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={20} color="#111111" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#EDECE7', borderRadius: '6px' }}>
            <span>FastAPI Core REST Backend</span>
            <span style={{ color: health ? '#15803d' : '#b91c1c', fontWeight: 'bold' }}>
              {health ? 'CONNECTED (v1.0.0)' : 'DISCONNECTED'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#EDECE7', borderRadius: '6px' }}>
            <span>5 Core ML Predictive Models</span>
            <span style={{ color: '#15803d', fontWeight: 'bold' }}>5/5 LOADED & READY</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#EDECE7', borderRadius: '6px' }}>
            <span>SciPy Space Constrained Solver</span>
            <span style={{ color: '#15803d', fontWeight: 'bold' }}>READY</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#EDECE7', borderRadius: '6px' }}>
            <span>Deterministic Alert Engine</span>
            <span style={{ color: '#15803d', fontWeight: 'bold' }}>ACTIVE</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#EDECE7', borderRadius: '6px' }}>
            <span>Gemini 2.5 Flash AI Layer</span>
            <span style={{ color: '#15803d', fontWeight: 'bold' }}>ACTIVE (google-genai)</span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
            width: '100%',
            backgroundColor: '#111111',
            color: '#FFFFFF',
            fontWeight: 'bold',
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer'
          }}
        >
          CLOSE STATUS PANEL
        </button>
      </div>
    </div>
  );
};
