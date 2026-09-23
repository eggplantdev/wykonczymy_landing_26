---
project: wykonczymy-www
generated: 2026-09-02
updated: 2026-09-23
source_prd: context/foundation/prd.md
main_goal: low-complexity
north_star: S2 — a real contact form submission reaches the leads app (reached 2026-09-22)
top_blocker: none — S8 is the only unstarted slice and nothing gates it
---

# Roadmap — wykonczymy.com.pl replatform

Vertical, user-visible slices in dependency order. **No estimates, no dates, no sizes** — agentic
execution is non-linear and a number here would lie. Ordering is by dependency and by goal.

Feed a slice into `/10x-plan <change-id>`. A slice may spawn more than one change if the plan step
finds it still too broad; that is expected and not a defect in this file.

## Framing

**Main goal — `low-complexity`.** `timeline_budget: null`, `target_scale: small`, and the PRD's own
framing: _"Success is parity plus control, not a lift in a metric."_ No handover-proofing, no role
split, no conversion programme. Build the thinnest thing that preserves the twelve addresses and
delivers a lead, then add. Consequence: **no observability slice.** That is the only thing this
goal actually removes — see `## Environments` for why "no staging" was never a trade-off here.

The risk-averse guardrails (_"No lead is lost"_, _"Search positions do not drop"_) do not argue for
a different posture, because they are already concrete requirements — FR-037 and the live-submission
gate. They appear below as slices, not as a global stance.

**North star — S2.** From the PRD's primary success criteria: _"An actual submission through the
live form is proven to reach the leads app before cutover — a human fills in the real form on the
new site, sends it, and the complete request is confirmed present in the leads app. Not a mock, not
a unit test, not a staging stub."_ Nothing else in the PRD competes for this slot.

~~**Top blocker — `decisions`.**~~ Was nine unresolved Open Questions, clustered on content rather
than engineering. Four remain and none blocks anything — both cutover blockers (OQ 3, OQ 5) closed
in September. See `## Open question routing`.

## Baseline

First measured 2026-09-02, when `find` returned zero `.ts` / `.tsx` / `package.json`. **F1 has since
landed**, so the "at F1 start" column is history — the live picture is `project-state.md`
`## Current state`.

| Layer          | At F1 start | Now (2026-09-23)                                                                                     |
| -------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| Frontend       | absent      | Next App Router, React 19, Tailwind 4. Every page renders from the CMS through one catch-all route   |
| Backend / API  | absent      | Payload 3 at `src/app/(payload)`; Pages, Projects, InteriorStyles, Submissions, Media, Users + Footer global |
| Data           | absent      | Neon everywhere including dev; `postgres:18-alpine` on 5436 is the **test** database                 |
| Auth           | absent      | Payload admin auth, one account. No public auth, ever (PRD non-goal)                                 |
| Deploy / infra | absent      | Vercel, deployed from GitHub `main`, same account as the leads app                                   |
| Observability  | absent      | **still absent** — deliberate at this goal. EX-852 is the one filed gap (a failing cron is silent)   |
| Environments   | absent      | Vercel preview deploys are the staging tier; see below                                               |

The one existing integration point is external: the **leads app** (`/workspace/yolo/wykonczymy`), a
separate product this project does not own.

## Environments

**Vercel preview deployments are staging.** Every non-production branch push gets a deployed URL on
the real build and the real runtime, and environment variables are scoped per environment
(Production / Preview / Development) — so Preview can hold its own `DATABASE_URI` and its own Blob
token. With Neon branching, a preview deploy can get its own database branch. There is no separate
staging tier to build and none is missing.

**The one thing a preview cannot isolate is the leads app** — a single production instance, so a
test submission writes a real lead row. Not a problem: the developer owns that app too and deletes
the row. S2's north-star check sends the real form once and verifies it arrived. Do not build a test
flag, a second leads-app deployment, or any other isolation machinery for this.

## At a glance

