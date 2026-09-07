drop table if exists jadal_tests;

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

     -- Enable RLS
alter table jadal_tests enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access" on jadal_tests
  for select
  using (true);

-- Create policy to allow public insert access
create policy "Allow public insert access" on jadal_tests
  for insert
  with check (true);

-- Create policy to allow public update access
create policy "Allow public update access" on jadal_tests
  for update
  using (true)
  with check (true);

-- Create policy to allow public delete access
create policy "Allow public delete access" on jadal_tests
  for delete
  using (true);