---
project: wykonczymy-www
updated: 2026-09-02
phase: foundations
---

# Project state — read this first

Handoff document. Where the wykonczymy.com.pl replatform stands, what was decided and why, and what
must not be done. If you are a new agent on this project, read this, then `prd.md`, then
`references.md`.

## What this is

Replatform of **wykonczymy.com.pl** — the marketing and lead-generation site for a renovation and
interior-finishing contractor in Warsaw. WordPress today, built and held by an outside agency.
Moving to Payload + Next, rebuilt layout, full cutover in one DNS switch.

**The driver is ownership, not a measured failure.** Nothing about the current site's conversion,
speed or credibility has been identified as broken. Success is _parity plus control_, which is why
the guardrails weight preservation over improvement. Do not propose conversion-optimisation work; it
is an explicit non-goal.

## Standing constraints — do not violate these

1. **Never edit or delete anything in `_old_repos/tdg`.** It is the design/markup source and is
   read-only. What gets carried across is the owner's call, named file by file. Do not produce
   keep/remove recommendations for it unasked. This rule has been restated by the owner more than
   once.
2. **Timeline is not a project constraint.** Do not raise it, estimate it, or ask about it.
3. **The leads app (`yolo/wykonczymy`) is a separate product.** Its dashboard, notification,
   contact-status tracking and reconcile cron are out of scope. One dependency crosses the boundary
   (attachments — see below).
4. **Routine plumbing gets one line, not a three-option essay.** The owner will say when a detail
   deserves a real discussion.
5. **This is not a client handover.** The business belongs to the developer's brother; the developer keeps full control of the site indefinitely and is always reachable. Do not propose, justify, or preserve anything on the grounds that a client would otherwise have to pay a developer — that situation does not exist. It cuts scope on **access-control machinery only** — no handover-proofing. It is _not_ an argument for hardcoding content: an admin panel beats a source file as an editing surface for the developer too, so **all content data belongs in the CMS** — copy, images, prices, list items — regardless of who edits them.
6. **Code owns structure; the CMS owns data.** Layout, navigation, design and the components are code. **Payload's blocks / layout-builder machinery is not used** — no page builder, no drag-and-drop section composition, for editors or for the developer. Each page is a fixed structure whose named, typed fields the admin fills; a new section means a new field and a deploy.
7. **Commit only your own work, by explicit path.** Multiple agents run against these trees.

## Decisions taken

### Fresh repo, not a migration — `yolo/landing_26`

Rejected: rebuilding inside `tdg`. Reasons, in weight order:

- Payload 3 **owns** the app structure (`src/app/(payload)/{admin,api}`, `payload.config.ts`,
  `withPayload()` wrapping next config). tdg has root-level `app/` and no `src/` — the conflict
  starts at the directory root.
- Version delta is a full dependency re-resolution, not an upgrade: Next 14 → 16, React 18 → 19.
  tdg's lockfile has zero carry-over value.
- 37 of tdg's 206 source files consume WordPress GraphQL. The data layer is deleted wholesale.
- tdg has two commits, one being "import template". There is no history to preserve.
- Config inheritance: staying in tdg keeps the agency's Prettier, ESLint, Dockerfile, a Bitbucket
  pipeline pointed at _their_ server, and `remotePatterns: { hostname: '**' }` — unless each is
  actively removed. A fresh repo makes all of that opt-in.
- It also makes constraint #1 structurally impossible to violate: in a new repo nothing is deleted,
  only copied in.

### Deploy to Vercel, same account as the leads app

Settles the adapters (`db-vercel-postgres` + `storage-vercel-blob`) and removes any cross-org access
problem between the site and the leads app.

### Local Postgres in Docker for dev, Neon for prod

Mirrors Chaos Kitchen. Port 5436 — see `tech-stack.md`.

### All project docs live under `context/`

No root `docs/`. The live-site scrape sits at `context/foundation/live-site-snapshot/`.

## The two things most likely to bite

**1. URL preservation.** Decided 2026-09-02 — paths live as a localized Payload `slug` field; see
`tech-stack.md` `## i18n`. What remains is mechanical and easy to get wrong: the canonical host is
`www.`, every address carries a trailing slash (`trailingSlash: true` required), and the twelve are
enumerated in `url-map.md`. Because slugs now live in the CMS, they are editable — the guardrail
depends on `url-map.md` being tested against, not trusted.

**2. Photo attachments cannot use the existing lead intake.** The leads app's current intake accepts
a flat set of text answers and has nowhere to put a file. This is a fact about the existing
contract, not a preference — delivering the file-upload requirement (FR-031) requires work _in the
leads app_. It is sequenced against this project but not owned by it.

## Current state

**F1 (scaffold) is done and production is live** at `wykonczymylanding26.vercel.app` — `/` returns
200, `/admin` 308s to `/admin/`. Deploys run from GitHub `main`; Neon holds the schema, Vercel Blob
the media. Zero content: the site is Payload's stock starter page and **the first admin user has not
been created** (Payload has no CLI path for it — open `/admin` and register).

```
src/
  payload.config.ts       Users + Media, localization pl/en, seo plugin, blob storage
  collections/            Users.ts, Media.ts
  lib/                    env-schema.ts + env.ts + env.server.ts — the only readers of process.env
  migrations/             20260902_120907_initial
  app/(frontend)/         stock starter page
  app/(payload)/          admin + api, generated
tests/                    int + e2e specs as create-payload-app ships them
scripts/watch-deploy.sh   tails the Vercel build a push triggers
.husky/                   pre-commit (lint-staged), pre-push (migration gate → typecheck → vitest → watcher)
context/foundation/       + stack-template.md, the reusable setup runbook
context/changes/          empty — no change started
```

**Two planes, deliberately separated.** Vercel deploys code; `payload migrate` owns schema. `build`
does **not** migrate — on Vercel `POSTGRES_URL` points at production for every deployment, previews
included, so a build that migrates would let a throwaway branch rewrite prod. Schema goes up first,
by hand: `pnpm db:migrate:prod`, run by a human, never an agent.

**`PROD_POSTGRES_URL` is empty**, so `db:dump` — and therefore `db:migrate:prod`, which dumps before
it migrates — currently fails. Prod is empty so the first migration was harmless; fill the var
before any migration that touches real data.

Also at the root: `AGENTS.md` (canonical agent onboarding) and `CLAUDE.md` (a thin importer of it).

**Documentation is complete as of 2026-09-02.** Every foundation document exists, the three gating
decisions (i18n routing, the editor/admin split, no i18n library) are made, and `roadmap.md`
sequences the work.

## Next steps

1. Create the first admin user at `/admin` on the deployed site.
2. Set `PROD_POSTGRES_URL` in `.env` from Neon, so the backup-first migrate path works.
3. `/10x-plan f2-i18n-spine`, then `s1-first-page`. After S1, four slices open in parallel — see
   `roadmap.md` `## At a glance`.
4. `AGENTS.md` gains its conventions section (structure, testing, commands) once there is real
   application code to describe.

## Open questions

Eleven, recorded in `prd.md` under `## Open Questions`. Only one blocks cutover: **where quote
requests actually land today** must be confirmed, since preserving lead delivery is a guardrail and
the current behaviour is the thing being preserved. None block building.
