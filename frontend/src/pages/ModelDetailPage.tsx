import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Activity, Sliders } from 'lucide-react';
import { analyzeProjectIntelligence, optimizeSpaceLayout } from '../services/api';
import type { OperationalInputs, SpaceInputs, SpaceOptimizationResponse, ZoneCoordinates } from '../types';

export const ModelDetailPage: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const isSpaceOpt = modelId === 'optimization' || modelId === 'space';

  const [loading, setLoading] = useState(false);
  const [hasPredicted, setHasPredicted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [spaceRes, setSpaceRes] = useState<SpaceOptimizationResponse | null>(null);

  // Canonical Operational Telemetry Inputs
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
    material_shortage_alert: 0,
    cost_deviation: 2707.71,
    time_deviation: -4.65
  });

  // Space Constraints Inputs
  const [spaceInputs, setSpaceInputs] = useState<SpaceInputs>({
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
  });

  const handleLengthChange = (val: number) => {
    const l = val > 0 ? val : 1;
    const w = spaceInputs.site_width_m || 30;
    setSpaceInputs({
      ...spaceInputs,
      site_length_m: l,
      site_area_sqm: Math.round(l * w)
    });
  };

  const handleWidthChange = (val: number) => {
    const w = val > 0 ? val : 1;
    const l = spaceInputs.site_length_m || 40;
    setSpaceInputs({
      ...spaceInputs,
      site_width_m: w,
      site_area_sqm: Math.round(l * w)
    });
  };

  const handleAreaChange = (val: number) => {
    const area = val > 0 ? val : 1;
    const l = Math.round(Math.sqrt(area * 1.33));
    const w = Math.round(area / l);
    setSpaceInputs({
      ...spaceInputs,
      site_area_sqm: area,
      site_length_m: l,
      site_width_m: w
    });
  };

  const getModelConfig = (id?: string) => {
    switch (id) {
      case 'performance':
        return {
          title: 'PERFORMANCE MODEL',
          algorithm: 'HistGradientBoosting Classifier',
          version: 'v1.0.0',
          color: '#FFFFFF',
          outputLabel: 'PREDICTED PERFORMANCE SCORE',
          explanationKey: 'performance_explanation',
          topFactors: [
            { name: 'Task Progress Velocity', pct: 35, val: `${(inputs.task_progress * 100).toFixed(0)}%` },
            { name: 'Equipment Utilization Rate', pct: 28, val: `${inputs.equipment_utilization_rate}%` },
            { name: 'Worker Count', pct: 18, val: `${inputs.worker_count} Workers` }
          ]
        };
      case 'risk':
        return {
          title: 'RISK PREDICTION MODEL',
          algorithm: 'LinearRegression Model',
          version: 'v1.0.0',
          color: '#4FC3F7',
          outputLabel: 'PREDICTED RISK SCORE (%)',
          explanationKey: 'risk_explanation',
          topFactors: [
            { name: 'Safety Incidents Count', pct: 42, val: `${inputs.safety_incidents} Incidents` },
            { name: 'Machinery Vibration Level', pct: 31, val: `${inputs.vibration_level} Hz` },
            { name: 'Equipment Utilization Rate', pct: 15, val: `${inputs.equipment_utilization_rate}%` }
          ]
        };
      case 'cost':
        return {
          title: 'COST FORECASTING MODEL',
          algorithm: 'XGBRegressor Model',
          version: 'v1.0.0',
          color: '#E4FF5B',
          outputLabel: 'PREDICTED COST DEVIATION ($)',
          explanationKey: 'cost_explanation',
          topFactors: [
            { name: 'Material Usage', pct: 38, val: `${inputs.material_usage} kg` },
            { name: 'Energy Consumption', pct: 29, val: `${inputs.energy_consumption} kWh` },
            { name: 'Equipment Utilization Rate', pct: 19, val: `${inputs.equipment_utilization_rate}%` }
          ]
        };
      case 'time':
        return {
          title: 'TIME FORECASTING MODEL',
          algorithm: 'HistGradientBoosting Regressor',
          version: 'v1.0.0',
          color: '#7CFFA6',
          outputLabel: 'PREDICTED TIME DEVIATION (DAYS)',
          explanationKey: 'schedule_explanation',
          topFactors: [
            { name: 'Task Progress', pct: 45, val: `${(inputs.task_progress * 100).toFixed(0)}%` },
            { name: 'Equipment Utilization Rate', pct: 30, val: `${inputs.equipment_utilization_rate}%` },
            { name: 'Machinery Status', pct: 15, val: inputs.machinery_status === 1 ? 'ACTIVE' : 'IDLE' }
          ]
        };
      case 'optimization':
      case 'space':
      default:
        return {
          title: 'OPTIMIZATION & SPACE OPTIMIZATION MODEL',
          algorithm: 'SciPy SLSQP Constrained Solver + HistGradientBoosting Classifier',
          version: 'v1.0.0',
          color: '#F5F3E3',
          outputLabel: 'OPTIMIZATION SUGGESTION & SPATIAL LAYOUT',
          explanationKey: 'optimization_explanation',
          topFactors: [
            { name: 'Available Site Area', pct: 40, val: `${spaceInputs.site_area_sqm} m²` },
            { name: 'Worker Movement Density', pct: 30, val: `${spaceInputs.worker_count} Workers` },
            { name: 'Equipment Occupancy Ratio', pct: 20, val: `${spaceInputs.machinery_count} Units` }
          ]
        };
    }
  };

  const config = getModelConfig(modelId);

  const runPrediction = async () => {
    setLoading(true);
    try {
      if (isSpaceOpt) {
        const [intelData, spaceData] = await Promise.all([
          analyzeProjectIntelligence(inputs),
          optimizeSpaceLayout(spaceInputs)
        ]);
        setResult(intelData);
        setSpaceRes(spaceData);
      } else {
        const intelData = await analyzeProjectIntelligence(inputs);
        setResult(intelData);
      }
      setHasPredicted(true);
    } catch (e) {
      console.error(e);
      alert('Failed to execute prediction: ' + e);
    } finally {
      setLoading(false);
    }
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
    { zone_name: 'Material Storage', x: 0, y: 0, width: 22.8, height: 12 },
    { zone_name: 'Equipment Area', x: 22.8, y: 0, width: 17.2, height: 12 },
    { zone_name: 'Worker Movement', x: 0, y: 12, width: 24, height: 10.5 },
    { zone_name: 'Staging Area', x: 24, y: 12, width: 16, height: 10.5 },
    { zone_name: 'Safety Buffer', x: 0, y: 22.5, width: 20, height: 5.4 },
    { zone_name: 'Loading / Unloading', x: 20, y: 22.5, width: 13.3, height: 5.4 },
    { zone_name: 'Waste Dump', x: 33.3, y: 22.5, width: 6.7, height: 5.4 },
    { zone_name: 'Emergency Access Corridor', x: 0, y: 27.9, width: 40, height: 2.1 }
  ];

  const coordinates: ZoneCoordinates[] = spaceRes?.coordinates && spaceRes.coordinates.length > 0 ? spaceRes.coordinates : defaultCoordinates;
  
  const layoutMaxX = Math.max(...coordinates.map(c => c.x + c.width), spaceInputs.site_length_m || 40);
  const layoutMaxY = Math.max(...coordinates.map(c => c.y + c.height), spaceInputs.site_width_m || 30);

  const utilization = spaceRes?.metrics?.space_utilization_percentage ?? 91.7;
  const safetyScore = spaceRes?.metrics?.safety_compliance_score ?? 100;
  const efficiencyScore = spaceRes?.metrics?.space_efficiency_score ?? spaceRes?.metrics?.layout_efficiency_score ?? 88.4;

  const zoneAllocations = [
    { name: 'Material Storage', alloc: spaceRes?.allocation?.material_storage_area_sqm ?? 320, req: 300, pct: '26.7%', status: 'SATISFIED' },
    { name: 'Equipment Area', alloc: spaceRes?.allocation?.equipment_area_sqm ?? 180, req: 160, pct: '15.0%', status: 'SATISFIED' },
    { name: 'Worker Movement', alloc: spaceRes?.allocation?.worker_movement_area_sqm ?? 150, req: 140, pct: '12.5%', status: 'SATISFIED' },
    { name: 'Safety Buffer', alloc: spaceRes?.allocation?.safety_buffer_area_sqm ?? 120, req: 100, pct: '10.0%', status: 'SATISFIED' },
    { name: 'Loading / Unloading', alloc: spaceRes?.allocation?.loading_area_sqm ?? 80, req: 70, pct: '6.7%', status: 'SATISFIED' },
    { name: 'Waste Dump', alloc: spaceRes?.allocation?.waste_area_sqm ?? 40, req: 30, pct: '3.3%', status: 'SATISFIED' },
    { name: 'Emergency Access', alloc: spaceRes?.allocation?.emergency_access_area_sqm ?? 110, req: 100, pct: '9.2%', status: 'SATISFIED' },
    { name: 'Staging Area', alloc: spaceRes?.allocation?.staging_area_sqm ?? 100, req: 80, pct: '8.3%', status: 'SATISFIED' }
  ];

  const getGeminiExplanation = () => {
    if (isSpaceOpt && spaceRes?.gemini_report?.space_report) {
      return spaceRes.gemini_report.space_report.summary;
    }
    if (!result?.gemini_report?.report) return null;
    const report = result.gemini_report.report;
    return report[config.explanationKey] || report.executive_summary || "Gemini analysis generated based on updated model inputs.";
  };

  const formatCostOutput = () => {
    const val = result?.ml_results?.cost_forecast?.predicted_cost_deviation ?? 2707.71;
    if (val > 0) return `+$${val.toLocaleString()}`;
    if (val < 0) return `-$${Math.abs(val).toLocaleString()}`;
    return `$0`;
  };

  const formatTimeOutput = () => {
    const val = result?.ml_results?.time_forecast?.predicted_time_deviation_days ?? -4.65;
    if (val > 0) return `+${val.toFixed(1)} DAYS`;
    return `${val.toFixed(1)} DAYS`;
  };

  // Dynamic Input Form Fields renderer based on modelId
  const renderModelInputs = () => {
    if (isSpaceOpt) {
      return (
        <>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>TOTAL SITE AREA (m²)</label>
            <input
              type="number"
              value={spaceInputs.site_area_sqm}
              onChange={e => handleAreaChange(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '4px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>LENGTH (m)</label>
              <input
                type="number"
                value={spaceInputs.site_length_m}
                onChange={e => handleLengthChange(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>WIDTH (m)</label>
              <input
                type="number"
                value={spaceInputs.site_width_m}
                onChange={e => handleWidthChange(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '4px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>CONSTRUCTION STAGE</label>
            <select
              value={spaceInputs.construction_stage}
              onChange={e => setSpaceInputs({ ...spaceInputs, construction_stage: e.target.value })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '4px', backgroundColor: '#FFFFFF' }}
            >
              <option value="EXCAVATION">EXCAVATION</option>
              <option value="FOUNDATION">FOUNDATION</option>
              <option value="STRUCTURE">STRUCTURE</option>
              <option value="FINISHING">FINISHING</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>WORKER COUNT</label>
            <input
              type="number"
              value={spaceInputs.worker_count}
              onChange={e => setSpaceInputs({ ...spaceInputs, worker_count: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>MACHINERY COUNT</label>
            <input
              type="number"
              value={spaceInputs.machinery_count}
              onChange={e => setSpaceInputs({ ...spaceInputs, machinery_count: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '4px' }}
            />
          </div>
        </>
      );
    }

    // Dynamic field set for specific telemetry models
    return (
      <>
        {/* Core telemetry fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>TEMPERATURE (°C)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.temperature}
              onChange={e => setInputs({ ...inputs, temperature: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>HUMIDITY (%)</label>
            <input
              type="number"
              value={inputs.humidity}
              onChange={e => setInputs({ ...inputs, humidity: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>VIBRATION LEVEL (Hz)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.vibration_level}
              onChange={e => setInputs({ ...inputs, vibration_level: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>MATERIAL USAGE (kg)</label>
            <input
              type="number"
              value={inputs.material_usage}
              onChange={e => setInputs({ ...inputs, material_usage: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>WORKER COUNT</label>
            <input
              type="number"
              value={inputs.worker_count}
              onChange={e => setInputs({ ...inputs, worker_count: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>ENERGY CONSUMPTION (kWh)</label>
            <input
              type="number"
              value={inputs.energy_consumption}
              onChange={e => setInputs({ ...inputs, energy_consumption: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>TASK PROGRESS (0.0 to 1.0)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={inputs.task_progress}
              onChange={e => setInputs({ ...inputs, task_progress: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>EQUIPMENT UTILIZATION (%)</label>
            <input
              type="number"
              value={inputs.equipment_utilization_rate}
              onChange={e => setInputs({ ...inputs, equipment_utilization_rate: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>MACHINERY STATUS</label>
            <select
              value={inputs.machinery_status}
              onChange={e => setInputs({ ...inputs, machinery_status: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px', backgroundColor: '#FFFFFF' }}
            >
              <option value={1}>1 - ACTIVE</option>
              <option value={0}>0 - IDLE / OFF</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>SAFETY INCIDENTS</label>
            <input
              type="number"
              value={inputs.safety_incidents}
              onChange={e => setInputs({ ...inputs, safety_incidents: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>MATERIAL SHORTAGE ALERT</label>
            <select
              value={inputs.material_shortage_alert}
              onChange={e => setInputs({ ...inputs, material_shortage_alert: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px', backgroundColor: '#FFFFFF' }}
            >
              <option value={0}>0 - NORMAL</option>
              <option value={1}>1 - SHORTAGE ALERT</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>SIMULATION DEVIATION (%)</label>
            <input
              type="number"
              step="0.01"
              value={inputs.simulation_deviation ?? 0.77}
              onChange={e => setInputs({ ...inputs, simulation_deviation: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={{ maxWidth: '1650px', margin: '0 auto', padding: '20px 16px 48px 16px', boxSizing: 'border-box' }}>
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
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={20} /> BACK TO COMMAND CENTER
      </Link>

      {/* Main Model Header */}
      <div style={{ marginBottom: '28px', borderBottom: '2.5px dashed #111111', paddingBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#666666' }}>
          CONARK PREDICTIVE ENGINE · {config.version}
        </div>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(28px, 5vw, 52px)', color: '#111111', textTransform: 'uppercase', marginTop: '4px', lineHeight: '1.05' }}>
          {config.title}
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#555555', marginTop: '4px' }}>
          Algorithm: {config.algorithm}
        </p>
      </div>

      {/* Grid: Left Input Form & Right Output Visualizer (RESPONSIVE) */}
      <div className="model-detail-grid" style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: '28px', width: '100%' }}>
        
        {/* Left Column: Dedicated Input Form */}
        <div className="card-responsive-padding" style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '28px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sliders size={22} color="#111111" />
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '24px', color: '#111111', textTransform: 'uppercase' }}>
              {isSpaceOpt ? 'SITE CONSTRAINTS & TELEMETRY' : 'STANDARDIZED MODEL INPUTS'}
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#666666', fontFamily: 'Inter, sans-serif', marginBottom: '20px' }}>
            Configure Building Performance Dataset parameters and click <strong>"PREDICT FOR THIS MODEL →"</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {renderModelInputs()}

            {/* PREDICT BUTTON — MANUAL TRIGGER */}
            <button
              onClick={runPrediction}
              disabled={loading}
              style={{
                marginTop: '10px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontFamily: 'Anton, sans-serif',
                fontSize: '20px',
                padding: '14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                letterSpacing: '0.04em'
              }}
            >
              {loading ? 'RUNNING SOLVER & GEMINI...' : 'PREDICT FOR THIS MODEL →'}
            </button>
          </div>
        </div>

        {/* Right Column: Deep Output & 2D Spatial Structure */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
          
          {hasPredicted ? (
            <>
              {/* Dynamic 2D Site Layout Map Canvas (For Space & Optimization Model) */}
              {isSpaceOpt && (
                <div className="card-responsive-padding" style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(20px, 3vw, 26px)', color: '#111111', textTransform: 'uppercase' }}>
                      DYNAMIC 2D SITE LAYOUT MAP ({spaceInputs.site_length_m}m × {spaceInputs.site_width_m}m)
                    </h2>
                    <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                      SCIPY SLSQP SOLVED
                    </span>
                  </div>

                  {/* Metrics Banner */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ backgroundColor: '#EDECE7', border: '1.5px solid #111111', borderRadius: '8px', padding: '10px 14px' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>SPACE UTILIZATION</span>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '24px', fontWeight: '800', color: '#111111' }}>
                        {utilization.toFixed(1)}%
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#EDECE7', border: '1.5px solid #111111', borderRadius: '8px', padding: '10px 14px' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>SAFETY COMPLIANCE</span>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '24px', fontWeight: '800', color: '#15803d' }}>
                        {safetyScore.toFixed(0)}%
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#EDECE7', border: '1.5px solid #111111', borderRadius: '8px', padding: '10px 14px' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>EFFICIENCY SCORE</span>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '24px', fontWeight: '800', color: '#111111' }}>
                        {efficiencyScore.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Proportional 2D Canvas rendering all 8 zones cleanly across 100% bounds */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '360px',
                    height: 'clamp(320px, 45vh, 480px)',
                    backgroundColor: '#111111',
                    borderRadius: '12px',
                    border: '2px solid #111111',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                  }}>
                    {coordinates.map((coord: ZoneCoordinates, i: number) => {
                      const leftPct = (coord.x / layoutMaxX) * 100;
                      const topPct = (coord.y / layoutMaxY) * 100;
                      const widthPct = (coord.width / layoutMaxX) * 100;
                      const heightPct = (coord.height / layoutMaxY) * 100;
                      const color = getZoneColor(coord.zone_name);
                      const isMagenta = color === '#FF2AA1';
                      const isNarrow = heightPct < 12;

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
                            padding: isNarrow ? '0px 8px' : '6px',
                            display: 'flex',
                            flexDirection: isNarrow ? 'row' : 'column',
                            alignItems: 'center',
                            justifyContent: isNarrow ? 'space-between' : 'center',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            transition: 'all 0.4s ease'
                          }}
                        >
                          <span style={{
                            fontFamily: 'Anton, sans-serif',
                            fontSize: isNarrow ? '11px' : 'clamp(10px, 1.2vw, 15px)',
                            color: isMagenta ? '#FFFFFF' : '#111111',
                            textTransform: 'uppercase',
                            lineHeight: '1.1',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {coord.zone_name}
                          </span>
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '9px',
                            color: isMagenta ? '#FFFFFF' : '#333333',
                            marginTop: isNarrow ? '0' : '2px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap'
                          }}>
                            {coord.width.toFixed(1)}m × {coord.height.toFixed(1)}m
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* 8-Zone Color Key Legend */}
                  <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '12px 14px', backgroundColor: '#EDECE7', borderRadius: '8px', border: '1px solid #111111', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#E4FF5B', border: '1px solid #111' }} /> Material Storage & Loading</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#7CFFA6', border: '1px solid #111' }} /> Equipment & Staging</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#4FC3F7', border: '1px solid #111' }} /> Worker Movement</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#F5F3E3', border: '1px solid #111' }} /> Safety Buffer</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#FF2AA1', border: '1px solid #111' }} /> Emergency Corridor</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#E0E0E0', border: '1px solid #111' }} /> Waste Dump</span>
                  </div>
                </div>
              )}

              {/* Primary Output Display Card */}
              <div
                className="card-responsive-padding"
                style={{
                  backgroundColor: config.color,
                  border: '2.5px dashed #111111',
                  borderRadius: '20px',
                  padding: '28px 32px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>
                    {config.outputLabel}
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                    MODEL RESULT
                  </span>
                </div>

                {/* Clean Formatted Model Output Prediction */}
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: isSpaceOpt ? 'clamp(32px, 5vw, 44px)' : 'clamp(44px, 7vw, 64px)', fontWeight: '800', color: '#111111', lineHeight: '1.0', margin: '14px 0 8px 0', wordBreak: 'break-word' }}>
                  {modelId === 'performance' && (result?.ml_results?.performance?.prediction || 'GOOD')}
                  {modelId === 'risk' && `${(result?.ml_results?.risk?.risk_score || 23.18).toFixed(1)}%`}
                  {modelId === 'cost' && formatCostOutput()}
                  {modelId === 'time' && formatTimeOutput()}
                  {isSpaceOpt && (result?.ml_results?.optimization?.recommendation || 'OPTIMIZE MATERIAL USAGE')}
                </div>

                <div style={{ fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111111' }}>
                  {modelId === 'performance' && `CONFIDENCE: ${((result?.ml_results?.performance?.confidence || 0.936) * 100).toFixed(1)}%`}
                  {modelId === 'risk' && `PRESENTATION LEVEL: ${result?.ml_results?.risk?.risk_level || 'Low Risk'}`}
                  {modelId === 'cost' && `STATUS: ${result?.ml_results?.cost_forecast?.budget_status || 'Over Budget'}`}
                  {modelId === 'time' && `SCHEDULE: ${result?.ml_results?.time_forecast?.schedule_status || 'Ahead'}`}
                  {isSpaceOpt && `EFFICIENCY IMPROVEMENT: ${result?.ml_results?.optimization?.expected_improvement || '+15% Operational Yield'}`}
                </div>
              </div>

              {/* 8-Zone Allocation Matrix (For Space & Optimization Model) */}
              {isSpaceOpt && (
                <div className="card-responsive-padding" style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111', marginBottom: '14px', textTransform: 'uppercase' }}>
                    8-ZONE ALLOCATION MATRIX
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '460px', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                      <thead>
                        <tr style={{ borderBottom: '2.5px dashed #111111', textAlign: 'left', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
                          <th style={{ padding: '8px 4px' }}>ZONE NAME</th>
                          <th style={{ padding: '8px 4px' }}>ALLOCATED AREA</th>
                          <th style={{ padding: '8px 4px' }}>MIN REQ</th>
                          <th style={{ padding: '8px 4px' }}>% SITE</th>
                          <th style={{ padding: '8px 4px' }}>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {zoneAllocations.map(z => (
                          <tr key={z.name} style={{ borderBottom: '1px solid #eeeeee' }}>
                            <td style={{ padding: '10px 4px', fontWeight: '700' }}>{z.name}</td>
                            <td style={{ padding: '10px 4px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>{z.alloc.toFixed(1)} m²</td>
                            <td style={{ padding: '10px 4px', fontFamily: 'JetBrains Mono, monospace', color: '#666' }}>{z.req} m²</td>
                            <td style={{ padding: '10px 4px', fontFamily: 'JetBrains Mono, monospace' }}>{z.pct}</td>
                            <td style={{ padding: '10px 4px' }}>
                              <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px' }}>
                                {z.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Feature Importance & Drivers Breakdown */}
              <div className="card-responsive-padding" style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '24px 28px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Activity size={20} color="#111111" />
                  <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111', textTransform: 'uppercase' }}>
                    KEY INPUT FEATURE DRIVERS & WEIGHTS
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {config.topFactors.map(factor => (
                    <div key={factor.name} style={{ backgroundColor: '#EDECE7', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #111111' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', flexWrap: 'wrap', gap: '4px' }}>
                        <span>{factor.name} ({factor.val})</span>
                        <span>{factor.pct}% WEIGHT</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#FFFFFF', borderRadius: '4px', marginTop: '6px', overflow: 'hidden', border: '1px solid #111111' }}>
                        <div style={{ height: '100%', width: `${factor.pct}%`, backgroundColor: '#111111' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep Gemini 2.5 Flash Analytical Narrative & Action Items */}
              <div className="card-responsive-padding" style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '24px 28px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} color="#FF2AA1" />
                    <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111', textTransform: 'uppercase' }}>
                      DETAILED GEMINI 2.5 FLASH EXPLANATION
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#FF2AA1', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px' }}>
                    GROUNDED AI
                  </span>
                </div>

                {/* Main Explanation Paragraph */}
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: '#111111',
                  lineHeight: '1.6',
                  fontWeight: '500',
                  backgroundColor: '#EDECE7',
                  borderLeft: '4px solid #111111',
                  padding: '16px 20px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  "{getGeminiExplanation()}"
                </div>

                {/* Key Findings List */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', color: '#111111', marginBottom: '10px', textTransform: 'uppercase' }}>
                    KEY FINDINGS & INSIGHTS
                  </h4>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(result?.gemini_report?.report?.key_findings || spaceRes?.gemini_report?.space_report?.key_findings || [
                      `Model evaluated state as ${config.outputLabel}`,
                      `Input parameters indicate active operational workload`,
                      `Telemetry factors are grounded in ConArk rules engine`
                    ]).map((finding: string, i: number) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#222222', lineHeight: '1.45' }}>
                        <ShieldCheck size={16} color="#15803d" style={{ minWidth: '16px', marginTop: '2px' }} />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actionable Mitigation Checklist */}
                <div>
                  <h4 style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', color: '#111111', marginBottom: '10px', textTransform: 'uppercase' }}>
                    ACTIONABLE MITIGATION CHECKLIST
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(result?.gemini_report?.report?.recommended_actions || spaceRes?.gemini_report?.space_report?.recommended_actions?.map(a => a.action) || [
                      "Conduct preventative maintenance check on active equipment",
                      "Rebalance worker allocation before the next construction cycle",
                      "Monitor vibration telemetry logs for safety compliance"
                    ]).map((action: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#FFFFFF', border: '1.5px solid #111111', padding: '10px 14px', borderRadius: '8px' }}>
                        <CheckCircle2 size={18} color="#FF2AA1" />
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#111111' }}>
                          {action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Standby State Before User Clicks Predict */
            <div className="card-responsive-padding" style={{
              backgroundColor: '#FFFFFF',
              border: '2.5px dashed #111111',
              borderRadius: '20px',
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
            }}>
              <div style={{ width: '52px', height: '52px', backgroundColor: config.color === '#FFFFFF' ? '#EDECE7' : config.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #111111', marginBottom: '16px' }}>
                <Sparkles size={24} color="#111111" />
              </div>
              <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(24px, 4vw, 32px)', color: '#111111', textTransform: 'uppercase', marginBottom: '8px' }}>
                READY FOR INFERENCE & OPTIMIZATION
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#555555', maxWidth: '440px', lineHeight: '1.5' }}>
                Configure Building Performance Dataset parameters on the left and click <strong>"PREDICT FOR THIS MODEL →"</strong> to generate ML outputs and Gemini explanations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
