import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { analyzeProjectIntelligence } from '../services/api';
import type { MasterIntelligenceResponse, OperationalInputs } from '../types';

export const CommandCenter: React.FC = () => {
  const [data, setData] = useState<MasterIntelligenceResponse | null>(null);

  const defaultInput: OperationalInputs = {
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
  };

  const loadIntelligence = async () => {
    try {
      const res = await analyzeProjectIntelligence(defaultInput);
      setData(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadIntelligence();
  }, []);

  // Live predictions or fallback defaults
  const perfPred = data?.ml_results.performance.prediction ?? 'GOOD';
  const perfConf = (data?.ml_results.performance.confidence ?? 0.936) * 100;
  const healthScore = data?.health.overall_health_score ?? 74;

  const riskScore = data?.ml_results.risk.risk_score ?? 72;
  const riskLevel = data?.ml_results.risk.risk_level ?? 'HIGH';

  const costDev = data?.ml_results.cost_forecast.predicted_cost_deviation ?? 8420;
  const costStatus = data?.ml_results.cost_forecast.budget_status ?? 'OVER BUDGET';

  const timeDev = data?.ml_results.time_forecast.predicted_time_deviation_days ?? 4.8;
  const timeStatus = data?.ml_results.time_forecast.schedule_status ?? 'DELAYED';

  const optRec = data?.ml_results.optimization.recommendation ?? 'REALLOCATE WORKERS';
  const optConf = (data?.ml_results.optimization.confidence ?? 0.882) * 100;

  const geminiText = data?.gemini_report.report?.executive_summary || "Review worker allocation before the next construction cycle.";

  return (
    <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '24px 32px 64px 32px' }}>
      {/* Giant Editorial Wordmark */}
      <div style={{ textAlign: 'center', margin: '16px 0 40px 0' }}>
        <h1 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: 'clamp(80px, 18vw, 230px)',
          lineHeight: '0.85',
          color: '#111111',
          letterSpacing: '-0.03em',
          textTransform: 'uppercase'
        }}>
          CONARK
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '18px',
          fontWeight: '600',
          color: '#111111',
          marginTop: '16px',
          letterSpacing: '0.03em'
        }}>
          Predict. Decide. Explain. Act.
        </p>
      </div>

      {/* 5-MODEL STACKED CARD DECK */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', marginBottom: '40px' }}>
        
        {/* MODEL 01: PERFORMANCE MODEL (WHITE #FFFFFF) */}
        <div
          className="card-rotate-neg1 card-hover-lift"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '32px 44px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            zIndex: 5
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: '#666666', fontWeight: 'bold' }}>01</span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                  CLASSIFICATION MODEL
                </span>
              </div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '38px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '4px' }}>
                PERFORMANCE MODEL
              </h2>
              <p style={{ fontSize: '14px', color: '#555555', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                HistGradientBoosting Classifier · v1.0
              </p>

              {/* Explicit Model Telemetry Inputs */}
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ backgroundColor: '#EDECE7', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Task Progress (42%)
                </span>
                <span style={{ backgroundColor: '#EDECE7', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Workers ({defaultInput.worker_count})
                </span>
                <span style={{ backgroundColor: '#EDECE7', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Equipment ({defaultInput.equipment_utilization_rate}%)
                </span>
              </div>
            </div>

            {/* Model Output Prediction */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>MODEL OUTPUT</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '56px', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '4px' }}>
                {perfPred}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#15803d', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                CONFIDENCE: {perfConf.toFixed(1)}% · HEALTH: {healthScore}/100
              </div>
            </div>
          </div>
        </div>

        {/* MODEL 02: RISK MODEL (BLUE #4FC3F7) */}
        <div
          className="card-rotate-pos1 card-hover-lift"
          style={{
            backgroundColor: '#4FC3F7',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '32px 44px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            marginTop: '-18px',
            zIndex: 4
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>02</span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                  REGRESSION MODEL
                </span>
              </div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '38px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '4px' }}>
                OPERATIONAL RISK MODEL
              </h2>
              <p style={{ fontSize: '14px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                LinearRegression Model · v1.0
              </p>

              {/* Explicit Model Telemetry Inputs */}
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Safety Incidents ({defaultInput.safety_incidents})
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Vibration ({defaultInput.vibration_level} mm/s)
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Temp ({defaultInput.temperature}°C)
                </span>
              </div>
            </div>

            {/* Model Output Prediction */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.6">
                <path d="M4 21h16M7 21V7l10-4M17 3v18M7 11h10M7 16h10" />
              </svg>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '56px', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '4px' }}>
                  {riskScore.toFixed(0)}%
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                  RISK LEVEL: {riskLevel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODEL 03: COST FORECAST MODEL (CHARTREUSE #E4FF5B) */}
        <div
          className="card-rotate-neg07 card-hover-lift"
          style={{
            backgroundColor: '#E4FF5B',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '32px 44px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            marginTop: '-18px',
            zIndex: 3
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>03</span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                  XGBOOST REGRESSOR
                </span>
              </div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '38px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '4px' }}>
                COST FORECAST MODEL
              </h2>
              <p style={{ fontSize: '14px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                XGBRegressor Model · v1.0
              </p>

              {/* Explicit Model Telemetry Inputs */}
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Material Usage ({defaultInput.material_usage} kg)
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Energy ({defaultInput.energy_consumption} kWh)
                </span>
              </div>
            </div>

            {/* Model Output Prediction */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '50px', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '4px' }}>
                {costDev > 0 ? `+$${costDev.toLocaleString()}` : `-$${Math.abs(costDev).toLocaleString()}`}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                STATUS: {costStatus}
              </div>
            </div>
          </div>
        </div>

        {/* MODEL 04: TIME FORECAST MODEL (MINT #7CFFA6) */}
        <div
          className="card-rotate-pos08 card-hover-lift"
          style={{
            backgroundColor: '#7CFFA6',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '32px 44px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            marginTop: '-18px',
            zIndex: 2
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>04</span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                  TIME SERIES REGRESSOR
                </span>
              </div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '38px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '4px' }}>
                TIME FORECAST MODEL
              </h2>
              <p style={{ fontSize: '14px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                HistGradientBoosting Regressor · v1.0
              </p>

              {/* Explicit Model Telemetry Inputs */}
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Task Velocity ({defaultInput.task_progress})
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Machinery ({defaultInput.machinery_status === 1 ? 'ACTIVE' : 'IDLE'})
                </span>
              </div>
            </div>

            {/* Model Output Prediction */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '50px', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '4px' }}>
                {timeDev > 0 ? `+${timeDev.toFixed(1)} DAYS` : `${timeDev.toFixed(1)} DAYS`}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                SCHEDULE: {timeStatus}
              </div>
            </div>
          </div>
        </div>

        {/* MODEL 05: OPTIMIZATION RECOMMENDATION MODEL (CREAM #F5F3E3) */}
        <div
          className="card-rotate-neg07 card-hover-lift"
          style={{
            backgroundColor: '#F5F3E3',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '32px 44px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            marginTop: '-18px',
            zIndex: 1
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>05</span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                  OPTIMIZATION ENGINE
                </span>
              </div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '38px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '4px' }}>
                OPTIMIZATION RECOMMENDATION MODEL
              </h2>
              <p style={{ fontSize: '14px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                HistGradientBoosting Classifier · v1.0
              </p>

              {/* Explicit Model Telemetry Inputs */}
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Multi-model outputs & Risk
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '4px 10px', borderRadius: '4px' }}>
                  INPUT: Equipment utilization ({defaultInput.equipment_utilization_rate}%)
                </span>
              </div>
            </div>

            {/* Model Output Prediction */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '36px', fontWeight: '800', color: '#111111', lineHeight: '1.0', marginTop: '4px' }}>
                {optRec}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                CONFIDENCE: {optConf.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Downstream Gemini 2.5 Flash AI Explanation Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px dashed #111111',
        borderRadius: '16px',
        padding: '32px 40px',
        marginBottom: '40px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#FF2AA1" />
            <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111111', textTransform: 'uppercase' }}>
              AI INSIGHT (GEMINI 2.5 FLASH)
            </span>
          </div>
          <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
            GROUNDED
          </span>
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', color: '#111111', lineHeight: '1.6', fontWeight: '500', marginBottom: '20px' }}>
          "{geminiText}"
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#FF2AA1', color: '#FFFFFF', padding: '4px 12px', borderRadius: '4px' }}>
            PRIORITY: HIGH
          </span>
          <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#666666' }}>
            Grounded in: 5 ML Models · SciPy Space Engine · Alert Engine
          </span>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', borderTop: '2px dashed #111111', paddingTop: '28px' }}>
        <Link
          to="/predictions"
          style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '24px',
            color: '#111111',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            letterSpacing: '0.04em'
          }}
        >
          VIEW PREDICTIONS <ArrowRight size={24} color="#FF2AA1" />
        </Link>

        <Link
          to="/space-optimization"
          style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '24px',
            color: '#111111',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            letterSpacing: '0.04em'
          }}
        >
          OPTIMIZE SPACE <ArrowRight size={24} color="#FF2AA1" />
        </Link>

        <Link
          to="/alerts"
          style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '24px',
            color: '#111111',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            letterSpacing: '0.04em'
          }}
        >
          OPEN ALERTS <ArrowRight size={24} color="#FF2AA1" />
        </Link>
      </div>
    </div>
  );
};
