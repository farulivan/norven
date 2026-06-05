# Motion runtime: one deep module behind `scrollEffect`

All scroll-driven motion goes through a single runtime (`src/lib/motion/`) that owns gsap-plugin registration, Lenis, the `[data-reveal]` batch, and the Astro view-transition lifecycle. Effects call `scrollEffect((ctx) => teardown)` instead of each re-registering the plugin, re-checking reduced-motion, and binding `astro:page-load` by hand. I chose this for locality (the lifecycle contract lives in one place) and leverage (every effect, current and future, reuses one interface).

## Considered options

- **setup-returns-teardown** (chosen) — one callback receives `{ reduced, refresh }` and returns its own cleanup; the single return value covers any teardown shape: triggers, listeners, even WebGL disposal.
- **two callbacks (motion / reduced)** — rejected: splits cleanup from setup, awkward for anything more involved than a single `ScrollTrigger`.
- **thin lifecycle helpers** — rejected: shallow, leaves `registerPlugin` and teardown duplicated per effect.

## Consequences

- **Cumulative registry, re-run on every `astro:page-load`.** Under `ClientRouter` a `<script>` module evaluates once per session, not per navigation. So effects _register_ at import time and the runtime _re-runs_ them each page-load and tears them down each `astro:before-swap`. Do not "simplify" this to run-once.
- **Setups must be DOM-defensive** — they no-op when their nodes aren't on the current page, because the registry is session-cumulative.
- **`ctx.refresh()` is explicit and batched.** Reserved for any future async/late effect that registers its triggers after the initial refresh; multiple calls per frame collapse to one `ScrollTrigger.refresh()`. ADR-0002 retired the only client this had (the lazy-loaded monolith), so the hook is currently dormant — kept as a seam for the next async effect that needs it.
- The pure orchestration core (`core.ts`) imports no gsap, so it is unit-tested directly (`core.test.ts`).
