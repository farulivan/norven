import { describe, it, expect, vi } from "vitest";
import { createMotionCore } from "./core";

const env = (reduced = false) => ({
  reducedMotion: () => reduced,
  scheduleRefresh: vi.fn(),
});

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe("motion core", () => {
  it("runs registered setups only on runAll", () => {
    const core = createMotionCore(env());
    const setup = vi.fn();
    core.register(setup);
    expect(setup).not.toHaveBeenCalled();
    core.runAll();
    expect(setup).toHaveBeenCalledTimes(1);
  });

  it("passes the reduced flag through from env", () => {
    const core = createMotionCore(env(true));
    let seen: boolean | undefined;
    core.register((ctx) => {
      seen = ctx.reduced;
    });
    core.runAll();
    expect(seen).toBe(true);
  });

  it("ctx.refresh delegates to env.scheduleRefresh", () => {
    const e = env();
    const core = createMotionCore(e);
    core.register((ctx) => {
      ctx.refresh();
    });
    core.runAll();
    expect(e.scheduleRefresh).toHaveBeenCalledTimes(1);
  });

  it("runs a returned teardown on teardownAll", () => {
    const core = createMotionCore(env());
    const td = vi.fn();
    core.register(() => td);
    core.runAll();
    expect(td).not.toHaveBeenCalled();
    core.teardownAll();
    expect(td).toHaveBeenCalledTimes(1);
  });

  it("re-runs setups across a page-load / before-swap / page-load cycle", () => {
    const core = createMotionCore(env());
    const setup = vi.fn();
    core.register(setup);
    core.runAll();
    core.teardownAll();
    core.runAll();
    expect(setup).toHaveBeenCalledTimes(2);
  });

  it("stores no teardown for a DOM-absent (void) setup", () => {
    const core = createMotionCore(env());
    core.register(() => undefined);
    core.runAll();
    expect(() => core.teardownAll()).not.toThrow();
  });

  it("captures an async teardown after the setup resolves", async () => {
    const core = createMotionCore(env());
    const td = vi.fn();
    core.register(async () => td);
    core.runAll();
    await flush();
    core.teardownAll();
    expect(td).toHaveBeenCalledTimes(1);
  });

  it("tears down a stale async teardown immediately (generation guard)", async () => {
    const core = createMotionCore(env());
    const td = vi.fn();
    let resolveSetup!: () => void;
    const gate = new Promise<void>((r) => {
      resolveSetup = r;
    });
    core.register(async () => {
      await gate;
      return td;
    });
    core.runAll();
    core.teardownAll(); // navigation happens before the async setup resolves
    resolveSetup();
    await flush();
    expect(td).toHaveBeenCalledTimes(1); // ran on resolve, not stored
  });
});
