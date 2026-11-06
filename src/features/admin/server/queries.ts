import "server-only";

import { requireAdminProfile } from "@/lib/auth/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function listAdminTattoos() {
  await requireAdminProfile();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("tattoos")
    .select(
      "id, title, slug, is_published, is_featured, is_demo, license, attribution, source, image_path, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list admin tattoos: ${error.message}`);
  }

  return data ?? [];
}

export async function listAdminTaxonomy(
  table: "categories" | "styles" | "placements" | "tags",
) {
  await requireAdminProfile();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from(table)
    .select("id, name, slug, created_at")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to list ${table}: ${error.message}`);
  }

  return data ?? [];
}

export async function getAiUsageMetrics() {
  await requireAdminProfile();
  const supabase = await createServerSupabaseClient();

  const dayAgo = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString();

  const [
    { count: total },
    { count: lastDay },
    { count: lastWeek },
    { count: failed },
  ] = await Promise.all([
    supabase.from("ai_generations").select("id", { count: "exact", head: true }),
    supabase
      .from("ai_generations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", dayAgo),
    supabase
      .from("ai_generations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekAgo),
    supabase
      .from("ai_generations")
      .select("id", { count: "exact", head: true })
      .eq("status", "failed"),
  ]);

  return {
    total: total ?? 0,
    lastDay: lastDay ?? 0,
    lastWeek: lastWeek ?? 0,
    failed: failed ?? 0,
  };
}

export async function listAdminConsultations(limit = 30) {
  await requireAdminProfile();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("consultation_requests")
    .select(
      "id, requester_name, requester_email, message, preferred_placement, status, created_at, artist_profiles ( display_name, slug )",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to list consultations: ${error.message}`);
  }

  return data ?? [];
}
