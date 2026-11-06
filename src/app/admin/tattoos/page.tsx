import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { TattooAdminForm } from "@/features/admin/components/tattoo-admin-form";
import { listAdminTattoos } from "@/features/admin/server/queries";
import { getCurrentAdminProfile } from "@/lib/auth/admin";
import { listCategories } from "@/features/tattoos/server/queries";

export const metadata: Metadata = {
  title: "Admin tattoos",
};

async function AdminTattoosContent() {
  await connection();
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return null;
  }

  const [tattoos, categories] = await Promise.all([
    listAdminTattoos(),
    listCategories(),
  ]);

  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <TattooAdminForm categories={categories} />
      <section className="space-y-4">
        <h2 className="font-heading text-2xl text-ink">Catalog</h2>
        <ul className="divide-border/70 divide-y border-y border-border/70">
          {tattoos.map((tattoo) => (
            <li key={tattoo.id} className="space-y-1 py-4">
              <p className="font-heading text-xl text-ink">{tattoo.title}</p>
              <p className="text-meta">
                {tattoo.slug} · {tattoo.is_published ? "published" : "draft"}
                {tattoo.is_featured ? " · featured" : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                License: {tattoo.license ?? "—"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function AdminTattoosPage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground text-sm">Loading tattoos…</div>
      }
    >
      <AdminTattoosContent />
    </Suspense>
  );
}
