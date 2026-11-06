import { expect, test } from "@playwright/test";

test("browse tattoo gallery", async ({ page }) => {
  await page.goto("/tattoos");
  await expect(
    page.getByRole("heading", { name: "Discover tattoos" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Line Serpent/i })).toBeVisible();
});

test("search and filter tattoos", async ({ page }) => {
  await page.goto("/tattoos");
  await page.getByLabel("Search").fill("moon");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/q=moon/);
  await expect(page.getByRole("link", { name: /Quiet Moon/i })).toBeVisible();

  await page.getByLabel("Style").selectOption("minimal");
  await expect(page).toHaveURL(/style=minimal/);
});

test("view tattoo details", async ({ page }) => {
  await page.goto("/tattoos/quiet-moon");
  await expect(page.getByRole("heading", { name: "Quiet Moon" })).toBeVisible();
  await expect(page.getByText(/Demo content/i)).toBeVisible();
});
