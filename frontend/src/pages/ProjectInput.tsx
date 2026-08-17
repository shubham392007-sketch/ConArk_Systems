import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeProjectIntelligence } from '../services/api';
import type { OperationalInputs } from '../types';

export const ProjectInput: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [rawInputs, setRawInputs] = useState<Record<string, string>>({
    timestamp: new Date().toISOString().slice(0, 19),
    temperature: '32.5',
    humidity: '62.0',
    vibration_level: '28.6',
    material_usage: '6800.0',
    machinery_status: '1',
    worker_count: '74',
    energy_consumption: '920.0',
    task_progress: '0.52',
    safety_incidents: '2',
    equipment_utilization_rate: '89.0',
    material_shortage_alert: '1'
  });

  const handleRawChange = (key: string, valStr: string) => {
    setRawInputs(prev => ({ ...prev, [key]: valStr }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: OperationalInputs = {
        timestamp: rawInputs.timestamp || new Date().toISOString().slice(0, 19),
        temperature: parseFloat(rawInputs.temperature) || 0,
        humidity: parseFloat(rawInputs.humidity) || 0,
        vibration_level: parseFloat(rawInputs.vibration_level) || 0,
        material_usage: parseFloat(rawInputs.material_usage) || 0,
        machinery_status: parseInt(rawInputs.machinery_status, 10) || 0,
        worker_count: parseInt(rawInputs.worker_count, 10) || 0,
        energy_consumption: parseFloat(rawInputs.energy_consumption) || 0,
        task_progress: parseFloat(rawInputs.task_progress) || 0,
        safety_incidents: parseInt(rawInputs.safety_incidents, 10) || 0,
        equipment_utilization_rate: parseFloat(rawInputs.equipment_utilization_rate) || 0,
        material_shortage_alert: parseInt(rawInputs.material_shortage_alert, 10) || 0
      };

      await analyzeProjectIntelligence(payload);
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
              value={rawInputs.timestamp}
              onChange={e => handleRawChange('timestamp', e.target.value)}
              style={{ width: '100%', fontSize: '18px', fontFamily: 'JetBrains Mono, monospace', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Temperature */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>TEMPERATURE (°C)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.temperature}
              onChange={e => handleRawChange('temperature', e.target.value)}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Humidity */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>HUMIDITY (%)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.humidity}
              onChange={e => handleRawChange('humidity', e.target.value)}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Vibration Level */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>VIBRATION LEVEL (mm/s)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.vibration_level}
              onChange={e => handleRawChange('vibration_level', e.target.value)}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Material Usage */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>MATERIAL USAGE (kg)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.material_usage}
              onChange={e => handleRawChange('material_usage', e.target.value)}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Machinery Status */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>MACHINERY STATUS</label>
            <select
              value={rawInputs.machinery_status}
              onChange={e => handleRawChange('machinery_status', e.target.value)}
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
              type="text"
              inputMode="numeric"
              value={rawInputs.worker_count}
              onChange={e => handleRawChange('worker_count', e.target.value)}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Energy Consumption */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>ENERGY CONSUMPTION (kWh)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.energy_consumption}
              onChange={e => handleRawChange('energy_consumption', e.target.value)}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Task Progress */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>TASK PROGRESS (0 to 1.0)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.task_progress}
              onChange={e => handleRawChange('task_progress', e.target.value)}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Safety Incidents */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>SAFETY INCIDENTS</label>
            <input
              type="text"
              inputMode="numeric"
              value={rawInputs.safety_incidents}
              onChange={e => handleRawChange('safety_incidents', e.target.value)}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Equipment Utilization */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>EQUIPMENT UTILIZATION (%)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.equipment_utilization_rate}
              onChange={e => handleRawChange('equipment_utilization_rate', e.target.value)}
              style={{ width: '100%', fontSize: '24px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #111111', marginTop: '8px', padding: '4px 0', outline: 'none' }}
            />
          </div>

          {/* Material Shortage Alert */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '10px', padding: '16px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>MATERIAL SHORTAGE ALERT</label>
            <select
              value={rawInputs.material_shortage_alert}
              onChange={e => handleRawChange('material_shortage_alert', e.target.value)}
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
