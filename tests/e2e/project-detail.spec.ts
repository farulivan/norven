import { expect, test } from "@playwright/test";

// Reduced motion makes [data-reveal] elements skip the opacity:0 scrub-in and
// start fully visible. test.use({ reducedMotion: "reduce" }) and the
// playwright.config `use` option both proved unreliable at flipping
// window.matchMedia in this Playwright version, so emulateMedia is called
// explicitly per-test (same pattern as tests/e2e/a11y.spec.ts).
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("project detail renders the title and project navigation landmark", async ({ page }) => {
  await page.goto("/projects/obsidian-pavilion/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Obsidian Pavilion");
  const projectNav = page.getByRole("navigation", { name: "Project navigation" });
  await projectNav.scrollIntoViewIfNeeded();
  await expect(projectNav).toBeVisible();
});

test("prev/next links surface the wraparound neighbours", async ({ page }) => {
  // Obsidian Pavilion is order 2 in src/content/projects/. withNeighbors sorts
  // ascending by `data.order` then wraps cyclically, so prev = Salt House (1),
  // next = Terra Works (3).
  await page.goto("/projects/obsidian-pavilion/");
  const projectNav = page.getByRole("navigation", { name: "Project navigation" });
  await projectNav.scrollIntoViewIfNeeded();
  await expect(projectNav.getByRole("link", { name: /Salt House/ })).toBeVisible();
  await expect(projectNav.getByRole("link", { name: /Terra Works/ })).toBeVisible();
});

test("clicking the next link navigates to the next project", async ({ page }) => {
  await page.goto("/projects/obsidian-pavilion/");
  const projectNav = page.getByRole("navigation", { name: "Project navigation" });
  await projectNav.scrollIntoViewIfNeeded();
  await projectNav.getByRole("link", { name: /Terra Works/ }).click();
  await page.waitForURL(/\/projects\/terra-works\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Terra Works");
});
