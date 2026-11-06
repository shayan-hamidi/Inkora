import { expect, test } from "@playwright/test";
import { registerAndLandOnAccount } from "./helpers/auth";

test("generate and refine an AI concept (mock provider)", async ({ page }) => {
  test.setTimeout(60_000);

  const email = `ai-e2e-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  await registerAndLandOnAccount(page, {
    displayName: "AI Tester",
    email,
    password,
  });

  await page.goto("/studio");
  await page
    .getByLabel("Describe your idea")
    .fill("A quiet crescent moon with sparse marks for a first rib tattoo");
  await page.getByRole("button", { name: "Generate concept" }).click();
  await expect(page).toHaveURL(/\/studio\/history\//, { timeout: 20_000 });
  await expect(page.getByRole("heading").first()).toBeVisible();

  const refineForm = page.locator("form").filter({
    has: page.getByRole("button", { name: "Refine concept" }),
  });
  await refineForm
    .getByLabel("Refinement direction")
    .fill("Make it quieter and more first-tattoo friendly with less detail");
  await refineForm.getByRole("button", { name: "Refine concept" }).click();
  await expect(page).toHaveURL(/\/studio\/history\//, { timeout: 20_000 });
  await expect(page.getByText(/refined/i).first()).toBeVisible();
});
