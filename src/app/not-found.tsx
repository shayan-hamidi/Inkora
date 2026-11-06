import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
      <p className="text-meta">404</p>
      <h1 className="font-heading text-4xl text-ink sm:text-5xl">
        Page not found.
      </h1>
      <p className="text-muted-foreground">
        The page you requested does not exist, or has not been built yet.
      </p>
      <Button asChild>
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
