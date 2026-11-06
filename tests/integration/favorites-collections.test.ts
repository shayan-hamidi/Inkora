/** @vitest-environment node */
import { createClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasLocalSupabase = Boolean(url && anonKey && serviceKey);

const tattooId = "55555555-5555-4555-8555-555555555504";

describe.skipIf(!hasLocalSupabase)("favorites and collections RLS", () => {
  const admin = createClient(url!, serviceKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let userAId = "";
  let userBId = "";
  let userAClient = createClient(url!, anonKey!);
  let userBClient = createClient(url!, anonKey!);
  let collectionId = "";

  beforeAll(async () => {
    const emailA = `fav-a-${Date.now()}@example.com`;
    const emailB = `fav-b-${Date.now()}@example.com`;
    const password = "TestPassword123!";

    const createdA = await admin.auth.admin.createUser({
      email: emailA,
      password,
      email_confirm: true,
    });
    const createdB = await admin.auth.admin.createUser({
      email: emailB,
      password,
      email_confirm: true,
    });

    userAId = createdA.data.user!.id;
    userBId = createdB.data.user!.id;

    userAClient = createClient(url!, anonKey!);
    userBClient = createClient(url!, anonKey!);

    await userAClient.auth.signInWithPassword({ email: emailA, password });
    await userBClient.auth.signInWithPassword({ email: emailB, password });
  });

  afterAll(async () => {
    if (userAId) await admin.auth.admin.deleteUser(userAId);
    if (userBId) await admin.auth.admin.deleteUser(userBId);
  });

  it("allows a user to favorite and blocks cross-user deletes", async () => {
    const insert = await userAClient.from("favorites").insert({
      user_id: userAId,
      tattoo_id: tattooId,
    });
    expect(insert.error).toBeNull();

    const crossDelete = await userBClient
      .from("favorites")
      .delete()
      .eq("user_id", userAId)
      .eq("tattoo_id", tattooId);
    expect(crossDelete.error).toBeNull();

    const stillThere = await userAClient
      .from("favorites")
      .select("tattoo_id")
      .eq("user_id", userAId)
      .eq("tattoo_id", tattooId)
      .maybeSingle();
    expect(stillThere.data?.tattoo_id).toBe(tattooId);
  });

  it("keeps private collections inaccessible to other users", async () => {
    const created = await userAClient
      .from("collections")
      .insert({
        user_id: userAId,
        name: "Private board",
        slug: `private-board-${Date.now()}`,
        visibility: "private",
      })
      .select("id")
      .single();

    expect(created.error).toBeNull();
    collectionId = created.data!.id;

    const otherView = await userBClient
      .from("collections")
      .select("id")
      .eq("id", collectionId)
      .maybeSingle();

    expect(otherView.data).toBeNull();
  });
});
