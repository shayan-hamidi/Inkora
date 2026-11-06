"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  generateConceptAction,
  type AiActionState,
} from "@/features/ai-studio/server/actions";

const initialState: AiActionState = { status: "idle" };

type ConceptFormProps = {
  isAuthenticated: boolean;
  parentId?: string;
  kind?: "concept" | "refine" | "symbolism" | "visual_prompt";
  submitLabel?: string;
  defaultPrompt?: string;
};

export function ConceptForm({
  isAuthenticated,
  parentId,
  kind = "concept",
  submitLabel = "Generate concept",
  defaultPrompt = "",
}: ConceptFormProps) {
  const [state, formAction, pending] = useActionState(
    generateConceptAction,
    initialState,
  );

  if (!isAuthenticated) {
    return (
      <div className="border-border/70 space-y-4 rounded-sm border border-dashed px-6 py-10 text-center">
        <p className="font-heading text-2xl text-ink">Sign in to generate</p>
        <p className="text-sm text-muted-foreground">
          AI Studio uses your account for private history and rate limits.
        </p>
        <Button asChild>
          <Link href="/login?next=/studio">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="kind" value={kind} />
      {parentId ? <input type="hidden" name="parentId" value={parentId} /> : null}

      <div className="space-y-2">
        <Label htmlFor="ai-prompt">
          {kind === "refine" ? "Refinement direction" : "Describe your idea"}
        </Label>
        <textarea
          id="ai-prompt"
          name="prompt"
          required
          minLength={8}
          maxLength={2000}
          rows={5}
          defaultValue={defaultPrompt}
          placeholder="A quiet crescent moon with sparse marks for a first rib tattoo…"
          className="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Free-tier disclosure: prompts and outputs may be processed by Google’s
        Gemini API under Google’s generative AI terms. Do not submit personal
        data you are not comfortable sharing with the provider. App rate limits
        apply.
      </p>

      {state.status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Generating…" : submitLabel}
      </Button>
    </form>
  );
}
