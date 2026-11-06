import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { FeaturedTattoos } from "@/features/discovery/components/featured-tattoos";
import { InkOrbLazy } from "@/features/discovery/components/ink-orb-lazy";
import { LandingScrollStory } from "@/features/discovery/components/landing-scroll-story";
import { getFeaturedTattoos } from "@/features/tattoos/server/queries";
import type { TattooCard } from "@/features/tattoos/types";

export const metadata: Metadata = {
  title: "INKORA",
  description:
    "Discover your next tattoo. Give your ideas meaning. Browse styles, placements, and AI-assisted concepts.",
  openGraph: {
    title: "INKORA",
    description: "Discover your next tattoo. Give your ideas meaning.",
    type: "website",
  },
};

async function FeaturedSection() {
  let featured: TattooCard[] = [];

  try {
    featured = await getFeaturedTattoos(3);
  } catch {
    featured = [];
  }

  return <FeaturedTattoos tattoos={featured} />;
}

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--paper)_80%,transparent),_transparent_55%)]"
        />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
          <div className="space-y-8">
            <p className="text-meta">Tattoo discovery platform</p>
            <div className="max-w-2xl space-y-5">
              <h1 className="font-heading text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
                Discover your next tattoo.
                <span className="mt-2 block text-burgundy">
                  Give your ideas meaning.
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                A premium editorial space for tattoo inspiration — filter by
                style and placement, study the details, and shape concepts with
                care.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/tattoos">Explore designs</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/studio">Open AI Studio</Link>
              </Button>
            </div>
          </div>

          <InkOrbLazy />
        </div>
      </section>

      <LandingScrollStory />
      <Suspense
        fallback={
          <div className="text-muted-foreground mx-auto max-w-6xl px-4 py-16 text-sm sm:px-6">
            Loading featured designs…
          </div>
        }
      >
        <FeaturedSection />
      </Suspense>
    </div>
  );
}
