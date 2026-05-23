// The motion runtime: the only place that touches gsap, ScrollTrigger, and Lenis.
// It wires the pure core (core.ts) to the real world — plugin registration, the
// Lenis smooth-scroll loop, the [data-reveal] batch, the Astro view-transition
// lifecycle, and a batched ScrollTrigger.refresh. Effects never import gsap's
// plugin machinery; they call `scrollEffect`.

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reducedMotion } from "./reduced";
import { createMotionCore, type EffectSetup } from "./core";

gsap.registerPlugin(ScrollTrigger);

// --- batched refresh: N ctx.refresh() calls in a frame collapse to one refresh ---
let refreshQueued = false;
function scheduleRefresh(): void {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    ScrollTrigger.refresh();
  });
}

const core = createMotionCore({ reducedMotion, scheduleRefresh });

/**
 * Register a scroll-driven effect. The setup runs on every `astro:page-load`
 * with `{ reduced, refresh }`; return a teardown (kills triggers, removes
 * listeners, disposes WebGL) and the runtime runs it on `astro:before-swap`.
 * Setups must be DOM-defensive: no-op when their nodes aren't on the page.
 */
export function scrollEffect(setup: EffectSetup): void {
  core.register(setup);
}

// --- Lenis smooth scroll (runtime built-in) ---
let lenis: Lenis | null = null;
function initLenis(): void {
  if (lenis || reducedMotion()) return;
  lenis = new Lenis({ autoRaf: false, lerp: 0.12, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}
function destroyLenis(): void {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

// --- [data-reveal] batch fade-in (runtime built-in) ---
function bindReveals(): void {
  const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  if (els.length === 0) return;
  if (reducedMotion()) {
    els.forEach((el) => {
      el.classList.add("is-in");
      gsap.set(el, { clearProps: "all" });
    });
    return;
  }
  ScrollTrigger.batch(els, {
    start: "top 88%",
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          overwrite: true,
        },
      ),
    once: true,
  });
}

// --- view-transition lifecycle ---
function boot(): void {
  initLenis();
  bindReveals();
  core.runAll();
  // Refresh after reveals + effect triggers have been created.
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function teardown(): void {
  core.teardownAll();
  destroyLenis();
  // Safety net for triggers not owned by an effect's teardown (e.g. the reveal batch).
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

document.addEventListener("astro:page-load", boot);
document.addEventListener("astro:before-swap", teardown);
