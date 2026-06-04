# Security headers

Production response headers for `norven.farulivan.com`. Owned at the edge by Cloudflare
**Modify Response Header** Transform Rules — committed here so the configuration is
reviewable in code review, reproducible if the zone is ever rebuilt, and survives any
future origin migration (R2, MinIO, etc.) without re-implementation.

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
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self';
font-src 'self';
connect-src 'self' https://api.web3forms.com;
frame-src 'none';
object-src 'none';
base-uri 'self';
form-action 'self' https://api.web3forms.com;
frame-ancestors 'none';
upgrade-insecure-requests
```

Directive-by-directive:

| Directive                                      | Why this value                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self'`                           | Conservative default; every fetch must originate from the site unless an explicit allow below.                                                                                                                                                                                                                                                                                                                                                                                            |
| `script-src 'self' 'unsafe-inline'`            | `BaseLayout.astro` ships two inline `<script>` blocks (the `is:inline` progressive-enhancement gate that adds `html.js` + reveal failsafe, and the `application/ld+json` Organization blob); section components carry scoped inline scripts. Hash-based CSP is technically stricter but requires re-emitting + committing a hash for every inline tag on every build — pragmatically not worth it for a static site with zero third-party scripts. Documented trade-off, not an accident. |
| `style-src 'self' 'unsafe-inline'`             | Section markup uses inline `style="font-size: var(--text-display-1)"` and friends for fluid display sizes. Same hash-vs-pragmatism trade-off as scripts.                                                                                                                                                                                                                                                                                                                                  |
| `img-src 'self'`                               | All imagery is local (built by `astro:assets` from `src/content/` and `src/assets/`). Add `data:` here only if a future LQIP/inline placeholder ships a data URI; grep `dist/` to confirm before tightening or loosening.                                                                                                                                                                                                                                                                 |
| `font-src 'self'`                              | Fonts are self-hosted via `@fontsource-variable/*`. No Google Fonts.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `connect-src 'self' https://api.web3forms.com` | The contact form (`src/pages/contact.astro`) posts to Web3Forms — the **only** external endpoint the site ever talks to.                                                                                                                                                                                                                                                                                                                                                                  |
| `frame-src 'none'`                             | Site embeds no iframes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `object-src 'none'`                            | Plugins/embeds disabled outright.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `base-uri 'self'`                              | Blocks `<base>` hijack.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `form-action 'self' https://api.web3forms.com` | The contact form's `action="https://api.web3forms.com/submit"` works without JS; without this directive, native (no-JS) submission would be blocked.                                                                                                                                                                                                                                                                                                                                      |
| `frame-ancestors 'none'`                       | No other site may iframe this one. Redundant with `X-Frame-Options: DENY` on modern browsers, kept for defence-in-depth.                                                                                                                                                                                                                                                                                                                                                                  |
| `upgrade-insecure-requests`                    | Defence in depth; any accidentally-http subresource gets upgraded.                                                                                                                                                                                                                                                                                                                                                                                                                        |

**Not included** (and why):

- `report-uri` / `report-to` — no endpoint to receive reports yet. Cloudflare's own CSP
  reporting is paywalled; the free path is a Cloudflare Worker `fetch()` handler that
  logs violations. Tracked in `docs/roadmap.md`.

**If Cloudflare Web Analytics is ever enabled**, append:

- `script-src` ← `https://static.cloudflareinsights.com`
- `connect-src` ← `https://cloudflareinsights.com`

### Strict-Transport-Security

```
max-age=31536000; includeSubDomains; preload
```

One-year max-age, covers all subdomains, opt-in to the HSTS preload list.
**Warning**: submitting to the preload list is one-way and persistent — only do so once
no http-only subdomain is needed under `farulivan.com`.

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

For each header above, create one **Modify Response Header** Transform Rule:

1. Cloudflare dashboard → `norven.farulivan.com` zone.
2. **Rules** → **Transform Rules** → **Modify Response Header** → **Create rule**.
3. **Rule name**: `set-<header-name>` (kebab-case, e.g. `set-content-security-policy`).
4. **When incoming requests match**: use the custom filter expression
   `(http.host eq "norven.farulivan.com")` so the rule applies to every path.
5. **Then**: **Set static** → header name + value from the table above.
6. **Save** → **Deploy**.

Order doesn't matter (each rule sets a distinct header). Cloudflare currently caps the
Free plan at 10 Transform Rules per zone — the set above fits inside that cap with one
slot to spare; if the cap is ever exhausted, collapse Permissions-Policy and the COOP/CORP
pair into one rule via the "Edit expression" advanced view.

## Verification

After deployment:

```
curl -sI https://norven.farulivan.com/ | grep -iE 'content-security|strict-transport|x-content|x-frame|referrer-policy|permissions-policy|cross-origin'
```

Should return every header above. Then run the URL through
<https://securityheaders.com/?q=norven.farulivan.com>. Target grade: **A** or **A+**.

A drop to A (rather than A+) usually means the `Permissions-Policy` value is shorter
than the scanner expects, or the CSP `'unsafe-inline'` is being flagged — both
deliberate trade-offs documented above.

## When to revisit

- Adding any inline `<script>` or `<style>` outside the existing tags in
  `BaseLayout.astro` → re-read CSP, decide hash-vs-`'unsafe-inline'`.
- Adding a third-party script (analytics, a widget, etc.) → add its origin to
  `script-src` and (if it makes outbound fetches) `connect-src`.
- Migrating origin from S3 to R2 or MinIO → no header change; the rules continue to
  apply at the edge.
