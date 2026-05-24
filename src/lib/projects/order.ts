export interface Ordered {
  data: { order: number };
}

/** Sort entries by `data.order`, then attach cyclic prev/next neighbours (wraparound). */
export function withNeighbors<T extends Ordered>(
  entries: T[],
): Array<{ entry: T; prev: T; next: T }> {
  const sorted = [...entries].sort((a, b) => a.data.order - b.data.order);
  const n = sorted.length;
  return sorted.map((entry, i) => ({
    entry,
    prev: sorted[(i - 1 + n) % n]!,
    next: sorted[(i + 1) % n]!,
  }));
}
