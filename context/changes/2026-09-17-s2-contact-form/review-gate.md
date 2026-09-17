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

- [x] 🔴 CRITICAL · fixed · impl-review + code-review · `contact-form/contact-form.tsx:92` ·
      `FormApi.reset(values)` reassigns `options.defaultValues` (`FormApi.js:127-136`), so the
      restored draft became the form's permanent reset target and the post-send reset refilled
      every field with the enquiry just sent — masked today only by `FormApi.update()` wiping
      values on the compensating re-render, which stops masking it on the second send in a
      session. Fixed at both ends: `{ keepDefaultValues: true }` on the restore, explicit
      `reset(DEFAULT_VALUES)` after submit, and `DEFAULT_VALUES` hoisted to a module constant
      so `update()`'s deep compare never fires.
      test: TDD · unit — `tests/unit/contact-form-reset.spec.ts`; verified red by deleting
      `keepDefaultValues` (1 failed), green with it.
- [x] 🟡 WARNING · fixed · code-review · `contact-form/contact-form.tsx:61` · `handleSubmit`
      rethrows whatever the handler throws and its caller can only `void` the promise, so an
      offline browser or a server-action id invalidated by a redeploy left a silent dead
      button. Wrapped the action call in try/catch and surfaced `t('error')`.
      test: no automated test · — the failure is a network/RSC-transport condition; faking it
      needs a DOM render harness this slice has no other use for.
- [x] 🟡 WARNING · fixed · code-review · `contact-form/contact-form.tsx:62` · a second submit
      kept the previous `serverError` / `isSent` on screen while the new one was in flight.
      Both now reset at the top of the handler.
      test: no automated test · — same reason as above.
- [x] 🟡 WARNING · fixed · code-review · `contact-form/contact-form.tsx:194` · the submit button
      was `disabled` until consent was ticked, so the visitor got no error explaining why —
      the gate hid its own failure message. Now disabled only while submitting; the schema
      reports the unticked box.
      test: TDD · unit — covered by `contact-schema.spec.ts`'s unticked-consent case.
- [x] 🔵 OBSERVATION · fixed · code-review · `contact-form/contact-form-field.tsx:27` · errors
      appear only on submit, so a screen-reader user pressed Send and heard nothing. Error
      spans are now `role="status" aria-live="polite"`, and `aria-describedby` is set
      unconditionally rather than only when an error is present (a conditional one is not
      announced when it appears).
- [x] fixed · tailwind-v4-audit · `contact-form/contact-form-field.tsx:6` · error text/border
      used `red-400` while `--color-error: #d45d5c` is declared at `styles.css:98` with zero
      consumers repo-wide. All five sites now use `text-error` / `aria-invalid:border-error`.
- [x] dismissed · tailwind-v4-audit · `contact-form/contact-form.tsx:170` · `rounded-[1px]`
      flagged as an arbitrary value this slice invented — it isn't; `git show HEAD:src/components/footer/contact-form.tsx`
      has it at line 38. It belongs to the tdg port slice, not this one.
- [x] dropped · tailwind-v4-audit · `styles.css:98` · `--color-error` is 3.66:1 on white,
      short of WCAG AA. Real, but it's the token's problem across the whole site, not this
      slice's — changing it here would recolour pages this change never touched.
- [x] fixed · tailwind-v4-audit · `contact-form/contact-form-input.tsx` · `focus:ring-0` was a
      no-op (nothing sets a ring). Removed.
- [x] fixed · module-cohesion-audit · `src/lib/contact/types.ts` · a module holding exactly one
      type used by exactly one file. Inlined `ContactSubmitResultT` into
      `submit-contact-form.ts` and deleted the file. Confirmed a `'use server'` module may
      export a type by making the edit and reloading a page that imports it.
- [x] fixed · module-cohesion-audit + comment-noise · `src/lib/i18n/locales/*.json` · three
      keys (`submit`, `tooShort`, `invalidPhone`) had no consumer. Removed from both locales.
- [x] fixed · structure-scatter-audit · `src/components/footer/` · four contact-form files sat
      loose beside the footer's other components. Moved into
      `src/components/footer/contact-form/`; `site-footer.tsx:4` updated.
- [x] fixed · structure-scatter-audit · `contact-form-input.tsx` / `contact-form-textarea.tsx` ·
      the two controls duplicated label + error + control markup, which is why the a11y and
      token fixes would otherwise have had to land twice. Extracted `ContactFormField` +
      `fieldControlClasses` inside `footer/contact-form/`.
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
- [x] fixed · code-review · `contact-form/contact-form.tsx:192` · `form.Subscribe` selected an
      object literal, so it re-rendered the button on every form state change. Now selects the
      `isSubmitting` primitive.
- [x] fixed · code-review · `contact-form/contact-form-input.tsx:15` · no `autoComplete`, so the
      browser could not fill name/email/phone. Added on the three fields that have a standard
      token.
- [x] fixed · comment-noise-audit · across the slice · comments restating the code removed;
      the ones carrying rationale the code cannot (`keepDefaultValues`, `.refine` over
      `z.literal(true)`, the key-not-sentence seam, the `getServerSnapshot` gate) kept.
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
- [x] fixed · impl-review · `plan.md` · four contract drifts between plan and implementation:
      `submitContactForm(input, locale)` vs the planned single argument; the store's
      `{ draft, setDraft, clearDraft }` vs the planned `{ values, setValues, clear }`;
      unplanned exports `MESSAGE_MAX_LENGTH` and `firstIssueKey`; and the now-deleted
      `types.ts`. Plan amended to match what shipped.

