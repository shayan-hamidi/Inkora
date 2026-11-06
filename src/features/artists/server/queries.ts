import "server-only";

import { mapTattooCard } from "@/features/tattoos/server/mappers";
import type { ArtistDetail, ArtistSummary } from "@/features/artists/types";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

function mapArtist(row: {
  id: string;
  display_name: string;
  slug: string;
  bio: string | null;
  city: string | null;
  studio_name: string | null;
  styles_summary: string | null;
  website_url: string | null;
  instagram_handle: string | null;
}): ArtistSummary {
  return {
    id: row.id,
    displayName: row.display_name,
    slug: row.slug,
    bio: row.bio,
    city: row.city,
    studioName: row.studio_name,
    stylesSummary: row.styles_summary,
    websiteUrl: row.website_url,
    instagramHandle: row.instagram_handle,
  };
}

export async function listPublishedArtists(): Promise<ArtistSummary[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("artist_profiles")
    .select(
      "id, display_name, slug, bio, city, studio_name, styles_summary, website_url, instagram_handle",
    )
    .eq("is_published", true)
    .order("display_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to list artists: ${error.message}`);
  }

  return (data ?? []).map(mapArtist);
}

export async function getArtistBySlug(
  slug: string,
): Promise<ArtistDetail | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("artist_profiles")
    .select(
      `
      id,
      display_name,
      slug,
      bio,
      city,
      studio_name,
      styles_summary,
      website_url,
      instagram_handle,
      artist_tattoos (
        tattoos (
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
          categories ( id, name, slug ),
          tattoo_styles ( styles ( id, name, slug ) ),
          tattoo_placements ( placements ( id, name, slug ) ),
          tattoo_tags ( tags ( id, name, slug ) )
        )
      )
    `,
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load artist: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const portfolio = (data.artist_tattoos ?? [])
    .map((link) => {
      const tattoo = Array.isArray(link.tattoos) ? link.tattoos[0] : link.tattoos;
      if (!tattoo) {
        return null;
      }
      return mapTattooCard(
        tattoo as unknown as Parameters<typeof mapTattooCard>[0],
      );
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return {
    ...mapArtist(data),
    portfolio,
  };
}