| ID  | Slice                                                | Status   | Depends on | Parallel with |
| --- | ---------------------------------------------------- | -------- | ---------- | ------------- |
| F1  | Scaffold, local DB, first deploy                     | **done** | —          | —             |
| F2  | Localization spine + localized `slug`                | done     | F1         | —             |
| S1  | One page live at its indexed address, PL + EN        | done     | F2         | —             |
| S2  | **Contact form reaches the leads app** (north star)  | done      | S1        | S3, S4, S5    |
| S3  | Remaining carried pages                              | done     | S1         | S2, S4, S5    |
| S4  | Completed projects — listing + project pages         | done     | S1         | S2, S3, S5    |
| S5  | Testimonials and the shared content lists            | done     | S1         | S2, S3, S4    |
| S6  | Photo attachments on the form                        | done      | S2        | —             |
| S7  | SEO surface — sitemap, hreflang, canonical, metadata | done      | S3, S4    | S6            |
| S8  | Cutover — url-map test green, redirects, DNS         | ready    | S2, S7     | —             |

**The parallel band is history.** It planned for S2 / S3 / S4 / S5 running as four concurrent agent
runs on different collections and routes. In the event S3 / S4 / S5 were carried across together in
`2026-09-04-tdg-port` and only S2 ran separately. Recorded because the table above still reads as a
plan; only S8 is unstarted.

## Foundations

Derived from the baseline (everything absent) and `tech-stack.md`. Kept to two slices because the
goal is `low-complexity` — no observability slot, no staging environment, no CI beyond what Vercel
gives for free.

### F1 — Scaffold, local DB, first deploy

**Status:** done (2026-09-02) · **Change ID:** `f1-scaffold`

Payload 3 + Next running locally against Postgres in Docker on port 5436, and one successful deploy
to Vercel. Adapters swapped to `db-vercel-postgres`, `storage-vercel-blob` and the nodemailer
adapter. `.mcp.json` for Playwright and the `db:up` / `db:dump` / `db:import` scripts, modelled on
Chaos Kitchen with `npm run` swapped for `pnpm`.

**User-visible outcome:** the admin panel opens, at a URL, with the one account.

**Prerequisite the agent cannot do:** `create-payload-app` needs a TTY. The owner runs it — command
in `tech-stack.md`. Everything after the merge is agent work.

**Unknowns:** none. Every choice here is already recorded in `tech-stack.md`.

### F2 — Localization spine + localized `slug`

**Status:** done · **Change ID:** `f2-i18n-spine` · **Depends on:** F1

Payload `localization: { locales: ['pl','en'] }`, a `Pages` collection whose native `slug` field is
`localized: true`, and the App Router resolving `[locale]/[slug]` against it via
`generateStaticParams`. Plus `trailingSlash: true` and the `www` canonical host.

**Why it is Foundations and not a slice:** it decides the shape of every URL on the site. Getting it
after three pages exist means rewriting three pages.

**Unknowns:**

- Which fields are localized versus shared, per collection. Resolved while modelling (OQ 10).
- Where the `pl`/`en` UI-chrome dictionary lives. A small typed object in code — `tech-stack.md`
  problem 3. Not architectural.

**Deferred out of the F2 review gate** (see `context/archive/2026-09-03-f2-i18n-spine/review-gate.md`;
tracked here because the Linear MCP was unreachable in that session). Two of the four have since
closed — left in place with their outcome so the gate's ledger stays readable:

- ~~**DB backing for the slug guard.**~~ Shipped 2026-09-04 in migration
  `20260904_171708_seo_meta_and_slug_unique`: `pages_slug_idx`, `projects_slug_idx` and
  `interior_styles_slug_idx` are now `UNIQUE` on `(slug, _locale)`, so the app-level validator is
  no longer the only guard. (The `is_home` partial index this originally also asked for is moot —
  `2c87523` dropped the column in favour of `pageType === 'home'`.)
- ~~**`alternates.canonical` + hreflang, and seoPlugin fields in `generateMetadata`.**~~ Shipped
  with S7 — `context/archive/2026-09-20-s7-seo/`.
- **Locale-aware 404 and root `<html lang>`.** `not-found.tsx` sniffs the locale from
  `usePathname`, so the prerendered shell is Polish on `/en/` and hydration swaps it;
  `src/app/(frontend)/layout.tsx:32` hardcodes `lang="pl"`, which contradicts the `hrefLang="en"`
  S7 emits for the same document. `translations-provider.tsx` corrects the live DOM, so only a
  crawler sees it. One routing decision — a catch-all layout cannot see the locale.
  Test disposition: TDD · e2e, travels with the fix.
- **`/en/home/` is hardcoded in `next.config.ts`'s redirect** while the EN home slug is a
  CMS-editable field; renaming it silently breaks an indexed redirect.

**Landmine:** `trailingSlash: true` is not optional. Every one of the twelve indexed addresses ends
in a slash and Next strips it by default. Omit it and all twelve break at once.

