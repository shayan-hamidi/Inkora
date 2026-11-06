import { expect, test } from "@playwright/test";
import { registerAndLandOnAccount } from "./helpers/auth";

test("unauthorized admin access is rejected", async ({ page }) => {
  const email = `user-admin-gate-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  await registerAndLandOnAccount(page, {
    displayName: "Non Admin",
    email,
    password,
  });

  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Access denied" }),
  ).toBeVisible();
});
