import "server-only";

import {
  mapTattooCard,
  mapTattooDetail,
} from "@/features/tattoos/server/mappers";
import type {
  TattooCard,
  TattooDetail,
  TattooSearchFilters,
  TaxonomyRef,
} from "@/features/tattoos/types";
import {
  createPaginatedResult,
  getPaginationRange,
  type PaginatedResult,
} from "@/lib/pagination";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

const tattooSelect = `
  id,
  title,
  slug,
  description,
  image_path,
  image_alt,
  image_width,
  image_height,
  is_demo,
  is_featured,
  source,
  attribution,
  license,
  created_at,
  categories ( id, name, slug ),
  tattoo_styles ( styles ( id, name, slug ) ),
  tattoo_placements ( placements ( id, name, slug ) ),
  tattoo_tags ( tags ( id, name, slug ) )
`;

function applyTaxonomyFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  filters: TattooSearchFilters,
) {
  let next = query;

  if (filters.style) {
    next = next.eq("tattoo_styles.styles.slug", filters.style);
  }

  if (filters.placement) {
    next = next.eq("tattoo_placements.placements.slug", filters.placement);
  }

  if (filters.tag) {
    next = next.eq("tattoo_tags.tags.slug", filters.tag);
  }

  if (filters.category) {
    next = next.eq("categories.slug", filters.category);
  }

  if (filters.query) {
    next = next.textSearch("search_vector", filters.query, {
      config: "english",
      type: "websearch",
    });
  }

  return next;
}

function buildSelect(filters: TattooSearchFilters) {
  const styleJoin = filters.style ? "tattoo_styles!inner" : "tattoo_styles";
  const styleEmbed = filters.style
    ? "styles!inner ( id, name, slug )"
    : "styles ( id, name, slug )";
  const placementJoin = filters.placement
    ? "tattoo_placements!inner"
    : "tattoo_placements";
  const placementEmbed = filters.placement
    ? "placements!inner ( id, name, slug )"
    : "placements ( id, name, slug )";
  const tagJoin = filters.tag ? "tattoo_tags!inner" : "tattoo_tags";
  const tagEmbed = filters.tag
    ? "tags!inner ( id, name, slug )"
    : "tags ( id, name, slug )";
  const categoryJoin = filters.category ? "categories!inner" : "categories";

  return `
    id,
    title,
    slug,
    description,
    image_path,
    image_alt,
    image_width,
    image_height,
    is_demo,
    is_featured,
    source,
    attribution,
    license,
    created_at,
    ${categoryJoin} ( id, name, slug ),
    ${styleJoin} ( ${styleEmbed} ),
    ${placementJoin} ( ${placementEmbed} ),
    ${tagJoin} ( ${tagEmbed} )
  `;
}

export async function listPublishedTattoos(
  filters: TattooSearchFilters = {},
): Promise<PaginatedResult<TattooCard>> {
  const supabase = createPublicSupabaseClient();
  const { from, to, page, pageSize } = getPaginationRange(
    filters.page ?? 1,
    filters.pageSize ?? 12,
  );

  let query = supabase
    .from("tattoos")
    .select(buildSelect(filters), { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  query = applyTaxonomyFilters(query, filters);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to list tattoos: ${error.message}`);
  }

  return createPaginatedResult(
    ((data ?? []) as unknown as Parameters<typeof mapTattooCard>[0][]).map(
      (row) => mapTattooCard(row),
    ),
    count ?? 0,
    page,
    pageSize,
  );
}

export async function getFeaturedTattoos(limit = 3): Promise<TattooCard[]> {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("tattoos")
    .select(tattooSelect)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load featured tattoos: ${error.message}`);
  }

  return ((data ?? []) as unknown as Parameters<typeof mapTattooCard>[0][]).map(
    (row) => mapTattooCard(row),
  );
}

export async function getTattooBySlug(
  slug: string,
): Promise<TattooDetail | null> {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("tattoos")
    .select(tattooSelect)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load tattoo: ${error.message}`);
  }

  return data
    ? mapTattooDetail(data as unknown as Parameters<typeof mapTattooDetail>[0])
    : null;
}

export async function getRelatedTattoos(
  tattoo: TattooDetail,
  limit = 3,
): Promise<TattooCard[]> {
  const supabase = createPublicSupabaseClient();

  let query = supabase
    .from("tattoos")
    .select(tattooSelect)
    .eq("is_published", true)
    .neq("id", tattoo.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (tattoo.category?.id) {
    query = query.eq("category_id", tattoo.category.id);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load related tattoos: ${error.message}`);
  }

  const mapped = (
    (data ?? []) as unknown as Parameters<typeof mapTattooCard>[0][]
  ).map((row) => mapTattooCard(row));
  if (mapped.length > 0) {
    return mapped;
  }

  const fallback = await supabase
    .from("tattoos")
    .select(tattooSelect)
    .eq("is_published", true)
    .neq("id", tattoo.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (fallback.error) {
    throw new Error(
      `Failed to load related tattoos: ${fallback.error.message}`,
    );
  }

  return (
    (fallback.data ?? []) as unknown as Parameters<typeof mapTattooCard>[0][]
  ).map((row) => mapTattooCard(row));
}

async function listTaxonomy(
  table: "categories" | "styles" | "placements" | "tags",
): Promise<TaxonomyRef[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from(table)
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load ${table}: ${error.message}`);
  }

  return data ?? [];
}

export function listCategories() {
  return listTaxonomy("categories");
}

export function listStyles() {
  return listTaxonomy("styles");
}

export function listPlacements() {
  return listTaxonomy("placements");
}

export function listTags() {
  return listTaxonomy("tags");
}
