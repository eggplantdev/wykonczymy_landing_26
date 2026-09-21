---
date: 2026-09-21T13:14:57Z
researcher: ex-Plant
git_commit: 641b92ee9c691d634c1815911b20b5f3d1ac9852
branch: main
repository: landing_26
topic: 'lead-delivery — are the change.md preconditions actually true in both repos?'
tags: [research, codebase, lead-delivery, wykonczymy, blob, webhook, readiness]
status: complete
last_updated: 2026-09-21
last_updated_by: ex-Plant
---

# Research: lead-delivery readiness — verifying change.md against both repos

**Date**: 2026-09-21T13:14:57Z
**Researcher**: ex-Plant
**Git Commit**: `641b92e` (landing_26, `main`) · `22dae40` (wykonczymy, `staging`, clean tree)
**Branch**: main
**Repository**: landing_26 (+ /workspace/yolo/wykonczymy under the 2026-09-21 write carve-out)

## Research Question

Every decision in `change.md` rests on a claim about one of the two repos. Are those claims true
today, and is anything missing before `/10x-plan` can run?

## Summary

**The receiving half is built; the sending half is not started; and one decision is unbuilt on both
sides.**

- **`wykonczymy` — done and shipped.** Its copy of `change.md` says `status: implemented`. The
  webhook, the wire schema, the SSRF-guarded fetch, the three migrations, the promotion UI and
  ~23 lead tests are all on disk and committed. Four things `change.md` lists as work are already
  there (`media.kind`, `MEDIA_RELATIONS`, `investments.assets`, `equipment-events` coverage).
- **`landing_26` — nothing of this change exists.** No `address` field, no queue collection, no
  Route Handler of any kind (`src/app/api/` does not exist), no HMAC code, no `env.server.ts`, no
  `vercel.json`/crons, and `@vercel/blob` is a **devDependency**.
- **The delete-on-delivery callback (decision 2026-09-21) is implemented nowhere** — and
  `wykonczymy` is marked `implemented` without it. That is the one place "already ready" is
  misleading.
- **Three documentation drifts** must be settled before planning: the two `change.md` copies
  disagree on status, the anti-drift fixture exists in only one repo, and the contract doc
  contradicts `change.md` on whether `LANDING_BLOB_HOST` varies by environment.

Verdict: **ready to plan, not ready to assume.** The plan is now almost entirely a `landing_26`
plan, plus one small `wykonczymy` addition (the outbound callback) that the "implemented" status
hides.

## Detailed Findings

### A. `wykonczymy` — the receiving half is already implemented

`wykonczymy/context/changes/2026-09-18-lead-delivery/change.md:4` — `status: implemented`,
`branch: staging`. Working tree clean at `22dae40`.

**The webhook exists**, `src/app/(frontend)/api/webhooks/landing/route.ts` — header
`x-landing-signature`, secret `LANDING_WEBHOOK_SECRET`, `maxDuration = 300`, capture-first then
serial asset fetch (`:97`), `deleteUnreferencedMedia` rollback (`:118`), `notifyAssetFailure` only
on a fresh capture (`:126`), `notifyShapeAlert` on a zod failure (`:66`).

**The wire schema exists**, `src/lib/leads/landing.ts:27-43` — `landingSubmissionSchema`, strict
only on `submissionId: z.uuid()`, `assets: z.array(...).max(15)`. Mapping to the typed columns at
`:69` (`landingToStoreLeadInput`), `TYPED_ANSWERS` fallback at `:49-57`.

**The SSRF guard exists**, `src/lib/leads/fetch-landing-asset.ts:38-50` — exact `URL.hostname` vs
`LANDING_BLOB_HOST`, `https:` only, `redirect: 'error'` (`:91`), 8 MB stream cap (`:63`), SVG
excluded (`:21`). Exactly what the 2026-09-21 decision specified.

