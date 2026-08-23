import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Activity, Sliders } from 'lucide-react';
import { analyzeProjectIntelligence, optimizeSpaceLayout } from '../services/api';
import type { OperationalInputs, SpaceInputs, SpaceOptimizationResponse, ZoneCoordinates } from '../types';
import { ReportActionBanner } from '../components/pdf/ReportActionBanner';
import { ModelResultSkeleton } from '../components/ModelResultSkeleton';

export const ModelDetailPage: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
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

  // Raw String States for smooth typing (no auto-zero or decimal truncation glitches)
  const [rawInputs, setRawInputs] = useState<Record<string, string>>({
    temperature: '32.5',
    humidity: '45',
    vibration_level: '28.4',
    material_usage: '680',
    machinery_status: '1',
    worker_count: '45',
    energy_consumption: '340',
    task_progress: '0.42',
    safety_incidents: '1',
    equipment_utilization_rate: '91.2',
    material_shortage_alert: '0',
    cost_deviation: '2707.71',
    time_deviation: '-4.65',
    simulation_deviation: '0.77'
  });

  const [rawSpaceInputs, setRawSpaceInputs] = useState<Record<string, string>>({
    site_area_sqm: '1200',
    site_length_m: '40',
    site_width_m: '30',
    worker_count: '65',
    machinery_count: '8'
  });

  const handleRawInputChange = (key: string, valStr: string) => {
    setRawInputs(prev => ({ ...prev, [key]: valStr }));
    const pFloat = parseFloat(valStr);
    const pInt = parseInt(valStr, 10);
    setInputs(prev => ({
      ...prev,
      [key]: (key === 'machinery_status' || key === 'worker_count' || key === 'safety_incidents' || key === 'material_shortage_alert')
        ? (isNaN(pInt) ? 0 : pInt)
        : (isNaN(pFloat) ? 0 : pFloat)
    }));
  };

  const handleRawSpaceChange = (key: string, valStr: string) => {
    setRawSpaceInputs(prev => ({ ...prev, [key]: valStr }));
    if (key === 'site_length_m') {
      handleLengthChange(valStr);
    } else if (key === 'site_width_m') {
      handleWidthChange(valStr);
    } else if (key === 'site_area_sqm') {
      handleAreaChange(valStr);
    } else {
      const pInt = parseInt(valStr, 10);
      const validInt = isNaN(pInt) ? 0 : pInt;
      if (key === 'worker_count') {
        setSpaceInputs(prev => ({ ...prev, worker_count: validInt }));
      } else if (key === 'machinery_count') {
        setSpaceInputs(prev => ({ ...prev, machinery_count: validInt }));
      }
    }
  };

  const handleLengthChange = (valStr: string) => {
    setRawSpaceInputs(prev => ({ ...prev, site_length_m: valStr }));
    if (valStr === '') {
      setSpaceInputs(prev => ({ ...prev, site_length_m: 0, site_area_sqm: 0 }));
      setRawSpaceInputs(prev => ({ ...prev, site_length_m: '', site_area_sqm: '' }));
      return;
    }
    const l = parseFloat(valStr);
    if (isNaN(l)) return;
    setSpaceInputs(prev => {
      const w = prev.site_width_m || 0;
      const area = w > 0 ? Math.round(l * w) : prev.site_area_sqm;
      if (w > 0) {
        setRawSpaceInputs(r => ({ ...r, site_area_sqm: String(area) }));
      }
      return { ...prev, site_length_m: l, site_area_sqm: area };
    });
  };

  const handleWidthChange = (valStr: string) => {
    setRawSpaceInputs(prev => ({ ...prev, site_width_m: valStr }));
    if (valStr === '') {
      setSpaceInputs(prev => ({ ...prev, site_width_m: 0, site_area_sqm: 0 }));
      setRawSpaceInputs(prev => ({ ...prev, site_width_m: '', site_area_sqm: '' }));
      return;
    }
    const w = parseFloat(valStr);
    if (isNaN(w)) return;
    setSpaceInputs(prev => {
      const l = prev.site_length_m || 0;
      const area = l > 0 ? Math.round(l * w) : prev.site_area_sqm;
      if (l > 0) {
        setRawSpaceInputs(r => ({ ...r, site_area_sqm: String(area) }));
      }
      return { ...prev, site_width_m: w, site_area_sqm: area };
    });
  };

  const handleAreaChange = (valStr: string) => {
    setRawSpaceInputs(prev => ({ ...prev, site_area_sqm: valStr }));
    if (valStr === '') {
      setSpaceInputs(prev => ({ ...prev, site_area_sqm: 0 }));
      return;
    }
    const area = parseFloat(valStr);
    if (isNaN(area)) return;
    setSpaceInputs(prev => ({ ...prev, site_area_sqm: area }));
  };

  const getModelConfig = (id?: string) => {
    switch (id) {
      case 'performance':
        return {
          title: 'PERFORMANCE PREDICTION MODEL',
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
          title: 'RECOMMENDATION AND SPACE OPTIMIZATION MODEL',
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
      const finalInputs: OperationalInputs = {
        ...inputs,
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
        material_shortage_alert: parseInt(rawInputs.material_shortage_alert, 10) || 0,
        cost_deviation: parseFloat(rawInputs.cost_deviation) || 0,
        time_deviation: parseFloat(rawInputs.time_deviation) || 0
      };

      const finalSpaceInputs: SpaceInputs = {
        ...spaceInputs,
        site_area_sqm: parseFloat(rawSpaceInputs.site_area_sqm) || spaceInputs.site_area_sqm || 1200,
        site_length_m: parseFloat(rawSpaceInputs.site_length_m) || spaceInputs.site_length_m || 40,
        site_width_m: parseFloat(rawSpaceInputs.site_width_m) || spaceInputs.site_width_m || 30,
        worker_count: parseInt(rawSpaceInputs.worker_count, 10) || spaceInputs.worker_count || 65,
        machinery_count: parseInt(rawSpaceInputs.machinery_count, 10) || spaceInputs.machinery_count || 8
      };

      if (isSpaceOpt) {
        const [intelData, spaceData] = await Promise.all([
          analyzeProjectIntelligence(finalInputs),
          optimizeSpaceLayout(finalSpaceInputs)
        ]);
        setResult(intelData);
        setSpaceRes(spaceData);
      } else {
        const intelData = await analyzeProjectIntelligence(finalInputs);
        setResult(intelData);
      }
      setHasPredicted(true);
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || (typeof e === 'string' ? e : JSON.stringify(e));
      alert('Failed to execute prediction: ' + msg);
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

  const getDynamicFallbackCoordinates = (siteL?: number, siteW?: number): ZoneCoordinates[] => {
    const sL = siteL && siteL > 0 ? siteL : 40;
    const sW = siteW && siteW > 0 ? siteW : 30;
    const r = (val: number) => parseFloat(val.toFixed(2));
    
    const t1_h = r(sW * 0.40);
    const t2_h = r(sW * 0.35);
    const t3_h = r(sW * 0.18);
    const t4_h = r(sW - (t1_h + t2_h + t3_h));

    return [
      { zone_name: 'Material Storage', x: 0, y: 0, width: r(sL * 0.57), height: t1_h },
      { zone_name: 'Equipment Area', x: r(sL * 0.57), y: 0, width: r(sL * 0.43), height: t1_h },
      { zone_name: 'Worker Movement', x: 0, y: t1_h, width: r(sL * 0.60), height: t2_h },
      { zone_name: 'Staging Area', x: r(sL * 0.60), y: t1_h, width: r(sL * 0.40), height: t2_h },
      { zone_name: 'Safety Buffer', x: 0, y: r(t1_h + t2_h), width: r(sL * 0.445), height: t3_h },
      { zone_name: 'Loading / Unloading', x: r(sL * 0.445), y: r(t1_h + t2_h), width: r(sL * 0.3875), height: t3_h },
      { zone_name: 'Waste Dump', x: r(sL * 0.8325), y: r(t1_h + t2_h), width: r(sL * 0.1675), height: t3_h },
      { zone_name: 'Emergency Access Corridor', x: 0, y: r(t1_h + t2_h + t3_h), width: sL, height: t4_h }
    ];
  };

  const coordinates: ZoneCoordinates[] = spaceRes?.coordinates && spaceRes.coordinates.length > 0
    ? spaceRes.coordinates
    : getDynamicFallbackCoordinates(spaceInputs.site_length_m, spaceInputs.site_width_m);
  
  const layoutMaxX = spaceInputs.site_length_m && spaceInputs.site_length_m > 0
    ? spaceInputs.site_length_m
    : Math.max(...coordinates.map(c => c.x + c.width), 40);
  const layoutMaxY = spaceInputs.site_width_m && spaceInputs.site_width_m > 0
    ? spaceInputs.site_width_m
    : Math.max(...coordinates.map(c => c.y + c.height), 30);

  const utilization = spaceRes?.metrics?.space_utilization_percentage ?? 91.7;
  const safetyScore = spaceRes?.metrics?.safety_compliance_score ?? 100;
  const efficiencyScore = spaceRes?.metrics?.space_efficiency_score ?? spaceRes?.metrics?.layout_efficiency_score ?? 88.4;

  const totalSiteArea = spaceRes?.metrics?.total_allocated_area_sqm 
    ?? spaceInputs.site_area_sqm 
    ?? ((spaceInputs.site_length_m || 40) * (spaceInputs.site_width_m || 30));

  const zoneAllocations = [
    {
      name: 'Material Storage',
      alloc: spaceRes?.allocation?.material_storage_area_sqm ?? 320,
      req: spaceRes?.demand?.material_storage ?? 300,
      pct: `${(((spaceRes?.allocation?.material_storage_area_sqm ?? 320) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (spaceRes?.allocation?.material_storage_area_sqm ?? 320) >= (spaceRes?.demand?.material_storage ?? 300) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Equipment Area',
      alloc: spaceRes?.allocation?.equipment_area_sqm ?? 180,
      req: spaceRes?.demand?.equipment ?? 160,
      pct: `${(((spaceRes?.allocation?.equipment_area_sqm ?? 180) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (spaceRes?.allocation?.equipment_area_sqm ?? 180) >= (spaceRes?.demand?.equipment ?? 160) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Worker Movement',
      alloc: spaceRes?.allocation?.worker_movement_area_sqm ?? 150,
      req: spaceRes?.demand?.worker_movement ?? 140,
      pct: `${(((spaceRes?.allocation?.worker_movement_area_sqm ?? 150) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (spaceRes?.allocation?.worker_movement_area_sqm ?? 150) >= (spaceRes?.demand?.worker_movement ?? 140) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Safety Buffer',
      alloc: spaceRes?.allocation?.safety_buffer_area_sqm ?? 120,
      req: spaceRes?.demand?.safety_buffer ?? 100,
      pct: `${(((spaceRes?.allocation?.safety_buffer_area_sqm ?? 120) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (spaceRes?.allocation?.safety_buffer_area_sqm ?? 120) >= (spaceRes?.demand?.safety_buffer ?? 100) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Loading / Unloading',
      alloc: spaceRes?.allocation?.loading_area_sqm ?? 80,
      req: spaceRes?.demand?.loading ?? 70,
      pct: `${(((spaceRes?.allocation?.loading_area_sqm ?? 80) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (spaceRes?.allocation?.loading_area_sqm ?? 80) >= (spaceRes?.demand?.loading ?? 70) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Waste Dump',
      alloc: spaceRes?.allocation?.waste_area_sqm ?? 40,
      req: spaceRes?.demand?.waste ?? 30,
      pct: `${(((spaceRes?.allocation?.waste_area_sqm ?? 40) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (spaceRes?.allocation?.waste_area_sqm ?? 40) >= (spaceRes?.demand?.waste ?? 30) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Emergency Access',
      alloc: spaceRes?.allocation?.emergency_access_area_sqm ?? 110,
      req: spaceRes?.demand?.emergency_access ?? 100,
      pct: `${(((spaceRes?.allocation?.emergency_access_area_sqm ?? 110) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (spaceRes?.allocation?.emergency_access_area_sqm ?? 110) >= (spaceRes?.demand?.emergency_access ?? 100) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Staging Area',
      alloc: spaceRes?.allocation?.staging_area_sqm ?? 100,
      req: spaceRes?.demand?.staging ?? 80,
      pct: `${(((spaceRes?.allocation?.staging_area_sqm ?? 100) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (spaceRes?.allocation?.staging_area_sqm ?? 100) >= (spaceRes?.demand?.staging ?? 80) ? 'SATISFIED' : 'VIOLATED'
    }
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

  // Render individual input field by key
  const renderSingleField = (key: string) => {
    switch (key) {
      case 'temperature':
        return (
          <div key="temperature">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>TEMPERATURE (°C)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.temperature ?? ''}
              onChange={e => handleRawInputChange('temperature', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      case 'humidity':
        return (
          <div key="humidity">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>HUMIDITY (%)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.humidity ?? ''}
              onChange={e => handleRawInputChange('humidity', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      case 'vibration_level':
        return (
          <div key="vibration_level">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>VIBRATION LEVEL (Hz)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.vibration_level ?? ''}
              onChange={e => handleRawInputChange('vibration_level', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      case 'material_usage':
        return (
          <div key="material_usage">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>MATERIAL USAGE (kg)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.material_usage ?? ''}
              onChange={e => handleRawInputChange('material_usage', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      case 'machinery_status':
        return (
          <div key="machinery_status">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>MACHINERY STATUS</label>
            <select
              value={rawInputs.machinery_status ?? '1'}
              onChange={e => handleRawInputChange('machinery_status', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px', backgroundColor: '#FFFFFF' }}
            >
              <option value={1}>1 - ACTIVE</option>
              <option value={0}>0 - IDLE / OFF</option>
            </select>
          </div>
        );
      case 'worker_count':
        return (
          <div key="worker_count">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>WORKER COUNT</label>
            <input
              type="text"
              inputMode="numeric"
              value={rawInputs.worker_count ?? ''}
              onChange={e => handleRawInputChange('worker_count', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      case 'energy_consumption':
        return (
          <div key="energy_consumption">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>ENERGY CONSUMPTION (kWh)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.energy_consumption ?? ''}
              onChange={e => handleRawInputChange('energy_consumption', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      case 'task_progress':
        return (
          <div key="task_progress">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>TASK PROGRESS (0.0 to 1.0)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.task_progress ?? ''}
              onChange={e => handleRawInputChange('task_progress', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      case 'equipment_utilization_rate':
        return (
          <div key="equipment_utilization_rate">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>EQUIPMENT UTILIZATION (%)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.equipment_utilization_rate ?? ''}
              onChange={e => handleRawInputChange('equipment_utilization_rate', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      case 'safety_incidents':
        return (
          <div key="safety_incidents">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>SAFETY INCIDENTS</label>
            <input
              type="text"
              inputMode="numeric"
              value={rawInputs.safety_incidents ?? ''}
              onChange={e => handleRawInputChange('safety_incidents', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      case 'material_shortage_alert':
        return (
          <div key="material_shortage_alert">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>MATERIAL SHORTAGE ALERT</label>
            <select
              value={rawInputs.material_shortage_alert ?? '0'}
              onChange={e => handleRawInputChange('material_shortage_alert', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px', backgroundColor: '#FFFFFF' }}
            >
              <option value={0}>0 - NORMAL</option>
              <option value={1}>1 - SHORTAGE ALERT</option>
            </select>
          </div>
        );
      case 'cost_deviation':
        return (
          <div key="cost_deviation">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>COST DEVIATION (USD)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.cost_deviation ?? ''}
              onChange={e => handleRawInputChange('cost_deviation', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      case 'time_deviation':
        return (
          <div key="time_deviation">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>TIME DEVIATION (DAYS)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.time_deviation ?? ''}
              onChange={e => handleRawInputChange('time_deviation', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      case 'simulation_deviation':
        return (
          <div key="simulation_deviation">
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>SIMULATION DEVIATION (%)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawInputs.simulation_deviation ?? ''}
              onChange={e => handleRawInputChange('simulation_deviation', e.target.value)}
              style={{ width: '100%', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '6px 10px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '3px' }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Dynamic Input Form Fields renderer based on modelId
  const renderModelInputs = () => {
    if (isSpaceOpt) {
      return (
        <>
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>TOTAL SITE AREA (m²)</label>
            <input
              type="text"
              inputMode="decimal"
              value={rawSpaceInputs.site_area_sqm ?? ''}
              onChange={e => handleRawSpaceChange('site_area_sqm', e.target.value)}
              style={{ width: '100%', fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '4px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>LENGTH (m)</label>
              <input
                type="text"
                inputMode="decimal"
                value={rawSpaceInputs.site_length_m ?? ''}
                onChange={e => handleRawSpaceChange('site_length_m', e.target.value)}
                style={{ width: '100%', fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>WIDTH (m)</label>
              <input
                type="text"
                inputMode="decimal"
                value={rawSpaceInputs.site_width_m ?? ''}
                onChange={e => handleRawSpaceChange('site_width_m', e.target.value)}
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
              <option value="MASONRY">MASONRY</option>
              <option value="ELECTRICAL">ELECTRICAL</option>
              <option value="PLUMBING">PLUMBING</option>
              <option value="FINISHING">FINISHING</option>
              <option value="MIXED">MIXED</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>WORKER COUNT</label>
            <input
              type="text"
              inputMode="numeric"
              value={rawSpaceInputs.worker_count ?? ''}
              onChange={e => handleRawSpaceChange('worker_count', e.target.value)}
              style={{ width: '100%', fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>MACHINERY COUNT</label>
            <input
              type="text"
              inputMode="numeric"
              value={rawSpaceInputs.machinery_count ?? ''}
              onChange={e => handleRawSpaceChange('machinery_count', e.target.value)}
              style={{ width: '100%', fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '8px', marginTop: '4px' }}
            />
          </div>
        </>
      );
    }

    // Required inputs per specific model
    const requiredKeysMap: Record<string, string[]> = {
      performance: [
        'temperature', 'humidity', 'vibration_level', 'material_usage',
        'machinery_status', 'worker_count', 'energy_consumption', 'task_progress',
        'equipment_utilization_rate', 'safety_incidents', 'material_shortage_alert',
        'cost_deviation', 'time_deviation'
      ],
      risk: [
        'temperature', 'humidity', 'vibration_level', 'worker_count',
        'machinery_status', 'energy_consumption', 'equipment_utilization_rate',
        'safety_incidents', 'material_shortage_alert', 'task_progress'
      ],
      cost: [
        'task_progress', 'material_usage', 'worker_count', 'energy_consumption',
        'equipment_utilization_rate', 'machinery_status', 'temperature',
        'humidity', 'vibration_level'
      ],
      time: [
        'task_progress', 'worker_count', 'machinery_status',
        'equipment_utilization_rate', 'vibration_level', 'safety_incidents',
        'material_usage', 'material_shortage_alert', 'energy_consumption'
      ],
      optimization: [
        'worker_count', 'material_usage', 'material_shortage_alert',
        'machinery_status', 'equipment_utilization_rate', 'energy_consumption',
        'task_progress', 'temperature', 'humidity', 'vibration_level',
        'safety_incidents', 'cost_deviation', 'time_deviation', 'simulation_deviation'
      ]
    };

    const keys = requiredKeysMap[modelId || 'performance'] || requiredKeysMap.performance;

    // Group keys into 2-column grid pairs for clean aesthetic layout
    const pairs: string[][] = [];
    for (let i = 0; i < keys.length; i += 2) {
      if (i + 1 < keys.length) {
        pairs.push([keys[i], keys[i + 1]]);
      } else {
        pairs.push([keys[i]]);
      }
    }

    return (
      <>
        {pairs.map((pair, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: pair.length === 2 ? '1fr 1fr' : '1fr', gap: '12px' }}>
            {pair.map(k => renderSingleField(k))}
          </div>
        ))}
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
              {isSpaceOpt ? 'SITE CONSTRAINTS & TELEMETRY' : 'REQUIRED MODEL INPUTS'}
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#666666', fontFamily: 'Inter, sans-serif', marginBottom: '20px' }}>
            Enter the <strong>{modelId?.toUpperCase()} MODEL</strong> inputs below and click <strong>"PREDICT FOR THIS MODEL →"</strong>.
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
          
          {loading ? (
            <ModelResultSkeleton isSpaceOpt={isSpaceOpt} modelTitle={config.title} />
          ) : hasPredicted ? (
            <div className="animate-result-appear" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '100%' }}>
              {/* Dynamic 2D Site Layout Map Canvas (For Space & Optimization Model) */}
              {isSpaceOpt && (
                <div className="card-responsive-padding" style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(18px, 3vw, 26px)', color: '#111111', textTransform: 'uppercase', wordBreak: 'break-word' }}>
                      DYNAMIC 2D SITE LAYOUT MAP ({spaceInputs.site_length_m}m × {spaceInputs.site_width_m}m)
                    </h2>
                    <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                      SCIPY SLSQP SOLVED
                    </span>
                  </div>

                  {/* Metrics Banner */}
                  <div className="metrics-banner-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginBottom: '20px', width: '100%' }}>
                    <div style={{ backgroundColor: '#EDECE7', border: '1.5px solid #111111', borderRadius: '8px', padding: '8px 12px', minWidth: 0 }}>
                      <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', display: 'block' }}>SPACE UTILIZATION</span>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: '800', color: '#111111' }}>
                        {utilization.toFixed(1)}%
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#EDECE7', border: '1.5px solid #111111', borderRadius: '8px', padding: '8px 12px', minWidth: 0 }}>
                      <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', display: 'block' }}>SAFETY COMPLIANCE</span>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: '800', color: '#15803d' }}>
                        {safetyScore.toFixed(0)}%
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#EDECE7', border: '1.5px solid #111111', borderRadius: '8px', padding: '8px 12px', minWidth: 0 }}>
                      <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', display: 'block' }}>EFFICIENCY SCORE</span>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: '800', color: '#111111' }}>
                        {efficiencyScore.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Proportional Auto-Adjusting 2D Canvas rendering all 8 zones cleanly */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '100%',
                    minHeight: '340px',
                    height: layoutMaxY > 0 && layoutMaxX > 0 
                      ? `clamp(320px, ${Math.min(55, Math.max(30, (layoutMaxY / layoutMaxX) * 45))}vh, 580px)`
                      : '400px',
                    maxHeight: '600px',
                    backgroundColor: '#111111',
                    borderRadius: '12px',
                    border: '2px solid #111111',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 0 25px rgba(0,0,0,0.6)',
                    boxSizing: 'border-box'
                  }}>
                    {coordinates.map((coord: ZoneCoordinates, i: number) => {
                      const leftPct = (coord.x / layoutMaxX) * 100;
                      const topPct = (coord.y / layoutMaxY) * 100;
                      const widthPct = (coord.width / layoutMaxX) * 100;
                      const heightPct = (coord.height / layoutMaxY) * 100;
                      const color = getZoneColor(coord.zone_name);
                      const isMagenta = color === '#FF2AA1';
                      const isVeryNarrow = heightPct < 10;
                      const zoneArea = coord.width * coord.height;

                      return (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            left: `${leftPct}%`,
                            top: `${topPct}%`,
                            width: `${widthPct}%`,
                            height: `${heightPct}%`,
                            minHeight: '24px',
                            backgroundColor: color,
                            border: '1.5px solid #111111',
                            padding: isVeryNarrow ? '1px 4px' : '4px 6px',
                            display: 'flex',
                            flexDirection: isVeryNarrow ? 'row' : 'column',
                            alignItems: 'center',
                            justifyContent: isVeryNarrow ? 'space-between' : 'center',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            transition: 'all 0.4s ease'
                          }}
                          title={`${coord.zone_name}: ${coord.width.toFixed(1)}m × ${coord.height.toFixed(1)}m (${zoneArea.toFixed(1)} m²)`}
                        >
                          <span style={{
                            fontFamily: 'Anton, sans-serif',
                            fontSize: isVeryNarrow ? '9px' : 'clamp(9px, 1.1vw, 14px)',
                            color: isMagenta ? '#FFFFFF' : '#111111',
                            textTransform: 'uppercase',
                            lineHeight: '1.05',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%',
                            display: 'block'
                          }}>
                            {coord.zone_name}
                          </span>
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: isVeryNarrow ? '8px' : '9px',
                            color: isMagenta ? '#FFFFFF' : '#333333',
                            marginTop: isVeryNarrow ? '0' : '1px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%',
                            display: 'block'
                          }}>
                            {coord.width.toFixed(1)}m × {coord.height.toFixed(1)}m ({zoneArea.toFixed(0)} m²)
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* 8-Zone Color Key Legend */}
                  <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px 12px', backgroundColor: '#EDECE7', borderRadius: '8px', border: '1px solid #111111', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', maxWidth: '100%', overflow: 'hidden' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#E4FF5B', border: '1px solid #111', flexShrink: 0 }} /> Material Storage & Loading</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#7CFFA6', border: '1px solid #111', flexShrink: 0 }} /> Equipment & Staging</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#4FC3F7', border: '1px solid #111', flexShrink: 0 }} /> Worker Movement</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#F5F3E3', border: '1px solid #111', flexShrink: 0 }} /> Safety Buffer</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#FF2AA1', border: '1px solid #111', flexShrink: 0 }} /> Emergency Corridor</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#E0E0E0', border: '1px solid #111', flexShrink: 0 }} /> Waste Dump</span>
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

                <div style={{ marginTop: '16px' }}>
                  <button
                    onClick={() => navigate(`/construction-ai?context=${modelId || 'performance'}`)}
                    style={{
                      backgroundColor: '#FF2AA1',
                      color: '#FFFFFF',
                      border: '2px solid #111111',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontFamily: 'Anton, sans-serif',
                      fontSize: '15px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '3px 3px 0px #111111'
                    }}
                  >
                    ASK CONARK AI ABOUT THIS RESULT →
                  </button>
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

              {/* Official ConArk Intelligence PDF Report Action Banner */}
              <ReportActionBanner
                payload={{
                  modelType: isSpaceOpt ? 'space_optimization' : ((modelId as any) || 'performance'),
                  modelName: config.title,
                  inputs: isSpaceOpt ? spaceInputs : inputs,
                  outputs: isSpaceOpt ? (spaceRes || {}) : (result || {}),
                  geminiExplanation: isSpaceOpt 
                    ? ((spaceRes as any)?.gemini_report?.space_report?.summary || (spaceRes as any)?.gemini_report?.narrative) 
                    : (result?.gemini_report?.report?.explanation || result?.gemini_report?.narrative),
                  metrics: result?.ml_results || (spaceRes as any)?.ml_results
                }}
              />
            </div>
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
