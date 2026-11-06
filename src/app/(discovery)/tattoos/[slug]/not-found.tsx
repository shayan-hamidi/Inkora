import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TattooNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
      <p className="text-meta">Missing design</p>
      <h1 className="font-heading text-4xl text-ink sm:text-5xl">
        Tattoo not found
      </h1>
      <p className="text-muted-foreground">
        This design is unpublished, removed, or the link is incorrect.
      </p>
      <Button asChild>
        <Link href="/tattoos">Browse gallery</Link>
      </Button>
    </div>
  );
}