**The schema changes are migrated** — `20260921_0_media_kind.ts`, `20260921_1_investments_assets.ts`,
`20260921_2_leads_landing.ts`. So: `leads.address` / `.scope` / `.area` / `.assets`
(`src/collections/leads.ts:75,81,88,94`), `source` enum already carrying `landing_form`
(`leads.ts:5-9`), `investments.assets` as an upload relation (`investments.ts:99-104`, with the
comment "promotion re-points them instead of re-uploading"), and `media.kind`
(`faktura|projekt|zdjecie|inne`, `media.ts:68-73`).

**Promotion is built** — `PromoteLeadDialog` per row (`src/components/tables/leads.tsx:107`) →
`promoteLeadAction` (`src/lib/actions/promote-lead.ts:22`), which creates the investment carrying
`lead.assets` as a relation and sets `contactStatus: 'contacted'`.

**`captureLead` behaves as described** — `src/lib/leads/capture-lead.ts:57`, store-then-notify
(`:40`), `NOTIFY_ATTEMPTS = 3` (`:7`), only still-`pending` channels retried (`:65-67`). Dedup in
`store-lead.ts:22-36`, enforced by the compound unique index
`src/migrations/20260707_0_add_leads.ts:43` with a lost-race catch at `store-lead.ts:91-97`.

**Two claims in `change.md` are stale in the reassuring direction.** The decision of 2026-09-20
argues for one media collection on the grounds that `deleteUnreferencedMedia` hand-lists its
referencing collections and lost `equipment-events.attachments` to drift. That has since been fixed:
`src/lib/media/delete-unreferenced-media.ts:32` iterates `MEDIA_RELATIONS`
(`src/lib/media/relating-collections.ts:19-25`), which already carries all five relations including
`equipment-events.attachments` and `leads.assets`. The registry the decision *proposed* already
exists. The decision stands; only its evidence is historical.

### B. `landing_26` — none of the sending half exists

| `change.md` says landing_26 needs | State |
| --- | --- |
| an `address` field on the form | **MISSING** — not in `contactSchema` (`src/lib/contact/contact-schema.ts:35-48`), not in `emptyContactValues()` (`:72`), not in `TEXT_FIELDS` (`contact-form.tsx:38-43`), and no `form.address` key in `pl.json`/`en.json` |
| a `submissions` queue collection | **MISSING** — collections are `[Users, Media, Pages, Projects, InteriorStyles]` (`src/payload.config.ts:37`) |
| a client-upload token route | **MISSING** — `src/app/api/` does not exist; the only Route Handlers are Payload's catch-alls |
| the signed-JSON forward | **MISSING** — zero hits for `createHmac` anywhere in `src/` or `scripts/` |
| retry cron via `vercel.ts` | **MISSING** — no `vercel.json`, no `vercel.ts`, `@vercel/config` not installed |
| `rawData`/`formQuestions` from the dictionary | **Feasible, not built** — see below |
| the orphan blob sweep | **MISSING** |

**The Server Action is the stub the change expects.** `src/lib/contact/submit-contact-form.ts:19` —
`// No sink yet — where a submission is delivered is the next change.` One correction to
`change.md`'s wording: it returns `ContactSubmitResultT = { ok: true } | { ok: false; errorKey }`
(`:5`), not a bare `{ ok: true }`.

**The dictionary can drive `formQuestions`, but the action cannot see the locale.** Field names
double as their own `form` translation keys (`contact-form.tsx:36,129`), so a `key → label` pairing
is direct for `name/email/phone/area/scope/message`. But `submit-contact-form.ts:13-14` states the
action "has no locale of its own" — locale is derived from the URL
(`src/lib/routing.ts:93,100`) and reaches clients through `TranslationsProvider`. **Carrying
`locale` on the wire requires widening the action's input contract.** `acceptsTerms` has no matching
`form` key (it uses `acceptTerms`/`acceptTermsLink`).

**The file input exists but is dead UI** — `contact-form-attachments.tsx:54-64` renders
`<input name="attachments" type="file" multiple accept="image/*,application/pdf">` whose `onChange`
records only `file.name` into local state (`:20,:60-62`). It is not registered with TanStack Form;
no `FileList` leaves the component. This was deliberate debt recorded at S2's archive
(`context/archive/2026-09-17-s2-contact-form/plan.md:28-32`).

**Blob facts check out, with one packaging problem.** `scripts/blob-upload.ts:52-58` does call `put`
with `addRandomSuffix: false, allowOverwrite: true` on a bare filename — store root, no prefix, as
`change.md` describes. `@vercel/blob@2.8.0` does expose `handleUpload` / `onBeforeGenerateToken`
(`node_modules/@vercel/blob/dist/client.d.ts:346,380`). **But it is a devDependency** — using the
client-upload API in `src/` requires promoting it to `dependencies`. Note also the Payload adapter
uses `addRandomSuffix: true` (`src/payload.config.ts:81-86`) while the upload script relies on exact
names; that tension predates this change but the `leads/` prefix work sits next to it.

**The env layer has the hole the change needs filled, and the lint config already anticipates it.**
`src/lib/env.ts` is the client reader; `src/lib/env.server.ts` **does not exist**, though
`eslint.config.mjs:27-48` already names it in the ignore list precisely so the next author does not
edit the lint config and reach for `clientSchema` instead. Every server-only value this change adds
(HMAC secret, webhook URL, cron secret, blob token for the sweep) needs that file plus entries in
`serverSchema` (`src/lib/env-schema.ts:15-42`).

**No rate limiter, no uuid package.** `submissionId` comes from `crypto.randomUUID()`; signing from
`node:crypto`. Rate limiting — called "defence in depth" in `change.md` — has no dependency chosen.

### C. The one decision built on neither side: the delete-on-delivery callback

`change.md` (2026-09-21) says `wykonczymy`, after its `payload.update` commits, POSTs
`{ submissionId }` back, signed with the same HMAC scheme.

- `wykonczymy` has **only the verify half** — `src/lib/leads/verify-signature.ts:8`
  (`sha256=` + HMAC-SHA256 over the raw body, `timingSafeEqual`). There is no outbound signer,
  nothing POSTs `{ submissionId }` anywhere, and `src/lib/env/schema.ts:86-87` declares only
  `LANDING_WEBHOOK_SECRET` and `LANDING_BLOB_HOST` — no callback URL.
- `landing_26` has no endpoint to receive it.

**Consequence if this is left as-is:** every delivered submission leaves its bytes in
`leads/<submissionId>/` until the age sweep reclaims them — which is survivable but is not what was
decided, and it makes the sweep the primary cleanup rather than the backstop.

Related: `verifySignature` has **no timestamp/replay protection** — the signature covers the body
alone. Acceptable inbound (the `submissionId` dedup makes a replay idempotent) but it should be a
conscious call for the callback, whose whole job is to trigger a delete.

### D. Three drifts to settle before planning

1. **The two `change.md` copies disagree.** `landing_26` says `status: planned` / `branch: null`;
   `wykonczymy` says `status: implemented` / `branch: staging`. Those two lines are the entire diff.
   The change's own rule — "a decision recorded on one side is not agreed until it reads the same on
   the other" — is currently violated by the status field itself.

2. **The anti-drift fixture exists in only one repo.**
   `wykonczymy/src/__tests__/fixtures/landing-submission.ts:11` carries `LANDING_SUBMISSION` and
   comments that it is "pinned by one fixture committed byte-identically here and in `landing_26`".
   Grepping `landing_26` for `LANDING_SUBMISSION` or `submissionId` returns **nothing**. The pinning
   mechanism the duplicate-schema decision depends on is half-built.
   (The contract *document* is in both — `context/reference/landing-intake-contract.md` — and the
   two differ only in Prettier table padding, i.e. same content, not byte-identical as claimed.)

