# Contributing

Norven is a personal portfolio piece, not an actively maintained library. That doesn't mean contributions are unwelcome — it means review happens asynchronously, on my schedule, and I'm selective about scope. Read this once before opening anything.

## Before you open anything

- **Bug report?** Use the [bug report issue form](https://github.com/farulivan/norven/issues/new?template=bug_report.yml).
- **Feature request?** Use the [feature request issue form](https://github.com/farulivan/norven/issues/new?template=feature_request.yml). The shape mirrors how decisions are documented in `docs/adr/` so a well-formed feature request can graduate to an ADR with minimal rewriting.
- **Security issue?** Don't open a public issue. See [SECURITY.md](./SECURITY.md) for the disclosure channel.
- **Anything else?** Reach me on GitHub (see `config.yml` in `.github/ISSUE_TEMPLATE/`).

## Pull requests

PRs are welcome for clear, scoped changes. For anything beyond a small bug fix or typo, **open an issue first** so I can align with you before code lands.

A few things to know:

- **Brand and copy are reserved.** Don't change the Norven name, wordmark, project narratives, team bios, or any prose in `src/content/`. See [LICENSE.md](./LICENSE.md) for what's MIT and what isn't.
- **Decisions are documented in `docs/adr/`.** If your PR changes the shape of something (the data model, the motion runtime, the deploy pipeline), the ADRs explain why the current shape exists. Either update the relevant ADR or note in the PR why the new shape supersedes it.
- **CI must pass.** Every PR runs the full local `pnpm verify` (format, lint, typecheck, test, build, bundle budget) plus Playwright E2E + axe a11y, Lighthouse budgets per page, CodeQL, dependency review, and commitlint on every commit message. Bypassing local hooks with `--no-verify` will be caught at PR time.

## Local setup

Prerequisites:

- Node `>=22.12.0` (the version in `package.json` `engines.node`).
- `pnpm 11`. The CI workflows use exactly this — staying matched keeps reproductions clean.

Setup:

```bash
git clone https://github.com/farulivan/norven.git
cd norven
pnpm install
```

`pnpm install` triggers `lefthook install` via the `prepare` script, which wires the commit-msg and pre-commit git hooks. If you ever lose them (re-init the repo, swap worktrees) re-run `pnpm install` or `pnpm exec lefthook install`.

Set up the contact form locally by copying `.env.example` to `.env` and filling in a Web3Forms key (free at <https://web3forms.com>). The build works without it; the form just won't deliver.

## Day-to-day commands

| Command                             | What it does                                                                |
| ----------------------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`                          | Local dev server at `localhost:4321`.                                       |
| `pnpm build`                        | Static build to `dist/`.                                                    |
| `pnpm preview`                      | Serve the built `dist/` locally (used by `pnpm test:e2e`).                  |
| `pnpm check`                        | `astro check` — typecheck + Astro diagnostics.                              |
| `pnpm lint` / `pnpm lint:fix`       | ESLint.                                                                     |
| `pnpm format` / `pnpm format:check` | Prettier.                                                                   |
| `pnpm test` / `pnpm test:watch`     | Vitest unit tests for `src/lib/` and `src/consts.test.ts`.                  |
| `pnpm test:e2e`                     | Playwright E2E + axe-core a11y. Builds first, runs against `astro preview`. |
| `pnpm test:e2e:install`             | One-time install of Playwright chromium (~150 MB).                          |
| `pnpm check:bundle`                 | Compare `dist/_astro/*` JS + CSS totals against `bundle-budget.json`.       |
| `pnpm verify`                       | The full gate. Run before pushing if you bypassed local hooks.              |

For an orientation to the codebase shape, read [ARCHITECTURE.md](./ARCHITECTURE.md) first.

## Commit and PR conventions

- **Conventional Commits.** `commitlint` enforces this at both the local `commit-msg` hook and in CI on every commit between `origin/main` and HEAD. Format: `type(scope): short description`. Example: `feat(contact): add portfolio note above form`.
- **PR template** prefills with what / why / how / visuals / verification / decisions slots. The verification checklist is real — actually run those gates locally before requesting review.
- **One concern per PR.** Easier to review, easier to revert.

## Maintainer setup (one-time, for me)

These are the manual steps a fresh clone can't automate. I keep them here so they're not lost.

- **Renovate**: install the [Renovate GitHub App](https://github.com/apps/renovate) on `farulivan/norven`. Merge the onboarding PR. The committed `renovate.json` does the rest.
- **Branch protection on `main`**: require the `CI / Verify` check to pass before merge. Without this, Renovate's auto-merge for dev-dep patches isn't gated on CI.
- **Cloudflare Transform Rules**: apply the response-header rules in `docs/security-headers.md` via the Cloudflare dashboard. Verify with `curl -sI https://norven.farulivan.com/`.
- **GitHub Pages-style branding**: GitHub may not auto-detect the hybrid `LICENSE.md` for the repo summary chip. That's fine — the file is the source of truth.

## Code of conduct

Be kind, be specific, assume good faith. Solo portfolio repo, so there's no formal CoC document — this paragraph is it.

Thanks for reading.
