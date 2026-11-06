"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  collectionItemSchema,
  createCollectionSchema,
  updateCollectionSchema,
} from "@/features/collections/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export type CollectionActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createCollectionAction(
  _prev: CollectionActionState,
  formData: FormData,
): Promise<CollectionActionState> {
  const parsed = createCollectionSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    visibility: formData.get("visibility") || "private",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { status: "error", message: "Sign in to create a collection." };
  }

  const baseSlug = slugify(parsed.data.name) || "collection";
  let slug = baseSlug;
  let attempt = 1;

  while (attempt < 20) {
    const { error } = await supabase.from("collections").insert({
      user_id: user.id,
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
      visibility: parsed.data.visibility,
    });

    if (!error) {
      revalidatePath("/collections");
      redirect(`/collections/${slug}`);
    }

    if (error.code !== "23505") {
      return { status: "error", message: error.message };
    }

    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  return { status: "error", message: "Could not allocate a unique slug." };
}

export async function updateCollectionAction(
  _prev: CollectionActionState,
  formData: FormData,
): Promise<CollectionActionState> {
  const parsed = updateCollectionSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description") || "",
    visibility: formData.get("visibility") || "private",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { status: "error", message: "Sign in required." };
  }

  const { data: existing, error: lookupError } = await supabase
    .from("collections")
    .select("id, slug")
    .eq("id", parsed.data.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (lookupError || !existing) {
    return { status: "error", message: "Collection not found." };
  }

  const { error } = await supabase
    .from("collections")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      visibility: parsed.data.visibility,
    })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/collections");
  revalidatePath(`/collections/${existing.slug}`);
  return { status: "success", message: "Collection updated." };
}

export async function deleteCollectionAction(
  collectionId: string,
): Promise<CollectionActionState> {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { status: "error", message: "Sign in required." };
  }

  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId)
    .eq("user_id", user.id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/collections");
  redirect("/collections");
}

export async function addCollectionItemAction(input: {
  collectionId: string;
  tattooId?: string;
  aiGenerationId?: string;
  notes?: string;
}): Promise<CollectionActionState> {
  const parsed = collectionItemSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Invalid collection item." };
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { status: "error", message: "Sign in required." };
  }

  const { data: collection } = await supabase
    .from("collections")
    .select("id, slug")
    .eq("id", parsed.data.collectionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!collection) {
    return { status: "error", message: "Collection not found." };
  }

  const { error } = await supabase.from("collection_items").insert({
    collection_id: parsed.data.collectionId,
    tattoo_id: parsed.data.tattooId ?? null,
    ai_generation_id: parsed.data.aiGenerationId ?? null,
    notes: parsed.data.notes || null,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath(`/collections/${collection.slug}`);
  revalidatePath("/collections");
  return { status: "success", message: "Added to collection." };
}

export async function removeCollectionItemAction(
  itemId: string,
  collectionSlug: string,
): Promise<CollectionActionState> {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { status: "error", message: "Sign in required." };
  }

  const { error } = await supabase
    .from("collection_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath(`/collections/${collectionSlug}`);
  revalidatePath("/collections");
  return { status: "success", message: "Item removed." };
}
