export type ModelType = 
  | 'performance'
  | 'risk'
  | 'cost_time'
  | 'safety_material'
  | 'optimization'
  | 'space_optimization';

export interface ReportMetadata {
  report_id: string;
  timestamp: string;
  project_id?: string;
  project_name?: string;
  user_name?: string;
  model_version?: string;
  status: 'COMPLETED' | 'VALID_WITH_WARNINGS' | 'FAILED';
  gemini_enabled: boolean;
}

export interface StructuredGeminiAnalysis {
  summary?: string;
  what_this_means?: string;
  why_this_occurred?: string;
  key_findings?: string[];
  key_observations?: string[];
  key_risk_factors?: string[];
  recommended_actions?: string[];
  next_steps?: string[];
  warnings?: string[];
  cost_interpretation?: string;
  schedule_interpretation?: string;
  safety_interpretation?: string;
  material_interpretation?: string;
  space_analysis?: string;
  layout_explanation?: string;
  operational_impact?: string;
}

export interface ModelReportPayload {
  modelType: ModelType;
  modelName: string;
  modelVersion?: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  geminiExplanation?: StructuredGeminiAnalysis | string;
  metrics?: Record<string, any>;
  metadata?: Partial<ReportMetadata>;
  validationWarnings?: string[];
}

export interface SavedReportItem {
  report_id: string;
  modelType: ModelType;
  modelName: string;
  timestamp: string;
  predictionSummary: string;
  status: string;
}
