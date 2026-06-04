# License

This repository ships three categories of material under different terms:

- **Code** under MIT — reusable for any purpose.
- **Brand and copy** all rights reserved — the Norven name, the marks, and the prose I wrote are not for reuse.
- **Photography** licensed via [Unsplash](https://unsplash.com/license) — free to use commercially and non-commercially, including by you if you fork this repo, under the standard Unsplash terms.

The split is intentional. The engineering patterns are reusable; the Norven identity is mine; the photographs are someone else's gift to the commons.

## Code — MIT License

Copyright © 2026 Farul Ivan.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Covered by the MIT grant

- `src/lib/`
- `src/components/`
- `src/pages/`
- `src/layouts/`
- `src/data/`
- `src/styles/`
- `src/consts.ts`, `src/content.config.ts`
- `scripts/`
- `tests/`
- All root config files (`astro.config.mjs`, `eslint.config.mjs`, `playwright.config.ts`, `vitest.config.ts`, `tsconfig.json`, `package.json`, `pnpm-workspace.yaml`, `lefthook.yml`, `.commitlintrc.json`, `.lighthouserc.json`, `bundle-budget.json`, `renovate.json`)
- All `.github/workflows/*.yml`, `.github/ISSUE_TEMPLATE/*`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/CODEOWNERS`
- All documentation files (`README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/`)

## Brand and copy — all rights reserved

The following are mine, and **not** covered by the MIT grant. Please don't reuse them without asking.

- The Norven name and wordmark.
- All written copy under `src/content/` (project narratives, team bios, awards, testimonials, project briefs).
- `src/assets/logo/` — the Norven emblem and wordmark SVGs.
- `public/apple-touch-icon.png`, `public/icon-*.png`, `public/favicon.*`, `public/site.webmanifest` — Norven-branded PWA icons and manifest.
- The Norven-branded text overlay on `public/og-image.jpg` (the underlying photograph is Unsplash-licensed; see below).

## Photography — Unsplash License

All photographs in this repository are sourced from [Unsplash](https://unsplash.com) and used under the [Unsplash License](https://unsplash.com/license), which permits free commercial and non-commercial use, modification, and redistribution without attribution. The license forbids one thing relevant to a fork: compiling photos from Unsplash to replicate or compete with Unsplash itself.

Files in this bucket:

- `src/assets/hero.jpg`
- Any image co-located in `src/content/<collection>/<entry>/` (project galleries, team portraits).
- The underlying photograph composited into `public/og-image.jpg`.

If you fork this repo and keep the photographs, you are subject to the Unsplash License, not to my permission.

## A note on substantial reuse

If you want to reuse a substantial subset of the code (a section component, the motion runtime, the deploy workflow shape), the MIT terms apply directly — no need to ask. If you'd like to lift the brand or the prose, that's different — please don't. If the line feels unclear, open an issue and we can talk about it.
