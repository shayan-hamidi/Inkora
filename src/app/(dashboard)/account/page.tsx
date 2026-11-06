import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LogoutButton } from "@/features/authentication/components/logout-button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Account",
};

async function AccountContent() {
  await connection();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-20 sm:px-6">
      <div className="space-y-3">
        <p className="text-meta">Dashboard</p>
        <h1 className="font-heading text-4xl text-ink">Your account</h1>
        <p className="text-muted-foreground">
          Favorites and collections arrive in later phases. For now this
          confirms authentication works end to end.
        </p>
      </div>

      <dl className="border-border/70 space-y-4 border-y py-6">
        <div>
          <dt className="text-meta">Email</dt>
          <dd className="mt-1 text-sm">{user.email}</dd>
        </div>
        <div>
          <dt className="text-meta">Display name</dt>
          <dd className="mt-1 text-sm">{profile?.display_name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-meta">Role</dt>
          <dd className="mt-1 text-sm">{profile?.role ?? "user"}</dd>
        </div>
      </dl>

      <LogoutButton />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground mx-auto max-w-2xl px-4 py-20 text-sm sm:px-6">
          Loading account…
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
