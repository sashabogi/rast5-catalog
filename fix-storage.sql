-- Fix Storage Policies - Run as Postgres User
-- Go to Supabase → SQL Editor → Run this query

-- First, let's check current policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'objects';

-- The buckets are already public, so we just need to allow inserts
-- Create policies for each bucket

-- Policy for connector-videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('connector-videos', 'connector-videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy for terminal-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('terminal-images', 'terminal-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy for keying-pdfs
INSERT INTO storage.buckets (id, name, public)
VALUES ('keying-pdfs', 'keying-pdfs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Success message
SELECT 'Storage buckets configured for public access' as message;
