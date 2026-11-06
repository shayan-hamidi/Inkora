import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ZodType } from "zod";
import {
  AiQuotaError,
  AiUnavailableError,
  AiValidationError,
  type TextGenerationRequest,
  type TextProvider,
  type TextProviderResult,
  type TattooConceptPayload,
} from "@/lib/ai/text-provider";
import { getServerEnv } from "@/lib/env";

const MODEL_ID = "gemini-2.5-flash-lite";

function buildSystemInstruction() {
  return [
    "You are INKORA's tattoo concept assistant.",
    "Return ONLY valid JSON matching this shape:",
    '{ "title": string, "concept": string, "symbolism": string, "visualPrompt": string, "suggestedStyles": string[], "suggestedPlacements": string[] }',
    "No markdown fences. Keep language clear and respectful.",
    "Never invent copyrighted character designs or celebrity likenesses.",
    "visualPrompt should describe composition for a tattoo reference, not photographic realism of a person.",
  ].join(" ");
}

function buildUserPrompt(request: TextGenerationRequest) {
  const parts = [`Kind: ${request.kind}`, `User prompt: ${request.prompt}`];

  if (request.parentContext) {
    parts.push(
      `Existing title: ${request.parentContext.title ?? ""}`,
      `Existing concept: ${request.parentContext.concept ?? ""}`,
      `Existing symbolism: ${request.parentContext.symbolism ?? ""}`,
      `Existing visual prompt: ${request.parentContext.visualPrompt ?? ""}`,
    );
  }

  if (request.kind === "refine") {
    parts.push("Refine and improve the existing concept using the user prompt.");
  } else if (request.kind === "symbolism") {
    parts.push("Focus on expanding symbolism while keeping a coherent concept.");
  } else if (request.kind === "visual_prompt") {
    parts.push("Focus on a stronger visualPrompt for artists/reference tools.");
  }

  return parts.join("\n");
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new AiValidationError("Model did not return a JSON object.");
  }

  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    throw new AiValidationError("Model JSON could not be parsed.");
  }
}

export function createGeminiTextProvider(): TextProvider {
  return {
    id: "gemini",
    async generateConcept(
      request: TextGenerationRequest,
      schema: ZodType<TattooConceptPayload>,
    ): Promise<TextProviderResult> {
      const env = getServerEnv();
      if (!env.GEMINI_API_KEY) {
        throw new AiUnavailableError(
          "GEMINI_API_KEY is not configured on the server.",
        );
      }

      const client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
      const model = client.getGenerativeModel({
        model: MODEL_ID,
        systemInstruction: buildSystemInstruction(),
        generationConfig: {
          temperature: 0.8,
          responseMimeType: "application/json",
        },
      });

      try {
        const result = await model.generateContent(buildUserPrompt(request));
        const rawText = result.response.text();
        const parsedJson = extractJsonObject(rawText);
        const payload = schema.safeParse(parsedJson);

        if (!payload.success) {
          throw new AiValidationError(
            "Model output failed schema validation and was discarded.",
          );
        }

        return {
          provider: "gemini",
          model: MODEL_ID,
          rawText,
          payload: payload.data,
        };
      } catch (error) {
        if (
          error instanceof AiUnavailableError ||
          error instanceof AiValidationError ||
          error instanceof AiQuotaError
        ) {
          throw error;
        }

        const message =
          error instanceof Error ? error.message.toLowerCase() : "";
        if (
          message.includes("429") ||
          message.includes("quota") ||
          message.includes("rate")
        ) {
          throw new AiQuotaError();
        }

        throw new Error(
          error instanceof Error
            ? error.message
            : "Gemini request failed unexpectedly.",
        );
      }
    },
  };
}

/** Dated note for docs: free-tier Flash-Lite is preferred for higher RPD. */
export const GEMINI_FREE_TIER_NOTES = {
  checkedOn: "2026-11-07",
  model: MODEL_ID,
  source: "https://ai.google.dev/gemini-api/docs/rate-limits",
  summary:
    "Free-tier limits vary by project and model in AI Studio. Flash models are often ~5 RPM / ~20 RPD; Flash-Lite models are often higher (~15 RPM / up to ~500 RPD). Limits are not guaranteed. App-level caps stay stricter.",
};
