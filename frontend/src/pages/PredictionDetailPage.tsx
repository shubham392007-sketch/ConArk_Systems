import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Cpu,
  Brain,
  MessageSquare,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { fetchPredictionDetail, deletePrediction } from '../services/api';
import { PredictionDetailSkeleton } from '../components/Skeletons';

export const PredictionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPredictionDetail(id)
      .then((data) => setPrediction(data))
      .catch((err) => setError(err.message || 'Failed to load prediction details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this prediction record?')) return;
    try {
      await deletePrediction(id);
      navigate('/history', { replace: true });
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  if (loading) {
    return <PredictionDetailSkeleton />;
  }

  if (error || !prediction) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 16px' }}>
        <div style={{
          backgroundColor: '#FFEEEE',
          border: '2.5px solid #FF3366',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '6px 6px 0px #111111'
        }}>
          <h2 style={{ fontFamily: 'Anton, sans-serif', color: '#CC0033', margin: '0 0 8px' }}>RECORD NOT FOUND</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#666' }}>{error || 'Unable to retrieve the specified prediction.'}</p>
          <Link
            to="/history"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#111111',
              color: '#FFF',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              marginTop: '12px'
            }}
          >
            <ArrowLeft size={14} /> BACK TO HISTORY
          </Link>
        </div>
      </div>
    );
  }

  const dateFormatted = prediction?.created_at
    ? new Date(prediction.created_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'Recent Telemetry Run';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px 80px' }}>
      {/* Back button & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => navigate('/history')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #111111',
            borderRadius: '6px',
            padding: '8px 14px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '3px 3px 0px #111111'
          }}
        >
          <ArrowLeft size={16} /> BACK TO HISTORY
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              const modelLabel = prediction.model_name ? prediction.model_name.replace(/_/g, ' ').toUpperCase() : 'CONSTRUCTION INTELLIGENCE';
              const prompt = `Analyze and provide engineering recommendations for this ${modelLabel} prediction record:\n\nInput Parameters: ${JSON.stringify(prediction.input_data, null, 2)}\n\nPrediction Output: ${JSON.stringify(prediction.prediction_output, null, 2)}`;
              navigate('/construction-ai', {
                state: {
                  initialPrompt: prompt,
                  projectContext: prediction.input_data
                }
              });
            }}
            style={{
              backgroundColor: '#E4FF5B',
              color: '#111111',
              border: '2px solid #111111',
              borderRadius: '6px',
              padding: '8px 14px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '3px 3px 0px #111111'
            }}
          >
            <MessageSquare size={14} /> ASK CONARK AI
          </button>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#FF3366',
              border: '2px solid #FF3366',
              borderRadius: '6px',
              padding: '8px 14px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={14} /> DELETE RECORD
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #111111',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '8px 8px 0px #111111',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{
            backgroundColor: '#FF2AA1',
            color: '#FFFFFF',
            border: '2px solid #111111',
            borderRadius: '4px',
            padding: '3px 10px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            fontWeight: '800'
          }}>
            {prediction.model_name.toUpperCase().replace('_', ' ')}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#666' }}>
            ID: {prediction.id}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: '32px',
          color: '#111111',
          margin: '0 0 12px',
          letterSpacing: '0.02em'
        }}>
          {prediction.project_name || 'Operational Telemetry Prediction Run'}
        </h1>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#555' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} /> Run Date: <strong>{dateFormatted}</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={15} /> Version: <strong>{prediction.model_version || 'v1.0.0'}</strong>
          </span>
          {prediction.confidence_score && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#00CC66" /> Confidence: <strong>{prediction.confidence_score}%</strong>
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Input Parameters */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '6px 6px 0px #111111'
        }}>
          <h2 style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '20px',
            color: '#111111',
            margin: '0 0 16px',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Layers size={18} /> INPUT PARAMETERS
          </h2>

          <div style={{
            backgroundColor: '#F9F8F5',
            border: '2px solid #111111',
            borderRadius: '8px',
            padding: '16px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            maxHeight: '360px',
            overflowY: 'auto'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(prediction.input_data, null, 2)}
            </pre>
          </div>
        </div>

        {/* Prediction Results */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '6px 6px 0px #111111'
        }}>
          <h2 style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '20px',
            color: '#111111',
            margin: '0 0 16px',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Cpu size={18} /> PREDICTION RESULTS
          </h2>

          <div style={{
            backgroundColor: '#F9F8F5',
            border: '2px solid #111111',
            borderRadius: '8px',
            padding: '16px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            maxHeight: '360px',
            overflowY: 'auto'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(prediction.prediction_output, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* AI Explanation & Recommendations */}
      {prediction.explanation && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '8px 8px 0px #111111'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#E4FF5B',
            border: '2px solid #111111',
            borderRadius: '9999px',
            padding: '4px 12px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            fontWeight: '800',
            marginBottom: '14px'
          }}>
            <Brain size={14} /> GEMINI AI SYNTHESIS & EXECUTIVE ANALYSIS
          </div>

          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '24px', color: '#111111', margin: '0 0 14px' }}>
            ENGINEERING SUMMARY
          </h2>

          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#333333',
            whiteSpace: 'pre-wrap'
          }}>
            {prediction.explanation}
          </div>
        </div>
      )}
    </div>
  );
};
