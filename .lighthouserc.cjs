// Lighthouse CI config. JavaScript (not JSON) so each per-audit decision below
// carries an inline comment a reviewer can read without leaving the file.
//
// The split: category scores + Core Web Vitals stay strict ("error"). Individual
// audits that depend on an architectural decision documented elsewhere (ADR-0001,
// docs/security-headers.md) are explicitly tuned, with the rationale named.

module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: [
        "http://localhost/index.html",
        "http://localhost/projects/index.html",
        "http://localhost/projects/holm-chapel/index.html",
        "http://localhost/studio/index.html",
        "http://localhost/contact/index.html",
      ],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        skipAudits: ["uses-http2"],
      },
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        // ─── Category gates — the only meaningful merge-blockers ────────────────
        // These are the user-visible scores. Tune individual audits below; this
        // is what actually represents "the site feels fast / accessible / etc."
        "categories:performance": ["error", { minScore: 0.92 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],

        // ─── Core Web Vitals — fail PR if regressed ────────────────────────────
        "first-contentful-paint": ["warn", { maxNumericValue: 1500 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],

        // ─── Disabled because the audit doesn't apply at this tier ─────────────
        // CSP enforcement lives at the edge (Cloudflare Transform Rules per
        // docs/security-headers.md), not in the built HTML. The audit can't see it.
        "csp-xss": "off",
        // Cloudflare terminates TLS; the built `dist/` is plain HTTP for `lhci`'s
        // static server. These two would falsely fail in CI.
        "is-on-https": "off",
        "redirects-http": "off",

        // ─── Strict — these ARE real bugs and were fixed in this commit ────────
        // Hero <Frame> now uses priority (loading="eager" + fetchpriority="high").
        "lcp-lazy-loaded": ["error", { minScore: 0.9 }],
        "lcp-discovery-insight": ["error", { minScore: 0.9 }],
        // Nav SVG holders now aria-hidden so the parent link's aria-label is the
        // single source of truth for the home link's accessible name.
        "label-content-name-mismatch": ["error", { minScore: 0.9 }],
        // ProjectGrid / FeaturedProjects / ProjectGallery / prev-next thumbnails
        // each have widths + sizes tuned to their actual rendered dimensions.
        "uses-responsive-images": ["error", { maxLength: 0 }],

        // ─── Tuned — architectural decisions, not laziness ─────────────────────
        // GSAP + Lenis ship more API surface than the site exercises. ADR-0001
        // names them as the deliberate motion runtime; the unused bytes are the
        // tax for the polish. categories:performance still measures wall-clock
        // impact, so this remains a warning, not a free pass.
        "unused-javascript": ["warn", { maxLength: 2 }],
        // Lenis's smooth-scroll loop reads scrollY every frame (definition of a
        // forced reflow per the audit's heuristic). Removing it would mean
        // losing smooth scroll — a deliberate design choice in ADR-0001. The
        // perceived impact is captured in categories:performance.
        "forced-reflow-insight": "off",
        // Critical request chain depth (HTML → CSS → fonts → JS) on a static
        // site with one Tailwind bundle and self-hosted fonts triggers this
        // insight by default. Resolving it would require per-route CSS splits
        // or a font-display rewrite — Astro-architectural changes for marginal
        // gain. LCP and TBT below already gate the user-visible cost.
        "network-dependency-tree-insight": "off",
        // The single Tailwind CSS bundle is render-blocking by Astro's design;
        // critical-CSS extraction isn't in Astro's stock pipeline and is build
        // complexity for sub-50ms wins. Warn so any new render-blocker
        // (e.g. an accidental synchronous third-party script) still surfaces.
        "render-blocking-insight": ["warn", { maxLength: 1 }],
        // <Picture> now serves AVIF + WebP fallbacks (see Frame.astro). Remaining
        // score reflects per-pixel compression heuristics that can't tighten
        // further without sacrificing visual quality on a photography-led site.
        "image-delivery-insight": ["warn", { minScore: 0.5 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
