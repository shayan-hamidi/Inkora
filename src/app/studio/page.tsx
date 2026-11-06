import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ConceptForm } from "@/features/ai-studio/components/concept-form";
import { listOwnGenerations } from "@/features/ai-studio/server/queries";
import { AI_RATE_LIMITS } from "@/lib/ai";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "AI Studio",
  description: "Generate personalized tattoo concepts with Gemini free tier.",
};

async function StudioContent() {
  await connection();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = Boolean(user);
  const recent = isAuthenticated ? await listOwnGenerations(5) : [];

  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">
        <ConceptForm isAuthenticated={isAuthenticated} />
      </section>

      <aside className="space-y-6">
        <div className="space-y-2">
          <p className="text-meta">Limits</p>
          <p className="text-sm text-muted-foreground">
            App caps: {AI_RATE_LIMITS.perMinute}/minute and{" "}
            {AI_RATE_LIMITS.perDay}/day per user, counted in Postgres. Gemini
            project quotas may be stricter — 429 surfaces as “try later”.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-2xl text-ink">Recent</h2>
            {isAuthenticated ? (
              <Button variant="ghost" asChild>
                <Link href="/studio/history">Full history</Link>
              </Button>
            ) : null}
          </div>
          {!isAuthenticated ? (
            <p className="text-sm text-muted-foreground">
              Sign in to keep a private history of concepts.
            </p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No generations yet. Your first concept will appear here.
            </p>
          ) : (
            <ul className="divide-border/70 divide-y border-y border-border/70">
              {recent.map((item) => (
                <li key={item.id} className="py-3">
                  <Link
                    href={`/studio/history/${item.id}`}
                    className="font-heading text-lg text-ink hover:underline"
                  >
                    {item.title ?? item.prompt.slice(0, 48)}
                  </Link>
                  <p className="text-meta">{item.kind}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function StudioPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 max-w-2xl space-y-3">
        <p className="text-meta">AI Studio</p>
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">
          Shape a concept
        </h1>
        <p className="text-muted-foreground">
          Text concepts via Gemini behind a provider interface. Invalid model
          JSON is never trusted. Image generation stays optional and off by
          default.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-muted-foreground py-20 text-center text-sm">
            Loading studio…
          </div>
        }
      >
        <StudioContent />
      </Suspense>
    </div>
  );
}
