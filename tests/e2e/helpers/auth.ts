import { expect, type Page } from "@playwright/test";

export async function registerAndLandOnAccount(
  page: Page,
  options: { displayName: string; email: string; password: string },
) {
  await page.goto("/register");
  await page.getByLabel("Display name").fill(options.displayName);
  await page.getByLabel("Email").fill(options.email);
  await page.getByLabel("Password", { exact: true }).fill(options.password);
  await page.getByLabel("Confirm password").fill(options.password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/account/, { timeout: 20_000 });
  await expect(
    page.getByRole("heading", { name: "Your account" }),
  ).toBeVisible();
}
