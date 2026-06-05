# Security headers

Production response headers for `norven.farulivan.com`. Owned at the edge by Cloudflare
and committed here so the configuration is reviewable in code review, reproducible if
the zone is ever rebuilt, and survives any future origin migration (R2, MinIO, etc.)
without re-implementation.

Two places in the Cloudflare dashboard set these:

- **SSL/TLS → Edge Certificates → HSTS** — the only home for `Strict-Transport-Security`.
  Configured zone-wide so apex (`farulivan.com`) is also protected, not just `norven`.
- **Rules → Transform Rules → Modify Response Header** — every other header below,
  bundled into a single "Security Headers" rule with one action per header, scoped to
  `(http.host eq "norven.farulivan.com")`.

Headers are deliberately edge-managed, not code-injected, for three reasons:

1. They apply uniformly to every response — HTML, hashed assets, redirects, errors.
2. They survive origin changes; S3 → R2 swap has no header implications.
3. The build pipeline emits no per-page header data, so there's nothing for Astro to
   own anyway.

**One thing to remember in code review**: any change to inline `<script>` or `<style>` in
`src/layouts/BaseLayout.astro` (or any new inline tag anywhere) requires a re-read of
the `Content-Security-Policy` section below. The CSP is the only header that cares about
what the HTML contains.

## Headers

### Content-Security-Policy

The load-bearing header. Derived from what the site actually does, nothing more.

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com;
style-src 'self' 'unsafe-inline';
img-src 'self';
font-src 'self' data:;
connect-src 'self' https://api.web3forms.com https://cloudflareinsights.com;
frame-src 'none';
object-src 'none';
base-uri 'self';
form-action 'self' https://api.web3forms.com;
frame-ancestors 'none';
upgrade-insecure-requests
```

Directive-by-directive:

| Directive                                                                     | Why this value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self'`                                                          | Conservative default; every fetch must originate from the site unless an explicit allow below.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com`     | `BaseLayout.astro` ships two inline `<script>` blocks (the `is:inline` progressive-enhancement gate that adds `html.js` + reveal failsafe, and the `application/ld+json` Organization blob); section components carry scoped inline scripts. Hash-based CSP is technically stricter but requires re-emitting + committing a hash for every inline tag on every build — pragmatically not worth it for a static site with zero third-party scripts. Documented trade-off, not an accident. The `https://static.cloudflareinsights.com` host is for the Cloudflare Web Analytics beacon (`beacon.min.js`), auto-injected by Cloudflare when Web Analytics is enabled on the zone. |
| `style-src 'self' 'unsafe-inline'`                                            | Section markup uses inline `style="font-size: var(--text-display-1)"` and friends for fluid display sizes. Same hash-vs-pragmatism trade-off as scripts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `img-src 'self'`                                                              | All imagery is local (built by `astro:assets` from `src/content/` and `src/assets/`). Add `data:` here only if a future LQIP/inline placeholder ships a data URI; grep `dist/` to confirm before tightening or loosening.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `font-src 'self' data:`                                                       | Fonts are self-hosted via `@fontsource-variable/*`. `data:` is required because Astro's CSS bundler inlines small font subsets as base64 data URIs in the emitted `_astro/*.css` (e.g. JetBrains Mono Variable — verifiable with `grep -l 'data:font/woff2' dist/_astro/*.css`).                                                                                                                                                                                                                                                                                                                                                                                                |
| `connect-src 'self' https://api.web3forms.com https://cloudflareinsights.com` | The contact form (`src/pages/contact.astro`) posts to Web3Forms; the Cloudflare Web Analytics beacon POSTs page-view metrics to `cloudflareinsights.com`. Those are the only external endpoints the site ever talks to.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `frame-src 'none'`                                                            | Site embeds no iframes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `object-src 'none'`                                                           | Plugins/embeds disabled outright.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `base-uri 'self'`                                                             | Blocks `<base>` hijack.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `form-action 'self' https://api.web3forms.com`                                | The contact form's `action="https://api.web3forms.com/submit"` works without JS; without this directive, native (no-JS) submission would be blocked.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `frame-ancestors 'none'`                                                      | No other site may iframe this one. Redundant with `X-Frame-Options: DENY` on modern browsers, kept for defence-in-depth.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `upgrade-insecure-requests`                                                   | Defence in depth; any accidentally-http subresource gets upgraded.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

**Not included** (and why):

- `report-uri` / `report-to` — no endpoint to receive reports yet. Cloudflare's own CSP
  reporting is paywalled; the free path is a Cloudflare Worker `fetch()` handler that
  logs violations. Tracked in `docs/roadmap.md`.

**Cloudflare Web Analytics is enabled** on the zone. The two `cloudflareinsights.com` entries above are what makes the auto-injected beacon work under CSP. If Web Analytics is later disabled in the dashboard, remove both entries (the CSP otherwise stays the same).

### Strict-Transport-Security

```
max-age=31536000; includeSubDomains; preload
```

One-year max-age, covers all subdomains, opt-in to the HSTS preload list.

