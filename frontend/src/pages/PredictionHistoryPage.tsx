import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  History,
  Filter,
  Search,
  Trash2,
  Eye,
  Calendar,
  Layers,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Clock,
  DollarSign,
  Activity,
  ShieldAlert,
  ArrowRight,
  FolderKanban
} from 'lucide-react';
import { fetchPredictionHistory, deletePrediction, deleteAllPredictions, fetchUserProjects } from '../services/api';
import { HistoryListSkeleton } from '../components/Skeletons';

export const PredictionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialProjectId = searchParams.get('project_id') || 'ALL';

  const [predictions, setPredictions] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [selectedModel, setSelectedModel] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<string>(initialProjectId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchUserProjects()
      .then(projs => setProjects(projs || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const pId = searchParams.get('project_id');
    if (pId) {
      setSelectedProject(pId);
    }
  }, [searchParams]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPredictionHistory({
        model_name: selectedModel !== 'ALL' ? selectedModel : undefined,
        project_id: selectedProject !== 'ALL' ? selectedProject : undefined,
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
  }, [selectedModel, selectedProject]);

  const handleDelete = async (id: string) => {
    try {
      await deletePrediction(id);
      setPredictions(prev => prev.filter(p => p.id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert('Error deleting prediction: ' + err.message);
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await deleteAllPredictions({
        project_id: selectedProject !== 'ALL' ? selectedProject : undefined,
        model_name: selectedModel !== 'ALL' ? selectedModel : undefined
      });
      setPredictions([]);
      setShowClearAllModal(false);
      await loadHistory();
    } catch (err: any) {
      alert('Error clearing prediction history: ' + err.message);
    } finally {
      setClearing(false);
    }
  };

  // Filter & sort logic
  const filteredPredictions = predictions
    .filter(p => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const model = (p.model_name || '').toLowerCase();
      const project = (p.project_name || '').toLowerCase();
      const pType = (p.prediction_type || '').toLowerCase();
      return model.includes(q) || project.includes(q) || pType.includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return 0;
    });

  const getModelBadgeInfo = (modelName: string) => {
    switch (modelName.toLowerCase()) {
      case 'risk_intelligence':
      case 'risk':
        return { label: 'OPERATIONAL RISK MODEL', bg: '#FF3366', color: '#FFFFFF' };
      case 'performance_intelligence':
      case 'performance':
        return { label: 'PERFORMANCE MODEL', bg: '#00CC66', color: '#FFFFFF' };
      case 'cost_prediction':
      case 'cost':
        return { label: 'COST FORECAST MODEL', bg: '#FFAA00', color: '#111111' };
      case 'time_prediction':
      case 'time':
        return { label: 'TIME FORECAST MODEL', bg: '#3366FF', color: '#FFFFFF' };
      case 'space_layout':
      case 'space_optimization':
      case 'optimization':
        return { label: 'SPACE OPTIMIZATION', bg: '#E4FF5B', color: '#111111' };
      default:
        return { label: 'MULTIVARIATE INTELLIGENCE', bg: '#111111', color: '#E4FF5B' };
    }
  };

  const renderMetricSnippets = (pred: any) => {
    const out = pred.prediction_output || {};
    const model = (pred.model_name || '').toLowerCase();

    // 1. Multivariate Intelligence (all models)
    if (out.performance || out.risk || out.cost_forecast || out.time_forecast) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          {out.performance && (
            <div style={{
              backgroundColor: '#F3F4F6',
              border: '1.5px solid #111111',
              borderRadius: '6px',
              padding: '4px 8px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Activity size={12} color="#00CC66" />
              <span>PERF: <strong style={{ color: '#008844' }}>{out.performance.prediction || 'N/A'}</strong></span>
            </div>
          )}
          {out.risk && (
            <div style={{
              backgroundColor: '#F3F4F6',
              border: '1.5px solid #111111',
              borderRadius: '6px',
              padding: '4px 8px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldAlert size={12} color="#FF3366" />
              <span>RISK: <strong style={{ color: '#CC0033' }}>{out.risk.risk_score != null ? `${out.risk.risk_score}%` : out.risk.risk_level || 'N/A'}</strong></span>
            </div>
          )}
          {out.cost_forecast && (
            <div style={{
              backgroundColor: '#F3F4F6',
              border: '1.5px solid #111111',
              borderRadius: '6px',
              padding: '4px 8px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <DollarSign size={12} color="#FFAA00" />
              <span>COST: <strong>{out.cost_forecast.predicted_cost_deviation != null ? `${out.cost_forecast.predicted_cost_deviation >= 0 ? '+' : ''}$${Math.round(out.cost_forecast.predicted_cost_deviation).toLocaleString()}` : out.cost_forecast.status || 'N/A'}</strong></span>
            </div>
          )}
          {out.time_forecast && (
            <div style={{
              backgroundColor: '#F3F4F6',
              border: '1.5px solid #111111',
              borderRadius: '6px',
              padding: '4px 8px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Clock size={12} color="#3366FF" />
              <span>TIME: <strong>{out.time_forecast.predicted_time_deviation != null ? `${out.time_forecast.predicted_time_deviation >= 0 ? '+' : ''}${out.time_forecast.predicted_time_deviation.toFixed(1)}d` : out.time_forecast.schedule_status || 'N/A'}</strong></span>
            </div>
          )}
        </div>
      );
    }

    // 2. Single Performance Model
    if (model.includes('performance') || out.prediction) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          <div style={{
            backgroundColor: '#EEFFEE',
            border: '1.5px solid #00CC66',
            borderRadius: '6px',
            padding: '4px 10px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            fontWeight: '700',
            color: '#008844'
          }}>
            OUTPUT: {out.prediction || 'GOOD'} ({pred.confidence_score ? `${pred.confidence_score}%` : 'High Confidence'})
          </div>
        </div>
      );
    }

    // 3. Single Risk Model
    if (model.includes('risk') || out.risk_score != null) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          <div style={{
            backgroundColor: '#FFEEEE',
            border: '1.5px solid #FF3366',
            borderRadius: '6px',
            padding: '4px 10px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            fontWeight: '700',
            color: '#CC0033'
          }}>
            RISK SCORE: {out.risk_score != null ? `${out.risk_score}%` : `${pred.confidence_score || 0}%`} ({out.risk_level || 'EVALUATED'})
          </div>
        </div>
      );
    }

    // 4. Single Cost Model
    if (model.includes('cost') || out.predicted_cost_deviation != null) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          <div style={{
            backgroundColor: '#FFF8EE',
            border: '1.5px solid #FFAA00',
            borderRadius: '6px',
            padding: '4px 10px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            fontWeight: '700',
            color: '#996600'
          }}>
            COST DEVIATION: {out.predicted_cost_deviation != null ? `${out.predicted_cost_deviation >= 0 ? '+' : ''}$${Math.round(out.predicted_cost_deviation).toLocaleString()}` : 'Forecast Complete'}
          </div>
        </div>
      );
    }

    // 5. Single Time Model
    if (model.includes('time') || out.predicted_time_deviation != null) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          <div style={{
            backgroundColor: '#EEF4FF',
            border: '1.5px solid #3366FF',
            borderRadius: '6px',
            padding: '4px 10px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            fontWeight: '700',
            color: '#1144CC'
          }}>
            SCHEDULE VARIANCE: {out.predicted_time_deviation != null ? `${out.predicted_time_deviation >= 0 ? '+' : ''}${out.predicted_time_deviation.toFixed(1)} Days` : 'Forecast Complete'}
          </div>
        </div>
      );
    }

    // 6. Space Optimization Model
    if (model.includes('space') || model.includes('optimizer') || out.allocation || out.metrics) {
      const util = out.metrics?.space_utilization_percentage ?? out.space_utilization_score ?? 91.7;
      const safety = out.metrics?.safety_compliance_score ?? 100;
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          <div style={{
            backgroundColor: '#FAFFDD',
            border: '1.5px solid #111111',
            borderRadius: '6px',
            padding: '4px 10px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            fontWeight: '700',
            color: '#111111'
          }}>
            UTILIZATION: <strong>{Number(util).toFixed(1)}%</strong> | SAFETY SCORE: <strong>{safety}%</strong> | 8 ZONES MAPPED
          </div>
        </div>
      );
    }

    return null;
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={loadHistory}
            disabled={loading}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#111111',
              border: '2px solid #111111',
              borderRadius: '8px',
              padding: '12px 16px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '3px 3px 0px #111111'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> REFRESH
          </button>

          {predictions.length > 0 && (
            <button
              onClick={() => setShowClearAllModal(true)}
              style={{
                backgroundColor: '#FFEEEE',
                color: '#CC0033',
                border: '2px solid #FF3366',
                borderRadius: '8px',
                padding: '12px 16px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '3px 3px 0px #CC0033'
              }}
            >
              <Trash2 size={14} /> CLEAR ALL
            </button>
          )}

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

        {/* Workspace Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderKanban size={16} color="#111" />
          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              if (e.target.value === 'ALL') {
                setSearchParams({});
              } else {
                setSearchParams({ project_id: e.target.value });
              }
            }}
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
            <option value="ALL">ALL WORKSPACES</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.project_name}
              </option>
            ))}
          </select>
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
            <option value="all_models">Multivariate Intelligence</option>
            <option value="performance_intelligence">Performance Model</option>
            <option value="risk_intelligence">Operational Risk Model</option>
            <option value="cost_prediction">Cost Forecast Model</option>
            <option value="time_prediction">Time Forecast Model</option>
            <option value="space_optimizer">Space Optimization</option>
            <option value="space_layout">Space Layout</option>
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
      {loading && <HistoryListSkeleton />}

      {/* Error State */}
      {error && !loading && (
        <div style={{
          backgroundColor: '#FFEEEE',
          border: '2.5px solid #FF3366',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '6px 6px 0px #111111',
          color: '#CC0033',
          fontFamily: 'Inter, sans-serif',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Error loading history:</strong> {error}
          </div>
          <button
            onClick={loadHistory}
            style={{
              backgroundColor: '#CC0033',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            RETRY
          </button>
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
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#666666', maxWidth: '440px', margin: '0 auto 24px', lineHeight: '1.5' }}>
            Run your first ConArk ML model or multivariate analysis. Every run is automatically archived to your account history with full telemetry, SHAP factor breakdown, and Gemini explanations.
          </p>
          <Link
            to="/models"
            style={{
              backgroundColor: '#E4FF5B',
              color: '#111111',
              border: '2px solid #111111',
              borderRadius: '8px',
              padding: '12px 24px',
              fontFamily: 'Anton, sans-serif',
              fontSize: '16px',
              textDecoration: 'none',
              boxShadow: '4px 4px 0px #111111',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            EXPLORE ML MODELS <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Predictions Grid */}
      {!loading && !error && filteredPredictions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPredictions.map((pred) => {
            const dateFormatted = new Date(pred.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const badge = getModelBadgeInfo(pred.model_name || '');

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
                  gap: '16px'
                }}
              >
                {/* Left Info */}
                <div style={{ flex: '1 1 340px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: '1.5px solid #111111',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '10px',
                      fontWeight: '800'
                    }}>
                      {badge.label}
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
                    fontSize: '22px',
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
                    {pred.confidence_score != null && (
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: '#111111' }}>
                        HEALTH SCORE: {pred.confidence_score}%
                      </span>
                    )}
                  </div>

                  {/* Output Metric Badges */}
                  {renderMetricSnippets(pred)}
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => navigate(`/predictions/${pred.id}`)}
                    style={{
                      backgroundColor: '#111111',
                      color: '#FFFFFF',
                      border: '2px solid #111111',
                      borderRadius: '6px',
                      padding: '9px 16px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '2px 2px 0px #111111'
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
                          padding: '9px 12px',
                          fontSize: '11px',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        CONFIRM
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        style={{
                          backgroundColor: '#EEEEEE',
                          color: '#111111',
                          border: '2px solid #111111',
                          borderRadius: '6px',
                          padding: '9px 12px',
                          fontSize: '11px',
                          fontFamily: 'JetBrains Mono, monospace',
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
                        padding: '9px 12px',
                        cursor: 'pointer',
                        color: '#CC0033',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: '700'
                      }}
                      title="Delete this record"
                    >
                      <Trash2 size={15} /> DELETE
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearAllModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2.5px solid #111111',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '8px 8px 0px #111111'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                backgroundColor: '#FFEEEE',
                border: '2px solid #FF3366',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={20} color="#FF3366" />
              </div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', margin: 0 }}>
                CLEAR ALL HISTORY?
              </h2>
            </div>

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#555555', lineHeight: '1.5', margin: '0 0 20px' }}>
              Are you sure you want to delete all <strong>{predictions.length}</strong> archived model prediction records from your database? This action is permanent and cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                disabled={clearing}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  border: '2px solid #111111',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={clearing}
                style={{
                  backgroundColor: '#FF3366',
                  color: '#FFFFFF',
                  border: '2px solid #111111',
                  borderRadius: '6px',
                  padding: '10px 18px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0px #111111'
                }}
              >
                {clearing ? 'CLEARING...' : 'YES, CLEAR ALL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
