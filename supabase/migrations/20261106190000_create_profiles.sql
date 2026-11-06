-- Profiles linked to auth.users, with server-protected roles.

create type public.user_role as enum ('user', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (
    display_name is null or char_length(display_name) <= 80
  )
);

comment on table public.profiles is 'Public user profiles. Role changes are restricted to service_role.';
comment on column public.profiles.role is 'Application role. Users cannot self-promote.';

create index profiles_role_idx on public.profiles (role);

alter table public.profiles enable row level security;

create policy "Users can select their own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Authenticated users may update display fields only — not role.
revoke update on table public.profiles from authenticated;
grant update (display_name, updated_at) on table public.profiles to authenticated;
grant select on table public.profiles to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role then
    if coalesce(auth.jwt() ->> 'role', '') is distinct from 'service_role' then
      raise exception 'Changing profile role is not allowed';
    end if;
  end if;

  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
  before update of role on public.profiles
  for each row
  execute function public.prevent_profile_role_escalation();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      split_part(new.email, '@', 1)
    ),
    'user'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
