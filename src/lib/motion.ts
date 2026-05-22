export const reducedMotion = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const EASE = {
  arch: "cubic-bezier(.2,.7,.2,1)",
  out: "power3.out",
  inOut: "power2.inOut",
} as const;
