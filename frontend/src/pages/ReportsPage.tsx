import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Eye, 
  FileText, 
  Trash2, 
  FolderKanban, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  FileDown, 
  Filter, 
  Loader2,
  HardHat,
  DollarSign,
  TrendingUp,
  Boxes
} from 'lucide-react';
import { generateModelReport, getSavedReports, deleteSavedReport, clearSavedReports } from '../services/pdf/reportGenerator';
import type { SavedReportItem, ModelReportPayload, ModelType } from '../services/pdf/reportTypes';
import { PdfPreviewModal } from '../components/pdf/PdfPreviewModal';
import { fetchUserProjects } from '../services/api';

export const ReportsPage: React.FC = () => {
  // Saved reports history state
  const [savedReports, setSavedReports] = useState<SavedReportItem[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('ALL');
  const [projects, setProjects] = useState<any[]>([]);

  // Generation & Modal Preview state
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [previewPdf, setPreviewPdf] = useState<{ url: string; filename: string } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Load history on mount
  useEffect(() => {
    setSavedReports(getSavedReports());

    // Load projects for filtering
    try {
      const cached = localStorage.getItem('conark_cached_projects');
      if (cached) {
        setProjects(JSON.parse(cached));
      }
    } catch {}

    fetchUserProjects()
      .then(projs => {
        if (projs && projs.length > 0) {
          setProjects(projs);
        }
      })
      .catch(() => {});
  }, []);

  const refreshHistory = () => {
    setSavedReports(getSavedReports());
  };

  const handleDeleteReport = (reportId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from your downloaded records?`)) return;
    const updated = deleteSavedReport(reportId);
    setSavedReports(updated);
  };

  const handleClearAll = () => {
    if (!window.confirm('Are you sure you want to clear all downloaded reports history?')) return;
    clearSavedReports();
    setSavedReports([]);
  };

  // Re-open preview for saved report
  const handlePreviewSavedReport = async (item: SavedReportItem) => {
    if (item.payload) {
      try {
        const res = await generateModelReport(item.payload);
        setPreviewPdf({ url: res.url, filename: res.filename });
        setIsPreviewOpen(true);
      } catch (e) {
        alert('Could not recreate preview for this report.');
      }
    } else {
      // Fallback synthetic preview payload
      const fallbackPayload: ModelReportPayload = {
        modelType: item.modelType,
        modelName: item.modelName,
        inputs: { 'Generated Time': item.timestamp, 'Status': item.status },
        outputs: { 'Summary': item.predictionSummary },
        geminiExplanation: {
          summary: item.predictionSummary,
          what_this_means: 'This archived report summarizes intelligence recorded during site operation.',
          recommended_actions: ['Review baseline telemetry against schedule milestones.', 'Audit safety and material consumption protocols.']
        },
        metadata: {
          report_id: item.report_id,
          timestamp: item.timestamp,
          status: item.status as any,
          project_name: item.project_name || 'ConArk Systems'
        }
      };
      try {
        const res = await generateModelReport(fallbackPayload);
        setPreviewPdf({ url: res.url, filename: res.filename });
        setIsPreviewOpen(true);
      } catch (e) {
        alert('Could not generate preview.');
      }
    }
  };

  // Re-download saved report
  const handleDownloadSavedReport = async (item: SavedReportItem) => {
    try {
      const payload: ModelReportPayload = item.payload || {
        modelType: item.modelType,
        modelName: item.modelName,
        inputs: { 'Archived Timestamp': item.timestamp },
        outputs: { 'Primary Metric': item.predictionSummary },
        geminiExplanation: {
          summary: item.predictionSummary,
          what_this_means: 'Standard ConArk site intelligence export record.',
          recommended_actions: ['Track ongoing site metrics.', 'Maintain quality assurance logs.']
        },
        metadata: {
          report_id: item.report_id,
          timestamp: item.timestamp,
          status: item.status as any,
          project_name: item.project_name || 'ConArk Systems'
        }
      };

      const res = await generateModelReport(payload);
      const a = document.createElement('a');
      a.href = res.url;
      a.download = res.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      refreshHistory();
    } catch (e) {
      alert('Error downloading report PDF.');
    }
  };

  // 6 Core Engineering Templates
  const reportTemplates: Array<{
    id: string;
    title: string;
    desc: string;
    modelType: ModelType;
    icon: any;
    badge: string;
    color: string;
    sampleInputs: Record<string, any>;
    sampleOutputs: Record<string, any>;
    geminiExplanation: any;
    metrics: Record<string, any>;
  }> = [
    {
      id: 'daily_performance',
      title: 'DAILY SITE PERFORMANCE REPORT',
      desc: 'Summary of daily task velocity, machine productivity, and operational classification.',
      modelType: 'performance',
      icon: TrendingUp,
      badge: 'GOOD (93.6%)',
      color: '#E4FF5B',
      sampleInputs: {
        'Task Progress Velocity': '0.68',
        'Worker Count': 65,
        'Machinery Active': 8,
        'Equipment Utilization': '91.2%',
        'Temperature': '32.5°C'
      },
      sampleOutputs: {
        'Predicted Performance': 'GOOD',
        'Model Confidence': '93.6%',
        'Health Index': '88/100'
      },
      geminiExplanation: {
        summary: 'Site execution velocity is tracking positively with high machinery uptime and strong worker productivity ratios.',
        what_this_means: 'Current structural progress indicates standard cycle completion without major delay risks.',
        recommended_actions: [
          'Maintain equipment maintenance schedule before next concrete pour.',
          'Verify staging logistics for upcoming structural reinforcement delivery.'
        ]
      },
      metrics: { confidence: 0.936, velocity: 0.68 }
    },
    {
      id: 'weekly_forecast',
      title: 'WEEKLY FORECAST & SCHEDULE REPORT',
      desc: 'Multi-model projection covering time deviation, cost trends, and schedule variance.',
      modelType: 'cost_time',
      icon: Clock,
      badge: '+4.8 DAYS DELAY',
      color: '#7CFFA6',
      sampleInputs: {
        'Planned Stage Duration': '45 Days',
        'Material Consumption (kg)': 6800,
        'Daily Delivery Frequency': 5,
        'Overtime Count': '14 Hours',
        'Task Lag': '15%'
      },
      sampleOutputs: {
        'Predicted Time Deviation': '+4.8 Days',
        'Schedule Status': 'DELAYED',
        'Predicted Cost Variance': '+$8,420',
        'Budget Status': 'OVER BUDGET'
      },
      geminiExplanation: {
        summary: 'Material delivery bottlenecks and staging density are creating a projected 4.8-day schedule delay.',
        what_this_means: 'Unplanned idle time at secondary crane zones is driving marginal overtime labor costs.',
        recommended_actions: [
          'Expedite pending supplier batches to eliminate assembly line wait times.',
          'Reallocate 12 workers from staging area to core framing division.'
        ]
      },
      metrics: { time_deviation_days: 4.8, cost_deviation: 8420 }
    },
    {
      id: 'operational_risk',
      title: 'OPERATIONAL RISK & SAFETY REPORT',
      desc: 'Comprehensive multi-factor safety indices, machinery vibration analysis, and hazard mitigation.',
      modelType: 'risk',
      icon: ShieldAlert,
      badge: '72% HIGH RISK',
      color: '#4FC3F7',
      sampleInputs: {
        'Safety Incidents Count': 2,
        'Vibration Level (mm/s)': '28.4',
        'Humidity Level': '45%',
        'Worker Density': 'High',
        'Heavy Machinery Count': 3
      },
      sampleOutputs: {
        'Risk Score': '72%',
        'Risk Level': 'HIGH',
        'Safety Index': '89% Vulnerability',
        'Equipment Stress': '74%'
      },
      geminiExplanation: {
        summary: 'Elevated equipment vibration combined with high worker density increases localized safety risk profile.',
        what_this_means: 'Machinery operating near peak threshold requires immediate vibration damping inspection.',
        recommended_actions: [
          'Enforce strict 10-meter perimeter clearance around high-vibration machinery.',
          'Deploy secondary safety officer to active crane hoisting zone.'
        ]
      },
      metrics: { risk_score: 72, risk_level: 'HIGH' }
    },
    {
      id: 'cost_budget',
      title: 'EXECUTIVE COST DEVIATION REPORT',
      desc: 'Detailed variance breakdown between initial project estimates and real-time material telemetry.',
      modelType: 'cost_time',
      icon: DollarSign,
      badge: '+$8,420 OVER',
      color: '#FF2AA1',
      sampleInputs: {
        'Material Invoiced': '$450,000',
        'Overtime Logged': '180 Hours',
        'Equipment Rental Overrun': '$3,200',
        'Waste Generation': '250 kg/day'
      },
      sampleOutputs: {
        'Predicted Cost Overrun': '+$8,420',
        'Cost Impact Rate': '+1.87%',
        'Confidence Range': '+$6,200 — +$10,640'
      },
      geminiExplanation: {
        summary: 'Primary cost deviation is driven by expedited logistics surcharge and secondary equipment idle rates.',
        what_this_means: 'Overall financial health remains within contingency buffer but requires proactive inventory control.',
        recommended_actions: [
          'Consolidate bulk shipments to reduce per-truck transportation overhead.',
          'Re-negotiate concrete supplier rates for subsequent construction phases.'
        ]
      },
      metrics: { cost_overrun: 8420 }
    },
    {
      id: 'safety_material',
      title: 'SAFETY & MATERIAL AUDIT REPORT',
      desc: 'Site safety compliance, material shortages, and waste efficiency analytics.',
      modelType: 'safety_material',
      icon: HardHat,
      badge: 'AUDIT COMPLIANT',
      color: '#F5F3E3',
      sampleInputs: {
        'Daily Material Usage (kg)': 850,
        'Waste Generated (kg)': 250,
        'Emergency Access Route': 'CLEAR',
        'Material Shortage Alert': 'ACTIVE (Steel Reinforcements)'
      },
      sampleOutputs: {
        'Safety Compliance': '92%',
        'Waste Efficiency Ratio': '70.6%',
        'Critical Alerts': '1 Shortage'
      },
      geminiExplanation: {
        summary: 'Safety perimeters and emergency egress pathways are completely clear. Steel inventory requires reorder.',
        what_this_means: 'Site operations comply with occupational safety benchmarks with zero regulatory violations.',
        recommended_actions: [
          'Authorize purchase order PO-8832 for structural rebar replenishment.',
          'Implement daily scrap metal sorting to improve material recovery rate.'
        ]
      },
      metrics: { compliance: 0.92 }
    },
    {
      id: 'space_optimization',
      title: '2D SPATIAL & LAYOUT AUDIT REPORT',
      desc: 'Optimal 2D layout coordinates, zone allocations, clearance buffers, and spatial efficiency scores.',
      modelType: 'space_optimization',
      icon: Boxes,
      badge: '91.7% EFFICIENCY',
      color: '#E4FF5B',
      sampleInputs: {
        'Site Area (m²)': '1,200 (40m × 30m)',
        'Construction Stage': 'STRUCTURE',
        'Worker Count': 65,
        'Total Machinery Units': 8,
        'Safety Clearance': 'HIGH'
      },
      sampleOutputs: {
        'Space Utilization': '91.7%',
        'Allocated Zones': '7 Structural Zones',
        'Safety Buffer': '5.0m Buffer Clear'
      },
      geminiExplanation: {
        summary: 'Current layout achieves optimal triangular workflow between Crane Hoist, Material Staging, and Active Assembly.',
        what_this_means: 'Travel distance for heavy materials is minimized by 28% compared to unoptimized site configurations.',
        recommended_actions: [
          'Maintain designated 4.0-meter truck turnaround corridor at East perimeter gate.',
          'Position secondary prefab storage adjacent to Crane Radius 01.'
        ]
      },
      metrics: { space_utilization: 0.917 }
    }
  ];

  // Generate Report from Predefined Templates
  const handleGenerateTemplate = async (template: typeof reportTemplates[0]) => {
    setGeneratingId(template.id);
    try {
      const payload: ModelReportPayload = {
        modelType: template.modelType,
        modelName: template.title,
        inputs: template.sampleInputs,
        outputs: template.sampleOutputs,
        geminiExplanation: template.geminiExplanation,
        metrics: template.metrics,
        metadata: {
          project_name: projects.length > 0 ? projects[0].project_name : 'ConArk Systems (Pune)',
          project_id: projects.length > 0 ? projects[0].id : 'CONARK-PUNE-01'
        }
      };

      const res = await generateModelReport(payload);
      setPreviewPdf({ url: res.url, filename: res.filename });
      setIsPreviewOpen(true);
      refreshHistory();
    } catch (e) {
      console.error(e);
      alert('Failed to generate template report.');
    } finally {
      setGeneratingId(null);
    }
  };

  // Filter saved reports by workspace
  const filteredReports = savedReports.filter(r => {
    if (selectedWorkspace === 'ALL') return true;
    return r.project_id === selectedWorkspace;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px 80px', boxSizing: 'border-box' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #111111',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '8px 8px 0px #111111',
        marginBottom: '36px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={18} color="#FF2AA1" />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', color: '#666' }}>
            CONARK DOCUMENTATION & AUDIT SUITE
          </span>
        </div>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(32px, 5vw, 48px)', color: '#111111', textTransform: 'uppercase', margin: '0 0 10px 0', lineHeight: 1.05 }}>
          EXECUTIVE REPORTS & EXPORTS
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#555555', margin: 0, maxWidth: '750px', lineHeight: '1.5' }}>
          Generate, preview, and download formal multi-page PDF intelligence reports. All downloaded records are automatically cataloged below with full prediction parameters, risk indices, and Gemini AI executive analysis.
        </p>
      </div>

      {/* SECTION 1: DOWNLOADED & GENERATED REPORTS HISTORY */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px', marginBottom: '18px', borderBottom: '2.5px solid #111111', paddingBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileDown size={24} color="#111111" />
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '26px', margin: 0, letterSpacing: '0.02em' }}>
                DOWNLOADED & GENERATED RECORDS
              </h2>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#666', margin: '4px 0 0' }}>
              History of all PDF intelligence exports downloaded and generated for your construction workspaces.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Workspace Filter */}
            {projects.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={14} color="#666" />
                <select
                  value={selectedWorkspace}
                  onChange={e => setSelectedWorkspace(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    border: '1.5px solid #111111',
                    borderRadius: '6px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL">All Workspaces ({savedReports.length})</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.project_name}</option>
                  ))}
                </select>
              </div>
            )}

            {savedReports.length > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#FF3366',
                  border: '1.5px solid #FF3366',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Trash2 size={13} /> CLEAR HISTORY
              </button>
            )}
          </div>
        </div>

        {/* Downloaded Reports List */}
        {filteredReports.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px dashed #111111',
            borderRadius: '16px',
            padding: '40px 24px',
            textAlign: 'center',
            boxShadow: '4px 4px 0px #111111'
          }}>
            <FileText size={42} color="#888888" style={{ margin: '0 auto 12px', display: 'block' }} />
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', margin: '0 0 6px', color: '#111111' }}>
              NO DOWNLOADED REPORTS YET
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#666666', maxWidth: '500px', margin: '0 auto 20px' }}>
              Generate any of the executive reports below or run predictions on your models. All generated and downloaded PDF records will be saved here for instant re-download and inspection.
            </p>
            <button
              onClick={() => handleGenerateTemplate(reportTemplates[0])}
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontFamily: 'Anton, sans-serif',
                fontSize: '15px',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={15} /> GENERATE DAILY REPORT NOW
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
            {filteredReports.map((item) => (
              <div
                key={item.report_id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #111111',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '5px 5px 0px #111111',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '10px',
                      fontWeight: '800',
                      backgroundColor: '#111111',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {item.report_id}
                    </span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '10px',
                      fontWeight: '800',
                      backgroundColor: '#E4FF5B',
                      border: '1px solid #111111',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      PDF READY
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', margin: '0 0 6px', color: '#111111', textTransform: 'uppercase', lineHeight: 1.15 }}>
                    {item.modelName}
                  </h3>

                  {item.project_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#666', marginBottom: '8px' }}>
                      <FolderKanban size={13} color="#666" /> {item.project_name}
                    </div>
                  )}

                  <div style={{
                    backgroundColor: '#F9F8F5',
                    border: '1px solid #DDDDDD',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    color: '#333',
                    marginBottom: '10px',
                    lineHeight: '1.4'
                  }}>
                    <strong>Highlight:</strong> {item.predictionSummary}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#888888' }}>
                    <Clock size={12} /> {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1.5px solid #EEEEEE' }}>
                  <button
                    onClick={() => handlePreviewSavedReport(item)}
                    style={{
                      flex: 1,
                      backgroundColor: '#111111',
                      color: '#FFFFFF',
                      border: '1.5px solid #111111',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      fontFamily: 'Anton, sans-serif',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      letterSpacing: '0.03em'
                    }}
                  >
                    <Eye size={14} /> VIEW
                  </button>

                  <button
                    onClick={() => handleDownloadSavedReport(item)}
                    style={{
                      flex: 1,
                      backgroundColor: '#FF2AA1',
                      color: '#FFFFFF',
                      border: '1.5px solid #FF2AA1',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      fontFamily: 'Anton, sans-serif',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      letterSpacing: '0.03em'
                    }}
                  >
                    <Download size={14} /> DOWNLOAD
                  </button>

                  <button
                    onClick={() => handleDeleteReport(item.report_id, item.modelName)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#666666',
                      border: '1.5px solid #111111',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      cursor: 'pointer'
                    }}
                    title="Delete record from history"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: EXECUTIVE REPORT GENERATOR TEMPLATES */}
      <div>
        <div style={{ marginBottom: '18px', borderBottom: '2.5px solid #111111', paddingBottom: '12px' }}>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '26px', margin: 0, letterSpacing: '0.02em' }}>
            GENERATE NEW REPORT TEMPLATES
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#666', margin: '4px 0 0' }}>
            Select an engineering domain below to generate, verify with Gemini AI, and export high-resolution PDF dossiers.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {reportTemplates.map(template => {
            const isGenerating = generatingId === template.id;
            const IconComponent = template.icon;

            return (
              <div
                key={template.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2.5px solid #111111',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '6px 6px 0px #111111',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{
                      backgroundColor: template.color,
                      border: '1.5px solid #111111',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '2px 2px 0px #111111'
                    }}>
                      <IconComponent size={22} color="#111111" />
                    </div>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '11px',
                      fontWeight: '800',
                      backgroundColor: '#111111',
                      color: '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>
                      {template.badge}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', margin: '0 0 8px', color: '#111111', textTransform: 'uppercase', lineHeight: 1.1 }}>
                    {template.title}
                  </h3>

                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#555555', margin: '0 0 16px', lineHeight: '1.45' }}>
                    {template.desc}
                  </p>

                  <div style={{
                    backgroundColor: '#F9F8F5',
                    border: '1px dashed #111111',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#444'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px', fontWeight: 'bold' }}>
                      <CheckCircle2 size={13} color="#15803d" /> Includes Gemini Explanation
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                      <CheckCircle2 size={13} color="#15803d" /> Full Input & Risk Matrix
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleGenerateTemplate(template)}
                    disabled={isGenerating}
                    style={{
                      width: '100%',
                      backgroundColor: isGenerating ? '#EDECE7' : '#111111',
                      color: isGenerating ? '#111111' : '#FFFFFF',
                      fontFamily: 'Anton, sans-serif',
                      fontSize: '16px',
                      padding: '12px',
                      border: '2px solid #111111',
                      borderRadius: '8px',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> GENERATING PDF...
                      </>
                    ) : (
                      <>
                        <Download size={18} /> GENERATE & EXPORT PDF →
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PDF Interactive Preview & Download Modal */}
      {previewPdf && (
        <PdfPreviewModal
          isOpen={isPreviewOpen}
          pdfUrl={previewPdf.url}
          filename={previewPdf.filename}
          onClose={() => setIsPreviewOpen(false)}
          onDownload={() => {
            const a = document.createElement('a');
            a.href = previewPdf.url;
            a.download = previewPdf.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            refreshHistory();
          }}
        />
      )}
    </div>
  );
};

export default ReportsPage;
