import type { TattooCard } from "@/features/tattoos/types";

export type ArtistSummary = {
  id: string;
  displayName: string;
  slug: string;
  bio: string | null;
  city: string | null;
  studioName: string | null;
  stylesSummary: string | null;
  websiteUrl: string | null;
  instagramHandle: string | null;
};

export type ArtistDetail = ArtistSummary & {
  portfolio: TattooCard[];
};
