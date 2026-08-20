import React from 'react';
import { ShieldCheck, Key } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HERO SECTION */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '3px solid #111111',
        borderRadius: '16px',
        padding: '36px',
        marginBottom: '32px',
        boxShadow: '8px 8px 0px #111111'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#7CFFA6', color: '#111111', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', marginBottom: '16px' }}>
          <ShieldCheck size={16} /> SERVER-SIDE ISOLATION
        </div>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '42px', margin: '0 0 10px 0', letterSpacing: '0.04em', color: '#111111' }}>
          CONARK SECURITY & SECRET PROTECTION
        </h1>
        <p style={{ fontSize: '16px', color: '#444444', lineHeight: '1.6', margin: 0 }}>
          Overview of ConArk Systems data handling practices, input validation, and server-side secret isolation standards.
        </p>
      </div>

      {/* HIGHLIGHTED SECRET PROTECTION BOX */}
      <div style={{
        backgroundColor: '#111111',
        color: '#FFFFFF',
        border: '3px solid #111111',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '36px',
        boxShadow: '6px 6px 0px #FF2AA1'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E4FF5B', fontFamily: 'Anton, sans-serif', fontSize: '20px', marginBottom: '12px' }}>
          <Key size={22} /> CRITICAL SECURITY REQUIREMENT: SERVER-SIDE SECRET ISOLATION
        </div>
        <p style={{ fontSize: '14px', color: '#DDDDDD', lineHeight: '1.6', marginBottom: '16px' }}>
          ConArk Systems strictly enforces server-side secret isolation. Neither Google Gemini API keys nor OpenRouter API keys are EVER embedded in frontend client JavaScript bundles.
        </p>

        <div style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333', padding: '14px', borderRadius: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12.5px', color: '#7CFFA6' }}>
          # Server-Side Only (.env)<br />
          GEMINI_API_KEY_OPTIMIZATION=AQ.Ab8RN6JsQsJT...<br />
          OPENROUTER_API_KEY=sk-or-v1-84a129...<br />
          <span style={{ color: '#888888' }}># Never exposed to Vite client environment variables (VITE_*)</span>
        </div>
      </div>

      {/* 16 DETAILED SECURITY SECTIONS */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid #111111',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '6px 6px 0px #111111',
        lineHeight: '1.7',
        color: '#222222',
        fontSize: '15px'
      }}>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '0', color: '#111' }}>
          1. SECURITY PHILOSOPHY
        </h2>
        <p>
          We follow defensive security principles: minimal surface exposure, server-side secret encapsulation, and strict parameter input validation.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          2. DATA PROTECTION IN TRANSIT
        </h2>
        <p>
          All communications between the browser client and the backend FastAPI server utilize TLS/HTTPS transport encryption.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          3. API KEY PROTECTION
        </h2>
        <p>
          External AI keys are loaded exclusively by the Python backend (`conark.config.settings`). No frontend network request ever transmits raw API keys across public internet routes.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          4. AUTHENTICATION & ACCESS CONTROL
        </h2>
        <p>
          The current research prototype operates on open access routes. For production enterprise deployments, OAuth2 bearer token authentication can be enabled via FastAPI security dependencies.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          5. AUTHORIZATION SCOPING
        </h2>
        <p>
          API routes enforce strict HTTP verb binding (`POST` for analysis and optimization, `GET` for system health checks).
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          6. INPUT VALIDATION & SANITIZATION
        </h2>
        <p>
          FastAPI uses Pydantic schema validation to verify that numerical inputs (e.g. Concrete Grade, Seismic Zone) fall within physically realistic bounds before passing data to ML estimators.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          7. API SECURITY & CORS
        </h2>
        <p>
          Cross-Origin Resource Sharing (CORS) is configured via `CORSMiddleware` in FastAPI to prevent unauthorized cross-domain scripting access.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          8. RATE LIMITING & THROTTLING
        </h2>
        <p>
          To prevent denial-of-service degradation, backend endpoints enforce request throttling on high-frequency prediction invocations.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          9. SECRETS MANAGEMENT
        </h2>
        <p>
          Environment variables are stored in root `.env` files which are strictly excluded from git revision history via `.gitignore`.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          10. SYSTEM LOGGING & AUDITING
        </h2>
        <p>
          System logs capture timestamped operational events while redacting sensitive environment values or full telemetry payloads.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          11. ERROR HANDLING & EXCEPTION ISOLATION
        </h2>
        <p>
          Global exception handlers intercept runtime exceptions, returning standardized JSON error payloads without leaking internal Python stack trace details to end users.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          12. THIRD-PARTY AI SERVICE ISOLATION
        </h2>
        <p>
          Outgoing requests to Google Gemini and OpenRouter use standard HTTP client libraries (`google-genai`, `requests`) with explicit timeout bounds (30 seconds) to prevent server hangs.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          13. MODEL SECURITY & ARTIFACT INTEGRITY
        </h2>
        <p>
          Pretrained scikit-learn model weights (`.joblib` files) are stored in restricted local directory paths (`/models/`) and verified upon server startup.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          14. AI SECURITY & PROMPT INJECTION DEFENSE
        </h2>
        <p>
          System prompts sent to Gemini 1.5 Flash explicitly instruct the model to operate strictly as a data explainer and reject system override commands embedded within user inputs.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          15. RESPONSIBLE AI STANDARDS
        </h2>
        <p>
          We adhere to transparent AI practices: model predictions are accompanied by confidence metrics, clear disclaimers, and human engineering verification notices.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', borderBottom: '2px solid #111', paddingBottom: '4px', marginTop: '24px', color: '#111' }}>
          16. VULNERABILITY REPORTING
        </h2>
        <p>
          If you discover a security vulnerability, please notify the ConArk engineering team directly:
        </p>
        <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', padding: '14px', borderRadius: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#0369A1' }}>
          Contact Lead: Shubham Pokale & Siddhesh Birewar<br />
          Email: shubham.pokale25@pccopepune.org / siddhesh.birewar25@pccoepune.org<br />
          Project: ConArk Systems Research Platform
        </div>

      </div>

    </div>
  );
};
