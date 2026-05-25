import { describe, it, expect } from "vitest";
import { placeholderGradient } from "./placeholder";

describe("placeholderGradient", () => {
  it("is deterministic for a given seed", () => {
    expect(placeholderGradient(2)).toBe(placeholderGradient(2));
  });

  it("cycles through the stop palette (length 5)", () => {
    expect(placeholderGradient(0)).toBe(placeholderGradient(5));
  });

  it("handles negative seeds without throwing or producing junk", () => {
    const g = placeholderGradient(-1);
    expect(g).toMatch(/^linear-gradient\(/);
    expect(g).toContain("var(--color-");
  });

  it("always returns a linear-gradient with exactly two token colors", () => {
    for (let s = 0; s < 6; s++) {
      const g = placeholderGradient(s);
      expect(g.startsWith("linear-gradient(")).toBe(true);
      expect(g.split("var(--color-").length - 1).toBe(2);
    }
  });
});
