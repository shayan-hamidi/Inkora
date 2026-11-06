import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

/**
 * Privileged server-only client. Never import this into Client Components.
 * Bypasses RLS — use only for trusted admin/system operations.
 */
export function createAdminSupabaseClient() {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