3. ~~**The contract doc contradicts `change.md` on the blob host.**~~ **Resolved 2026-09-21
   (owner): one shared store.** The doc had said `LANDING_BLOB_HOST` "differs between preview and
   production"; `change.md` says one store for every environment with the same host value in both,
   which is *why* the age sweep is gated on `VERCEL_ENV === 'production'`. The owner confirmed the
   single-store reading, and both copies of `landing-intake-contract.md` were rewritten to match —
   `leads/` is a shared prefix, delivery-driven cleanup is unaffected, age-based deletion runs from
   production only.
   Still unverified: `change.md` names the store host `y06paq7r8hjnw5wb.public.blob.vercel-storage.com`
   while the wykonczymy fixture uses `landing-assets.public.blob.vercel-storage.com`. A fixture may
   legitimately use a placeholder, but the real value must be confirmed against the Vercel store
   before `LANDING_BLOB_HOST` is set.

### E. Smaller findings worth carrying into the plan

- **`leads-reconcile` cannot cover `landing_form`** (`src/lib/leads/reconcile-sweep.ts:39` sweeps
  Meta forms only). The landing's queue is the sole backstop for this source — which confirms the
  "outbox is a queue" decision rather than undermining it.
- **`wpforms/route.ts` is the wrong template for the signature**, contrary to `change.md`: it uses a
  plain shared secret in `x-webhook-secret` (`:25`), not HMAC. The HMAC template is
  `verify-signature.ts` plus the already-written `webhooks/landing/route.ts`.
- **`POST /api/upload-file` in `wykonczymy` has no server-side size cap** (`route.ts:16` says so
  explicitly); the 4 MB guard is client-side in `processUploadFile`. Not on this change's path (the
  webhook uses `fetch-landing-asset`, which streams with an 8 MB cap), but it means the two ceilings
  in play — 4 MB UI, 8 MB wire — are set in different places.
- **`uploadFile()` never stamps `kind`** (`src/lib/utils/upload-file.ts:21`, `data: {}`), so landing
  assets arrive with a blank `kind`. Consistent with the decision that staff assign `kind` at
  promotion — worth confirming `fetch-landing-asset.ts` does not need to set it.
- **The roadmap is stale.** `context/foundation/roadmap.md:78,82` lists S2 and S6 as `blocked` (the
  S2 body says `proposed` — the table and the body disagree), and S6 still records "the receiving
  application should own the stored files", which the 2026-09-21 topology reverses. Neither the
  S2+S6 merge nor the landing-owns-the-blob reversal has reached the roadmap.
- **`context/foundation/lessons.md` does not exist** in this repo (`roadmap.md:320` stubs a
  "Lesson: —" channel that is unused), so there were no prior-lesson priors to apply.
- **Testing homes exist**: `tests/unit/*.spec.ts` (pure, e.g. `contact-schema.spec.ts`),
  `tests/int/*.int.spec.ts` (boots Payload, e.g. `api.int.spec.ts`, guard helper
  `tests/helpers/test-database.ts`), `tests/e2e/` on port 3100 with `NEXT_DIST_DIR=.next-e2e`.

## Code References

**landing_26**

- `src/lib/contact/submit-contact-form.ts:19` — the sink stub this change replaces
- `src/lib/contact/contact-schema.ts:33-48` — the field set an `address` field joins
- `src/components/footer/contact-form/contact-form-attachments.tsx:54-64` — the dead file input
- `src/lib/i18n/i18n.ts:17,25` — `TranslationsT`, `getTranslations(locale)`
- `src/lib/routing.ts:93,100` — where locale is resolved per request
- `scripts/blob-upload.ts:52-58` — root-level `put`, the reason the `leads/` prefix matters
- `src/payload.config.ts:81-86` — blob adapter, `addRandomSuffix: true`
- `src/lib/env-schema.ts:15-42` — `serverSchema`; `src/lib/env.server.ts` absent
- `eslint.config.mjs:27-48` — the raw-`process.env` ban and its ignore list
- `context/reference/landing-intake-contract.md` — the wire contract, both repos
- `AGENTS.md:24-28` — the write carve-out, present as claimed

**wykonczymy**

