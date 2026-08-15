import React, { useState } from 'react';
import { Download, Eye, FileText } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [readyReports, setReadyReports] = useState<Record<string, boolean>>({});

  const reports = [
    { id: 'daily', title: 'DAILY REPORT', desc: "Summary of today's project intelligence.", date: '2026-08-15 10:00' },
    { id: 'weekly', title: 'WEEKLY REPORT', desc: 'Weekly overview and trend analysis.', date: '2026-08-10 10:00' },
    { id: 'risk', title: 'RISK REPORT', desc: 'Detailed risk analysis and recommendations.', date: '2026-08-15 08:00' },
    { id: 'cost', title: 'COST REPORT', desc: 'Cost deviation and forecast analysis.', date: '2026-08-15 08:00' },
    { id: 'safety', title: 'SAFETY REPORT', desc: 'Safety metrics and incident summary.', date: '2026-08-15 08:00' },
    { id: 'ai_summary', title: 'AI SUMMARY', desc: 'AI-generated project summary.', date: '2026-08-15 12:00' }
  ];

  const handleGenerate = (id: string) => {
    setGeneratingReport(id);
    setTimeout(() => {
      setGeneratingReport(null);
      setReadyReports(prev => ({ ...prev, [id]: true }));
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px 48px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', borderBottom: '2px solid #111111', paddingBottom: '16px' }}>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '48px', color: '#111111', textTransform: 'uppercase' }}>
          REPORTS
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#555555' }}>
          Turn project intelligence into usable records.
        </p>
      </div>

      {/* Report Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {reports.map(r => {
          const isReady = readyReports[r.id];
          const isGenerating = generatingReport === r.id;

          return (
            <div
              key={r.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #111111',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111', textTransform: 'uppercase' }}>
                    {r.title}
                  </h3>
                  <FileText size={20} color="#111111" />
                </div>
                <p style={{ fontSize: '13px', color: '#555555', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
                  {r.desc}
                </p>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#777777', marginBottom: '20px' }}>
                  Last generated: {r.date}
                </div>
              </div>

              <div>
                {isGenerating ? (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      backgroundColor: '#EDECE7',
                      color: '#111111',
                      fontFamily: 'Anton, sans-serif',
                      fontSize: '14px',
                      padding: '10px',
                      border: '1.5px solid #111111',
                      borderRadius: '6px'
                    }}
                  >
                    GENERATING REPORT...
                  </button>
                ) : isReady ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => alert(`Viewing ${r.title}`)}
                      style={{ flex: 1, backgroundColor: '#111111', color: '#FFFFFF', padding: '10px', borderRadius: '6px', border: 'none', fontFamily: 'Anton, sans-serif', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <Eye size={14} /> VIEW
                    </button>
                    <button
                      onClick={() => alert(`Downloading ${r.title} PDF`)}
                      style={{ flex: 1, backgroundColor: '#FF2AA1', color: '#FFFFFF', padding: '10px', borderRadius: '6px', border: 'none', fontFamily: 'Anton, sans-serif', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <Download size={14} /> DOWNLOAD
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleGenerate(r.id)}
                    style={{
                      width: '100%',
                      backgroundColor: '#111111',
                      color: '#FFFFFF',
                      fontFamily: 'Anton, sans-serif',
                      fontSize: '14px',
                      padding: '10px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    GENERATE →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
