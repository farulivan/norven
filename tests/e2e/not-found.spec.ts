import { expect, test } from "@playwright/test";

test("unknown route returns 404 and renders the branded page", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Not on/i);
  await expect(page.getByRole("link", { name: /return home/i })).toBeVisible();
});
