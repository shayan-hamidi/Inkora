import type { Tables } from "@/types/database";

export type TattooRow = Tables<"tattoos">;
export type CategoryRow = Tables<"categories">;
export type StyleRow = Tables<"styles">;
export type PlacementRow = Tables<"placements">;
export type TagRow = Tables<"tags">;

export type TaxonomyRef = {
  id: string;
  name: string;
  slug: string;
};

export type TattooCard = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imagePath: string;
  imageAlt: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  isDemo: boolean;
  isFeatured: boolean;
  category: TaxonomyRef | null;
  styles: TaxonomyRef[];
  placements: TaxonomyRef[];
  tags: TaxonomyRef[];
};

export type TattooDetail = TattooCard & {
  source: string | null;
  attribution: string | null;
  license: string | null;
  createdAt: string;
};

export type TattooSearchFilters = {
  query?: string;
  category?: string;
  style?: string;
  placement?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
};
