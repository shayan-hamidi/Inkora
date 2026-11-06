import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { hasSupabasePublicConfig } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type SiteShellProps = {
  children: ReactNode;
};

async function AuthAwareHeader() {
  await connection();

  let isAuthenticated = false;

  if (hasSupabasePublicConfig()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase.auth.getClaims();
      isAuthenticated = Boolean(data?.claims);
    } catch {
      isAuthenticated = false;
    }
  }

  return <SiteHeader isAuthenticated={isAuthenticated} />;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <Suspense fallback={<SiteHeader isAuthenticated={false} />}>
        <AuthAwareHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
