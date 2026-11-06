import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Sign in",
};

export default function LoginPlaceholderPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-20 sm:px-6">
      <p className="text-meta">Coming in Phase 10</p>
      <h1 className="font-heading text-4xl text-ink">Sign in</h1>
      <p className="text-muted-foreground">
        Authentication UI will connect to Supabase Auth in Phase 10.
      </p>
      <Button variant="outline" asChild className="w-fit">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
