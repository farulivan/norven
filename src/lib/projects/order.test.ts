import { describe, it, expect } from "vitest";
import { withNeighbors } from "./order";

const make = (order: number, id: string) => ({ id, data: { order } });

describe("withNeighbors", () => {
  it("sorts by order", () => {
    const out = withNeighbors([make(3, "c"), make(1, "a"), make(2, "b")]);
    expect(out.map((o) => o.entry.id)).toEqual(["a", "b", "c"]);
  });

  it("wraps prev of first to last, next of last to first", () => {
    const out = withNeighbors([make(1, "a"), make(2, "b"), make(3, "c")]);
    expect(out[0]!.prev.id).toBe("c");
    expect(out[2]!.next.id).toBe("a");
  });

  it("links interior neighbours", () => {
    const out = withNeighbors([make(1, "a"), make(2, "b"), make(3, "c")]);
    expect(out[1]!.prev.id).toBe("a");
    expect(out[1]!.next.id).toBe("c");
  });

  it("does not mutate the input array", () => {
    const input = [make(2, "b"), make(1, "a")];
    withNeighbors(input);
    expect(input.map((e) => e.id)).toEqual(["b", "a"]);
  });
});
