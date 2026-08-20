import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#E4FF5B', color: '#111111', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', marginBottom: '16px' }}>
          <FileText size={16} /> TERMS & CONDITIONS
        </div>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '42px', margin: '0 0 10px 0', letterSpacing: '0.04em', color: '#111111' }}>
          TERMS OF SERVICE
        </h1>
        <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#666666', marginBottom: '16px' }}>
          LAST UPDATED: AUGUST 20, 2026 · VERSION 1.0.0 (RESEARCH PROTOTYPE)
        </div>
        <p style={{ fontSize: '15px', color: '#444444', lineHeight: '1.6', margin: 0 }}>
          These Terms of Service govern access to and usage of the ConArk Systems construction intelligence platform.
        </p>
      </div>

      {/* TERMS CONTENT CONTAINER */}
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
          1. ACCEPTANCE OF TERMS
        </h2>
        <p>
          By accessing or using ConArk Systems, you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          2. DESCRIPTION OF CONARK SYSTEMS
        </h2>
        <p>
          ConArk Systems provides predictive machine learning models, SciPy spatial optimization algorithms, and Gemini LLM explanations designed to evaluate structural performance, operational risk, budget variance, and site layout.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          3. ELIGIBILITY
        </h2>
        <p>
          You must be at least 18 years of age or possess legal authority to operate on behalf of an enterprise or academic research institution.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          4. USER RESPONSIBILITIES
        </h2>
        <p>
          Users are responsible for ensuring that numerical telemetry inputs submitted to ConArk accurately reflect site conditions and engineering specifications.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          5. ACCEPTABLE USE
        </h2>
        <p>
          You agree not to attempt reverse engineering of backend ML binaries, overload backend APIs with automated denial-of-service traffic, or submit malicious payloads.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          6. PROJECT DATA
        </h2>
        <p>
          You retain all ownership rights to project input telemetries. ConArk processes submitted parameters solely to compute real-time analytical outputs.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          7. AI-GENERATED CONTENT
        </h2>
        <p>
          Natural language narratives provided by Gemini 1.5 Flash and Gemma 4 are AI-generated decision-support summaries. They may contain statistical errors or inaccuracies.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          8. MACHINE LEARNING PREDICTIONS
        </h2>
        <p>
          ML regression scores and risk probabilities are statistical estimates computed from model training data. They do not constitute guaranteed physical predictions.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          9. OPTIMIZATION RECOMMENDATIONS
        </h2>
        <p>
          SciPy spatial layout allocations (m²) are mathematical approximations. Site supervisors must verify physical clearances, soil bearing capacities, and safety buffers.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          10. CONSTRUCTION AND SAFETY DISCLAIMER
        </h2>
        <div style={{ backgroundColor: '#FFF3CD', border: '1.5px solid #FFEBAA', padding: '16px', borderRadius: '8px', fontWeight: 'bold', color: '#856404' }}>
          CRITICAL NOTICE: ConArk Systems is strictly a decision-support platform. It does NOT replace qualified professional engineers, licensed site safety inspectors, or official building authority sign-offs.
        </div>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          11. THIRD-PARTY APIS
        </h2>
        <p>
          ConArk utilizes Google Gemini API and OpenRouter API services. Service availability and uptime are subject to third-party provider operations.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          12. INTELLECTUAL PROPERTY
        </h2>
        <p>
          All software code, UI designs, brand marks, and ML model architectures of ConArk Systems remain the intellectual property of the ConArk development team.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          13. USER CONTENT
        </h2>
        <p>
          ConArk does not claim ownership over PDF executive reports generated during your active session.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          14. SERVICE AVAILABILITY
        </h2>
        <p>
          We strive for continuous availability, but do not guarantee uninterrupted uptime during research prototype upgrades.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          15. LIMITATION OF LIABILITY
        </h2>
        <p>
          In no event shall ConArk Systems, its developers, or academic partners be liable for any direct, indirect, incidental, or structural damages arising from reliance on Platform outputs.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          16. NO PROFESSIONAL ENGINEERING ADVICE
        </h2>
        <p>
          Platform outputs do not constitute professional civil engineering, structural design, legal, financial, or safety consulting advice.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          17. TERMINATION
        </h2>
        <p>
          We reserve the right to suspend platform access for violations of acceptable use policies.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          18. CHANGES TO TERMS
        </h2>
        <p>
          We may modify these Terms at any time. Continued use of ConArk constitutes acceptance of modified terms.
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          19. GOVERNING LAW
        </h2>
        <p>
          These Terms are governed by applicable local legal frameworks where the research project is hosted [LEGAL PLACEHOLDER].
        </p>

        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', borderBottom: '2px solid #111', paddingBottom: '6px', marginTop: '28px', color: '#111' }}>
          20. CONTACT
        </h2>
        <p>
          Questions regarding these Terms should be directed to the ConArk engineering team at `shubham.pokale25@pccopepune.org`.
        </p>

      </div>

    </div>
  );
};
