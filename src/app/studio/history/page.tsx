import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { listOwnGenerations } from "@/features/ai-studio/server/queries";

export const metadata: Metadata = {
  title: "AI history",
};

async function HistoryContent() {
  await connection();
  const generations = await listOwnGenerations(50);

  if (generations.length === 0) {
    return (
      <div className="border-border/70 rounded-sm border border-dashed px-6 py-16 text-center">
        <p className="font-heading text-2xl text-ink">No history yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Generate a concept in Studio to start your private timeline.
        </p>
        <Button asChild className="mt-6">
          <Link href="/studio">Open Studio</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="divide-border/70 divide-y border-y border-border/70">
      {generations.map((item) => (
        <li key={item.id} className="flex items-start justify-between gap-4 py-5">
          <div className="space-y-1">
            <Link
              href={`/studio/history/${item.id}`}
              className="font-heading text-xl text-ink hover:underline"
            >
              {item.title ?? "Untitled concept"}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.concept ?? item.prompt}
            </p>
            <p className="text-meta">
              {item.kind} · {item.status} ·{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/studio/history/${item.id}`}>Open</Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}

export default function StudioHistoryPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 max-w-2xl space-y-3">
        <p className="text-meta">AI Studio</p>
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">History</h1>
        <p className="text-muted-foreground">
          Private to your account via RLS. Failed attempts are stored for
          transparency without trusting invalid model JSON.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-muted-foreground py-20 text-center text-sm">
            Loading history…
          </div>
        }
      >
        <HistoryContent />
      </Suspense>
    </div>
  );
}
