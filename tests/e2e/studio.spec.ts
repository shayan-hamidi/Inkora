import { expect, test } from "@playwright/test";

test("studio shows sign-in gate without auth", async ({ page }) => {
  await page.goto("/studio");
  await expect(
    page.getByRole("heading", { name: "Shape a concept" }),
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: "Sign in" }),
  ).toBeVisible();
});


test("image generation unavailable state is honest", async ({ page }) => {
  const email = `studio-e2e-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  await page.goto("/register");
  await page.getByLabel("Display name").fill("Studio Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/account/);

  await page.goto("/studio");
  await expect(page.getByText(/Free-tier disclosure/i)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Generate concept" }),
  ).toBeVisible();
});
