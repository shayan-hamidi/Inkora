import { describe, expect, it } from "vitest";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/features/authentication/schemas";

describe("authentication schemas", () => {
  it("validates login credentials", () => {
    expect(
      loginSchema.safeParse({
        email: "a@example.com",
        password: "TestPassword123!",
      }).success,
    ).toBe(true);
    expect(
      loginSchema.safeParse({ email: "bad", password: "x" }).success,
    ).toBe(false);
  });

  it("requires matching passwords on register", () => {
    expect(
      registerSchema.safeParse({
        displayName: "Casey",
        email: "casey@example.com",
        password: "TestPassword123!",
        confirmPassword: "other",
      }).success,
    ).toBe(false);
  });

  it("validates reset email", () => {
    expect(
      resetPasswordSchema.safeParse({ email: "casey@example.com" }).success,
    ).toBe(true);
  });
});
