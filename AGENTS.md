# Repository Guidelines

`landing_26` (project `wykonczymy-www`) — replatform of **wykonczymy.com.pl**, the marketing and
lead-generation site for a Warsaw renovation contractor, from WordPress to Payload + Next on Vercel.
Canonical, cross-tool agent onboarding file.

> **The scaffold is in, production is live, and the site is built** — home, projects (listing +
> detail), interior styles (listing + detail), contact and the legal pages all render from the CMS,
> behind a footer contact form that validates but has no sink yet. See **Where things stand** at the
> bottom; the per-slice statuses in `@context/foundation/roadmap.md` lag the code and want an
> owner's pass.

## STOP if you can't run what this file references

This file assumes **Claude Code**. If a step references a skill, command, or tool you don't have:
do **not** improvise a substitute, skip it silently, or guess an equivalent. **Stop, name the
missing capability and what you were about to do, and wait for the human.**

## Reference repos — four, all read-only

Named throughout this file. **Nothing outside `landing_26` is ever edited** — work flows one way,
read there, write here. Roles and the rules for copying from each →
`@context/foundation/references.md`.

| Name              | Path                         | What it is                                                                  |
| ----------------- | ---------------------------- | --------------------------------------------------------------------------- |
| **Chaos Kitchen** | `/workspace/nomad_chef`      | Live site on this exact stack — the default answer to "how do we do X here" |
| **tdg**           | `/workspace/_old_repos/tdg`  | The agency's WordPress template — the only real built markup for this site  |
| **leads app**     | `/workspace/yolo/wykonczymy` | Where contact form submissions land — a separate product with its own roadmap |
| **fest**          | `/workspace/fest`            | Next + WP, PL/EN. The only working locale routing + dictionary on any repo  |

fest's i18n module is `fest-frontend/lib/i18n/` — typed JSON dictionary, `useTranslation`,
provider. Chaos Kitchen and tdg are both single-locale, so fest is the only precedent for
anything bilingual.

## Hard rules (read first)

- **tdg is never edited and nothing is deleted from it** — the owner has restated this more than
  once. What gets carried across is the owner's call, named file by file; do not produce
  keep/remove recommendations for it unasked.
- **Commit only your own work, by explicit path.** Multiple agents run against these trees;
  `git add -A` sweeps up another agent's in-flight work.
- **Use** `pnpm` — not npm, not yarn. Chaos Kitchen is on npm, so its `db:*` scripts need their
  `npm run` calls swapped on the way in.
- **Install latest _mature_.** Do **not** copy version numbers out of the reference repos; they are
  a snapshot of what those projects happened to have. But "latest" is not "published this morning":
  `minimumReleaseAge: 1440` in `pnpm-workspace.yaml` makes Vercel refuse a lockfile containing
  anything under a day old, and `pnpm add` pins today's version by default — widen the range so a
  mature fallback exists. This cost a failed production deploy; see
  `@context/foundation/stack-template.md`. The only pinned majors are decisions: Payload 3,
  React 19, Tailwind 4, `postgres:17-alpine`.
- **Payload owns the** `src/` **layout** — `src/app/(payload)/{admin,api}`, `payload.config.ts`,
  `withPayload()` wrapping the Next config. App Router only.
- **Never write to** `context/archive/` — archived changes are immutable. All project docs live
  under `context/`; there is no root `docs/`.
- **Timeline is not a project constraint.** Do not raise it, estimate it, or ask about it.
- **This is not a client handover.** The business belongs to the developer's brother and the developer
  keeps control indefinitely. Never justify scope with "otherwise the client would have to pay a
  developer" — there is no such client, so handover-proofing is a cut. This is **not** a licence to
  hardcode content: **all content data lives in the CMS** — copy, images, prices, list items are
  Payload fields, whoever edits them. What code owns is **structure**: layout, navigation, design,
  and the components themselves. **No block builder** — Payload's blocks / layout-builder machinery
  is not used; a page is a fixed layout whose typed fields the admin fills, never rearranges.

## The two landmines

- **The twelve indexed addresses are a guardrail, and three things about them are easy to break.**
  The canonical host is `www.`; every address ends in a **trailing slash**, so `trailingSlash: true`
  is required in the Next config or all twelve break at once; and PL/EN use translated slugs
  (`/oferta/` ↔ `/en/offer/`), held as a localized Payload `slug` field. The enumerated map is
  `@context/foundation/url-map.md` — it is the spec to test against, not a historical note.
