import React, { useEffect, useState } from 'react';
import { fetchModelMetrics } from '../services/api';

export const ModelRegistryPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetchModelMetrics()
      .then(data => setMetrics(data))
      .catch(err => console.error(err));
  }, []);

  const defaultModels = [
    { name: 'Performance Model', type: 'HistGradientBoosting Classifier', version: 'v1.0', date: '2026-08-14', metric: 'Accuracy: 81.99%', status: 'PRODUCTION' },
    { name: 'Risk Model', type: 'LinearRegression Model', version: 'v1.0', date: '2026-08-14', metric: 'R²: 0.9037', status: 'PRODUCTION' },
    { name: 'Cost Forecast Model', type: 'XGBRegressor Model', version: 'v1.0', date: '2026-08-14', metric: 'R²: 0.9082', status: 'PRODUCTION' },
    { name: 'Time Forecast Model', type: 'HistGradientBoosting Regressor', version: 'v1.0', date: '2026-08-14', metric: 'R²: 0.8631', status: 'PRODUCTION' },
    { name: 'Optimization Model', type: 'HistGradientBoosting Classifier', version: 'v1.0', date: '2026-08-14', metric: 'Accuracy: 92.49%', status: 'PRODUCTION' },
    { name: 'House Price Prediction Model', type: 'XGBRegressor (Fallback: RF)', version: 'v1.0', date: '2026-08-26', metric: 'R²: 0.9975', status: 'PRODUCTION' }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px 48px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', borderBottom: '2px solid #111111', paddingBottom: '16px' }}>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '48px', color: '#111111', textTransform: 'uppercase' }}>
          MODEL REGISTRY
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#555555' }}>
          Catalog of all ConArk models and their performance.
        </p>
      </div>

      {/* Models List Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '2px solid #111111', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #111111', textAlign: 'left', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
              <th style={{ padding: '10px 8px' }}>MODEL</th>
              <th style={{ padding: '10px 8px' }}>TYPE</th>
              <th style={{ padding: '10px 8px' }}>VERSION</th>
              <th style={{ padding: '10px 8px' }}>TRAINING DATE</th>
              <th style={{ padding: '10px 8px' }}>PRIMARY METRIC</th>
              <th style={{ padding: '10px 8px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {defaultModels.map((m, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eeeeee' }}>
                <td style={{ padding: '14px 8px', fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}>{m.name}</td>
                <td style={{ padding: '14px 8px', fontFamily: 'JetBrains Mono, monospace', color: '#555555' }}>{m.type}</td>
                <td style={{ padding: '14px 8px', fontFamily: 'JetBrains Mono, monospace' }}>{m.version}</td>
                <td style={{ padding: '14px 8px', fontFamily: 'JetBrains Mono, monospace', color: '#666666' }}>{m.date}</td>
                <td style={{ padding: '14px 8px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>{m.metric}</td>
                <td style={{ padding: '14px 8px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Raw Metrics JSON Inspection */}
      {metrics && (
        <div style={{ marginTop: '24px', backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', color: '#111111', marginBottom: '12px', textTransform: 'uppercase' }}>
            RAW BACKEND MODEL METRICS & CONFUSION MATRICES
          </h3>
          <pre style={{ backgroundColor: '#EDECE7', padding: '16px', borderRadius: '8px', border: '1px solid #111111', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', overflowX: 'auto' }}>
            {JSON.stringify(metrics, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
