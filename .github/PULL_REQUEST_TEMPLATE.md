## What

<!-- One sentence describing what this PR changes. -->

## Why

<!-- The motivation. Link the issue if there is one. -->

## How

<!-- Implementation choices a reviewer would not derive from the diff alone. -->

## Visuals

<!-- For UI changes: before / after screenshots or a short screen recording. Delete if not applicable. -->

## Verification

- [ ] `pnpm verify` is green (format, lint, typecheck, test, build, bundle budget)
- [ ] `pnpm test:e2e` is green (Playwright smoke + axe a11y)
- [ ] Lighthouse budgets have not regressed (see the LHCI bot comment after CI runs)
- [ ] No new accessibility violations
- [ ] Manually exercised the change in the browser (`pnpm dev`)

## Architecture / decisions

<!-- If this PR shifts architectural shape, link or note the relevant decision doc (e.g. CONTEXT.md, docs/deployment.md). -->

- Decision:
