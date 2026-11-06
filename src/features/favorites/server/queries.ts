import "server-only";

import {
  mapTattooCard,
} from "@/features/tattoos/server/mappers";
import type { TattooCard } from "@/features/tattoos/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const favoriteSelect = `
  tattoo_id,
  created_at,
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
`;

export async function listFavoriteTattoos(): Promise<TattooCard[]> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("favorites")
    .select(favoriteSelect)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list favorites: ${error.message}`);
  }

  return (data ?? [])
    .map((row) => {
      const tattoo = Array.isArray(row.tattoos) ? row.tattoos[0] : row.tattoos;
      if (!tattoo) {
        return null;
      }
      return mapTattooCard(
        tattoo as unknown as Parameters<typeof mapTattooCard>[0],
      );
    })
    .filter((item): item is TattooCard => item !== null);
}

export async function getFavoriteTattooIds(
  tattooIds: string[],
): Promise<Set<string>> {
  if (tattooIds.length === 0) {
    return new Set();
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Set();
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("tattoo_id")
    .eq("user_id", user.id)
    .in("tattoo_id", tattooIds);

  if (error) {
    throw new Error(`Failed to load favorite ids: ${error.message}`);
  }

  return new Set((data ?? []).map((row) => row.tattoo_id));
}

export async function isTattooFavorited(tattooId: string): Promise<boolean> {
  const ids = await getFavoriteTattooIds([tattooId]);
  return ids.has(tattooId);
}
