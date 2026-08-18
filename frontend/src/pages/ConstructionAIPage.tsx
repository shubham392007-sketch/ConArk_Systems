import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Trash2,
  Copy,
  RotateCw,
  Download,
  ArrowUp,
  Mic,
  MicOff,
  Menu,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Cpu,
  ChevronRight
} from 'lucide-react';
import { useConstructionAI } from '../hooks/useConstructionAI';

// Topic Categories
const TOPIC_CATEGORIES = [
  { id: 'ALL', label: 'ALL TOPICS' },
  { id: 'SAFETY', label: 'SAFETY' },
  { id: 'MATERIALS', label: 'MATERIALS' },
  { id: 'SCHEDULING', label: 'SCHEDULING' },
  { id: 'COST', label: 'COST' },
  { id: 'WORKFORCE', label: 'WORKFORCE' },
  { id: 'MACHINERY', label: 'MACHINERY' },
  { id: 'ENERGY', label: 'ENERGY' },
  { id: 'OPTIMIZATION', label: 'OPTIMIZATION' },
  { id: 'SITE_PLANNING', label: 'SITE PLANNING' },
  { id: 'AI_TECH', label: 'AI & TECHNOLOGY' }
];

// Suggested Questions mapped by Topic Category
const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  ALL: [
    'How can I reduce construction material wastage on site?',
    'What are the common causes of construction schedule delays?',
    'What safety measures should be followed while operating heavy machinery?',
    'Explain concrete curing in simple terms for site crews.',
    'How does worker allocation directly impact project productivity?',
    'What is the difference between critical path and critical chain methodology?',
    'How can I optimize construction site space for high-density stages?',
    'What does a high equipment utilization rate indicate regarding site risk?'
  ],
  SAFETY: [
    'What safety measures should be followed while operating heavy machinery?',
    'How do I implement an effective site-wide fall protection safety plan?',
    'What are the OSHA high-hazard focus four areas in construction?',
    'How can I conduct a site hazard identification assessment before excavation?'
  ],
  MATERIALS: [
    'How can I reduce construction material wastage on site?',
    'Explain concrete curing in simple terms for site crews.',
    'What are the best practices for rebar inventory storage and weather protection?',
    'How do I calculate optimal batch ordering to avoid material spoilage?'
  ],
  SCHEDULING: [
    'What are the common causes of construction schedule delays?',
    'What is the difference between critical path and critical chain methodology?',
    'How do I perform float time analysis on lagging structural tasks?',
    'How can weather delays be mitigated in winter foundation pouring schedules?'
  ],
  COST: [
    'How can cost overruns be detected early using equipment utilization data?',
    'What are effective variance analysis techniques for lump-sum vs unit-price contracts?',
    'How can energy consumption efficiency reduce weekly operating budgets?',
    'What strategies prevent unapproved scope creep from inflating material expenditure?'
  ],
  WORKFORCE: [
    'How does worker allocation directly impact project productivity?',
    'What is the optimal worker density ratio per square meter in masonry stages?',
    'How do fatigue management protocols reduce site safety incidents?',
    'How can trade crew handover schedules be synchronized to minimize idle time?'
  ],
  MACHINERY: [
    'What does a high equipment utilization rate indicate regarding site risk?',
    'How do vibration telemetry sensors predict excavator engine failure?',
    'What preventive maintenance routine prevents hydraulic pump burnout?',
    'How do I balance machinery idle vs active runtime to lower diesel consumption?'
  ],
  ENERGY: [
    'How can I reduce energy consumption on a construction site?',
    'What are peak-load shaving tactics for temporary diesel generators?',
    'How do smart power meters optimize site lighting and welding rigs?',
    'What renewable solar hybrid systems suit off-grid excavation sites?'
  ],
  OPTIMIZATION: [
    'How can I optimize construction site space for high-density stages?',
    'What SLSQP constraints ensure heavy equipment zones stay safe from welfare hubs?',
    'How do I reallocate material storage during transition from excavation to structure?',
    'What metrics define site congestion vs spatial throughput efficiency?'
  ],
  SITE_PLANNING: [
    'How should construction site space be organized during foundation stage?',
    'Where should crane loading docks be placed relative to material stockpiles?',
    'How do I design emergency vehicle access corridors across 1200 sqm sites?',
    'What staging layout minimizes material transport distance to tower cranes?'
  ],
  AI_TECH: [
    'How do machine learning regression models forecast schedule time deviation?',
    'What telemetry metrics feed ConArk risk score algorithms?',
    'How does Gemini LLM contextualize deterministic alert priorities?',
    'How can IoT sensor streams automate real-time construction health scoring?'
  ]
};

