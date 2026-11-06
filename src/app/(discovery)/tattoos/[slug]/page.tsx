import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { AddToCollectionButton } from "@/features/collections/components/add-to-collection-button";
import { listOwnCollections } from "@/features/collections/server/queries";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { isTattooFavorited } from "@/features/favorites/server/queries";
import { TattooGrid } from "@/features/tattoos/components/tattoo-grid";
import { TattooImage } from "@/features/tattoos/components/tattoo-image";
import {
  getRelatedTattoos,
  getTattooBySlug,
} from "@/features/tattoos/server/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type TattooDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: TattooDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tattoo = await getTattooBySlug(slug);

  if (!tattoo) {
    return { title: "Tattoo not found" };
  }

  return {
    title: tattoo.title,
    description: tattoo.description ?? `Tattoo inspiration: ${tattoo.title}`,
    openGraph: {
      title: `${tattoo.title} · INKORA`,
      description: tattoo.description ?? undefined,
    },
  };
}

async function TattooDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const tattoo = await getTattooBySlug(slug);

  if (!tattoo) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = Boolean(user);

  const [related, favorited, collections] = await Promise.all([
    getRelatedTattoos(tattoo, 3),
    isAuthenticated ? isTattooFavorited(tattoo.id) : Promise.resolve(false),
    isAuthenticated ? listOwnCollections() : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/tattoos">← Back to gallery</Link>
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="bg-paper aspect-[4/5] overflow-hidden">
          <TattooImage
            src={tattoo.imagePath}
            alt={tattoo.imageAlt ?? tattoo.title}
            priority
            width={tattoo.imageWidth}
            height={tattoo.imageHeight}
          />
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-meta">
              {tattoo.category?.name ?? "Tattoo"}
              {tattoo.isDemo ? " · Demo" : ""}
            </p>
            <h1 className="font-heading text-4xl text-ink sm:text-5xl">
              {tattoo.title}
            </h1>
            {tattoo.description ? (
              <p className="text-lg leading-relaxed text-muted-foreground">
                {tattoo.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <FavoriteButton
              tattooId={tattoo.id}
              initialFavorited={favorited}
              isAuthenticated={isAuthenticated}
            />
          </div>

          <AddToCollectionButton
            isAuthenticated={isAuthenticated}
            collections={collections}
            tattooId={tattoo.id}
          />

          <dl className="border-border/70 grid gap-4 border-y py-6 sm:grid-cols-2">
            <div>
              <dt className="text-meta">Styles</dt>
              <dd className="mt-2 text-sm">
                {tattoo.styles.map((item) => item.name).join(", ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-meta">Placements</dt>
              <dd className="mt-2 text-sm">
                {tattoo.placements.map((item) => item.name).join(", ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-meta">Tags</dt>
              <dd className="mt-2 text-sm">
                {tattoo.tags.map((item) => item.name).join(", ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-meta">License</dt>
              <dd className="mt-2 text-sm">{tattoo.license ?? "—"}</dd>
            </div>
          </dl>

          <div className="space-y-2 text-sm text-muted-foreground">
            {tattoo.source ? <p>Source: {tattoo.source}</p> : null}
            {tattoo.attribution ? <p>{tattoo.attribution}</p> : null}
          </div>
        </div>
      </div>

      <section className="mt-20 space-y-8">
        <div className="space-y-2">
          <p className="text-meta">Related</p>
          <h2 className="font-heading text-3xl text-ink">More in this mood</h2>
        </div>
        {related.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No related designs yet.
          </p>
        ) : (
          <TattooGrid tattoos={related} />
        )}
      </section>
    </div>
  );
}

export default function TattooDetailPage({ params }: TattooDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground mx-auto max-w-6xl px-4 py-20 text-sm sm:px-6">
          Loading tattoo…
        </div>
      }
    >
      <TattooDetailContent params={params} />
    </Suspense>
  );
}
