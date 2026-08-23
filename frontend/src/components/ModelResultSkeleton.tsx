import React from 'react';
import { Cpu, Bot } from 'lucide-react';

interface ModelResultSkeletonProps {
  isSpaceOpt?: boolean;
  modelTitle?: string;
}

export const ModelResultSkeleton: React.FC<ModelResultSkeletonProps> = ({
  isSpaceOpt = false,
  modelTitle = 'PREDICTIVE INFERENCE ENGINE'
}) => {
  return (
    <div
      className="animate-result-appear"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Dynamic 2D Site Map Skeleton (If Space/Optimization Model) */}
      {isSpaceOpt && (
        <div
          className="card-responsive-padding"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2.5px dashed #111111',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Header Title Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="skeleton-shimmer" style={{ width: '220px', height: '24px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#111111', color: '#FFFFFF', padding: '4px 12px', borderRadius: '4px' }}>
              <div className="streaming-pulse-dot" style={{ backgroundColor: '#E4FF5B', width: '7px', height: '7px' }} />
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', letterSpacing: '0.05em' }}>
                SCIPY SLSQP SOLVER RUNNING...
              </span>
            </div>
          </div>

          {/* 3-Metric Banner Skeleton */}
          <div className="metrics-banner-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[1, 2, 3].map((idx) => (
              <div key={idx} style={{ backgroundColor: '#EDECE7', border: '1.5px solid #111111', borderRadius: '8px', padding: '10px 12px' }}>
                <div className="skeleton-shimmer" style={{ width: '65%', height: '10px', marginBottom: '8px' }} />
                <div className="skeleton-shimmer" style={{ width: '45%', height: '22px' }} />
              </div>
            ))}
          </div>

          {/* Dark 2D Blueprint Canvas Skeleton */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '360px',
              backgroundColor: '#111111',
              borderRadius: '12px',
              border: '2px solid #111111',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 25px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px'
            }}
          >
            {/* Grid overlay shimmer zone outlines */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '10px', width: '100%', height: '300px' }}>
              {[1, 2, 3, 4, 5, 6].map((zoneIdx) => (
                <div
                  key={zoneIdx}
                  className="skeleton-shimmer-dark"
                  style={{
                    borderRadius: '8px',
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '8px',
                    gap: '6px'
                  }}
                >
                  <div className="skeleton-shimmer-dark" style={{ width: '60%', height: '10px' }} />
                  <div className="skeleton-shimmer-dark" style={{ width: '35%', height: '8px' }} />
                </div>
              ))}
            </div>

            <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.85)', border: '1.5px solid #E4FF5B', padding: '8px 16px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
              <Cpu size={16} color="#E4FF5B" />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 'bold', color: '#E4FF5B' }}>
                OPTIMIZING 8-ZONE GEOMETRIC PLACEMENT...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Model Output Primary Metric Card Skeleton */}
      <div
        className="card-responsive-padding"
        style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px dashed #111111',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Model Badge Strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px' }}>
              02 / MODEL OUTPUT
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#555555' }}>
              {modelTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#EDECE7', border: '1px solid #111111', padding: '3px 8px', borderRadius: '4px' }}>
            <div className="streaming-pulse-dot" style={{ width: '6px', height: '6px' }} />
            <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold' }}>
              INFERENCE ACTIVE
            </span>
          </div>
        </div>

        {/* Primary Prediction Large Card Placeholder */}
        <div
          style={{
            backgroundColor: '#EDECE7',
            border: '2px solid #111111',
            borderRadius: '12px',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton-shimmer" style={{ width: '40%', height: '14px' }} />
            <div className="skeleton-shimmer" style={{ width: '20%', height: '14px' }} />
          </div>
          <div className="skeleton-shimmer" style={{ width: '70%', height: '38px', borderRadius: '8px' }} />
          <div className="skeleton-shimmer" style={{ width: '50%', height: '12px' }} />
        </div>

        {/* Key Influencing Factors / Telemetry Skeletons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="skeleton-shimmer" style={{ width: '30%', height: '14px', marginBottom: '4px' }} />
          {[1, 2, 3].map((itemIdx) => (
            <div
              key={itemIdx}
              style={{
                backgroundColor: '#FAFAF8',
                border: '1.5px solid #111111',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skeleton-shimmer" style={{ width: '45%', height: '12px' }} />
                <div className="skeleton-shimmer" style={{ width: '15%', height: '12px' }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: '100%', height: '8px', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Gemini AI Grounded Analysis Skeleton Card */}
      <div
        className="card-responsive-padding"
        style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px dashed #111111',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Gemini Header Strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px' }}>
              03 / GEMINI 2.5 FLASH GROUNDED EXPLANATION
            </span>
          </div>
          <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#4FC3F7', color: '#111111', padding: '3px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Bot size={13} />
            SYNTHESIZING ANALYSIS...
          </span>
        </div>

        {/* Main Narrative Explanation Paragraph Skeleton */}
        <div
          style={{
            backgroundColor: '#EDECE7',
            borderLeft: '4px solid #111111',
            padding: '18px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div className="skeleton-shimmer" style={{ width: '96%', height: '14px' }} />
          <div className="skeleton-shimmer" style={{ width: '90%', height: '14px' }} />
          <div className="skeleton-shimmer" style={{ width: '75%', height: '14px' }} />
        </div>

        {/* Key Findings List Skeleton */}
        <div style={{ marginBottom: '20px' }}>
          <div className="skeleton-shimmer" style={{ width: '35%', height: '16px', marginBottom: '12px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3].map((fIdx) => (
              <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="skeleton-shimmer" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                <div className="skeleton-shimmer" style={{ width: `${85 - fIdx * 10}%`, height: '12px' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Checklist Skeleton */}
        <div>
          <div className="skeleton-shimmer" style={{ width: '40%', height: '16px', marginBottom: '12px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[1, 2, 3].map((actIdx) => (
              <div
                key={actIdx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #111111',
                  padding: '10px 14px',
                  borderRadius: '8px'
                }}
              >
                <div className="skeleton-shimmer" style={{ width: '18px', height: '18px', borderRadius: '4px' }} />
                <div className="skeleton-shimmer" style={{ width: `${75 - actIdx * 8}%`, height: '13px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
