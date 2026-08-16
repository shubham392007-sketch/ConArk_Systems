import type {
  OperationalInputs,
  SpaceInputs,
  MasterIntelligenceResponse,
  SpaceOptimizationResponse
} from '../types';

const getApiBase = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && (window.location.port === '5173' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000/api/v1';
  }
  return '/api/v1';
};

const API_BASE = getApiBase();

const formatErrorMessage = async (res: Response, defaultMsg: string): Promise<string> => {
  try {
    const err = await res.json();
    if (typeof err.detail === 'string') return err.detail;
    if (Array.isArray(err.detail)) {
      return err.detail.map((e: any) => `${e.loc ? e.loc.filter((x: string) => x !== 'body').join('.') + ': ' : ''}${e.msg}`).join('; ');
    }
    if (err.detail && typeof err.detail === 'object') return JSON.stringify(err.detail);
    if (err.message) return err.message;
  } catch {
    try {
      const text = await res.text();
      if (text) return text;
    } catch {}
  }
  return defaultMsg;
};

export async function fetchHealth(): Promise<{ status: string; system: string; version: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Health check failed'));
  return res.json();
}

export async function fetchModelMetrics(): Promise<any> {
  const res = await fetch(`${API_BASE}/model-metrics`);
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to fetch model metrics'));
  return res.json();
}

export async function analyzeProjectIntelligence(payload: OperationalInputs): Promise<MasterIntelligenceResponse> {
  const sanitizedPayload = {
    ...payload,
    worker_count: Math.max(0, payload.worker_count || 0),
    temperature: payload.temperature ?? 25,
    humidity: payload.humidity ?? 50,
    vibration_level: payload.vibration_level ?? 15,
    task_progress: payload.task_progress ?? 0.5
  };

  const res = await fetch(`${API_BASE}/intelligence/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sanitizedPayload)
  });
  if (!res.ok) {
    const errorText = await formatErrorMessage(res, 'Master intelligence analysis failed');
    throw new Error(errorText);
  }
  return res.json();
}

export async function optimizeSpaceLayout(payload: SpaceInputs): Promise<SpaceOptimizationResponse> {
  const sL = payload.site_length_m && payload.site_length_m > 0 ? payload.site_length_m : undefined;
  const sW = payload.site_width_m && payload.site_width_m > 0 ? payload.site_width_m : undefined;
  
  let area = payload.site_area_sqm;
  if (!area || area <= 0) {
    if (sL && sW) {
      area = Math.round(sL * sW);
    } else {
      area = 1200;
    }
  }

  const sanitizedPayload: any = {
    ...payload,
    site_area_sqm: area,
    site_length_m: sL,
    site_width_m: sW,
    worker_count: Math.max(0, payload.worker_count || 0),
    machinery_count: Math.max(0, payload.machinery_count || 0),
    material_quantity_kg: Math.max(0, payload.material_quantity_kg || 1000),
    estimated_daily_material_usage_kg: Math.max(0, payload.estimated_daily_material_usage_kg || 100),
    waste_generation_kg_per_day: Math.max(0, payload.waste_generation_kg_per_day || 20)
  };

  const res = await fetch(`${API_BASE}/space/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sanitizedPayload)
  });
  if (!res.ok) {
    const errorText = await formatErrorMessage(res, 'Space optimization failed');
    throw new Error(errorText);
  }
  return res.json();
}

export async function fetchAlerts(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to fetch alerts'));
  return res.json();
}
