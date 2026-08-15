import React from 'react';
import { X, Info } from 'lucide-react';

interface SHAPDrawerProps {
  modelTitle: string;
  isOpen: boolean;
  onClose: () => void;
  factors?: Array<{ feature: string; importance: number }>;
}

export const SHAPDrawer: React.FC<SHAPDrawerProps> = ({ modelTitle, isOpen, onClose, factors }) => {
  if (!isOpen) return null;

  const defaultFactors = factors && factors.length > 0 ? factors : [
    { feature: 'Task Progress Velocity', importance: 0.35 },
    { feature: 'Equipment Utilization Rate', importance: 0.28 },
    { feature: 'Safety Incidents Accumulator', importance: 0.18 },
    { feature: 'Material Consumption Rate', importance: 0.12 },
    { feature: 'Vibration Level (Lag 15)', importance: 0.07 }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(17, 17, 17, 0.5)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 110
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderLeft: '2px solid #111111',
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #111111', paddingBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#666666', fontWeight: 'bold' }}>MODEL EXPLAINABILITY (SHAP)</span>
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '24px', color: '#111111', textTransform: 'uppercase', marginTop: '2px' }}>
              WHY THIS PREDICTION?
            </h2>
            <p style={{ fontSize: '12px', color: '#555555', fontFamily: 'Inter, sans-serif' }}>
              {modelTitle} Feature Importance & SHAP Value Contributions
            </p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={24} color="#111111" />
          </button>
        </div>

        {/* Feature Contribution List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          {defaultFactors.map((item, idx) => {
            const pct = Math.round(item.importance * 100);
            return (
              <div key={idx} style={{ backgroundColor: '#EDECE7', padding: '12px 16px', borderRadius: '8px', border: '1px solid #111111' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>
                  <span>{item.feature}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>+{pct}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #111111', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#111111' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#F5F3E3', border: '1.5px solid #111111', borderRadius: '8px', display: 'flex', gap: '12px', fontSize: '12px', color: '#333333' }}>
          <Info size={20} color="#111111" style={{ flexShrink: 0 }} />
          <div>
            <strong>Architectural Note:</strong> Feature contribution describes model behavior based on empirical training data. It establishes feature importance, not legal or causality guarantees.
          </div>
        </div>
      </div>
    </div>
  );
};
