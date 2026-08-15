import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeProjectIntelligence } from '../services/api';
import type { OperationalInputs } from '../types';

export const ProjectInput: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState<OperationalInputs>({
    timestamp: new Date().toISOString().slice(0, 19),
    temperature: 32.5,
    humidity: 62.0,
    vibration_level: 28.6,
    material_usage: 6800.0,
    machinery_status: 1,
    worker_count: 74,
    energy_consumption: 920.0,
    task_progress: 0.52,
    safety_incidents: 2,
    equipment_utilization_rate: 89.0,
    material_shortage_alert: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await analyzeProjectIntelligence(inputs);
      navigate('/');
    } catch (err) {
      alert('Analysis failed: ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px 48px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '48px', color: '#111111', textTransform: 'uppercase' }}>
          PROJECT INPUT
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#555555' }}>
          Provide the latest construction-site conditions.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          
          {/* Timestamp */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>TIMESTAMP</label>
            <input
              type="text"
              value={inputs.timestamp}
              onChange={e => setInputs({ ...inputs, timestamp: e.target.value })}
              style={{ width: '100%', fontSize: '18px', fontFamily: 'JetBrains Mono, monospace', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Temperature */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>TEMPERATURE (°C)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.temperature}
              onChange={e => setInputs({ ...inputs, temperature: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Humidity */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>HUMIDITY (%)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.humidity}
              onChange={e => setInputs({ ...inputs, humidity: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Vibration Level */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>VIBRATION LEVEL (mm/s)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.vibration_level}
              onChange={e => setInputs({ ...inputs, vibration_level: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Material Usage */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>MATERIAL USAGE (kg)</label>
            <input
              type="number"
              value={inputs.material_usage}
              onChange={e => setInputs({ ...inputs, material_usage: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Machinery Status */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>MACHINERY STATUS</label>
            <select
              value={inputs.machinery_status}
              onChange={e => setInputs({ ...inputs, machinery_status: parseInt(e.target.value) })}
              style={{ width: '100%', fontSize: '18px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none', backgroundColor: '#fff' }}
            >
              <option value={1}>ACTIVE</option>
              <option value={0}>IDLE</option>
            </select>
          </div>

          {/* Worker Count */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>WORKER COUNT</label>
            <input
              type="number"
              value={inputs.worker_count}
              onChange={e => setInputs({ ...inputs, worker_count: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Energy Consumption */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>ENERGY CONSUMPTION (kWh)</label>
            <input
              type="number"
              value={inputs.energy_consumption}
              onChange={e => setInputs({ ...inputs, energy_consumption: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Task Progress */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>TASK PROGRESS (0 to 1.0)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={inputs.task_progress}
              onChange={e => setInputs({ ...inputs, task_progress: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Safety Incidents */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>SAFETY INCIDENTS</label>
            <input
              type="number"
              value={inputs.safety_incidents}
              onChange={e => setInputs({ ...inputs, safety_incidents: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Equipment Utilization */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>EQUIPMENT UTILIZATION (%)</label>
            <input
              type="number"
              value={inputs.equipment_utilization_rate}
              onChange={e => setInputs({ ...inputs, equipment_utilization_rate: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Material Shortage Alert */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>MATERIAL SHORTAGE ALERT</label>
            <select
              value={inputs.material_shortage_alert}
              onChange={e => setInputs({ ...inputs, material_shortage_alert: parseInt(e.target.value) })}
              style={{ width: '100%', fontSize: '18px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none', backgroundColor: '#fff' }}
            >
              <option value={0}>NORMAL</option>
              <option value={1}>ALERT</option>
            </select>
          </div>
        </div>

        {/* ANALYZE PROJECT Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#111111',
            color: '#FFFFFF',
            fontFamily: 'Anton, sans-serif',
            fontSize: '24px',
            letterSpacing: '0.04em',
            padding: '16px 36px',
            border: 'none',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'ANALYZING PROJECT...' : 'ANALYZE PROJECT →'}
        </button>
      </form>
    </div>
  );
};
