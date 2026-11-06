import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Studio",
};

export default function StudioPlaceholderPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-20 sm:px-6">
      <p className="text-meta">Coming in Phase 13</p>
      <h1 className="font-heading text-4xl text-ink sm:text-5xl">AI Studio</h1>
      <p className="text-muted-foreground">
        Personalized tattoo concept generation will be available here after
        authentication and the Gemini text provider are wired.
      </p>
      <Button variant="outline" asChild className="w-fit">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
