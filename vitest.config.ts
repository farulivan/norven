import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The motion core is pure (no DOM/gsap), so the node environment is enough.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
