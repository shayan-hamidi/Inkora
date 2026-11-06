import { afterEach, describe, expect, it } from "vitest";
import {
  MissingSupabaseConfigError,
  getSupabaseAdminConfig,
  getSupabasePublicConfig,
  hasSupabasePublicConfig,
} from "@/lib/supabase/config";

const KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const originalValues = Object.fromEntries(
  KEYS.map((key) => [key, process.env[key]]),
);

afterEach(() => {
  for (const key of KEYS) {
    const value = originalValues[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe("supabase config", () => {
  it("reports missing public config", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(hasSupabasePublicConfig()).toBe(false);
    expect(() => getSupabasePublicConfig()).toThrow(MissingSupabaseConfigError);
  });

  it("parses public supabase keys when present", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    expect(hasSupabasePublicConfig()).toBe(true);
    expect(getSupabasePublicConfig()).toEqual({
      url: "http://127.0.0.1:54321",
      anonKey: "test-anon-key",
    });
  });

  it("requires service role key for admin config", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(() => getSupabaseAdminConfig()).toThrow(MissingSupabaseConfigError);

    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
    expect(getSupabaseAdminConfig().serviceRoleKey).toBe(
      "test-service-role-key",
    );
  });
});
