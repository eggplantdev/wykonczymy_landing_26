---
project: wykonczymy-www
status: decided
decided_on: 2026-09-02
deployment_target: vercel
package_manager: pnpm
---

# Tech stack

**The stack was not chosen by a selection process.** The owner had already decided on Payload + Next
before this project started. What follows is that decision written down, plus the layer choices
derived from it — so treat a row as a *recorded decision of varying confidence*, not an evaluated
trade-off. A row with no rationale attached has not been argued; say so rather than inheriting it.

**The reference repos are precedent, not a bill of materials.** Chaos Kitchen shows *how* things are
done on this stack; tdg holds markup. Neither one's `package.json` is a shopping list. **No
dependency is installed until a requirement in the PRD needs it** — "the reference repo has it" is
not a reason, and neither is "the component we're lifting used it".

> Deliberately not conforming to `/10x-tech-stack-selector`'s hand-off schema — its registry has no
> Payload entry, so a conformant file would need an invented `starter_id`. Don't "fix" it.

## Layers

**Install latest *mature*.** Where a major version appears below it is a *decision* (Payload 3's
`src/` ownership, Tailwind 4's CSS config, React 19). Everything else takes whatever is current when
it is installed — do not copy version numbers out of the reference repos, they are only a snapshot
of what those projects happened to have.

**"Current" excludes packages published in the last 24 hours.** `pnpm-workspace.yaml` sets
`minimumReleaseAge: 1440`, and Vercel's pnpm enforces it against the lockfile — the first production
deploy died on `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` because `pnpm add` had pinned five
hours-old versions with no older fallback in range. Widen the ranges `pnpm add` writes. Full account
in `stack-template.md`.

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js, App Router | Latest. React 19+ |
| CMS / backend | Payload (`@payloadcms/next`) | Latest. Mounted at `src/app/(payload)`; Payload owns the `src/` layout |
| Database | Postgres | `@payloadcms/db-vercel-postgres` |
| — local dev | Docker, `postgres:17-alpine` | Pinned deliberately — dev/prod parity. **Port 5436**, see below |
| — production | Neon, via Vercel | |
| Media storage | Vercel Blob | `@payloadcms/storage-vercel-blob` |
| Email | Nodemailer via Payload adapter | `@payloadcms/email-nodemailer` + SMTP. Attached only when `SMTP_HOST` is set — otherwise Payload logs to console and local builds stay quiet |
| Rich text | Lexical | `@payloadcms/richtext-lexical` |
| Forms | **TanStack Form + Zod** | `@tanstack/react-form` + `zod`. Chaos Kitchen uses the same, so its form code ports |
| Styling | **Tailwind 4+** | `@tailwindcss/postcss` — CSS-based config, not `tailwind.config.js`. Major version is the decision; take the latest within it |
| Animation | GSAP | `framer-motion` also an option |
| E2E tests | Playwright | Plus `@playwright/mcp` wired via `.mcp.json` |
| Unit / integration tests | **Vitest** | `vitest` + `jsdom` + `@testing-library/react`, as `create-payload-app` ships it. Chaos Kitchen's `node --import tsx --test` is precedent, not a requirement |
| Package manager | **pnpm** | Matches the leads app. Chaos Kitchen is on npm — its `db:*` scripts need `npm run` → `pnpm` on the way in |
| Hosting | Vercel | Same account as the leads app — deliberate |
| SEO metadata | `@payloadcms/plugin-seo` | Per-page title / description / image, for FR-014 |
| Tooling | ESLint, Prettier | `husky` not installed — add it if a hook is actually wanted |

## Local database port

`5436`. The three lower ports are already taken on this machine:

| Port | Container |
|---|---|
| 5433 | `wykonczymy` — leads app |
| 5434 | `chef-cms` — Chaos Kitchen |
| 5435 | `wykonczymy-test` — leads app test db |
| **5436** | **`landing26-cms` — this project** |

Committed in `docker-compose.yml` and `.env.example`.

**Scaffolded 2026-09-02** at Payload 3.88.0 / Next 16.3.3 / React 19.2.6. `-a claude` is a real
flag despite being absent from the CLI README — it installed Payload's skill at
`.claude/skills/payload/`.

The connection string is **`POSTGRES_URL`**, which is both what `payload.config.ts` reads and what
Vercel's Neon integration injects, so production needs no extra wiring. `PROD_POSTGRES_URL` exists
only for `db:dump` pulling production data down to the local container.

## Scaffold command

`create-payload-app` requires a TTY and cannot be run by an agent — the owner runs it:

```
cd /Users/konradantonik/workspace/yolo
npx create-payload-app@latest -n _payload_scaffold -t blank --use-pnpm -a claude
```

Choose **Postgres**. Connection string: `postgres://landing26:landing26@localhost:5436/landing26`.
Scaffolds to a temp dir because `landing_26` is non-empty (the generator refuses); merge in afterwards.
`-a claude` installs Payload's own Claude skill.

## Two migration frictions when lifting from tdg

1. **Tailwind 3.4 → 4.** tdg is on 3.4 with a `tailwind.config.js`; this project is on 4, which moves
   config into CSS. Lifted markup needs class migration, not copy-paste.
2. **`WpImageT` → Payload media.** Every tdg component that renders an image types its prop against
   the WordPress image shape. Each one must be retyped on the way in. Unavoidable in any approach —
   it is the same work whether files are copied or edited in place.

GSAP is the good news: tdg already uses it and so does Chaos Kitchen, so animation logic ports
directly.

## i18n — decided 2026-09-02

Three separate problems, previously collapsed into one. Payload only solves the first.

| # | Problem | Owner |
|---|---|---|
| 1 | Content in two languages | Payload `localization` + `localized: true` fields |
| 2 | Which URL loads which document | **Payload localized `slug` field**, resolved in the App Router |
| 3 | UI chrome — nav labels, buttons, validation messages | A small typed `pl`/`en` dictionary in code |

**Paths live in the CMS.** One Pages document carries `slug: 'oferta'` for `pl` and `slug: 'offer'`
for `en`; the route resolves `[locale]/[slug]` against it. Payload's `slug` field type is native and
can be `localized`, so this needs no invention. Rejected: a static path table in code (loses the
ability to add a page without a deploy) and next-intl owning routing (a second source of path truth
that has to stay in sync with Payload's content).

**Problem 3 — decided 2026-09-02: a hand-rolled typed dictionary, no i18n library.** The surface
is a couple of dozen strings (nav labels, buttons, form validation), all authored by the developer,
in exactly two locales that are known at build time. `next-intl` in messages-only mode would buy
ICU plurals, message extraction and a locale negotiator — none of which this site needs — in
exchange for a dependency and a second place a translator has to look. A `Record<Locale, ...>`
object gives full type-checking of every key with no runtime. Revisit if a third locale lands or if
non-developers start editing chrome strings; at that point the strings become content and belong in
Payload, not in a library.

Chaos Kitchen configures problem 1 and never built 2 or 3 — that is the whole of its "gap", not an
incompatibility.

**Two costs this choice buys, both of which need handling:**

1. **Cutover-critical URLs become editable in the admin.** The twelve indexed addresses are a
   preservation guardrail, and a slug is now a text field someone can change. Mitigate deliberately
   — the `slug` field should be admin-only or read-only for editors (ties to PRD Open Question 9),
   and `url-map.md` is the spec to test against, not a historical note.
2. **Route resolution hits the database.** Acceptable only because pages are statically generated —
   `generateStaticParams` resolves the slugs at build time, so there is no per-request lookup. If a
   route ever becomes dynamic, this decision needs revisiting.

**Still to decide before the route tree:** `trailingSlash: true` is required in the Next config —
every indexed address ends in a slash and Next strips it by default. See `url-map.md`.

## Content model — fixed structures, no block builder

**All content data lives in the CMS.** Copy, images, prices, list items — every one is a Payload
field, nothing is hardcoded in a component. What is fixed is the *structure*: page layout and
components are code, and **Payload's blocks / layout-builder machinery is not used** — not for
editors, not for the developer. Each page is a fixed layout whose data comes from named, typed
fields; the admin fills slots, it never arranges them.

Consequences for the content model: no `blocks` field for page composition, no visual page builder,
and every content field carries a concrete type rather than an open-ended array of variants. A page
that needs a new section gets a new field and a deploy — that is the intended cost.

## Not installed

**`@payloadcms/plugin-redirects`.** Considered and rejected. The only redirects this site needs are
Cennik's two retired addresses, decided once at cutover and never edited again — six lines of
`redirects()` in `next.config.ts`, served by Vercel at the edge without touching the app or the
database. The plugin would add a dependency, a collection, a table, and still require middleware to
read the rows. A permanent 301 for a deleted page is not content.

Swiper and `lottie-react` appear in tdg. **Neither is adopted.** They arrive only if a carried
component genuinely needs a carousel or a Lottie animation and the need survives the question "can
this be built on GSAP and what's already here?" — decided per component, at the point of lifting,
not up front. The same test applies to anything else found in a reference repo's dependencies.
