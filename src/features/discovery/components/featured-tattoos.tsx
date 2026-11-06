import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TattooGrid } from "@/features/tattoos/components/tattoo-grid";
import type { TattooCard } from "@/features/tattoos/types";

type FeaturedTattoosProps = {
  tattoos: TattooCard[];
};

export function FeaturedTattoos({ tattoos }: FeaturedTattoosProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="text-meta">Featured</p>
          <h2 className="font-heading text-4xl text-ink sm:text-5xl">
            Designs worth sitting with
          </h2>
        </div>
        <Button variant="outline" asChild>
          <Link href="/tattoos">View gallery</Link>
        </Button>
      </div>

      {tattoos.length === 0 ? (
        <div className="border-border/70 rounded-sm border border-dashed px-6 py-14 text-center">
          <p className="font-heading text-2xl text-ink">No featured designs yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Seed or publish featured tattoos to populate this section.
          </p>
        </div>
      ) : (
        <TattooGrid tattoos={tattoos} />
      )}
    </section>
  );
}
