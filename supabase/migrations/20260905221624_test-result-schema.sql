drop table if exists test_results;

create table
test_results(
  id bigint primary key generated always as identity not null,
  created_at timestamp default now() not null,
  username text references profiles (username) on delete cascade not null,
  round text not null,
  first_class numeric not null,
  second_class numeric not null,
  third_class numeric not null,
  average numeric not null,
  analysis text not null,

  unique (username, round)
);

     -- Enable RLS
alter table test_results enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access" on test_results
  for select
  using (true);

-- Create policy to allow public insert access
create policy "Allow public insert access" on test_results
  for insert
  with check (true);

-- Create policy to allow public update access
create policy "Allow public update access" on test_results
  for update
  using (true)
  with check (true);

-- Create policy to allow public delete access
create policy "Allow public delete access" on test_results
  for delete
  using (true);