- [x] fixed · simplify/efficiency · `contact-schema.ts:4` · `import { z } from 'zod'` shipped the
      whole Zod barrel — ~30 locale error maps plus `coerce`/`iso` and every unused schema class —
      to the client on **every** route, because this is the only module that puts Zod in the client
      graph and the footer is in the root layout. Turbopack does not shake it out. Swapped to named
      value imports plus `import type { z }` for the one `z.infer`. Measured on a real `pnpm build`,
      gzipped total of `.next/static/chunks/*.js`: **970,660 → 913,397 bytes**, a 56 KB saving on
      every page. Verified by building both ways.
- [x] fixed · simplify/altitude + simplify/reuse · `submit-contact-form.ts` · the action resolved
      translation keys itself, duplicating the form's resolver: it took an untrusted `locale` it had
      no other use for, and the two resolvers had already drifted (the action fell back to the
      generic `error`, the form to `undefined`). The failure channel is now
      `{ ok: false, errorKey }`; `locale`, `isLocale`, `getTranslations` and the local `translate`
      are gone, and the client does `t(result.errorKey)`. One owner of key-to-sentence, and the
      single-argument signature the plan originally specified.
- [x] fixed · simplify/altitude · `src/lib/use-store-hydrated.ts` · deleted. Checked against the
      installed source rather than assumed: `zustand/middleware` runs `hydrate()` synchronously at
      store creation for a synchronous storage (`middleware.js:471-473`, `toThenable` at `:392`), so
      with `sessionStorage` the store is already hydrated before any effect runs — and the
      hydration-mismatch the gate cited cannot occur here because nothing renders `draft` (it is
      read with `getState()` inside an effect). The restore is now a plain mount effect, and the
      generic `PersistedStoreT` — one caller, eight lines of structural typing — went with it.
- [x] fixed · simplify/reuse + simplify/altitude + simplify/simplification · the consent field ·
      it hand-rolled its own id pair and a **third** copy of the error live region, i.e. the one
      field that opted out of the field component. Extracted `contact-form-checkbox.tsx` beside its
      siblings and pulled the region into a shared `FieldError`, so input, textarea and checkbox now
      share one definition of "a field with an error region" — and the comment explaining why that
      region is load-bearing sits on the single copy.
- [x] fixed · simplify/reuse · `contact-form-attachments.tsx:20` · the label re-typed the inputs'
      underline verbatim, so changing the border colour or the `pt-8 pb-2` rhythm would have
      silently desynchronised the attachments row from the fields above it. Split
      `fieldControlClasses` into `fieldShellClasses` (the underline, usable by a `<label>`) plus the
      control-only half, and composed with `twMerge` — the repo idiom (`button.tsx:25`).
- [x] fixed · simplify/reuse + simplify/simplification + simplify/altitude · the consent exclusion ·
      `const { acceptsTerms: _acceptsTerms, ...draft } = …` was written in two places and the rule
      it encodes is privacy-relevant. Now one exported `toDraft()` in the store, which `setDraft`
      and the empty-draft seed both go through; the form's listener is just
      `setDraft(formApi.state.values)`.
- [x] fixed · simplify/simplification · `contact-form.tsx:26-39` · `TextFieldT.label` equalled
      `.name` on all five rows, so it was a column kept in sync with itself. Dropped, along with the
      `TranslationKeyT` import that existed only for it.
- [x] fixed · simplify/simplification · `contact-form-input.tsx:16` · a `className` prop no call
      site passed — copied from the textarea's shape, where it is used. Removed.
- [x] fixed · simplify/altitude · `contact-schema.ts:41` · `firstIssueKey` took `readonly unknown[]`
      and cast, discarding typing both callers already have. Parameter is now structural
      (`readonly ({ message: string } | undefined)[]`), which both TanStack's field meta and Zod's
      own issues satisfy — no cast, no library coupling, and the dead bare-string branch is gone.
- [x] fixed · simplify/efficiency · `contact-form-store.ts:24` · the guard's comment was factually
      wrong: it blamed "blur and re-render churn", but in form-core 1.33.5
      `triggerOnChangeListener` is reached only from `setValue` and the array mutators — blur and
      re-renders never call it. The real payoff is that the debounce timer is held *per field*, so
      several fields' timers land back to back after typing stops. Comment corrected and the guard
      swapped from two full `JSON.stringify` calls to a key-by-key compare that short-circuits on
      the field just edited.
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

- [x] fixed · reuse-scan · `contact-form-store.ts:42` · `isSameDraft` hand-rolled a shallow
      compare next to a Zustand store — `shallow` from `zustand/shallow` is the library's own
      primitive and already a dependency. Confirmed equivalent against its source: same
      `Object.is` per key, plus a key-count check this one lacked. Also removes the
      `Object.keys(next) as (keyof ContactDraftT)[]` assertion.
- [x] fixed · reuse-scan · `contact-form-{input,textarea,checkbox}.tsx` · `const id = useId()`
      + ``const errorId = `${id}-error` `` written three times. The control's `aria-describedby`
      and the id `FieldError` renders must be the same string, so that pairing now has one owner:
      `useFieldIds()` in `contact-form-field.tsx:16`, beside the component that consumes it.
- [x] fixed · reuse-scan · `contact-form-checkbox.tsx:48` · the label's class was a
      template-string concat while every other control in the slice composes with `twMerge`
      (`contact-form-field.tsx:8`, `contact-form-textarea.tsx:40`). Last one converted.
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
