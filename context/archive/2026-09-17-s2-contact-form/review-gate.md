# Review-gate ledger — 2026-09-17-s2-contact-form · 2026-09-17

Slice files (post-fan-out, after the move into `src/components/footer/contact-form/`):

- `src/lib/contact/contact-schema.ts` (new)
- `src/lib/contact/contact-form-store.ts` (new)
- `src/lib/contact/submit-contact-form.ts` (new)
- `src/lib/use-store-hydrated.ts` (new)
- `src/components/footer/contact-form/contact-form.tsx` (moved + rewritten)
- `src/components/footer/contact-form/contact-form-field.tsx` (new)
- `src/components/footer/contact-form/contact-form-input.tsx` (moved + rewritten)
- `src/components/footer/contact-form/contact-form-textarea.tsx` (new)
- `src/components/footer/contact-form/contact-form-attachments.tsx` (moved)
- `src/components/footer/site-footer.tsx`
- `src/components/ui/button.tsx`
- `src/lib/i18n/locales/pl.json`, `src/lib/i18n/locales/en.json`
- `tests/unit/contact-schema.spec.ts` (new), `tests/unit/contact-form-reset.spec.ts` (new)

`src/lib/contact/types.ts` was created during implementation and deleted during the gate
(see the cohesion finding below) — it is not part of the slice's final surface.

Step 0.5 (verification pass) skipped — no `verify-manual-checks` skill in this project,
and the browser is not opened without an explicit ask.

Step 1 fan-out: `/10x-impl-review`, `/code-review`, `/tailwind-v4-audit`,
`feature-first-structure`, `module-cohesion-audit`, `structure-scatter-audit`,
`comment-noise-audit` — all seven applied, none dropped out.

## Findings

**Trimmed at archive (2026-09-21).** Every `fixed` finding was removed: its durable record is the
commit that fixed it, and the code is the verifiable truth. What survives is the negative space
git cannot hold — what was judged benign, what was too small to be worth the churn, and what was
deliberately left undone. Pre-trim tally: 28 fixed, 7 dismissed, 3 dropped, 3 skipped, 0 open.

- [x] dismissed · tailwind-v4-audit · `contact-form/contact-form.tsx:170` · `rounded-[1px]`
      flagged as an arbitrary value this slice invented — it isn't; `git show HEAD:src/components/footer/contact-form.tsx`
      has it at line 38. It belongs to the tdg port slice, not this one.
- [x] dropped · tailwind-v4-audit · `styles.css:98` · `--color-error` is 3.66:1 on white,
      short of WCAG AA. Real, but it's the token's problem across the whole site, not this
      slice's — changing it here would recolour pages this change never touched.
- [x] dismissed · feature-first-structure · `contact-form-input.tsx`, `contact-form-textarea.tsx` ·
      proposed promoting both to `src/components/ui/`. `structure-scatter-audit` said the
      opposite — `footer/` is correct, no premature promotion. Went with scatter: `plan.md`
      already records "No `src/components/forms/` primitive layer — one form does not earn
      one", and one consumer does not establish a shared primitive.
- [x] dismissed · feature-first-structure vs structure-scatter-audit · `src/lib/use-store-hydrated.ts` ·
      disagreement on whether it belongs at the `lib/` root or under `lib/contact/`. Kept at
      the root — it is domain-free infra alongside `carousel.ts` / `routing.ts` — and hardened
      instead: restored the `StoreApi` intersection so any object carrying a `persist` field
      no longer satisfies it structurally, and stabilised the `subscribe` identity with
      `useCallback` so `useSyncExternalStore` does not resubscribe every render.
- [x] dismissed · code-review vs impl-review · `contact-form-store.ts:23` · code-review called
      the debounced write racing `clearDraft()` a live bug; impl-review called it harmless.
      Both describe the same thing at different times: it only bit *because of* the 🔴 (the
      post-reset values still equalled the draft). With that fixed, post-reset values are
      empty and the store's `JSON.stringify` guard skips the write. Kept the guard — it is
      what makes the race harmless, so code-review's suggestion to delete it is declined.
- [x] skipped · impl-review · `playwright.config.ts:39` · `webServer.url` points at
      `http://localhost:3000` with `reuseExistingServer: true`, but that port is the leads app —
      landing_26 runs on :3001, so `pnpm test:e2e` drives the wrong application. Real, and it
      predates this slice; fixing it changes how every e2e run behaves and belongs in its own
      change. Recorded in `research.md`.
      test: no automated test · — the defect is in the test harness itself.
- [x] skipped · impl-review · `AGENTS.md` ("The two landmines") · describes the leads intake
      payload as "a flat set of text answers" when it is `Record<string, {name, value?, type?}>`.
      Correct to fix, but `AGENTS.md` currently carries another agent's in-flight hunk, so
      editing it here would entangle the two. Left for whoever lands that hunk.
- [x] dismissed · simplify/altitude · `contact-form-store.ts` · proposed replacing Zustand entirely
      with plain `readDraft`/`writeDraft`/`clearDraft` over `sessionStorage`, on the grounds that
      nothing subscribes to `draft`. The reasoning is sound, but "Zustand + persistence" is the
      owner's stated scope for this change, not a detail the gate gets to re-decide. Declined here;
      it is a stack question, not a cleanup.
