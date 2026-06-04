# Security policy

This repository is a personal portfolio site. It has no users, no PII, no payments, no backend, and no application server. The attack surface is the static build pipeline, the GitHub Actions deploy workflow, and the edge configuration documented in [docs/security-headers.md](./docs/security-headers.md). That said: if you've found something, please report it.

## Reporting a vulnerability

**Please don't open a public issue for a security report.** Use one of the following private channels instead:

1. Open a private security advisory at <https://github.com/farulivan/norven/security/advisories/new>. This is the preferred path — it keeps the report off the public tracker and gives both sides a private place to discuss a fix.
2. If you can't access the security advisories interface, email the author directly: `farulivan@gmail.com`. Put `[security]` in the subject line.

When reporting, include enough detail to reproduce the issue: the affected URL or commit, repro steps, the expected versus observed behaviour, and any proof-of-concept you have.

## Response expectations

This is a one-author project, not a vendor SLA, but I take security reports seriously. Realistic timing:

| Stage                                                 | Target                                                                             |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Acknowledgement that the report was received          | within 3 days                                                                      |
| Initial assessment (in scope, severity, reproducible) | within 7 days                                                                      |
| Fix or mitigation in production                       | depends on severity; critical issues within 30 days, others on a best-effort basis |

If you'd like credit in the fix commit or the relevant ADR, mention it in the report and I'll honour it unless you'd rather stay anonymous.

## What's in scope

- The static build output deployed to <https://norven.farulivan.com>.
- The GitHub Actions deploy workflow (`.github/workflows/deploy.yml`) and the OIDC trust path into AWS.
- The S3 bucket policy and IAM role scope used by the deploy.
- The Cloudflare edge configuration documented in `docs/security-headers.md` and `docs/deployment.md`.
- The contact form handling (`src/pages/contact.astro`) and its integration with Web3Forms.

## What's out of scope

- Issues in third-party dependencies that don't materially affect this deployment. File those upstream; pnpm audit and `actions/dependency-review-action` already catch them at PR time.
- DDoS, volumetric, or rate-limit-style reports — Cloudflare's free-tier DDoS protection handles the layer this site cares about.
- Social-engineering or physical-access reports against the author.

## Hardening already in place

If you're evaluating the existing posture before reporting, these are the documents worth reading first:

- [docs/security-headers.md](./docs/security-headers.md) — the exact Cloudflare Transform Rules that apply CSP, HSTS, Permissions-Policy, Referrer-Policy, COOP, CORP, and friends at the edge.
- [docs/deployment.md](./docs/deployment.md) § Security model — the threat-mitigation matrix and the residual risks I've explicitly accepted at this tier.
- [docs/adr/0003-static-hosting-pipeline.md](./docs/adr/0003-static-hosting-pipeline.md) — why the IAM scope is minimal, why the bucket policy is shaped the way it is, and why OIDC replaces long-lived deploy credentials.

Thank you for taking the time.
