-- Migration: 003_indexes.sql
-- Description: High-performance indexing for user history queries, filtering, and sorting

-- 1. Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. Projects Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- 3. Model Predictions Indexes
CREATE INDEX IF NOT EXISTS idx_model_predictions_user_id ON public.model_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_model_predictions_project_id ON public.model_predictions(project_id);
CREATE INDEX IF NOT EXISTS idx_model_predictions_model_name ON public.model_predictions(model_name);
CREATE INDEX IF NOT EXISTS idx_model_predictions_created_at ON public.model_predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_model_predictions_user_created ON public.model_predictions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_model_predictions_input_gin ON public.model_predictions USING gin(input_data);
CREATE INDEX IF NOT EXISTS idx_model_predictions_output_gin ON public.model_predictions USING gin(prediction_output);

-- 4. Optimization Results Indexes
CREATE INDEX IF NOT EXISTS idx_optimization_results_user_id ON public.optimization_results(user_id);
CREATE INDEX IF NOT EXISTS idx_optimization_results_project_id ON public.optimization_results(project_id);
CREATE INDEX IF NOT EXISTS idx_optimization_results_type ON public.optimization_results(optimization_type);
CREATE INDEX IF NOT EXISTS idx_optimization_results_created_at ON public.optimization_results(created_at DESC);

-- 5. AI Conversations Indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_updated_at ON public.ai_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_project_id ON public.ai_conversations(project_id);

-- 6. AI Messages Indexes
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user_id ON public.ai_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON public.ai_messages(created_at ASC);

-- 7. Saved Reports Indexes
CREATE INDEX IF NOT EXISTS idx_saved_reports_user_id ON public.saved_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_project_id ON public.saved_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_prediction_id ON public.saved_reports(prediction_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_created_at ON public.saved_reports(created_at DESC);
