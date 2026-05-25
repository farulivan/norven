// Deterministic warm gradient for an image slot that has no photo yet.
// seed (e.g. the slot index) → a CSS linear-gradient built from the bone/brass/ink tokens.
const STOPS: ReadonlyArray<readonly [string, string]> = [
  ["var(--color-bone-2)", "var(--color-bone-3)"],
  ["var(--color-bone-3)", "var(--color-brass)"],
  ["var(--color-ink-3)", "var(--color-ink)"],
  ["var(--color-brass-2)", "var(--color-ink-2)"],
  ["var(--color-bone-2)", "var(--color-brass)"],
];

export function placeholderGradient(seed = 0): string {
  const i = ((seed % STOPS.length) + STOPS.length) % STOPS.length; // safe for negatives
  const [from, to] = STOPS[i]!;
  const angle = 115 + (i % 4) * 25;
  return `linear-gradient(${angle}deg, ${from}, ${to})`;
}
