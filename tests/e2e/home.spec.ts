import { expect, test } from "@playwright/test";

test("home page loads with the right title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Norven/);
});

test("primary nav links are visible", async ({ page }) => {
  await page.goto("/");
  const primary = page.getByRole("navigation", { name: "Primary" });
  await expect(primary.getByRole("link", { name: "Work", exact: true })).toBeVisible();
  await expect(primary.getByRole("link", { name: "Studio", exact: true })).toBeVisible();
  await expect(primary.getByRole("link", { name: "Contact", exact: true })).toBeVisible();
});

test("skip-to-content link is the first focusable element", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /skip to content/i })).toBeFocused();
});
