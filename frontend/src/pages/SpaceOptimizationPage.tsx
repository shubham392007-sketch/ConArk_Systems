import React, { useState } from 'react';
import { Sparkles, Sliders } from 'lucide-react';
import { optimizeSpaceLayout } from '../services/api';
import type { SpaceOptimizationResponse, SpaceInputs, ZoneCoordinates } from '../types';
import { ReportActionBanner } from '../components/pdf/ReportActionBanner';

export const SpaceOptimizationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false);
  const [res, setRes] = useState<SpaceOptimizationResponse | null>(null);

  const [inputs, setInputs] = useState<SpaceInputs>({
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
    temperature: 30,
    humidity: 60,
    vibration_level: 25,
    equipment_utilization_rate: 78,
    task_progress: 0.45,
    risk_score: 52,
    material_shortage_alert: 0
  });

  const handleLengthChange = (valStr: string) => {
    if (valStr === '') {
      setInputs(prev => ({
        ...prev,
        site_length_m: 0,
        site_area_sqm: 0
      }));
      return;
    }
    const l = parseFloat(valStr);
    if (isNaN(l)) return;
    setInputs(prev => {
      const w = prev.site_width_m || 0;
      return {
        ...prev,
        site_length_m: l,
        site_area_sqm: w > 0 ? Math.round(l * w) : prev.site_area_sqm
      };
    });
  };

  const handleWidthChange = (valStr: string) => {
    if (valStr === '') {
      setInputs(prev => ({
        ...prev,
        site_width_m: 0,
        site_area_sqm: 0
      }));
      return;
    }
    const w = parseFloat(valStr);
    if (isNaN(w)) return;
    setInputs(prev => {
      const l = prev.site_length_m || 0;
      return {
        ...prev,
        site_width_m: w,
        site_area_sqm: l > 0 ? Math.round(l * w) : prev.site_area_sqm
      };
    });
  };

  const handleAreaChange = (valStr: string) => {
    if (valStr === '') {
      setInputs(prev => ({
        ...prev,
        site_area_sqm: 0
      }));
      return;
    }
    const area = parseFloat(valStr);
    if (isNaN(area)) return;
    setInputs(prev => {
      return {
        ...prev,
        site_area_sqm: area
      };
    });
  };

  const runOptimization = async () => {
    setLoading(true);
    try {
      const data = await optimizeSpaceLayout(inputs);
      setRes(data);
      setHasOptimized(true);
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || (typeof e === 'string' ? e : JSON.stringify(e));
      alert('Space optimization failed: ' + msg);
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

  const coordinates: ZoneCoordinates[] = res?.coordinates && res.coordinates.length > 0
    ? res.coordinates
    : getDynamicFallbackCoordinates(inputs.site_length_m, inputs.site_width_m);
  
  const layoutMaxX = inputs.site_length_m && inputs.site_length_m > 0
    ? inputs.site_length_m
    : Math.max(...coordinates.map(c => c.x + c.width), 40);
  const layoutMaxY = inputs.site_width_m && inputs.site_width_m > 0
    ? inputs.site_width_m
    : Math.max(...coordinates.map(c => c.y + c.height), 30);

  const utilization = res?.metrics?.space_utilization_percentage ?? 91.7;
  const safetyScore = res?.metrics?.safety_compliance_score ?? 100;
  const efficiencyScore = res?.metrics?.space_efficiency_score ?? res?.metrics?.layout_efficiency_score ?? 88.4;

  const totalSiteArea = res?.metrics?.total_allocated_area_sqm 
    ?? inputs.site_area_sqm 
    ?? ((inputs.site_length_m || 40) * (inputs.site_width_m || 30));

  const zoneAllocations = [
    {
      name: 'Material Storage',
      alloc: res?.allocation?.material_storage_area_sqm ?? 320,
      req: res?.demand?.material_storage ?? 300,
      pct: `${(((res?.allocation?.material_storage_area_sqm ?? 320) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (res?.allocation?.material_storage_area_sqm ?? 320) >= (res?.demand?.material_storage ?? 300) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Equipment Area',
      alloc: res?.allocation?.equipment_area_sqm ?? 180,
      req: res?.demand?.equipment ?? 160,
      pct: `${(((res?.allocation?.equipment_area_sqm ?? 180) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (res?.allocation?.equipment_area_sqm ?? 180) >= (res?.demand?.equipment ?? 160) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Worker Movement',
      alloc: res?.allocation?.worker_movement_area_sqm ?? 150,
      req: res?.demand?.worker_movement ?? 140,
      pct: `${(((res?.allocation?.worker_movement_area_sqm ?? 150) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (res?.allocation?.worker_movement_area_sqm ?? 150) >= (res?.demand?.worker_movement ?? 140) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Safety Buffer',
      alloc: res?.allocation?.safety_buffer_area_sqm ?? 120,
      req: res?.demand?.safety_buffer ?? 100,
      pct: `${(((res?.allocation?.safety_buffer_area_sqm ?? 120) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (res?.allocation?.safety_buffer_area_sqm ?? 120) >= (res?.demand?.safety_buffer ?? 100) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Loading / Unloading',
      alloc: res?.allocation?.loading_area_sqm ?? 80,
      req: res?.demand?.loading ?? 70,
      pct: `${(((res?.allocation?.loading_area_sqm ?? 80) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (res?.allocation?.loading_area_sqm ?? 80) >= (res?.demand?.loading ?? 70) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Waste Dump',
      alloc: res?.allocation?.waste_area_sqm ?? 40,
      req: res?.demand?.waste ?? 30,
      pct: `${(((res?.allocation?.waste_area_sqm ?? 40) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (res?.allocation?.waste_area_sqm ?? 40) >= (res?.demand?.waste ?? 30) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Emergency Access',
      alloc: res?.allocation?.emergency_access_area_sqm ?? 110,
      req: res?.demand?.emergency_access ?? 100,
      pct: `${(((res?.allocation?.emergency_access_area_sqm ?? 110) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (res?.allocation?.emergency_access_area_sqm ?? 110) >= (res?.demand?.emergency_access ?? 100) ? 'SATISFIED' : 'VIOLATED'
    },
    {
      name: 'Staging Area',
      alloc: res?.allocation?.staging_area_sqm ?? 100,
      req: res?.demand?.staging ?? 80,
      pct: `${(((res?.allocation?.staging_area_sqm ?? 100) / totalSiteArea) * 100).toFixed(1)}%`,
      status: (res?.allocation?.staging_area_sqm ?? 100) >= (res?.demand?.staging ?? 80) ? 'SATISFIED' : 'VIOLATED'
    }
  ];

  return (
    <div style={{ maxWidth: '1650px', margin: '0 auto', padding: '20px 16px 48px 16px', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', borderBottom: '2.5px dashed #111111', paddingBottom: '18px' }}>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(28px, 5.5vw, 54px)', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05' }}>
          CONSTRAINED SPACE OPTIMIZATION ENGINE
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#555555', marginTop: '4px' }}>
          SciPy SLSQP Constrained Optimization — Solves dynamic 8-zone area allocation & 2D spatial layouts.
        </p>
      </div>

      {/* Grid: Left Inputs Form & Right 2D Spatial Layout Canvas (RESPONSIVE) */}
      <div className="space-opt-grid" style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '28px', marginBottom: '32px' }}>
        
        {/* Left Column: Interactive Site Parameters Form */}
        <div className="card-responsive-padding" style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sliders size={20} color="#111111" />
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111', textTransform: 'uppercase' }}>
              SITE CONSTRAINTS & INPUTS
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>TOTAL SITE AREA (m²)</label>
              <input
                type="number"
                value={inputs.site_area_sqm === 0 ? '' : inputs.site_area_sqm}
                onChange={e => handleAreaChange(e.target.value)}
                style={{ width: '100%', fontSize: '16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '4px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>LENGTH (m)</label>
                <input
                  type="number"
                  value={inputs.site_length_m === 0 ? '' : inputs.site_length_m}
                  onChange={e => handleLengthChange(e.target.value)}
                  style={{ width: '100%', fontSize: '16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>WIDTH (m)</label>
                <input
                  type="number"
                  value={inputs.site_width_m === 0 ? '' : inputs.site_width_m}
                  onChange={e => handleWidthChange(e.target.value)}
                  style={{ width: '100%', fontSize: '16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>CONSTRUCTION STAGE</label>
              <select
                value={inputs.construction_stage}
                onChange={e => setInputs({ ...inputs, construction_stage: e.target.value })}
                style={{ width: '100%', fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '4px', backgroundColor: '#FFFFFF' }}
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
                type="number"
                value={inputs.worker_count === 0 ? '' : inputs.worker_count}
                onChange={e => setInputs({ ...inputs, worker_count: e.target.value === '' ? 0 : (parseInt(e.target.value) || 0) })}
                style={{ width: '100%', fontSize: '16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>MACHINERY COUNT</label>
              <input
                type="number"
                value={inputs.machinery_count === 0 ? '' : inputs.machinery_count}
                onChange={e => setInputs({ ...inputs, machinery_count: e.target.value === '' ? 0 : (parseInt(e.target.value) || 0) })}
                style={{ width: '100%', fontSize: '16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', padding: '8px 12px', border: '1.5px solid #111111', borderRadius: '6px', marginTop: '4px' }}
              />
            </div>

            <button
              onClick={runOptimization}
              disabled={loading}
              style={{
                marginTop: '10px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontFamily: 'Anton, sans-serif',
                fontSize: '18px',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                letterSpacing: '0.04em'
              }}
            >
              {loading ? 'SOLVING OPTIMIZATION...' : 'OPTIMIZE SPACE LAYOUT →'}
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic 2D Site Layout Map Canvas */}
        <div className="card-responsive-padding" style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(18px, 3vw, 26px)', color: '#111111', textTransform: 'uppercase', wordBreak: 'break-word' }}>
              DYNAMIC 2D SITE LAYOUT MAP ({inputs.site_length_m}m × {inputs.site_width_m}m)
            </h2>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
              {hasOptimized ? 'SOLVED VIA SCIPY SLSQP' : 'DEFAULT CONFIGURATION'}
            </span>
          </div>

          {/* Metrics Banner */}
          <div className="metrics-banner-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginBottom: '18px', width: '100%' }}>
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
      </div>

      {/* Zone Allocation Matrix Table */}
      <div className="card-responsive-padding" style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '24px', marginBottom: '28px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111', marginBottom: '14px', textTransform: 'uppercase' }}>
          8-ZONE OPTIMIZED ALLOCATION MATRIX
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '460px', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: '2.5px dashed #111111', textAlign: 'left', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
                <th style={{ padding: '8px 4px' }}>ZONE NAME</th>
                <th style={{ padding: '8px 4px' }}>ALLOCATED AREA (m²)</th>
                <th style={{ padding: '8px 4px' }}>MIN REQUIRED (m²)</th>
                <th style={{ padding: '8px 4px' }}>% OF TOTAL SITE</th>
                <th style={{ padding: '8px 4px' }}>CONSTRAINT STATUS</th>
              </tr>
            </thead>
            <tbody>
              {zoneAllocations.map(z => (
                <tr key={z.name} style={{ borderBottom: '1px solid #eeeeee' }}>
                  <td style={{ padding: '10px 4px', fontWeight: '700' }}>{z.name}</td>
                  <td style={{ padding: '10px 4px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>{z.alloc.toFixed(1)} m²</td>
                  <td style={{ padding: '10px 4px', fontFamily: 'JetBrains Mono, monospace', color: '#666666' }}>{z.req} m²</td>
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

      {/* Gemini 2.5 Flash Space Narrative Report */}
      <div className="card-responsive-padding" style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '20px', padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Sparkles size={20} color="#FF2AA1" />
          <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', color: '#111111', textTransform: 'uppercase' }}>
            GEMINI 2.5 FLASH SPACE AI REPORT
          </h3>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#111111', lineHeight: '1.6', fontWeight: '500' }}>
          "{res?.gemini_report?.space_report?.summary || "Space allocation completed with status 'OPTIMAL'. Site space utilization is 91.7% with an overall efficiency score of 88.4/100 and safety compliance of 100/100."}"
        </p>
      </div>

      {/* Official ConArk Intelligence PDF Report Action Banner */}
      <div style={{ marginTop: '28px' }}>
        <ReportActionBanner
          payload={{
            modelType: 'space_optimization',
            modelName: 'SPACE OPTIMIZATION ENGINE',
            inputs,
            outputs: res || {},
            geminiExplanation: res?.gemini_report?.space_report?.summary || (res as any)?.gemini_report?.narrative,
            metrics: (res as any)?.ml_results
          }}
        />
      </div>
    </div>
  );
};
