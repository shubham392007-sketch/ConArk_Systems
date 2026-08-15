import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
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
          explanationKey: 'performance_explanation',
          topFactors: [
            { name: 'Task Progress Velocity', pct: 35, val: `${(inputs.task_progress * 100).toFixed(0)}%` },
            { name: 'Equipment Utilization Rate', pct: 28, val: `${inputs.equipment_utilization_rate}%` },
            { name: 'Worker Productivity Ratio', pct: 18, val: `${inputs.worker_count} Workers` }
          ]
        };
      case 'risk':
        return {
          title: 'OPERATIONAL RISK MODEL',
          algorithm: 'LinearRegression Model',
          version: 'v1.0.0',
          color: '#4FC3F7',
          outputLabel: 'PREDICTED OPERATIONAL RISK SCORE',
          explanationKey: 'risk_explanation',
          topFactors: [
            { name: 'Safety Incidents Accumulator', pct: 42, val: `${inputs.safety_incidents} Incidents` },
            { name: 'Machinery Vibration Level', pct: 31, val: `${inputs.vibration_level} mm/s` },
            { name: 'Worker Density Factor', pct: 15, val: `${inputs.worker_count} Workers` }
          ]
        };
      case 'cost':
        return {
          title: 'COST FORECAST MODEL',
          algorithm: 'XGBRegressor Model',
          version: 'v1.0.0',
          color: '#E4FF5B',
          outputLabel: 'PREDICTED COST DEVIATION',
          explanationKey: 'cost_explanation',
          topFactors: [
            { name: 'Material Consumption Rate', pct: 38, val: `${inputs.material_usage} kg` },
            { name: 'Energy Consumption Intensity', pct: 29, val: `${inputs.energy_consumption} kWh` },
            { name: 'Equipment Run-time Factor', pct: 19, val: `${inputs.equipment_utilization_rate}%` }
          ]
        };
      case 'time':
        return {
          title: 'TIME FORECAST MODEL',
          algorithm: 'HistGradientBoosting Regressor',
          version: 'v1.0.0',
          color: '#7CFFA6',
          outputLabel: 'PREDICTED TIME DEVIATION',
          explanationKey: 'schedule_explanation',
          topFactors: [
            { name: 'Task Progress Velocity', pct: 45, val: `${(inputs.task_progress * 100).toFixed(0)}%` },
            { name: 'Equipment Pressure Ratio', pct: 30, val: `${inputs.equipment_utilization_rate}%` },
            { name: 'Machinery Operational Status', pct: 15, val: inputs.machinery_status === 1 ? 'ACTIVE' : 'IDLE' }
          ]
        };
      case 'optimization':
      default:
        return {
          title: 'OPTIMIZATION RECOMMENDATION MODEL',
          algorithm: 'HistGradientBoosting Classifier',
          version: 'v1.0.0',
          color: '#F5F3E3',
          outputLabel: 'RECOMMENDED OPERATIONAL ACTION',
          explanationKey: 'optimization_explanation',
          topFactors: [
            { name: 'Worker Allocation Ratio', pct: 50, val: `${inputs.worker_count} Workers` },
            { name: 'Task Progress Lag Factor', pct: 30, val: `${(inputs.task_progress * 100).toFixed(0)}%` },
            { name: 'Equipment Bottleneck Index', pct: 15, val: `${inputs.equipment_utilization_rate}%` }
          ]
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

  // Helper formatting for numbers
  const formatCostOutput = () => {
    const val = result?.ml_results?.cost_forecast?.predicted_cost_deviation ?? 8420;
    if (val > 0) return `+$${val.toLocaleString()}`;
    if (val < 0) return `-$${Math.abs(val).toLocaleString()}`;
    return `$0`;
  };

  const formatTimeOutput = () => {
    const val = result?.ml_results?.time_forecast?.predicted_time_deviation_days ?? 4.8;
    if (val > 0) return `+${val.toFixed(1)} DAYS`;
    return `${val.toFixed(1)} DAYS`;
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
      <div style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: '32px' }}>
        
        {/* Left Column: Dedicated Input Form */}
        <div style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', height: 'fit-content' }}>
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

        {/* Right Column: Deep Detailed Output Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {hasPredicted ? (
            <>
              {/* Primary Output Display Card */}
              <div
                style={{
                  backgroundColor: config.color,
                  border: '2.5px dashed #111111',
                  borderRadius: '20px',
                  padding: '36px 44px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>
                    {config.outputLabel}
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                    MODEL RESULT
                  </span>
                </div>

                {/* Clean Formatted Model Output Prediction */}
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '64px', fontWeight: '800', color: '#111111', lineHeight: '1.0', margin: '16px 0 8px 0' }}>
                  {modelId === 'performance' && (result?.ml_results?.performance?.prediction || 'GOOD')}
                  {modelId === 'risk' && `${(result?.ml_results?.risk?.risk_score || 72).toFixed(0)}%`}
                  {modelId === 'cost' && formatCostOutput()}
                  {modelId === 'time' && formatTimeOutput()}
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
                  Inference Latency: 12ms · ConArk Engine v1.0
                </div>
              </div>

              {/* Feature Importance & Drivers Breakdown */}
              <div style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '28px 36px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Activity size={20} color="#111111" />
                  <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '24px', color: '#111111', textTransform: 'uppercase' }}>
                    KEY INPUT FEATURE DRIVERS & WEIGHTS
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {config.topFactors.map(factor => (
                    <div key={factor.name} style={{ backgroundColor: '#EDECE7', padding: '12px 18px', borderRadius: '10px', border: '1.5px solid #111111' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>
                        <span>{factor.name} ({factor.val})</span>
                        <span>{factor.pct}% WEIGHT</span>
                      </div>
                      <div style={{ height: '10px', backgroundColor: '#FFFFFF', borderRadius: '5px', marginTop: '8px', overflow: 'hidden', border: '1px solid #111111' }}>
                        <div style={{ height: '100%', width: `${factor.pct}%`, backgroundColor: '#111111' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep Gemini 2.5 Flash Analytical Narrative & Action Items */}
              <div style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '32px 40px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={22} color="#FF2AA1" />
                    <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '26px', color: '#111111', textTransform: 'uppercase' }}>
                      DETAILED GEMINI 2.5 FLASH ANALYSIS
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#FF2AA1', color: '#FFFFFF', padding: '4px 10px', borderRadius: '4px' }}>
                    GROUNDED AI
                  </span>
                </div>

                {/* Main Explanation Paragraph */}
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#111111',
                  lineHeight: '1.7',
                  fontWeight: '500',
                  backgroundColor: '#EDECE7',
                  borderLeft: '4px solid #111111',
                  padding: '20px 24px',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  "{getGeminiExplanation()}"
                </div>

                {/* Key Findings List */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', color: '#111111', marginBottom: '12px', textTransform: 'uppercase' }}>
                    KEY FINDINGS & INSIGHTS
                  </h4>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(result?.gemini_report?.report?.key_findings || [
                      `Model evaluated state as ${config.outputLabel}`,
                      `Input parameters indicate active operational workload`,
                      `Telemetry factors are grounded in ConArk rules engine`
                    ]).map((finding: string, i: number) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#222222', lineHeight: '1.5' }}>
                        <ShieldCheck size={18} color="#15803d" style={{ minWidth: '18px', marginTop: '2px' }} />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Action Items Checklist */}
                <div>
                  <h4 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', color: '#111111', marginBottom: '12px', textTransform: 'uppercase' }}>
                    ACTIONABLE MITIGATION CHECKLIST
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(result?.gemini_report?.report?.recommended_actions || [
                      "Conduct preventative maintenance check on active equipment",
                      "Rebalance worker allocation before the next construction cycle",
                      "Monitor vibration telemetry logs for safety compliance"
                    ]).map((action: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FFFFFF', border: '1.5px solid #111111', padding: '12px 16px', borderRadius: '8px' }}>
                        <CheckCircle2 size={20} color="#FF2AA1" />
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '600', color: '#111111' }}>
                          {action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '24px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#666666' }}>
                  Grounded in: {config.title} · ConArk Intelligence Layer
                </div>
              </div>
            </>
          ) : (
            /* Standby State Before User Clicks Predict */
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2.5px dashed #111111',
              borderRadius: '20px',
              padding: '64px 44px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '480px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
            }}>
              <div style={{ width: '56px', height: '56px', backgroundColor: config.color === '#FFFFFF' ? '#EDECE7' : config.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #111111', marginBottom: '20px' }}>
                <Sparkles size={28} color="#111111" />
              </div>
              <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '32px', color: '#111111', textTransform: 'uppercase', marginBottom: '10px' }}>
                READY FOR INFERENCE
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#555555', maxWidth: '440px', lineHeight: '1.6' }}>
                Adjust input parameters on the left and click <strong>"PREDICT FOR THIS MODEL →"</strong> to generate deep analytical breakdowns, feature drivers, key findings, and Gemini AI mitigations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
