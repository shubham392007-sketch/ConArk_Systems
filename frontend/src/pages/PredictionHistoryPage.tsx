import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  Filter,
  Search,
  Trash2,
  Eye,
  Calendar,
  Layers,
  TrendingUp
} from 'lucide-react';
import { fetchPredictionHistory, deletePrediction } from '../services/api';

export const PredictionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [selectedModel, setSelectedModel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPredictionHistory({
        model_name: selectedModel !== 'ALL' ? selectedModel : undefined,
        limit: 100
      });
      setPredictions(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load prediction history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [selectedModel]);

  const handleDelete = async (id: string) => {
    try {
      await deletePrediction(id);
      setPredictions(predictions.filter(p => p.id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert('Error deleting prediction: ' + err.message);
    }
  };

  // Filter & sort logic
  const filteredPredictions = predictions
    .filter(p => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const model = (p.model_name || '').toLowerCase();
      const project = (p.project_name || '').toLowerCase();
      return model.includes(q) || project.includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return 0;
    });

  const getModelBadgeColor = (modelName: string) => {
    switch (modelName.toLowerCase()) {
      case 'risk_intelligence':
      case 'risk':
        return '#FF3366';
      case 'performance_intelligence':
      case 'performance':
        return '#00CC66';
      case 'cost_prediction':
      case 'cost':
        return '#FFAA00';
      case 'time_prediction':
      case 'time':
        return '#3366FF';
      default:
        return '#FF2AA1';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 80px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #111111',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '8px 8px 0px #111111',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
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
            color: '#111111',
            marginBottom: '10px'
          }}>
            <History size={14} /> PERSISTENT TELEMETRY ARCHIVE
          </div>
          <h1 style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '36px',
            color: '#111111',
            margin: 0,
            letterSpacing: '0.02em'
          }}>
            PREDICTION HISTORY
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#666666',
            margin: '6px 0 0'
          }}>
            Review, inspect SHAP factor breakdowns, and export reports from your previous ML model runs.
          </p>
        </div>

        <Link
          to="/models"
          style={{
            backgroundColor: '#FF2AA1',
            color: '#FFFFFF',
            border: '2px solid #111111',
            borderRadius: '8px',
            padding: '12px 20px',
            fontFamily: 'Anton, sans-serif',
            fontSize: '16px',
            textDecoration: 'none',
            boxShadow: '4px 4px 0px #111111',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          RUN NEW PREDICTION <TrendingUp size={18} />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #111111',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '6px 6px 0px #111111',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px' }}>
          <Search size={16} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model or project..."
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              border: '2px solid #111111',
              borderRadius: '6px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              backgroundColor: '#F9F8F5',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Model Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#111" />
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '2px solid #111111',
              borderRadius: '6px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              fontWeight: '700',
              backgroundColor: '#F9F8F5',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">ALL MODELS</option>
            <option value="risk_intelligence">Risk Intelligence</option>
            <option value="performance_intelligence">Performance Intelligence</option>
            <option value="cost_prediction">Cost Prediction</option>
            <option value="time_prediction">Time Prediction</option>
            <option value="all_models">Multivariate Intelligence</option>
          </select>
        </div>

        {/* Sort Order */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', color: '#666' }}>SORT:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '2px solid #111111',
              borderRadius: '6px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              fontWeight: '700',
              backgroundColor: '#F9F8F5',
              cursor: 'pointer'
            }}
          >
            <option value="newest">NEWEST FIRST</option>
            <option value="oldest">OLDEST FIRST</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          boxShadow: '6px 6px 0px #111111'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #111111',
            borderTopColor: '#FF2AA1',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '800' }}>
            FETCHING PERSISTENT PREDICTIONS...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={{
          backgroundColor: '#FFEEEE',
          border: '2.5px solid #FF3366',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '6px 6px 0px #111111',
          color: '#CC0033',
          fontFamily: 'Inter, sans-serif'
        }}>
          <strong>Error loading history:</strong> {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredPredictions.length === 0 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          padding: '60px 24px',
          textAlign: 'center',
          boxShadow: '8px 8px 0px #111111'
        }}>
          <Layers size={48} color="#CCCCCC" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '28px', color: '#111111', margin: '0 0 8px' }}>
            NO PREDICTIONS FOUND
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#666666', maxWidth: '400px', margin: '0 auto 24px' }}>
            Run your first ConArk model to start building your persistent project intelligence history.
          </p>
          <Link
            to="/models"
            style={{
              backgroundColor: '#E4FF5B',
              color: '#111111',
              border: '2px solid #111111',
              borderRadius: '8px',
              padding: '10px 20px',
              fontFamily: 'Anton, sans-serif',
              fontSize: '16px',
              textDecoration: 'none',
              boxShadow: '3px 3px 0px #111111'
            }}
          >
            EXPLORE ML MODELS
          </Link>
        </div>
      )}

      {/* Predictions Grid */}
      {!loading && !error && filteredPredictions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredPredictions.map((pred) => {
            const dateFormatted = new Date(pred.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const badgeColor = getModelBadgeColor(pred.model_name || '');

            return (
              <div
                key={pred.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2.5px solid #111111',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  boxShadow: '5px 5px 0px #111111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  transition: 'transform 0.1s ease'
                }}
              >
                {/* Left Info */}
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      backgroundColor: badgeColor,
                      color: '#FFFFFF',
                      border: '1.5px solid #111111',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '10px',
                      fontWeight: '800'
                    }}>
                      {(pred.model_name || 'MODEL').toUpperCase().replace('_', ' ')}
                    </span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '11px',
                      color: '#777777'
                    }}>
                      VERSION: {pred.model_version || 'v1.0.0'}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: '20px',
                    color: '#111111',
                    margin: '0 0 6px 0',
                    letterSpacing: '0.02em'
                  }}>
                    {pred.project_name || 'Operational Telemetry Run'}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '12px', color: '#666666', fontFamily: 'Inter, sans-serif' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {dateFormatted}
                    </span>
                    {pred.confidence_score && (
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: '#111111' }}>
                        CONFIDENCE / HEALTH: {pred.confidence_score}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => navigate(`/predictions/${pred.id}`)}
                    style={{
                      backgroundColor: '#111111',
                      color: '#FFFFFF',
                      border: '2px solid #111111',
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
                    <Eye size={14} /> VIEW DETAILS
                  </button>

                  {deleteConfirmId === pred.id ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleDelete(pred.id)}
                        style={{
                          backgroundColor: '#FF3366',
                          color: '#FFFFFF',
                          border: '2px solid #111111',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        CONFIRM DELETE
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        style={{
                          backgroundColor: '#EEEEEE',
                          color: '#111111',
                          border: '2px solid #111111',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(pred.id)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #111111',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#666666'
                      }}
                      title="Delete prediction"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
