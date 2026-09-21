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

<!-- Format: [box] [severity, bug-finding checks only] · disposition · `source` · `file:line` ·
     what — reason. Correctness findings carry a `test:` sub-line. Most-severe first. -->

- [x] 🔴 CRITICAL · fixed · code-review + impl-review · `process-attachments.ts:38` · a bare
      `Promise.all` ran up to 15 files at once, each a main-thread CompressorJS encode and possibly
      a 3 MB WASM HEIC decode — the tab freezes on exactly the pick this feature exists to serve.
      Both bug-finding checks flagged it independently and impl-review named the cause: the leads
      app's `ingest-files.ts` has `INGEST_CONCURRENCY = 4`, verified in the source repo, and the
      port took the workload while leaving the guard behind. Now `mapWithConcurrency(…, 4)`.
      test: TDD · unit — `process-attachments.spec.ts` records the in-flight peak and asserts ≤ 4;
      mutation-checked (raising the constant to 99 turns it red).
- [x] 🔴 CRITICAL · fixed · code-review · `process-attachments.ts:52` · the same `Promise.all`
      meant one undecodable file rejected the whole batch, discarding fourteen that had compressed
      fine — the visitor saw a blanket failure and lost the pick. The leads app collects blocked
      files per file; that half was dropped in the port too. Now a per-file `try/catch` feeding
      `unreadable[]`, surfaced as `filesUnreadable` naming just the files that failed.
      test: TDD · unit — good files survive, the bad one is named, input order preserved.
- [x] 🟡 WARNING · fixed · code-review · `compress-image.ts:43` · `named()` forced the visitor's
      filename back onto the compressed blob unconditionally. CompressorJS re-encodes a PNG over
      its own 5 MB `convertSize` to JPEG *and corrects the extension*; overriding it shipped JPEG
      bytes at a `.png` path, which the recipient's OS opens with the wrong application. Now the
      corrected name wins whenever the type actually changed.
      test: TDD · unit — `compress-image.spec.ts` pins both directions; mutation-checked.
- [x] 🟡 WARNING · fixed · impl-review · `process-attachments.ts:26` · the codec chunk was
      `import()`ed inside the per-file path — fifteen parallel imports of one chunk, and a failed
      download reported fifteen times as an unreadable *photo* when the photo was never the
      problem. Hoisted to one import before the fan-out, with its own `processingUnavailable` key.
      test: no automated test · unit — asserting "imported once" couples to the loader, not to
      behavior; the concurrency spec already exercises the hoisted path.
- [x] 🟡 WARNING · fixed · code-review · `contact-form.tsx:245` · `isProcessing` had no `finally`,
      so a throw between the two `setState`s left the flag set — and it disables Send, which blocks
      a *text-only* enquiry from a visitor who has given up on the attachment. Now cleared in
      `finally`, behind the same stale-pick token guard.
      test: no automated test · unit — the hole is a React state path with no seam short of
      rendering the form; the browser check below is the real guard.
- [x] 🟡 WARNING · fixed · code-review · `contact-form.tsx:99` · a second submit opened with the
      previous attempt's `outcome` and `attachmentError` still set, so the visitor saw a stale
      verdict on a send that had not finished. Both cleared at the top of `onSubmit`.
      test: no automated test · unit — same seam problem; covered by the browser check.
- [x] 🟡 WARNING · fixed · code-review · `contact-form-outcome-dialog.tsx:44` · Radix's `FocusScope`
      restores focus to whatever was focused at mount, and the submit button is *disabled* by the
      time the dialog mounts — so closing it dropped focus on `<body>` and a keyboard visitor
      restarted at the top of the document. Now `returnFocusTo` + `onCloseAutoFocus`, with the
      `<form>` carrying `tabIndex={-1}` as the target.
      test: no automated test · e2e — this is a real e2e assertion, but `test:e2e` is forbidden in
      this project; it is on the manual-checks list instead.
- [x] 🟡 WARNING · fixed · code-review · `contact-form-attachments.tsx:78` · the status text was
      mounted *with* its live region, and a live region created in the same commit as its content
      announces nothing — a screen-reader user got silence through the whole compression pass. The
      region is now permanently mounted and only its text changes; the visible copy is
      `aria-hidden` so nothing is read twice.
      test: no automated test · e2e — same forbidden leg; manual check.
