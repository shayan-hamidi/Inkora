import Link from "next/link";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import { AdminNav } from "@/features/admin/components/admin-nav";
import { getCurrentAdminProfile } from "@/lib/auth/admin";

export const instant = false;

async function AdminGate({ children }: { children: ReactNode }) {
  await connection();
  const admin = await getCurrentAdminProfile();

  if (!admin) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-24 sm:px-6">
        <p className="text-meta">Admin</p>
        <h1 className="font-heading text-4xl text-ink">Access denied</h1>
        <p className="text-muted-foreground">
          This area is restricted to server-verified admin accounts. Role is
          never trusted from the client.
        </p>
        <Link href="/" className="text-sm underline-offset-4 hover:underline">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 space-y-4 border-b border-border/70 pb-8">
        <p className="text-meta">Admin · {admin.displayName ?? "operator"}</p>
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">
          Catalog control
        </h1>
        <AdminNav />
      </div>
      {children}
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground mx-auto max-w-6xl px-4 py-20 text-sm sm:px-6">
          Checking admin access…
        </div>
      }
    >
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
