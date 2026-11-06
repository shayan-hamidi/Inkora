-- INKORA public tattoo catalog: taxonomies, tattoos, join tables, FTS, storage.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_length check (char_length(name) between 1 and 80),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.styles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint styles_name_length check (char_length(name) between 1 and 80),
  constraint styles_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.placements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint placements_name_length check (char_length(name) between 1 and 80),
  constraint placements_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tags_name_length check (char_length(name) between 1 and 60),
  constraint tags_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.tattoos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories (id) on delete set null,
  image_path text not null,
  image_alt text,
  image_width integer,
  image_height integer,
  source text,
  attribution text,
  license text,
  is_demo boolean not null default false,
  is_published boolean not null default true,
  is_featured boolean not null default false,
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A')
    || setweight(to_tsvector('english', coalesce(description, '')), 'B')
    || setweight(to_tsvector('english', coalesce(attribution, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tattoos_title_length check (char_length(title) between 1 and 120),
  constraint tattoos_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint tattoos_image_path_not_empty check (char_length(image_path) > 0)
);

create table public.tattoo_styles (
  tattoo_id uuid not null references public.tattoos (id) on delete cascade,
  style_id uuid not null references public.styles (id) on delete cascade,
  primary key (tattoo_id, style_id)
);

create table public.tattoo_placements (
  tattoo_id uuid not null references public.tattoos (id) on delete cascade,
  placement_id uuid not null references public.placements (id) on delete cascade,
  primary key (tattoo_id, placement_id)
);

create table public.tattoo_tags (
  tattoo_id uuid not null references public.tattoos (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (tattoo_id, tag_id)
);

create index categories_slug_idx on public.categories (slug);
create index styles_slug_idx on public.styles (slug);
create index placements_slug_idx on public.placements (slug);
create index tags_slug_idx on public.tags (slug);
create index tattoos_slug_idx on public.tattoos (slug);
create index tattoos_category_id_idx on public.tattoos (category_id);
create index tattoos_published_featured_idx
  on public.tattoos (is_published, is_featured, created_at desc);
create index tattoos_search_vector_idx on public.tattoos using gin (search_vector);
create index tattoo_styles_style_id_idx on public.tattoo_styles (style_id);
create index tattoo_placements_placement_id_idx on public.tattoo_placements (placement_id);
create index tattoo_tags_tag_id_idx on public.tattoo_tags (tag_id);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create trigger styles_set_updated_at
  before update on public.styles
  for each row execute function public.set_updated_at();

create trigger placements_set_updated_at
  before update on public.placements
  for each row execute function public.set_updated_at();

create trigger tags_set_updated_at
  before update on public.tags
  for each row execute function public.set_updated_at();

create trigger tattoos_set_updated_at
  before update on public.tattoos
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.styles enable row level security;
alter table public.placements enable row level security;
alter table public.tags enable row level security;
alter table public.tattoos enable row level security;
alter table public.tattoo_styles enable row level security;
alter table public.tattoo_placements enable row level security;
alter table public.tattoo_tags enable row level security;

-- Public catalog reads
create policy "Anyone can read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Anyone can read styles"
  on public.styles for select
  to anon, authenticated
  using (true);

create policy "Anyone can read placements"
  on public.placements for select
  to anon, authenticated
  using (true);

create policy "Anyone can read tags"
  on public.tags for select
  to anon, authenticated
  using (true);

create policy "Anyone can read published tattoos"
  on public.tattoos for select
  to anon, authenticated
  using (is_published = true);

create policy "Anyone can read tattoo style links"
  on public.tattoo_styles for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.tattoos t
      where t.id = tattoo_id
        and t.is_published = true
    )
  );

create policy "Anyone can read tattoo placement links"
  on public.tattoo_placements for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.tattoos t
      where t.id = tattoo_id
        and t.is_published = true
    )
  );

create policy "Anyone can read tattoo tag links"
  on public.tattoo_tags for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.tattoos t
      where t.id = tattoo_id
        and t.is_published = true
    )
  );

-- Catalog writes: admins only (service_role bypasses RLS for seeds/scripts)
create policy "Admins can manage categories"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage styles"
  on public.styles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage placements"
  on public.placements for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage tags"
  on public.tags for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage tattoos"
  on public.tattoos for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage tattoo styles"
  on public.tattoo_styles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage tattoo placements"
  on public.tattoo_placements for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage tattoo tags"
  on public.tattoo_tags for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Public tattoo image bucket for catalog assets and future uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tattoo-images',
  'tattoo-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Anyone can read tattoo images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'tattoo-images');

create policy "Admins can upload tattoo images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'tattoo-images' and public.is_admin());

create policy "Admins can update tattoo images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'tattoo-images' and public.is_admin())
  with check (bucket_id = 'tattoo-images' and public.is_admin());

create policy "Admins can delete tattoo images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'tattoo-images' and public.is_admin());
