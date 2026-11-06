import { getPublicEnv, getServerEnv } from "@/lib/env";

export class MissingSupabaseConfigError extends Error {
  constructor(message = "Supabase environment variables are not configured.") {
    super(message);
    this.name = "MissingSupabaseConfigError";
  }
}

export function getSupabasePublicConfig() {
  const env = getPublicEnv();

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new MissingSupabaseConfigError(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.",
    );
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function getSupabaseAdminConfig() {
  const env = getServerEnv();
  const publicConfig = getSupabasePublicConfig();

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new MissingSupabaseConfigError(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin operations.",
    );
  }

  return {
    ...publicConfig,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function hasSupabasePublicConfig() {
  const env = getPublicEnv();
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
