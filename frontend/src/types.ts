export interface OperationalInputs {
  timestamp: string;
  temperature: number;
  humidity: number;
  vibration_level: number;
  material_usage: number;
  machinery_status: number;
  worker_count: number;
  energy_consumption: number;
  task_progress: number;
  safety_incidents: number;
  equipment_utilization_rate: number;
  material_shortage_alert: number;
  cost_deviation?: number;
  time_deviation?: number;
  simulation_deviation?: number;
  target_model?: string;
  project_id?: string;
}

export interface SpaceInputs {
  site_area_sqm: number;
  site_length_m?: number;
  site_width_m?: number;
  construction_stage: string;
  material_quantity_kg: number;
  material_types_count: number;
  machinery_count: number;
  heavy_machinery_count: number;
  worker_count: number;
  daily_material_delivery_count: number;
  daily_truck_count: number;
  estimated_daily_material_usage_kg: number;
  waste_generation_kg_per_day: number;
  safety_requirement_level: string;
  emergency_access_required: boolean;
  temperature: number;
  humidity: number;
  vibration_level: number;
  equipment_utilization_rate: number;
  task_progress: number;
  risk_score: number;
  material_shortage_alert: number;
}

export interface MasterIntelligenceResponse {
  request_id: string;
  system: string;
  timestamp: string;
  ml_results: {
    performance: {
      prediction: string;
      confidence: number;
      probabilities: Record<string, number>;
    };
    risk: {
      risk_score: number;
      risk_level: string;
      estimated_range: { lower: number; upper: number };
    };
    cost_forecast: {
      predicted_cost_deviation: number;
      budget_status: string;
      top_factors: Array<{ feature: string; importance: number }>;
    };
    time_forecast: {
      predicted_time_deviation_days: number;
      schedule_status: string;
    };
    optimization: {
      recommendation: string;
      priority?: string;
      expected_improvement?: string;
      resource_reallocation?: string;
      confidence: number;
      supporting_factors: string[];
    };
  };
  alerts: Array<{
    alert_id?: string;
    type: string;
    title: string;
    description?: string;
    message?: string;
    priority: number;
    severity: string;
    status?: string;
    probability?: number;
  }>;
  health: {
    overall_health_score: number;
    health_status: string;
    components: {
      performance_score_norm: number;
      risk_score_norm: number;
      schedule_score_norm: number;
      cost_score_norm: number;
      safety_score_norm: number;
    };
  };
  gemini_report: {
    status: string;
    message?: string;
    report?: {
      overall_status: string;
      executive_summary: string;
      key_findings: string[];
      critical_alerts: string[];
      risk_explanation: string;
      performance_explanation: string;
      cost_explanation: string;
      schedule_explanation: string;
      optimization_explanation: string;
      recommended_actions: string[];
      priority: string;
      confidence_note: string;
    };
  };
  system_status: string;
}

export interface ZoneCoordinates {
  zone_name?: string;
  zone?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  area_sqm?: number;
}

export interface SpaceOptimizationResponse {
  request_id: string;
  status: string;
  reason?: string;
  demand?: Record<string, number>;
  allocation?: {
    material_storage_area_sqm: number;
    equipment_area_sqm: number;
    worker_movement_area_sqm: number;
    safety_buffer_area_sqm: number;
    loading_area_sqm: number;
    waste_area_sqm: number;
    emergency_access_area_sqm: number;
    staging_area_sqm: number;
  };
  coordinates?: ZoneCoordinates[];
  metrics?: {
    total_allocated_area_sqm: number;
    unused_area_sqm: number;
    space_utilization_percentage: number;
    space_efficiency_score: number;
    layout_efficiency_score?: number;
    congestion_score: number;
    safety_compliance_score: number;
  };
  constraints: Array<{
    name: string;
    required_sqm: number;
    allocated_sqm: number;
    status: string;
  }>;
  spatial_layout: Array<{
    zone: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  reasoning: string[];
  gemini_report?: {
    status: string;
    message?: string;
    space_report?: {
      summary: string;
      layout_explanation: string;
      key_findings: string[];
      space_priorities: Array<{ zone: string; priority: string; reason: string }>;
      recommended_actions: Array<{ action: string; priority: string; reason: string }>;
      safety_considerations: string[];
      optimization_assumptions: string[];
      limitations: string[];
    };
  };
}

export interface ConstructionAIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  error?: boolean;
}

export interface ConstructionAISession {
  id: string;
  title: string;
  createdAt: string;
  messages: ConstructionAIMessage[];
}

export interface ConstructionAIResponse {
  success: boolean;
  message: string;
  conversation_id: string;
  model: string;
  error_code?: string;
}
