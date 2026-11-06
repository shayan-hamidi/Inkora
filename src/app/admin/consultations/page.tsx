import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { listAdminConsultations } from "@/features/admin/server/queries";
import { getCurrentAdminProfile } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Admin consultations",
};

async function ConsultationsContent() {
  await connection();
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return null;
  }

  const rows = await listAdminConsultations();

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No consultation requests stored yet.
      </p>
    );
  }

  return (
    <ul className="divide-border/70 divide-y border-y border-border/70">
      {rows.map((row) => {
        const artist = Array.isArray(row.artist_profiles)
          ? row.artist_profiles[0]
          : row.artist_profiles;
        return (
          <li key={row.id} className="space-y-2 py-5">
            <p className="font-heading text-xl text-ink">
              {row.requester_name} → {artist?.display_name ?? "Artist"}
            </p>
            <p className="text-meta">
              {row.status} · {row.requester_email}
              {row.preferred_placement
                ? ` · ${row.preferred_placement}`
                : ""}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {row.message}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export default function AdminConsultationsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Store-only submissions. No messaging thread is created.
      </p>
      <Suspense
        fallback={
          <div className="text-muted-foreground text-sm">
            Loading consultations…
          </div>
        }
      >
        <ConsultationsContent />
      </Suspense>
    </div>
  );
}
