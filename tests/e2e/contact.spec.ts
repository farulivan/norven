import { expect, test } from "@playwright/test";

test("contact form exposes required fields", async ({ page }) => {
  await page.goto("/contact");
  // Form fields live inside [data-reveal] wrappers that the motion runtime
  // gates on scroll-in (or a 2.5s failsafe). Scroll the field into view so we
  // assert on the realistic user journey: scroll down, see and label the form.
  const fields = ["Name", "Email", "Project type", "A short brief"];
  for (const label of fields) {
    const field = page.getByLabel(label);
    await field.scrollIntoViewIfNeeded();
    await expect(field).toBeVisible();
  }
  await expect(page.getByRole("button", { name: /send brief/i })).toBeVisible();
});

test("honeypot field is hidden from sighted users", async ({ page }) => {
  await page.goto("/contact");
  // The honeypot is a real input named `botcheck` — bots that fill every field
  // are rejected. Confirm it ships with the `hidden` Tailwind class so it never
  // shows up visually or to a sighted keyboard user.
  const honeypot = page.locator('input[name="botcheck"]');
  await expect(honeypot).toHaveClass(/hidden/);
});
