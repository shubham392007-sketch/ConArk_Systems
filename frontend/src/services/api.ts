import type {
  OperationalInputs,
  SpaceInputs,
  MasterIntelligenceResponse,
  SpaceOptimizationResponse
} from '../types';

const API_BASE = 'http://localhost:8000/api/v1';

export async function fetchHealth(): Promise<{ status: string; system: string; version: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchModelMetrics(): Promise<any> {
  const res = await fetch(`${API_BASE}/model-metrics`);
  if (!res.ok) throw new Error('Failed to fetch model metrics');
  return res.json();
}

export async function analyzeProjectIntelligence(payload: OperationalInputs): Promise<MasterIntelligenceResponse> {
  const res = await fetch(`${API_BASE}/intelligence/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Master intelligence analysis failed');
  }
  return res.json();
}

export async function optimizeSpaceLayout(payload: SpaceInputs): Promise<SpaceOptimizationResponse> {
  const res = await fetch(`${API_BASE}/space/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Space optimization failed');
  }
  return res.json();
}

export async function fetchAlerts(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}
