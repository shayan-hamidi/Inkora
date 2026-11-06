/** @vitest-environment node */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

type ProfileRow = {
  id: string;
  display_name: string | null;
  role: "user" | "admin";
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const hasLocalSupabase = Boolean(supabaseUrl && anonKey && serviceRoleKey);

describe.skipIf(!hasLocalSupabase)("profiles integration", () => {
  let admin: SupabaseClient;
  const createdUserIds: string[] = [];

  beforeAll(() => {
    admin = createClient(supabaseUrl!, serviceRoleKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  });

  afterAll(async () => {
    await Promise.all(
      createdUserIds.map((userId) => admin.auth.admin.deleteUser(userId)),
    );
  });

  it("creates a profile with role user on signup", async () => {
    const email = `inkora-profile-${Date.now()}@example.com`;
    const password = "TestPassword123!";

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: "Inkora Tester" },
    });

    expect(error).toBeNull();
    expect(data.user?.id).toBeTruthy();
    createdUserIds.push(data.user!.id);

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, display_name, role")
      .eq("id", data.user!.id)
      .single<ProfileRow>();

    expect(profileError).toBeNull();
    expect(profile).toMatchObject({
      id: data.user!.id,
      display_name: "Inkora Tester",
      role: "user",
    });
  });

  it("rejects role escalation for authenticated users", async () => {
    const email = `inkora-role-${Date.now()}@example.com`;
    const password = "TestPassword123!";

    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    expect(createError).toBeNull();
    const userId = created.user?.id;
    expect(userId).toBeTruthy();
    createdUserIds.push(userId!);

    const userClient = createClient(supabaseUrl!, anonKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error: signInError } = await userClient.auth.signInWithPassword({
      email,
      password,
    });
    expect(signInError).toBeNull();

    const { error: escalateError } = await userClient
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", userId!);

    expect(escalateError).toBeTruthy();

    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userId!)
      .single<{ role: string }>();

    expect(profile?.role).toBe("user");
  });
});
