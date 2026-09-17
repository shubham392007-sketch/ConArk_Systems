import type {
  OperationalInputs,
  SpaceInputs,
  MasterIntelligenceResponse,
  SpaceOptimizationResponse,
  HousePriceInputs,
  HousePricePredictionResponse
} from '../types';
import { supabase } from './supabaseClient';

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

/** Helper to get current auth headers with Supabase Bearer JWT */
async function getAuthHeaders(customHeaders: Record<string, string> = {}): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders
  };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    console.warn('Error reading access token for request headers:', err);
  }
  return headers;
}

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

/* Core Intelligence APIs */

export async function fetchHealth(): Promise<{ status: string; system: string; version: string }> {
  const res = await fetch(`${API_BASE}/health`, { headers: await getAuthHeaders() });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Health check failed'));
  return res.json();
}

export async function fetchModelMetrics(): Promise<any> {
  const res = await fetch(`${API_BASE}/model-metrics`, { headers: await getAuthHeaders() });
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
    headers: await getAuthHeaders(),
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

  const validStages = ['EXCAVATION', 'FOUNDATION', 'STRUCTURE', 'MASONRY', 'ELECTRICAL', 'PLUMBING', 'FINISHING', 'MIXED', 'OTHER'];
  let stage = (payload.construction_stage || 'STRUCTURE').toUpperCase();
  if (!validStages.includes(stage)) {
    stage = 'STRUCTURE';
  }

  const sanitizedPayload: any = {
    ...payload,
    site_area_sqm: area,
    site_length_m: sL,
    site_width_m: sW,
    construction_stage: stage,
    worker_count: Math.max(0, payload.worker_count || 0),
    machinery_count: Math.max(0, payload.machinery_count || 0),
    material_quantity_kg: Math.max(0, payload.material_quantity_kg || 1000),
    estimated_daily_material_usage_kg: Math.max(0, payload.estimated_daily_material_usage_kg || 100),
    waste_generation_kg_per_day: Math.max(0, payload.waste_generation_kg_per_day || 20)
  };

  const res = await fetch(`${API_BASE}/space/optimize`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(sanitizedPayload)
  });
  if (!res.ok) {
    const errorText = await formatErrorMessage(res, 'Space optimization failed');
    throw new Error(errorText);
  }
  return res.json();
}

export async function fetchAlerts(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/alerts`, { headers: await getAuthHeaders() });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to fetch alerts'));
  return res.json();
}

export async function predictHousePrice(payload: HousePriceInputs): Promise<HousePricePredictionResponse> {
  const sanitized = {
    square_feet: Number(payload.square_feet),
    bedrooms: Number(payload.bedrooms),
    bathrooms: Number(payload.bathrooms),
    neighborhood: String(payload.neighborhood),
    year_built: Number(payload.year_built),
    project_id: payload.project_id || undefined
  };

  const res = await fetch(`${API_BASE}/models/house-price/predict`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(sanitized)
  });

  if (!res.ok) {
    const errorText = await formatErrorMessage(res, 'House price prediction failed');
    throw new Error(errorText);
  }
  return res.json();
}

/* User Analytics API */

export async function fetchUserDashboardAnalytics(): Promise<any> {
  const res = await fetch(`${API_BASE}/analytics/dashboard`, { headers: await getAuthHeaders() });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to fetch user analytics'));
  return res.json();
}

/* Project Workspace APIs */

export async function fetchUserProjects(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/projects`, { headers: await getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.projects)) {
        return data.projects;
      }
    }
  } catch (backendErr) {
    console.warn('Backend fetchUserProjects failed, falling back to Supabase direct:', backendErr);
  }

  // Seamless Supabase direct query fallback
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(p => ({
          ...p,
          prediction_count: 0,
          optimization_count: 0,
          report_count: 0
        }));
      }
    }
  } catch (sbErr) {
    console.warn('Supabase direct fetchUserProjects failed:', sbErr);
  }

  return [];
}

export async function createProject(data: { project_name: string; description?: string; project_type?: string; location?: string; status?: string }): Promise<any> {
  // 1. Try backend API first
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (backendErr) {
    console.warn('Backend createProject error, falling back to Supabase direct:', backendErr);
  }

  // 2. Seamless Supabase Direct insert fallback
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      throw new Error('You must be signed in to create a workspace.');
    }

    // Ensure profile row exists in public.profiles
    await supabase.from('profiles').upsert({
      id: session.user.id,
      email: session.user.email || '',
      full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'ConArk User',
      organization: session.user.user_metadata?.organization || 'ConArk Systems',
      role: session.user.user_metadata?.role || 'Site Engineer'
    }, { onConflict: 'id' });

    const insertPayload = {
      user_id: session.user.id,
      project_name: data.project_name.trim(),
      description: data.description?.trim() || '',
      project_type: data.project_type || 'Commercial Infrastructure',
      location: data.location?.trim() || '',
      status: data.status || 'Active'
    };

    const { data: newRow, error: insertErr } = await supabase
      .from('projects')
      .insert([insertPayload])
      .select()
      .single();

    if (insertErr) {
      console.error('Supabase direct project insert error:', insertErr);
      throw new Error(insertErr.message || 'Failed to create workspace in Supabase.');
    }

    if (newRow) {
      return {
        ...newRow,
        prediction_count: 0,
        optimization_count: 0,
        report_count: 0
      };
    }
  } catch (sbErr: any) {
    console.error('Direct Supabase workspace creation failed:', sbErr);
    throw new Error(sbErr.message || 'Could not create project workspace. Please verify your connection.');
  }

  throw new Error('Could not create project workspace.');
}

