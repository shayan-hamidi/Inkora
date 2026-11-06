import "server-only";

import type { ZodType } from "zod";
import type {
  TextGenerationRequest,
  TextProvider,
  TextProviderResult,
  TattooConceptPayload,
} from "@/lib/ai/text-provider";

/** Deterministic provider for local/e2e when INKORA_AI_MOCK=true. */
export function createMockTextProvider(): TextProvider {
  return {
    id: "mock",
    async generateConcept(
      request: TextGenerationRequest,
      schema: ZodType<TattooConceptPayload>,
    ): Promise<TextProviderResult> {
      const titleBase =
        request.parentContext?.title?.trim() ||
        request.prompt.slice(0, 40).trim() ||
        "Mock concept";

      const payload = schema.parse({
        title:
          request.kind === "refine"
            ? `${titleBase} (refined)`
            : `Mock · ${titleBase}`,
        concept:
          request.parentContext?.concept ??
          `Mock concept for: ${request.prompt}`,
        symbolism:
          request.parentContext?.symbolism ??
          "Mock symbolism explaining quiet personal meaning.",
        visualPrompt:
          request.parentContext?.visualPrompt ??
          "Fine-line monochrome tattoo sketch, sparse marks, editorial lighting.",
        suggestedStyles: ["minimal", "fine-line"],
        suggestedPlacements: ["forearm", "ribs"],
      });

      return {
        provider: "mock",
        model: "inkora-mock-1",
        rawText: JSON.stringify(payload),
        payload,
      };
    },
  };
}
