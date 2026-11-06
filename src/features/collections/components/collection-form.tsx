"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCollectionAction,
  updateCollectionAction,
  type CollectionActionState,
} from "@/features/collections/server/actions";
import type { CollectionSummary } from "@/features/collections/types";

const initialState: CollectionActionState = { status: "idle" };

type CollectionFormProps = {
  collection?: Pick<
    CollectionSummary,
    "id" | "name" | "description" | "visibility"
  >;
};

export function CollectionForm({ collection }: CollectionFormProps) {
  const action = collection ? updateCollectionAction : createCollectionAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {collection ? <input type="hidden" name="id" value={collection.id} /> : null}

      <div className="space-y-2">
        <Label htmlFor="collection-name">Name</Label>
        <Input
          id="collection-name"
          name="name"
          required
          maxLength={80}
          defaultValue={collection?.name ?? ""}
          placeholder="First tattoo ideas"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="collection-description">Description</Label>
        <textarea
          id="collection-description"
          name="description"
          rows={3}
          maxLength={500}
          defaultValue={collection?.description ?? ""}
          className="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="Optional notes about this board"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="collection-visibility">Visibility</Label>
        <select
          id="collection-visibility"
          name="visibility"
          defaultValue={collection?.visibility ?? "private"}
          className="border-input bg-background h-8 w-full rounded-lg border px-2.5 text-sm"
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>

      {state.status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" ? (
        <p className="text-sm text-muted-foreground" role="status">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {collection ? "Save changes" : "Create collection"}
      </Button>
    </form>
  );
}
