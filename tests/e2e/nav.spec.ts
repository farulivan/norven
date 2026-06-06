import { expect, test } from "@playwright/test";

const links = [
  { label: "Work", path: "/projects" },
  { label: "Studio", path: "/studio" },
  { label: "Contact", path: "/contact" },
];

for (const { label, path } of links) {
  test(`clicking primary nav "${label}" lands on ${path}`, async ({ page }) => {
    await page.goto("/");
    const primary = page.getByRole("navigation", { name: "Primary" });
    await primary.getByRole("link", { name: label, exact: true }).click();
    await page.waitForURL(new RegExp(`${path}/?$`));
    await expect(page.locator("main#main")).toBeVisible();
  });
}
