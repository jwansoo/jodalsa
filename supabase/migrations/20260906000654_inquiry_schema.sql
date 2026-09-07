drop table if exists inquiry_messages;
drop table if exists inquiry_threads;

create table
inquiry_threads(
  id uuid primary key default gen_random_uuid(),
  created_at timestamp default now() not null,
  name text not null,
  contact text
);

-- Enable RLS
alter table inquiry_threads enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access" on inquiry_threads
  for select
  using (true);

-- Create policy to allow public insert access
create policy "Allow public insert access" on inquiry_threads
  for insert
  with check (true);

-- Create policy to allow public update access
create policy "Allow public update access" on inquiry_threads
  for update
  using (true)
  with check (true);

-- Create policy to allow public delete access
create policy "Allow public delete access" on inquiry_threads
  for delete
  using (true);

create table
inquiry_messages(
  id bigint primary key generated always as identity not null,
  created_at timestamp default now() not null,
  thread_id uuid references inquiry_threads (id) on delete cascade not null,
  sender text not null check (sender in ('visitor', 'admin')),
  message text not null
);

-- Enable RLS
alter table inquiry_messages enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access" on inquiry_messages
  for select
  using (true);

-- Create policy to allow public insert access
create policy "Allow public insert access" on inquiry_messages
  for insert
  with check (true);

-- Create policy to allow public update access
create policy "Allow public update access" on inquiry_messages
  for update
  using (true)
  with check (true);

-- Create policy to allow public delete access
create policy "Allow public delete access" on inquiry_messages
  for delete
  using (true);
