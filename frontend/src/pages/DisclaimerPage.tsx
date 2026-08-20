import React from 'react';
import { ShieldAlert, AlertTriangle, Cpu, Sparkles, Database } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  const warningCards = [
    {
      cardNo: 'CARD 1',
      title: 'AI-GENERATED CONTENT DISCLOSURE',
      icon: <Sparkles size={24} color="#FF2AA1" />,
      color: '#FF2AA1',
      badgeBg: '#FFE5F4',
      quote: '"Some explanations and recommendations may be generated using artificial intelligence and may contain errors."',
      explanation: 'Natural language summaries provided by Google Gemini 1.5 Flash and ConArk Intelligence (Gemma 4 26B A4B) translate mathematical telemetry metrics into text. Large Language Models can occasionally produce inaccurate interpretations or hallucinations. Always verify recommendations against verified physical engineering data.'
    },
    {
      cardNo: 'CARD 2',
      title: 'PREDICTIVE MODEL LIMITATIONS',
      icon: <Cpu size={24} color="#4FC3F7" />,
      color: '#0288D1',
      badgeBg: '#E1F5FE',
      quote: '"Machine learning predictions are estimates based on available input data and model assumptions."',
      explanation: 'scikit-learn predictive algorithms (Random Forest Regressors, Gradient Boosting Classifiers) compute statistical probabilities from training telemetry distributions. Site conditions, extreme weather, or unmodeled geological factors can cause real-world performance to diverge from statistical predictions.'
    },
    {
      cardNo: 'CARD 3',
      title: 'SYNTHETIC & SIMULATED DATA DISCLOSURE',
      icon: <Database size={24} color="#7CFFA6" />,
      color: '#2E7D32',
      badgeBg: '#E8F5E9',
      quote: '"The current research prototype may use simulated/synthetic construction data. Results obtained from synthetic data should not be interpreted as proof of real-world construction performance."',
      explanation: 'The Building Performance Dataset utilized in this research prototype combines simulated telemetry generation with benchmark structural figures to evaluate model stability. It serves as a proof-of-concept for intelligent decision support.'
    },
    {
      cardNo: 'CARD 4',
      title: 'CONSTRUCTION SAFETY & ENGINEERING DISCLAIMER',
      icon: <ShieldAlert size={24} color="#D32F2F" />,
      color: '#D32F2F',
      badgeBg: '#FFEBEE',
      quote: '"ConArk is not a substitute for qualified construction professionals, engineers, safety officers, site supervisors, or regulatory authorities."',
      explanation: 'Platform outputs must never be used as sole authorization for structural load-bearing changes, site safety protocol waivers, or formal building code compliance filings. All decisions require sign-off by licensed civil/structural engineers.'
    },
    {
      cardNo: 'CARD 5',
      title: 'NO OUTCOME GUARANTEE',
      icon: <AlertTriangle size={24} color="#F57C00" />,
      color: '#E65100',
      badgeBg: '#FFF3E0',
      quote: '"ConArk does not guarantee project cost, schedule, safety, resource efficiency, or construction outcomes."',
      explanation: 'Predictions and SciPy spatial layout optimizations are decision-support heuristics designed to assist human judgment. ConArk Systems assumes no financial or operational liability for project cost overruns, schedule delays, or structural failures.'
    },
    {
      cardNo: 'CARD 6',
      title: 'THIRD-PARTY AI SERVICES DISCLOSURE',
      icon: <Cpu size={24} color="#7B1FA2" />,
      color: '#7B1FA2',
      badgeBg: '#F3E5F5',
      quote: '"AI features depend on secure server-side integrations with Google Gemini API and OpenRouter API."',
      explanation: 'ConArk Systems connects to external AI providers via server-side HTTPS requests. API keys are maintained 100% server-side in secure environment variables. Third-party provider uptime, rate limits, and latency may affect AI response times.'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HERO SECTION */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '3px solid #111111',
        borderRadius: '16px',
        padding: '40px 36px',
        marginBottom: '36px',
        boxShadow: '8px 8px 0px #111111'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FF2AA1', color: '#FFFFFF', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', marginBottom: '16px' }}>
          <ShieldAlert size={16} /> CRITICAL DISCLOSURES
        </div>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '44px', margin: '0 0 12px 0', letterSpacing: '0.04em', color: '#111111' }}>
          DISCLAIMER & DISCLOSURE
        </h1>
        <p style={{ fontSize: '17px', color: '#444444', lineHeight: '1.6', margin: 0, maxWidth: '900px' }}>
          Important operational, engineering, and artificial intelligence disclaimers governing the use of ConArk Systems decision-support models.
        </p>
      </div>

      {/* PROMINENT WARNING CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', marginBottom: '40px' }}>
        {warningCards.map((card, idx) => (
          <div key={idx} style={{
            backgroundColor: '#FFFFFF',
            border: '2.5px solid #111111',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '6px 6px 0px #111111',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#E4FF5B', padding: '4px 10px', borderRadius: '4px' }}>
                  {card.cardNo}
                </span>
                {card.icon}
              </div>

              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', color: card.color, margin: '0 0 12px 0', letterSpacing: '0.02em' }}>
                {card.title}
              </h2>

              <div style={{
                backgroundColor: card.badgeBg,
                borderLeft: `4px solid ${card.color}`,
                padding: '12px 14px',
                borderRadius: '6px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111111',
                lineHeight: '1.5',
                marginBottom: '14px'
              }}>
                {card.quote}
              </div>

              <p style={{ fontSize: '13px', color: '#555555', lineHeight: '1.6', margin: 0 }}>
                {card.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM RESPONSIBLE AI SUMMARY */}
      <div style={{ backgroundColor: '#EDECE7', border: '2px solid #111111', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '24px', color: '#111111', marginBottom: '8px' }}>
          RESPONSIBLE AI IN CONSTRUCTION
        </div>
        <p style={{ fontSize: '14px', color: '#555555', maxWidth: '800px', margin: '0 auto 16px auto', lineHeight: '1.6' }}>
          ConArk Systems adheres to responsible AI principles: transparency in statistical limitations, explicit decision-support disclosures, server-side secret isolation, and human-in-the-loop engineering verification.
        </p>
        <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#FF2AA1' }}>
          CONARK SYSTEMS · RESEARCH & DECISION-SUPPORT PLATFORM
        </div>
      </div>

    </div>
  );
};
