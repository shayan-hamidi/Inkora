"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleFavoriteAction } from "@/features/favorites/server/actions";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  tattooId: string;
  initialFavorited: boolean;
  isAuthenticated: boolean;
  className?: string;
};

export function FavoriteButton({
  tattooId,
  initialFavorited,
  isAuthenticated,
  className,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [optimisticFavorited, setOptimisticFavorited] = useOptimistic(favorited);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <Button variant="outline" asChild className={className}>
        <Link href={`/login?next=/tattoos`}>
          <Heart className="size-4" />
          Sign in to save
        </Link>
      </Button>
    );
  }

  function onToggle() {
    setError(null);
    startTransition(async () => {
      setOptimisticFavorited(!favorited);
      const result = await toggleFavoriteAction(tattooId);

      if (result.status === "unauthenticated") {
        setError(result.message ?? "Sign in required.");
        return;
      }

      if (result.status === "error" || result.favorited === undefined) {
        setError(result.message ?? "Could not update favorite.");
        return;
      }

      setFavorited(result.favorited);
    });
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        type="button"
        variant={optimisticFavorited ? "default" : "outline"}
        onClick={onToggle}
        disabled={isPending}
        aria-pressed={optimisticFavorited}
      >
        <Heart
          className={cn(
            "size-4",
            optimisticFavorited ? "fill-current" : undefined,
          )}
        />
        {optimisticFavorited ? "Saved" : "Save"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
