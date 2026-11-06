import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Artists",
};

export default function ArtistsPlaceholderPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-20 sm:px-6">
      <p className="text-meta">Coming in Phase 17</p>
      <h1 className="font-heading text-4xl text-ink sm:text-5xl">
        Artist discovery
      </h1>
      <p className="text-muted-foreground">
        Artist profiles and portfolios will appear here in a later phase.
      </p>
      <Button variant="outline" asChild className="w-fit">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
