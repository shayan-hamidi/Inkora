"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AiQuotaError,
  AiUnavailableError,
  AiValidationError,
  assertAiRateLimit,
  generateConceptRequestSchema,
  getImageProvider,
  getTextProvider,
  ImageUnavailableError,
  isImageGenerationEnabled,
  tattooConceptPayloadSchema,
} from "@/lib/ai";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AiActionState = {
  status: "idle" | "error" | "success" | "unauthenticated";
  message?: string;
  generationId?: string;
};

async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function generateConceptAction(
  _prev: AiActionState,
  formData: FormData,
): Promise<AiActionState> {
  const parsed = generateConceptRequestSchema.safeParse({
    prompt: formData.get("prompt"),
    kind: formData.get("kind") || "concept",
    parentId: formData.get("parentId") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Enter a clearer prompt (at least 8 characters).",
    };
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { status: "unauthenticated", message: "Sign in to use AI Studio." };
  }

  let parentContext:
    | {
        title?: string | null;
        concept?: string | null;
        symbolism?: string | null;
        visualPrompt?: string | null;
      }
    | undefined;

  if (parsed.data.parentId) {
    const { data: parent } = await supabase
      .from("ai_generations")
      .select("id, title, concept, symbolism, visual_prompt")
      .eq("id", parsed.data.parentId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!parent) {
      return { status: "error", message: "Parent concept not found." };
    }

    parentContext = {
      title: parent.title,
      concept: parent.concept,
      symbolism: parent.symbolism,
      visualPrompt: parent.visual_prompt,
    };
  }

  try {
    await assertAiRateLimit(user.id);
    const provider = getTextProvider();
    const result = await provider.generateConcept(
      {
        kind: parsed.data.kind,
        prompt: parsed.data.prompt,
        parentContext,
      },
      tattooConceptPayloadSchema,
    );

    const { data, error } = await supabase
      .from("ai_generations")
      .insert({
        user_id: user.id,
        kind: parsed.data.kind,
        prompt: parsed.data.prompt,
        parent_id: parsed.data.parentId ?? null,
        title: result.payload.title,
        concept: result.payload.concept,
        symbolism: result.payload.symbolism,
        visual_prompt: result.payload.visualPrompt,
        suggested_styles: result.payload.suggestedStyles,
        suggested_placements: result.payload.suggestedPlacements,
        raw_response: {
          text: result.rawText,
          payload: result.payload,
        },
        provider: result.provider,
        model: result.model,
        status: "succeeded",
      })
      .select("id")
      .single();

    if (error || !data) {
      return {
        status: "error",
        message: error?.message ?? "Failed to persist generation.",
      };
    }

    revalidatePath("/studio");
    revalidatePath("/studio/history");
    redirect(`/studio/history/${data.id}`);
  } catch (error) {
    if (error instanceof AiQuotaError) {
      return { status: "error", message: error.message };
    }
    if (error instanceof AiUnavailableError) {
      return {
        status: "error",
        message:
          "AI text generation is not configured. Add GEMINI_API_KEY on the server.",
      };
    }
    if (error instanceof AiValidationError) {
      return {
        status: "error",
        message: "The model returned invalid JSON. Nothing was trusted — try again.",
      };
    }

    // Next.js redirect throws; rethrow it.
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Generation failed.";

    await supabase.from("ai_generations").insert({
      user_id: user.id,
      kind: parsed.data.kind,
      prompt: parsed.data.prompt,
      parent_id: parsed.data.parentId ?? null,
      provider: "gemini",
      status: "failed",
      error_message: message,
    });

    return { status: "error", message };
  }
}

export async function requestImageGenerationAction(
  generationId: string,
): Promise<AiActionState> {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { status: "unauthenticated", message: "Sign in required." };
  }

  if (!isImageGenerationEnabled()) {
    return {
      status: "error",
      message:
        "AI image generation is disabled. Licensed catalog references remain available and are not AI-generated.",
    };
  }

  const { data: generation } = await supabase
    .from("ai_generations")
    .select("id, visual_prompt, title")
    .eq("id", generationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!generation) {
    return { status: "error", message: "Generation not found." };
  }

  try {
    await assertAiRateLimit(user.id);
    const provider = getImageProvider();
    const result = await provider.generate({
      prompt: generation.visual_prompt ?? generation.title ?? "tattoo concept",
      generationId: generation.id,
      userId: user.id,
    });

    const { error } = await supabase.from("ai_generation_images").insert({
      generation_id: generation.id,
      user_id: user.id,
      storage_path: result.storagePath ?? null,
      public_url: result.publicUrl ?? null,
      source: "ai",
      provider: result.provider,
      is_ai_generated: true,
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath(`/studio/history/${generationId}`);
    return { status: "success", message: "Image generated.", generationId };
  } catch (error) {
    if (error instanceof ImageUnavailableError || error instanceof AiQuotaError) {
      return { status: "error", message: error.message };
    }
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Image generation failed.",
    };
  }
}

export async function attachLicensedReferenceAction(
  generationId: string,
  tattooId: string,
): Promise<AiActionState> {
  const { supabase, user } = await requireUser();
  if (!user) {
    return { status: "unauthenticated", message: "Sign in required." };
  }

  const [{ data: generation }, { data: tattoo }] = await Promise.all([
    supabase
      .from("ai_generations")
      .select("id")
      .eq("id", generationId)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("tattoos")
      .select("id, image_path, attribution, license, source, is_demo")
      .eq("id", tattooId)
      .eq("is_published", true)
      .maybeSingle(),
  ]);

  if (!generation || !tattoo) {
    return { status: "error", message: "Generation or tattoo not found." };
  }

  const { error } = await supabase.from("ai_generation_images").insert({
    generation_id: generation.id,
    user_id: user.id,
    public_url: tattoo.image_path,
    source: "licensed_reference",
    provider: null,
    attribution: tattoo.attribution,
    license: tattoo.license,
    is_ai_generated: false,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath(`/studio/history/${generationId}`);
  return {
    status: "success",
    message: "Licensed reference attached (not AI-generated).",
    generationId,
  };
}
