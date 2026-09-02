# Reference repos

What each repo is for, and the rules for touching it. Read this before copying anything in.

| Repo | Path | Role | May I edit it? |
|---|---|---|---|
| **Chaos Kitchen** | `workspace/nomad_chef` | Primary pattern source | No — read only |
| **Leads app** | `workspace/yolo/wykonczymy` | Integration contract | No — separate product |
| **tdg** | `workspace/_old_repos/tdg` | Design / markup source | **No. Never.** |

## Chaos Kitchen — `workspace/nomad_chef`

Live at chaoskitchen.pl. A marketing site on the exact stack this project targets, so it is the
default answer to "how do we do X here".

Payload 3.83 · Next 16.2.3 · React 19.2.4 · `@payloadcms/db-vercel-postgres` (Neon in prod, Postgres
in Docker for dev) · `@payloadcms/storage-vercel-blob` · nodemailer via the Payload adapter ·
TanStack Form + Zod · Playwright with `@playwright/mcp` wired in `.mcp.json`.

Worth reading: its `AGENTS.md`, `docs/`, `playwright.config.ts`, and the `db:up` / `db:dump` /
`db:import` scripts in `package.json`.

**One gap to know about.** Its `payload.config.ts` declares `localization: { locales: ['pl', 'en'] }`,
but the frontend is Polish-only — no locale segment, no middleware, no `en` in the frontend code.
The bilingual public site is **not** solved here, and this project needs the harder version of it:
translated pathnames (`/en/offer/`, not `/en/oferta/`), because those are the indexed URLs and URL
preservation is a PRD guardrail. Do not assume a pattern exists for this. There isn't one yet.

## Leads app — `workspace/yolo/wykonczymy`

Where quote requests land. A different product with its own roadmap; this project does not own it.

Relevant surface: the `leads` collection, its intake path, and its auth model. The PRD records the
constraint that matters — the current intake carries a flat set of text answers and cannot accept
file attachments, so photo uploads require work *in that repo*, not a workaround in this one.

## tdg — `workspace/_old_repos/tdg`

The agency's WordPress template (Next 14 / React 18). It holds the only real built markup for this
site: ~142 components, roughly 6,700 lines. Component JSX, Tailwind classes and GSAP animation logic
are lifted from here.

**Hard rule: tdg is never edited, and nothing is deleted from it.** Work flows one way — read there,
write here. What gets carried across is the owner's call, named file by file. Its `WpImageT` /
`wpStarterTypes` props must be retyped against Payload media on the way in.

It also holds the original `context/foundation/` docs; the copies in this repo are the live ones now.

## Retired

`workspace/yolo/wykonczymy_front_26` — an abandoned spike, being deleted. Not a reference; do not
cite it. Its one salvaged asset is already here at `context/foundation/live-site-snapshot/`.

## Live site snapshot — `context/foundation/live-site-snapshot/`

Content scraped from wykonczymy.com.pl on **2026-03-04**: the full Cennik with prices, 6 testimonials
verbatim, 12 interior styles with their WordPress image filenames, 12 service cards, the 70+ item
"Wykonujemy także" list, 16 gallery images, plus 6 page screenshots.

Useful for populating an early version. **Spot-check it against the live site before trusting it for
cutover** — it is months old and prices in particular may have moved.
