import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Join",
};

export default function RegisterPlaceholderPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-20 sm:px-6">
      <p className="text-meta">Coming in Phase 10</p>
      <h1 className="font-heading text-4xl text-ink">Create an account</h1>
      <p className="text-muted-foreground">
        Registration will be available after Supabase Auth is configured.
      </p>
      <Button variant="outline" asChild className="w-fit">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
