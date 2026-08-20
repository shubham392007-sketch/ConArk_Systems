import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'GENERAL' | 'MODELS' | 'DATA' | 'AI' | 'REPORTS' | 'SECURITY' | 'RESEARCH';
  question: string;
  answer: string;
}

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedIds, setExpandedIds] = useState<string[]>(['faq-1', 'faq-8', 'faq-12']);

  const faqList: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'GENERAL',
      question: 'What is ConArk Systems?',
      answer: 'ConArk Systems is an AI-driven construction intelligence decision-support platform. It integrates scikit-learn predictive machine learning models, SciPy spatial optimization algorithms, and Google Gemini 1.5 Flash natural language explanation layers to assist structural engineers, project managers, and site planners.'
    },
    {
      id: 'faq-2',
      category: 'GENERAL',
      question: 'Who is ConArk designed for?',
      answer: 'ConArk is designed for structural engineers, construction project managers, site safety officers, quantity surveyors, and academic researchers seeking quantitative predictive insights into performance, risk, cost, time, and site spatial layout.'
    },
    {
      id: 'faq-3',
      category: 'MODELS',
      question: 'How does ConArk generate predictions?',
      answer: 'ConArk uses specialized scikit-learn machine learning algorithms (Random Forest Regressors, Gradient Boosting Classifiers, and Multi-Objective Optimizers) trained on structured building performance telemetry datasets to estimate structural performance, operational risk, budget variance, and completion time.'
    },
    {
      id: 'faq-4',
      category: 'MODELS',
      question: 'What models are available?',
      answer: 'ConArk offers 6 specialized models: (1) Performance Intelligence, (2) Operational Risk Intelligence, (3) Cost Forecast Model, (4) Time Schedule Forecast Model, (5) Project Multi-Objective Optimization, and (6) SciPy Site Space Allocation Model.'
    },
    {
      id: 'faq-5',
      category: 'MODELS',
      question: 'What inputs are required?',
      answer: 'Inputs depend on the chosen model and include parameters such as Building Age (years), Concrete Grade (M20–M80), Seismic Zone (1–5), Ambient Temperature (°C), Humidity (%), Workforce Size, Overtime Hours, Material Inflation Rate, and Total Site Laydown Area (m²).'
    },
    {
      id: 'faq-6',
      category: 'DATA',
      question: 'Is the dataset real or synthetic?',
      answer: 'The current research prototype uses the Building Performance Dataset—a combination of simulated/synthetic site telemetries and benchmark structural data. Results obtained from synthetic data should be interpreted as decision support rather than verified real-world structural proof.'
    },
    {
      id: 'faq-7',
      category: 'REPORTS',
      question: 'Can I download my results?',
      answer: 'Yes! ConArk includes a client-side PDF Executive Report generator. Click "Export PDF Report" on any model page or AI insights view to immediately download a formatted summary containing metrics, charts, and Gemini explanations.'
    },
    {
      id: 'faq-8',
      category: 'AI',
      question: 'How does Gemini AI work in ConArk?',
      answer: 'Google Gemini 1.5 Flash acts as an automated explanation layer. When an ML model finishes computing numerical predictions, Gemini receives the verified output numbers and generates a structured, grounded narrative summarizing structural implications, risk drivers, and priority recommendations.'
    },
    {
      id: 'faq-9',
      category: 'AI',
      question: 'Does Gemini generate the ML prediction?',
      answer: 'No. Gemini does NOT compute numerical ML predictions. All mathematical scoring, regression curves, and spatial solver coordinates are executed deterministically by Python ML engines (scikit-learn, SciPy, NumPy). Gemini only explains the calculated results.'
    },
    {
      id: 'faq-10',
      category: 'AI',
      question: 'What is ConArk Intelligence?',
      answer: 'ConArk Intelligence is a dedicated conversational construction assistant powered by the Google Gemma 4 26B A4B model via OpenRouter API. It handles general and technical construction questions, material specs, site safety standards, and project scheduling advice.'
    },
    {
      id: 'faq-11',
      category: 'MODELS',
      question: 'What is Space Optimization?',
      answer: 'Space Optimization is a specialized spatial allocation engine powered by SciPy. It computes optimal floor area distribution (m²) for laydown yards, crane operational zones, material storage, worker break areas, and safety buffers given total available site footprint.'
    },
    {
      id: 'faq-12',
      category: 'GENERAL',
      question: 'Can ConArk replace a construction engineer?',
      answer: 'No. ConArk is strictly a decision-support platform and does NOT replace qualified professional engineers, licensed site safety officers, structural inspectors, or regulatory building authorities.'
    },
    {
      id: 'faq-13',
      category: 'RESEARCH',
      question: 'How reliable are the predictions?',
      answer: 'Model predictions achieve 88%–94% cross-validation accuracy on benchmark telemetry test splits. However, because field conditions vary widely, predictions must always be validated against physical site testing and licensed engineering specs.'
    },
    {
      id: 'faq-14',
      category: 'MODELS',
      question: 'How should I interpret the risk score?',
      answer: 'The Operational Risk Score (0–100%) represents cumulative failure and delay probability. LOW (<30%) indicates normal operations; MEDIUM (30–60%) warrants safety audit review; HIGH (>60%) recommends immediate site inspection and activity re-sequencing.'
    },
    {
      id: 'faq-15',
      category: 'SECURITY',
      question: 'Does ConArk store my project data?',
      answer: 'ConArk processes project inputs in-memory during active sessions. Telemetry data is not permanently stored on third-party servers. API keys (Gemini, OpenRouter) are managed 100% server-side in secure environment variables.'
    },
    {
      id: 'faq-16',
      category: 'RESEARCH',
      question: 'Can I use ConArk for academic research?',
      answer: 'Yes! ConArk Systems is built as an open research and technical prototype. Code, dataset structures, and evaluation metrics are documented in the /docs section and open for academic research citation.'
    },
    {
      id: 'faq-17',
      category: 'RESEARCH',
      question: 'Can I integrate ConArk with real construction-site sensors?',
      answer: 'ConArk exposes REST API endpoints (`/api/v1/intelligence/analyze`, `/api/v1/space/optimize`) designed for JSON payloads, enabling simple integration with IoT sensor gateways and site management dashboards.'
    },
    {
      id: 'faq-18',
      category: 'RESEARCH',
      question: 'Does ConArk support BIM?',
      answer: 'While direct IFC/BIM file import is planned for future roadmap releases, current ConArk models consume structured numerical parameters extracted from BIM schedule and spatial takeoff summaries.'
    },
    {
      id: 'faq-19',
      category: 'SECURITY',
      question: 'Is ConArk a safety certification system?',
      answer: 'No. ConArk provides analytical risk scores and decision-support guidance. It is not an accredited building code safety certification agency and does not issue legal compliance certificates.'
    }
  ];

  const categories = ['ALL', 'GENERAL', 'MODELS', 'DATA', 'AI', 'REPORTS', 'SECURITY', 'RESEARCH'];

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqList.filter(faq => {
    const matchesCategory = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER HERO */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '3px solid #111111',
        borderRadius: '16px',
        padding: '40px 36px',
        marginBottom: '32px',
        boxShadow: '8px 8px 0px #111111'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FF2AA1', color: '#FFFFFF', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', marginBottom: '16px' }}>
          <HelpCircle size={16} /> KNOWLEDGE CENTER
        </div>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '46px', margin: '0 0 12px 0', letterSpacing: '0.04em', color: '#111111' }}>
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p style={{ fontSize: '17px', color: '#444444', lineHeight: '1.6', margin: '0 0 24px 0', maxWidth: '850px' }}>
          Find answers regarding ConArk ML models, Gemini AI explanation grounding, synthetic dataset limits, and decision-support guidance.
        </p>

        {/* SEARCH BAR */}
        <div style={{ position: 'relative', maxWidth: '650px' }}>
          <Search size={20} color="#777777" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search questions or keywords (e.g. Gemini, risk, synthetic, space)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              fontSize: '15px',
              border: '2px solid #111111',
              borderRadius: '10px',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              boxShadow: '4px 4px 0px #111111'
            }}
          />
        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              backgroundColor: selectedCategory === cat ? '#111111' : '#FFFFFF',
              color: selectedCategory === cat ? '#FFFFFF' : '#111111',
              border: '1.5px solid #111111',
              padding: '8px 16px',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: selectedCategory === cat ? '2px 2px 0px #FF2AA1' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #111111',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '4px 4px 0px #111111'
                }}
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    backgroundColor: isExpanded ? '#F9F8F3' : '#FFFFFF',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#E4FF5B', padding: '3px 8px', borderRadius: '4px' }}>
                      {faq.category}
                    </span>
                    <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', color: '#111111', letterSpacing: '0.02em' }}>
                      {faq.question}
                    </span>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={20} color="#111111" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div style={{ padding: '0 24px 20px 24px', borderTop: '1px dashed #DDD', backgroundColor: '#F9F8F3' }}>
                        <p style={{ fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '16px 0 0 0' }}>
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div style={{ backgroundColor: '#FFFFFF', border: '2px dashed #111111', padding: '40px', textAlign: 'center', borderRadius: '12px' }}>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', color: '#555' }}>NO MATCHING QUESTIONS FOUND</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>Try adjusting your search filter or category selection.</div>
          </div>
        )}
      </div>

      {/* BOTTOM DISCLAIMER BOX */}
      <div style={{ backgroundColor: '#FFF3CD', border: '2px solid #111111', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px', boxShadow: '4px 4px 0px #111111' }}>
        <ShieldAlert color="#856404" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', color: '#856404', marginBottom: '4px' }}>
            DECISION-SUPPORT POLICY DISCLAIMER
          </div>
          <div style={{ fontSize: '13px', color: '#856404', lineHeight: '1.5' }}>
            ConArk Systems provides predictive intelligence as a decision-support tool. It does not replace qualified engineering, legal, or licensed safety officer judgment. Always verify model outputs against verified physical site measurements and local building code standards.
          </div>
        </div>
      </div>

    </div>
  );
};
