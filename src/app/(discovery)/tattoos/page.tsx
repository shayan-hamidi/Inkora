import type { Metadata } from "next";
import { Suspense } from "react";
import { GalleryPagination } from "@/features/tattoos/components/gallery-pagination";
import { TattooFilters } from "@/features/tattoos/components/tattoo-filters";
import { TattooGrid } from "@/features/tattoos/components/tattoo-grid";
import { parseTattooSearchParams } from "@/features/tattoos/schemas";
import {
  listCategories,
  listPlacements,
  listPublishedTattoos,
  listStyles,
  listTags,
} from "@/features/tattoos/server/queries";

export const metadata: Metadata = {
  title: "Discover",
  description: "Browse and filter tattoo inspiration by style, placement, and mood.",
};

type TattoosPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function GalleryContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = parseTattooSearchParams(resolvedSearchParams);

  const [result, categories, styles, placements, tags] = await Promise.all([
    listPublishedTattoos({
      query: filters.q,
      category: filters.category,
      style: filters.style,
      placement: filters.placement,
      tag: filters.tag,
      page: filters.page,
      pageSize: filters.pageSize,
    }),
    listCategories(),
    listStyles(),
    listPlacements(),
    listTags(),
  ]);

  return (
    <>
      <TattooFilters
        categories={categories}
        styles={styles}
        placements={placements}
        tags={tags}
      />

      <div className="mt-10">
        <TattooGrid tattoos={result.items} />
        <GalleryPagination
          page={result.page}
          totalPages={result.totalPages}
          hasNextPage={result.hasNextPage}
          hasPreviousPage={result.hasPreviousPage}
          searchParams={{
            q: filters.q,
            category: filters.category,
            style: filters.style,
            placement: filters.placement,
            tag: filters.tag,
          }}
        />
      </div>
    </>
  );
}

export default function TattoosPage({ searchParams }: TattoosPageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 max-w-2xl space-y-3">
        <p className="text-meta">Gallery</p>
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">
          Discover tattoos
        </h1>
        <p className="text-muted-foreground">
          Filter by style, placement, and theme. Every demo image is synthetic
          INKORA artwork — not scraped portfolios.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-muted-foreground py-20 text-center text-sm">
            Loading gallery…
          </div>
        }
      >
        <GalleryContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
