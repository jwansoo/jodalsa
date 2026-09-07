alter table profiles add column if not exists is_admin boolean default false not null;

update profiles set is_admin = true where username = 'jwansoo';
