import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

/** Cookie-free anon client for public catalog reads. */
export function createPublicSupabaseClient() {
  const { url, anonKey } = getSupabasePublicConfig();

  return createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