- [x] 🔵 OBSERVATION · fixed · impl-review · `process-attachments.ts:8` · HEIC was compressed twice
      — `heicTo` at q0.60, then `compressImage` at q0.80 — so an iPhone photo was degraded by a
      pass whose only job is to *decode*. Decode raised to q0.92; one pass sets the quality.
- [x] 🔵 OBSERVATION · fixed · code-review · `en.json` / `pl.json` · `heicUnconvertible` was
      orphaned by the rewrite — no caller left. Removed from both locales rather than left as a key
      the next person has to prove is dead.
- [x] fixed · module-cohesion · `attachments.ts:17` · "can a canvas re-encode this" was written
      twice, once in the compressor and once in the pre-upload pass, and the two could drift on
      SVG. Extracted to `isRasterImageType`, the one home both now ask.
- [x] fixed · comment-noise · `compress-image.ts`, `process-attachments.ts`, `contact-form.tsx` ·
      several comments restated the code or narrated vanished state. Trimmed to the ones carrying a
      reason the code cannot state — the port's dropped guards, the `MAX_EDGE` shape argument, the
      stale-pick token.
- [x] fixed · gate (test authoring) · `tests/unit/compress-image.spec.ts:11` · the first version of
      the compressor double used `vi.fn(arrow)`. `new Compressor(…)` on an arrow throws "is not a
      constructor", `compressImage` swallows it and returns the original file — so the filename test
      passed for the wrong reason and would have shipped as decoration. Caught by mutation-checking
      the guard, not by the suite. The double is a `function` expression now, with the reason
      recorded in the spec.
- [x] fixed · impl-review · `change.md:294` · the compression decisions (2560/q0.80, the lazy HEIC
      decode, the concurrency cap) and the new dependencies had no record in the change. Three
      `## Decisions` entries added.
- [x] fixed · impl-review · `change.md:334` · Build status still read "On `landing_26`, unbuilt",
      which the slice itself made false. Corrected — and it now states plainly that nothing in the
      attachment path has been opened in a browser, which is the claim that actually matters.
- [x] fixed · feature-first-structure · `AGENTS.md` · the lead-email bullet had grown a
      localhost-port anecdote and a stray blank line splitting the list. Trimmed to the durable
      fact: read the queue row's `lastError`, not the dev-server log.
- [x] skipped · structure-scatter · `contact-form-outcome-dialog.tsx`, `photo-lightbox-dialog.tsx`,
      `ui/sheet.tsx` · three Radix dialogs now configure overlay, panel and close button separately;
      a shared primitive is the right end state. Not done here: it is a cross-cutting refactor of
      two components this slice never touched, and its whole risk is *visual* — exactly what I
      cannot verify without a browser. It deserves its own change, not a blind edit at the end of a
      gate.
- [x] dismissed · code-review · `contact-form.tsx:235` · the `pickToken` race guard is correct —
      the token is read after every `await`, and the `finally` compares before clearing, so a
      superseded pick cannot resurrect its own spinner.
- [x] dismissed · code-review · `compress-image.ts` · EXIF orientation is not lost. CompressorJS
      reads the orientation tag and bakes the rotation into the canvas output; a portrait iPhone
      photo does not arrive sideways.
- [x] dismissed · code-review · `process-attachments.ts` · `file.type` survives every path — the
      HEIC branch constructs the JPEG with an explicit type, and the `named()` rebuild carries
      `compressed.type`. Nothing reaches the size/type check with an empty type.
- [x] dismissed · code-review · `contact-form-outcome-dialog.tsx` · the Radix a11y contract is
      satisfied: `Title` and `Description` are both present, so no `aria-describedby` warning and
      no unlabelled dialog.
- [x] dismissed · code-review · `contact-form-outcome-dialog.tsx:30` · the overlay lock is
      balanced. `useOverlayLock` is called from a component mounted only while open, so unmount
      releases it; the carousels' `document` key handlers stay suppressed exactly as long as the
      dialog is up.
