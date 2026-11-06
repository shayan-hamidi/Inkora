import "server-only";

import type {
  CollectionDetail,
  CollectionItemView,
  CollectionSummary,
} from "@/features/collections/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function listOwnCollections(): Promise<CollectionSummary[]> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("collections")
    .select("id, name, slug, description, visibility, created_at, updated_at, collection_items(count)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list collections: ${error.message}`);
  }

  return (data ?? []).map((row) => {
    const countRow = Array.isArray(row.collection_items)
      ? row.collection_items[0]
      : row.collection_items;
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      visibility: row.visibility,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      itemCount:
        countRow && typeof countRow === "object" && "count" in countRow
          ? Number(countRow.count ?? 0)
          : 0,
    };
  });
}

export async function getOwnCollectionBySlug(
  slug: string,
): Promise<CollectionDetail | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("collections")
    .select(
      `
      id,
      name,
      slug,
      description,
      visibility,
      created_at,
      updated_at,
      collection_items (
        id,
        notes,
        created_at,
        tattoo_id,
        ai_generation_id,
        tattoos ( id, title, slug, image_path, image_alt ),
        ai_generations ( id, title, concept, kind )
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load collection: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const items: CollectionItemView[] = (data.collection_items ?? []).map(
    (item) => {
      const tattoo = Array.isArray(item.tattoos)
        ? item.tattoos[0]
        : item.tattoos;
      const generation = Array.isArray(item.ai_generations)
        ? item.ai_generations[0]
        : item.ai_generations;

      return {
        id: item.id,
        notes: item.notes,
        createdAt: item.created_at,
        tattoo: tattoo
          ? {
              id: tattoo.id,
              title: tattoo.title,
              slug: tattoo.slug,
              imagePath: tattoo.image_path,
              imageAlt: tattoo.image_alt,
            }
          : null,
        aiGeneration: generation
          ? {
              id: generation.id,
              title: generation.title,
              concept: generation.concept,
              kind: generation.kind,
            }
          : null,
      };
    },
  );

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    visibility: data.visibility,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    itemCount: items.length,
    items,
  };
}
