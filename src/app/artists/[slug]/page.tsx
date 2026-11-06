import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ConsultationForm } from "@/features/artists/components/consultation-form";
import { getArtistBySlug } from "@/features/artists/server/queries";
import { TattooGrid } from "@/features/tattoos/components/tattoo-grid";

type ArtistPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArtistPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) {
    return { title: "Artist not found" };
  }
  return {
    title: artist.displayName,
    description: artist.bio ?? `${artist.displayName} on INKORA`,
  };
}

async function ArtistContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/artists">← Artists</Link>
        </Button>
        <div className="max-w-3xl space-y-4">
          <p className="text-meta">
            {[artist.city, artist.studioName].filter(Boolean).join(" · ") ||
              "Artist"}
          </p>
          <h1 className="font-heading text-4xl text-ink sm:text-6xl">
            {artist.displayName}
          </h1>
          {artist.stylesSummary ? (
            <p className="text-lg text-muted-foreground">
              {artist.stylesSummary}
            </p>
          ) : null}
          {artist.bio ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              {artist.bio}
            </p>
          ) : null}
        </div>
      </div>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-meta">Portfolio</p>
          <h2 className="font-heading text-3xl text-ink">Selected work</h2>
        </div>
        <TattooGrid tattoos={artist.portfolio} />
      </section>

      <section className="border-border/70 max-w-2xl border-t pt-10">
        <ConsultationForm
          artistId={artist.id}
          artistName={artist.displayName}
        />
      </section>
    </div>
  );
}

export default function ArtistDetailPage({ params }: ArtistPageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Suspense
        fallback={
          <div className="text-muted-foreground py-20 text-sm">
            Loading artist…
          </div>
        }
      >
        <ArtistContent params={params} />
      </Suspense>
    </div>
  );
}
