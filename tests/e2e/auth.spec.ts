import { expect, test } from "@playwright/test";

test("register and reach account", async ({ page }) => {
  const email = `inkora-e2e-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  await page.goto("/register");
  await page.getByLabel("Display name").fill("E2E Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/account/);
  await expect(page.getByRole("heading", { name: "Your account" })).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();
});

test("login with invalid credentials shows an error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("missing@example.com");
  await page.getByLabel("Password").fill("not-the-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText(/Invalid email or password/i)).toBeVisible();
});
