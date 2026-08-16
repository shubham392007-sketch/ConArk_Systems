import React, { useState } from 'react';
import { Download, Eye, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import type { ModelReportPayload } from '../../services/pdf/reportTypes';
import { generateModelReport } from '../../services/pdf/reportGenerator';
import { PdfPreviewModal } from './PdfPreviewModal';

interface ReportActionBannerProps {
  payload: ModelReportPayload;
}

export const ReportActionBanner: React.FC<ReportActionBannerProps> = ({ payload }) => {
  const [generating, setGenerating] = useState<boolean>(false);
  const [pdfData, setPdfData] = useState<{ url: string; filename: string } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePdf = async (autoOpenPreview = false) => {
    if (pdfData && autoOpenPreview) {
      setIsPreviewOpen(true);
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const res = await generateModelReport(payload);
      setPdfData({ url: res.url, filename: res.filename });
      setGenerating(false);

      if (autoOpenPreview) {
        setIsPreviewOpen(true);
      } else {
        // Trigger browser download
        const a = document.createElement('a');
        a.href = res.url;
        a.download = res.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      setError('FAILED TO GENERATE PDF');
      setGenerating(false);
    }
  };

  const handleDownloadDirect = () => {
    if (pdfData) {
      const a = document.createElement('a');
      a.href = pdfData.url;
      a.download = pdfData.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      handleGeneratePdf(false);
    }
  };

  return (
    <>
      <div
        className="card-responsive-padding"
        style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px dashed #111111',
          borderRadius: '20px',
          padding: '24px 28px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} color="#111111" />
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111', textTransform: 'uppercase' }}>
              OFFICIAL CONARK INTELLIGENCE REPORT
            </h3>
          </div>
          <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
            PDF READY
          </span>
        </div>

        <p style={{ fontSize: '13px', color: '#555555', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
          Your ConArk intelligence report is ready for viewing and download. Includes complete telemetry inputs, ML model predictions, risk indicators, and Gemini AI contextual analysis.
        </p>

        {/* Feature Checkmarks */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 18px', marginBottom: '20px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111111' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={14} color="#15803d" /> Input Data</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={14} color="#15803d" /> Model Prediction</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={14} color="#15803d" /> Confidence & Metrics</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={14} color="#15803d" /> Risk Indicators</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={14} color="#15803d" /> Gemini AI Explanation</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={14} color="#15803d" /> Recommendations</span>
        </div>

        {error && (
          <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#DC2626', fontWeight: 'bold', marginBottom: '12px' }}>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', width: '100%' }}>
          {/* VIEW REPORT Button (Secondary) */}
          <button
            onClick={() => handleGeneratePdf(true)}
            disabled={generating}
            style={{
              flex: '1 1 180px',
              minHeight: '44px',
              backgroundColor: '#EDECE7',
              color: '#111111',
              fontFamily: 'Anton, sans-serif',
              fontSize: '16px',
              border: '2px solid #111111',
              borderRadius: '8px',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: generating ? 'not-allowed' : 'pointer',
              letterSpacing: '0.04em'
            }}
            aria-label="View ConArk report preview"
          >
            {generating ? (
              <>
                <Loader2 size={18} className="animate-spin" /> GENERATING...
              </>
            ) : (
              <>
                <Eye size={18} /> VIEW REPORT
              </>
            )}
          </button>

          {/* DOWNLOAD REPORT Button (Primary) */}
          <button
            onClick={handleDownloadDirect}
            disabled={generating}
            style={{
              flex: '1 1 200px',
              minHeight: '44px',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              fontFamily: 'Anton, sans-serif',
              fontSize: '16px',
              border: '2px solid #111111',
              borderRadius: '8px',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: generating ? 'not-allowed' : 'pointer',
              letterSpacing: '0.04em'
            }}
            aria-label="Download ConArk report as PDF"
          >
            {generating ? (
              <>
                <Loader2 size={18} className="animate-spin" /> GENERATING PDF...
              </>
            ) : (
              <>
                <Download size={18} /> DOWNLOAD REPORT ↓
              </>
            )}
          </button>
        </div>
      </div>

      {/* PDF.js Preview Modal */}
      <PdfPreviewModal
        pdfUrl={pdfData?.url || null}
        filename={pdfData?.filename || 'ConArk_Report.pdf'}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={handleDownloadDirect}
      />
    </>
  );
};