export const ConstructionAIPage: React.FC = () => {
  const location = useLocation();

  const {
    sessions,
    currentSession,
    currentSessionId,
    status,
    errorMsg,
    activeTopic,
    setActiveTopic,
    projectContext,
    setProjectContext,
    startNewChat,
    selectSession,
    deleteSession,
    sendMessage,
    regenerateLastMessage
  } = useConstructionAI();

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Speech Recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check speech recognition support
  useEffect(() => {
    const SpeechClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechClass) {
      setSpeechSupported(true);
      const rec = new SpeechClass();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputPrompt(prev => (prev ? prev + ' ' + transcript : transcript));
        }
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Handle URL context query params (e.g. /construction-ai?context=risk)
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const contextType = query.get('context');

    if (contextType) {
      if (contextType === 'risk') {
        const dummyContext = {
          risk_score: 78.4,
          worker_count: 42,
          equipment_utilization_rate: 91.2,
          safety_incidents: 3,
          material_shortage_alert: 1
        };
        setProjectContext(dummyContext);
        setInputPrompt('The current project risk score is 78.4%. Explain the main factors that could contribute to this risk and what actions should be considered.');
      } else if (contextType === 'space') {
        const dummyContext = {
          site_area_sqm: 1200,
          construction_stage: 'STRUCTURE',
          worker_count: 65,
          machinery_count: 8,
          space_utilization_percentage: 84.5
        };
        setProjectContext(dummyContext);
        setInputPrompt('How can I optimize the current 1200 m² site space during the STRUCTURE stage to resolve congestion between heavy machinery and worker hubs?');
      } else if (contextType === 'performance') {
        const dummyContext = {
          performance_category: 'Good',
          task_progress: 0.52,
          vibration_level: 28.6,
          energy_consumption: 920.0
        };
        setProjectContext(dummyContext);
        setInputPrompt('Our project performance is rated Good (52% progress) but machinery vibration is elevated at 28.6 mm/s. What operational adjustments are recommended?');
      }
    }
  }, [location.search, setProjectContext]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, status]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputPrompt]);

  const handleSend = () => {
    if (!inputPrompt.trim() || status === 'THINKING' || status === 'GENERATING') return;
    const text = inputPrompt;
    setInputPrompt('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSpeech = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleUseAsContext = (text: string) => {
    setInputPrompt(prev => (prev ? prev + '\n\nContext excerpt:\n"' + text + '"\n\nQuestion: ' : 'Based on: "' + text + '", '));
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleDownloadReport = (msg: any) => {
    const textContent = `CONARK SYSTEMS - CONSTRUCTION AI ASSISTANT REPORT
==================================================
Date: ${new Date().toLocaleString()}
Conversation ID: ${currentSessionId}
Model: openai/gpt-oss-120b:free (via OpenRouter)
--------------------------------------------------

QUESTION:
${currentSession?.messages.find(m => m.role === 'user')?.content || 'Construction Query'}

ASSISTANT RESPONSE:
${msg.content}

--------------------------------------------------
Disclaimer: ConArk AI responses provide technical operational guidance. Safety-critical, structural, or electrical engineering decisions require verification by qualified professional engineers on site.
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ConArk_AI_Response_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeQuestions = SUGGESTED_QUESTIONS[activeTopic] || SUGGESTED_QUESTIONS.ALL;

  // Simple Markdown Formatter Component
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.65' }}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} style={{ height: '4px' }} />;

          // Headings
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', color: '#111111', textTransform: 'uppercase', marginTop: '12px', marginBottom: '4px' }}>
                {trimmed.replace('### ', '')}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', color: '#111111', textTransform: 'uppercase', marginTop: '14px', marginBottom: '6px' }}>
                {trimmed.replace('## ', '')}
              </h3>
            );
          }

          // Bullet points
          if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const text = trimmed.replace(/^([•*-]\s*)/, '');
            return (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', paddingLeft: '8px' }}>
                <span style={{ color: '#FF2AA1', fontWeight: 'bold' }}>•</span>
                <span>{renderBold(text)}</span>
              </div>
            );
          }

          // Numbered list
          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^\d+/)?.[0];
            const text = trimmed.replace(/^\d+\.\s*/, '');
            return (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', paddingLeft: '8px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: '#111' }}>{num}.</span>
                <span>{renderBold(text)}</span>
              </div>
            );
          }

          // Highlight Section Labels (e.g., SHORT ANSWER, KEY POINTS, RECOMMENDED APPROACH)
          if (/^[A-Z\s]{4,30}:?$/.test(trimmed) && trimmed.length > 3) {
            return (
              <div key={idx} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', color: '#FF2AA1', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '10px' }}>
                {trimmed}
              </div>
            );
          }

          return <p key={idx} style={{ margin: 0 }}>{renderBold(trimmed)}</p>;
        })}
      </div>
    );
  };

  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#111111', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div style={{ maxWidth: '1650px', margin: '0 auto', padding: '16px 20px 48px 20px', minHeight: 'calc(100vh - 120px)' }}>
      
      {/* 1. EDITORIAL PAGE HERO */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          borderBottom: '2.5px dashed #111111',
          paddingBottom: '24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 8px', borderRadius: '3px' }}>
              07 / AI ASSISTANT
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#FF2AA1' }}>
              CONSTRUCTION INTELLIGENCE ASSISTANT
            </span>
          </div>

          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)', color: '#111111', textTransform: 'uppercase', lineHeight: '0.9', margin: 0 }}>
            ASK CONARK
          </h1>

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#555555', marginTop: '10px', maxWidth: '800px', lineHeight: '1.5' }}>
            Ask questions about construction, project management, safety, materials, scheduling, cost, optimization, and site operations.
          </p>
        </div>

        {/* AI System Badge Status */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{
            fontSize: '11px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: '800',
            backgroundColor: '#FFFFFF',
            border: '2px solid #111111',
            padding: '6px 14px',
            borderRadius: '6px',
            boxShadow: '3px 3px 0px #111111',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Cpu size={14} color="#FF2AA1" />
            <span>AI MODEL: <strong>OPENAI GPT-OSS-120B</strong> VIA OPENROUTER</span>
          </div>

          <div style={{
            fontSize: '11px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: '800',
            backgroundColor: status === 'ERROR' ? '#FFD6D6' : (status === 'THINKING' || status === 'GENERATING' ? '#E4FF5B' : '#7CFFA6'),
            color: '#111111',
            border: '1.5px solid #111111',
            padding: '4px 10px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: status === 'ERROR' ? '#D32F2F' : (status === 'THINKING' || status === 'GENERATING' ? '#FF2AA1' : '#00C853')
            }} />
            <span>
              {status === 'IDLE' && '● AI SYSTEM ONLINE'}
              {status === 'THINKING' && '● PROCESSING...'}
              {status === 'GENERATING' && '● GENERATING...'}
              {status === 'COMPLETE' && '● COMPLETE'}
              {status === 'ERROR' && '● SERVICE TEMPORARILY BUSY'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* MOBILE DRAWER TOGGLE BAR */}
      <div className="mobile-drawer-toggle" style={{ display: 'none', marginBottom: '16px' }}>
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          style={{
            width: '100%',
            backgroundColor: '#111111',
            color: '#FFFFFF',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '8px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Menu size={18} /> ☰ CONARK AI CHAT MENU
          </span>
          <span>{sessions.length} CHATS</span>
        </button>
      </div>

      {/* 2. MAIN TWO-COLUMN WORKSPACE */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT SIDEBAR: CONVERSATION HISTORY & TOPICS (DESKTOP + MOBILE DRAWER) */}
        <div
          className={`chat-sidebar ${mobileDrawerOpen ? 'mobile-drawer-active' : ''}`}
          style={{
            backgroundColor: '#FFFFFF',
            border: '2.5px solid #111111',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '6px 6px 0px #111111',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto'
          }}
        >
          {/* + NEW CHAT Button */}
          <button
            onClick={() => {
              startNewChat();
              setMobileDrawerOpen(false);
            }}
            style={{
              width: '100%',
              backgroundColor: '#FF2AA1',
              color: '#FFFFFF',
              border: '2px solid #111111',
              borderRadius: '8px',
              padding: '12px 16px',
              fontFamily: 'Anton, sans-serif',
              fontSize: '18px',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #111111'
            }}
          >
            <Plus size={20} /> + NEW CHAT
          </button>

          {/* RECENT CONVERSATIONS */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#666666', marginBottom: '10px' }}>
              RECENT CONVERSATIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {sessions.map(s => {
                const isActive = s.id === currentSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      selectSession(s.id);
                      setMobileDrawerOpen(false);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: isActive ? '1.5px solid #111111' : '1px solid #EEEEEE',
                      backgroundColor: isActive ? '#E4FF5B' : '#F9F8F5',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      fontWeight: isActive ? '700' : '500',
                      color: '#111111',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      <MessageSquare size={14} color="#111111" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</span>
                    </div>

                    {sessions.length > 1 && (
                      <button
                        onClick={e => deleteSession(s.id, e)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, padding: '2px' }}
                        title="Delete chat"
                      >
                        <Trash2 size={13} color="#111111" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TOPIC CATEGORIES */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#666666', marginBottom: '10px' }}>
              TOPIC CATEGORIES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {TOPIC_CATEGORIES.map(cat => {
                const isSelected = activeTopic === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTopic(cat.id)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isSelected ? '#111111' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#333333',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{cat.label}</span>
                    {isSelected && <ChevronRight size={14} color="#FF2AA1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MAIN CHAT WORKSPACE */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '8px 8px 0px #111111',
          minHeight: '620px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          
          {/* PROJECT CONTEXT AVAILABLE BANNER */}
          {projectContext && (
            <div style={{
              backgroundColor: '#EDECE7',
              border: '2px solid #111111',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#FF2AA1' }}>
                  ● USER-PROVIDED PROJECT DATA ATTACHED
                </div>
                <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: '#111111', marginTop: '2px' }}>
                  {Object.entries(projectContext).map(([k, v]) => `${k.replace('_', ' ')}: ${v}`).join(' | ')}
                </div>
              </div>
              <button
                onClick={() => setProjectContext(null)}
                style={{ backgroundColor: '#111111', color: '#FFF', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', cursor: 'pointer' }}
              >
                CLEAR CONTEXT
              </button>
            </div>
          )}

          {/* CHAT MESSAGES / WELCOME EMPTY STATE */}
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '6px' }}>
            {(!currentSession || currentSession.messages.length === 0) ? (
              
              /* WELCOME EMPTY STATE */
              <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#FF2AA1',
                  color: '#FFFFFF',
                  transform: 'rotate(45deg)',
                  marginBottom: '24px',
                  boxShadow: '0 6px 16px rgba(255, 42, 161, 0.3)'
                }}>
                  <span style={{ transform: 'rotate(-45deg)', fontFamily: 'Anton, sans-serif', fontSize: '28px' }}>CA</span>
                </div>

                <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', color: '#111111', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                  ASK CONARK
                </h2>
                
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#555555', maxWidth: '560px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
                  "Construction questions in. Useful explanations out."
                </p>

                {/* SUGGESTED QUESTIONS GRID */}
                <div style={{ marginTop: '28px', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111111', marginBottom: '12px' }}>
                    SUGGESTED QUESTIONS ({activeTopic}):
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {activeQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(q)}
                        style={{
                          backgroundColor: '#F9F8F5',
                          border: '1.5px solid #111111',
                          borderRadius: '8px',
                          padding: '14px 16px',
                          textAlign: 'left',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#111111',
                          cursor: 'pointer',
                          boxShadow: '2px 2px 0px #111111',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <span>"{q}"</span>
                        <ArrowUp size={16} color="#FF2AA1" style={{ transform: 'rotate(45deg)', flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (

              /* MESSAGES LIST */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {currentSession.messages.map(msg => {
                  const isUser = msg.role === 'user';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        backgroundColor: isUser ? '#111111' : '#EDECE7',
                        color: isUser ? '#FFFFFF' : '#111111',
                        border: '2px solid #111111',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: isUser ? '4px 4px 0px #555555' : '4px 4px 0px #111111',
                        position: 'relative'
                      }}
                    >
                      {/* Message Header Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '11px',
                          fontWeight: '800',
                          backgroundColor: isUser ? '#FFFFFF' : '#FF2AA1',
                          color: isUser ? '#111111' : '#FFFFFF',
                          padding: '3px 10px',
                          borderRadius: '4px',
                          letterSpacing: '0.06em'
                        }}>
                          {isUser ? 'YOU' : 'CONARK AI'}
                        </div>

                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', opacity: 0.6 }}>
                          {msg.timestamp}
                        </div>
                      </div>

                      {/* Message Content */}
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
                        {isUser ? (
                          <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                        ) : (
                          renderMarkdown(msg.content)
                        )}
                      </div>

                      {/* Assistant Message Action Bar */}
                      {!isUser && msg.content && (
                        <div style={{
                          borderTop: '1.5px solid #CCCCCC',
                          marginTop: '16px',
                          paddingTop: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '10px',
                          fontSize: '11px',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: '800'
                        }}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Copy size={12} /> {copiedMsgId === msg.id ? 'COPIED!' : 'COPY'}
                            </button>

                            <button
                              onClick={regenerateLastMessage}
                              style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <RotateCw size={12} /> REGENERATE
                            </button>

                            <button
                              onClick={() => handleUseAsContext(msg.content)}
                              style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Sparkles size={12} color="#FF2AA1" /> USE AS CONTEXT
                            </button>
                          </div>

                          <button
                            onClick={() => handleDownloadReport(msg)}
                            style={{ backgroundColor: '#111111', color: '#FFFFFF', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Download size={12} /> DOWNLOAD ANSWER
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ERROR ALERT BANNER */}
          {errorMsg && (
            <div style={{
              backgroundColor: '#FFD6D6',
              border: '2px solid #D32F2F',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              color: '#D32F2F',
              fontWeight: '600'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={regenerateLastMessage}
                style={{ backgroundColor: '#D32F2F', color: '#FFF', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', cursor: 'pointer' }}
              >
                TRY AGAIN
              </button>
            </div>
          )}

          {/* 3. MESSAGE INPUT BAR (MULTILINE + VOICE + ENTER) */}
          <div style={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#FFFFFF',
            paddingTop: '8px'
          }}>
            <div style={{
              backgroundColor: '#F9F8F5',
              border: '2.5px solid #111111',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '4px 4px 0px #111111',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '12px'
            }}>
              <textarea
                ref={textareaRef}
                value={inputPrompt}
                onChange={e => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about construction safety, materials, cost, scheduling, machinery, or site operations..."
                rows={1}
                disabled={status === 'THINKING' || status === 'GENERATING'}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: '#111111',
                  resize: 'none',
                  maxHeight: '180px',
                  lineHeight: '1.5'
                }}
              />

              {/* Voice Input Microphone Button */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleSpeech}
                  style={{
                    backgroundColor: isListening ? '#FF2AA1' : '#EDECE7',
                    color: isListening ? '#FFFFFF' : '#111111',
                    border: '1.5px solid #111111',
                    borderRadius: '6px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={isListening ? 'Listening...' : 'Voice Input'}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              )}

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputPrompt.trim() || status === 'THINKING' || status === 'GENERATING'}
                style={{
                  backgroundColor: inputPrompt.trim() && status !== 'THINKING' && status !== 'GENERATING' ? '#111111' : '#CCCCCC',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  cursor: inputPrompt.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '16px'
                }}
              >
                <span>SEND</span>
                <ArrowUp size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#777777' }}>
              <span>ENTER → SEND | SHIFT + ENTER → NEWLINE</span>
              <span>VERIFY SAFETY-CRITICAL DECISIONS ON SITE</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
