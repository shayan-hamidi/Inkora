import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminConfig } from "@/lib/supabase/config";

/**
 * Privileged server-only client. Never import this into Client Components.
 * Bypasses RLS — use only for trusted admin/system operations.
 */
export function createAdminSupabaseClient() {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
