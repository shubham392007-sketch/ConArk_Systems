-- Migration: 002_rls_policies.sql
-- Description: Row Level Security (RLS) policies for user data isolation

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimization_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;

-- 2. PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 3. PROJECTS POLICIES
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
CREATE POLICY "Users can view their own projects"
    ON public.projects FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
CREATE POLICY "Users can insert their own projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
CREATE POLICY "Users can update their own projects"
    ON public.projects FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
CREATE POLICY "Users can delete their own projects"
    ON public.projects FOR DELETE
    USING (auth.uid() = user_id);

-- 4. MODEL PREDICTIONS POLICIES
DROP POLICY IF EXISTS "Users can view their own predictions" ON public.model_predictions;
CREATE POLICY "Users can view their own predictions"
    ON public.model_predictions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own predictions" ON public.model_predictions;
CREATE POLICY "Users can insert their own predictions"
    ON public.model_predictions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own predictions" ON public.model_predictions;
CREATE POLICY "Users can delete their own predictions"
    ON public.model_predictions FOR DELETE
    USING (auth.uid() = user_id);

-- 5. OPTIMIZATION RESULTS POLICIES
DROP POLICY IF EXISTS "Users can view their own optimization results" ON public.optimization_results;
CREATE POLICY "Users can view their own optimization results"
    ON public.optimization_results FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own optimization results" ON public.optimization_results;
CREATE POLICY "Users can insert their own optimization results"
    ON public.optimization_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own optimization results" ON public.optimization_results;
CREATE POLICY "Users can delete their own optimization results"
    ON public.optimization_results FOR DELETE
    USING (auth.uid() = user_id);

-- 6. AI CONVERSATIONS POLICIES
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.ai_conversations;
CREATE POLICY "Users can view their own conversations"
    ON public.ai_conversations FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own conversations" ON public.ai_conversations;
CREATE POLICY "Users can insert their own conversations"
    ON public.ai_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own conversations" ON public.ai_conversations;
CREATE POLICY "Users can update their own conversations"
    ON public.ai_conversations FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own conversations" ON public.ai_conversations;
CREATE POLICY "Users can delete their own conversations"
    ON public.ai_conversations FOR DELETE
    USING (auth.uid() = user_id);

-- 7. AI MESSAGES POLICIES
DROP POLICY IF EXISTS "Users can view their own messages" ON public.ai_messages;
CREATE POLICY "Users can view their own messages"
    ON public.ai_messages FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own messages" ON public.ai_messages;
CREATE POLICY "Users can insert their own messages"
    ON public.ai_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own messages" ON public.ai_messages;
CREATE POLICY "Users can delete their own messages"
    ON public.ai_messages FOR DELETE
    USING (auth.uid() = user_id);

-- 8. SAVED REPORTS POLICIES
DROP POLICY IF EXISTS "Users can view their own reports" ON public.saved_reports;
CREATE POLICY "Users can view their own reports"
    ON public.saved_reports FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own reports" ON public.saved_reports;
CREATE POLICY "Users can insert their own reports"
    ON public.saved_reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reports" ON public.saved_reports;
CREATE POLICY "Users can delete their own reports"
    ON public.saved_reports FOR DELETE
    USING (auth.uid() = user_id);
