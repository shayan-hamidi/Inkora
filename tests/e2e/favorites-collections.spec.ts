import { expect, test } from "@playwright/test";
import { registerAndLandOnAccount } from "./helpers/auth";

test("save a favorite after signing in", async ({ page }) => {
  const email = `fav-e2e-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  await registerAndLandOnAccount(page, {
    displayName: "Fav Tester",
    email,
    password,
  });

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

  await registerAndLandOnAccount(page, {
    displayName: "Col Tester",
    email,
    password,
  });

  const boardName = `First tattoo board ${Date.now()}`;
  await page.goto("/collections");
  await page.getByLabel("Name").fill(boardName);
  await page.getByLabel("Description").fill("Quiet ideas");
  await page.getByRole("button", { name: "Create collection" }).click();
  await expect(page).toHaveURL(/\/collections\//, { timeout: 20_000 });
  await expect(
    page.getByRole("heading", { name: boardName, exact: true }),
  ).toBeVisible();

  await page.getByLabel("Name").fill(`${boardName} revised`);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/Collection updated/i)).toBeVisible({
    timeout: 15_000,
  });
});

