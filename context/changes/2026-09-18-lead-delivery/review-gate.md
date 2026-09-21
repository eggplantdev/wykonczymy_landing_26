# Review-gate ledger — lead-delivery · 2026-09-21

Scope: `main...lead-delivery`, 10 commits. Step 0.5 skipped — no `verify-manual-checks` skill in
this repo.

Fan-out: `/10x-impl-review`, `/code-review`, `tailwind-v4-audit`, `feature-first-structure`,
`module-cohesion-audit`, `structure-scatter-audit`, `comment-noise-audit`. Then `/simplify`
(reuse · simplification · efficiency · altitude) as the mutating pass.

A parallel agent was mid-sweep across the rest of the tree throughout, so both passes were scoped
to this slice's files by explicit path. That sweep clobbered one fix mid-gate — see the
`contact-form-attachments.tsx` line below.

## Findings

- [x] 🔴 CRITICAL · fixed · code-review · `vercel.json:3,4` · both cron paths lacked the trailing
      slash the app actually serves — `trailingSlash: true` unshifts a `priority: true` 308 ahead
      of every filesystem route including `/api/*`, Vercel cron does not follow redirects and does
      not log a redirected invocation, so neither cron would ever have run and nothing would have
      said so.
      test: TDD · unit — `cron-schedule.spec.ts` asserts every `vercel.json` path ends in `/` and
      resolves to a route file on disk. Confirmed statically against
      `node_modules/next/dist/lib/load-custom-routes.js:530-570`; no running dev server to verify
      against empirically, and I did not claim otherwise.
- [x] 🔴 CRITICAL · fixed · impl-review + code-review · `src/lib/contact/forward.ts` · delivery
      was gated on `>= 500`, so a `4xx` counted as delivered and the caller deleted the row — a
      rotated secret or a typo'd URL silently destroyed every lead the queue exists to hold. Now
      only `2xx` is delivered.
      test: test-driven-debugging · unit — `forward.spec.ts` red on a 400, now green.
- [x] 🟡 WARNING · fixed · impl-review + code-review · `src/lib/content/submissions.ts:28-51` ·
      fixing the above alone converts it into head-of-line starvation: a permanently-refused row
      is retried oldest-first every 15 min and no newer lead is ever attempted. Added
      `MAX_ATTEMPTS = 10` and a 10-minute backoff in `listPending`'s `where`. The exhausted row
      stays visible in the admin — that list *is* the alarm.
      test: TDD · integration — two cases in `submissions.int.spec.ts` (held back during backoff;
      not offered past the ceiling but not deleted).
- [x] 🟡 WARNING · fixed · code-review · `src/lib/contact/submit-contact-form.ts:75` · assets were
      not pinned to the submission's own prefix, so a forged action call made the leads app fetch
      an arbitrary object under our HMAC signature — the same host serves the CMS media at the
      store root. `ownsAssets` now pins every url and refuses duplicates.
      test: TDD · unit — `submit-contact-form.spec.ts`.
- [x] 🟡 WARNING · fixed · code-review · `src/app/api/blob/upload-token/route.ts:65` · the
      `MAX_FILES` ceiling the comment claimed was never enforced; each file is its own token
      request, so one prefix accepted unbounded 8 MB objects on a public route with the 24h sweep
      as the only backstop. Now counted via `list({ limit: MAX_FILES + 1 })`, excluding a
      re-upload of a path already held.
      test: TDD · unit — two cases in `upload-token.spec.ts`.
- [x] 🟡 WARNING · fixed · code-review · `src/app/api/blob/upload-token/route.ts:18` ·
      `request.json()` sat outside the `try`, making a non-JSON body the one path answering 500 —
      and the throttle probe reads the status to tell a deny from a malformed body.
      test: TDD · unit — `upload-token.spec.ts`.
- [x] 🟡 WARNING · fixed · code-review · `src/components/footer/contact-form/contact-form-trap.tsx`
      · the honeypot was named `company`; the fields around it are a textbook address form, Chrome
      maps `company` to `organization` and fills it from a saved profile regardless of
      `autoComplete`. A honeypot autofill can trip discards a real enquiry while showing the
      visitor a thank-you — silent on both sides. Renamed to `website`.
      test: no automated test · e2e — needs a real browser profile; written into
      `manual-checks.md` as a blocking check instead.
- [x] 🟡 WARNING · fixed · code-review · `src/components/footer/contact-form/contact-form.tsx` ·
      the trap was not cleared on the success reset, so one autofill hit swallowed every further
      submission in the session.
      test: TDD · unit — `contact-form-reset.spec.ts`.
- [x] 🟡 WARNING · fixed · code-review · `src/lib/blob/sweep.ts:20-36` · `list` caps at 1000
      objects per page and the sweep read only the first, reporting a truncated run as complete
      while the remainder accumulated forever. Now paginated on `hasMore`/`cursor`.
      test: TDD · unit — `sweep-orphans.spec.ts`.
- [x] 🟡 WARNING · fixed · code-review · `src/lib/blob/sweep.ts:47` · one failing prefix aborted
      the whole sweep, and the sweep restarts from the same head each day, so the abort was not
      self-healing. Now isolated per prefix with a `failed` counter.
      test: TDD · unit — `sweep-orphans.spec.ts`.
- [x] 🟡 WARNING · fixed · code-review · `src/app/api/cron/deliver-pending/route.ts` · one
      throwing row abandoned the rest of the batch. Per-row `try/catch` + `failed` counter.
      test: TDD · unit — `deliver-pending.spec.ts` (the file impl-review said would have caught
      the starvation bug).
- [x] 🟡 WARNING · fixed · code-review · `src/lib/content/submissions.ts:60` · `recordFailure`
      threw `NotFound` when the `after()` callback had already deleted the row, taking the rest of
      the cron batch with it. Now tolerates the race.
      test: TDD · integration — `submissions.int.spec.ts`.
- [x] 🟡 WARNING · fixed · code-review · `src/lib/contact/forward.ts:9` · no request timeout, so a
      hung leads app held the `after()` callback open for the function's whole lifetime. Added a
      10s `AbortSignal.timeout`.
      test: TDD · unit — `forward.spec.ts`.
- [x] 🟡 WARNING · fixed · simplify (reuse + altitude, converged) ·
      `src/lib/blob/prefix.ts:16` · the "one segment directly under this submission's prefix" rule
      was hand-rolled twice at different depths — and the `ownsAssets` copy was **missing the
      empty-filename guard**, so a url equal to exactly the prefix passed there and failed in the
      token route. Extracted `isDirectChild`, which owns the leading-slash normalisation (bare
      blob pathname vs. rooted `URL.pathname`) and the empty/nested checks in one place.
      test: TDD · unit — new `blob-prefix.spec.ts`, 7 cases including both spellings, the bare
      prefix, a nested path, and `leads/<id>-evil/`.
- [x] 🔵 OBSERVATION · skipped · code-review · `src/lib/contact/forward.ts` · no
      `x-vercel-protection-bypass` header, so a forward from a *preview* deployment will not reach
      the leads app while Deployment Protection is on. Needs a secret from the owner and a
      dashboard setting; production is unaffected. Recorded in `manual-checks.md` as a known gap.
- [x] 🔵 OBSERVATION · skipped · code-review · cleanup callback · no replay protection — a
      captured cleanup body stays valid indefinitely. Scoped signing already stops a *submission*
      signature being replayed as a cleanup, which was the sharp edge. A nonce or timestamp is a
      wire-contract change and both repos must land it together, so it does not belong in this
      slice's close-out.
- [x] 🔵 OBSERVATION · skipped · impl-review · leads app · `LANDING_CLEANUP_URL` is not set there.
      Other repo, deploy-time config. Without it delivery still succeeds and the row is still
      deleted; what leaks is the blob prefix, which the daily sweep then reclaims. In
      `manual-checks.md`.
