import React, { useState } from 'react';
import { SHAPDrawer } from '../components/common/SHAPDrawer';

export const PredictionsHub: React.FC = () => {
  const [selectedSHAPModel, setSelectedSHAPModel] = useState<string | null>(null);

  const modelsData = [
    {
      id: 'performance',
      index: '01',
      title: 'PERFORMANCE',
      color: '#FFFFFF',
      algorithm: 'HistGradientBoosting Classifier',
      version: 'v1.0',
      lastComputed: '12:04:31',
      output: 'GOOD',
      confidence: '91.4%',
      featuresCount: 12,
      classes: ['POOR', 'AVERAGE', 'GOOD', 'EXCELLENT'],
      activeClass: 'GOOD',
      factors: [
        { feature: 'Task Progress Velocity', importance: 0.35 },
        { feature: 'Equipment Utilization Rate', importance: 0.28 },
        { feature: 'Worker Productivity Ratio', importance: 0.18 }
      ]
    },
    {
      id: 'risk',
      index: '02',
      title: 'RISK',
      color: '#4FC3F7',
      algorithm: 'LinearRegression Model',
      version: 'v1.0',
      lastComputed: '12:04:31',
      output: '72.4%',
      badge: 'HIGH',
      featuresCount: 7,
      riskFactors: [
        { name: 'Equipment', pct: 74 },
        { name: 'Safety', pct: 89 },
        { name: 'Resource', pct: 62 },
        { name: 'Schedule', pct: 80 },
        { name: 'Material', pct: 54 },
        { name: 'Operational', pct: 71 }
      ],
      factors: [
        { feature: 'Safety Incidents Accumulator', importance: 0.42 },
        { feature: 'Machinery Vibration (Lag 15)', importance: 0.31 },
        { feature: 'Worker Density', importance: 0.15 }
      ]
    },
    {
      id: 'cost',
      index: '03',
      title: 'COST FORECAST',
      color: '#E4FF5B',
      algorithm: 'XGBRegressor Model',
      version: 'v1.0',
      lastComputed: '12:04:31',
      output: '+$8,420',
      badge: 'OVER BUDGET',
      featuresCount: 12,
      confidenceRange: '+$6,200 — +$10,640',
      factors: [
        { feature: 'Material Usage Volume', importance: 0.38 },
        { feature: 'Worker Overtime Count', importance: 0.29 },
        { feature: 'Daily Delivery Intensity', importance: 0.19 }
      ]
    },
    {
      id: 'time',
      index: '04',
      title: 'TIME FORECAST',
      color: '#7CFFA6',
      algorithm: 'HistGradientBoosting Regressor',
      version: 'v1.0',
      lastComputed: '12:04:31',
      output: '+4.8 DAYS',
      badge: 'DELAYED',
      featuresCount: 12,
      confidenceRange: '+2.1 DAYS — +7.4 DAYS',
      contributingFactors: [
        'Low task progress velocity',
        'High equipment utilization bottleneck',
        'Material availability issue'
      ],
      factors: [
        { feature: 'Task Progress Lag 15', importance: 0.45 },
        { feature: 'Equipment Pressure Ratio', importance: 0.30 },
        { feature: 'Waste Intensity', importance: 0.15 }
      ]
    },
    {
      id: 'optimization',
      index: '05',
      title: 'OPTIMIZATION',
      color: '#F5F3E3',
      algorithm: 'HistGradientBoosting Classifier',
      version: 'v1.0',
      lastComputed: '12:04:31',
      output: 'REALLOCATE WORKERS',
      confidence: '88.2%',
      featuresCount: 12,
      whyReason: 'Current resource allocation is inconsistent with task progress and equipment utilization.',
      factors: [
        { feature: 'Worker Productivity Ratio', importance: 0.50 },
        { feature: 'Task Progress Velocity', importance: 0.30 },
        { feature: 'Equipment Utilization Rate', importance: 0.15 }
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px 48px 24px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #111111', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '48px', color: '#111111', textTransform: 'uppercase' }}>
            PREDICTIONS
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#555555' }}>
            Five models. One project state.
          </p>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#666666' }}>
          Last updated: 12:04:31
        </div>
      </div>

      {/* 5 Flat Scannable Model Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {modelsData.map(m => (
          <div
            key={m.id}
            style={{
              backgroundColor: m.color,
              border: '2px solid #111111',
              borderRadius: '16px',
              padding: '24px 32px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>{m.index}</span>
                  <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '28px', color: '#111111', textTransform: 'uppercase' }}>
                    {m.title}
                  </h2>
                </div>
                <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#444444', marginTop: '2px' }}>
                  {m.algorithm} · {m.version}
                </div>
              </div>

              {/* Large Output Metric */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '40px', fontWeight: '800', color: '#111111', lineHeight: '1' }}>
                  {m.output}
                </div>
                {m.badge && (
                  <span style={{ display: 'inline-block', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', marginTop: '4px' }}>
                    {m.badge}
                  </span>
                )}
                {m.confidence && (
                  <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', marginTop: '4px' }}>
                    {m.confidence} CONFIDENCE
                  </div>
                )}
              </div>
            </div>

            {/* Performance Classes Indicator */}
            {m.classes && (
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                {m.classes.map(cls => (
                  <span
                    key={cls}
                    style={{
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 'bold',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: '1px solid #111111',
                      backgroundColor: cls === m.activeClass ? '#111111' : '#FFFFFF',
                      color: cls === m.activeClass ? '#FFFFFF' : '#111111'
                    }}
                  >
                    {cls}
                  </span>
                ))}
              </div>
            )}

            {/* Risk Factor Monochrome Horizontal Bars */}
            {m.riskFactors && (
              <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {m.riskFactors.map(rf => (
                  <div key={rf.name} style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '6px', border: '1px solid #111111' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>
                      <span>{rf.name}</span>
                      <span>{rf.pct}%</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#FFFFFF', borderRadius: '3px', marginTop: '4px', overflow: 'hidden', border: '1px solid #111111' }}>
                      <div style={{ height: '100%', width: `${rf.pct}%`, backgroundColor: '#111111' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Optimization Reasoning */}
            {m.whyReason && (
              <div style={{ marginTop: '12px', padding: '10px 14px', backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #111111', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                <strong>WHY:</strong> "{m.whyReason}"
              </div>
            )}

            {/* Traceability Footer & SHAP Drawer Trigger */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(17,17,17,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
              <span>Model: {m.algorithm} · Traceable to {m.featuresCount} input features</span>
              <button
                onClick={() => setSelectedSHAPModel(m.title)}
                style={{ fontWeight: 'bold', textDecoration: 'underline', color: '#111111', cursor: 'pointer' }}
              >
                View SHAP explanation →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SHAP Explanation Drawer */}
      <SHAPDrawer
        modelTitle={selectedSHAPModel || ''}
        isOpen={!!selectedSHAPModel}
        onClose={() => setSelectedSHAPModel(null)}
      />
    </div>
  );
};
