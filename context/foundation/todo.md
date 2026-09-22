# TODO — what is left

Compacted from `roadmap.md`, `manual-checks.md` and the open change folders on 2026-09-22. It is an
index, not a source: every line points at the document that holds the real detail, and that document
stays the place a claim is settled. Tick a box here only when the box it points at is ticked too.

Everything the roadmap calls a slice is built and in production. What remains is one slice (S8),
verification that needs a human or a dashboard, some decisions, and housekeeping.

## Blocks cutover

- [x] **OQ 3 — where the four retired addresses lead.** *Not a blocker; it never was one after
      2026-09-04.* `next.config.mjs` already sends `/oferta/` and `/cennik/` to `/`, and
      `/en/offer/` and `/en/price-list/` to `/en/home/`, and all four are live in production —
      probed 2026-09-22. `url-map.md` carried `UNDECIDED` for eighteen days after the code had
      decided, which is the only reason S8 looked blocked. What is left is the owner **ratifying**
      "everything lands on home" or naming a different target for the pricing pair, which is one
      line in the redirects array. → `url-map.md`
- [x] **Vercel Firewall rate limits exist on the project.** Server Action at 10/60s per IP with
      `path does not start with /admin`, `/api/blob/upload-token` at 60/60s. They live in the
      dashboard with **no representation in this repo** — rebuild the project and they are gone
      while every test still passes. → `manual-checks.md` § EX-802
- [ ] **The staged `leads/<submissionId>/` prefix disappears after a delivery.**
      `LANDING_CLEANUP_URL` was set on the leads app and it was redeployed on 2026-09-22, so the
      callback is wired; the landing's `/api/webhooks/landing-delivered/` answers `403` to a bad
      signature on the public alias, which is the proof it is reachable. What is still unproven is
      the round trip — it needs one real submission carrying a photo. → `manual-checks.md` § EX-802
- [x] **Both crons report `200`, not `308`.** `trailingSlash: true` puts a redirect ahead of
      `/api/*`; Vercel cron does not follow one and does not log it, so a missing slash is
      indistinguishable from a cron that never fired. → `manual-checks.md` § EX-802
- [ ] **Honeypot survives Chrome autofill.** The trap field is `website` because Chrome maps
      `company` to `organization` regardless of `autoComplete`. A false trip discards a real
      enquiry while showing the visitor a thank-you — silent on both sides, the worst failure this
      slice can have. → `manual-checks.md` § EX-802
- [ ] **S8 itself** — the FR-037 test over all twelve addresses in `url-map.md`, the two `301`s,
      removing the pre-cutover noindex from `robots.ts` and the layout, DNS onto the `www`
      canonical host. → `roadmap.md` § S8
- [ ] **Every env var still names a `*.vercel.app` host.** Five variables across the two projects,
      two of which fail silently; `NEXT_PUBLIC_SERVER_URL` is build-time, so it needs a redeploy and
      not just an edit. Ordered runbook and the done-when probes → **EX-853**.

## The other half of the wire

- [x] **`timing` reaches the leads app.** Landed here in `5d98061`; `bee767ae` adds the key to
      `landingSubmissionSchema` in `wykonczymy` and labels it „Termin rozpoczęcia prac" in the
      answer list. Confirmed done by the owner 2026-09-22.
      → `context/reference/landing-intake-contract.md`

## Decisions owed

- [ ] **"O nas"** — its own page or a section on home. Nothing is ported until this is settled.
      → `context/changes/2026-09-04-tdg-port/todo.md`
- [ ] **OQ 4 — is Cennik's removal final?** Recorded as probable, not settled. If it stays, two
      success criteria and one guardrail change and S8 grows a page.
- [ ] **OQ 2 / OQ 7 — file limits and retention.** Accepted types, max size, max count, and how
      long photos and contact details are kept. A policy decision; the build does not wait on it.

## Alerting — nothing watches the queue

A submission sat stranded from 2026-09-21 21:48 until it was found by hand on 2026-09-22. Ten
retries had failed, `attempts` hit `MAX_ATTEMPTS`, and from that moment no cron would ever touch it
again. Every signal said healthy: the cron returned `200` on every run, because
`{ attempted, delivered, failed }` is a `200` whatever the numbers say. `submissions.ts` calls the
admin "the alarm", and nobody is in front of it.

- [x] **Decide how a failing delivery announces itself.** filed **EX-852** (High, label `landing`).
      Two shapes are written up there, cheapest first:
      - **Fail the cron.** Return `5xx` from `/api/cron/deliver-pending/` when `failed > 0` or when
        any row sits at `attempts >= MAX_ATTEMPTS`. Vercel's cron log turns red and notifies. No new
        dependency, no new account, ~15 lines. Covers this failure and nothing else.
      - **Sentry.** Catches the whole class — runtime errors in both apps, not just this cron — at
        the cost of a dependency, a DSN per environment and a reversal of the roadmap's explicit
        "no observability slice" at the `low-complexity` goal. The owner has named it as the
        direction; it is a candidate, not a decision.
      Whichever wins, the alarm condition is the same: a row the cron has stopped retrying.

## Debt

- [ ] **`<html lang="pl">` on `/en/*`** contradicts the hreflang pairs S7 emits. Needs the locale in
      a real route segment, so it is a routing change rather than a one-line fix.
      → `roadmap.md` § F2 deferred items
- [ ] **Manual checks still open** — F2 ×3 (all in the admin), S2 ×2 (placeholders in Safari and
      Firefox, VoiceOver announcing errors), S7 ×5, EX-817 ×8 (card heights, one per breakpoint).
      → `manual-checks.md`
- [ ] **`roadmap.md` and `project-state.md` are stale.** `project-state.md` still says
      `phase: foundations`, dated 2026-09-02, and describes a site with zero content; the roadmap's
      per-slice statuses lag the code. Both want an owner's pass.
- [ ] **Three change folders unarchived** — `2026-09-18-lead-delivery` and `2026-09-20-s7-seo` are
      `implemented` and owe `/10x-archive`; `2026-09-04-tdg-port` has no `change.md` at all, so its
      review gate was never armed.

## Shortest path to cutover

**S8, then DNS, then EX-853.** The firewall rules, the crons and all four retired-address redirects
are already done and verified in production, and OQ 3 turned out to be a phantom blocker. What S8
still owes is its own work: the FR-037 assertions over the twelve addresses (written against `308`,
not `301`) and removing the pre-cutover noindex from `robots.ts` and the layout. Everything else can
follow the DNS switch.
