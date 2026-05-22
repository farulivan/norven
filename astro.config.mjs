import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://norven.studio",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: { chunkSizeWarningLimit: 600 },
  },
  prefetch: { defaultStrategy: "viewport" },
  experimental: { clientPrerender: true },
});
