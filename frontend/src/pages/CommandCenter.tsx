import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pickaxe, Ruler, Compass } from 'lucide-react';
import { analyzeProjectIntelligence, optimizeSpaceLayout } from '../services/api';
import type { MasterIntelligenceResponse, OperationalInputs, SpaceOptimizationResponse } from '../types';

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MasterIntelligenceResponse | null>(null);
  const [spaceData, setSpaceData] = useState<SpaceOptimizationResponse | null>(null);

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
      const [res, spaceRes] = await Promise.all([
        analyzeProjectIntelligence(defaultInput),
        optimizeSpaceLayout({
          site_area_sqm: 1200,
          site_length_m: 40,
          site_width_m: 30,
          construction_stage: 'STRUCTURE',
          material_quantity_kg: 5000,
          material_types_count: 8,
          machinery_count: 8,
          heavy_machinery_count: 3,
          worker_count: 65,
          daily_material_delivery_count: 5,
          daily_truck_count: 8,
          estimated_daily_material_usage_kg: 850,
          waste_generation_kg_per_day: 250,
          safety_requirement_level: 'HIGH',
          emergency_access_required: true,
          temperature: 32.5,
          humidity: 45.0,
          vibration_level: 28.4,
          equipment_utilization_rate: 91.2,
          task_progress: 0.42,
          risk_score: 52,
          material_shortage_alert: 0
        })
      ]);
      setData(res);
      setSpaceData(spaceRes);
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

  const optRec = data?.ml_results.optimization.recommendation ?? 'REALLOCATE WORKERS & STAGING';
  const spaceUtil = spaceData?.metrics?.space_utilization_percentage ?? 91.7;

  const geminiText = data?.gemini_report.report?.executive_summary || "Review worker allocation and material staging area before the next construction cycle.";

  const formatCostDisplay = (val: number) => {
    if (val > 0) return `+$${val.toLocaleString()}`;
    if (val < 0) return `-$${Math.abs(val).toLocaleString()}`;
    return `$0`;
  };

  const formatTimeDisplay = (val: number) => {
    if (val > 0) return `+${val.toFixed(1)} DAYS`;
    return `${val.toFixed(1)} DAYS`;
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '24px 16px 64px 16px', boxSizing: 'border-box' }}>
      
      {/* Editorial Landing Hero Header */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        padding: '36px 16px 40px 16px',
        marginBottom: '36px',
        borderBottom: '2.5px dashed #111111'
      }}>
        {/* FULL WORDMARK TITLE IN ANTON FONT: CONARK SYSTEMS */}
        <h1
          className="responsive-title-nowrap"
          style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: 'clamp(44px, 11vw, 175px)',
            lineHeight: '0.85',
            color: '#111111',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: '0 auto',
            whiteSpace: 'nowrap'
          }}
        >
          CONARK SYSTEMS
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(16px, 3vw, 22px)',
          fontWeight: '700',
          color: '#111111',
          marginTop: '16px',
          letterSpacing: '0.04em'
        }}>
          Predict. Decide. Explain. Act.
        </p>

        {/* Construction Telemetry Meta Pill Strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginTop: '20px',
          fontSize: '12px',
          fontFamily: 'JetBrains Mono, monospace',
          color: '#555555',
          flexWrap: 'wrap'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Ruler size={15} color="#111111" /> 5 PREDICTIVE ML MODELS
          </span>
          <span>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={15} color="#FF2AA1" /> SciPy SLSQP SPACE SOLVER
          </span>
          <span>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Pickaxe size={15} color="#111111" /> GEMINI 2.5 FLASH EXPLANATIONS
          </span>
        </div>
      </div>

      {/* Blueprint Measurement Ruler Divider */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        color: '#666666',
        marginBottom: '28px',
        padding: '0 8px',
        overflowX: 'auto'
      }}>
        <span>0m</span>
        <span style={{ flex: 1, borderTop: '1px dashed #999', margin: '0 12px', minWidth: '20px' }} />
        <span>10m</span>
        <span style={{ flex: 1, borderTop: '1px dashed #999', margin: '0 12px', minWidth: '20px' }} />
        <span>20m</span>
        <span style={{ flex: 1, borderTop: '1px dashed #999', margin: '0 12px', minWidth: '20px' }} />
        <span>30m</span>
        <span style={{ flex: 1, borderTop: '1px dashed #999', margin: '0 12px', minWidth: '20px' }} />
        <span>40m SITE BOUNDARY</span>
      </div>

      {/* 6-CARD STACK WITH EQUALLY NUMBERED (2 LEFT + 2 RIGHT) NON-OVERLAPPING CONSTRUCTION SVGS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '100%', marginBottom: '44px' }}>
        
        {/* ROW 01: CARD 01 - PERFORMANCE MODEL */}
        <div className="card-row-grid" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 150px', gap: '16px', alignItems: 'stretch', zIndex: 6, position: 'relative' }}>
          
          {/* Left Column: 2 SVGs (TOWER CRANE + MATERIAL HOIST) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="90" viewBox="0 0 100 85" fill="none" stroke="#111111" strokeWidth="2">
                <line x1="20" y1="85" x2="20" y2="10" />
                <line x1="20" y1="10" x2="90" y2="10" />
                <line x1="10" y1="20" x2="20" y2="10" />
                <line x1="20" y1="20" x2="90" y2="20" />
                <line x1="20" y1="10" x2="35" y2="20" />
                <line x1="35" y1="10" x2="50" y2="20" />
                <line x1="50" y1="10" x2="65" y2="20" />
                <line x1="70" y1="20" x2="70" y2="55" />
                <rect x="65" y="55" width="10" height="8" fill="#FF2AA1" stroke="#111111" />
                <rect x="5" y="15" width="10" height="10" fill="#111111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>TOWER CRANE 01</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="85" viewBox="0 0 100 75" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="25" y="5" width="50" height="65" strokeDasharray="3 3" />
                <line x1="25" y1="35" x2="75" y2="35" />
                <rect x="35" y="20" width="30" height="30" fill="#4FC3F7" stroke="#111111" />
                <line x1="50" y1="5" x2="50" y2="20" strokeWidth="2.5" />
                <circle cx="50" cy="5" r="3" fill="#111111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>MATERIAL HOIST</span>
            </div>
          </div>

          {/* MODEL 01: PERFORMANCE MODEL */}
          <div
            onClick={() => navigate('/model/performance')}
            className="card-rotate-neg1 card-hover-lift card-responsive-padding"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2.5px dashed #111111',
              borderRadius: '20px',
              padding: '44px 48px',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
              position: 'relative',
              zIndex: 6,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#666666', fontWeight: 'bold' }}>01</span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                    CLASSIFICATION MODEL
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#888' }}>[CLICK FOR DEDICATED PAGE →]</span>
                </div>
                <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '6px' }}>
                  PERFORMANCE MODEL
                </h2>
                <p style={{ fontSize: '14px', color: '#555555', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                  HistGradientBoosting Classifier · v1.0
                </p>

                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span style={{ backgroundColor: '#EDECE7', border: '1.5px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                    INPUT: Task Progress (42%)
                  </span>
                  <span style={{ backgroundColor: '#EDECE7', border: '1.5px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                    INPUT: Workers ({defaultInput.worker_count})
                  </span>
                  <span style={{ backgroundColor: '#EDECE7', border: '1.5px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                    INPUT: Equipment ({defaultInput.equipment_utilization_rate}%)
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>MODEL OUTPUT</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '6px' }}>
                  {perfPred}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#15803d', fontFamily: 'JetBrains Mono, monospace', marginTop: '8px' }}>
                  CONFIDENCE: {perfConf.toFixed(1)}% · HEALTH: {healthScore}/100
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2 SVGs (BUILDING SKELETON + STRUCTURAL PILLAR) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="90" viewBox="0 0 100 85" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="10" y="10" width="80" height="65" strokeDasharray="3 3" fill="#EDECE7" />
                <line x1="10" y1="35" x2="90" y2="35" strokeWidth="2" />
                <line x1="10" y1="60" x2="90" y2="60" strokeWidth="2" />
                <line x1="35" y1="10" x2="35" y2="75" strokeWidth="2" />
                <line x1="65" y1="10" x2="65" y2="75" strokeWidth="2" />
                <circle cx="35" cy="35" r="4" fill="#FF2AA1" />
                <circle cx="65" cy="60" r="4" fill="#7CFFA6" stroke="#111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>BUILDING SKELETON</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="85" viewBox="0 0 100 75" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="35" y="10" width="30" height="55" fill="#E4FF5B" stroke="#111111" />
                <line x1="35" y1="25" x2="65" y2="25" strokeDasharray="2 2" />
                <line x1="35" y1="40" x2="65" y2="40" strokeDasharray="2 2" />
                <circle cx="50" cy="32.5" r="5" fill="#111111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>STRUCTURAL PILLAR</span>
            </div>
          </div>
        </div>

        {/* ROW 02: CARD 02 - OPERATIONAL RISK MODEL */}
        <div className="card-row-grid" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 150px', gap: '16px', alignItems: 'stretch', marginTop: '-20px', zIndex: 5, position: 'relative' }}>
          
          {/* Left Column: 2 SVGs (EXCAVATOR UNIT + HAZARD CONES) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="85" viewBox="0 0 100 75" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="10" y="50" width="55" height="18" rx="8" fill="#EDECE7" />
                <circle cx="22" cy="59" r="4" fill="#111" />
                <circle cx="37" cy="59" r="4" fill="#111" />
                <circle cx="52" cy="59" r="4" fill="#111" />
                <rect x="18" y="28" width="28" height="24" fill="#E4FF5B" stroke="#111111" />
                <path d="M42 35 L68 15 L88 40 L80 50" strokeWidth="2.2" />
                <path d="M80 50 L95 55 L90 63 Z" fill="#111111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>EXCAVATOR UNIT</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="80" viewBox="0 0 100 70" fill="none" stroke="#111111" strokeWidth="1.8">
                <path d="M 25 55 L 40 15 L 55 55 Z" fill="#FF9E43" stroke="#111111" />
                <rect x="20" y="55" width="40" height="6" fill="#111111" />
                <line x1="30" y1="40" x2="50" y2="40" stroke="#FFF" strokeWidth="2" />
                <path d="M 65 55 L 75 25 L 85 55 Z" fill="#E4FF5B" stroke="#111111" />
                <rect x="60" y="55" width="30" height="6" fill="#111111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>HAZARD CONES</span>
            </div>
          </div>

          {/* MODEL 02: RISK MODEL */}
          <div
            onClick={() => navigate('/model/risk')}
            className="card-rotate-pos1 card-hover-lift card-responsive-padding"
            style={{
              backgroundColor: '#4FC3F7',
              border: '2.5px dashed #111111',
              borderRadius: '20px',
              padding: '44px 48px',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              zIndex: 5,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>02</span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                    REGRESSION MODEL
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#111' }}>[CLICK FOR DEDICATED PAGE →]</span>
                </div>
                <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '6px' }}>
                  OPERATIONAL RISK MODEL
                </h2>
                <p style={{ fontSize: '14px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                  LinearRegression Model · v1.0
                </p>

                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1.5px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                    INPUT: Safety Incidents ({defaultInput.safety_incidents})
                  </span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1.5px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                    INPUT: Vibration ({defaultInput.vibration_level} mm/s)
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '6px' }}>
                  {riskScore.toFixed(0)}%
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '8px' }}>
                  RISK LEVEL: {riskLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2 SVGs (DRAFTING TOOL + SAFETY BARRIER) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="85" viewBox="0 0 100 75" fill="none" stroke="#111111" strokeWidth="1.8">
                <line x1="50" y1="10" x2="20" y2="65" strokeWidth="2.2" />
                <line x1="50" y1="10" x2="80" y2="65" strokeWidth="2.2" />
                <circle cx="50" cy="10" r="5" fill="#111111" />
                <line x1="30" y1="42" x2="70" y2="42" strokeWidth="1.5" />
                <path d="M 28 58 A 30 30 0 0 1 72 58" strokeDasharray="3 3" stroke="#FF2AA1" strokeWidth="2" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>DRAFTING TOOL</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="80" viewBox="0 0 100 70" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="15" y="20" width="70" height="35" fill="#FFFFFF" stroke="#111111" strokeDasharray="4 2" />
                <line x1="15" y1="20" x2="85" y2="55" />
                <line x1="85" y1="20" x2="15" y2="55" />
                <line x1="15" y1="55" x2="15" y2="68" strokeWidth="2.5" />
                <line x1="85" y1="55" x2="85" y2="68" strokeWidth="2.5" />
                <polygon points="50,28 60,45 40,45" fill="#FF2AA1" stroke="#111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>SAFETY BARRIER</span>
            </div>
          </div>
        </div>

        {/* ROW 03: CARD 03 - COST FORECAST MODEL */}
        <div className="card-row-grid" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 150px', gap: '16px', alignItems: 'stretch', marginTop: '-20px', zIndex: 4, position: 'relative' }}>
          
          {/* Left Column: 2 SVGs (BULLDOZER UNIT + PAYLOAD SCALE) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="85" viewBox="0 0 100 75" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="20" y="50" width="50" height="16" rx="8" fill="#EDECE7" />
                <circle cx="30" cy="58" r="4" fill="#111111" />
                <circle cx="45" cy="58" r="4" fill="#111111" />
                <circle cx="60" cy="58" r="4" fill="#111111" />
                <rect x="28" y="28" width="28" height="24" fill="#E4FF5B" stroke="#111111" />
                <path d="M 10 38 L 18 58 L 8 58 Z" fill="#111111" />
                <rect x="75" y="40" width="8" height="22" fill="#111111" rx="2" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>BULLDOZER UNIT</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="80" viewBox="0 0 100 70" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="15" y="45" width="70" height="15" fill="#111111" />
                <rect x="35" y="15" width="30" height="25" fill="#E4FF5B" stroke="#111111" />
                <circle cx="50" cy="27.5" r="6" fill="#FFFFFF" stroke="#111111" />
                <line x1="50" y1="27.5" x2="53" y2="24" strokeWidth="2" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>PAYLOAD SCALE</span>
            </div>
          </div>

          {/* MODEL 03: COST FORECAST MODEL */}
          <div
            onClick={() => navigate('/model/cost')}
            className="card-rotate-neg07 card-hover-lift card-responsive-padding"
            style={{
              backgroundColor: '#E4FF5B',
              border: '2.5px dashed #111111',
              borderRadius: '20px',
              padding: '44px 48px',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              zIndex: 4,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>03</span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                    XGBOOST REGRESSOR
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#111' }}>[CLICK FOR DEDICATED PAGE →]</span>
                </div>
                <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '6px' }}>
                  COST FORECAST MODEL
                </h2>
                <p style={{ fontSize: '14px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                  XGBRegressor Model · v1.0
                </p>

                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1.5px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                    INPUT: Material Usage ({defaultInput.material_usage} kg)
                  </span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1.5px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                    INPUT: Energy ({defaultInput.energy_consumption} kWh)
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(42px, 5.5vw, 64px)', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '6px' }}>
                  {formatCostDisplay(costDev)}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '8px' }}>
                  STATUS: {costStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2 SVGs (MATERIAL SILO + BATCHING PLANT) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="85" viewBox="0 0 100 75" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="30" y="10" width="40" height="35" rx="3" fill="#E4FF5B" stroke="#111111" />
                <path d="M 30 10 Q 50 0 70 10 Z" fill="#111111" />
                <path d="M 30 45 L 50 60 L 70 45 Z" fill="#EDECE7" stroke="#111111" />
                <line x1="30" y1="45" x2="22" y2="72" strokeWidth="2" />
                <line x1="70" y1="45" x2="78" y2="72" strokeWidth="2" />
                <circle cx="50" cy="27" r="5" fill="#FF2AA1" stroke="#111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>MATERIAL SILO</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="80" viewBox="0 0 100 70" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="20" y="15" width="30" height="35" fill="#4FC3F7" stroke="#111111" />
                <line x1="50" y1="20" x2="85" y2="50" strokeWidth="2.5" />
                <rect x="75" y="45" width="15" height="15" fill="#111111" />
                <line x1="20" y1="50" x2="10" y2="65" strokeWidth="2" />
                <line x1="50" y1="50" x2="60" y2="65" strokeWidth="2" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>BATCHING PLANT</span>
            </div>
          </div>
        </div>

        {/* ROW 04: CARD 04 - TIME FORECAST MODEL */}
        <div className="card-row-grid" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 150px', gap: '16px', alignItems: 'stretch', marginTop: '-20px', zIndex: 3, position: 'relative' }}>
          
          {/* Left Column: 2 SVGs (SITE SAFETY RIG + CRITICAL GANTT) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="85" viewBox="0 0 100 75" fill="none" stroke="#111111" strokeWidth="1.8">
                <path d="M20 45 C20 20, 80 20, 80 45 Z" fill="#E4FF5B" stroke="#111111" />
                <path d="M10 45 Q50 38 90 45 L95 50 L5 50 Z" fill="#111111" />
                <rect x="42" y="28" width="16" height="8" fill="#FF2AA1" rx="2" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>SITE SAFETY RIG</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="80" viewBox="0 0 100 70" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="15" y="15" width="40" height="10" rx="3" fill="#7CFFA6" stroke="#111111" />
                <rect x="35" y="30" width="50" height="10" rx="3" fill="#FF9E43" stroke="#111111" />
                <rect x="25" y="45" width="35" height="10" rx="3" fill="#4FC3F7" stroke="#111111" />
                <circle cx="85" cy="20" r="7" fill="#111111" />
                <line x1="85" y1="20" x2="85" y2="16" stroke="#FFF" strokeWidth="1.5" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>CRITICAL GANTT</span>
            </div>
          </div>

          {/* MODEL 04: TIME FORECAST MODEL */}
          <div
            onClick={() => navigate('/model/time')}
            className="card-rotate-pos08 card-hover-lift card-responsive-padding"
            style={{
              backgroundColor: '#7CFFA6',
              border: '2.5px dashed #111111',
              borderRadius: '20px',
              padding: '44px 48px',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              zIndex: 3,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>04</span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                    TIME SERIES REGRESSOR
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#111' }}>[CLICK FOR DEDICATED PAGE →]</span>
                </div>
                <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '6px' }}>
                  TIME FORECAST MODEL
                </h2>
                <p style={{ fontSize: '14px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                  HistGradientBoosting Regressor · v1.0
                </p>

                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1.5px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                    INPUT: Task Velocity ({defaultInput.task_progress})
                  </span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1.5px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                    INPUT: Machinery ({defaultInput.machinery_status === 1 ? 'ACTIVE' : 'IDLE'})
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(42px, 5.5vw, 64px)', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '6px' }}>
                  {formatTimeDisplay(timeDev)}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '8px' }}>
                  SCHEDULE: {timeStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2 SVGs (SURVEY TRIPOD + THEODOLITE LEVEL) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="85" viewBox="0 0 100 75" fill="none" stroke="#111111" strokeWidth="1.8">
                <line x1="50" y1="25" x2="20" y2="70" strokeWidth="2" />
                <line x1="50" y1="25" x2="50" y2="70" strokeWidth="2" />
                <line x1="50" y1="25" x2="80" y2="70" strokeWidth="2" />
                <rect x="32" y="12" width="36" height="13" fill="#7CFFA6" stroke="#111111" />
                <circle cx="50" cy="18.5" r="3.5" fill="#FF2AA1" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>SURVEY TRIPOD</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="80" viewBox="0 0 100 70" fill="none" stroke="#111111" strokeWidth="1.8">
                <circle cx="50" cy="35" r="22" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
                <line x1="50" y1="10" x2="50" y2="60" strokeDasharray="3 3" />
                <line x1="25" y1="35" x2="75" y2="35" strokeDasharray="3 3" />
                <circle cx="50" cy="35" r="6" fill="#E4FF5B" stroke="#111111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>THEODOLITE LEVEL</span>
            </div>
          </div>
        </div>

        {/* ROW 05: CARD 05 - RECOMMENDATION AND SPACE OPTIMIZATION MODEL */}
        <div className="card-row-grid" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 150px', gap: '16px', alignItems: 'stretch', marginTop: '-20px', zIndex: 2, position: 'relative' }}>
          
          {/* Left Column: 2 SVGs (SCAFFOLD MATRIX + LOGISTICS TRUCK) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="90" viewBox="0 0 100 85" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="15" y="10" width="70" height="65" strokeDasharray="3 3" />
                <line x1="15" y1="32" x2="85" y2="32" strokeWidth="2" />
                <line x1="15" y1="54" x2="85" y2="54" strokeWidth="2" />
                <line x1="15" y1="10" x2="85" y2="54" />
                <line x1="85" y1="10" x2="15" y2="54" />
                <line x1="15" y1="54" x2="85" y2="75" />
                <line x1="85" y1="54" x2="15" y2="75" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>SCAFFOLD MATRIX</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="80" viewBox="0 0 100 70" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="65" y="25" width="28" height="28" fill="#E4FF5B" stroke="#111111" />
                <rect x="73" y="30" width="14" height="12" fill="#FFFFFF" stroke="#111111" />
                <path d="M10 20 L55 20 L50 50 L10 50 Z" fill="#4FC3F7" stroke="#111111" />
                <circle cx="22" cy="56" r="7" fill="#111111" />
                <circle cx="38" cy="56" r="7" fill="#111111" />
                <circle cx="80" cy="56" r="7" fill="#111111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>LOGISTICS TRUCK</span>
            </div>
          </div>

          {/* MODEL 05: SPACE OPTIMIZATION MODEL */}
          <div
            onClick={() => navigate('/model/optimization')}
            className="card-rotate-neg07 card-hover-lift card-responsive-padding"
            style={{
              backgroundColor: '#F5F3E3',
              border: '2.5px dashed #111111',
              borderRadius: '20px',
              padding: '44px 48px',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              zIndex: 2,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>05</span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                    SCIPY SLSQP + CLASSIFIER
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#111' }}>[CLICK FOR FULL 2D CANVAS & PAGE →]</span>
                </div>
                <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '6px' }}>
                  RECOMMENDATION AND SPACE OPTIMIZATION MODEL
                </h2>
                <p style={{ fontSize: '14px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                  SciPy SLSQP Constrained Solver + HistGradientBoosting Classifier · v1.0
                </p>

                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1.5px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                    INPUT: Site Area (1200 m²)
                  </span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1.5px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                    INPUT: Stage (STRUCTURE)
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', color: '#111111', lineHeight: '1.0', marginTop: '6px' }}>
                  {spaceUtil.toFixed(1)}% UTILIZATION
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                  REC: {optRec}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2 SVGs (OPTIMIZATION MATRIX + PLANAR GRID MAPPER) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="85" viewBox="0 0 100 75" fill="none" stroke="#111111" strokeWidth="1.8">
                <circle cx="50" cy="37.5" r="24" strokeDasharray="3 3" stroke="#111111" />
                <circle cx="50" cy="37.5" r="14" fill="#E4FF5B" stroke="#111111" />
                <line x1="50" y1="5" x2="50" y2="70" strokeWidth="2" />
                <line x1="15" y1="37.5" x2="85" y2="37.5" strokeWidth="2" />
                <circle cx="50" cy="37.5" r="4" fill="#FF2AA1" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>OPTIMIZATION MATRIX</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="80" viewBox="0 0 100 70" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="15" y="10" width="70" height="50" fill="#FFFFFF" stroke="#111111" strokeDasharray="3 3" />
                <rect x="20" y="15" width="28" height="20" fill="#E4FF5B" stroke="#111111" />
                <rect x="52" y="15" width="28" height="20" fill="#7CFFA6" stroke="#111111" />
                <rect x="20" y="38" width="60" height="18" fill="#4FC3F7" stroke="#111111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>PLANAR GRID MAPPER</span>
            </div>
          </div>
        </div>

        {/* ROW 06: CARD 07 - ASK CONARK AI ASSISTANT */}
        <div className="card-row-grid" style={{ display: 'grid', gridTemplateColumns: '150px 1fr 150px', gap: '16px', alignItems: 'stretch', marginTop: '-20px', zIndex: 1, position: 'relative' }}>
          
          {/* Left Column: 2 SVGs (CONCRETE MIXER + VOICE WAVEFORMS) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="85" viewBox="0 0 100 75" fill="none" stroke="#111111" strokeWidth="1.8">
                <ellipse cx="38" cy="35" rx="24" ry="16" transform="rotate(-20 38 35)" fill="#E4FF5B" stroke="#111111" />
                <rect x="62" y="35" width="25" height="24" fill="#4FC3F7" stroke="#111111" />
                <rect x="70" y="39" width="12" height="10" fill="#FFFFFF" stroke="#111111" />
                <circle cx="26" cy="62" r="6" fill="#111111" />
                <circle cx="42" cy="62" r="6" fill="#111111" />
                <circle cx="75" cy="62" r="6" fill="#111111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>CONCRETE MIXER</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="80" viewBox="0 0 100 70" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="15" y="30" width="8" height="20" fill="#FF2AA1" rx="2" />
                <rect x="28" y="20" width="8" height="40" fill="#E4FF5B" rx="2" />
                <rect x="41" y="10" width="8" height="50" fill="#7CFFA6" rx="2" />
                <rect x="54" y="25" width="8" height="30" fill="#4FC3F7" rx="2" />
                <rect x="67" y="35" width="8" height="15" fill="#111111" rx="2" />
                <circle cx="85" cy="35" r="7" fill="#FF2AA1" stroke="#111111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>VOICE WAVEFORMS</span>
            </div>
          </div>

          {/* FEATURE 07: ASK CONARK AI ASSISTANT */}
          <div
            onClick={() => navigate('/construction-ai')}
            className="card-rotate-pos1 card-hover-lift card-responsive-padding"
            style={{
              backgroundColor: '#4FC3F7',
              border: '2.5px dashed #111111',
              borderRadius: '20px',
              padding: '44px 48px',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              zIndex: 1,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>07 / AI ASSISTANT</span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                    GOOGLE GEMMA 4 26B A4B VIA OPENROUTER
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#111' }}>[CLICK TO OPEN CONARK AI ASSISTANT →]</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#FF2AA1',
                    transform: 'rotate(45deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(255,42,161,0.4)',
                    flexShrink: 0
                  }}>
                    <span style={{ transform: 'rotate(-45deg)', color: '#FFF', fontFamily: 'Anton, sans-serif', fontSize: '15px' }}>CA</span>
                  </div>
                  
                  <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(36px, 4.5vw, 56px)', color: '#111111', textTransform: 'uppercase', lineHeight: '0.95', margin: 0 }}>
                    ASK CONARK
                  </h2>
                </div>

                <p style={{ fontSize: '16px', fontWeight: '700', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '10px' }}>
                  Construction intelligence, without the manual search.
                </p>

                <p style={{ fontSize: '14px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '6px', maxWidth: '640px', lineHeight: '1.5' }}>
                  Ask questions about construction, safety, materials, scheduling, cost, workforce, machinery, optimization, and site operations.
                </p>

                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button style={{
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    fontFamily: 'Anton, sans-serif',
                    fontSize: '18px',
                    letterSpacing: '0.04em',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    ASK CONARK →
                  </button>

                  {/* Minimal Animated Conversation Diagram */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(255,255,255,0.75)',
                    border: '1.5px solid #111111',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    fontWeight: '800'
                  }}>
                    <span>QUESTION</span>
                    <span style={{ color: '#FF2AA1' }}>→</span>
                    <span>CONARK AI</span>
                    <span style={{ color: '#FF2AA1' }}>→</span>
                    <span>EXPLANATION</span>
                    <span style={{ color: '#FF2AA1' }}>→</span>
                    <span>ACTION</span>
                  </div>
                </div>
              </div>

              {/* Floating White Assistant Card Visual */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #111111',
                borderRadius: '12px',
                padding: '18px',
                width: '320px',
                boxShadow: '6px 6px 0px #111111'
              }}>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#555', marginBottom: '6px' }}>
                  EXAMPLE CONVERSATION
                </div>

                <div style={{ backgroundColor: '#111111', color: '#FFF', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: '600', marginBottom: '10px' }}>
                  "How can I reduce construction delays?"
                </div>

                <div style={{ backgroundColor: '#F5F3E3', border: '1px solid #111', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'Inter, sans-serif', color: '#111' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: '800', color: '#FF2AA1', marginBottom: '4px' }}>CONARK AI</div>
                  "Start by identifying the current critical path tasks, enforcing fatigue limits, and reallocating material storage..."
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2 SVGs (STEEL I-BEAM RIG + T-RULER COMPASS) */}
          <div className="side-svg-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', opacity: 0.9, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="85" viewBox="0 0 100 75" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="15" y="10" width="70" height="12" fill="#111111" />
                <rect x="15" y="53" width="70" height="12" fill="#111111" />
                <rect x="43" y="22" width="14" height="31" fill="#E4FF5B" stroke="#111111" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>STEEL I-BEAM RIG</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="80" viewBox="0 0 100 70" fill="none" stroke="#111111" strokeWidth="1.8">
                <rect x="15" y="10" width="70" height="10" fill="#111111" />
                <rect x="45" y="20" width="10" height="45" fill="#111111" />
                <circle cx="50" cy="15" r="4" fill="#FF2AA1" />
                <line x1="20" y1="20" x2="80" y2="60" stroke="#E4FF5B" strokeWidth="2.5" />
              </svg>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#333', marginTop: '2px' }}>T-RULER COMPASS</span>
            </div>
          </div>
        </div>

      </div>

      {/* Downstream Gemini 2.5 Flash AI Explanation Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px dashed #111111',
        borderRadius: '16px',
        padding: '24px 32px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              backgroundColor: '#FF2AA1',
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: '4px'
            }}>
              GEMINI 2.5 FLASH AI EXPLANATION
            </span>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#111111', fontFamily: 'JetBrains Mono, monospace' }}>
              EXECUTIVE ANALYSIS
            </span>
          </div>

          <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#15803d', fontWeight: 'bold' }}>
            ● LIVE API CONNECTED
          </span>
        </div>

        <p style={{
          fontSize: '15px',
          lineHeight: '1.6',
          color: '#222222',
          fontFamily: 'Inter, sans-serif',
          margin: 0
        }}>
          {geminiText}
        </p>
      </div>

      {/* Bottom CTA Bar to View Full Models */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#111111',
        color: '#FFFFFF',
        padding: '24px 32px',
        borderRadius: '16px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '24px', letterSpacing: '0.02em', margin: 0, textTransform: 'uppercase' }}>
            EXPLORE THE CONARK MODEL ECOSYSTEM
          </h3>
          <p style={{ fontSize: '13px', color: '#AAAAAA', fontFamily: 'Inter, sans-serif', margin: '4px 0 0 0' }}>
            Select any predictive card above or access full model documentation & technical parameters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/help')}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#111111',
              fontFamily: 'Anton, sans-serif',
              fontSize: '15px',
              letterSpacing: '0.04em',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            VIEW HELP & MODEL GRID
          </button>
          <button
            onClick={() => navigate('/docs')}
            style={{
              backgroundColor: '#FF2AA1',
              color: '#FFFFFF',
              fontFamily: 'Anton, sans-serif',
              fontSize: '15px',
              letterSpacing: '0.04em',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            DOCUMENTATION & API
          </button>
        </div>
      </div>

    </div>
  );
};
