export { createBrowserSupabaseClient } from "@/lib/supabase/browser";
export { createAdminSupabaseClient } from "@/lib/supabase/admin";
export { createPublicSupabaseClient } from "@/lib/supabase/public";
export { createServerSupabaseClient } from "@/lib/supabase/server";
export {
  MissingSupabaseConfigError,
  getSupabaseAdminConfig,
  getSupabasePublicConfig,
  hasSupabasePublicConfig,
} from "@/lib/supabase/config";
