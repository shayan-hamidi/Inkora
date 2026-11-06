import "server-only";

import { createGeminiTextProvider } from "@/lib/ai/providers/gemini";
import { createMockTextProvider } from "@/lib/ai/providers/mock";
import { getImageProvider } from "@/lib/ai/image-provider";
import type { TextProvider } from "@/lib/ai/text-provider";

export function getTextProvider(): TextProvider {
  if (process.env.INKORA_AI_MOCK === "true") {
    return createMockTextProvider();
  }

  return createGeminiTextProvider();
}

export { getImageProvider };
export {
  AiQuotaError,
  AiUnavailableError,
  AiValidationError,
} from "@/lib/ai/text-provider";
export {
  ImageUnavailableError,
  isImageGenerationEnabled,
} from "@/lib/ai/image-provider";
export { AI_RATE_LIMITS, assertAiRateLimit } from "@/lib/ai/rate-limit";
export {
  generateConceptRequestSchema,
  tattooConceptPayloadSchema,
} from "@/lib/ai/schemas";
export { GEMINI_FREE_TIER_NOTES } from "@/lib/ai/providers/gemini";
