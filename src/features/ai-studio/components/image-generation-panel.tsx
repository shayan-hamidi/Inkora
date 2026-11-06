"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  attachLicensedReferenceAction,
  requestImageGenerationAction,
} from "@/features/ai-studio/server/actions";

type ImageGenerationPanelProps = {
  generationId: string;
  licensedTattooOptions: Array<{ id: string; title: string }>;
  imageGenerationEnabled: boolean;
};

export function ImageGenerationPanel({
  generationId,
  licensedTattooOptions,
  imageGenerationEnabled,
}: ImageGenerationPanelProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [tattooId, setTattooId] = useState(licensedTattooOptions[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <section className="border-border/70 space-y-4 border-t pt-8">
      <div className="space-y-2">
        <p className="text-meta">Visual references</p>
        <h2 className="font-heading text-2xl text-ink">Images</h2>
        <p className="text-sm text-muted-foreground">
          AI image generation is optional. Licensed catalog references are never
          labeled as AI-generated.
        </p>
      </div>

      {!imageGenerationEnabled ? (
        <div className="border-border/70 rounded-sm border border-dashed px-4 py-5 text-sm text-muted-foreground">
          AI image generation is unavailable on the free path right now (Hugging
          Face Inference Providers has no free credits; ZeroGPU Spaces are not
          reliable enough for core INKORA). Core studio text features still work.
        </div>
      ) : (
        <Button
          type="button"
          disabled={isPending}
          onClick={() => {
            setMessage(null);
            startTransition(async () => {
              const result = await requestImageGenerationAction(generationId);
              setMessage(result.message ?? null);
            });
          }}
        >
          Generate AI image
        </Button>
      )}

      {licensedTattooOptions.length > 0 ? (
        <div className="flex flex-wrap items-end gap-2">
          <div className="space-y-2">
            <label htmlFor="licensed-ref" className="text-sm font-medium">
              Attach licensed catalog reference
            </label>
            <select
              id="licensed-ref"
              value={tattooId}
              onChange={(event) => setTattooId(event.target.value)}
              className="border-input bg-background h-8 min-w-56 rounded-lg border px-2.5 text-sm"
            >
              {licensedTattooOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.title}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={isPending || !tattooId}
            onClick={() => {
              setMessage(null);
              startTransition(async () => {
                const result = await attachLicensedReferenceAction(
                  generationId,
                  tattooId,
                );
                setMessage(result.message ?? null);
              });
            }}
          >
            Attach reference
          </Button>
        </div>
      ) : null}

      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
