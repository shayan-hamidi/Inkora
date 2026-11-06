import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { listFavoriteTattoos } from "@/features/favorites/server/queries";
import { TattooGrid } from "@/features/tattoos/components/tattoo-grid";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Tattoos you have saved for later.",
};

async function FavoritesContent() {
  await connection();
  const tattoos = await listFavoriteTattoos();

  if (tattoos.length === 0) {
    return (
      <div className="border-border/70 rounded-sm border border-dashed px-6 py-16 text-center">
        <p className="font-heading text-2xl text-ink">No favorites yet.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Save designs from the gallery while you explore.
        </p>
        <Button asChild className="mt-6">
          <Link href="/tattoos">Browse tattoos</Link>
        </Button>
      </div>
    );
  }

  return <TattooGrid tattoos={tattoos} />;
}

export default function FavoritesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 max-w-2xl space-y-3">
        <p className="text-meta">Dashboard</p>
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">Favorites</h1>
        <p className="text-muted-foreground">
          Private saves backed by row-level security — only you can mutate them.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-muted-foreground py-20 text-center text-sm">
            Loading favorites…
          </div>
        }
      >
        <FavoritesContent />
      </Suspense>
    </div>
  );
}
