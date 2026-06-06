import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Keep in sync with SITE_URL in src/consts.ts (asserted by src/consts.test.ts).
  // Astro reads this at build-time before TS module resolution, so the literal lives here.
  site: "https://norven.farulivan.com",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: { chunkSizeWarningLimit: 600 },
  },
  prefetch: { defaultStrategy: "viewport" },
  experimental: { clientPrerender: true },
});