- `src/app/(frontend)/api/webhooks/landing/route.ts` — the receiving endpoint, built
- `src/lib/leads/landing.ts:27-43,69` — `landingSubmissionSchema`, `landingToStoreLeadInput`
- `src/lib/leads/fetch-landing-asset.ts:38-50,63,91` — SSRF allowlist, 8 MB stream cap
- `src/lib/leads/verify-signature.ts:8` — the HMAC scheme to mirror outbound
- `src/lib/leads/capture-lead.ts:40,57,65-67` — store-then-notify, retry ×3
- `src/collections/leads.ts:5-9,75-94` — `landing_form`, `address`/`scope`/`area`/`assets`
- `src/lib/media/relating-collections.ts:19-25` — `MEDIA_RELATIONS`, already the single registry
- `src/lib/actions/promote-lead.ts:22` — promotion re-points assets, no byte copy
- `src/__tests__/fixtures/landing-submission.ts:11` — the fixture with no counterpart here
- `next.config.ts:12-15` — the 4.5 MB cap comment `change.md` cites

## Architecture Insights

- **The contract survived first contact.** The receiving side was built to the envelope in
  `landing-intake-contract.md` without the sending side existing, and nothing in it turned out to be
  unimplementable. The permissive tail did its job: adding a question on the landing needs no deploy
  in `wykonczymy`.
- **Asymmetric readiness inverts the risk.** The usual worry with a two-repo change is that the
  halves drift while both are in motion. Here one half is frozen and shipped, so the risk is the
  opposite: the landing gets built against `change.md`'s *description* of the webhook rather than
  the webhook's actual behaviour. The status-code table in the contract doc and
  `webhooks/landing/route.ts` are the authorities — `200` means stop retrying, including on partial
  asset failure, which directly shapes the queue's retry logic.
- **The registry pattern won on the other side already.** `MEDIA_RELATIONS` driving both the
  reference counter and the delete probes is the generalisation `change.md` argued for, now
  load-bearing. Anything the landing adds that points at media there is one line in one place.
- **The "one store, all environments" decision is the weakest link in the design.** It is the only
  decision whose supporting fact is contradicted by another document in the same repo, and it is
  what the sweep's production gating rests on. Verify it against the Vercel dashboard before it is
  planned around.

## Historical Context (from prior changes)

- `context/archive/2026-09-17-s2-contact-form/change.md:30-34` — the sink was deliberately deferred:
  "The schema is the deliverable; the destination is the next change."
- `context/archive/2026-09-17-s2-contact-form/research.md:272-300` — §7 already researched the leads
  app contract and concluded attachments were impossible against the then-current intake. That
  conclusion is now obsolete: the intake was extended (section A above).
- `context/archive/2026-09-17-s2-contact-form/plan.md:28-32` — "the input stays as it is, collecting
  filenames and sending nothing" — the dead UI is recorded debt, not an oversight.
- `context/changes/2026-09-04-tdg-port/review-gate.md:20-22` — EX-790, "form drops every lead",
  blocked on this contract.

## Related Research

- `context/archive/2026-09-17-s2-contact-form/research.md` — the form slice's own research, §7 in
  particular
- `context/reference/landing-intake-contract.md` — not research, but the normative wire document

## Open Questions

1. ~~Does `LANDING_BLOB_HOST` differ between preview and production?~~ **Closed 2026-09-21
   (owner): one shared store, same value everywhere.** Both contract copies updated. What remains is
   clerical — confirm the actual host string against the Vercel store before setting the var.
2. **Is the delete-on-delivery callback still wanted**, given `wykonczymy` is already marked
   `implemented` without it? If yes, that repo reopens for a small outbound-signing addition; if no,
   the age sweep becomes the only cleanup and `change.md` needs the reversal written down.
3. **Where does the shared fixture live on this side**, and what pins it — a test that imports it, or
   only convention? A fixture nobody asserts against does not stop drift.
4. **Rate limiting: which mechanism?** No dependency exists and `change.md` names none. Vercel
   Firewall is the platform-native option and needs no package.
5. **Does the roadmap get corrected now or at archive?** S2/S6 statuses, the merge, and the
   blob-ownership reversal are all stale.
