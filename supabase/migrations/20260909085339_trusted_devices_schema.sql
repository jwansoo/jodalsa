create table
  trusted_devices (
    id bigint primary key generated always as identity not null,
    created_at timestamptz default now() not null,
    last_seen_at timestamptz default now() not null,
    user_id uuid references auth.users on delete cascade not null,
    device_id text not null,
    user_agent text,
    unique (user_id, device_id)
  );

alter table trusted_devices enable row level security;

create policy "Allow users to read their own trusted devices" on trusted_devices
  for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own trusted devices" on trusted_devices
  for insert
  with check (auth.uid() = user_id);

create policy "Allow users to update their own trusted devices" on trusted_devices
  for update
  using (auth.uid() = user_id);
