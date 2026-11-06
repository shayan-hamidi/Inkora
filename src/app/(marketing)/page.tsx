import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--paper)_80%,transparent),_transparent_55%)]"
      />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <p className="text-meta">Tattoo discovery platform</p>

        <div className="max-w-3xl space-y-6">
          <h1 className="font-heading text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
            Discover your next tattoo.
            <span className="mt-2 block text-burgundy">
              Give your ideas meaning.
            </span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            INKORA is a premium space for tattoo inspiration, thoughtful
            filtering, personal collections, and AI-assisted concepts — built
            incrementally as a portfolio-grade full-stack product.
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

        <dl className="mt-8 grid max-w-2xl gap-6 border-t border-border/70 pt-8 sm:grid-cols-3">
          <div>
            <dt className="text-meta">Status</dt>
            <dd className="mt-2 text-sm text-foreground">Foundation ready</dd>
          </div>
          <div>
            <dt className="text-meta">Stack</dt>
            <dd className="mt-2 text-sm text-foreground">
              Next.js · Supabase · Gemini
            </dd>
          </div>
          <div>
            <dt className="text-meta">Next</dt>
            <dd className="mt-2 text-sm text-foreground">
              Auth & catalog (Phase 3+)
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