## Slices

### S1 — One page live at its indexed address, PL + EN

**Status:** done · **Change ID:** `2026-09-04-tdg-port` · **Depends on:** F2

The home page, its copy in the CMS, rendering at `/` and `/en/home/` — the real indexed pair, not a
placeholder route. Markup lifted from tdg (Tailwind 3→4 class migration, `WpImageT` → Payload media
retyping).

**Delivered inside `2026-09-04-tdg-port`, not as its own change folder** — S1, S3, S4 and S5 were
all carried across in one port of tdg's markup, so none of them has a `change.md` and none went
through the gate individually. The port's ledger is
`context/changes/2026-09-04-tdg-port/review-gate.md`, which reviewed all of `src/` as one slice.

**User-visible outcome:** a visitor loads the real home page in either language and the language
switcher moves between the translated addresses.

**Why this is one slice and not "the home page":** its value is proving the localized-slug routing
end-to-end on a real address before four other slices depend on it. If the F2 decision is wrong,
this is where it surfaces — cheaply.

**Unknowns:** none blocking. The tdg markup exists; the copy is in `live-site-snapshot/`.

### S2 — Contact form reaches the leads app (north star)

**Status:** done · **Change ID:** `2026-09-18-lead-delivery` (EX-802) · **Depends on:** S1 ·
**Parallel with:** S3, S4, S5

**Merged with S6 and delivered together.** The two stopped being separable once the wire contract
carried files from its first line, so the split below is history, not a plan. `s2-contact-form`
built the form and stopped short of a sink; `lead-delivery` gave it one. Remaining to reach *done*:
the manual checks in `manual-checks.md` § "EX-802 — lead delivery (landing_26 half)".

Text-only submission: explicit consent capture, bot refusal (FR-036),
idempotency on retry/double-click, confirmation to the visitor (FR-033), and a plain failure message
with the phone number when delivery fails (FR-034). **Files are deliberately not in this slice** —
they are S6.

**User-visible outcome:** the PRD's primary success criterion, satisfied literally — a human fills in
the real form on the deployed site and the complete request is confirmed present in the leads app.

**Open Question 5 is closed (2026-09-21, owner).** There is no delivery channel outside what is built
in the leads app — the notification recipients are that app's `notification-recipients` global and
nowhere else, and nothing is configured in WordPress. The old form dies with the old site, so no
submission path survives cutover to be preserved.

**Also unknown, not blocking:** the exact question list (OQ 1). Build the delivery path against the
current field set; adding questions later is a field addition, not a rework.

### S3 — Remaining carried pages

**Status:** done · **Change ID:** `2026-09-04-tdg-port` · **Depends on:** S1 · **Parallel with:** S2, S4, S5

Oferta, Wykończenia, Kontakt — copy in the CMS, both languages, each at its existing indexed pair.
Markup lifted from tdg. Contact page carries the tel: link (FR-010).

**User-visible outcome:** four of the five carried pages exist at their real addresses in both
languages. Only Realizacje (S4) is missing.

**Delivered:** Kontakt (`components/contact/contact-page.tsx`, postal block; phone and mail read
from the `footer` global) and Wykończenia. **Oferta was retired rather than built** — 2026-09-04,
its content became the home page's tiles — and Cennik was dropped 2026-09-21, so the "four of the
five carried pages" outcome above reads against a page set that no longer exists. Three carried
pages exist, plus the privacy policy and cookies pages, which no slice here predicted.

**Still open from the port:** **"O nas"** — its own page or a section on home — is undecided, and
nothing is ported until it is. → `context/changes/2026-09-04-tdg-port/todo.md`

**Outstanding content check:** `live-site-snapshot/scraped-content.md` is 2026-03-04, so **spot-check
copy against the live site** — the PRD flags prices in particular as possibly moved. This is the
owner's, not a build step.

### S4 — Completed projects: listing + individual project pages

**Status:** done · **Change ID:** `2026-09-04-tdg-port` · **Depends on:** S1 · **Parallel with:** S2, S3, S5

The one structural change to the old site: `/realizacje/` keeps its address but becomes a listing of
individually addressable projects (FR-007) instead of a flat gallery. A `Projects` collection with
photos, description and its own localized slug (FR-008, FR-016).

**User-visible outcome:** a visitor opens a single completed project at its own address. The
business adds one from the admin, in both languages, without a developer.

