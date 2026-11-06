import "server-only";

export type ImageGenerationRequest = {
  prompt: string;
  generationId: string;
  userId: string;
};

export type ImageGenerationResult = {
  provider: string;
  storagePath?: string;
  publicUrl?: string;
  isAiGenerated: true;
};

export type ImageProvider = {
  readonly id: string;
  readonly available: boolean;
  generate(
    request: ImageGenerationRequest,
  ): Promise<ImageGenerationResult>;
};

export class ImageUnavailableError extends Error {
  readonly code = "IMAGE_UNAVAILABLE" as const;

  constructor(
    message = "AI image generation is unavailable on the free path right now.",
  ) {
    super(message);
    this.name = "ImageUnavailableError";
  }
}

/**
 * Default provider: honest unavailable state.
 *
 * Checked 2026-11-07: Hugging Face Inference Providers has no free monthly
 * credits for free accounts. ZeroGPU Spaces remain quota/queue fragile for a
 * portfolio production path. We ship the interface + unavailable UI, and only
 * enable a concrete free provider when IMAGE_GENERATION_ENABLED=true and a
 * reliable free endpoint is configured later.
 */
export function createUnavailableImageProvider(): ImageProvider {
  return {
    id: "unavailable",
    available: false,
    async generate() {
      throw new ImageUnavailableError();
    },
  };
}

export function isImageGenerationEnabled() {
  return process.env.IMAGE_GENERATION_ENABLED === "true";
}

export function getImageProvider(): ImageProvider {
  // Concrete HF provider intentionally omitted until a reliable free endpoint exists.
  return createUnavailableImageProvider();
}
