---
project: wykonczymy-www
updated: 2026-09-23
phase: built — one slice (S8, cutover) unstarted
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

### ~~Local Postgres in Docker for dev, Neon for prod~~ — reversed

Originally mirrored Chaos Kitchen. It no longer holds: **Neon is the database in every environment,
including your laptop**, and the Docker Postgres on 5436 is the **test** database plus the only
`psql`/`pg_dump` client on this machine that Neon 18.6 will talk to. Keeping a second copy in sync
cost more than it returned while there was no published site to protect. See `AGENTS.md`
§ "Stack, deploy, local DB" — `push: false` is what makes pointing dev at production survivable.

### All project docs live under `context/`

No root `docs/`. The live-site scrape sits at `context/foundation/live-site-snapshot/`.

## The two things most likely to bite

**1. URL preservation.** Decided 2026-09-02 — paths live as a localized Payload `slug` field; see
`tech-stack.md` `## i18n`. What remains is mechanical and easy to get wrong: the canonical host is
`www.`, every address carries a trailing slash (`trailingSlash: true` required), and the twelve are
enumerated in `url-map.md`. Because slugs now live in the CMS, they are editable — the guardrail
depends on `url-map.md` being tested against, not trusted.

**2. ~~Photo attachments cannot use the existing lead intake.~~** Resolved. The obstacle was real —
the leads app's intake took a flat set of text answers with nowhere to put a file — and it was
removed by editing that repo, under a carve-out the owner granted 2026-09-21. The wire now carries
blob URLs rather than multipart, so the 4.5 MB function-body cap never applies, and the leads app
owns the stored files. What survives as a standing rule: **the leads app is still a separate
product**, and the carve-out was scoped to the `lead-delivery` change alone.

## Current state

**The site is built and in production** at `wykonczymylanding26.vercel.app`, behind a deliberate
noindex — wykonczymy.com.pl is still WordPress and this host must not compete with it in the index.
Home, Realizacje (listing + per-project pages), Wykończenia (listing + per-style pages), Kontakt and
the legal pages all render from the CMS. The footer carries a contact form under every page; a
submission is queued and forwarded to the leads app, with photo attachments.

**Every roadmap slice but one is done.** F1, F2, S1–S7 are in production. **S8 — cutover — is the
only unstarted slice, and nothing blocks it.** Both open questions that gated cutover closed in
September: where the retired pricing addresses lead (answered in code 2026-09-04), and where
submissions land today (owner, 2026-09-21 — the leads app and nowhere else).

```
src/
  payload.config.ts       localization pl/en, seo plugin, blob storage, push: false
  collections/            Pages, Projects, InteriorStyles, Submissions, Media, Users
  globals/                Footer.ts — contact block, ratings, socials
  app/(frontend)/
    [[...segments]]/      one catch-all route resolving every public address
    (lab)/                dev-only surfaces, 404'd in production by the group layout
  app/api/cron/           deliver-pending — retries the submission queue
  lib/content/            the CMS tier; every other lib/ module is Payload-free
  lib/contact/            envelope signing + forward() to the leads app
  migrations/             24 migrations, initial → 20260921_170759_process_steps
tests/                    unit + int (vitest) + e2e (playwright), serialized by a machine-wide lock
```

**Not in the roadmap but shipped:** cookie consent (`@c15t/nextjs`), the privacy-policy and cookies
pages, and Vercel Analytics gated on that consent. They surfaced during the tdg port — a third-party
script needs consent to exist before it runs, not after.

**One database, pointed at from every environment including your laptop.** `POSTGRES_URL` names
production; `push: false` is what makes that survivable, since schema only moves by a migration a
human applies. **The database is the only copy of the content** — seeding was removed 2026-09-19.
Take a dump before anything destructive. The Docker Postgres on 5436 is now the *test* database and
the only `psql` client on this machine.

**Two planes, deliberately separated.** Vercel deploys code; `payload migrate` owns schema. `build`
does **not** migrate — a build that migrated would let a preview branch rewrite production. Schema
goes up first, by hand: `pnpm db:migrate:prod`, run by a human, never an agent.

Also at the root: `AGENTS.md` (canonical agent onboarding) and `CLAUDE.md` (a thin importer of it).

## Next steps

1. **S8 — cutover.** Write the FR-037 assertions over all twelve addresses in `url-map.md`
   (`tests/e2e/frontend.e2e.spec.ts` covers the redirects and the trailing slash today, but does not
   enumerate the twelve), verify a live submission, flip `SEARCH_INDEXING_ENABLED` in
   `src/lib/seo/constants.ts`, then DNS onto the `www` canonical host.
2. **After DNS: EX-853** — five env vars across the two projects still name `*.vercel.app` hosts,
   two of them failing silently. `NEXT_PUBLIC_SERVER_URL` is build-time, so it needs a redeploy.
3. **Decisions owed, none blocking** — "O nas" (its own page or a home section; nothing is ported
   until it is settled), file limits and retention (OQ 2 / OQ 7), and ratifying where the four
   retired addresses land.
4. **Housekeeping** — `2026-09-04-tdg-port` has no `change.md`, so its gate was never armed and
   `/10x-archive` refuses it. Everything else is in `context/foundation/todo.md`, which is the
   working index; this file is the orientation.

## Open questions

Four of the original eleven are still open, recorded in `prd.md` under `## Open Questions`:
the exact form question list (1), file limits (2), photo and contact-detail retention (7), and
whether the 16 old gallery photos get retrofitted with project pages (11). **None blocks cutover
and none blocks building** — all four are content or policy calls.

The one that did block cutover — **where contact form submissions actually land today** (OQ 5) —
closed 2026-09-21: the leads app's `notification-recipients` global and nothing else, with nothing
configured in WordPress. The old form dies with the old site, so no submission path survives cutover
to be preserved.