- [x] skipped · simplify/simplification + simplify/reuse vs simplify/altitude ·
      `contact-form-input.tsx` / `contact-form-textarea.tsx` · two agents wanted them merged into
      one `ContactFormControl` with a `multiline` flag; the third argued the split is right because
      what differs is element-specific props. Went with the third: a `multiline` boolean would make
      `rows`, `resize-y`, `type` and `autoComplete` conditionally meaningless on the same component.
      Extracting `FieldError` removed the duplication that actually mattered; the `useId` preamble
      that remained was then taken by the `reuse-scan` finding below.
- [x] dropped · simplify/simplification · `ContactDraftT`, `ContactSubmitResultT`,
      `FormMessageKeyT` · exported but not imported by name anywhere. All three appear in exported
      signatures, so they are reachable regardless and de-exporting is cosmetic.

- [x] dismissed · reuse-scan · `src/lib/revalidate.ts:7` · flagged as a candidate; opened both
      call sites instead — `src/globals/Footer.ts:13` and `src/collections/hooks/revalidatePage.ts:9,14`
      already route through it. This slice *is* the dedup, not a reinvention of it.
- [x] dismissed · reuse-scan · `contact-form-attachments.tsx:39` · the filename list resembles
      `SpecStrip` (`src/components/ui/spec-strip.tsx:12`). Opened both: SpecStrip takes
      `SpecItemT` name/value pairs and renders key-over-value; this list is bare strings. Not a dupe.
- [x] dropped · reuse-scan · `contact-form-field.tsx:6-11` · `fieldShellClasses` /
      `fieldControlClasses` mirror `buttonClasses()` (`src/components/ui/button.tsx:18`). Same
      exported-class-builder idiom, different surface — following the repo's idiom, not duplicating it.

## Reuse scan

Ran `primitive-reuse-scan`. Homes resolved to `src/components/ui`, `src/components/media`,
`src/lib/**` and `src/lib/i18n/use-translation.ts` (no `hooks/`, `types/`, `utils/` or
`constants/` in this repo) and written to `.reuse-scan.json` at the root — the map went there
rather than into `AGENTS.md`, which is carrying another session's uncommitted hunk. One Explore
agent catalogued the homes; the slice's new code was then matched against it. 3 fixed,
2 dismissed, 1 dropped, 0 open; every finding is in `## Findings` above, tagged `reuse-scan`.
`Button`, `Checkmark`, `useTranslation` and `revalidateAllPages` were already reused correctly.

## Simplify pass

Ran `/simplify` — 4 cleanup agents (reuse, simplification, efficiency, altitude) in parallel.
10 fixed, 1 skipped, 1 dismissed, 1 dropped; every finding is folded into `## Findings` above,
tagged `simplify/<angle>`. The three agents disagreed twice (merge the two controls; drop Zustand);
both disagreements are resolved on the lines above with the reason.

## Tests & suite

- `pnpm typecheck` — green (pre-gate, and again after the fixes)
- `pnpm lint` — green (pre-gate, and again after the fixes)
- `pnpm test:int` — 7 files / 25 tests (pre-gate) → **8 files / 33 tests passed** after the
  gate's fixes and new specs; this is the whole vitest suite, the DB-backed seed spec included
- `pnpm vitest run tests/unit` — 18 passed (pre-gate) → 26 passed after the gate's new tests
- `pnpm build` — green, 42 static pages, run twice for the Zod bundle A/B, and again after the
  reuse-scan fixes (proves the `zustand/shallow` subpath resolves under Turbopack)
- `pnpm test:e2e` — **not run.** `playwright.config.ts:39` points its `webServer` at :3000, which
  is the leads app, not this site; running it would drive the wrong application. Recorded as a
  skipped finding above.

## Post-gate change

Owner asked for `scope` ("Zakres prac") to be a textarea rather than a single-line input.
Landed after the ledger closed: `scope` leaves `TEXT_FIELDS` and joins `message` in a new
`TEXTAREA_FIELDS` loop, both `md:col-span-2`. No schema change — `contactSchema.scope` was
already `string().trim()` — and `plan.md` never named the control element, so no doc drift.
`typecheck` / `lint` / `test:int` (8 files / 35 tests) / `build` (42 pages) all green after it.

Two follow-ups on top of that, same session:

- **Textareas grow with their content.** `field-sizing-content` on `fieldControlClasses`'
  consumer (`contact-form-textarea.tsx:36`), the shadcn idiom, confirmed against the Tailwind v4
  docs. `resize-y` → `resize-none`: dragging the handle writes an inline height that pins the box
  and stops the growth, so the two cannot coexist. `rows={3}` stays as the floor and as the
  fallback where `field-sizing` is unsupported; `max-h-64` keeps a 5000-character message from
  pushing the send button off the footer.
- **The attachments row no longer reads a different colour.** Root cause was not the attachments
  label: nothing in the form ever styled `::placeholder`, which a browser does not inherit the
  element's `color` into — so the five inputs and two textareas showed the UA's own grey next to
  a label rendering real text in `grau_300`. Fixed at the shared source with
  `placeholder:text-grau_300` on `fieldControlClasses` (`contact-form-field.tsx:11`), so every
  field in the row matches rather than patching the one that stood out.

`typecheck` / `lint` / `test:int` (8 files / 35 tests) / `build` (42 pages) green after both.
