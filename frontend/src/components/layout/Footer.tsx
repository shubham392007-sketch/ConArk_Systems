import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, HelpCircle, FileText, ArrowUpRight, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#111111',
      color: '#FFFFFF',
      borderTop: '3px solid #FF2AA1',
      padding: '48px 32px 32px 32px',
      marginTop: 'auto',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        maxWidth: '1500px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}>
        
        {/* TOP SECTION: BRAND & MULTI-COLUMN NAVIGATION */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          borderBottom: '1px solid #333333',
          paddingBottom: '40px'
        }}>
          
          {/* BRAND COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#FF2AA1',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontFamily: 'Anton, sans-serif',
                fontSize: '18px',
                color: '#FFFFFF'
              }}>
                CS
              </div>
              <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '24px', letterSpacing: '0.04em', color: '#FFFFFF' }}>
                CONARK SYSTEMS
              </span>
            </div>

            <div style={{
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: '800',
              color: '#FF2AA1',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              AI-Driven Construction Intelligence
            </div>

            <p style={{ fontSize: '13px', color: '#AAAAAA', lineHeight: '1.6', margin: 0 }}>
              "Predict. Analyze. Optimize. Explain."
            </p>

            <div style={{
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
              color: '#777777',
              backgroundColor: '#1A1A1A',
              border: '1px solid #333333',
              padding: '8px 12px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Cpu size={14} color="#7CFFA6" />
              <span>Gemma 4 · Gemini 1.5 · SciPy Solver</span>
            </div>
          </div>

          {/* COLUMN 1: PRODUCT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '16px', color: '#E4FF5B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              PRODUCT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <Link to="/model/performance" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Performance Intelligence</Link>
              <Link to="/model/risk" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Risk Intelligence</Link>
              <Link to="/model/cost" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Cost & Time Intelligence</Link>
              <Link to="/alerts" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Safety & Resource Intelligence</Link>
              <Link to="/model/optimization" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Project Optimization</Link>
              <Link to="/space-optimization" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Space Optimization</Link>
              <Link to="/construction-ai" style={{ color: '#FF2AA1', textDecoration: 'none', fontWeight: 'bold' }}>ConArk Intelligence (AI Q&A)</Link>
            </div>
          </div>

          {/* COLUMN 2: SUPPORT & RESOURCES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '16px', color: '#4FC3F7', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              SUPPORT & RESOURCES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <Link to="/help" style={{ color: '#CCCCCC', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={14} color="#4FC3F7" /> Help & Support
              </Link>
              <Link to="/faq" style={{ color: '#CCCCCC', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} color="#4FC3F7" /> FAQ's
              </Link>
              <Link to="/docs" style={{ color: '#CCCCCC', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} color="#4FC3F7" /> Docs
              </Link>
              <Link to="/security" style={{ color: '#CCCCCC', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} color="#7CFFA6" /> Security
              </Link>
            </div>
          </div>

          {/* COLUMN 3: LEGAL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '16px', color: '#7CFFA6', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              LEGAL
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <Link to="/privacy" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Terms of Service</Link>
              <Link to="/disclaimer" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Disclaimer & Disclosure</Link>
            </div>
          </div>

          {/* COLUMN 4: COMPANY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '16px', color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              COMPANY
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <Link to="/brains" style={{ color: '#CCCCCC', textDecoration: 'none' }}>About ConArk</Link>
              <Link to="/brains#developers" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Developers</Link>
              <Link to="/help#contact" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Contact Team</Link>
              <a href="https://github.com/shubham392007-sketch/ConArk_Systems" target="_blank" rel="noopener noreferrer" style={{ color: '#CCCCCC', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                GitHub Repository <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM STRIP */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '12px',
          color: '#888888',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          <div>
            © 2026 ConArk Systems. All rights reserved.
          </div>

          <div style={{ color: '#CCCCCC' }}>
            Built for intelligent construction decision support.
          </div>
        </div>

      </div>
    </footer>
  );
};