- [x] 🔵 OBSERVATION · dismissed · code-review · `CRON_SECRET` looked absent from `.env.local`
      while `serverSchema` requires it — false positive, it is in `.env`, which Next also loads. I
      had grepped only the one file.
- [x] 🔵 OBSERVATION · dismissed · code-review · `contact-form.tsx` · a partial `Promise.all`
      upload failure leaves orphaned blobs. That is precisely what the 24h sweep exists for; no
      second mechanism owed.
- [x] fixed · simplify (efficiency) · `src/lib/content/submissions.ts:96` · `hasRow` was an N+1 —
      one `payload.count()` per orphaned prefix, called from the sweep loop. Replaced with
      `claimedSubmissionIds`, one `in` query for the whole batch. Also fails in the safe
      direction: a database that is down now aborts the sweep before anything is deleted instead
      of answering "no row" per prefix. `hasRow` removed rather than left as a test-only export.
      test: TDD · integration — `submissions.int.spec.ts` pins that it reports only surviving rows
      and that an empty input does not widen to everything.
- [x] fixed · module-cohesion · `src/lib/contact/form-message-key.ts` · `contact-schema.ts` mixed
      the schema with the message-key machinery. Lifted `FormMessageKeyT`, `MESSAGE_KEYS`,
      `messageKey`, `firstIssueKey`, `isMessageKey` into their own module — the audit's only real
      violation.
- [x] fixed · structure-scatter · `src/lib/blob/prefix.ts:3` · the submission-id uuid pattern was
      duplicated three times. `prefix.ts` is now its sole owner.
- [x] fixed · structure-scatter · `src/lib/blob/throttled.ts` · lived in `lib/contact/` but is
      blob-upload infrastructure. Moved, which also killed the duplicated
      `/api/blob/upload-token` literal via `UPLOAD_TOKEN_PATH`.
- [x] fixed · simplify (simplification) · `tests/unit/sweep-orphans.spec.ts` · three mock sites
      hand-rolled the shape the file's own `page()` helper produces while four siblings used it.
      Converted — which also cleared three `tsc` errors the bare shape was causing.
- [x] fixed · simplify (simplification) · `tests/unit/upload-token.spec.ts:22` · two tests built
      an identical 15-blob fixture verbatim, with `15` hardcoded. Factored `blobsAtCeiling()` off
      `MAX_FILES`; the `limit: 16` assertion now reads `MAX_FILES + 1`.
- [x] fixed · tailwind-v4-audit · `contact-form-attachments.tsx:35` · `text-black` instead of the
      token. **Fixed twice** — the parallel agent's typography sweep rewrote the line to
      `text-14 text-black` mid-gate and dropped the fix; re-applied keeping their `text-14`.
- [x] fixed · code-review · `contact-form-attachments.tsx:68` · the file input had no `accept`,
      so the picker offered files the route would then refuse. Now
      `accept={ACCEPTED_CONTENT_TYPES.join(',')}`.
- [x] fixed · comment-noise · `src/collections/Submissions.ts:23` · the comment said the wire
      carries `externalId`; it carries `submissionId`.
- [x] fixed · comment-noise · `src/lib/env-schema.ts`, `scripts/write-guard.ts`, the cron routes ·
      over-explaining blocks trimmed to a line each.
- [x] fixed · feature-first-structure · `eslint.config.mjs:12` · ignores enumerated `.next/` and
      `.next-e2e/`; ESLint 9 flat config does not read `.gitignore`, so a stray dist dir produced
      908 phantom errors. Now `.next*/`.
- [x] dismissed · tailwind-v4-audit · `h-[1lh]`, `-left-[9999px]` · arbitrary values, allowed
      under the skill's own rule C-3 (no token expresses either).
- [x] dismissed · structure-scatter · `src/lib/blob/` is infra-named while its contents are
      lead-domain. The project rule is explicit: `src/lib/content/` is the CMS tier and every
      other `src/lib/` module gets its own directory. Renaming would break the rule, not honour it.
- [x] dismissed · impl-review · shared fixture `satisfies` a narrower type than
      `SubmissionEnvelopeT`. `envelope.spec.ts` already pins the full shape.