**Carries the secondary success criterion:** project pages are the thing that can rank for specific
local searches which today have nowhere to land.

**Unknowns:**

**Delivered:** `Projects` collection with a localized slug, `components/projects/projects-page.tsx`
for the listing and `project-page.tsx` for a job, both wired into the catch-all.

- **OQ 11 — do the 16 existing gallery photos get retrofitted with project pages?** Still open, and
  still not a build question. FR-009 was built as written: pages exist for new projects only.
  Reversing it is content labour. Owner's call.

### S5 — Testimonials and the shared content lists

**Status:** done · **Change ID:** `2026-09-04-tdg-port` · **Depends on:** S1 · **Parallel with:** S2, S3, S4

The content that is reused across pages rather than owned by one: 6 testimonials (FR-005, FR-018),
12 service cards, the 12 interior styles, and the 70+ item "Wykonujemy także" list. All in the CMS,
all localized, all rendered into fixed slots in code.

**User-visible outcome:** the business edits a testimonial or a service card in the admin and it
changes everywhere it appears.

**Why it is separate from S3:** these are shared collections, not page copy. Modelled once, consumed
by several pages. Merging it into S3 would put collection design inside a page-building slice.

**Delivered, and the split did not land where this slice guessed.** Testimonials became a `testimonials`
group on the home page's field group rather than a collection (decided 2026-09-17, migration
`20260917_160110_testimonials`) — one page owns them, so a collection bought nothing. The interior
styles are their own collection (`InteriorStyles.ts`, with child pages under `/wykonczenia/<slug>/`);
the service cards live on the home group; the footer's contact block and ratings are a `Footer`
global. **OQ 10 is closed by this** — the split is in the schema.

### S6 — Photo attachments on the form

**Status:** done · **Change ID:** `2026-09-18-lead-delivery` (EX-802) · **Depends on:** S2

**Merged into S2 and delivered with it** — and the block below is resolved, not still standing. The
leads app *was* the obstacle, and the mandate to edit it was granted 2026-09-21; the wire now carries
blob URLs rather than multipart, so the 4.5 MB function-body cap never applies.

FR-031 plus its client-side guards: type and size refused _before_ the visitor waits through an
upload that will be rejected (FR-035).

**Why it is blocked, and by what:** **this is not a slice this project can finish alone.** The leads
app's current intake accepts a flat set of text answers with nowhere to put a file. That is a fact
about the existing contract, not a preference — delivering FR-031 requires work **in
`/workspace/yolo/wykonczymy`**, a separate product with its own roadmap. Open Questions 2 (file
limits) and 6 (how attachments reach and persist) are both open.

**The judgement already recorded:** the receiving application should own the stored files, so a
request's photos do not depend on this site's storage outliving it.

**Unblocking action:** agree the extended intake contract with the leads app, and settle accepted
types / max size / max count. Owner: user. **Sequenced against this project, not owned by it** —
which is why it sits after the north star rather than inside it.

### S7 — SEO surface

**Status:** done · **Change ID:** `s7-seo` · **Depends on:** S3, S4

Sitemap covering both languages (FR-013), per-page title, description, canonical, and correct
`hreflang` pairing between the Polish and English addresses (FR-014).

**User-visible outcome:** invisible to visitors, load-bearing for the _"search positions do not
drop"_ guardrail.

**Why it closes the parallel band:** it enumerates every route, so it needs the route tree complete.

**Unknowns:** none. The PL↔EN pairs are enumerated in `url-map.md`.

### S8 — Cutover

**Status:** ready · **Change ID:** `s8-cutover` · **Depends on:** S2, S7

The FR-037 test asserting every address in `url-map.md` resolves; the live-submission verification;
flipping search indexing on; DNS switch to the new site on the `www` canonical host. The redirects
for the four retired addresses are **already shipped** — assert them rather than build them, and
assert `308`, which is what `permanent: true` emits.

**The noindex is one flag, not two edits.** `SEARCH_INDEXING_ENABLED` in `src/lib/seo/constants.ts`
is `false`, and `robots.ts` and `(frontend)/layout.tsx`'s `robots` metadata both read it — so
cutover flips one constant. They must flip together and a half-flip is silent, which is why they
were wired to one flag rather than two comments pointing at each other.

**FR-037 is not written yet.** `tests/e2e/frontend.e2e.spec.ts` covers the trailing-slash
normalisation, the four retired-address redirects, `/en` → `/en/home/`, and two 404 shapes — but it
does not enumerate the twelve. That enumeration is this slice's first task.

