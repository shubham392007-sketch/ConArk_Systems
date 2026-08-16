import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { X, Download, ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// Set up PDF.js worker URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PdfPreviewModalProps {
  pdfUrl: string | null;
  filename: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  pdfUrl,
  filename,
  isOpen,
  onClose,
  onDownload
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Load PDF Document when pdfUrl changes
  useEffect(() => {
    if (!isOpen || !pdfUrl) return;

    let isSubscribed = true;
    setLoading(true);
    setRenderError(null);

    const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
    loadingTask.promise
      .then(doc => {
        if (!isSubscribed) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch(err => {
        if (!isSubscribed) return;
        console.error('PDF.js render error:', err);
        setRenderError('Failed to load PDF preview. Click Download PDF to open directly.');
        setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [pdfUrl, isOpen]);

  // Render Page on Canvas
  const renderPage = useCallback(() => {
    if (!pdfDoc || !canvasRef.current) return;

    pdfDoc.getPage(currentPage).then(page => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport,
        canvas
      };

      page.render(renderContext);
    });
  }, [pdfDoc, currentPage, scale]);

  useEffect(() => {
    if (pdfDoc && !loading) {
      renderPage();
    }
  }, [pdfDoc, currentPage, scale, loading, renderPage]);

  // Keyboard navigation & zoom
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      setCurrentPage(prev => Math.max(1, prev - 1));
    } else if (e.key === 'ArrowRight') {
      setCurrentPage(prev => Math.min(numPages, prev + 1));
    } else if (e.key === '+' || e.key === '=') {
      setScale(prev => Math.min(2.5, prev + 0.2));
    } else if (e.key === '-') {
      setScale(prev => Math.max(0.6, prev - 0.2));
    }
  }, [isOpen, numPages, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(17, 17, 17, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      aria-label="ConArk PDF Preview Modal"
      role="dialog"
      aria-modal="true"
    >
      {/* Container Window */}
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '92vh',
          backgroundColor: '#EDECE7',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            backgroundColor: '#111111',
            color: '#FFFFFF',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #111111'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 'bold'
              }}
              aria-label="Back to report"
            >
              <ArrowLeft size={16} /> ← REPORT
            </button>
            <span style={{ color: '#444444', fontSize: '14px' }}>|</span>
            <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', letterSpacing: '0.04em' }}>
              CONARK PDF VIEWER
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onDownload}
              style={{
                backgroundColor: '#E4FF5B',
                color: '#111111',
                fontFamily: 'Anton, sans-serif',
                fontSize: '14px',
                padding: '6px 16px',
                borderRadius: '6px',
                border: '1.5px solid #111111',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
              aria-label="Download ConArk report as PDF"
            >
              <Download size={16} /> DOWNLOAD PDF
            </button>
            <button
              onClick={onClose}
              style={{ color: '#FFFFFF', padding: '4px', cursor: 'pointer' }}
              aria-label="Close PDF preview"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Toolbar Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1.5px solid #111111',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            fontWeight: 'bold',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          {/* Page Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{
                padding: '4px 8px',
                border: '1px solid #111111',
                borderRadius: '4px',
                backgroundColor: currentPage <= 1 ? '#E0E0E0' : '#EDECE7',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
              }}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span>PAGE {currentPage} OF {numPages}</span>
            <button
              disabled={currentPage >= numPages}
              onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
              style={{
                padding: '4px 8px',
                border: '1px solid #111111',
                borderRadius: '4px',
                backgroundColor: currentPage >= numPages ? '#E0E0E0' : '#EDECE7',
                cursor: currentPage >= numPages ? 'not-allowed' : 'pointer'
              }}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setScale(prev => Math.max(0.6, prev - 0.2))}
              style={{ padding: '4px 8px', border: '1px solid #111111', borderRadius: '4px', backgroundColor: '#EDECE7' }}
              aria-label="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <span>{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(prev => Math.min(2.5, prev + 0.2))}
              style={{ padding: '4px 8px', border: '1px solid #111111', borderRadius: '4px', backgroundColor: '#EDECE7' }}
              aria-label="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setScale(1.0)}
              style={{ padding: '4px 10px', border: '1px solid #111111', borderRadius: '4px', backgroundColor: '#EDECE7', fontSize: '11px' }}
              aria-label="Fit width"
            >
              <Maximize2 size={12} style={{ display: 'inline', marginRight: '4px' }} /> FIT
            </button>
          </div>

          {/* Filename Tag */}
          <div style={{ fontSize: '11px', color: '#555555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
            {filename}
          </div>
        </div>

        {/* PDF Viewer Body Canvas Scroll Area */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            backgroundColor: '#888888'
          }}
        >
          {loading && (
            <div style={{ color: '#FFFFFF', fontFamily: 'Anton, sans-serif', fontSize: '20px', marginTop: '60px' }}>
              RENDERING CONARK PDF REPORT...
            </div>
          )}

          {renderError && (
            <div style={{ textAlign: 'center', backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '2px solid #111111' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', color: '#DC2626', marginBottom: '14px' }}>
                {renderError}
              </p>
              <button
                onClick={onDownload}
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '16px'
                }}
              >
                DOWNLOAD PDF DIRECTLY
              </button>
            </div>
          )}

          <canvas
            ref={canvasRef}
            style={{
              display: loading || renderError ? 'none' : 'block',
              boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
              borderRadius: '4px',
              backgroundColor: '#EDECE7'
            }}
          />
        </div>
      </div>
    </div>
  );
};
