import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ConceptForm } from "@/features/ai-studio/components/concept-form";
import { ImageGenerationPanel } from "@/features/ai-studio/components/image-generation-panel";
import { getOwnGeneration } from "@/features/ai-studio/server/queries";
import { AddToCollectionButton } from "@/features/collections/components/add-to-collection-button";
import { listOwnCollections } from "@/features/collections/server/queries";
import { isImageGenerationEnabled } from "@/lib/ai";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type GenerationPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: GenerationPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Concept ${id.slice(0, 8)}` };
}

async function GenerationContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const generation = await getOwnGeneration(id);

  if (!generation) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const collections = user ? await listOwnCollections() : [];

  const publicClient = createPublicSupabaseClient();
  const { data: tattoos } = await publicClient
    .from("tattoos")
    .select("id, title")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/studio/history">← History</Link>
        </Button>
        <p className="text-meta">
          {generation.kind} · {generation.provider}
          {generation.model ? ` · ${generation.model}` : ""}
        </p>
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">
          {generation.title ?? "Untitled concept"}
        </h1>
        {generation.status === "failed" ? (
          <p className="text-sm text-destructive" role="alert">
            {generation.errorMessage ?? "Generation failed."}
          </p>
        ) : null}
      </div>

      <dl className="grid gap-8">
        <div>
          <dt className="text-meta">Prompt</dt>
          <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {generation.prompt}
          </dd>
        </div>
        {generation.concept ? (
          <div>
            <dt className="text-meta">Concept</dt>
            <dd className="mt-2 whitespace-pre-wrap text-base leading-relaxed">
              {generation.concept}
            </dd>
          </div>
        ) : null}
        {generation.symbolism ? (
          <div>
            <dt className="text-meta">Symbolism</dt>
            <dd className="mt-2 whitespace-pre-wrap text-base leading-relaxed">
              {generation.symbolism}
            </dd>
          </div>
        ) : null}
        {generation.visualPrompt ? (
          <div>
            <dt className="text-meta">Visual prompt</dt>
            <dd className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {generation.visualPrompt}
            </dd>
          </div>
        ) : null}
      </dl>

      {(generation.suggestedStyles.length > 0 ||
        generation.suggestedPlacements.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-meta">Suggested styles</p>
            <p className="mt-2 text-sm">
              {generation.suggestedStyles.join(", ") || "—"}
            </p>
          </div>
          <div>
            <p className="text-meta">Suggested placements</p>
            <p className="mt-2 text-sm">
              {generation.suggestedPlacements.join(", ") || "—"}
            </p>
          </div>
        </div>
      )}

      <AddToCollectionButton
        isAuthenticated={Boolean(user)}
        collections={collections}
        aiGenerationId={generation.id}
      />

      <section className="space-y-4 border-t border-border/70 pt-8">
        <h2 className="font-heading text-2xl text-ink">Refine</h2>
        <ConceptForm
          isAuthenticated={Boolean(user)}
          parentId={generation.id}
          kind="refine"
          submitLabel="Refine concept"
          defaultPrompt="Make the composition quieter and more first-tattoo friendly."
        />
      </section>

      <ImageGenerationPanel
        generationId={generation.id}
        imageGenerationEnabled={isImageGenerationEnabled()}
        licensedTattooOptions={(tattoos ?? []).map((tattoo) => ({
          id: tattoo.id,
          title: tattoo.title,
        }))}
      />
    </div>
  );
}

export default function GenerationDetailPage({ params }: GenerationPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <Suspense
        fallback={
          <div className="text-muted-foreground py-20 text-center text-sm">
            Loading concept…
          </div>
        }
      >
        <GenerationContent params={params} />
      </Suspense>
    </div>
  );
}
