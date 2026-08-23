-- Migration: 004_storage.sql
-- Description: Storage bucket configuration for ConArk PDF reports with private authenticated RLS

-- 1. Create Storage Bucket for Reports
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'conark-reports',
    'conark-reports',
    false,
    20971520, -- 20MB limit
    ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 20971520,
    allowed_mime_types = ARRAY['application/pdf'];

-- 2. Storage RLS Policies
DROP POLICY IF EXISTS "Users can read own reports" ON storage.objects;
CREATE POLICY "Users can read own reports"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'conark-reports' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can upload own reports" ON storage.objects;
CREATE POLICY "Users can upload own reports"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'conark-reports' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own reports" ON storage.objects;
CREATE POLICY "Users can update own reports"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'conark-reports' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own reports" ON storage.objects;
CREATE POLICY "Users can delete own reports"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'conark-reports' AND (storage.foldername(name))[1] = auth.uid()::text);
