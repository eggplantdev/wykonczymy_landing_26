---
project: wykonczymy-www
generated: 2026-09-02
source_prd: context/foundation/prd.md
main_goal: low-complexity
north_star: S2 — a real quote submission reaches the leads app
top_blocker: decisions
---

# Roadmap — wykonczymy.com.pl replatform

Vertical, user-visible slices in dependency order. **No estimates, no dates, no sizes** — agentic
execution is non-linear and a number here would lie. Ordering is by dependency and by goal.

Feed a slice into `/10x-plan <change-id>`. A slice may spawn more than one change if the plan step
finds it still too broad; that is expected and not a defect in this file.

## Framing

**Main goal — `low-complexity`.** `timeline_budget: null`, `target_scale: small`, and the PRD's own
framing: *"Success is parity plus control, not a lift in a metric."* No handover-proofing, no role
split, no conversion programme. Build the thinnest thing that preserves the twelve addresses and
delivers a lead, then add. Consequence: **no observability slice.** That is the only thing this
goal actually removes — see `## Environments` for why "no staging" was never a trade-off here.

The risk-averse guardrails (*"No lead is lost"*, *"Search positions do not drop"*) do not argue for
a different posture, because they are already concrete requirements — FR-037 and the live-submission
gate. They appear below as slices, not as a global stance.

**North star — S2.** From the PRD's primary success criteria: *"An actual submission through the
live form is proven to reach the leads app before cutover — a human fills in the real form on the
new site, sends it, and the complete request is confirmed present in the leads app. Not a mock, not
a unit test, not a staging stub."* Nothing else in the PRD competes for this slot.

