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

**Trimmed at archive (2026-09-22).** The pre-trim tally was **43 fixed, 18 dismissed, 3 dropped,
5 skipped · 0 open**, including four `🔴 CRITICAL`. Every `fixed` finding was removed: its durable
record is the commit that fixed it, and the fix is now just the code. What survives below is the
negative space git cannot hold — what was looked at and deliberately *not* changed, and why.


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
