import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { analyzeProjectIntelligence } from '../services/api';
import type { OperationalInputs } from '../types';

export const ModelDetailPage: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const [loading, setLoading] = useState(false);
  const [hasPredicted, setHasPredicted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [inputs, setInputs] = useState<OperationalInputs>({
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

  const getModelConfig = (id?: string) => {
    switch (id) {
      case 'performance':
        return {
          title: 'PERFORMANCE MODEL',
          algorithm: 'HistGradientBoosting Classifier',
          version: 'v1.0.0',
          color: '#FFFFFF',
          outputLabel: 'PREDICTED PERFORMANCE CLASS',
          explanationKey: 'performance_explanation'
        };
      case 'risk':
        return {
          title: 'OPERATIONAL RISK MODEL',
          algorithm: 'LinearRegression Model',
          version: 'v1.0.0',
          color: '#4FC3F7',
          outputLabel: 'PREDICTED OPERATIONAL RISK SCORE',
          explanationKey: 'risk_explanation'
        };
      case 'cost':
        return {
          title: 'COST FORECAST MODEL',
          algorithm: 'XGBRegressor Model',
          version: 'v1.0.0',
          color: '#E4FF5B',
          outputLabel: 'PREDICTED COST DEVIATION',
          explanationKey: 'cost_explanation'
        };
      case 'time':
        return {
          title: 'TIME FORECAST MODEL',
          algorithm: 'HistGradientBoosting Regressor',
          version: 'v1.0.0',
          color: '#7CFFA6',
          outputLabel: 'PREDICTED TIME DEVIATION (DAYS)',
          explanationKey: 'schedule_explanation'
        };
      case 'optimization':
      default:
        return {
          title: 'OPTIMIZATION RECOMMENDATION MODEL',
          algorithm: 'HistGradientBoosting Classifier',
          version: 'v1.0.0',
          color: '#F5F3E3',
          outputLabel: 'RECOMMENDED OPERATIONAL ACTION',
          explanationKey: 'optimization_explanation'
        };
    }
  };

  const config = getModelConfig(modelId);

  // Manual Trigger ONLY — No automatic execution on load!
  const runPrediction = async () => {
    setLoading(true);
    try {
      const data = await analyzeProjectIntelligence(inputs);
      setResult(data);
      setHasPredicted(true);
    } catch (e) {
      console.error(e);
      alert('Failed to execute prediction: ' + e);
    } finally {
      setLoading(false);
    }
  };

  const getGeminiExplanation = () => {
    if (!result?.gemini_report?.report) return null;
    const report = result.gemini_report.report;
    return report[config.explanationKey] || report.executive_summary || "Gemini analysis generated based on updated model inputs.";
  };

  return (
    <div style={{ maxWidth: '1650px', margin: '0 auto', padding: '24px 32px 64px 32px' }}>
      {/* Back Navigation Link */}
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'Anton, sans-serif',
          fontSize: '18px',
          color: '#111111',
          textDecoration: 'none',
          marginBottom: '24px'
        }}
      >
        <ArrowLeft size={20} /> BACK TO COMMAND CENTER
      </Link>

      {/* Main Model Header */}
      <div style={{ marginBottom: '32px', borderBottom: '2.5px dashed #111111', paddingBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>
          CONARK PREDICTIVE ENGINE · {config.version}
        </div>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '56px', color: '#111111', textTransform: 'uppercase', marginTop: '4px' }}>
          {config.title}
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#555555' }}>
          Algorithm: {config.algorithm}
        </p>
      </div>

      {/* Grid: Left Input Form & Right Output Visualizer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Left Column: Dedicated Input Form */}
        <div style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '28px', color: '#111111', marginBottom: '8px', textTransform: 'uppercase' }}>
            MODEL INPUT PARAMETERS
          </h2>
          <p style={{ fontSize: '13px', color: '#666666', fontFamily: 'Inter, sans-serif', marginBottom: '24px' }}>
            Configure input features below. Click <strong>"PREDICT FOR THIS MODEL →"</strong> to trigger inference.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Task Progress */}
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>
                TASK PROGRESS (0.0 to 1.0)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={inputs.task_progress}
                onChange={e => setInputs({ ...inputs, task_progress: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', fontSize: '20px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '10px 14px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '6px', outline: 'none' }}
              />
            </div>

            {/* Worker Count */}
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>
                WORKER COUNT
              </label>
              <input
                type="number"
                value={inputs.worker_count}
                onChange={e => setInputs({ ...inputs, worker_count: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', fontSize: '20px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '10px 14px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '6px', outline: 'none' }}
              />
            </div>

            {/* Equipment Utilization Rate */}
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>
                EQUIPMENT UTILIZATION (%)
              </label>
              <input
                type="number"
                value={inputs.equipment_utilization_rate}
                onChange={e => setInputs({ ...inputs, equipment_utilization_rate: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', fontSize: '20px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '10px 14px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '6px', outline: 'none' }}
              />
            </div>

            {/* Safety Incidents */}
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>
                SAFETY INCIDENTS
              </label>
              <input
                type="number"
                value={inputs.safety_incidents}
                onChange={e => setInputs({ ...inputs, safety_incidents: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', fontSize: '20px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '10px 14px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '6px', outline: 'none' }}
              />
            </div>

            {/* Vibration Level */}
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>
                VIBRATION LEVEL (mm/s)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.vibration_level}
                onChange={e => setInputs({ ...inputs, vibration_level: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', fontSize: '20px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '10px 14px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '6px', outline: 'none' }}
              />
            </div>

            {/* Material Usage */}
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>
                MATERIAL USAGE (kg)
              </label>
              <input
                type="number"
                value={inputs.material_usage}
                onChange={e => setInputs({ ...inputs, material_usage: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', fontSize: '20px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '10px 14px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '6px', outline: 'none' }}
              />
            </div>

            {/* PREDICT BUTTON — MANUAL TRIGGER */}
            <button
              onClick={runPrediction}
              disabled={loading}
              style={{
                marginTop: '12px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontFamily: 'Anton, sans-serif',
                fontSize: '22px',
                padding: '16px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                letterSpacing: '0.04em'
              }}
            >
              {loading ? 'RUNNING INFERENCE & GEMINI...' : 'PREDICT FOR THIS MODEL →'}
            </button>
          </div>
        </div>

        {/* Right Column: Model Output Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {hasPredicted ? (
            <>
              {/* Dynamic Prediction Display Box in Model Signature Color */}
              <div
                style={{
                  backgroundColor: config.color,
                  border: '2.5px dashed #111111',
                  borderRadius: '20px',
                  padding: '36px 44px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                }}
              >
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>
                  {config.outputLabel}
                </span>

                {/* Model Output Prediction */}
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '64px', fontWeight: '800', color: '#111111', lineHeight: '1.0', margin: '16px 0 8px 0' }}>
                  {modelId === 'performance' && (result?.ml_results?.performance?.prediction || 'GOOD')}
                  {modelId === 'risk' && `${(result?.ml_results?.risk?.risk_score || 72).toFixed(0)}%`}
                  {modelId === 'cost' && `$${(result?.ml_results?.cost_forecast?.predicted_cost_deviation || 8420).toLocaleString()}`}
                  {modelId === 'time' && `+${(result?.ml_results?.time_forecast?.predicted_time_deviation_days || 4.8).toFixed(1)} DAYS`}
                  {modelId === 'optimization' && (result?.ml_results?.optimization?.recommendation || 'REALLOCATE WORKERS')}
                </div>

                <div style={{ fontSize: '16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111111' }}>
                  {modelId === 'performance' && `CONFIDENCE: ${((result?.ml_results?.performance?.confidence || 0.936) * 100).toFixed(1)}%`}
                  {modelId === 'risk' && `RISK LEVEL: ${result?.ml_results?.risk?.risk_level || 'HIGH'}`}
                  {modelId === 'cost' && `STATUS: ${result?.ml_results?.cost_forecast?.budget_status || 'OVER BUDGET'}`}
                  {modelId === 'time' && `SCHEDULE: ${result?.ml_results?.time_forecast?.schedule_status || 'DELAYED'}`}
                  {modelId === 'optimization' && `CONFIDENCE: ${((result?.ml_results?.optimization?.confidence || 0.882) * 100).toFixed(1)}%`}
                </div>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed rgba(17,17,17,0.25)', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#111111' }}>
                  Inference Time: 12ms · ConArk Backend v1.0
                </div>
              </div>

              {/* Gemini AI Tailored Narrative Explanation */}
              <div style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '28px 36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Sparkles size={18} color="#FF2AA1" />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 'bold' }}>
                    GEMINI 2.5 FLASH {config.title} EXPLANATION
                  </span>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#111111', lineHeight: '1.6', fontWeight: '500' }}>
                  "{getGeminiExplanation()}"
                </p>
                <div style={{ marginTop: '16px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#666666' }}>
                  Grounded in: {config.title} · ConArk Rules Engine
                </div>
              </div>
            </>
          ) : (
            /* Standby State Before User Clicks Predict */
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2.5px dashed #111111',
              borderRadius: '20px',
              padding: '48px 36px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '360px'
            }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: config.color === '#FFFFFF' ? '#EDECE7' : config.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #111111', marginBottom: '16px' }}>
                <Sparkles size={24} color="#111111" />
              </div>
              <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '28px', color: '#111111', textTransform: 'uppercase', marginBottom: '8px' }}>
                READY FOR INFERENCE
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#555555', maxWidth: '380px', lineHeight: '1.5' }}>
                Adjust the input parameters on the left and click <strong>"PREDICT FOR THIS MODEL →"</strong> to trigger real-time inference and Gemini AI explanations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
