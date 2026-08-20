import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER CARD */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '3px solid #111111',
        borderRadius: '16px',
        padding: '36px',
        marginBottom: '32px',
        boxShadow: '8px 8px 0px #111111'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#7CFFA6', color: '#111111', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', marginBottom: '16px' }}>
          <Shield size={16} /> PRIVACY & DATA POLICY
        </div>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '42px', margin: '0 0 10px 0', letterSpacing: '0.04em', color: '#111111' }}>
          PRIVACY POLICY
        </h1>
        <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#666666', marginBottom: '16px' }}>
          LAST UPDATED: AUGUST 20, 2026 · VERSION 1.0.0 (RESEARCH PROTOTYPE)
        </div>
        <p style={{ fontSize: '15px', color: '#444444', lineHeight: '1.6', margin: 0 }}>
          This Privacy Policy outlines how ConArk Systems ("we", "our", or "the Platform") collects, processes, and protects information submitted when accessing our predictive construction intelligence tools.
        </p>
      </div>

      {/* POLICY CONTENT CONTAINER */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid #111111',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '6px 6px 0px #111111',
        lineHeight: '1.7',
        color: '#222222',
        fontSize: '15px'
      }}>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '0', color: '#111' }}>
          1. INTRODUCTION
        </h2>
        <p>
          ConArk Systems operates an AI-driven construction decision-support research platform. We prioritize data privacy and server-side isolation for all project input telemetries.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          2. INFORMATION WE MAY COLLECT
        </h2>
        <p>
          Depending on your interaction with the Platform, we may collect:
        </p>
        <ul>
          <li><strong>Project Telemetry Data:</strong> Numerical parameters submitted via input forms (e.g., Concrete Grade, Seismic Zone, Ambient Temperature, Workforce Count).</li>
          <li><strong>Technical Logs:</strong> Server access logs including IP address, browser user-agent, timestamp, and requested API routes.</li>
          <li><strong>Conversational Queries:</strong> Text messages submitted to the ConArk Intelligence Q&A feature.</li>
        </ul>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          3. PROJECT INPUT DATA
        </h2>
        <p>
          Project inputs (such as site laydown areas or material schedules) are processed in-memory by our machine learning models to generate real-time predictions. They are not sold, traded, or shared with third-party advertisers.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          4. ACCOUNT INFORMATION
        </h2>
        <p>
          The current ConArk prototype operates on an open research model without requiring user account creation or password storage.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          5. TECHNICAL INFORMATION & LOGGING
        </h2>
        <p>
          Standard HTTP logs are collected for debugging, error diagnostics, and rate-limiting enforcement. Logs are auto-rotated and periodically deleted.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          6. AI INTERACTION DATA
        </h2>
        <p>
          When you request an AI explanation or chat with ConArk Intelligence, the text prompt and calculated ML metrics are sent securely to backend AI endpoint providers.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          7. HOW INFORMATION IS USED
        </h2>
        <p>
          Information is used exclusively to:
        </p>
        <ul>
          <li>Execute real-time ML regressions, classification risk scores, and spatial optimizations.</li>
          <li>Format PDF Executive Reports requested by the user.</li>
          <li>Monitor API stability and system performance.</li>
        </ul>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          8. MODEL PROCESSING
        </h2>
        <p>
          All scikit-learn models and SciPy solvers run locally inside the ConArk Python backend process (`conark.api.main`). Data is evaluated deterministically.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          9. GEMINI API PROCESSING
        </h2>
        <p>
          Natural language explanation generation utilizes Google Gemini 1.5 Flash API. Gemini API calls are mediated server-side using secure API keys. Frontend code never accesses Gemini API keys.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          10. OPENROUTER / CONARK INTELLIGENCE PROCESSING
        </h2>
        <p>
          Conversational queries submit prompts to OpenRouter (`google/gemma-4-26b-a4b-it:free`). OpenRouter API keys remain 100% server-side in `.env`.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          11. COOKIES AND LOCAL STORAGE
        </h2>
        <p>
          ConArk uses browser `localStorage` solely to persist transient active session state (such as dark mode preferences or recent model selection). No tracking cookies or advertising pixels are used.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          12. DATA RETENTION
        </h2>
        <p>
          Transient telemetry inputs are retained in memory only for the duration of the HTTP request lifecycle.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          13. DATA SECURITY
        </h2>
        <p>
          We employ industry-standard transport security (HTTPS/TLS) and server-side secret management. However, no internet transmission is 100% immune to breach.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          14. THIRD-PARTY SERVICES
        </h2>
        <p>
          ConArk integrates Google Gemini API and OpenRouter API. Please consult Google Cloud and OpenRouter privacy policies for third-party processing disclosures.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          15. USER RIGHTS
        </h2>
        <p>
          Users have the right to request clarification on data processing protocols or report privacy concerns to the engineering team.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          16. CHILDREN'S PRIVACY
        </h2>
        <p>
          ConArk Systems is an enterprise construction decision-support platform intended for adult professionals and researchers.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          17. CHANGES TO THIS POLICY
        </h2>
        <p>
          We reserve the right to update this policy as new ML models or features are released. Any updates will be reflected here with a updated revision timestamp.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          18. CONTACT INFORMATION
        </h2>
        <p>
          For privacy inquiries or technical questions, contact the ConArk team:
        </p>
        <div style={{ backgroundColor: '#F5F5F5', border: '1px solid #111', padding: '14px', borderRadius: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
          [LEGAL REVIEW PLACEHOLDER]<br />
          Contact Lead: Shubham Pokale & Siddhesh Birewar<br />
          Email: shubham.pokale25@pccopepune.org / siddhesh.birewar25@pccoepune.org<br />
          Project: ConArk Systems Research Platform
        </div>

      </div>

    </div>
  );
};
