-- jadal_tests was accidentally dropped outside of migrations; recreate it with
-- the same schema/policies as the original 20260831005506_jodal-test-schema.sql.
create table
jadal_tests(
  id bigint primary key generated always as identity not null,
  created_at timestamp default now() not null,
  round text not null,
  no integer not null,
  subject text not null,
  subtitle text not null,
  question text not null,
  ga text not null,
  na text not null,
  da text not null,
  la text not null,
  answer text not null,
  explanation text not null,
  note text not null
);

alter table jadal_tests enable row level security;

create policy "Allow public read access" on jadal_tests
  for select
  using (true);

create policy "Allow public insert access" on jadal_tests
  for insert
  with check (true);

create policy "Allow public update access" on jadal_tests
  for update
  using (true)
  with check (true);

create policy "Allow public delete access" on jadal_tests
  for delete
  using (true);
