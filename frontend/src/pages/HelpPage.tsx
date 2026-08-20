import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight, Sparkles, FileText, AlertTriangle, Mail, ShieldAlert } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const modelCards = [
    {
      id: 'performance',
      title: 'Performance Intelligence',
      path: '/model/performance',
      color: '#4FC3F7',
      does: 'Evaluates structural structural health, energy efficiency, and operational endurance indicators based on site telemetries.',
      inputs: 'Building Age, Concrete Grade, Seismic Zone, Ambient Temp, Humidity, Operational Load.',
      produces: 'Performance Index Score (0–100%), Endurance Rating, and Structural Degradation Curve.'
    },
    {
      id: 'risk',
      title: 'Risk Intelligence',
      path: '/model/risk',
      color: '#FF2AA1',
      does: 'Identifies operational hazards, safety vulnerabilities, and likelihood of site delays.',
      inputs: 'Safety Protocol Score, Worker Fatigue Index, Weather Severity, Equipment Maintenance Age.',
      produces: 'Risk Level (LOW/MED/HIGH), Failure Probability (%), and Hazard Prevention Steps.'
    },
    {
      id: 'cost',
      title: 'Cost & Time Intelligence',
      path: '/model/cost',
      color: '#7CFFA6',
      does: 'Forecasts material budget overruns, labor expenditure, and project completion timelines.',
      inputs: 'Project Duration, Material Inflation Rate, Workforce Size, Overtime Hours, Supply Delays.',
      produces: 'Cost Variance ($), Projected Total Budget, and Schedule Slippage Estimate (Days).'
    },
    {
      id: 'safety',
      title: 'Safety & Resource Intelligence',
      path: '/alerts',
      color: '#E4FF5B',
      does: 'Monitors real-time alerts, safety protocol non-compliance, and critical resource shortages.',
      inputs: 'Site Sensor Feeds, Inventory Thresholds, Safety Incidents Log, Weather Warnings.',
      produces: 'Active Hazard Alerts, Severity Ranking, and Emergency Mitigation Recommendations.'
    },
    {
      id: 'optimization',
      title: 'Project Optimization',
      path: '/model/optimization',
      color: '#FF9E43',
      does: 'Calculates optimal resource allocation balances across cost, time, and safety trade-offs.',
      inputs: 'Target Budget Cap, Max Schedule Target, Minimum Safety Rating, Workforce Limits.',
      produces: 'Optimal Parameter Settings, Pareto Efficiency Score, and Recommended Adjustments.'
    },
    {
      id: 'space',
      title: 'Space Optimization',
      path: '/space-optimization',
      color: '#C084FC',
      does: 'Uses SciPy mathematical optimization to allocate laydown yards, crane positions, and material storage.',
      inputs: 'Total Site Area (m²), Construction Stage, Material Volume, Safety Buffer Distances.',
      produces: 'Site Spatial Allocation Map (m² per zone), Feasibility Status, and Spatial Efficiency Rating.'
    }
  ];

  const troubleshootingItems = [
    {
      problem: 'Prediction Failed',
      cause: 'One or more required input parameters are missing or out of valid physical range.',
      solution: 'Ensure numerical inputs match realistic bounds (e.g., Concrete Grade between M20 and M80).'
    },
    {
      problem: 'Invalid Input',
      cause: 'Non-numeric characters entered into numeric fields or empty required inputs.',
      solution: 'Use the "Fill Sample Inputs" button on model pages to populate validated benchmark data.'
    },
    {
      problem: 'AI Explanation Unavailable',
      cause: 'Temporary Gemini API response timeout or network connectivity interruption.',
      solution: 'ConArk automatically falls back to deterministic rule explanations. Re-click "Analyze" to retry.'
    },
    {
      problem: 'PDF Download Not Working',
      cause: 'Browser popup blocker or canvas rendering delay on high-DPI displays.',
      solution: 'Allow popups for localhost:8000, wait 3 seconds for report render completion, and retry.'
    },
    {
      problem: 'Page Not Loading',
      cause: 'Cached client bundle or background service initialization in progress.',
      solution: 'Hard refresh your browser (`Ctrl + F5` or `Cmd + Shift + R`).'
    },
    {
      problem: 'API Temporarily Unavailable',
      cause: 'Backend server process restarting or model weights reload.',
      solution: 'Verify uvicorn server status on port 8000. Server auto-restarts within seconds.'
    }
  ];

  const teamContacts = [
    {
      name: 'SHUBHAM POKALE',
      role: 'Artificial Intelligence Engineer & Support Specialist',
      email: 'shubham.pokale25@pccopepune.org',
      bgColor: '#E4FF5B'
    },
    {
      name: 'SIDDHESH BIREWAR',
      role: 'Research Engineer & PR Specialist',
      email: 'siddhesh.birewar25@pccoepune.org',
      bgColor: '#FFFFFF'
    },
    {
      name: 'VERNIT GARG',
      role: 'Research Specialist & Machine Learning Engineer',
      email: 'vernit.gerg25@pccoepune.org',
      bgColor: '#4FC3F7'
    },
    {
      name: 'RAM KHABALE',
      role: 'Data Analyst & Data Architect',
      email: 'ram.khabale25@pccoepune.org',
      bgColor: '#7CFFA6'
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HERO SECTION */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '3px solid #111111',
        borderRadius: '16px',
        padding: '40px 36px',
        marginBottom: '40px',
        boxShadow: '8px 8px 0px #111111'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#4FC3F7', color: '#111111', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', marginBottom: '16px' }}>
          <HelpCircle size={16} /> CONARK KNOWLEDGE BASE
        </div>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '46px', margin: '0 0 12px 0', letterSpacing: '0.04em', color: '#111111' }}>
          HELP & SUPPORT
        </h1>
        <p style={{ fontSize: '18px', color: '#444444', lineHeight: '1.6', margin: 0, maxWidth: '900px' }}>
          "Need help navigating ConArk? Find answers, troubleshoot issues, or get in touch with the team."
        </p>
      </div>

      {/* SECTION 1: GETTING STARTED */}
      <div style={{ backgroundColor: '#EDECE7', border: '2px solid #111111', borderRadius: '16px', padding: '36px', marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '28px', color: '#111111', margin: '0 0 20px 0', letterSpacing: '0.03em' }}>
          1. GETTING STARTED WITH CONARK
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { step: '01', title: 'Explore Models', desc: 'Browse the Model Registry to understand performance, risk, cost, time, and space intelligence capabilities.' },
            { step: '02', title: 'Select a Model', desc: 'Navigate to any specific model page or open the global Project Input portal.' },
            { step: '03', title: 'Enter Telemetry Data', desc: 'Provide site parameters or click "Fill Sample Inputs" for pre-validated baseline inputs.' },
            { step: '04', title: 'Run Predictions', desc: 'Click "Run Prediction" to execute scikit-learn models and SciPy space solvers instantly.' },
            { step: '05', title: 'Understand Results', desc: 'Review score gauges, hazard badges, and Gemini 1.5 Flash grounded natural language explanations.' },
            { step: '06', title: 'Generate PDF Reports', desc: 'Click "Export PDF Report" on any results view to download a complete formatted summary.' },
          ].map((item, idx) => (
            <div key={idx} style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '12px', padding: '20px', boxShadow: '4px 4px 0px #111111' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: '800', color: '#FF2AA1', marginBottom: '8px' }}>
                STEP {item.step}
              </div>
              <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', color: '#111111', marginBottom: '6px' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '13px', color: '#555555', lineHeight: '1.5' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: MODEL SUPPORT */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '28px', color: '#111111', margin: '0 0 20px 0', letterSpacing: '0.03em' }}>
          2. MODEL SUPPORT & CAPABILITIES
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {modelCards.map((card) => (
            <div key={card.id} style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #111111',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '6px 6px 0px #111111',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'inline-block', backgroundColor: card.color, color: '#111111', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', marginBottom: '10px' }}>
                  MODEL CARD
                </div>
                <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111', margin: '0 0 12px 0' }}>
                  {card.title}
                </h3>
                <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5', marginBottom: '12px' }}>
                  <strong>What it does:</strong> {card.does}
                </div>
                <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.5', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                  <strong>Required Inputs:</strong> {card.inputs}
                </div>
                <div style={{ fontSize: '12px', color: '#222', lineHeight: '1.5', fontFamily: 'JetBrains Mono, monospace', backgroundColor: '#F5F5F5', padding: '8px 12px', borderRadius: '6px', borderLeft: `3px solid ${card.color}` }}>
                  <strong>Produces:</strong> {card.produces}
                </div>
              </div>

              <Link to={card.path} style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                padding: '10px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                OPEN MODEL <ArrowRight size={14} color="#FF2AA1" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: AI SUPPORT & GROUNDING NOTICE */}
      <div style={{ backgroundColor: '#FFFFFF', border: '2px dashed #111111', borderRadius: '16px', padding: '32px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Sparkles color="#FF2AA1" size={24} />
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '26px', color: '#111111', margin: 0 }}>
            3. AI SUPPORT & EXPLANATION GROUNDING
          </h2>
        </div>
        <p style={{ fontSize: '15px', color: '#333333', lineHeight: '1.6', marginBottom: '16px' }}>
          ConArk Systems integrates two specialized AI systems:
        </p>
        <ul style={{ fontSize: '14px', color: '#444444', lineHeight: '1.7', paddingLeft: '20px', marginBottom: '20px' }}>
          <li><strong>Google Gemini 1.5 Flash:</strong> Translates raw scikit-learn metrics into clear, human-readable structural summaries grounded strictly in output data.</li>
          <li><strong>ConArk Intelligence (Gemma 4 26B A4B):</strong> Conversational AI assistant trained to answer site safety, material specs, and construction management questions.</li>
        </ul>
        <div style={{ backgroundColor: '#FFF3CD', border: '1.5px solid #FFEBAA', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <ShieldAlert color="#856404" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '13px', color: '#856404', lineHeight: '1.5' }}>
            <strong>Important Decision-Support Notice:</strong> AI explanations and chat responses serve strictly as decision support. They do not replace certified structural engineering, site safety officer approvals, or official building code inspections.
          </div>
        </div>
      </div>

      {/* SECTION 4: REPORTS & DOWNLOADS */}
      <div style={{ backgroundColor: '#FFFFFF', border: '2px solid #111111', borderRadius: '16px', padding: '32px', marginBottom: '40px', boxShadow: '6px 6px 0px #111111' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <FileText color="#4FC3F7" size={24} />
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '26px', color: '#111111', margin: 0 }}>
            4. REPORTS & PDF DOWNLOADS
          </h2>
        </div>
        <p style={{ fontSize: '14px', color: '#444444', lineHeight: '1.6', marginBottom: '16px' }}>
          You can generate, review, and download comprehensive PDF executive reports for any project configuration:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ border: '1px solid #E0E0E0', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '6px', color: '#111' }}>1. Review Results</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Verify model outputs and Gemini explanation on screen.</div>
          </div>
          <div style={{ border: '1px solid #E0E0E0', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '6px', color: '#111' }}>2. Click Export PDF</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Select "Export PDF Report" from the top right of the report panel.</div>
          </div>
          <div style={{ border: '1px solid #E0E0E0', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '6px', color: '#111' }}>3. Download Report</div>
            <div style={{ fontSize: '12px', color: '#666' }}>The browser renders HTML5 Canvas to PDF for immediate offline storage.</div>
          </div>
        </div>
      </div>

      {/* SECTION 5: TROUBLESHOOTING */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '28px', color: '#111111', margin: '0 0 20px 0', letterSpacing: '0.03em' }}>
          5. COMMON TROUBLESHOOTING
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {troubleshootingItems.map((item, idx) => (
            <div key={idx} style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '12px', padding: '20px', boxShadow: '4px 4px 0px #111111' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Anton, sans-serif', fontSize: '18px', color: '#FF2AA1', marginBottom: '8px' }}>
                <AlertTriangle size={18} /> {item.problem}
              </div>
              <div style={{ fontSize: '12px', color: '#777', marginBottom: '8px', lineHeight: '1.4' }}>
                <strong>Likely Cause:</strong> {item.cause}
              </div>
              <div style={{ fontSize: '13px', color: '#111', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', padding: '10px 12px', borderRadius: '6px', lineHeight: '1.4' }}>
                <strong>Fix:</strong> {item.solution}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: CONTACT SUPPORT */}
      <div id="contact" style={{ backgroundColor: '#111111', color: '#FFFFFF', border: '3px solid #111111', borderRadius: '16px', padding: '36px', boxShadow: '8px 8px 0px #FF2AA1' }}>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '32px', color: '#E4FF5B', margin: '0 0 8px 0', letterSpacing: '0.03em' }}>
          6. CONTACT CONARK ENGINEERING TEAM
        </h2>
        <p style={{ fontSize: '14px', color: '#CCCCCC', marginBottom: '28px' }}>
          Reach out directly to the ConArk Systems research and engineering leads for support, technical inquiry, or feedback:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {teamContacts.map((member, idx) => (
            <div key={idx} style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', color: member.bgColor, letterSpacing: '0.02em', marginBottom: '4px' }}>
                  {member.name}
                </div>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#999999', marginBottom: '12px' }}>
                  {member.role}
                </div>
              </div>
              <a href={`mailto:${member.email}`} style={{
                color: '#111111',
                backgroundColor: member.bgColor,
                padding: '8px 12px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Mail size={14} /> {member.email}
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