**Configured via the Cloudflare SSL/TLS panel, not a Transform Rule** — see the
click-path section below. The Transform Rule approach would scope HSTS to `norven`
only; configuring zone-wide via the SSL/TLS panel covers apex `farulivan.com` and
every other subdomain in one place, which is the safer default. Keeping HSTS out
of the Transform Rule also avoids a "duplicate Strict-Transport-Security header"
warning from `securityheaders.com` when both sources would otherwise fire.

**Warning**: submitting to the preload list is one-way and persistent — only do so
once no http-only subdomain is needed under `farulivan.com`.

### X-Content-Type-Options

```
nosniff
```

Blocks MIME-type sniffing. Always.

### X-Frame-Options

```
DENY
```

Redundant with `frame-ancestors 'none'` for modern browsers; cheap insurance for
older clients.

### Referrer-Policy

```
strict-origin-when-cross-origin
```

Default-good: keeps full URL on same-origin requests, drops to origin-only across
origins, sends nothing on https → http downgrades.

### Permissions-Policy

```
accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(),
fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(),
midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(),
screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()
```

Disables every browser capability the site does not use. Adding a feature later
means relaxing exactly one entry, which makes the dependency explicit at review time.

### Cross-Origin-Opener-Policy

```
same-origin
```

Cheap process isolation; the site never opens cross-origin popups it needs to
communicate with.

### Cross-Origin-Resource-Policy

```
same-origin
```

The site doesn't intentionally serve assets to be loaded by other origins.

### Not set (and why)

- **Cross-Origin-Embedder-Policy** — `require-corp` would force CORP headers on every
  cross-origin asset, with zero win absent SharedArrayBuffer use. Skip.
- **X-XSS-Protection** — modern browsers ignore it; Chrome removed the XSS Auditor.
  Recommending it in 2026 is a smell. Skip.

## Cloudflare dashboard click-path

`norven.farulivan.com` is a subdomain of `farulivan.com`, so everything is configured
in the parent **`farulivan.com` zone**.

### HSTS — SSL/TLS panel (zone-wide)

1. Cloudflare dashboard → `farulivan.com` zone.
2. **SSL/TLS → Edge Certificates → HTTP Strict Transport Security (HSTS)** → **Change**.
3. **Enable HSTS**: on.
4. **Max Age Header**: `6 months`.
5. **Include subdomains**: on.
6. **Preload**: on.
7. **No-Sniff**: leave default.
8. **Save**.

This is zone-wide — applies to apex and every subdomain. Don't also set HSTS via a
Transform Rule; that's what produces the duplicate-header warning.

### Every other header — one combined Transform Rule

1. Cloudflare dashboard → `farulivan.com` zone.
2. **Rules** → **Transform Rules** → **Modify Response Header** → **Create rule**.
3. **Rule name**: `Security Headers` (one rule covers all of them; cleaner than
   one-rule-per-header and saves quota).
4. **When incoming requests match**: custom filter expression
   `(http.host eq "norven.farulivan.com")` so the rule applies only to `norven`,
   not to apex or any sibling subdomain.
5. **Then…** — click **+ Add** for each header below and set:
   - **Action**: `Set static`
   - **Header name**: as listed in the per-header sections above
   - **Value**: as listed in the per-header sections above
6. Headers to add (seven actions inside the one rule):
   `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`,
   `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`,
   `Cross-Origin-Resource-Policy`.
7. **Save** → **Deploy**.

Cloudflare Free caps Modify Response Header at 10 rules per zone. Combining all
seven into one named rule uses 1 of 10 — plenty of headroom for future rules.

## Verification

After deployment:

```
curl -sI "https://norven.farulivan.com/?$(date +%s)" | grep -iE 'content-security|strict-transport|x-content|x-frame|referrer-policy|permissions-policy|cross-origin'
```

Should return every header above. The `?$(date +%s)` suffix bypasses any edge cache
to guarantee the fresh response.

Confirm there's exactly **one** `Strict-Transport-Security` line in the output — two
would mean both the SSL/TLS panel and a Transform Rule are setting it.

Then run the URL through
<https://securityheaders.com/?q=norven.farulivan.com&hide=on&followRedirects=on>
and <https://observatory.mozilla.org/analyze/norven.farulivan.com>. Expected grade:
**A** on securityheaders, **A** or **A+** on Mozilla Observatory.

**Grade A (not A+) on securityheaders is the deliberate ceiling**, not something
worth chasing further. The downgrade is the `script-src 'unsafe-inline'` flag,
required because `BaseLayout.astro` ships small inline `<script>` blocks (the
progressive-enhancement gate and the JSON-LD blob) and section components carry
scoped inline scripts. Eliminating `'unsafe-inline'` would require hash-based CSP,
which means hashing every inline tag on every build and either emitting per-page
CSPs or unioning hashes across pages — meaningful build complexity for a marginal
security delta on a static site with no third-party scripts and no XSS surface.
The trade-off is conscious; A is the senior-eng-defensible outcome here.

## When to revisit

- Adding any inline `<script>` or `<style>` outside the existing tags in
  `BaseLayout.astro` → re-read CSP, decide hash-vs-`'unsafe-inline'`.
- Adding a third-party script (analytics, a widget, etc.) → add its origin to
  `script-src` and (if it makes outbound fetches) `connect-src`.
- Migrating origin from S3 to R2 or MinIO → no header change; the rules continue to
  apply at the edge.
