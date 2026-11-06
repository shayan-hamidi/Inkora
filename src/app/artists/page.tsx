import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listPublishedArtists } from "@/features/artists/server/queries";

export const metadata: Metadata = {
  title: "Artists",
  description: "Discover demo artist profiles and request a stored consultation.",
};

async function ArtistsDirectory() {
  const artists = await listPublishedArtists();

  if (artists.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No published artists yet.
      </p>
    );
  }

  return (
    <ul className="divide-border/70 divide-y border-y border-border/70">
      {artists.map((artist) => (
        <li
          key={artist.id}
          className="flex flex-col gap-3 py-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl space-y-2">
            <p className="text-meta">
              {[artist.city, artist.studioName].filter(Boolean).join(" · ") ||
                "Artist"}
            </p>
            <Link
              href={`/artists/${artist.slug}`}
              className="font-heading text-3xl text-ink hover:underline sm:text-4xl"
            >
              {artist.displayName}
            </Link>
            {artist.stylesSummary ? (
              <p className="text-sm text-muted-foreground">
                {artist.stylesSummary}
              </p>
            ) : null}
          </div>
          <Link
            href={`/artists/${artist.slug}`}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            View profile
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function ArtistsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-12 max-w-2xl space-y-3">
        <p className="text-meta">Directory</p>
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">Artists</h1>
        <p className="text-muted-foreground">
          Editorial profiles for discovery. Consultation forms store requests
          only — there is no messaging product here.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-muted-foreground py-16 text-sm">
            Loading artists…
          </div>
        }
      >
        <ArtistsDirectory />
      </Suspense>
    </div>
  );
}