- **Photo attachments (FR-031) cannot use the existing lead intake.** The leads app
  (`/workspace/yolo/wykonczymy`) accepts a flat set of text answers with nowhere to put a file. That
  is a fact about the existing contract, not a preference — delivering the requirement needs work
  **in that repo**, which is a separate product this project does not own.

## Conventions

- **Dev-only surfaces live under `src/app/(frontend)/(lab)/`** — the group's `layout.tsx` carries
  the `NODE_ENV === 'production'` 404 and the `robots` noindex for everything beneath it. A route
  group does not appear in the URL, so `/hero-lab/`, `/footer-lab/` and `/page-board/` are
  unchanged. Placement is the guard: put a new lab page anywhere else and it ships to production,
  which is how `page-board` came to be publicly reachable while its two siblings were not.

- **`src/components/ui/icons/` holds marks we draw** — hand-authored SVG components. A Font Awesome
  glyph is used **inline at the point of use**, never wrapped into a named file there. A wrapper in
  that directory reads as "the one place this mark lives" and stops being true the moment a second
  consumer imports the glyph directly; that is exactly how `icons/phone.tsx` came to carry a comment
  claiming the site had one phone mark while `phone-cta.tsx` imported `faPhoneVolume` itself.
  Pattern to copy: `@src/components/ui/phone-cta.tsx`.

## Stack, deploy, local DB

Layer table, rationale, and the two tdg migration frictions (Tailwind 3→4 class migration;
`WpImageT` → Payload media retyping) → `@context/foundation/tech-stack.md`.

**Before touching scaffold, deploy or environment config, read
`@context/foundation/stack-template.md`** — a follow-top-to-bottom runbook for standing this stack
up on Vercel. It is the seed for a reusable starter, so keep it free of anything specific to this
site.

- **`POSTGRES_URL` points at production, in every environment including your laptop.** There is one
  database and one blob store; the site is not published yet, so there was no production content to
  protect and keeping a second copy in sync cost more than it returned. `pnpm dev` and
  `pnpm payload migrate` both write to the live database — there is no undo but the dump.
- **Take a dump before anything destructive.** `pnpm db:dump` pulls production down to
  `dumps/`; `db:migrate:prod` and `db:restore:prod` each run it first.
- **Never point `psql` or `pg_dump` at the `-pooler` host.** Neon's pooler runs PgBouncer in
  transaction mode, so a session-level `SET` issued outside a transaction outlives the client and is
  handed to whoever gets that backend next. Every `pg_dump` script opens with
  `SELECT pg_catalog.set_config('search_path', '', false)`, so one restore through the pooler left
  the shared backend with an empty `search_path` and **every** unqualified query afterwards failed
  `42P01 undefined_table` — the whole site 500ed and `test:int` went red, while the data was
  untouched. `db:dump`, `db:restore:prod` and `db:migrate:prod` now strip `-pooler` from
  `PROD_POSTGRES_URL` themselves. If it happens again the cure is
  `select pg_terminate_backend(<pid>)` from the direct host against the backend whose
  `application_name` is `psql`.
- **The Docker Postgres on port 5436 is the test database, and the only `psql` client here.** It
  stopped being the dev database, but `pnpm test` runs against it and every `db:*` script still
  shells into it for `psql` and `pg_dump`:
  Neon is on **18.6** and the Homebrew client on this machine is 17.10, which refuses the version
  gap outright. The container ships 18.6, so it is the only working client here — stop it and
  `db:dump` and `db:restore:prod` both break, taking the backup path with them. `brew install
  postgresql@18` is what would actually free it. 5433/5434/5435 are taken by other projects; wired
  in `@docker-compose.yml` / `@.env.example`.
- **The test suites refuse to run against production.** `POSTGRES_URL` names production, and the
  suites create and delete rows — a full-CRUD admin, a published project — so they overwrite it
  from `TEST_POSTGRES_URL` before anything opens a pool and abort if that resolves to the
  production host, `-pooler` stripped. `pnpm test:db:refresh` reloads the container from a
  production dump. Point `TEST_POSTGRES_URL` at a Neon branch and nothing else changes; the
  container is only what this machine already had. (EX-815)
- **`test:e2e` runs its own dev server on 3100, with its own dist directory.** Next locks one dev
  server per dist dir, so `NEXT_DIST_DIR=.next-e2e` is what lets the suite run while your own
  `pnpm dev` is up — and the separate port is what stops Playwright reusing that server, which
  reads production. The specs address it through `baseURL`, never a hardcoded host.
- **Schema still only moves by migration.** `push: false` in `payload.config.ts` keeps the adapter
  from reshaping the database under `pnpm dev`, which is the only reason pointing dev at production
  is survivable.
