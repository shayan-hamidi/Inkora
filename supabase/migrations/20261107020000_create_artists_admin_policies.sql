-- Artists, consultation requests (store-only), and admin read policies for AI metrics.

-- ---------------------------------------------------------------------------
-- Artist profiles
-- ---------------------------------------------------------------------------

create table public.artist_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  display_name text not null,
  slug text not null unique,
  bio text,
  city text,
  studio_name text,
  website_url text,
  instagram_handle text,
  styles_summary text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint artist_profiles_display_name_length check (
    char_length(display_name) between 1 and 80
  ),
  constraint artist_profiles_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint artist_profiles_bio_length check (
    bio is null or char_length(bio) <= 2000
  )
);

create index artist_profiles_published_idx
  on public.artist_profiles (is_published, display_name);

create index artist_profiles_user_id_idx on public.artist_profiles (user_id);

create trigger artist_profiles_set_updated_at
  before update on public.artist_profiles
  for each row
  execute function public.set_updated_at();

comment on table public.artist_profiles is 'Public artist directory profiles. Portfolio links via artist_tattoos.';

create table public.artist_tattoos (
  artist_id uuid not null references public.artist_profiles (id) on delete cascade,
  tattoo_id uuid not null references public.tattoos (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (artist_id, tattoo_id)
);

create index artist_tattoos_tattoo_id_idx on public.artist_tattoos (tattoo_id);

-- ---------------------------------------------------------------------------
-- Consultation requests (store only — no messaging)
-- ---------------------------------------------------------------------------

create type public.consultation_status as enum ('new', 'reviewed', 'archived');

create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artist_profiles (id) on delete cascade,
  requester_user_id uuid references public.profiles (id) on delete set null,
  requester_name text not null,
  requester_email text not null,
  message text not null,
  preferred_placement text,
  status public.consultation_status not null default 'new',
  created_at timestamptz not null default now(),
  constraint consultation_requests_name_length check (
    char_length(requester_name) between 1 and 80
  ),
  constraint consultation_requests_email_length check (
    char_length(requester_email) between 3 and 254
  ),
  constraint consultation_requests_message_length check (
    char_length(message) between 10 and 2000
  ),
  constraint consultation_requests_placement_length check (
    preferred_placement is null or char_length(preferred_placement) <= 80
  )
);

create index consultation_requests_artist_id_created_at_idx
  on public.consultation_requests (artist_id, created_at desc);

comment on table public.consultation_requests is
  'Store-only consultation form submissions. No messaging thread.';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.artist_profiles enable row level security;
alter table public.artist_tattoos enable row level security;
alter table public.consultation_requests enable row level security;

create policy "Anyone can read published artists"
  on public.artist_profiles for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins can manage artists"
  on public.artist_profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can read published artist tattoo links"
  on public.artist_tattoos for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.artist_profiles a
      join public.tattoos t on t.id = tattoo_id
      where a.id = artist_id
        and a.is_published = true
        and t.is_published = true
    )
  );

create policy "Admins can manage artist tattoo links"
  on public.artist_tattoos for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can insert consultation requests"
  on public.consultation_requests for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.artist_profiles a
      where a.id = artist_id
        and a.is_published = true
    )
    and (
      requester_user_id is null
      or requester_user_id = auth.uid()
    )
  );

create policy "Admins can select consultation requests"
  on public.consultation_requests for select
  to authenticated
  using (public.is_admin());

create policy "Linked artists can select their consultation requests"
  on public.consultation_requests for select
  to authenticated
  using (
    exists (
      select 1
      from public.artist_profiles a
      where a.id = artist_id
        and a.user_id = auth.uid()
    )
  );

create policy "Admins can update consultation request status"
  on public.consultation_requests for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on table public.artist_profiles to anon, authenticated;
grant insert, update, delete on table public.artist_profiles to authenticated;

grant select on table public.artist_tattoos to anon, authenticated;
grant insert, update, delete on table public.artist_tattoos to authenticated;

grant insert on table public.consultation_requests to anon, authenticated;
grant select, update on table public.consultation_requests to authenticated;

-- Admins need cross-user AI metrics visibility
create policy "Admins can select all AI generations"
  on public.ai_generations for select
  to authenticated
  using (public.is_admin());

create policy "Admins can select all AI generation images"
  on public.ai_generation_images for select
  to authenticated
  using (public.is_admin());
