import { expect, test } from "@playwright/test";

test("save a favorite after signing in", async ({ page }) => {
  const email = `fav-e2e-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  await page.goto("/register");
  await page.getByLabel("Display name").fill("Fav Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/account/);

  await page.goto("/tattoos/quiet-moon");
  const saveButton = page.getByRole("button", { name: /^(Save|Saved)$/ });
  await saveButton.click();
  await expect(page.getByRole("button", { name: /^Saved$/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Saved$/ })).toBeEnabled();

  await page.goto("/favorites");
  await expect(page.getByRole("heading", { name: "Favorites" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Quiet Moon/i })).toBeVisible({
    timeout: 15_000,
  });
});


test("create and edit a collection", async ({ page }) => {
  const email = `col-e2e-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  await page.goto("/register");
  await page.getByLabel("Display name").fill("Col Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/account/);

  await page.goto("/collections");
  await page.getByLabel("Name").fill("First tattoo board");
  await page.getByLabel("Description").fill("Quiet ideas");
  await page.getByRole("button", { name: "Create collection" }).click();
  await expect(page.getByRole("heading", { name: "First tattoo board" })).toBeVisible();

  await page.getByLabel("Name").fill("First tattoo board revised");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/Collection updated/i)).toBeVisible();
});
