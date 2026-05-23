// Pure orchestration for the motion runtime. No gsap, no DOM, no Lenis — those
// live in runtime.ts and are injected here as `MotionEnv`. This file is the test
// surface: the registry, the page-load/before-swap lifecycle, and the
// reduced-motion + refresh wiring can all be exercised without a browser.

export type EffectCtx = {
  /** True when prefers-reduced-motion is set. Effects branch to a static fallback. */
  reduced: boolean;
  /** Request a batched ScrollTrigger.refresh — for effects that register late/async. */
  refresh: () => void;
};

export type Teardown = () => void;

export type EffectSetup = (ctx: EffectCtx) => Teardown | void | Promise<Teardown | void>;

export type MotionEnv = {
  reducedMotion: () => boolean;
  scheduleRefresh: () => void;
};

export type MotionCore = {
  /** Enqueue an effect. Called once per effect module, at import time. */
  register: (setup: EffectSetup) => void;
  /** Run every registered setup. Bind to `astro:page-load`. */
  runAll: () => void;
  /** Run + drop every stored teardown. Bind to `astro:before-swap`. */
  teardownAll: () => void;
};

export function createMotionCore(env: MotionEnv): MotionCore {
  const registry: EffectSetup[] = [];
  let teardowns: Teardown[] = [];
  // Bumped on every teardownAll. A late async setup whose generation is stale
  // tears itself down immediately instead of lingering past a navigation.
  let generation = 0;

  const ctx: EffectCtx = {
    get reduced() {
      return env.reducedMotion();
    },
    refresh: () => env.scheduleRefresh(),
  };

  function capture(td: Teardown | void, gen: number): void {
    if (!td) return;
    if (gen !== generation) {
      td();
      return;
    }
    teardowns.push(td);
  }

  function runOne(setup: EffectSetup): void {
    const gen = generation;
    const result = setup(ctx);
    if (result instanceof Promise) {
      void result.then((td) => capture(td, gen));
    } else {
      capture(result, gen);
    }
  }

  return {
    register(setup) {
      registry.push(setup);
    },
    runAll() {
      registry.forEach(runOne);
    },
    teardownAll() {
      generation++;
      const current = teardowns;
      teardowns = [];
      current.forEach((td) => td());
    },
  };
}
