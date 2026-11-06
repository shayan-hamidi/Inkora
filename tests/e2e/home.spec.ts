import { expect, test } from "@playwright/test";

test("home page shows the INKORA brand and tagline", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "INKORA home" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Discover your next tattoo/i }),
  ).toBeVisible();
});

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.ok).toBe(true);
});
