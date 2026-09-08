create table
  orders (
    id bigint primary key generated always as identity not null,
    created_at timestamptz default now() not null,
    user_id uuid references auth.users on delete cascade not null,
    username text not null,
    product_type text not null check (product_type in ('select', 'annual')),
    rounds_count integer,
    materials text[],
    amount integer not null,
    depositor_name text not null,
    status text not null default 'pending_transfer' check (status in ('pending_transfer', 'confirmed', 'canceled'))
  );

alter table orders enable row level security;

create policy "Allow users to insert their own orders" on orders
  for insert
  with check (auth.uid() = user_id);

create policy "Allow users to read their own orders" on orders
  for select
  using (auth.uid() = user_id);
