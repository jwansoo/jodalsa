create table
  partner_organizations (
    id bigint primary key generated always as identity not null,
    created_at timestamptz default now() not null,
    name text not null unique
  );

alter table partner_organizations enable row level security;

-- 회원가입 폼(비로그인 방문자 포함)에서 단체 목록을 읽어야 하므로 공개 조회 허용.
create policy "Allow anyone to read partner organizations" on partner_organizations
  for select
  using (true);

create policy "Allow admins to insert partner organizations" on partner_organizations
  for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.is_admin
    )
  );

create policy "Allow admins to delete partner organizations" on partner_organizations
  for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.is_admin
    )
  );

insert into partner_organizations (name)
values ('조달청'), ('영남이공대'), ('거재대'), ('계명문화전문대');
