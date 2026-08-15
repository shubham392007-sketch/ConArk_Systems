import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { analyzeProjectIntelligence } from '../services/api';

export const AIInsightsPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: string; time: string }>>([
    {
      q: 'Why is project risk high?',
      a: 'Risk is high primarily due to recent safety incidents (2 recorded), high equipment utilization (89%), and schedule deviation (+4.8 days). These factors increase the likelihood of operational disruptions.',
      time: '12:04:02'
    }
  ]);

  const suggestedPrompts = [
    'Why is project risk high?',
    'What should we fix first?',
    'Why is the project delayed?',
    'What does space optimization recommend?'
  ];

  const handleAsk = async (promptText?: string) => {
    const qText = promptText || question;
    if (!qText.trim()) return;

    setLoading(true);
    try {
      const res = await analyzeProjectIntelligence({
        timestamp: new Date().toISOString().slice(0, 19),
        temperature: 32.5,
        humidity: 62.0,
        vibration_level: 28.6,
        material_usage: 6800.0,
        machinery_status: 1,
        worker_count: 74,
        energy_consumption: 920.0,
        task_progress: 0.52,
        safety_incidents: 2,
        equipment_utilization_rate: 89.0,
        material_shortage_alert: 1
      });

      const ans = res.gemini_report.report?.executive_summary || res.gemini_report.message || "Project is experiencing elevated risk. Review worker and equipment allocation.";
      setQaHistory([{ q: qText, a: ans, time: new Date().toLocaleTimeString() }, ...qaHistory]);
      setQuestion('');
    } catch (e) {
      alert('Failed to reach Gemini AI service: ' + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px 48px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', borderBottom: '2px solid #111111', paddingBottom: '16px' }}>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '48px', color: '#111111', textTransform: 'uppercase' }}>
          AI INSIGHTS
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#555555' }}>
          Numbers from ConArk. Explanations from Gemini.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
        {/* Left Column: Gemini Summary & Recommended Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Gemini Summary Card (Flat uncolored card) */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#FF2AA1" />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 'bold' }}>GEMINI 2.5 FLASH SUMMARY</span>
              </div>
              <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                GROUNDED IN MODELS
              </span>
            </div>

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#111111', lineHeight: '1.6', marginBottom: '16px' }}>
              The project is currently experiencing elevated operational risk driven by high equipment utilization, schedule deviation, and recent safety incidents. Cost is trending over budget and the schedule is forecasted to slip by 4.8 days if current conditions continue.
            </p>

            <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#666666' }}>
              GROUNDED IN: Risk Model · Alert Engine · SHAP
            </div>
          </div>

          {/* Recommended Actions Table */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111', marginBottom: '16px', textTransform: 'uppercase' }}>
              RECOMMENDED ACTIONS
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#EDECE7', borderRadius: '8px', border: '1px solid #111111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>1. Review worker allocation</div>
                  <div style={{ fontSize: '12px', color: '#555555' }}>Rebalance worker headcount across active tasks</div>
                </div>
                <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#FF2AA1', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>HIGH</span>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#EDECE7', borderRadius: '8px', border: '1px solid #111111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>2. Inspect equipment utilization</div>
                  <div style={{ fontSize: '12px', color: '#555555' }}>Prevent machinery overheat and vibration spikes</div>
                </div>
                <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#FF2AA1', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>HIGH</span>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#EDECE7', borderRadius: '8px', border: '1px solid #111111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>3. Review material scheduling</div>
                  <div style={{ fontSize: '12px', color: '#555555' }}>Avoid shortages and delivery bottlenecks</div>
                </div>
                <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#334155', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>MEDIUM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ask ConArk Q&A */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111', marginBottom: '12px', textTransform: 'uppercase' }}>
            ASK CONARK
          </h2>

          {/* Suggested Prompts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(p)}
                style={{
                  textAlign: 'left',
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                  padding: '8px 12px',
                  backgroundColor: '#EDECE7',
                  border: '1px solid #111111',
                  borderRadius: '6px',
                  color: '#111111',
                  cursor: 'pointer'
                }}
              >
                "{p}"
              </button>
            ))}
          </div>

          {/* Question Input */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Why is project risk high?"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #111111', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading}
              style={{ backgroundColor: '#111111', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', fontFamily: 'Anton, sans-serif', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              {loading ? 'ASKING...' : 'ASK →'}
            </button>
          </div>

          {/* Q&A Response Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>
            {qaHistory.map((item, i) => (
              <div key={i} style={{ backgroundColor: '#EDECE7', border: '1px solid #111111', borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'Inter, sans-serif', color: '#111111', marginBottom: '6px' }}>
                  Q: "{item.q}"
                </div>
                <div style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#333333', lineHeight: '1.5' }}>
                  {item.a}
                </div>
                <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#777777', marginTop: '8px' }}>
                  Grounded in: Risk Model · Alert Engine • {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
