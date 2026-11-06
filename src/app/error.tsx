"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
      <p className="text-meta">Something went wrong</p>
      <h1 className="font-heading text-4xl text-ink sm:text-5xl">
        This page could not be shown.
      </h1>
      <p className="text-muted-foreground">
        An unexpected error occurred. You can try again, or return home.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
