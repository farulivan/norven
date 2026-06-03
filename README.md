# Norven

Marketing/portfolio site for a fictional architecture studio. Static Astro site with a restrained scroll-driven motion system, deployed to AWS S3 behind Cloudflare.

**Live**: [norven.farulivan.com](https://norven.farulivan.com)

## Stack

- **Astro 6** — static output, MPA with View Transitions
- **TypeScript** `strictest`
- **Tailwind v4** — CSS-first, no `tailwind.config.js`
- **GSAP + ScrollTrigger + Lenis** — scroll-driven motion via a single scoped runtime (`src/lib/motion/`)
- **Vitest** — unit tests for the motion core

Node `>=22.12.0`. Package manager is `pnpm`.

## Commands

| Command                             | Action                                                      |
| ----------------------------------- | ----------------------------------------------------------- |
| `pnpm dev`                          | Dev server at `localhost:4321`                              |
| `pnpm build`                        | Static build to `dist/`                                     |
| `pnpm preview`                      | Preview the build                                           |
| `pnpm check`                        | `astro check` — typecheck + diagnostics                     |
| `pnpm lint` / `pnpm lint:fix`       | ESLint                                                      |
| `pnpm format` / `pnpm format:check` | Prettier                                                    |
| `pnpm test` / `pnpm test:watch`     | Vitest                                                      |
| `pnpm verify`                       | Full gate: `format:check && lint && check && test && build` |

## Deployment

Static Astro build served from a per-hostname S3 bucket behind Cloudflare (DNS, TLS, CDN, WAF). Single-CDN design, IP-allowlisted origin, two-tier cache strategy. Free under steady-state portfolio traffic; bounded under ~$5/mo at sustained 1 TB/mo.

Full architecture, design decisions, security model, cost analysis, and operational runbook live in **[docs/deployment.md](./docs/deployment.md)**.

## License

This is a personal portfolio piece. Code is provided for reference; please don't reuse the brand identity (Norven name, copy, imagery).
