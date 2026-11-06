import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CollectionForm } from "@/features/collections/components/collection-form";
import {
  deleteCollectionAction,
  removeCollectionItemAction,
} from "@/features/collections/server/actions";
import { getOwnCollectionBySlug } from "@/features/collections/server/queries";

type CollectionDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CollectionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Collection · ${slug}` };
}

async function CollectionDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const collection = await getOwnCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Button variant="ghost" asChild>
            <Link href="/collections">← All collections</Link>
          </Button>
          <h1 className="font-heading text-4xl text-ink sm:text-5xl">
            {collection.name}
          </h1>
          <p className="text-meta">
            {collection.visibility} · {collection.itemCount} item
            {collection.itemCount === 1 ? "" : "s"}
          </p>
          {collection.description ? (
            <p className="max-w-2xl text-muted-foreground">
              {collection.description}
            </p>
          ) : null}
        </div>
        <form
          action={async () => {
            "use server";
            await deleteCollectionAction(collection.id);
          }}
        >
          <Button type="submit" variant="outline">
            Delete collection
          </Button>
        </form>
      </div>

      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <h2 className="font-heading text-2xl text-ink">Edit</h2>
          <CollectionForm collection={collection} />
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-2xl text-ink">Items</h2>
          {collection.items.length === 0 ? (
            <div className="border-border/70 rounded-sm border border-dashed px-6 py-12 text-center">
              <p className="font-heading text-xl text-ink">Empty board</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Add tattoos from detail pages or AI concepts from Studio.
              </p>
              <Button asChild className="mt-6">
                <Link href="/tattoos">Browse tattoos</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-border/70 divide-y border-y border-border/70">
              {collection.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div className="space-y-1">
                    {item.tattoo ? (
                      <Link
                        href={`/tattoos/${item.tattoo.slug}`}
                        className="font-heading text-xl text-ink hover:underline"
                      >
                        {item.tattoo.title}
                      </Link>
                    ) : null}
                    {item.aiGeneration ? (
                      <Link
                        href={`/studio/history/${item.aiGeneration.id}`}
                        className="font-heading text-xl text-ink hover:underline"
                      >
                        {item.aiGeneration.title ?? "AI concept"}
                      </Link>
                    ) : null}
                    {item.notes ? (
                      <p className="text-sm text-muted-foreground">{item.notes}</p>
                    ) : null}
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await removeCollectionItemAction(item.id, collection.slug);
                    }}
                  >
                    <Button type="submit" variant="ghost">
                      Remove
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Suspense
        fallback={
          <div className="text-muted-foreground py-20 text-center text-sm">
            Loading collection…
          </div>
        }
      >
        <CollectionDetailContent params={params} />
      </Suspense>
    </div>
  );
}