- [x] dismissed · code-review · `attachments.ts:37` · a `.heic` and a `.heif` of the same stem both
      becoming `.jpg` *is* a collision, and it is already caught: `checkAttachments` runs after
      processing, so the duplicate-name rule sees the post-conversion names and the visitor is told
      which rule they broke. Pinned by a spec.
- [x] dismissed · code-review · `en.json` / `pl.json` · the two locales are symmetric — same key
      set, same `{{files}}` parameter in both.
- [x] dismissed · tailwind-v4-audit · `contact-form-outcome-dialog.tsx` · every token used
      (`bg-scrim`, `bg-card`, `text-error`, `bg-success/10`, `outline-hidden`) exists in the
      theme; no arbitrary values, no pre-v4 patterns.
- [x] dismissed · code-review · `package.json` · `compressorjs` and `heic-to` ranges are mature
      under `minimumReleaseAge: 1440` — neither resolves to anything published inside a day.
- [x] fixed · simplify (reuse) · `attachments.ts:11` · `.heic` / `.heif` was spelled out twice —
      once building the picker's `accept` list, once as the detector's extension list in
      `process-attachments.ts`. One drifting from the other means the picker offers a format the
      pass no longer recognises. `HEIC_EXTENSIONS` is now the single home and `FILE_PICKER_ACCEPT`
      spreads it.
- [x] fixed · simplify (simplification) · `contact-form-attachments.tsx:32` · `t('processingFiles')`
      was called from two separate ternaries and the spoken-status expression was inlined into JSX.
      Both hoisted above the return; the markup now reads as markup.
- [x] dropped · simplify (reuse) · `attachments.ts:21` · `isAcceptedType` hardcodes the same rule
      `ACCEPTED_CONTENT_TYPES` states, so the two can drift. Deriving one from the other needs a
      wildcard matcher — seven lines and an abstraction to police a two-element list. Worse at
      altitude than the duplication it removes.
- [x] dismissed · simplify (efficiency) · `process-attachments.ts:30` · `codecs` is threaded through
      three functions as a parameter rather than memoised at module scope. Deliberate: the parameter
      is the seam the specs mock, and a module-level promise would make the failed-chunk path
      untestable.
- [x] dropped · module-cohesion · `process-attachments.ts` · `mapWithConcurrency` is a generic
      utility living in a domain module and the leads app keeps it in its own file. Real, but one
      caller and twelve lines — promoting it to `src/lib/` would be a directory created for a
      single import. Revisit at the second caller.

## Simplify pass

Ran the pass by hand across the four lenses (reuse · simplification · efficiency · altitude),
scoped by explicit path to this increment's files — `hero.tsx` and `icon.png` fenced off as another
agent's in-flight work. 2 applied, 1 dropped, 1 dismissed; every finding is folded into
`## Findings` above tagged `simplify`. No separate report file — the gate keeps one ledger.

## Tests & suite

- `pnpm typecheck` — clean apart from `src/components/home/hero.tsx(117,57)`, which is the parallel
  agent's uncommitted edit and outside this increment's scope.
- `pnpm lint` — exit 0 over `src/lib/contact`, `src/components/footer/contact-form` and the two new
  specs.
- `pnpm vitest run tests/unit` — 27 files / 191 tests green (up from 25/175 at the end of
  increment 1; the two new specs add 13).
- `pnpm test:int` — 32 files / 205 tests green.
- `pnpm test:e2e` — **not run**: forbidden in this project.
- `pnpm build` — not run.

Both new guards were **mutation-checked**, not just observed green: reverting the concurrency cap to
an unbounded fan-out and reverting `named()` to always keep the visitor's filename each turn their
spec red. That check is what caught the `vi.fn(arrow)` false pass recorded above.

## Archive blocker

Every finding box is checked. The blocker is unchanged from increment 1 — the 8 unticked manual
checks in `context/foundation/manual-checks.md` — plus one this increment adds and cannot discharge
itself: **nothing in the compression path has ever run in a browser.** The specs mock CompressorJS
and `heic-to`, so what is proven is the orchestration around the codecs, not the codecs. A real pick
of a HEIC photo and a large PDF, the dialog, and a lead arriving in the leads app are the owner's to
confirm. The slice stays *in review*.
