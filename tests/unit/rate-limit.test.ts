import { describe, expect, it } from "vitest";
import { AI_RATE_LIMITS } from "@/lib/ai/rate-limit";

describe("AI_RATE_LIMITS", () => {
  it("keeps conservative app caps under typical free-tier flash quotas", () => {
    expect(AI_RATE_LIMITS.perMinute).toBeLessThanOrEqual(5);
    expect(AI_RATE_LIMITS.perDay).toBeLessThanOrEqual(20);
  });
});
