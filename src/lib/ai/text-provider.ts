import type { ZodType } from "zod";

export type TextGenerationKind =
  | "concept"
  | "refine"
  | "symbolism"
  | "visual_prompt";

export type TextGenerationRequest = {
  kind: TextGenerationKind;
  prompt: string;
  parentContext?: {
    title?: string | null;
    concept?: string | null;
    symbolism?: string | null;
    visualPrompt?: string | null;
  };
};

export type TattooConceptPayload = {
  title: string;
  concept: string;
  symbolism: string;
  visualPrompt: string;
  suggestedStyles: string[];
  suggestedPlacements: string[];
};

export type TextProviderResult = {
  provider: string;
  model: string;
  rawText: string;
  payload: TattooConceptPayload;
};

export type TextProvider = {
  readonly id: string;
  generateConcept(
    request: TextGenerationRequest,
    schema: ZodType<TattooConceptPayload>,
  ): Promise<TextProviderResult>;
};

export class AiQuotaError extends Error {
  readonly code = "QUOTA" as const;

  constructor(message = "AI quota reached. Try again later.") {
    super(message);
    this.name = "AiQuotaError";
  }
}

export class AiUnavailableError extends Error {
  readonly code = "UNAVAILABLE" as const;

  constructor(message = "AI text provider is not configured.") {
    super(message);
    this.name = "AiUnavailableError";
  }
}

export class AiValidationError extends Error {
  readonly code = "VALIDATION" as const;

  constructor(message = "Model output failed validation.") {
    super(message);
    this.name = "AiValidationError";
  }
}
