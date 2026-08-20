import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Home, Cpu } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '80px auto',
      padding: '0 24px',
      textAlign: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '3px solid #111111',
        borderRadius: '20px',
        padding: '50px 36px',
        boxShadow: '10px 10px 0px #FF2AA1'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FF2AA1', color: '#FFFFFF', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', marginBottom: '20px' }}>
          <AlertTriangle size={18} /> ERROR 404
        </div>

        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '54px', color: '#111111', margin: '0 0 16px 0', letterSpacing: '0.04em' }}>
          PAGE NOT FOUND
        </h1>

        <p style={{ fontSize: '20px', color: '#444444', lineHeight: '1.6', margin: '0 0 36px 0', fontFamily: 'Anton, sans-serif', letterSpacing: '0.02em' }}>
          "Looks like this construction plan took a wrong turn."
        </p>

        <p style={{ fontSize: '14px', color: '#666666', lineHeight: '1.5', margin: '0 0 36px 0', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          The requested blueprint route does not exist or has been relocated. Return to the main command center or explore our predictive ML intelligence models.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Link to="/" style={{
            backgroundColor: '#111111',
            color: '#FFFFFF',
            padding: '14px 28px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
            fontWeight: '800',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '4px 4px 0px #FF2AA1'
          }}>
            <Home size={18} /> BACK TO CONARK
          </Link>

          <Link to="/models" style={{
            backgroundColor: '#E4FF5B',
            color: '#111111',
            border: '2px solid #111111',
            padding: '14px 28px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
            fontWeight: '800',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '4px 4px 0px #111111'
          }}>
            <Cpu size={18} /> EXPLORE MODELS <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
};
