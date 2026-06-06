# Photography-led redesign: retire the generative monolith identity

Norven pivots from a generative-visual identity — the WebGL "monolith", its SVG silhouette, and the procedural plan/section/site drawings — driven by complex 3D scroll (the `Flythrough` Z-stacked cards and the `Layers` isometric tower) to a **photography-led editorial site with restrained motion**, modelled on marvellco.com.au. I deleted `src/lib/three/`, `MonolithScene`/`MonolithSilhouette`, the procedural drawings, and the `monolith` schema field; photographs (with gradient placeholders until they arrive) become the primary medium. I made the pivot because the site must grow into a full architecture-firm web where photography is the product, and because the 3D scroll was hard to keep legible (it shipped overlapping the heading and adjacent sections) — I chose clarity and credibility over a distinctive-but-fragile centrepiece. The warm `bone`/`ink`/`brass` palette and the Cormorant serif display are **kept deliberately** as the retained Norven character, so this is a photography pivot, not a Marvell clone.

## Considered options

- **Full pivot** (chosen) — retire the generative identity entirely; photography-led layout + restrained scroll. Most credible for an architecture practice and structurally free of the pin/scrub overlap-bug class.
- **Hybrid** — keep the monolith as a single signature hero beat, photography everywhere else. Rejected: keeps the heaviest, most fragile code (WebGL + `ctx.refresh` timing) for one screen of payoff.
- **Evolve in place** — keep the generative identity, only tame the existing motion. Rejected: leaves the site without photography, which is the thing an architecture firm sells.

## Consequences

- **ADR-0001 (motion runtime) stays valid but loses its hard clients.** The `scrollEffect` seam remains; the monolith was its only async/`ctx.refresh` client and `Flythrough`/`Layers` were its only `pin`/`scrub` clients — all retired. The runtime now drives Lenis, the `[data-reveal]` batch, and new **restrained primitives only: reveal, gentle image parallax, sticky text column, subtle hero scale**. **Scroll-jacking is banned** — `pin` and anything that extends document scroll length (the cause of the overlap bugs). Bounded, non-pinning `scrub` transforms (parallax/scale, each clipped to its own `overflow-hidden` frame) are allowed; that is how "gentle parallax" is built. ADR-0001's `ctx.refresh()` note is now effectively dormant (no async effects), but the seam is kept for future use.
- **Photography is primary; image fields stay optional.** Real photos go through astro:assets; until they exist a `<Frame>` renders a warm gradient + `TODO` marker in place of `<Image>`, so every page ships before any photo is supplied. See CONTEXT.md › Images.
- **`monolith` removed** from the projects schema and all five project frontmatters; procedural drawings removed from the project page. The Contact studio **dot-map is kept** — it is a location map, not part of the retired generative identity.
- Code deleted now lives only in git history; reversing the decision means rebuilding the `three/` scene and its scroll wiring.
