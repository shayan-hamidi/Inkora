import { expect, test } from "@playwright/test";

test("browse artists and open a profile", async ({ page }) => {
  await page.goto("/artists");
  await expect(page.getByRole("heading", { name: "Artists" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Mira Vale" }).first()).toBeVisible();
  await page.goto("/artists/mira-vale");
  await expect(
    page.getByRole("heading", { name: "Mira Vale", exact: true }),
  ).toBeVisible();
});



test("submit a consultation request", async ({ page }) => {
  await page.goto("/artists/mira-vale");
  await page.getByLabel("Your name").fill("Casey Example");
  await page.getByLabel("Email").fill("casey@example.com");
  await page.getByLabel("Preferred placement").fill("Forearm");
  await page
    .getByLabel("Message")
    .fill("Interested in a quiet moon piece, first tattoo, around 8cm.");
  await page.getByRole("button", { name: "Store request" }).click();
  await expect(page.getByText(/Request stored/i)).toBeVisible();
});