**Top blocker — `decisions`.** Nine unresolved Open Questions, over the ≥3 threshold. They cluster
on **content** (form fields, file limits, retention, where Cennik's traffic goes) rather than on
engineering, which is why almost nothing here is hard-blocked — see `## Open question routing`.

## Baseline

Verified 2026-09-02: `find` returns zero `.ts` / `.tsx` / `package.json` in the tree. Every layer is
absent in code and declared in `tech-stack.md`.

| Layer | State | Note |
|---|---|---|
| Frontend | absent | per `tech-stack.md`: Next App Router, React 19, Tailwind 4 |
| Backend / API | absent | per `tech-stack.md`: Payload 3 at `src/app/(payload)` |
| Data | absent | `docker-compose.yml` exists (`postgres:17-alpine`, port 5436); nothing connects to it |
| Auth | absent | Payload admin auth, one account. No public auth, ever (PRD non-goal) |
| Deploy / infra | absent | per `tech-stack.md`: Vercel, same account as the leads app |
| Observability | absent | **not declared anywhere** — a real gap, deliberately not filled at this goal |
| Environments | absent | Vercel preview deploys are the staging tier; see `## Environments` |

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

| ID | Slice | Status | Depends on | Parallel with |
|---|---|---|---|---|
| F1 | Scaffold, local DB, first deploy | **done** | — | — |
| F2 | Localization spine + localized `slug` | proposed | F1 | — |
| S1 | One page live at its indexed address, PL + EN | proposed | F2 | — |
| S2 | **Quote form reaches the leads app** (north star) | blocked | S1 | S3, S4, S5 |
| S3 | Remaining carried pages | proposed | S1 | S2, S4, S5 |
| S4 | Completed projects — listing + project pages | proposed | S1 | S2, S3, S5 |
| S5 | Testimonials and the shared content lists | proposed | S1 | S2, S3, S4 |
| S6 | Photo attachments on the form | blocked | S2 | — |
| S7 | SEO surface — sitemap, hreflang, canonical, metadata | proposed | S3, S4 | S6 |
| S8 | Cutover — url-map test green, redirects, DNS | blocked | S2, S7 | — |

**Parallel band:** once S1 lands, S2 / S3 / S4 / S5 touch different collections and different routes.
Four separate agent runs can take them concurrently. S7 needs the route tree complete, so it closes
the band rather than joining it.

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

**Status:** proposed · **Change ID:** `f2-i18n-spine` · **Depends on:** F1

Payload `localization: { locales: ['pl','en'] }`, a `Pages` collection whose native `slug` field is
`localized: true`, and the App Router resolving `[locale]/[slug]` against it via
`generateStaticParams`. Plus `trailingSlash: true` and the `www` canonical host.

**Why it is Foundations and not a slice:** it decides the shape of every URL on the site. Getting it
after three pages exist means rewriting three pages.

**Also lands here:** wiring `@payloadcms/plugin-redirects`. It is installed but cannot be configured
without a target collection for its `to.reference` field, so it waits for `Pages`.

**Unknowns:**
- Which fields are localized versus shared, per collection. Resolved while modelling (OQ 10).
- Where the `pl`/`en` UI-chrome dictionary lives. A small typed object in code — `tech-stack.md`
  problem 3. Not architectural.

**Landmine:** `trailingSlash: true` is not optional. Every one of the twelve indexed addresses ends
in a slash and Next strips it by default. Omit it and all twelve break at once.

## Slices

### S1 — One page live at its indexed address, PL + EN

**Status:** proposed · **Change ID:** `s1-first-page` · **Depends on:** F2

The home page, its copy in the CMS, rendering at `/` and `/en/home/` — the real indexed pair, not a
placeholder route. Markup lifted from tdg (Tailwind 3→4 class migration, `WpImageT` → Payload media
retyping).

**User-visible outcome:** a visitor loads the real home page in either language and the language
switcher moves between the translated addresses.

**Why this is one slice and not "the home page":** its value is proving the localized-slug routing
end-to-end on a real address before four other slices depend on it. If the F2 decision is wrong,
this is where it surfaces — cheaply.

**Unknowns:** none blocking. The tdg markup exists; the copy is in `live-site-snapshot/`.

### S2 — Quote form reaches the leads app (north star)

**Status:** blocked · **Change ID:** `s2-quote-form` · **Depends on:** S1 · **Parallel with:** S3, S4, S5

Text-only submission: TanStack Form + Zod, explicit consent capture, bot refusal (FR-036),
idempotency on retry/double-click, confirmation to the visitor (FR-033), and a plain failure message
with the phone number when delivery fails (FR-034). **Files are deliberately not in this slice** —
they are S6.

**User-visible outcome:** the PRD's primary success criterion, satisfied literally — a human fills in
the real form on the deployed site and the complete request is confirmed present in the leads app.

**Why it is blocked, and by what:** **Open Question 5 — where form submissions actually land today.**
This slice preserves current lead delivery, and the current behaviour is the thing being preserved.
Believed to be the business e-mail plus the leads app, but the WordPress site may also record them
elsewhere. Building against a guess risks silently dropping a delivery channel — the exact defect
class the guardrail exists to prevent.

**Unblocking action:** confirm the WordPress form's delivery targets. Owner: user.

**Also unknown, not blocking:** the exact question list (OQ 1). Build the delivery path against the
current field set; adding questions later is a field addition, not a rework.

**Note on ordering:** everything except the final live verification can be built while OQ 5 is open.
The block is on *declaring the slice done*, not on starting it.

### S3 — Remaining carried pages

**Status:** proposed · **Change ID:** `s3-carried-pages` · **Depends on:** S1 · **Parallel with:** S2, S4, S5

Oferta, Wykończenia, Kontakt — copy in the CMS, both languages, each at its existing indexed pair.
Markup lifted from tdg. Contact page carries the tel: link (FR-010).

**User-visible outcome:** four of the five carried pages exist at their real addresses in both
languages. Only Realizacje (S4) is missing.

**Unknowns:** none blocking. `live-site-snapshot/scraped-content.md` is 2026-03-04, so **spot-check
copy against the live site** — the PRD flags prices in particular as possibly moved.

### S4 — Completed projects: listing + individual project pages

**Status:** proposed · **Change ID:** `s4-projects` · **Depends on:** S1 · **Parallel with:** S2, S3, S5

The one structural change to the old site: `/realizacje/` keeps its address but becomes a listing of
individually addressable projects (FR-007) instead of a flat gallery. A `Projects` collection with
photos, description and its own localized slug (FR-008, FR-016).

**User-visible outcome:** a visitor opens a single completed project at its own address. The
business adds one from the admin, in both languages, without a developer.

**Carries the secondary success criterion:** project pages are the thing that can rank for specific
local searches which today have nowhere to land.

**Unknowns:**
- **OQ 11 — do the 16 existing gallery photos get retrofitted with project pages?** FR-009 currently
  says no: pages exist for new projects only, old photos stay a gallery. Reversing it is content
  labour, not engineering, so it does not block the build. Build for FR-009 as written.

### S5 — Testimonials and the shared content lists

**Status:** proposed · **Change ID:** `s5-content-lists` · **Depends on:** S1 · **Parallel with:** S2, S3, S4

The content that is reused across pages rather than owned by one: 6 testimonials (FR-005, FR-018),
12 service cards, the 12 interior styles, and the 70+ item "Wykonujemy także" list. All in the CMS,
all localized, all rendered into fixed slots in code.

**User-visible outcome:** the business edits a testimonial or a service card in the admin and it
changes everywhere it appears.

**Why it is separate from S3:** these are shared collections, not page copy. Modelled once, consumed
by several pages. Merging it into S3 would put collection design inside a page-building slice.

**Unknowns:** the collection-versus-global split per list, and which fields localize (OQ 10). A
modelling detail resolved during the work, not a gate on it.

### S6 — Photo attachments on the form

**Status:** blocked · **Change ID:** `s6-attachments` · **Depends on:** S2

FR-031 plus its client-side guards: type and size refused *before* the visitor waits through an
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

**Status:** proposed · **Change ID:** `s7-seo` · **Depends on:** S3, S4

Sitemap covering both languages (FR-013), per-page title, description, canonical, and correct
`hreflang` pairing between the Polish and English addresses (FR-014).

**User-visible outcome:** invisible to visitors, load-bearing for the *"search positions do not
drop"* guardrail.

**Why it closes the parallel band:** it enumerates every route, so it needs the route tree complete.

**Unknowns:** none. The PL↔EN pairs are enumerated in `url-map.md`.

### S8 — Cutover

**Status:** blocked · **Change ID:** `s8-cutover` · **Depends on:** S2, S7

The FR-037 test asserting every address in `url-map.md` resolves; `301`s for Cennik's two retired
addresses; the live-submission verification; DNS switch to the new site on the `www` canonical host.

**User-visible outcome:** wykonczymy.com.pl is the new site, and no address that existed before is
dead.

**Why it is blocked, and by what:** **Open Question 3 — where Cennik's two retired addresses lead.**
`/cennik/` and `/en/price-list/` are the only `UNDECIDED` rows in `url-map.md`. Candidates are the
services page, the contact page, or the home page. This determines whether high-intent pricing
traffic is retained or discarded, and the map cannot be complete without it.

Also carries **Open Question 4** — whether Cennik's removal is final. Recorded as the owner's
intention, expressed as probable rather than settled. If it stays, two success criteria and one
guardrail change, and this slice grows a page.

**Unblocking action:** pick the two redirect targets. Owner: user.

**FR-037 is not deferrable to this slice.** Write the url-map test as soon as S1 lands, with the
twelve addresses hardcoded from `url-map.md` — it is the guardrail that replaced the dropped role
split, and it should fail loudly on every slice that touches routing, not only at the end.

## Open question routing

Nine open, routed to where they are resolvable. Only one blocks cutover.

| # | Question | Blocks | Resolve during |
|---|---|---|---|
| 1 | Exact form question list | no | S2 — build against today's fields, add later |
| 2 | File limits (types, size, count) | no | S6 — with the leads-app contract |
| 3 | Where Cennik's two addresses lead | **before cutover** | S8 — owner decision, needed for `url-map.md` |
| 4 | Is Cennik's removal final? | no | S8 |
| 5 | Where submissions land today | **before cutover** | S2 — owner confirmation, gates "done" not "start" |
| 6 | How attachments reach and persist | no | S6 — leads-app work |
| 7 | Retention period for photos and contact details | no | S6 — a policy decision, not a build one |
| 10 | Collection versus global, which fields localize | no | F2 / S5 — modelling detail |
| 11 | Retrofit old gallery photos with project pages? | no | S4 — content labour, build FR-009 as written |

**Resolved, recorded for provenance:** OQ 8 (page set — five carried, Cennik retired, plus project
pages) and OQ 9 (no editor/admin split — one account, slug guardrail moved to FR-037). Both
2026-09-02.

## Done

_Empty. `/10x-archive` is the sole writer of this section._
