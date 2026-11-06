/** @vitest-environment node */
import { createClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasLocalSupabase = Boolean(url && anonKey && serviceKey);

describe.skipIf(!hasLocalSupabase)("admin and artists integration", () => {
  const admin = createClient(url!, serviceKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let userId = "";
  let adminUserId = "";
  let userClient = createClient(url!, anonKey!);
  let adminClient = createClient(url!, anonKey!);

  beforeAll(async () => {
    const password = "TestPassword123!";
    const userEmail = `plain-${Date.now()}@example.com`;
    const adminEmail = `admin-${Date.now()}@example.com`;

    const createdUser = await admin.auth.admin.createUser({
      email: userEmail,
      password,
      email_confirm: true,
    });
    const createdAdmin = await admin.auth.admin.createUser({
      email: adminEmail,
      password,
      email_confirm: true,
    });

    userId = createdUser.data.user!.id;
    adminUserId = createdAdmin.data.user!.id;

    await admin.from("profiles").update({ role: "admin" }).eq("id", adminUserId);

    userClient = createClient(url!, anonKey!);
    adminClient = createClient(url!, anonKey!);
    await userClient.auth.signInWithPassword({ email: userEmail, password });
    await adminClient.auth.signInWithPassword({ email: adminEmail, password });
  });

  afterAll(async () => {
    if (userId) await admin.auth.admin.deleteUser(userId);
    if (adminUserId) await admin.auth.admin.deleteUser(adminUserId);
  });

  it("rejects non-admin tattoo inserts via RLS", async () => {
    const result = await userClient.from("tattoos").insert({
      title: "Should Fail",
      slug: `should-fail-${Date.now()}`,
      image_path: "/demo/tattoos/minimal-moon.svg",
      source: "test",
      attribution: "test",
      license: "test",
    });
    expect(result.error).not.toBeNull();
  });

  it("allows admin tattoo inserts", async () => {
    const slug = `admin-tattoo-${Date.now()}`;
    const result = await adminClient.from("tattoos").insert({
      title: "Admin Tattoo",
      slug,
      image_path: "/demo/tattoos/minimal-moon.svg",
      source: "INKORA demo",
      attribution: "Synthetic",
      license: "Demo only",
      is_demo: true,
      is_published: false,
    });
    expect(result.error).toBeNull();
  });

  it("lists published artists publicly", async () => {
    const { data, error } = await userClient
      .from("artist_profiles")
      .select("slug")
      .eq("is_published", true);
    expect(error).toBeNull();
    expect(data?.some((row) => row.slug === "mira-vale")).toBe(true);
  });

  it("stores consultation requests", async () => {
    const { data: artist } = await userClient
      .from("artist_profiles")
      .select("id")
      .eq("slug", "mira-vale")
      .single();

    const insert = await userClient.from("consultation_requests").insert({
      artist_id: artist!.id,
      requester_user_id: userId,
      requester_name: "Casey",
      requester_email: "casey@example.com",
      message: "Looking for a quiet first tattoo concept around eight centimeters.",
    });
    expect(insert.error).toBeNull();
  });
});
