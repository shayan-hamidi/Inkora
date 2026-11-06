"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const tattooIdSchema = z.string().uuid();

export type FavoriteActionResult = {
  status: "success" | "error" | "unauthenticated";
  favorited?: boolean;
  message?: string;
};

async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function toggleFavoriteAction(
  tattooId: string,
): Promise<FavoriteActionResult> {
  const parsed = tattooIdSchema.safeParse(tattooId);
  if (!parsed.success) {
    return { status: "error", message: "Invalid tattoo." };
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { status: "unauthenticated", message: "Sign in to save favorites." };
  }

  const { data: existing, error: lookupError } = await supabase
    .from("favorites")
    .select("tattoo_id")
    .eq("user_id", user.id)
    .eq("tattoo_id", parsed.data)
    .maybeSingle();

  if (lookupError) {
    return { status: "error", message: lookupError.message };
  }

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("tattoo_id", parsed.data);

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/favorites");
    revalidatePath("/tattoos");
    revalidatePath(`/tattoos/${parsed.data}`);
    return { status: "success", favorited: false };
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    tattoo_id: parsed.data,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/favorites");
  revalidatePath("/tattoos");
  return { status: "success", favorited: true };
}
