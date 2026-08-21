import React, { useState } from 'react';
import { BookOpen, Search, Copy, Check, ChevronRight, AlertCircle } from 'lucide-react';

interface DocTopic {
  id: string;
  category: string;
  title: string;
  shortDesc: string;
  overview: string;
  inputs?: string[];
  processing: string;
  outputs?: string[];
  codeExample?: string;
  limitations: string;
  related: string[];
}

export const DocsPage: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<string>('intro');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const docTopics: DocTopic[] = [
    {
      id: 'intro',
      category: 'GETTING STARTED',
      title: 'Introduction to ConArk Systems',
      shortDesc: 'AI-driven construction decision support platform integrating ML, SciPy, and LLM explanation layers.',
      overview: 'ConArk Systems is an advanced multi-model research platform designed to transform chaotic site telemetries into structured predictive insights. It bridges machine learning predictions, mathematical space solvers, and natural language explanation layers.',
      processing: 'Input parameters submitted via REST API endpoints are validated, scaled, and dispatched to scikit-learn regressors/classifiers and SciPy spatial solvers. Results are formatted as JSON and grounded via Google Gemini 1.5 Flash.',
      limitations: 'Designed as a decision-support prototype. Outputs must be verified by licensed structural engineers prior to field execution.',
      related: ['quickstart', 'architecture', 'model-perf']
    },
    {
      id: 'quickstart',
      category: 'GETTING STARTED',
      title: 'Quick Start Guide',
      shortDesc: 'Step-by-step instructions to run your first structural prediction and generate a PDF executive report.',
      overview: 'Follow these steps to generate predictions: (1) Open the Project Input page, (2) Click "Fill Sample Inputs" or enter custom telemetry parameters, (3) Click "Run Prediction", (4) Review Gemini AI explanation, and (5) Export PDF executive summary.',
      processing: 'Frontend sends POST request to `/api/v1/intelligence/analyze` with JSON payload containing project parameters.',
      codeExample: `// Example JS API Call
const response = await fetch('/api/v1/intelligence/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    building_age: 12,
    concrete_grade: 'M40',
    seismic_zone: 3,
    ambient_temp: 32.5,
    humidity: 65.0,
    workforce_size: 45
  })
});
const data = await response.json();
console.log(data.predictions);`,
      limitations: 'Requires backend Uvicorn server running on localhost:8000.',
      related: ['intro', 'api-overview']
    },
    {
      id: 'architecture',
      category: 'GETTING STARTED',
      title: 'System Architecture',
      shortDesc: 'Overview of ConArk decoupled architecture spanning React Vite frontend, FastAPI backend, ML engines, and LLM APIs.',
      overview: 'ConArk utilizes a modern, decoupled architecture: (1) React Vite SPA frontend rendered with custom CSS and Framer Motion, (2) Python FastAPI REST API server running on port 8000, (3) Preloaded joblib ML pipelines, (4) SciPy spatial allocation solver, and (5) Server-side Gemini & OpenRouter AI proxy routes.',
      processing: 'Client requests execute inside asynchronous FastAPI route handlers. ML models run in-memory without database latency.',
      limitations: 'Current prototype executes ML inference single-node in Python GIL threadpool.',
      related: ['dataflow', 'api-overview']
    },
    {
      id: 'dataflow',
      category: 'GETTING STARTED',
      title: 'Data Flow & Telemetry Pipeline',
      shortDesc: 'Traces telemetry data lifecycle from browser user input to model inference and Gemini grounding.',
      overview: 'Telemetry data moves through 4 stages: (1) Form validation in React, (2) Pydantic schema verification in FastAPI, (3) Feature scaling & ML inference in joblib pipeline, and (4) Structured prompt synthesis sent to Gemini 1.5 Flash for grounded explanation.',
      processing: 'Data transformation utilizes NumPy arrays and pandas DataFrames before scikit-learn prediction calls.',
      limitations: 'Invalid telemetry types return 422 Unprocessable Entity error payloads.',
      related: ['architecture', 'api-prediction']
    },
    {
      id: 'model-perf',
      category: 'MODELS',
      title: 'Performance Intelligence Model',
      shortDesc: 'Predicts structural performance index, degradation curves, and endurance scores based on environmental load.',
      overview: 'The Performance Intelligence model evaluates structural health based on concrete grade, age, seismic zone, and thermal stress. It forecasts structural integrity retention over a 50-year service life.',
      inputs: ['Building Age (years)', 'Concrete Grade (M20–M80)', 'Seismic Zone (1–5)', 'Ambient Temp (°C)', 'Humidity (%)'],
      processing: 'RandomForestRegressor pipeline trained on structural strain telemetries with 5-fold cross-validation.',
      outputs: ['Performance Index Score (0–100%)', 'Degradation Rate (%/year)', 'Endurance Rating'],
      codeExample: `// Performance Model Payload
{
  "building_age": 15,
  "concrete_grade": "M35",
  "seismic_zone": 4,
  "ambient_temp": 38.0,
  "humidity": 70.0
}`,
      limitations: 'Assumes standard reinforced concrete degradation physics.',
      related: ['model-risk', 'model-cost']
    },
    {
      id: 'model-risk',
      category: 'MODELS',
      title: 'Risk Intelligence Model',
      shortDesc: 'Evaluates site operational hazards, delay likelihood, and safety compliance vulnerabilities.',
      overview: 'The Risk Intelligence model analyzes safety compliance scores, worker fatigue indexes, and weather severity to calculate a comprehensive Operational Risk Probability (%).',
      inputs: ['Safety Protocol Score (0–100)', 'Worker Fatigue Index (1–10)', 'Weather Severity', 'Equipment Age'],
      processing: 'GradientBoostingClassifier trained on historical construction site incident reports.',
      outputs: ['Operational Risk Score (0–100%)', 'Hazard Level (LOW/MED/HIGH)', 'Primary Risk Drivers'],
      limitations: 'Does not model sudden natural catastrophes or unpredictable geo-political disruptions.',
      related: ['model-perf', 'model-cost']
    },
    {
      id: 'model-cost',
      category: 'MODELS',
      title: 'Cost Forecast Intelligence Model',
      shortDesc: 'Forecasts material budget overruns, labor expenditure, and total cost variance in USD.',
      overview: 'The Cost Forecast Intelligence Model utilizes XGBRegressor algorithms trained on historical procurement and labor telemetries to predict budget variance ($).',
      inputs: ['Material Usage (kg)', 'Energy Consumption (kWh)', 'Equipment Utilization Rate (%)', 'Task Progress (%)'],
      processing: 'Gradient Boosted Decision Trees trained on historical material and labor cost deviations.',
      outputs: ['Predicted Cost Deviation ($)', 'Cost Variance Status', 'Budget Expenditure Metrics'],
      codeExample: `// Cost Forecast Model Payload
{
  "material_usage": 680.0,
  "energy_consumption": 340.0,
  "equipment_utilization_rate": 91.2,
  "task_progress": 0.42
}`,
      limitations: 'Relies on macro-economic inflation and material market price inputs.',
      related: ['model-time', 'model-risk']
    },
    {
      id: 'model-time',
      category: 'MODELS',
      title: 'Time Schedule Forecast Model',
      shortDesc: 'Predicts schedule slippage, completion timeline deviations, and critical path delay in days.',
      overview: 'The Time Schedule Forecast Model uses HistGradientBoosting Regressors to estimate project completion delays and milestone timeline variances.',
      inputs: ['Task Progress (%)', 'Machinery Status', 'Worker Count', 'Equipment Utilization Rate (%)', 'Safety Incidents'],
      processing: 'Histogram-based Gradient Boosting Regressor for non-linear timeline delay estimation.',
      outputs: ['Predicted Time Delay (Days)', 'Schedule Deviation Status', 'Milestone Confidence Score'],
      codeExample: `// Time Forecast Model Payload
{
  "task_progress": 0.42,
  "machinery_status": 1,
  "worker_count": 45,
  "equipment_utilization_rate": 91.2,
  "safety_incidents": 1
}`,
      limitations: 'Does not account for unpredictable weather closures or labor union strikes.',
      related: ['model-cost', 'model-perf']
    },
    {
      id: 'model-optimization',
      category: 'MODELS',
      title: 'Project Optimization Model',
      shortDesc: 'Multiclass classification model predicting optimal Pareto trade-off recommendations for project execution.',
      overview: 'The Project Optimization Model uses HistGradientBoosting Classifiers to evaluate joint cost variance, schedule delay, and operational risk probabilities, returning high-impact site action recommendations (e.g. REALLOCATE WORKERS, ACCELERATE SCHEDULE, OPTIMIZE STAGING).',
      inputs: ['Cost Deviation ($)', 'Schedule Delay (Days)', 'Task Progress (%)', 'Risk Score (%)', 'Equipment Utilization Rate (%)'],
      processing: 'Histogram-based Gradient Boosting Multiclass Classifier (92.49% validation accuracy).',
      outputs: ['Optimization Recommendation', 'Trade-off Pareto Level', 'Action Priority Score'],
      codeExample: `// POST /api/v1/intelligence/analyze
{
  "task_progress": 0.42,
  "cost_deviation": 2707.71,
  "time_deviation": -4.65,
  "risk_score": 52
}`,
      limitations: 'Assumes continuous site access without emergency site evacuations.',
      related: ['model-space', 'model-cost', 'model-time']
    },
    {
      id: 'model-space',
      category: 'MODELS',
      title: 'Space Optimization Model',
      shortDesc: 'SciPy-powered mathematical solver allocating site footprint area (m²) across laydown, cranes, and storage.',
      overview: 'Space Optimization uses SciPy `minimize` SLSQP algorithms to distribute total site footprint across operational zones (Laydown Yards, Heavy Machinery, Material Storage, Worker Facilities, Safety Buffers) while enforcing minimum safety clearances.',
      inputs: ['Total Site Area (m²)', 'Construction Stage (Exacavation/Structure/Finishing)', 'Material Volume', 'Safety Radius (m)'],
      processing: 'Sequential Least Squares Programming (SLSQP) constrained optimization solver.',
      outputs: ['Spatial Allocation Map (m² per zone)', 'Feasibility Status', 'Space Utilization Rate (%)'],
      codeExample: `// POST /api/v1/space/optimize
{
  "total_area_sqm": 1200,
  "stage": "STRUCTURE",
  "min_laydown_sqm": 350,
  "safety_buffer_m": 15
}`,
      limitations: 'Calculates 2D planar footprint allocations; 3D vertical stacking optimization is not included.',
      related: ['model-opt', 'api-optimization']
    },
    {
      id: 'ai-gemini',
      category: 'AI',
      title: 'Gemini Explanation Layer',
      shortDesc: 'Google Gemini 1.5 Flash prompt synthesis converting verified ML outputs into grounded natural language.',
      overview: 'The Gemini Explanation Layer receives numerical ML predictions, constructs a structured prompt instructing Gemini to strictly reference verified output metrics, and returns executive summaries for project managers.',
      processing: 'Uses Google GenAI SDK with fallback deterministic report generation in case of API timeouts.',
      limitations: 'Explanations depend on external Gemini API availability.',
      related: ['ai-conark', 'api-ai']
    },
    {
      id: 'ai-conark',
      category: 'AI',
      title: 'ConArk Intelligence (Gemma 4)',
      shortDesc: 'Conversational construction assistant powered by google/gemma-4-26b-a4b-it:free via OpenRouter.',
      overview: 'ConArk Intelligence allows site managers to ask technical construction questions, material specs, site safety standards, and project scheduling advice using an OpenRouter-compatible endpoint.',
      processing: 'OpenRouter chat completions API proxy (`POST https://openrouter.ai/api/v1/chat/completions`) executed server-side.',
      limitations: 'Conversational responses are decision support and do not constitute certified engineering advice.',
      related: ['ai-gemini', 'sec-overview']
    },
    {
      id: 'api-overview',
      category: 'API',
      title: 'API Overview & Standards',
      shortDesc: 'RESTful API conventions, JSON payload structures, and response codes.',
      overview: 'ConArk Systems exposes RESTful HTTP APIs built on FastAPI. All requests accept `Content-Type: application/json` and return standard HTTP status codes (200 OK, 400 Bad Request, 422 Unprocessable Entity, 500 Server Error).',
      processing: 'FastAPI automatic OpenAPI schema generator (`http://localhost:8000/docs`).',
      codeExample: `GET /api/v1/health
Host: localhost:8000

Response 200 OK:
{
  "status": "healthy",
  "version": "1.0.0",
  "models_loaded": 5
}`,
      limitations: 'Currently configured for local development and private server deployments.',
      related: ['api-prediction', 'api-optimization']
    },
    {
      id: 'api-prediction',
      category: 'API',
      title: 'Prediction APIs',
      shortDesc: 'POST /api/v1/intelligence/analyze specification and schema.',
      overview: 'Executes all preloaded scikit-learn models simultaneously and triggers Gemini natural language grounding.',
      inputs: ['building_age', 'concrete_grade', 'seismic_zone', 'ambient_temp', 'humidity', 'workforce_size'],
      processing: 'Vectorized batch prediction across 5 ML estimators.',
      outputs: ['performance_score', 'risk_probability', 'cost_variance', 'delay_days', 'gemini_explanation'],
      codeExample: `POST /api/v1/intelligence/analyze HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "building_age": 10,
  "concrete_grade": "M40",
  "seismic_zone": 3,
  "ambient_temp": 30.0,
  "humidity": 60.0,
  "workforce_size": 50
}`,
      limitations: 'Payload must contain all required telemetry fields.',
      related: ['api-overview', 'model-perf']
    },
    {
      id: 'reports-pdf',
      category: 'REPORTS',
      title: 'PDF Executive Reports',
      shortDesc: 'HTML5 Canvas and PDF document generation architecture.',
      overview: 'ConArk utilizes client-side HTML5 Canvas rendering to convert report elements into downloadable, crisp PDF executive summaries containing key metrics, risk radar gauges, and Gemini text.',
      processing: 'Client-side rendering without transmitting document files to external cloud storage.',
      limitations: 'Download requires browser popup and print dialog permissions.',
      related: ['intro', 'model-perf']
    },
    {
      id: 'research-dataset',
      category: 'RESEARCH',
      title: 'Building Performance Dataset',
      shortDesc: 'Dataset composition, synthetic telemetry generation, and feature distributions.',
      overview: 'The Building Performance Dataset contains 10,000 synthetic construction telemetry samples generated using physical structural formulas and empirical site observation benchmarks.',
      processing: 'Features normalized using `StandardScaler` and split into 80/20 train/test ratios.',
      limitations: 'Synthetic data distributions may not capture all rare edge-case real-world site anomalies.',
      related: ['intro', 'model-perf']
    },
    {
      id: 'sec-overview',
      category: 'SECURITY',
      title: 'Security Overview & Secret Management',
      shortDesc: 'Server-side API key isolation, environment variable protection, and input sanitization.',
      overview: 'ConArk Systems enforces strict server-side secret management: Gemini (`GEMINI_API_KEY_OPTIMIZATION`) and OpenRouter API keys are stored in backend `.env` variables and NEVER exposed to frontend JS bundles.',
      processing: 'All external AI API calls originate strictly from Python FastAPI server handlers.',
      limitations: 'Ensure `.env` file is included in `.gitignore` to prevent secret leaks in source control.',
      related: ['architecture', 'ai-conark']
    }
  ];

  const categories = Array.from(new Set(docTopics.map(t => t.category)));

  const activeTopic = docTopics.find(t => t.id === activeTopicId) || docTopics[0];

  const handleCopyCode = () => {
    if (activeTopic.codeExample) {
      navigator.clipboard.writeText(activeTopic.codeExample);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const filteredTopics = docTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER BAR */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '3px solid #111111',
        borderRadius: '16px',
        padding: '28px 36px',
        marginBottom: '28px',
        boxShadow: '6px 6px 0px #111111',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#4FC3F7', color: '#111111', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', marginBottom: '8px' }}>
            <BookOpen size={14} /> TECHNICAL DOCUMENTATION
          </div>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '36px', margin: 0, letterSpacing: '0.04em', color: '#111111' }}>
            CONARK DOCUMENTATION
          </h1>
        </div>

        {/* DOC SEARCH */}
        <div style={{ position: 'relative', width: '340px' }}>
          <Search size={18} color="#777777" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search docs (e.g. Gemini, Risk, API)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              fontSize: '13px',
              border: '2px solid #111111',
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* DOCUMENTATION MAIN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '28px', alignItems: 'start' }}>
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '4px 4px 0px #111111',
          position: 'sticky',
          top: '20px',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto'
        }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', color: '#666666', marginBottom: '16px', letterSpacing: '0.05em' }}>
            NAVIGATION INDEX
          </div>

          {categories.map((category) => {
            const categoryTopics = filteredTopics.filter(t => t.category === category);
            if (categoryTopics.length === 0) return null;
            return (
              <div key={category} style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '14px', color: '#FF2AA1', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {category}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {categoryTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopicId(topic.id)}
                      style={{
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: activeTopicId === topic.id ? '#111111' : 'transparent',
                        color: activeTopicId === topic.id ? '#FFFFFF' : '#333333',
                        border: 'none',
                        fontSize: '12.5px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: activeTopicId === topic.id ? '700' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {topic.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT DOCUMENT CONTENT AREA */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '14px',
          padding: '36px',
          boxShadow: '6px 6px 0px #111111',
          lineHeight: '1.6'
        }}>
          
          {/* BREADCRUMBS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#666666', marginBottom: '16px' }}>
            <span>Docs</span>
            <ChevronRight size={14} />
            <span style={{ color: '#FF2AA1', fontWeight: 'bold' }}>{activeTopic.category}</span>
            <ChevronRight size={14} />
            <span style={{ color: '#111111', fontWeight: 'bold' }}>{activeTopic.title}</span>
          </div>

          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '32px', color: '#111111', margin: '0 0 8px 0', letterSpacing: '0.03em' }}>
            {activeTopic.title}
          </h2>

          <p style={{ fontSize: '16px', color: '#555555', fontWeight: '500', marginBottom: '28px', borderBottom: '2px solid #EEEEEE', paddingBottom: '16px' }}>
            {activeTopic.shortDesc}
          </p>

          {/* OVERVIEW */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', color: '#111111', marginBottom: '8px' }}>
              OVERVIEW
            </h3>
            <p style={{ fontSize: '14px', color: '#333333', lineHeight: '1.7' }}>
              {activeTopic.overview}
            </p>
          </div>

          {/* INPUTS & OUTPUTS GRID */}
          {(activeTopic.inputs || activeTopic.outputs) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              {activeTopic.inputs && (
                <div style={{ backgroundColor: '#F9F8F3', border: '1.5px solid #111111', padding: '18px', borderRadius: '10px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: '800', color: '#FF2AA1', marginBottom: '8px' }}>
                    INPUT PARAMETERS
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#333' }}>
                    {activeTopic.inputs.map((inp, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{inp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTopic.outputs && (
                <div style={{ backgroundColor: '#F0F9FF', border: '1.5px solid #111111', padding: '18px', borderRadius: '10px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: '800', color: '#0288D1', marginBottom: '8px' }}>
                    PRODUCED OUTPUTS
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#333' }}>
                    {activeTopic.outputs.map((out, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{out}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* PROCESSING LOGIC */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '18px', color: '#111111', marginBottom: '8px' }}>
              PROCESSING & METHODOLOGY
            </h3>
            <p style={{ fontSize: '14px', color: '#333333', lineHeight: '1.7' }}>
              {activeTopic.processing}
            </p>
          </div>

          {/* CODE / API EXAMPLE WITH COPY BUTTON */}
          {activeTopic.codeExample && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111111', color: '#FFFFFF', padding: '10px 16px', borderRadius: '8px 8px 0 0' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: '800' }}>
                  CODE / API EXAMPLE
                </span>
                <button
                  onClick={handleCopyCode}
                  style={{
                    backgroundColor: copiedCode ? '#7CFFA6' : '#333333',
                    color: copiedCode ? '#111111' : '#FFFFFF',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                  {copiedCode ? 'COPIED!' : 'COPY CODE'}
                </button>
              </div>
              <pre style={{
                backgroundColor: '#1E1E1E',
                color: '#D4D4D4',
                padding: '16px',
                borderRadius: '0 0 8px 8px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '13px',
                overflowX: 'auto',
                margin: 0,
                lineHeight: '1.5'
              }}>
                <code>{activeTopic.codeExample}</code>
              </pre>
            </div>
          )}

          {/* LIMITATIONS */}
          <div style={{ backgroundColor: '#FFF3CD', border: '1.5px solid #FFEBAA', padding: '16px', borderRadius: '10px', marginBottom: '24px' }}>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '16px', color: '#856404', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> MODEL LIMITATIONS
            </div>
            <div style={{ fontSize: '13px', color: '#856404', lineHeight: '1.5' }}>
              {activeTopic.limitations}
            </div>
          </div>

          {/* RELATED DOCS */}
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: '800', color: '#777777', marginBottom: '8px' }}>
              RELATED DOCUMENTATION TOPICS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {activeTopic.related.map((relId) => {
                const relTopic = docTopics.find(t => t.id === relId);
                if (!relTopic) return null;
                return (
                  <button
                    key={relId}
                    onClick={() => setActiveTopicId(relId)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #111111',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {relTopic.title} →
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
