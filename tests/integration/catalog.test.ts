/** @vitest-environment node */
import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const hasLocalSupabase = Boolean(supabaseUrl && anonKey && serviceRoleKey);

describe.skipIf(!hasLocalSupabase)("catalog integration", () => {
  const anon = createClient(supabaseUrl!, anonKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const admin = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  it("lets anonymous clients read published tattoos and taxonomies", async () => {
    const { data: tattoos, error: tattoosError } = await anon
      .from("tattoos")
      .select("id, slug, is_published, is_demo")
      .order("slug");

    expect(tattoosError).toBeNull();
    expect(tattoos?.length).toBeGreaterThanOrEqual(5);
    expect(tattoos?.every((row) => row.is_published)).toBe(true);
    expect(tattoos?.every((row) => row.is_demo)).toBe(true);
    expect(tattoos?.some((row) => row.slug === "draft-rib-study")).toBe(false);

    const { data: styles, error: stylesError } = await anon
      .from("styles")
      .select("slug");
    expect(stylesError).toBeNull();
    expect(styles?.some((row) => row.slug === "fine-line")).toBe(true);
  });

  it("hides unpublished tattoos from anonymous clients", async () => {
    const { data: hidden } = await anon
      .from("tattoos")
      .select("slug")
      .eq("slug", "draft-rib-study");

    expect(hidden ?? []).toHaveLength(0);

    const { data: draft, error } = await admin
      .from("tattoos")
      .select("slug, is_published")
      .eq("slug", "draft-rib-study")
      .single();

    expect(error).toBeNull();
    expect(draft).toMatchObject({
      slug: "draft-rib-study",
      is_published: false,
    });
  });

  it("rejects anonymous catalog writes", async () => {
    const { error } = await anon.from("tattoos").insert({
      title: "Unauthorized Insert",
      slug: `unauthorized-${Date.now()}`,
      image_path: "/demo/tattoos/minimal-moon.svg",
      is_demo: true,
      is_published: true,
    });

    expect(error).toBeTruthy();
  });

  it("supports full-text search on published tattoos", async () => {
    const { data, error } = await anon
      .from("tattoos")
      .select("slug")
      .textSearch("search_vector", "moon", { config: "english", type: "plain" });

    expect(error).toBeNull();
    expect(data?.some((row) => row.slug === "quiet-moon")).toBe(true);
  });
});
