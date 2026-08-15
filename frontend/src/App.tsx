import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Cpu,
  Maximize2,
  Zap,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  BarChart3,
  Box,
  BrainCircuit
} from 'lucide-react';
import type {
  OperationalInputs,
  SpaceInputs,
  MasterIntelligenceResponse,
  SpaceOptimizationResponse
} from './types';


const API_BASE = 'http://localhost:8000/api/v1';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'master' | 'space' | 'models'>('master');
  const [loadingMaster, setLoadingMaster] = useState(false);
  const [loadingSpace, setLoadingSpace] = useState(false);

  // Default Operational Inputs
  const [opInput, setOpInput] = useState<OperationalInputs>({
    timestamp: new Date().toISOString().slice(0, 19),
    temperature: 32.5,
    humidity: 45.0,
    vibration_level: 28.4,
    material_usage: 680.0,
    machinery_status: 1,
    worker_count: 45,
    energy_consumption: 340.0,
    task_progress: 0.42,
    safety_incidents: 1,
    equipment_utilization_rate: 91.2,
    material_shortage_alert: 0
  });

  // Default Space Inputs
  const [spaceInput, setSpaceInput] = useState<SpaceInputs>({
    site_area_sqm: 1800,
    site_length_m: 60,
    site_width_m: 30,
    construction_stage: 'STRUCTURE',
    material_quantity_kg: 8500,
    material_types_count: 8,
    machinery_count: 10,
    heavy_machinery_count: 4,
    worker_count: 45,
    daily_material_delivery_count: 6,
    daily_truck_count: 8,
    estimated_daily_material_usage_kg: 680,
    waste_generation_kg_per_day: 220,
    safety_requirement_level: 'HIGH',
    emergency_access_required: true,
    temperature: 32.5,
    humidity: 45.0,
    vibration_level: 28.4,
    equipment_utilization_rate: 91.2,
    task_progress: 0.42,
    risk_score: 55,
    material_shortage_alert: 0
  });

  // Responses
  const [masterRes, setMasterRes] = useState<MasterIntelligenceResponse | null>(null);
  const [spaceRes, setSpaceRes] = useState<SpaceOptimizationResponse | null>(null);
  const [metricsRes, setMetricsRes] = useState<any>(null);

  // Preset scenarios
  const applyPreset = (preset: 'overload' | 'optimal' | 'shortage') => {
    if (preset === 'overload') {
      setOpInput({
        timestamp: new Date().toISOString().slice(0, 19),
        temperature: 35.0,
        humidity: 40.0,
        vibration_level: 35.2,
        material_usage: 750.0,
        machinery_status: 1,
        worker_count: 50,
        energy_consumption: 420.0,
        task_progress: 0.35,
        safety_incidents: 1,
        equipment_utilization_rate: 95.0,
        material_shortage_alert: 0
      });
      setSpaceInput(prev => ({
        ...prev,
        site_area_sqm: 1600,
        machinery_count: 12,
        heavy_machinery_count: 5,
        worker_count: 50,
        safety_requirement_level: 'HIGH'
      }));
    } else if (preset === 'optimal') {
      setOpInput({
        timestamp: new Date().toISOString().slice(0, 19),
        temperature: 24.0,
        humidity: 55.0,
        vibration_level: 11.5,
        material_usage: 280.0,
        machinery_status: 1,
        worker_count: 30,
        energy_consumption: 170.0,
        task_progress: 0.75,
        safety_incidents: 0,
        equipment_utilization_rate: 62.0,
        material_shortage_alert: 0
      });
      setSpaceInput(prev => ({
        ...prev,
        site_area_sqm: 2200,
        construction_stage: 'FINISHING',
        machinery_count: 4,
        heavy_machinery_count: 1,
        worker_count: 30,
        safety_requirement_level: 'MEDIUM'
      }));
    } else if (preset === 'shortage') {
      setOpInput({
        timestamp: new Date().toISOString().slice(0, 19),
        temperature: 27.0,
        humidity: 50.0,
        vibration_level: 16.0,
        material_usage: 950.0,
        machinery_status: 1,
        worker_count: 40,
        energy_consumption: 280.0,
        task_progress: 0.50,
        safety_incidents: 0,
        equipment_utilization_rate: 75.0,
        material_shortage_alert: 1
      });
      setSpaceInput(prev => ({
        ...prev,
        material_quantity_kg: 14000,
        material_shortage_alert: 1,
        safety_requirement_level: 'CRITICAL'
      }));
    }
  };

  const runMasterAnalysis = async () => {
    setLoadingMaster(true);
    try {
      const res = await fetch(`${API_BASE}/intelligence/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opInput)
      });
      const data = await res.json();
      setMasterRes(data);
    } catch (e) {
      alert('Failed to connect to ConArk FastAPI backend: ' + e);
    } finally {
      setLoadingMaster(false);
    }
  };

  const runSpaceOptimization = async () => {
    setLoadingSpace(true);
    try {
      const res = await fetch(`${API_BASE}/space/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spaceInput)
      });
      const data = await res.json();
      setSpaceRes(data);
    } catch (e) {
      alert('Failed to run space optimization: ' + e);
    } finally {
      setLoadingSpace(false);
    }
  };

  const fetchModelMetrics = async () => {
    try {
      const res = await fetch(`${API_BASE}/model-metrics`);
      const data = await res.json();
      setMetricsRes(data);
    } catch (e) {
      alert('Failed to fetch model metrics: ' + e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' }}>
      {/* Header Bar */}
      <header style={{
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex'
          }}>
            <BrainCircuit size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc', letterSpacing: '-0.5px' }}>
              ConArk Systems
            </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              Construction AI Intelligence Platform • Powered by 5 ML Models + Space Optimizer + Gemini 2.5 Flash
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
          <button
            onClick={() => setActiveTab('master')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'master' ? '#3b82f6' : 'transparent',
              color: activeTab === 'master' ? '#ffffff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            <Activity size={16} /> 5-Model Intelligence
          </button>
          <button
            onClick={() => { setActiveTab('space'); if (!spaceRes) runSpaceOptimization(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'space' ? '#3b82f6' : 'transparent',
              color: activeTab === 'space' ? '#ffffff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            <Box size={16} /> Space Optimizer
          </button>
          <button
            onClick={() => { setActiveTab('models'); if (!metricsRes) fetchModelMetrics(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'models' ? '#3b82f6' : 'transparent',
              color: activeTab === 'models' ? '#ffffff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            <BarChart3 size={16} /> Model Registry & Metrics
          </button>
        </div>
      </header>

      {/* Preset Scenarios Banner */}
      <div style={{
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '13px'
      }}>
        <span style={{ color: '#94a3b8', fontWeight: '500' }}>Load Quick Scenario Presets:</span>
        <button
          onClick={() => applyPreset('overload')}
          style={{
            backgroundColor: '#334155',
            color: '#f8fafc',
            border: '1px solid #475569',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          🚨 Overloaded Equipment & Vibration
        </button>
        <button
          onClick={() => applyPreset('optimal')}
          style={{
            backgroundColor: '#334155',
            color: '#f8fafc',
            border: '1px solid #475569',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          ✅ Smooth Finishing Operations
        </button>
        <button
          onClick={() => applyPreset('shortage')}
          style={{
            backgroundColor: '#334155',
            color: '#f8fafc',
            border: '1px solid #475569',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          📦 High Inventory & Material Shortage
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {activeTab === 'master' && (
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
            {/* Left Controls Column */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="#38bdf8" /> Operational Telemetry Inputs
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Temperature (°C)</label>
                  <input
                    type="number"
                    value={opInput.temperature}
                    onChange={e => setOpInput({ ...opInput, temperature: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Humidity (%)</label>
                  <input
                    type="number"
                    value={opInput.humidity}
                    onChange={e => setOpInput({ ...opInput, humidity: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Vibration Level (mm/s)</label>
                  <input
                    type="number"
                    value={opInput.vibration_level}
                    onChange={e => setOpInput({ ...opInput, vibration_level: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Material Usage (units)</label>
                  <input
                    type="number"
                    value={opInput.material_usage}
                    onChange={e => setOpInput({ ...opInput, material_usage: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Worker Count</label>
                  <input
                    type="number"
                    value={opInput.worker_count}
                    onChange={e => setOpInput({ ...opInput, worker_count: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Equipment Utilization (%)</label>
                  <input
                    type="number"
                    value={opInput.equipment_utilization_rate}
                    onChange={e => setOpInput({ ...opInput, equipment_utilization_rate: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Safety Incidents Count</label>
                  <input
                    type="number"
                    value={opInput.safety_incidents}
                    onChange={e => setOpInput({ ...opInput, safety_incidents: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Material Shortage Alert</label>
                  <select
                    value={opInput.material_shortage_alert}
                    onChange={e => setOpInput({ ...opInput, material_shortage_alert: parseInt(e.target.value) })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  >
                    <option value={0}>0 - Normal Inventory</option>
                    <option value={1}>1 - Imminent Shortage</option>
                  </select>
                </div>

                <button
                  onClick={runMasterAnalysis}
                  disabled={loadingMaster}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    fontWeight: '600',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {loadingMaster ? <RefreshCw className="spin" size={18} /> : <Zap size={18} />} Run 5-Model Intelligence
                </button>
              </div>
            </div>

            {/* Right Output Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {!masterRes ? (
                <div style={{
                  backgroundColor: '#1e293b',
                  border: '1px border-dashed #334155',
                  borderRadius: '12px',
                  padding: '48px',
                  textAlign: 'center',
                  color: '#94a3b8'
                }}>
                  <BrainCircuit size={48} color="#3b82f6" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#f8fafc', marginBottom: '8px' }}>No Master Intelligence Analysis Executed</h3>
                  <p>Click "Run 5-Model Intelligence" to evaluate telemetry across all 5 ML models and Gemini 2.5 Flash.</p>
                </div>
              ) : (
                <>
                  {/* Health & Executive Summary Card */}
                  <div style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr',
                    gap: '20px'
                  }}>
                    <div style={{
                      backgroundColor: '#0f172a',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #334155'
                    }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ConArk Health Index</span>
                      <span style={{
                        fontSize: '48px',
                        fontWeight: '800',
                        color: masterRes.health.overall_health_score >= 70 ? '#22c55e' : masterRes.health.overall_health_score >= 50 ? '#f59e0b' : '#ef4444',
                        margin: '4px 0'
                      }}>
                        {masterRes.health.overall_health_score}
                      </span>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        backgroundColor: masterRes.health.overall_health_score >= 70 ? '#14532d' : masterRes.health.overall_health_score >= 50 ? '#78350f' : '#7f1d1d',
                        color: '#ffffff',
                        padding: '2px 10px',
                        borderRadius: '12px'
                      }}>
                        {masterRes.health.health_status}
                      </span>
                    </div>

                    {/* Gemini Executive Summary */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Sparkles size={18} color="#a855f7" />
                        <h3 style={{ fontSize: '15px', color: '#f8fafc', fontWeight: '600' }}>
                          Gemini 2.5 Flash Executive Summary
                        </h3>
                        <span style={{ fontSize: '11px', color: '#a855f7', backgroundColor: '#3b0764', padding: '2px 8px', borderRadius: '4px' }}>
                          Structured AI Output
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>
                        {masterRes.gemini_report.report?.executive_summary || masterRes.gemini_report.message}
                      </p>
                      
                      {masterRes.alerts.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                          {masterRes.alerts.map((alt, idx) => (
                            <span key={idx} style={{
                              fontSize: '12px',
                              backgroundColor: alt.priority <= 2 ? '#7f1d1d' : '#78350f',
                              color: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <AlertTriangle size={12} /> {alt.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 5 ML Models Prediction Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    {/* Model 1: Performance */}
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
                        <span>Model 1: Performance</span>
                        <span>Classification</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#38bdf8' }}>
                        {masterRes.ml_results.performance.prediction}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        Confidence: {(masterRes.ml_results.performance.confidence * 100).toFixed(1)}%
                      </div>
                    </div>

                    {/* Model 2: Risk */}
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
                        <span>Model 2: Risk Score</span>
                        <span>Regression</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: masterRes.ml_results.risk.risk_score > 50 ? '#ef4444' : '#22c55e' }}>
                        {masterRes.ml_results.risk.risk_score.toFixed(1)} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>({masterRes.ml_results.risk.risk_level})</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        Interval: [{masterRes.ml_results.risk.estimated_range.lower.toFixed(1)}, {masterRes.ml_results.risk.estimated_range.upper.toFixed(1)}]
                      </div>
                    </div>

                    {/* Model 3: Cost */}
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
                        <span>Model 3: Cost Forecast</span>
                        <span>XGBoost</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: masterRes.ml_results.cost_forecast.predicted_cost_deviation > 0 ? '#ef4444' : '#22c55e' }}>
                        ${masterRes.ml_results.cost_forecast.predicted_cost_deviation.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        Status: {masterRes.ml_results.cost_forecast.budget_status}
                      </div>
                    </div>

                    {/* Model 4: Time */}
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
                        <span>Model 4: Time Forecast</span>
                        <span>HistGradient</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: masterRes.ml_results.time_forecast.predicted_time_deviation_days > 0 ? '#ef4444' : '#22c55e' }}>
                        {masterRes.ml_results.time_forecast.predicted_time_deviation_days.toFixed(1)} Days
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        Status: {masterRes.ml_results.time_forecast.schedule_status}
                      </div>
                    </div>

                    {/* Model 5: Optimization */}
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px', gridColumn: 'span 2' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
                        <span>Model 5: Optimization Recommendation</span>
                        <span>Multiclass</span>
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#a855f7' }}>
                        {masterRes.ml_results.optimization.recommendation}
                      </div>
                      <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                        Factors: {masterRes.ml_results.optimization.supporting_factors.join(', ') || 'Operational parameters within bounds'}
                      </div>
                    </div>
                  </div>

                  {/* Gemini Recommended Actions */}
                  {masterRes.gemini_report.report?.recommended_actions && (
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ fontSize: '15px', color: '#f8fafc', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={18} color="#a855f7" /> Gemini AI Recommended Operational Actions
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {masterRes.gemini_report.report.recommended_actions.map((act, i) => (
                          <div key={i} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle2 size={16} color="#22c55e" /> {act}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* SPACE OPTIMIZER TAB */}
        {activeTab === 'space' && (
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
            {/* Left Controls */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box size={18} color="#38bdf8" /> Space Constrained Inputs
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Total Site Area (sqm)</label>
                  <input
                    type="number"
                    value={spaceInput.site_area_sqm}
                    onChange={e => setSpaceInput({ ...spaceInput, site_area_sqm: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8' }}>Site Length (m)</label>
                    <input
                      type="number"
                      value={spaceInput.site_length_m || ''}
                      onChange={e => setSpaceInput({ ...spaceInput, site_length_m: parseFloat(e.target.value) || undefined })}
                      style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8' }}>Site Width (m)</label>
                    <input
                      type="number"
                      value={spaceInput.site_width_m || ''}
                      onChange={e => setSpaceInput({ ...spaceInput, site_width_m: parseFloat(e.target.value) || undefined })}
                      style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Construction Stage</label>
                  <select
                    value={spaceInput.construction_stage}
                    onChange={e => setSpaceInput({ ...spaceInput, construction_stage: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  >
                    <option value="FOUNDATION">FOUNDATION</option>
                    <option value="STRUCTURE">STRUCTURE</option>
                    <option value="MASONRY">MASONRY</option>
                    <option value="ELECTRICAL">ELECTRICAL</option>
                    <option value="PLUMBING">PLUMBING</option>
                    <option value="FINISHING">FINISHING</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Material Quantity (kg)</label>
                  <input
                    type="number"
                    value={spaceInput.material_quantity_kg}
                    onChange={e => setSpaceInput({ ...spaceInput, material_quantity_kg: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Total Machinery Count</label>
                  <input
                    type="number"
                    value={spaceInput.machinery_count}
                    onChange={e => setSpaceInput({ ...spaceInput, machinery_count: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Heavy Machinery Count</label>
                  <input
                    type="number"
                    value={spaceInput.heavy_machinery_count}
                    onChange={e => setSpaceInput({ ...spaceInput, heavy_machinery_count: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Safety Requirement Level</label>
                  <select
                    value={spaceInput.safety_requirement_level}
                    onChange={e => setSpaceInput({ ...spaceInput, safety_requirement_level: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '6px', marginTop: '4px' }}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <button
                  onClick={runSpaceOptimization}
                  disabled={loadingSpace}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    fontWeight: '600',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {loadingSpace ? <RefreshCw className="spin" size={18} /> : <Maximize2 size={18} />} Solve SciPy Optimization
                </button>
              </div>
            </div>

            {/* Right Output View */}
            <div>
              {!spaceRes ? (
                <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                  <Box size={48} color="#3b82f6" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#f8fafc' }}>No Space Optimization Executed</h3>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Status Banner */}
                  <div style={{
                    backgroundColor: spaceRes.status === 'OPTIMAL' ? '#14532d' : spaceRes.status === 'FEASIBLE' ? '#1e3a8a' : '#7f1d1d',
                    padding: '16px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                        Optimization Status: {spaceRes.status}
                      </h3>
                      {spaceRes.reason && <p style={{ fontSize: '13px', color: '#fca5a5', marginTop: '4px' }}>{spaceRes.reason}</p>}
                    </div>
                    {spaceRes.metrics && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>{spaceRes.metrics.space_efficiency_score}/100</div>
                        <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Space Efficiency Score</div>
                      </div>
                    )}
                  </div>

                  {/* Allocated Zones Grid */}
                  {spaceRes.allocation && (
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ fontSize: '15px', color: '#f8fafc', fontWeight: '600', marginBottom: '16px' }}>
                        Optimized 8-Zone Operational Space Allocations (sqm)
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        {Object.entries(spaceRes.allocation).map(([key, val]) => (
                          <div key={key} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px' }}>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize' }}>
                              {key.replace('_area_sqm', '').replace('_', ' ')}
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#38bdf8', marginTop: '2px' }}>
                              {val.toFixed(1)} sqm
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2D Spatial Layout Visualizer */}
                  {spaceRes.spatial_layout && spaceRes.spatial_layout.length > 0 && (
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ fontSize: '15px', color: '#f8fafc', fontWeight: '600', marginBottom: '12px' }}>
                        2D Spatial Grid Positioning Canvas ({spaceInput.site_length_m}m × {spaceInput.site_width_m}m)
                      </h3>
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '240px',
                        backgroundColor: '#0f172a',
                        border: '2px dashed #334155',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        {spaceRes.spatial_layout.map((z, idx) => {
                          const scaleX = 100 / (spaceInput.site_length_m || 60);
                          const scaleY = 100 / (spaceInput.site_width_m || 30);
                          return (
                            <div
                              key={idx}
                              style={{
                                position: 'absolute',
                                left: `${z.x * scaleX}%`,
                                top: `${z.y * scaleY}%`,
                                width: `${z.width * scaleX}%`,
                                height: `${z.height * scaleY}%`,
                                backgroundColor: `hsl(${idx * 45}, 70%, 25%)`,
                                border: `1px solid hsl(${idx * 45}, 70%, 50%)`,
                                color: '#fff',
                                padding: '4px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                overflow: 'hidden'
                              }}
                            >
                              {z.zone}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Gemini Space Report */}
                  {spaceRes.gemini_report?.space_report && (
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Sparkles size={18} color="#a855f7" />
                        <h3 style={{ fontSize: '15px', color: '#f8fafc', fontWeight: '600' }}>
                          Gemini 2.5 Flash Space Intelligence Report
                        </h3>
                      </div>
                      <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '16px' }}>
                        {spaceRes.gemini_report.space_report.summary}
                      </p>

                      <h4 style={{ fontSize: '13px', color: '#38bdf8', marginBottom: '8px' }}>Key Spatial Findings:</h4>
                      <ul style={{ paddingLeft: '20px', color: '#94a3b8', fontSize: '13px' }}>
                        {spaceRes.gemini_report.space_report.key_findings.map((f, i) => (
                          <li key={i} style={{ marginBottom: '4px' }}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODEL REGISTRY TAB */}
        {activeTab === 'models' && (
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={20} color="#38bdf8" /> ConArk Machine Learning Model Registry & Validation Metrics
            </h2>
            {!metricsRes ? (
              <p style={{ color: '#94a3b8' }}>Loading trained model metrics from backend...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(metricsRes).map(([mKey, mVal]: [string, any]) => (
                  <div key={mKey} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#38bdf8', textTransform: 'capitalize' }}>
                        {mKey} Prediction Model
                      </h3>
                      <span style={{ fontSize: '12px', backgroundColor: '#334155', color: '#f8fafc', padding: '2px 8px', borderRadius: '4px' }}>
                        {mVal.algorithm} (v{mVal.version})
                      </span>
                    </div>
                    <pre style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '6px', fontSize: '12px', color: '#a7f3d0', overflowX: 'auto' }}>
                      {JSON.stringify(mVal.metrics, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
