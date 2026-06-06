import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";

// Pages chosen to cover every distinct layout shape in the site:
//   - "/"                          PhotoHero overlay + composed sections
//   - "/projects/"                 PageHero + ProjectGrid
//   - "/projects/holm-chapel/"     project detail (Frame parallax + gallery)
//   - "/studio/"                   PageHero + philosophy + team + awards + dark section
//   - "/contact/"                  PageHero + form + dot map
//   - "/colophon/"                 PageHero + multi-section narrative + dark Source block
const pages = ["/", "/projects/", "/projects/holm-chapel/", "/studio/", "/contact/", "/colophon/"];

// Every a11y test runs under prefers-reduced-motion: reduce so the motion
// runtime's reducedMotion() short-circuit fires (just adds `.is-in`, no GSAP
// autoAlpha:0 transitions). Without this, axe samples below-fold reveal
// elements mid-scrub (opacity ~0.02) and reports spurious near-zero contrast.
//
// emulateMedia is called explicitly per-test because test.use({
// reducedMotion: "reduce" }) and config-level `use.reducedMotion` both proved
// not to propagate to window.matchMedia in this Playwright version; the
// explicit page-level call is the only path that flips matchMedia correctly.
async function scanForBlockingViolations(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
}

for (const path of pages) {
  test(`${path} has no serious or critical accessibility violations`, async ({ page }) => {
    const blocking = await scanForBlockingViolations(page, path);
    // Surface the violation ids in the failure message so a regression is
    // diagnosable from the CI log without re-running locally.
    const detail = blocking.map((v) => `${v.id} (${v.impact}): ${v.description}`).join("\n");
    expect(blocking, detail || undefined).toEqual([]);
  });
}

test("404 page has no serious or critical accessibility violations", async ({ page }) => {
  const blocking = await scanForBlockingViolations(page, "/this-route-does-not-exist");
  const detail = blocking.map((v) => `${v.id} (${v.impact}): ${v.description}`).join("\n");
  expect(blocking, detail || undefined).toEqual([]);
});
