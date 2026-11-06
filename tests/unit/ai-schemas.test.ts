import { describe, expect, it } from "vitest";
import {
  generateConceptRequestSchema,
  tattooConceptPayloadSchema,
} from "@/lib/ai/schemas";
import { createUnavailableImageProvider } from "@/lib/ai/image-provider";

describe("AI schemas", () => {
  it("accepts a valid concept payload", () => {
    const parsed = tattooConceptPayloadSchema.parse({
      title: "Quiet Crescent",
      concept: "A sparse moon for a first tattoo.",
      symbolism: "Quiet change and patience.",
      visualPrompt: "Fine-line crescent, negative space, rib placement.",
      suggestedStyles: ["minimal", "fine-line"],
      suggestedPlacements: ["ribs"],
    });

    expect(parsed.title).toBe("Quiet Crescent");
  });

  it("rejects invalid model JSON shapes", () => {
    const parsed = tattooConceptPayloadSchema.safeParse({
      title: "",
      concept: 12,
    });
    expect(parsed.success).toBe(false);
  });

  it("validates generation requests", () => {
    expect(
      generateConceptRequestSchema.safeParse({ prompt: "short" }).success,
    ).toBe(false);
    expect(
      generateConceptRequestSchema.safeParse({
        prompt: "A longer idea about a moon and sparse marks",
        kind: "refine",
      }).success,
    ).toBe(true);
  });
});

describe("unavailable image provider", () => {
  it("reports unavailable and throws on generate", async () => {
    const provider = createUnavailableImageProvider();
    expect(provider.available).toBe(false);
    await expect(
      provider.generate({
        prompt: "test",
        generationId: "00000000-0000-4000-8000-000000000001",
        userId: "00000000-0000-4000-8000-000000000002",
      }),
    ).rejects.toThrow(/unavailable/i);
  });
});