- Deployed to Vercel on the **same account as the leads app** — deliberate, removes cross-org access
  problems. Use the `vercel:*` skills to talk to Vercel rather than guessing its API.
- `create-payload-app` **needs a TTY and cannot be run by an agent.** The owner runs it; the exact
  command is in `tech-stack.md`.
- **`build` never migrates the database.** Schema is applied by hand with `pnpm db:migrate:prod` —
  **a human runs it, never an agent** — and it goes up _before_ the code that needs it. Plain
  `pnpm payload migrate` reaches the same database without taking a dump first; prefer the `:prod`
  script for the backup.
- **The database is the only copy of the content.** Seeding is gone — the scripts, the fixtures
  under `scripts/seed/` and the source photos in `public/images/{styles,home,footer}` were all
  removed on 2026-09-19 once the content was in and the admin became the place it is edited. What
  that costs: there is no version-controlled source to rebuild from, so a restored-but-empty
  database is repopulated from `dumps/`, not by re-running anything. Take the dump.
- **`pnpm blob:upload` copies `media/` into the blob store** under each file's exact name, because
  the adapter resolves a row by building `<store>/<filename>` from the `filename` column. It is how
  a database restored from elsewhere gets its images back — which makes the untracked `media/`
  directory the only offline copy of the photo bytes. Do not delete it.
- **`vercel env pull` reads the Development target only**, and both stores were connected to
  Production and Preview alone — which is why a pull returned every value empty and looked like the
  variables were unreadable. The fix is on the store, not the project: Storage → the store →
  **Projects** → `⋯` → **Update Project Connection** → tick **Development**. The same dialog carries
  the `Sensitive` toggle and the environment-variable prefix. Neon is deliberately left on
  Production/Preview, so `POSTGRES_URL` still cannot be read back — compare hosts in Neon's console
  instead. `blob:upload` passes no token so the SDK can resolve either `BLOB_READ_WRITE_TOKEN` or the
  `VERCEL_OIDC_TOKEN` + `BLOB_STORE_ID` pair, whichever `.env.local` happens to hold.
- **Read env through a module that parses `env-schema.ts`, never raw `process.env`** — ESLint
  rejects it in `src/**`. `env.ts` is the **client** module and parses `clientSchema`, so it is
  the wrong home for a secret: putting one there inlines it into the browser bundle. A
  server-side reader belongs in `env.server.ts`, which the ESLint ignore list already names
  although the file does not exist yet — that entry is what stops the next person re-adding it
  from having to edit the lint config, and reaching for `clientSchema` instead.
  `payload.config.ts` is the one exception, and parses `serverSchema` itself.

## Claude Code workflow

> The user's global rules in `~/.claude/rules/*` are the **single source** for response style, git,
> comments, and tooling conventions — this file deliberately does not restate them.

> **Workflow = 10x, not superpowers** — use the `/10x-*` skills for research/plan/implement/review.

Close out **every change that has its own** `context/changes/<id>/` **folder** by running the
`slice-review-gate` skill; having a change folder _is_ the trigger. Only trivial folder-less edits
skip it.

Findings the gate defers are filed to Linear — project **Wykonczymy**, team **Ex-plant** — and
**every issue filed from this repo carries the `landing` label.** That project is shared with the
leads app, which owns the large majority of its issues; the label is the only thing separating the
two backlogs, so an unlabelled issue is indistinguishable from leads-app work and is effectively
lost.

## Where things stand

**Don't propose conversion-optimisation work — it is an explicit non-goal.** Success is measured as
parity with the current site plus editorial control, not a lift in a metric; nothing about the
current site's conversion, speed or credibility has been identified as broken. Rationale →
`@context/foundation/prd.md` (`## Problem`).

**The work is sequenced in `@context/foundation/roadmap.md`** — two Foundations slices then eight
vertical ones, in dependency order, with what blocks each. Pick an item and run `/10x-plan <id>`.
Nothing is owed on the documentation; it was completed 2026-09-02.

Read `@context/foundation/project-state.md` first — decisions taken, what was rejected and why, and
the ordered next steps. Then `@context/foundation/prd.md` (11-section brownfield PRD; its
`## Open Questions` holds the eleven open items — only "where do contact form submissions land
today" blocks cutover, none block building) and `@context/foundation/references.md`.

Content for populating early versions: `@context/foundation/live-site-snapshot/scraped-content.md`
— scraped 2026-03-04, so **spot-check against the live site before trusting it for cutover**;
prices in particular may have moved.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
