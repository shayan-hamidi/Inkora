import "server-only";

import { AiQuotaError } from "@/lib/ai/text-provider";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** App-level caps — intentionally below typical Gemini free Flash RPD. */
export const AI_RATE_LIMITS = {
  perMinute: 3,
  perDay: 10,
} as const;

export async function assertAiRateLimit(userId: string) {
  const supabase = await createServerSupabaseClient();
  const now = Date.now();
  const minuteAgo = new Date(now - 60_000).toISOString();
  const dayAgo = new Date(now - 24 * 60 * 60_000).toISOString();

  const [{ count: minuteCount, error: minuteError }, { count: dayCount, error: dayError }] =
    await Promise.all([
      supabase
        .from("ai_generations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", minuteAgo),
      supabase
        .from("ai_generations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", dayAgo),
    ]);

  if (minuteError || dayError) {
    throw new Error(minuteError?.message ?? dayError?.message ?? "Rate limit check failed.");
  }

  if ((minuteCount ?? 0) >= AI_RATE_LIMITS.perMinute) {
    throw new AiQuotaError("Too many AI requests this minute. Try again shortly.");
  }

  if ((dayCount ?? 0) >= AI_RATE_LIMITS.perDay) {
    throw new AiQuotaError(
      "Daily AI concept limit reached. Try again tomorrow (app cap protects free-tier quota).",
    );
  }
}
