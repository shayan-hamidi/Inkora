-- Favorites, collections, and AI generation tables (Phases 11–15).

-- ---------------------------------------------------------------------------
-- Favorites
-- ---------------------------------------------------------------------------

create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  tattoo_id uuid not null references public.tattoos (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, tattoo_id)
);

create index favorites_user_id_created_at_idx
  on public.favorites (user_id, created_at desc);

create index favorites_tattoo_id_idx on public.favorites (tattoo_id);

comment on table public.favorites is 'Per-user saved tattoos. Ownership enforced by RLS.';

alter table public.favorites enable row level security;

create policy "Users can select own favorites"
  on public.favorites for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own favorites"
  on public.favorites for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on public.favorites for delete to authenticated
  using (auth.uid() = user_id);

grant select, insert, delete on table public.favorites to authenticated;

-- ---------------------------------------------------------------------------
-- Collections
-- ---------------------------------------------------------------------------

create type public.collection_visibility as enum ('private', 'public');

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  visibility public.collection_visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collections_name_length check (
    char_length(name) >= 1 and char_length(name) <= 80
  ),
  constraint collections_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint collections_user_slug_unique unique (user_id, slug)
);

create index collections_user_id_idx on public.collections (user_id);
create index collections_visibility_idx on public.collections (visibility);

comment on table public.collections is 'User-owned tattoo/concept collections with private|public visibility.';

create trigger collections_set_updated_at
  before update on public.collections
  for each row
  execute function public.set_updated_at();

alter table public.collections enable row level security;

create policy "Owners can select own collections"
  on public.collections for select to authenticated
  using (auth.uid() = user_id);

create policy "Anyone can select public collections"
  on public.collections for select to anon, authenticated
  using (visibility = 'public');

create policy "Owners can insert own collections"
  on public.collections for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Owners can update own collections"
  on public.collections for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Owners can delete own collections"
  on public.collections for delete to authenticated
  using (auth.uid() = user_id);

grant select on table public.collections to anon, authenticated;
grant insert, update, delete on table public.collections to authenticated;

-- ---------------------------------------------------------------------------
-- AI generations (before collection_items so FK can reference it)
-- ---------------------------------------------------------------------------

create type public.ai_generation_kind as enum (
  'concept',
  'refine',
  'symbolism',
  'visual_prompt'
);

create type public.ai_generation_status as enum ('succeeded', 'failed');

create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind public.ai_generation_kind not null,
  prompt text not null,
  parent_id uuid references public.ai_generations (id) on delete set null,
  title text,
  concept text,
  symbolism text,
  visual_prompt text,
  suggested_styles text[] not null default '{}',
  suggested_placements text[] not null default '{}',
  raw_response jsonb,
  provider text not null default 'gemini',
  model text,
  status public.ai_generation_status not null default 'succeeded',
  error_message text,
  created_at timestamptz not null default now(),
  constraint ai_generations_prompt_length check (
    char_length(prompt) >= 1 and char_length(prompt) <= 2000
  )
);

create index ai_generations_user_id_created_at_idx
  on public.ai_generations (user_id, created_at desc);

create index ai_generations_parent_id_idx on public.ai_generations (parent_id);

comment on table public.ai_generations is 'Private AI concept/refinement history. Rate limits counted from this table.';

alter table public.ai_generations enable row level security;

create policy "Users can select own AI generations"
  on public.ai_generations for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own AI generations"
  on public.ai_generations for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own AI generations"
  on public.ai_generations for delete to authenticated
  using (auth.uid() = user_id);

grant select, insert, delete on table public.ai_generations to authenticated;

-- ---------------------------------------------------------------------------
-- Collection items (tattoo and/or AI generation artifacts)
-- ---------------------------------------------------------------------------

create table public.collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections (id) on delete cascade,
  tattoo_id uuid references public.tattoos (id) on delete cascade,
  ai_generation_id uuid references public.ai_generations (id) on delete cascade,
  notes text,
  created_at timestamptz not null default now(),
  constraint collection_items_one_target check (
    (tattoo_id is not null and ai_generation_id is null)
    or (tattoo_id is null and ai_generation_id is not null)
  ),
  constraint collection_items_notes_length check (
    notes is null or char_length(notes) <= 500
  )
);

create unique index collection_items_collection_tattoo_uidx
  on public.collection_items (collection_id, tattoo_id)
  where tattoo_id is not null;

create unique index collection_items_collection_ai_uidx
  on public.collection_items (collection_id, ai_generation_id)
  where ai_generation_id is not null;

create index collection_items_collection_id_idx
  on public.collection_items (collection_id);

comment on table public.collection_items is 'Items inside a collection: either a tattoo or an AI generation.';

alter table public.collection_items enable row level security;

create policy "Owners can select items in own collections"
  on public.collection_items for select to authenticated
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

create policy "Anyone can select items in public collections"
  on public.collection_items for select to anon, authenticated
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.visibility = 'public'
    )
  );

create policy "Owners can insert items into own collections"
  on public.collection_items for insert to authenticated
  with check (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

create policy "Owners can update items in own collections"
  on public.collection_items for update to authenticated
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

create policy "Owners can delete items from own collections"
  on public.collection_items for delete to authenticated
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

grant select on table public.collection_items to anon, authenticated;
grant insert, update, delete on table public.collection_items to authenticated;

-- ---------------------------------------------------------------------------
-- Optional AI generation images (Phase 15)
-- ---------------------------------------------------------------------------

create type public.ai_image_source as enum ('ai', 'licensed_reference');

create table public.ai_generation_images (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid not null references public.ai_generations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text,
  public_url text,
  source public.ai_image_source not null,
  provider text,
  attribution text,
  license text,
  is_ai_generated boolean not null default false,
  created_at timestamptz not null default now(),
  constraint ai_generation_images_ai_flag check (
    (source = 'ai' and is_ai_generated = true)
    or (source = 'licensed_reference' and is_ai_generated = false)
  )
);

create index ai_generation_images_generation_id_idx
  on public.ai_generation_images (generation_id);

create index ai_generation_images_user_id_idx
  on public.ai_generation_images (user_id);

comment on table public.ai_generation_images is 'Optional visual artifacts. Licensed references must never be flagged as AI-generated.';

alter table public.ai_generation_images enable row level security;

create policy "Users can select own AI generation images"
  on public.ai_generation_images for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own AI generation images"
  on public.ai_generation_images for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own AI generation images"
  on public.ai_generation_images for delete to authenticated
  using (auth.uid() = user_id);

grant select, insert, delete on table public.ai_generation_images to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ai-generation-images',
  'ai-generation-images',
  false,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

create policy "Users can read own AI generation images in storage"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'ai-generation-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can upload own AI generation images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'ai-generation-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own AI generation images in storage"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'ai-generation-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
