import { expect, test } from "@playwright/test";
import { registerAndLandOnAccount } from "./helpers/auth";

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

  await registerAndLandOnAccount(page, {
    displayName: "Studio Tester",
    email,
    password,
  });

  await page.goto("/studio");
  await expect(page.getByText(/Free-tier disclosure/i)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Generate concept" }),
  ).toBeVisible();
});
