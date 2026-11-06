import { describe, expect, it } from "vitest";
import { createMockTextProvider } from "@/lib/ai/providers/mock";
import { tattooConceptPayloadSchema } from "@/lib/ai/schemas";

describe("mock text provider", () => {
  it("returns schema-valid concept payloads", async () => {
    const provider = createMockTextProvider();
    const result = await provider.generateConcept(
      {
        kind: "concept",
        prompt: "A quiet crescent moon for a first rib tattoo",
      },
      tattooConceptPayloadSchema,
    );

    expect(result.provider).toBe("mock");
    expect(result.payload.title.length).toBeGreaterThan(0);
    expect(result.payload.visualPrompt.length).toBeGreaterThan(0);
  });

  it("marks refinements in the title", async () => {
    const provider = createMockTextProvider();
    const result = await provider.generateConcept(
      {
        kind: "refine",
        prompt: "Make it quieter",
        parentContext: { title: "Quiet Moon" },
      },
      tattooConceptPayloadSchema,
    );

    expect(result.payload.title).toMatch(/refined/i);
  });
});
