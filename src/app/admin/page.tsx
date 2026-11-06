import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { getAiUsageMetrics } from "@/features/admin/server/queries";
import { getCurrentAdminProfile } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Admin",
};

export const instant = false;

async function AdminOverview() {
  await connection();
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return null;
  }

  const metrics = await getAiUsageMetrics();

  return (
    <section className="space-y-6">
      <h2 className="font-heading text-2xl text-ink">AI usage overview</h2>
      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-meta">Total generations</dt>
          <dd className="mt-2 font-heading text-3xl text-ink">{metrics.total}</dd>
        </div>
        <div>
          <dt className="text-meta">Last 24 hours</dt>
          <dd className="mt-2 font-heading text-3xl text-ink">
            {metrics.lastDay}
          </dd>
        </div>
        <div>
          <dt className="text-meta">Last 7 days</dt>
          <dd className="mt-2 font-heading text-3xl text-ink">
            {metrics.lastWeek}
          </dd>
        </div>
        <div>
          <dt className="text-meta">Failed</dt>
          <dd className="mt-2 font-heading text-3xl text-ink">
            {metrics.failed}
          </dd>
        </div>
      </dl>
      <p className="text-sm text-muted-foreground">
        Metrics are read-only counts from `ai_generations`. API keys never appear
        here.
      </p>
    </section>
  );
}

export default function AdminHomePage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground text-sm">Loading metrics…</div>
      }
    >
      <AdminOverview />
    </Suspense>
  );
}
