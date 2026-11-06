"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAdminTaxonomyAction,
  type AdminActionState,
} from "@/features/admin/server/actions";

const initialState: AdminActionState = { status: "idle" };

export function TaxonomyAdminForm() {
  const [state, formAction, pending] = useActionState(
    createAdminTaxonomyAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="table">Type</Label>
          <select
            id="table"
            name="table"
            className="border-input bg-background h-8 w-full rounded-lg border px-2.5 text-sm"
            defaultValue="styles"
          >
            <option value="categories">Category</option>
            <option value="styles">Style</option>
            <option value="placements">Placement</option>
            <option value="tags">Tag</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" placeholder="optional" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" />
        </div>
      </div>

      {state.status === "error" || state.status === "forbidden" ? (
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
        Add taxonomy item
      </Button>
    </form>
  );
}
