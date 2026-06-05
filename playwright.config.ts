import { defineConfig, devices } from "@playwright/test";

// Playwright drives both my E2E smoke tests and the axe-core a11y scans.
// I keep one toolchain instead of two — pa11y-ci would duplicate browser runtime
// in CI for the same coverage.
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // `workers` is omitted off-CI so Playwright auto-detects from CPU count;
  // tsconfig strictest's exactOptionalPropertyTypes forbids `: undefined`.
  ...(isCI ? { workers: 1 } : {}),
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
  webServer: {
    // `astro preview` serves the built `dist/` — assumes `pnpm build` already
    // ran. The package.json `test:e2e` script chains build before invoking
    // Playwright; CI runs build as a separate step before this for parity.
    command: "pnpm preview --host 127.0.0.1 --port 4321",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  // Chromium only in CI: firefox + webkit would triple the runner time for a
  // static site that ships no browser-specific code. I will revisit if that changes.
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
