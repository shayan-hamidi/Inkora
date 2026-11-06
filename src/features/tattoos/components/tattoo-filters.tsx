"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TaxonomyRef } from "@/features/tattoos/types";

type TattooFiltersProps = {
  categories: TaxonomyRef[];
  styles: TaxonomyRef[];
  placements: TaxonomyRef[];
  tags: TaxonomyRef[];
};

type FilterState = {
  q: string;
  category: string;
  style: string;
  placement: string;
  tag: string;
};

function SelectField({
  id,
  label,
  name,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  name: keyof Omit<FilterState, "q">;
  value: string;
  options: TaxonomyRef[];
  onChange: (name: keyof Omit<FilterState, "q">, value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="border-input bg-background h-8 w-full rounded-lg border px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.id} value={option.slug}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function toSearchString(state: FilterState) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(state)) {
    if (value) {
      params.set(key, value);
    }
  }

  return params.toString();
}

export function TattooFilters({
  categories,
  styles,
  placements,
  tags,
}: TattooFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current: FilterState = {
    q: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    style: searchParams.get("style") ?? "",
    placement: searchParams.get("placement") ?? "",
    tag: searchParams.get("tag") ?? "",
  };

  function navigate(next: FilterState) {
    const query = toSearchString(next);
    startTransition(() => {
      router.push(query ? `/tattoos?${query}` : "/tattoos");
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") ?? "").trim();
    navigate({ ...current, q: query });
  }

  function onFilterChange(
    name: keyof Omit<FilterState, "q">,
    value: string,
  ) {
    navigate({ ...current, [name]: value });
  }

  function clearFilters() {
    navigate({
      q: "",
      category: "",
      style: "",
      placement: "",
      tag: "",
    });
  }

  return (
    <form
      method="get"
      action="/tattoos"
      onSubmit={onSubmit}
      className="border-border/70 space-y-5 border-b pb-8"
      aria-busy={isPending}
    >
      <div className="space-y-2">
        <Label htmlFor="tattoo-search">Search</Label>
        <div className="flex gap-2">
          <Input
            id="tattoo-search"
            name="q"
            defaultValue={current.q}
            placeholder="moon, floral, serpent…"
          />
          <Button type="submit">Search</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SelectField
          id="filter-category"
          label="Category"
          name="category"
          value={current.category}
          options={categories}
          onChange={onFilterChange}
        />
        <SelectField
          id="filter-style"
          label="Style"
          name="style"
          value={current.style}
          options={styles}
          onChange={onFilterChange}
        />
        <SelectField
          id="filter-placement"
          label="Placement"
          name="placement"
          value={current.placement}
          options={placements}
          onChange={onFilterChange}
        />
        <SelectField
          id="filter-tag"
          label="Tag"
          name="tag"
          value={current.tag}
          options={tags}
          onChange={onFilterChange}
        />
      </div>

      <Button type="button" variant="ghost" onClick={clearFilters}>
        Clear filters
      </Button>
    </form>
  );
}
