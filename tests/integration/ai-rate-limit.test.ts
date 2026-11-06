/** @vitest-environment node */
import { createClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AI_RATE_LIMITS } from "@/lib/ai/rate-limit";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasLocalSupabase = Boolean(url && anonKey && serviceKey);

describe.skipIf(!hasLocalSupabase)("AI generation rate-limit counters", () => {
  const admin = createClient(url!, serviceKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let userId = "";
  let client = createClient(url!, anonKey!);

  beforeAll(async () => {
    const email = `ai-limit-${Date.now()}@example.com`;
    const password = "TestPassword123!";
    const created = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    userId = created.data.user!.id;
    client = createClient(url!, anonKey!);
    await client.auth.signInWithPassword({ email, password });
  });

  afterAll(async () => {
    if (userId) await admin.auth.admin.deleteUser(userId);
  });

  it("counts recent generations for the owning user only", async () => {
    const rows = Array.from({ length: AI_RATE_LIMITS.perMinute }, (_, index) => ({
      user_id: userId,
      kind: "concept" as const,
      prompt: `rate-limit probe ${index} long enough`,
      provider: "test",
      status: "succeeded" as const,
      title: `Probe ${index}`,
      concept: "test",
      symbolism: "test",
      visual_prompt: "test",
    }));

    const insert = await client.from("ai_generations").insert(rows);
    expect(insert.error).toBeNull();

    const minuteAgo = new Date(Date.now() - 60_000).toISOString();
    const { count, error } = await client
      .from("ai_generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", minuteAgo);

    expect(error).toBeNull();
    expect(count ?? 0).toBeGreaterThanOrEqual(AI_RATE_LIMITS.perMinute);
  });
});