**User-visible outcome:** wykonczymy.com.pl is the new site, and no address that existed before is
dead.

**It is no longer blocked.** Open Question 3 — where the retired addresses lead — was answered in
code on 2026-09-04 and has been live in production ever since: `next.config.ts` sends `/oferta/` and
`/cennik/` to `/`, and `/en/offer/` and `/en/price-list/` to `/en/home/`. `url-map.md` went on
carrying `UNDECIDED` until 2026-09-22, which is the only reason this slice read as blocked. High-intent
pricing traffic lands on the home page, whose tiles are where Oferta's content went. What remains is
the owner **ratifying** that or naming a different target, which is one line in the redirects array —
not a precondition to starting the slice.

**Open Question 4 — whether Cennik's removal is final — is closed.** The owner dropped it
2026-09-21 and `url-map.md` records it: no page will be built. The address still answers, because a
dropped page and a retired address are different things.

**One loose end the port flagged:** `'price-list'` is still in `pageTypes` (`src/lib/routing.ts`)
while `/cennik/` redirects home, so a document created under that type would be unreachable from
the front end. Either drop the type or leave it deliberately — a decision for this slice.

**Unblocking action:** ratify where the four retired addresses land, or name different targets.
Owner: user. Nothing waits on it — they already answer.

## Open question routing

Four still open. **None blocks cutover** — the two that did have both closed.

| #   | Question                                        | Blocks | Resolve during                                |
| --- | ----------------------------------------------- | ------ | --------------------------------------------- |
| 1   | Exact form question list                        | no     | shipped against today's fields; adding a question is a field addition |
| 2   | File limits (types, size, count)                | no     | owner policy — the build does not wait        |
| 7   | Retention period for photos and contact details | no     | owner policy                                  |
| 11  | Retrofit old gallery photos with project pages? | no     | content labour; FR-009 built as written       |

**Closed, recorded for provenance:**

- **OQ 3 — where Cennik's two addresses lead.** Answered in code 2026-09-04 and live since: both go
  to the home page. What is left is the owner ratifying it, which nothing waits on.
- **OQ 4 — is Cennik's removal final?** Yes, 2026-09-21. No page will be built; the address still
  redirects.
- **OQ 5 — where submissions land today.** Closed 2026-09-21 by the owner: there is no delivery
  channel outside the leads app's `notification-recipients` global, and nothing is configured in
  WordPress. The old form dies with the old site. **This was the one cutover blocker.**
- **OQ 6 — how attachments reach and persist.** Settled by `lead-delivery`: the wire carries blob
  URLs and the leads app owns the stored files.
- **OQ 8** (page set) and **OQ 9** (no editor/admin split — one account, slug guardrail moved to
  FR-037), both 2026-09-02.
- **OQ 10 — collection versus global, which fields localize.** Closed by the schema; see S5.

## Done

- **F2: Localization spine + localized `slug`** — Archived 2026-09-03 → `context/archive/2026-09-03-f2-i18n-spine/`. Lesson: —.
- **S2: Contact form reaches the leads app (north star)** — Archived 2026-09-22 → `context/archive/2026-09-18-lead-delivery/`. Lesson: —.
- **S6: Photo attachments on the form** — Archived 2026-09-22 → `context/archive/2026-09-18-lead-delivery/`. Merged into S2 and delivered with it. Lesson: —.
- **S7: SEO surface — sitemap, hreflang, canonical, metadata** — Archived 2026-09-22 → `context/archive/2026-09-20-s7-seo/`. Lesson: a content script run from the CLI cannot purge the page cache — `revalidatePath` throws outside a request, so production keeps serving the old copy until the next deploy. Verify a CLI write against `pnpm dev`, which reads the database directly.
- **S1, S3, S4, S5** — in production, **not archived**. All four landed inside
  `context/changes/2026-09-04-tdg-port/`, which has no `change.md`, so `/10x-archive` refuses it and
  the gate was never armed per slice. Arming it (`/10x-new tdg-port`) or folding its two remaining
  items into this file is the housekeeping → `todo.md` § Debt.

**Not in this roadmap but shipped:** cookie consent (`@c15t/nextjs`, `src/components/cookies/`), the
privacy-policy and cookies pages, and Vercel Analytics gated on consent. They belong to no slice
here — they surfaced in the tdg port and were built because a third-party script needs consent to
exist before it does, not after.
