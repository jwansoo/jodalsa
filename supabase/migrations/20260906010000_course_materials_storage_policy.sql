-- Allow logged-in users to read the private course-material buckets
-- (jodal_subject_1/2/3), so the client can generate signed URLs for
-- the PDFs under each subtitle_N/ folder.
create policy "Allow authenticated read access to course materials" on storage.objects
  for select
  to authenticated
  using (bucket_id in ('jodal_subject_1', 'jodal_subject_2', 'jodal_subject_3'));
