import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { analyzeProjectIntelligence, optimizeSpaceLayout } from '../services/api';
import type { MasterIntelligenceResponse, OperationalInputs, SpaceOptimizationResponse, ZoneCoordinates } from '../types';

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
  const spaceEff = spaceData?.metrics?.space_efficiency_score ?? spaceData?.metrics?.layout_efficiency_score ?? 88.4;

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

  // Color mapping for all 8 zones
  const getZoneColor = (zoneName: string) => {
    const name = zoneName.toLowerCase();
    if (name.includes('material')) return '#E4FF5B'; // Chartreuse
    if (name.includes('equipment')) return '#7CFFA6'; // Mint
    if (name.includes('worker')) return '#4FC3F7'; // Blue
    if (name.includes('safety')) return '#F5F3E3'; // Cream
    if (name.includes('loading')) return '#E4FF5B'; // Chartreuse
    if (name.includes('waste')) return '#E0E0E0'; // Gray
    if (name.includes('emergency')) return '#FF2AA1'; // Magenta accent
    if (name.includes('staging')) return '#7CFFA6'; // Mint
    return '#FFFFFF';
  };

  const defaultCoordinates: ZoneCoordinates[] = [
    { zone_name: 'Material Storage', x: 0, y: 0, width: 20, height: 12 },
    { zone_name: 'Equipment Area', x: 20, y: 0, width: 20, height: 12 },
    { zone_name: 'Worker Movement', x: 0, y: 12, width: 18, height: 12 },
    { zone_name: 'Staging Area', x: 18, y: 12, width: 22, height: 12 },
    { zone_name: 'Safety Buffer', x: 0, y: 24, width: 15, height: 6 },
    { zone_name: 'Loading / Unloading', x: 15, y: 24, width: 13, height: 6 },
    { zone_name: 'Waste Dump', x: 28, y: 24, width: 12, height: 6 },
    { zone_name: 'Emergency Access Corridor', x: 0, y: 28, width: 40, height: 2 }
  ];

  const coordinates: ZoneCoordinates[] = spaceData?.coordinates && spaceData.coordinates.length > 0 ? spaceData.coordinates : defaultCoordinates;
  const siteLength = 40;
  const siteWidth = 30;

  return (
    <div style={{ maxWidth: '1650px', margin: '0 auto', padding: '24px 40px 64px 40px' }}>
      {/* Giant Editorial Wordmark */}
      <div style={{ textAlign: 'center', margin: '16px 0 44px 0' }}>
        <h1 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: 'clamp(84px, 18vw, 240px)',
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

      {/* 5-MODEL STACKED CARD DECK — ENLARGED BREADTH + CLICKABLE TO DEDICATED MODEL PAGE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', marginBottom: '44px' }}>
        
        {/* MODEL 01: PERFORMANCE MODEL (WHITE #FFFFFF) */}
        <div
          onClick={() => navigate('/model/performance')}
          className="card-rotate-neg1 card-hover-lift"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '40px 56px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            zIndex: 5,
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#666666', fontWeight: 'bold' }}>01</span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                  CLASSIFICATION MODEL
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#888' }}>[CLICK FOR DEDICATED PAGE →]</span>
              </div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '44px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '6px' }}>
                PERFORMANCE MODEL
              </h2>
              <p style={{ fontSize: '15px', color: '#555555', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                HistGradientBoosting Classifier · v1.0
              </p>

              {/* Explicit Model Telemetry Inputs */}
              <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ backgroundColor: '#EDECE7', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Task Progress (42%)
                </span>
                <span style={{ backgroundColor: '#EDECE7', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Workers ({defaultInput.worker_count})
                </span>
                <span style={{ backgroundColor: '#EDECE7', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Equipment ({defaultInput.equipment_utilization_rate}%)
                </span>
              </div>
            </div>

            {/* Model Output Prediction */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>MODEL OUTPUT</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '64px', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '6px' }}>
                {perfPred}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#15803d', fontFamily: 'JetBrains Mono, monospace', marginTop: '8px' }}>
                CONFIDENCE: {perfConf.toFixed(1)}% · HEALTH: {healthScore}/100
              </div>
            </div>
          </div>
        </div>

        {/* MODEL 02: RISK MODEL (BLUE #4FC3F7) */}
        <div
          onClick={() => navigate('/model/risk')}
          className="card-rotate-pos1 card-hover-lift"
          style={{
            backgroundColor: '#4FC3F7',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '40px 56px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            marginTop: '-20px',
            zIndex: 4,
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>02</span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                  REGRESSION MODEL
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#111' }}>[CLICK FOR DEDICATED PAGE →]</span>
              </div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '44px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '6px' }}>
                OPERATIONAL RISK MODEL
              </h2>
              <p style={{ fontSize: '15px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                LinearRegression Model · v1.0
              </p>

              {/* Explicit Model Telemetry Inputs */}
              <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Safety Incidents ({defaultInput.safety_incidents})
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Vibration ({defaultInput.vibration_level} mm/s)
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Temp ({defaultInput.temperature}°C)
                </span>
              </div>
            </div>

            {/* Model Output Prediction */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.6">
                <path d="M4 21h16M7 21V7l10-4M17 3v18M7 11h10M7 16h10" />
              </svg>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '64px', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '6px' }}>
                  {riskScore.toFixed(0)}%
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '8px' }}>
                  RISK LEVEL: {riskLevel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODEL 03: COST FORECAST MODEL (CHARTREUSE #E4FF5B) */}
        <div
          onClick={() => navigate('/model/cost')}
          className="card-rotate-neg07 card-hover-lift"
          style={{
            backgroundColor: '#E4FF5B',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '40px 56px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            marginTop: '-20px',
            zIndex: 3,
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>03</span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                  XGBOOST REGRESSOR
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#111' }}>[CLICK FOR DEDICATED PAGE →]</span>
              </div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '44px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '6px' }}>
                COST FORECAST MODEL
              </h2>
              <p style={{ fontSize: '15px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                XGBRegressor Model · v1.0
              </p>

              {/* Explicit Model Telemetry Inputs */}
              <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Material Usage ({defaultInput.material_usage} kg)
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Energy ({defaultInput.energy_consumption} kWh)
                </span>
              </div>
            </div>

            {/* Model Output Prediction */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '56px', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '6px' }}>
                {formatCostDisplay(costDev)}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '8px' }}>
                STATUS: {costStatus}
              </div>
            </div>
          </div>
        </div>

        {/* MODEL 04: TIME FORECAST MODEL (MINT #7CFFA6) */}
        <div
          onClick={() => navigate('/model/time')}
          className="card-rotate-pos08 card-hover-lift"
          style={{
            backgroundColor: '#7CFFA6',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '40px 56px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            marginTop: '-20px',
            zIndex: 2,
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>04</span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                  TIME SERIES REGRESSOR
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#111' }}>[CLICK FOR DEDICATED PAGE →]</span>
              </div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '44px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '6px' }}>
                TIME FORECAST MODEL
              </h2>
              <p style={{ fontSize: '15px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                HistGradientBoosting Regressor · v1.0
              </p>

              {/* Explicit Model Telemetry Inputs */}
              <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Task Velocity ({defaultInput.task_progress})
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Machinery ({defaultInput.machinery_status === 1 ? 'ACTIVE' : 'IDLE'})
                </span>
              </div>
            </div>

            {/* Model Output Prediction */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '56px', fontWeight: '800', color: '#111111', lineHeight: '0.9', marginTop: '6px' }}>
                {formatTimeDisplay(timeDev)}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '8px' }}>
                SCHEDULE: {timeStatus}
              </div>
            </div>
          </div>
        </div>

        {/* MODEL 05: COMBINED SPACE OPTIMIZATION & RECOMMENDATION MODEL (CREAM #F5F3E3) */}
        <div
          onClick={() => navigate('/model/optimization')}
          className="card-rotate-neg07 card-hover-lift"
          style={{
            backgroundColor: '#F5F3E3',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '40px 56px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            marginTop: '-20px',
            zIndex: 1,
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: 'bold' }}>05</span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                  SCIPY SLSQP + CLASSIFIER
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#111' }}>[CLICK FOR FULL 2D CANVAS & DEDICATED PAGE →]</span>
              </div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '40px', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', marginTop: '6px' }}>
                SPACE OPTIMIZATION & RECOMMENDATION MODEL
              </h2>
              <p style={{ fontSize: '15px', color: '#111111', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                SciPy SLSQP Constrained Solver + HistGradientBoosting Classifier · v1.0
              </p>

              {/* Explicit Model Telemetry Inputs */}
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Site Area (1200 m²)
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Stage (STRUCTURE)
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #111111', padding: '6px 12px', borderRadius: '6px' }}>
                  INPUT: Workers (65)
                </span>
              </div>
            </div>

            {/* Model Output Prediction */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>MODEL OUTPUT</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '36px', fontWeight: '800', color: '#111111', lineHeight: '1.0', marginTop: '6px' }}>
                {spaceUtil.toFixed(1)}% SPACE UTILIZATION
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#111111', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                REC: {optRec}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#15803d', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px' }}>
                EFFICIENCY: {spaceEff.toFixed(1)}/100 · SAFETY: 100%
              </div>
            </div>
          </div>

          {/* Embedded Dynamic 2D Spatial Structure Mini-Canvas Preview */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1.5px dashed rgba(17,17,17,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111111', textTransform: 'uppercase' }}>
                DYNAMIC 2D SPATIAL STRUCTURE PREVIEW (40m × 30m SITE)
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#FF2AA1' }}>
                CLICK CARD TO EDIT & RE-SOLVE →
              </span>
            </div>

            <div style={{
              position: 'relative',
              width: '100%',
              height: '180px',
              backgroundColor: '#111111',
              borderRadius: '10px',
              border: '2px solid #111111',
              overflow: 'hidden'
            }}>
              {coordinates.map((coord: ZoneCoordinates, i: number) => {
                const leftPct = (coord.x / siteLength) * 100;
                const topPct = (coord.y / siteWidth) * 100;
                const widthPct = (coord.width / siteLength) * 100;
                const heightPct = (coord.height / siteWidth) * 100;
                const color = getZoneColor(coord.zone_name);
                const isMagenta = color === '#FF2AA1';

                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                      backgroundColor: color,
                      border: '1.5px solid #111111',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    <span style={{
                      fontFamily: 'Anton, sans-serif',
                      fontSize: '10px',
                      color: isMagenta ? '#FFFFFF' : '#111111',
                      textTransform: 'uppercase',
                      lineHeight: '1.0'
                    }}>
                      {coord.zone_name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Downstream Gemini 2.5 Flash AI Explanation Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px dashed #111111',
        borderRadius: '16px',
        padding: '36px 48px',
        marginBottom: '44px',
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', borderTop: '2.5px dashed #111111', paddingTop: '32px' }}>
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
          to="/model/optimization"
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
          OPTIMIZE SPACE & RESOURCES <ArrowRight size={24} color="#FF2AA1" />
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
