-- Storage Policies for File Uploads
-- Run this in Supabase SQL Editor to allow uploads

-- Enable RLS on storage.objects (if not already)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public uploads to connector-videos bucket
CREATE POLICY "Allow public uploads to connector-videos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'connector-videos');

-- Allow public uploads to terminal-images bucket
CREATE POLICY "Allow public uploads to terminal-images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'terminal-images');

-- Allow public uploads to keying-pdfs bucket
CREATE POLICY "Allow public uploads to keying-pdfs"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'keying-pdfs');

-- Allow public to read all files (already should work since buckets are public)
CREATE POLICY "Allow public to read all storage objects"
ON storage.objects
FOR SELECT
TO public
USING (true);

-- Verify policies
SELECT policyname, tablename
FROM pg_policies
WHERE tablename = 'objects';