- [x] dismissed · impl-review · `QueuedEnvelopeT = { submissionId: string }` does not describe
      what is stored. Deliberate: the queue knows only the key it is keyed by, the envelope's shape
      belongs to `lib/contact/envelope.ts`, and structural typing stores the whole object. The
      module comment already records this.
- [x] dismissed · impl-review · `plan.md:278` states a two-arg signer contract; the signer is
      scoped and takes three. Superseded by `change.md:305-307`, which records the 2026-09-21
      scoped-signing decision. 10x treats plan phase blocks as read-only after implementation.
- [x] dismissed · simplify (efficiency) · `getPayload({ config })` called per function in
      `submissions.ts` is not repeated I/O — Payload memoises the instance globally. Verified in
      `node_modules/payload/dist/index.js:544-575`.
- [x] skipped · simplify (efficiency) · `deliver-pending/route.ts:23` and `sweep.ts:42` deliver and
      reclaim serially; `Promise.allSettled` would cut worst-case wall-clock several-fold. Not
      applied: each envelope makes the leads app fetch up to 15 attachments server-side, so 20
      concurrent forwards is a stampede against a small app, and both jobs run against a queue
      that is normally empty. The 300s ceiling already covers the worst case. Revisit if a real
      backlog ever appears.
- [x] dropped · comment-noise · duplicated rationale across the two cron route headers — real, but
      the two files are read independently and de-duping costs more clarity than it saves.

## Simplify pass

Ran `/simplify` scoped to this slice's files — 4 agents (reuse · simplification · efficiency ·
altitude). 4 applied, 1 skipped, 1 dismissed; every finding folded into `## Findings` above tagged
`simplify`. Altitude returned no unresolved findings and independently confirmed the `isDirectChild`
extraction, including the missing-guard hole it closed. No separate report file — the gate keeps one
ledger.

## Tests & suite

- `pnpm typecheck` — clean.
- `pnpm lint` — exit 0, clean (908 → 0 once the flat-config ignores were fixed).
- `pnpm vitest run tests/unit` — 25 files / 175 tests green (from 24/168 at fan-out; 146 before the
  gate).
- `pnpm test:int` — 30 files / 189 tests green.
- `pnpm test:e2e` — **not run**: explicitly forbidden in this project. A plan's own gate listing it
  is not permission.
- `pnpm build` — not run.

## Archive blocker

Every finding box is checked. What remains is not a finding — it is the 8 unticked manual checks in
`context/foundation/manual-checks.md` § "EX-802 — lead delivery (landing_26 half, 2026-09-21)", two
of which block cutover: the `20260921_140715_submissions_queue` migration (human-runs `db:migrate:prod`,
and it goes up *before* the code) and the Vercel Firewall rate-limit rules, which have no
representation in this repo at all. Until those are signed off the slice is *in review*, not *done*.

---

# Review-gate ledger — lead-delivery, increment 2 · 2026-09-21

The slice was already gated once (above). This is a second increment on the same change, so the
ledger is appended to rather than replaced.

Scope: the uncommitted working tree, **my files only** —
`contact-form-outcome-dialog.tsx` (new), `contact-form.tsx`, `contact-form-attachments.tsx`,
`compress-image.ts` (new), `process-attachments.ts` (new), `attachments.ts`, both locale files,
`AGENTS.md`, `package.json`/lockfile.

Excluded as another agent's in-flight work: `src/components/home/hero.tsx` (a `variant="success"` →
`"dark"` edit) and `src/app/icon.png`. Both are fenced from the mutating pass as well — the
never-mutate-a-parallel-tree rule, same hazard that clobbered a fix mid-gate last time.

Step 0.5 skipped — still no `verify-manual-checks` skill in this repo.

Fan-out: `/10x-impl-review`, `/code-review`, `tailwind-v4-audit`, `feature-first-structure`,
`module-cohesion-audit`, `structure-scatter-audit`, `comment-noise-audit`.

## Findings

<!-- pending fan-out -->
