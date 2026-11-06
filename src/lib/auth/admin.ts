import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminProfile = {
  id: string;
  displayName: string | null;
  role: "admin";
};

/** Server-only admin check via profiles.role — never trust the client. */
export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    return null;
  }

  return {
    id: profile.id,
    displayName: profile.display_name,
    role: "admin",
  };
}

export async function requireAdminProfile(): Promise<AdminProfile> {
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    throw new Error("ADMIN_REQUIRED");
  }
  return admin;
}
