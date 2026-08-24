import React from 'react';

/**
 * Skeleton loader for the Prediction History Page (/history).
 * Renders multiple neo-brutalist card skeletons with shimmering badges, metric pills, and action buttons.
 */
export const HistoryListSkeleton: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Active Loading Header Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid #111111',
        borderRadius: '10px',
        padding: '12px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '4px 4px 0px #111111'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="streaming-pulse-dot" style={{ backgroundColor: '#FF2AA1', width: '9px', height: '9px' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: '800', color: '#111111', letterSpacing: '0.04em' }}>
            QUERYING SUPABASE TELEMETRY & PERSISTENT PREDICTIONS...
          </span>
        </div>
        <div className="skeleton-shimmer" style={{ width: '90px', height: '18px' }} />
      </div>

      {/* Shimmering History Cards */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            backgroundColor: '#FFFFFF',
            border: '2.5px solid #111111',
            borderRadius: '14px',
            padding: '20px 24px',
            boxShadow: '6px 6px 0px #111111',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          {/* Top Row: Badges & Timestamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div className="skeleton-shimmer" style={{ width: '140px', height: '24px', borderRadius: '6px' }} />
              <div className="skeleton-shimmer" style={{ width: '100px', height: '24px', borderRadius: '6px' }} />
            </div>
            <div className="skeleton-shimmer" style={{ width: '120px', height: '16px' }} />
          </div>

          {/* Middle Row: Title & Subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="skeleton-shimmer" style={{ width: `${65 + (i * 7) % 25}%`, height: '20px' }} />
            <div className="skeleton-shimmer" style={{ width: `${40 + (i * 11) % 30}%`, height: '14px' }} />
          </div>

          {/* Metric Pills Row */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[1, 2, 3].map((m) => (
              <div
                key={m}
                className="skeleton-shimmer"
                style={{ width: '110px', height: '28px', borderRadius: '6px' }}
              />
            ))}
          </div>

          {/* Bottom Actions Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed #DDD' }}>
            <div className="skeleton-shimmer" style={{ width: '130px', height: '14px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="skeleton-shimmer" style={{ width: '95px', height: '32px', borderRadius: '6px' }} />
              <div className="skeleton-shimmer" style={{ width: '36px', height: '32px', borderRadius: '6px' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton loader for the Project Workspaces Page (/projects).
 */
export const ProjectsListSkeleton: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Loading Status Pill */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid #111111',
        borderRadius: '10px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '4px 4px 0px #111111'
      }}>
        <div className="streaming-pulse-dot" style={{ backgroundColor: '#E4FF5B', width: '9px', height: '9px' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: '800', color: '#111111', letterSpacing: '0.04em' }}>
          LOADING CONARK WORKSPACES & DATA ARTIFACTS...
        </span>
      </div>

      {/* Grid of Shimmering Project Workspace Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFFFFF',
              border: '2.5px solid #111111',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '6px 6px 0px #111111',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton-shimmer" style={{ width: '80px', height: '22px', borderRadius: '9999px' }} />
              <div className="skeleton-shimmer" style={{ width: '60px', height: '16px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton-shimmer" style={{ width: '75%', height: '24px' }} />
              <div className="skeleton-shimmer" style={{ width: '90%', height: '14px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="skeleton-shimmer" style={{ height: '54px', borderRadius: '8px' }} />
              <div className="skeleton-shimmer" style={{ height: '54px', borderRadius: '8px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed #DDD' }}>
              <div className="skeleton-shimmer" style={{ width: '80px', height: '16px' }} />
              <div className="skeleton-shimmer" style={{ width: '110px', height: '36px', borderRadius: '6px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton loader for the Single Prediction Inspection Page (/history/:id).
 */
export const PredictionDetailSkeleton: React.FC = () => {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px 80px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-shimmer" style={{ width: '140px', height: '36px', borderRadius: '6px' }} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="skeleton-shimmer" style={{ width: '120px', height: '36px', borderRadius: '6px' }} />
          <div className="skeleton-shimmer" style={{ width: '100px', height: '36px', borderRadius: '6px' }} />
        </div>
      </div>

      {/* Main Header Banner Skeleton */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #111111',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '8px 8px 0px #111111',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="skeleton-shimmer" style={{ width: '150px', height: '24px', borderRadius: '9999px' }} />
          <div className="skeleton-shimmer" style={{ width: '110px', height: '24px', borderRadius: '9999px' }} />
        </div>
        <div className="skeleton-shimmer" style={{ width: '60%', height: '36px' }} />
        <div className="skeleton-shimmer" style={{ width: '40%', height: '16px' }} />
      </div>

      {/* 2-Column Content Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Input Telemetry Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '6px 6px 0px #111111',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div className="skeleton-shimmer" style={{ width: '50%', height: '24px' }} />
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="skeleton-shimmer" style={{ width: '40%', height: '16px' }} />
              <div className="skeleton-shimmer" style={{ width: '25%', height: '16px' }} />
            </div>
          ))}
        </div>

        {/* Right: Output & Explanation Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '6px 6px 0px #111111',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div className="skeleton-shimmer" style={{ width: '60%', height: '24px' }} />
          <div className="skeleton-shimmer" style={{ width: '100%', height: '80px', borderRadius: '8px' }} />
          <div className="skeleton-shimmer" style={{ width: '100%', height: '100px', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
};
