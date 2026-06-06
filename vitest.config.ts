import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "~": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // The motion core is pure (no DOM/gsap), so the node environment is enough.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
