import Link from "next/link";
import { Button } from "@/components/ui/button";

type GalleryPaginationProps = {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchParams: Record<string, string | undefined>;
};

function hrefForPage(
  page: number,
  searchParams: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== "page") {
      params.set(key, value);
    }
  });

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/tattoos?${query}` : "/tattoos";
}

export function GalleryPagination({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  searchParams,
}: GalleryPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="mt-10 flex items-center justify-between gap-4"
      aria-label="Gallery pagination"
    >
      {hasPreviousPage ? (
        <Button variant="outline" asChild>
          <Link href={hrefForPage(page - 1, searchParams)}>Previous</Link>
        </Button>
      ) : (
        <span />
      )}

      <p className="text-meta">
        Page {page} of {totalPages}
      </p>

      {hasNextPage ? (
        <Button variant="outline" asChild>
          <Link href={hrefForPage(page + 1, searchParams)}>Next</Link>
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}
