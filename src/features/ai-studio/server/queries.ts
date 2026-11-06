import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AiGenerationSummary = {
  id: string;
  kind: string;
  prompt: string;
  title: string | null;
  concept: string | null;
  symbolism: string | null;
  visualPrompt: string | null;
  suggestedStyles: string[];
  suggestedPlacements: string[];
  status: string;
  provider: string;
  model: string | null;
  parentId: string | null;
  createdAt: string;
  errorMessage: string | null;
};

function mapGeneration(row: {
  id: string;
  kind: string;
  prompt: string;
  title: string | null;
  concept: string | null;
  symbolism: string | null;
  visual_prompt: string | null;
  suggested_styles: string[];
  suggested_placements: string[];
  status: string;
  provider: string;
  model: string | null;
  parent_id: string | null;
  created_at: string;
  error_message: string | null;
}): AiGenerationSummary {
  return {
    id: row.id,
    kind: row.kind,
    prompt: row.prompt,
    title: row.title,
    concept: row.concept,
    symbolism: row.symbolism,
    visualPrompt: row.visual_prompt,
    suggestedStyles: row.suggested_styles,
    suggestedPlacements: row.suggested_placements,
    status: row.status,
    provider: row.provider,
    model: row.model,
    parentId: row.parent_id,
    createdAt: row.created_at,
    errorMessage: row.error_message,
  };
}

export async function listOwnGenerations(
  limit = 30,
): Promise<AiGenerationSummary[]> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("ai_generations")
    .select(
      "id, kind, prompt, title, concept, symbolism, visual_prompt, suggested_styles, suggested_placements, status, provider, model, parent_id, created_at, error_message",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to list AI history: ${error.message}`);
  }

  return (data ?? []).map(mapGeneration);
}

export async function getOwnGeneration(
  id: string,
): Promise<AiGenerationSummary | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("ai_generations")
    .select(
      "id, kind, prompt, title, concept, symbolism, visual_prompt, suggested_styles, suggested_placements, status, provider, model, parent_id, created_at, error_message",
    )
    .eq("user_id", user.id)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load AI generation: ${error.message}`);
  }

  return data ? mapGeneration(data) : null;
}
