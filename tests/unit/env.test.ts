import { describe, expect, it } from "vitest";
import { getPublicEnv, getServerEnv } from "@/lib/env";

describe("env", () => {
  it("parses public env without requiring optional keys", () => {
    const env = getPublicEnv();
    expect(env).toEqual(
      expect.objectContaining({
        NEXT_PUBLIC_APP_URL: undefined,
      }),
    );
  });

  it("parses server env with NODE_ENV default", () => {
    const env = getServerEnv();
    expect(["development", "test", "production"]).toContain(env.NODE_ENV);
    expect(env.IMAGE_GENERATION_ENABLED).toBe(false);
  });
});
