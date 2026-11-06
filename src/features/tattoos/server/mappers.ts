import type {
  TaxonomyRef,
  TattooCard,
  TattooDetail,
} from "@/features/tattoos/types";

type NestedTaxonomy = {
  id: string;
  name: string;
  slug: string;
} | null;

type TattooQueryRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_path: string;
  image_alt: string | null;
  image_width: number | null;
  image_height: number | null;
  is_demo: boolean;
  is_featured: boolean;
  source?: string | null;
  attribution?: string | null;
  license?: string | null;
  created_at?: string;
  categories: NestedTaxonomy | NestedTaxonomy[] | null;
  tattoo_styles:
    | Array<{ styles: NestedTaxonomy | NestedTaxonomy[] | null }>
    | null;
  tattoo_placements:
    | Array<{ placements: NestedTaxonomy | NestedTaxonomy[] | null }>
    | null;
  tattoo_tags: Array<{ tags: NestedTaxonomy | NestedTaxonomy[] | null }> | null;
};

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapTaxonomy(value: NestedTaxonomy): TaxonomyRef | null {
  if (!value) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    slug: value.slug,
  };
}

function mapNestedList(
  rows:
    | Array<{ [key: string]: NestedTaxonomy | NestedTaxonomy[] | null }>
    | null
    | undefined,
  key: string,
): TaxonomyRef[] {
  if (!rows) {
    return [];
  }

  return rows
    .map((row) => mapTaxonomy(asSingle(row[key] as NestedTaxonomy)))
    .filter((item): item is TaxonomyRef => item !== null);
}

export function mapTattooCard(row: TattooQueryRow): TattooCard {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    imagePath: row.image_path,
    imageAlt: row.image_alt,
    imageWidth: row.image_width,
    imageHeight: row.image_height,
    isDemo: row.is_demo,
    isFeatured: row.is_featured,
    category: mapTaxonomy(asSingle(row.categories)),
    styles: mapNestedList(row.tattoo_styles, "styles"),
    placements: mapNestedList(row.tattoo_placements, "placements"),
    tags: mapNestedList(row.tattoo_tags, "tags"),
  };
}

export function mapTattooDetail(row: TattooQueryRow): TattooDetail {
  return {
    ...mapTattooCard(row),
    source: row.source ?? null,
    attribution: row.attribution ?? null,
    license: row.license ?? null,
    createdAt: row.created_at ?? new Date(0).toISOString(),
  };
}
