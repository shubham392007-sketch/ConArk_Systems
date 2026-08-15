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

  const healthScore = data?.health.overall_health_score ?? 74;
  const healthStatus = data?.health.health_status ?? 'GOOD';
  const riskScore = data?.ml_results.risk.risk_score ?? 72;
  const riskLevel = data?.ml_results.risk.risk_level ?? 'HIGH';
  const costDev = data?.ml_results.cost_forecast.predicted_cost_deviation ?? 8420;
  const timeDev = data?.ml_results.time_forecast.predicted_time_deviation_days ?? 4.8;
  const alertCount = data?.alerts.length ?? 3;
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

      {/* Primary Stacked Card Deck — Enlarged Cards with Consistent Dashed Borders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', marginBottom: '40px' }}>
        
        {/* CARD 01: WHITE - PROJECT HEALTH */}
        <div
          className="card-rotate-neg1 card-hover-lift"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '36px 48px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            zIndex: 4,
            minHeight: '180px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: '#666666', fontWeight: 'bold' }}>01</span>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '42px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '4px' }}>
                PROJECT HEALTH
              </h2>
              <p style={{ fontSize: '15px', color: '#555555', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Current project condition</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '72px', fontWeight: '800', color: '#111111', lineHeight: '0.9' }}>
                {healthScore}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#15803d', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                {healthStatus}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed rgba(17,17,17,0.2)', fontSize: '12px', color: '#777777', fontFamily: 'JetBrains Mono, monospace' }}>
            Health Score Engine · Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* CARD 02: BLUE - RISK */}
        <div
          className="card-rotate-pos1 card-hover-lift"
          style={{
            backgroundColor: '#4FC3F7',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '36px 48px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            marginTop: '-20px',
            zIndex: 3,
            minHeight: '180px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>02</span>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '42px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '4px' }}>
                RISK
              </h2>
              <p style={{ fontSize: '15px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Current operational risk</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {/* Crane Micro-Illustration SVG */}
              <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.6">
                <path d="M4 21h16M7 21V7l10-4M17 3v18M7 11h10M7 16h10" />
              </svg>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '72px', fontWeight: '800', color: '#111111', lineHeight: '0.9' }}>
                  {riskScore.toFixed(0)}%
                </div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                  {riskLevel}
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed rgba(17,17,17,0.25)', fontSize: '12px', color: '#111111', fontFamily: 'JetBrains Mono, monospace' }}>
            Risk Model · LinearRegression v1.0
          </div>
        </div>

        {/* CARD 03: CHARTREUSE - COST & SCHEDULE */}
        <div
          className="card-rotate-neg07 card-hover-lift"
          style={{
            backgroundColor: '#E4FF5B',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '36px 48px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            marginTop: '-20px',
            zIndex: 2,
            minHeight: '180px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>03</span>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '42px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '4px' }}>
                COST & SCHEDULE
              </h2>
              <p style={{ fontSize: '15px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Budget and timeline forecast</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '54px', fontWeight: '800', color: '#111111', lineHeight: '0.9' }}>
                {costDev > 0 ? `+$${costDev.toLocaleString()}` : `-$${Math.abs(costDev).toLocaleString()}`}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '42px', fontWeight: '800', color: '#111111', marginTop: '6px' }}>
                {timeDev > 0 ? `+${timeDev.toFixed(1)} DAYS` : `${timeDev.toFixed(1)} DAYS`}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                OVER BUDGET / DELAYED
              </div>
            </div>
          </div>
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed rgba(17,17,17,0.25)', fontSize: '12px', color: '#111111', fontFamily: 'JetBrains Mono, monospace' }}>
            Cost Forecast + Time Forecast Models
          </div>
        </div>

        {/* CARD 04: MINT - ACTIVE ALERTS */}
        <div
          className="card-rotate-pos08 card-hover-lift"
          style={{
            backgroundColor: '#7CFFA6',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '36px 48px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            marginTop: '-20px',
            zIndex: 1,
            minHeight: '180px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>04</span>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '42px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '4px' }}>
                ACTIVE ALERTS
              </h2>
              <p style={{ fontSize: '15px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Signals that require attention</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {/* Traffic Cone Micro-Illustration SVG */}
              <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.6">
                <path d="M12 2L4 19h16L12 2zM6 15h12M8 10h8" />
              </svg>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '72px', fontWeight: '800', color: '#111111', lineHeight: '0.9' }}>
                  {alertCount < 10 ? `0${alertCount}` : alertCount}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                  ATTENTION
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed rgba(17,17,17,0.25)', fontSize: '12px', color: '#111111', fontFamily: 'JetBrains Mono, monospace' }}>
            Alert Engine · Deterministic Rules
          </div>
        </div>
      </div>

      {/* Downstream Gemini 2.5 Flash AI Explanation Card (Enlarged with dashed border) */}
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
            Grounded in: Optimization Model · Risk Model · Alert Engine
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
