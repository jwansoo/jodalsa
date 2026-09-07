drop table if exists profiles;
TRUNCATE auth.users cascade;

create table 
  profiles (
    id uuid references auth.users on delete cascade not null,
    created_at timestamptz default now() not null,
    username text unique not null,
    full_name text not null,
    bio text default null,
    mode text default 'dark' not null,
    avatar_url text default null,
    
    primary key (id)
  );

  
     -- Enable RLS
alter table profiles enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access" on profiles
  for select
  using (true);

-- Create policy to allow public insert access
create policy "Allow public insert access" on profiles
  for insert
  with check (true);

-- Create policy to allow public update access
create policy "Allow public update access" on profiles
  for update
  using (true)
  with check (true);

-- Create policy to allow public delete access
create policy "Allow public delete access" on profiles
  for delete
  using (true);