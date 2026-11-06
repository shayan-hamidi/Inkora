import { expect, test } from "@playwright/test";
import { registerAndLandOnAccount } from "./helpers/auth";

test("register and reach account", async ({ page }) => {
  const email = `inkora-e2e-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  await registerAndLandOnAccount(page, {
    displayName: "E2E Tester",
    email,
    password,
  });
  await expect(page.getByText(email)).toBeVisible();
});

test("login with invalid credentials shows an error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("missing@example.com");
  await page.getByLabel("Password").fill("not-the-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText(/Invalid email or password/i)).toBeVisible();
});
