# Roadmap

Documented intent, not built. Each entry below carries a one-line **Why deferred** so I — or a hiring reader — can tell which deferrals are temporary holds and which are deliberate non-goals.

Grouped by concern, not strictly ordered — I would order implementation by next month's actual constraint.

## Deployment and infrastructure

### 1. Per-PR preview deploys

Extend `.github/workflows/deploy.yml` (or a sibling workflow) to deploy PR builds to a scoped S3 prefix (e.g. `pr-{number}/`), wire a Cloudflare Worker that routes `pr-N.norven.farulivan.com` → `s3://bucket/pr-N/` on the existing bucket, and add a cleanup workflow that purges the prefix when the PR closes. Inject a `<meta name="robots" content="noindex">` into PR builds so search engines stay out.

**Why deferred**: meaningful CI complexity (`pull_request_target` for forks, a Worker on free-tier `100k req/day`, cleanup race conditions) for a solo portfolio repo that doesn't currently have inbound contributor PRs. Worth doing the moment Renovate's auto-merge wants visual verification, or once external contributors start opening PRs that change layout.

### 2. Cloudflare Cache Rule for HTML at the edge

Force-cache HTML on Cloudflare Free (which doesn't by default) via a Cache Rule that sets `Edge Cache TTL: 10 minutes` for `Content-Type: text/html`. Halves origin GET counts at sustained high traffic and bumps HTML TTFB from ~250 ms (origin) to ~30 ms (PoP).

**Why deferred**: the current model is "instant deploys, every page hits origin" — a deploy is live globally in under a second. At portfolio traffic the cost is negligible (~$0.02/mo) and the deploy-latency wins. Flip when traffic justifies it.

### 3. R2 migration path

Cloudflare R2 is S3-compatible (same API), so the entire deploy workflow ports unchanged — the only diff is the IAM role becomes an R2 API token and the bucket policy becomes R2 access rules. Zero egress at R2 means cost stays asymptotic to zero even at sustained TB/mo.

**Why deferred**: the current bill is $0.02/mo. R2 only pays back at sustained 1+ TB/mo, which is far away. Captured here so the migration is obvious when egress ever becomes a constraint.

### 4. Cloudflare Authenticated Origin Pulls (mTLS to S3)

Mutual TLS between Cloudflare and the origin so the bucket policy can drop the IP allowlist and gate access on client certificates instead. Cleaner security model — IP allowlist breaks silently if Cloudflare rotates ranges; mTLS doesn't.

**Why deferred**: today's content is intentionally public. The IP allowlist is the right tool for the threat model (`docs/deployment.md § Security model` documents the residual risks). mTLS needs a Lambda or proxy in front of S3 since S3 doesn't natively validate client certs — meaningful infra for a marginal security win against current threats.

## Observability

### 5. Cloudflare Web Analytics

Privacy-preserving, single-script-tag, free, no cookies, no user-tracking ID. Adds traffic visibility without an analytics consent banner.

**Why deferred**: not strictly needed for a portfolio at current traffic. When wired, it requires updating `docs/security-headers.md` CSP to allow `https://static.cloudflareinsights.com` in `script-src` and `https://cloudflareinsights.com` in `connect-src` — documented inline in that file as the conditional delta.

### 6. CSP violation reporting endpoint

Add `report-uri` (or `report-to`) on the Content-Security-Policy header pointing at a Cloudflare Worker `fetch()` handler that logs violations to a queue or email. Lets production CSP regressions surface before a real visitor hits them.

**Why deferred**: requires a Worker on free tier and a destination to log to. Useful only once the CSP is enforced (which it is, post-`docs/security-headers.md`) and traffic justifies watching it. Cloudflare's own CSP reporting is paywalled; the free path is the Worker.

## Security

### 7. Subresource Integrity (SRI) for external assets

Add `integrity="sha384-…"` to any `<script>` or `<link>` loading from a third-party origin. Defense in depth against a compromised CDN or man-in-the-middle injecting code.

**Why deferred**: currently no third-party assets ship. Fonts are self-hosted via `@fontsource-variable/*`, all images are local via `astro:assets`, the only outbound endpoint is `api.web3forms.com` from a `<form action>` and a `fetch()`. SRI becomes relevant the moment Web Analytics (or any third-party `<script>`) is added.

## Out of scope (deliberate non-goals)

I weighed these and ruled them out; they are not merely deferred. They live here so future review can start from the ADR or this note instead of reopening the same question.

- **Managed hosting CDN** (Vercel, Netlify, Amplify, Cloudflare Pages). [ADR-0003](./adr/0003-static-hosting-pipeline.md) explains the choice.
- **WebGL / 3D centrepiece.** [ADR-0002](./adr/0002-photography-led-redesign.md) explains the retirement.
- **Client-side framework** (React, Vue, Svelte). The site is an Astro static MPA; the motion runtime is the only cross-section JS. Adding a framework would gain nothing the current shape lacks and cost bundle size + complexity.
- **CMS.** Content lives in the repo. The editorial cycle for a portfolio is slow enough that markdown is the right tool.
- **Application backend or database.** No users, no PII, no payments. The contact form posts directly to Web3Forms.
- **Error tracking (Sentry, Rollbar).** A static site with no JS-heavy interactivity has very little to report. CSP reporting (item 6) covers the meaningful failure mode.
