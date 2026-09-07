-- 핵심규정/실기 materials live in the jodal_subject_5/jodal_subject_4 buckets;
-- extend the existing read policy (jodal_subject_1/2/3) to cover them too.
drop policy "Allow authenticated read access to course materials" on storage.objects;

create policy "Allow authenticated read access to course materials" on storage.objects
  for select
  to authenticated
  using (
    bucket_id in (
      'jodal_subject_1',
      'jodal_subject_2',
      'jodal_subject_3',
      'jodal_subject_4',
      'jodal_subject_5'
    )
  );