export async function fetchProjectDetail(projectId: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, { headers: await getAuthHeaders() });
    if (res.ok) {
      return await res.json();
    }
  } catch (backendErr) {
    console.warn('Backend fetchProjectDetail error, falling back to Supabase direct:', backendErr);
  }

  // Supabase direct fallback
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to fetch project details');
  }
  return {
    ...data,
    prediction_count: 0,
    optimization_count: 0,
    report_count: 0
  };
}

export async function updateProject(projectId: string, data: any): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (backendErr) {
    console.warn('Backend updateProject error, falling back to Supabase direct:', backendErr);
  }

  // Supabase direct fallback
  const { data: updated, error } = await supabase
    .from('projects')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single();

  if (error || !updated) {
    throw new Error(error?.message || 'Failed to update project');
  }
  return updated;
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    if (res.ok) return;
  } catch (backendErr) {
    console.warn('Backend deleteProject error, falling back to Supabase direct:', backendErr);
  }

  // Supabase direct fallback
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    throw new Error(error.message || 'Failed to delete project');
  }
}

/* Model Prediction History APIs */

export async function fetchPredictionHistory(filters: { model_name?: string; project_id?: string; limit?: number; offset?: number } = {}): Promise<{ total: number; items: any[] }> {
  try {
    const params = new URLSearchParams();
    if (filters.model_name) params.append('model_name', filters.model_name);
    if (filters.project_id) params.append('project_id', filters.project_id);
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.offset) params.append('offset', String(filters.offset));

    const res = await fetch(`${API_BASE}/predictions?${params.toString()}`, { headers: await getAuthHeaders() });
    if (res.ok) {
      return await res.json();
    }
  } catch (backendErr) {
    console.warn('Backend fetchPredictionHistory error, falling back to Supabase direct:', backendErr);
  }

  // Supabase direct fallback
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      let query = supabase
        .from('model_predictions')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (filters.model_name && filters.model_name !== 'ALL') {
        query = query.eq('model_name', filters.model_name);
      }
      if (filters.project_id && filters.project_id !== 'ALL') {
        query = query.eq('project_id', filters.project_id);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, count, error } = await query;
      if (!error && data) {
        return {
          total: count || data.length,
          items: data
        };
      }
    }
  } catch (sbErr) {
    console.warn('Supabase direct fetchPredictionHistory error:', sbErr);
  }

  return { total: 0, items: [] };
}

export async function fetchPredictionDetail(predictionId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/predictions/${predictionId}`, { headers: await getAuthHeaders() });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to fetch prediction details'));
  return res.json();
}

export async function deletePrediction(predictionId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/predictions/${predictionId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders()
  });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to delete prediction'));
}

export async function deleteAllPredictions(params?: { project_id?: string; model_name?: string }): Promise<void> {
  const query = new URLSearchParams();
  if (params?.project_id && params.project_id !== 'ALL') query.append('project_id', params.project_id);
  if (params?.model_name && params.model_name !== 'ALL') query.append('model_name', params.model_name);

  const url = `${API_BASE}/predictions${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: await getAuthHeaders()
  });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to clear prediction history'));
}

/* Saved Reports APIs */

export async function fetchSavedReports(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/reports`, { headers: await getAuthHeaders() });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to fetch reports'));
  const data = await res.json();
  return data.reports || [];
}

export async function saveGeneratedReport(data: { report_name: string; report_type: string; file_path?: string; project_id?: string; prediction_id?: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to save report'));
  return res.json();
}

export async function deleteSavedReport(reportId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/reports/${reportId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders()
  });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to delete report'));
}

/* Persistent ConArk AI Chat APIs */

export async function fetchConversations(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/construction-ai/conversations`, { headers: await getAuthHeaders() });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to fetch conversations'));
  const data = await res.json();
  return data.conversations || [];
}

export async function fetchConversationDetail(convId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/construction-ai/conversations/${convId}`, { headers: await getAuthHeaders() });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to fetch conversation history'));
  return res.json();
}

export async function createNewConversation(title: string = 'New Construction Chat', projectId?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/construction-ai/conversations`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ title, project_id: projectId })
  });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to create conversation'));
  return res.json();
}

export async function renameConversation(convId: string, title: string): Promise<any> {
  const res = await fetch(`${API_BASE}/construction-ai/conversations/${convId}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to rename conversation'));
  return res.json();
}

export async function deleteConversation(convId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/construction-ai/conversations/${convId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders()
  });
  if (!res.ok) throw new Error(await formatErrorMessage(res, 'Failed to delete conversation'));
}
