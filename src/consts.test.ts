import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SITE_URL } from "./consts";
import { SITE } from "./data/site";

describe("SITE_URL is the single source of truth", () => {
  it("SITE.url (src/data/site.ts) matches SITE_URL", () => {
    expect(SITE.url).toBe(SITE_URL);
  });

  it("astro.config.mjs site literal matches SITE_URL", () => {
    const configPath = fileURLToPath(new URL("../astro.config.mjs", import.meta.url));
    const configSource = readFileSync(configPath, "utf8");
    expect(configSource).toContain(`site: "${SITE_URL}"`);
  });
});
