import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CollectionForm } from "@/features/collections/components/collection-form";
import { listOwnCollections } from "@/features/collections/server/queries";

export const metadata: Metadata = {
  title: "Collections",
  description: "Organize tattoos and AI concepts into private or public boards.",
};

async function CollectionsContent() {
  await connection();
  const collections = await listOwnCollections();

  return (
    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="space-y-4">
        <h2 className="font-heading text-2xl text-ink">New collection</h2>
        <CollectionForm />
      </section>

      <section className="space-y-6">
        <h2 className="font-heading text-2xl text-ink">Your boards</h2>
        {collections.length === 0 ? (
          <div className="border-border/70 rounded-sm border border-dashed px-6 py-12 text-center">
            <p className="font-heading text-xl text-ink">No collections yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a private board to start gathering ideas.
            </p>
          </div>
        ) : (
          <ul className="divide-border/70 divide-y border-y border-border/70">
            {collections.map((collection) => (
              <li key={collection.id} className="flex items-center justify-between gap-4 py-4">
                <div className="space-y-1">
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="font-heading text-xl text-ink hover:underline"
                  >
                    {collection.name}
                  </Link>
                  <p className="text-meta">
                    {collection.visibility} · {collection.itemCount} item
                    {collection.itemCount === 1 ? "" : "s"}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/collections/${collection.slug}`}>Open</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 max-w-2xl space-y-3">
        <p className="text-meta">Dashboard</p>
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">
          Collections
        </h1>
        <p className="text-muted-foreground">
          Private by default. Public boards are readable by others; only you can
          edit.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-muted-foreground py-20 text-center text-sm">
            Loading collections…
          </div>
        }
      >
        <CollectionsContent />
      </Suspense>
    </div>
  );
}
