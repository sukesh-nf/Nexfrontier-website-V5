-- Allow public read of the downloads bucket
CREATE POLICY "public_read_downloads" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'downloads');

-- Allow anon upload to downloads bucket (needed for the upload step)
CREATE POLICY "anon_upload_downloads" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'downloads');

-- Allow anon update/upsert on downloads bucket
CREATE POLICY "anon_update_downloads" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'downloads') WITH CHECK (bucket_id = 'downloads');
