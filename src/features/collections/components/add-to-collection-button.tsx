"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { addCollectionItemAction } from "@/features/collections/server/actions";
import type { CollectionSummary } from "@/features/collections/types";

type AddToCollectionButtonProps = {
  isAuthenticated: boolean;
  collections: CollectionSummary[];
  tattooId?: string;
  aiGenerationId?: string;
};

export function AddToCollectionButton({
  isAuthenticated,
  collections,
  tattooId,
  aiGenerationId,
}: AddToCollectionButtonProps) {
  const [collectionId, setCollectionId] = useState(collections[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <Button variant="outline" asChild>
        <Link href="/login?next=/collections">Sign in to collect</Link>
      </Button>
    );
  }

  if (collections.length === 0) {
    return (
      <Button variant="outline" asChild>
        <Link href="/collections">Create a collection first</Link>
      </Button>
    );
  }

  function onAdd() {
    setMessage(null);
    startTransition(async () => {
      const result = await addCollectionItemAction({
        collectionId,
        tattooId,
        aiGenerationId,
      });
      setMessage(result.message ?? (result.status === "success" ? "Added." : "Failed."));
    });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="add-collection">Add to collection</Label>
        <div className="flex flex-wrap gap-2">
          <select
            id="add-collection"
            value={collectionId}
            onChange={(event) => setCollectionId(event.target.value)}
            className="border-input bg-background h-8 min-w-48 rounded-lg border px-2.5 text-sm"
          >
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
          <Button type="button" onClick={onAdd} disabled={isPending || !collectionId}>
            Add
          </Button>
        </div>
      </div>
      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
