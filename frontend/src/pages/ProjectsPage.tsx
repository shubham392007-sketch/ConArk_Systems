import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Building,
  MapPin,
  Trash2,
  ArrowRight,
  X,
  AlertCircle
} from 'lucide-react';
import { fetchUserProjects, createProject, deleteProject } from '../services/api';
import { ProjectsListSkeleton } from '../components/Skeletons';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Project Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Commercial Infrastructure');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserProjects();
      setProjects(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setModalError('Project name is required.');
      return;
    }

    setCreateLoading(true);
    setModalError(null);
    try {
      const newProj = await createProject({
        project_name: projectName.trim(),
        project_type: projectType,
        location: location.trim(),
        description: description.trim()
      });
      setProjects([newProj, ...projects]);
      setShowCreateModal(false);
      setProjectName('');
      setLocation('');
      setDescription('');
    } catch (err: any) {
      setModalError(err.message || 'Failed to create project.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete workspace "${name}"? All associated predictions and telemetry will remain archived.`)) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Error deleting project: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 80px' }}>
      {/* Top Banner */}
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
            <FolderKanban size={14} /> MULTI-SITE WORKSPACE MANAGEMENT
          </div>
          <h1 style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '36px',
            color: '#111111',
            margin: 0,
            letterSpacing: '0.02em'
          }}>
            PROJECT WORKSPACES
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#666666',
            margin: '6px 0 0'
          }}>
            Organize site telemetry, predictions, space plans, and AI briefings by project site.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            backgroundColor: '#FF2AA1',
            color: '#FFFFFF',
            border: '2px solid #111111',
            borderRadius: '8px',
            padding: '12px 20px',
            fontFamily: 'Anton, sans-serif',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '4px 4px 0px #111111',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={18} /> NEW PROJECT WORKSPACE
        </button>
      </div>

      {/* Loading */}
      {loading && <ProjectsListSkeleton />}

      {/* Error */}
      {error && !loading && (
        <div style={{
          backgroundColor: '#FFEEEE',
          border: '2.5px solid #FF3366',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '6px 6px 0px #111111',
          color: '#CC0033'
        }}>
          <strong>Error loading projects:</strong> {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          padding: '60px 24px',
          textAlign: 'center',
          boxShadow: '8px 8px 0px #111111'
        }}>
          <FolderKanban size={48} color="#CCCCCC" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '28px', color: '#111111', margin: '0 0 8px' }}>
            NO PROJECT WORKSPACES YET
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#666666', maxWidth: '440px', margin: '0 auto 24px' }}>
            Create your first construction project workspace to group telemetry runs, site plans, and AI discussions.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              backgroundColor: '#E4FF5B',
              color: '#111111',
              border: '2px solid #111111',
              borderRadius: '8px',
              padding: '10px 20px',
              fontFamily: 'Anton, sans-serif',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #111111'
            }}
          >
            CREATE FIRST PROJECT
          </button>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !error && projects.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {projects.map((proj) => {
            const dateFormatted = new Date(proj.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={proj.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2.5px solid #111111',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: '6px 6px 0px #111111',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      backgroundColor: '#E4FF5B',
                      color: '#111111',
                      border: '1.5px solid #111111',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '10px',
                      fontWeight: '800'
                    }}>
                      {proj.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#888' }}>
                      {dateFormatted}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: '22px',
                    color: '#111111',
                    margin: '0 0 6px',
                    letterSpacing: '0.02em'
                  }}>
                    {proj.project_name}
                  </h3>

                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: '#666666',
                    margin: '0 0 14px',
                    lineHeight: '1.4',
                    minHeight: '36px'
                  }}>
                    {proj.description || 'General construction site workspace.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#555' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building size={14} color="#888" /> <strong>Type:</strong> {proj.project_type || 'Commercial'}
                    </div>
                    {proj.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="#888" /> <strong>Location:</strong> {proj.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1.5px solid #EEEEEE' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      backgroundColor: '#F0F0F0',
                      border: '1px solid #111',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '11px',
                      fontWeight: '700'
                    }}>
                      {proj.predictions_count || 0} Runs
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleDeleteProject(proj.id, proj.project_name)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #111111',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                      title="Delete Project"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() => navigate(`/history?project_id=${proj.id}`)}
                      style={{
                        backgroundColor: '#111111',
                        color: '#FFFFFF',
                        border: '1.5px solid #111111',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      WORKSPACE <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
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
            maxWidth: '480px',
            width: '100%',
            boxShadow: '8px 8px 0px #111111',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '24px', margin: 0, letterSpacing: '0.02em' }}>
                NEW PROJECT WORKSPACE
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div style={{
                backgroundColor: '#FFEEEE',
                border: '2px solid #FF3366',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: '#CC0033',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} /> {modalError}
              </div>
            )}

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', marginBottom: '4px' }}>
                  PROJECT NAME *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Project or site name"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #111111',
                    borderRadius: '6px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    backgroundColor: '#F9F8F5',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', marginBottom: '4px' }}>
                  PROJECT TYPE
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #111111',
                    borderRadius: '6px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    backgroundColor: '#F9F8F5',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Commercial Infrastructure">Commercial Infrastructure</option>
                  <option value="Residential High-Rise">Residential High-Rise</option>
                  <option value="Industrial Plant">Industrial Plant</option>
                  <option value="Bridge & Highway">Bridge & Highway</option>
                  <option value="Hospital & Healthcare">Hospital & Healthcare</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', marginBottom: '4px' }}>
                  LOCATION
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State / Site address"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #111111',
                    borderRadius: '6px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    backgroundColor: '#F9F8F5',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '800', marginBottom: '4px' }}>
                  DESCRIPTION
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Scope of work, key milestones, and site notes..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #111111',
                    borderRadius: '6px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    backgroundColor: '#F9F8F5',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    backgroundColor: '#EEEEEE',
                    border: '2px solid #111111',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  style={{
                    backgroundColor: '#FF2AA1',
                    color: '#FFFFFF',
                    border: '2px solid #111111',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontFamily: 'Anton, sans-serif',
                    fontSize: '16px',
                    letterSpacing: '0.03em',
                    cursor: createLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '3px 3px 0px #111111'
                  }}
                >
                  {createLoading ? 'CREATING...' : 'CREATE WORKSPACE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
