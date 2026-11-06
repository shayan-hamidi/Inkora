"use client";

import { useActionState, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAdminTattooAction,
  uploadTattooImageAction,
  type AdminActionState,
} from "@/features/admin/server/actions";
import type { TaxonomyRef } from "@/features/tattoos/types";

const initialState: AdminActionState = { status: "idle" };

type TattooAdminFormProps = {
  categories: TaxonomyRef[];
};

export function TattooAdminForm({ categories }: TattooAdminFormProps) {
  const [state, formAction, pending] = useActionState(
    createAdminTattooAction,
    initialState,
  );
  const [imagePath, setImagePath] = useState("/demo/tattoos/minimal-moon.svg");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();

  return (
    <div className="space-y-8">
      <form
        className="border-border/70 space-y-4 border-b pb-8"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formData = new FormData(form);
          startUpload(async () => {
            const result = await uploadTattooImageAction(formData);
            setUploadMessage(result.message ?? null);
            if (result.path) {
              setImagePath(result.path);
            }
          });
        }}
      >
        <h3 className="font-heading text-xl text-ink">Upload image</h3>
        <p className="text-sm text-muted-foreground">
          Source, attribution, and license are required before any upload.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="upload-file">Image file</Label>
            <Input id="upload-file" name="file" type="file" accept="image/*" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload-source">Source</Label>
            <Input id="upload-source" name="source" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload-attribution">Attribution</Label>
            <Input id="upload-attribution" name="attribution" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="upload-license">License</Label>
            <Input id="upload-license" name="license" required />
          </div>
        </div>
        <Button type="submit" variant="outline" disabled={isUploading}>
          {isUploading ? "Uploading…" : "Upload"}
        </Button>
        {uploadMessage ? (
          <p className="text-sm text-muted-foreground" role="status">
            {uploadMessage}
          </p>
        ) : null}
      </form>

      <form action={formAction} className="space-y-4">
        <h3 className="font-heading text-xl text-ink">Create tattoo</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="auto from title if empty" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              className="border-input bg-background h-8 w-full rounded-lg border px-2.5 text-sm"
            >
              <option value="">None</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagePath">Image path / URL</Label>
            <Input
              id="imagePath"
              name="imagePath"
              required
              value={imagePath}
              onChange={(event) => setImagePath(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageAlt">Image alt</Label>
            <Input id="imageAlt" name="imageAlt" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input id="source" name="source" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attribution">Attribution</Label>
            <Input id="attribution" name="attribution" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="license">License</Label>
            <Input id="license" name="license" required />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isDemo" defaultChecked /> Demo
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPublished" /> Published
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" /> Featured
          </label>
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
          Create tattoo
        </Button>
      </form>
    </div>
  );
}
