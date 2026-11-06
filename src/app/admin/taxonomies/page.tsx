import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { TaxonomyAdminForm } from "@/features/admin/components/taxonomy-admin-form";
import { listAdminTaxonomy } from "@/features/admin/server/queries";
import { getCurrentAdminProfile } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Admin taxonomies",
};

async function AdminTaxonomiesContent() {
  await connection();
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return null;
  }

  const [categories, styles, placements, tags] = await Promise.all([
    listAdminTaxonomy("categories"),
    listAdminTaxonomy("styles"),
    listAdminTaxonomy("placements"),
    listAdminTaxonomy("tags"),
  ]);

  const groups = [
    { label: "Categories", items: categories },
    { label: "Styles", items: styles },
    { label: "Placements", items: placements },
    { label: "Tags", items: tags },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <TaxonomyAdminForm />
      <div className="grid gap-8 sm:grid-cols-2">
        {groups.map((group) => (
          <section key={group.label} className="space-y-3">
            <h2 className="font-heading text-xl text-ink">{group.label}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {group.items.map((item) => (
                <li key={item.id}>
                  {item.name}{" "}
                  <span className="text-meta">({item.slug})</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function AdminTaxonomiesPage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground text-sm">Loading taxonomies…</div>
      }
    >
      <AdminTaxonomiesContent />
    </Suspense>
  );
}
