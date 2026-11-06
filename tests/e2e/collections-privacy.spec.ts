import { expect, test } from "@playwright/test";
import { registerAndLandOnAccount } from "./helpers/auth";

test("private collection is inaccessible to another user", async ({ page }) => {
  test.setTimeout(60_000);

  const password = "TestPassword123!";
  const ownerEmail = `owner-${Date.now()}@example.com`;
  const otherEmail = `other-${Date.now()}@example.com`;

  await registerAndLandOnAccount(page, {
    displayName: "Owner",
    email: ownerEmail,
    password,
  });

  const boardName = `Secret board ${Date.now()}`;
  await page.goto("/collections");
  await page.getByLabel("Name").fill(boardName);
  await page.getByLabel("Visibility").selectOption("private");
  await page.getByRole("button", { name: "Create collection" }).click();
  await expect(page).toHaveURL(/\/collections\//, { timeout: 20_000 });
  await expect(
    page.getByRole("heading", { name: boardName, exact: true }),
  ).toBeVisible();
  const collectionUrl = page.url();

  await page.goto("/account");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL("/", { timeout: 15_000 });


  await registerAndLandOnAccount(page, {
    displayName: "Other",
    email: otherEmail,
    password,
  });

  await page.goto(collectionUrl);
  await expect(page.getByRole("heading", { name: boardName, exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("heading", { name: /not found/i }),
  ).toBeVisible();
});
