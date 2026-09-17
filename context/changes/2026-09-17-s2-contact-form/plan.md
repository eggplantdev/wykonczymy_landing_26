# Contact form — TanStack Form, Zod, Zustand — Implementation Plan

## Overview

Give `src/components/footer/contact-form.tsx` behaviour: TanStack Form driving a shared Zod schema,
a `sessionStorage`-backed Zustand draft, and the same schema re-parsed on the server. No submission
sink — the server action validates and answers.

## Current State Analysis

Full detail in `research.md`. The four facts this plan is built on:

- The form renders **inline in the root layout** (`src/app/(frontend)/[[...segments]]/layout.tsx:45`)
  on prerendered routes, so a persisted store read during render is a hydration mismatch. The
  reference repos avoid it only because their forms sit in dialogs.
- Nothing server-side exists yet — no action, no route handler, no custom Payload endpoint.
- `src/components/ui/` has no field, error or spinner primitive, and nothing in `src/` has a pending
  state.
- `Button` defaults to `type="button"`, so the send control currently submits nothing.

## Desired End State

Filling the footer form and pressing Wyślij validates on the client, re-validates on the server, and
shows a success or error message in the active locale. Typing anything and reloading the tab
restores the draft; closing the tab discards it. Both required rules (a valid e-mail, consent
ticked) block submission with a translated message.

## What We're NOT Doing

- No submission sink. Nothing is stored, e-mailed or forwarded — that is the next change.
- No privacy policy page. The consent checkbox stays plain text, not a link. FR-032 ships unmet.
- No attachment upload. The input stays as it is, collecting filenames and sending nothing.
- No `src/components/forms/` primitive layer — one form does not earn one.
- No phone format validation. No repo has a precedent and nothing asks for it.
- No `onBlur` / `onChange` validation. Every reference repo validates `onSubmit` only.

## Implementation Approach

**One schema, keys not messages.** `contact-schema.ts` is framework-free and carries
`TranslationKeyT<'form'>` values in its `error` slots. The client resolves them with
`useTranslation('form')`, the server with `getTranslations(locale).form`. A misspelled key is a
compile error.

**A server action, not a route handler.** It is what Chaos Kitchen's contact form uses, it dodges
the `trailingSlash: true` redirect on `/api/**`, and it is a plain async function an int test can
import and call. The locale travels in the payload so the server can translate.

**Empty defaults, then a gated reset.** `useForm` initialises from constant empty values, so server
and first client render agree. Once `useStoreHydrated` reports the store rehydrated, the draft is
applied with `form.reset()`. This is the one place a `useEffect` is warranted, and it gets a comment
saying why.

---

## Phase 1: Schema, store and server action

### Changes Required:

#### 1. Translation keys

**File**: `src/lib/i18n/locales/pl.json`, `en.json`

**Intent**: Add the one validation message the schema needs and drop the two keys this change kills.

**Contract**: Add `tooLong` to the `form` namespace in both locales; remove `firstName` and
`lastName`, dead once the name split goes. `pl` is the structural source of truth
(`src/lib/i18n/i18n.ts:17`), so both files must stay key-identical.

#### 2. Shared schema

**File**: `src/lib/contact/contact-schema.ts`

**Intent**: The single validation contract for both sides, plus the empty defaults the form and the
store start from.

**Contract**: Exports `contactSchema`, `ContactFormValuesT`, `emptyContactValues()`,
`MESSAGE_MAX_LENGTH` and `firstIssueKey()`. Seven fields: `name`, `email`, `phone`, `scope`, `area`,
`message`, `acceptsTerms`. `email` (non-empty and valid), `acceptsTerms` and `message` (max length)
can fail; the other four cannot. Every `error` value is a `TranslationKeyT<'form'>`, narrowed through
a local helper so a typo fails typecheck rather than rendering itself.

Amended during the review gate — the plan said consent would be `z.literal(true)` and listed only
two failable fields:

- `acceptsTerms` is `z.boolean().refine(...)`, not `z.literal(true)`. A literal narrows the schema's
  *input* type to `true`, and TanStack Form validates the form's values, where an unticked box is
  `false` — the literal does not type-check against them. `nomad_chef` uses `.refine` for the same
  reason.
- `message` is length-capped, so it is a third field that can fail.
- `MESSAGE_MAX_LENGTH` is exported because the test asserts the boundary rather than re-typing the
  number, and `firstIssueKey()` because the form reads errors back out of TanStack's field meta,
  where a Standard Schema issue arrives as an object rather than a string. A message that is not one
  of our keys is reported as `undefined` so Zod's own English sentence never reaches a Polish
  visitor.

#### 3. Hydration gate

**File**: `src/lib/use-store-hydrated.ts`

**Intent**: Report whether a persisted Zustand store has rehydrated, `false` on the server.

**Contract**: ~~`useStoreHydrated(store)` over `useSyncExternalStore`, subscribing to
`persist.onFinishHydration`, reading `persist.hasHydrated()`, with a module-level
`getServerSnapshot` returning `false`. Lifted from `fest/fest-frontend/lib/stores/use-store-hydrated.ts`.~~

**Dropped during the review gate — this file does not exist.** Two reasons, both checked against
the installed source rather than assumed:

- `zustand/middleware` calls `hydrate()` synchronously at store creation for a synchronous storage
  (`middleware.js:471-473`, and `toThenable` at `:392` resolves a non-promise inline).
  `sessionStorage` is synchronous, so `persist.hasHydrated()` is already `true` before any React
  effect runs. The gate bought one extra render, not correctness.
- The hydration-mismatch it was meant to prevent cannot happen here: nothing renders `draft`. The
  form reads it imperatively with `getState()` inside an effect, which is client-only by
  definition.

fest needs the gate because fest renders persisted state directly. This form does not, so the
restore is a plain mount effect and the generic `PersistedStoreT` abstraction — one caller, eight
lines of structural typing — went with it.

#### 4. Draft store

**File**: `src/lib/contact/contact-form-store.ts`

**Intent**: Hold the draft and persist it to `sessionStorage`.

**Contract**: `useContactFormStore` — `{ draft, setDraft, clearDraft }` under `persist` with
`createJSONStorage(() => sessionStorage)`. `setDraft` skips the write when the incoming draft is
JSON-identical, as `nomad_chef/src/stores/cart-form-store.ts` does. `acceptsTerms` is excluded from
what is persisted: a restored tick would be consent the visitor never gave in that session.

Amended during the review gate — the plan named the members `{ values, setValues, clear }`. They
shipped as `{ draft, setDraft, clearDraft }`, and the excluded consent field is expressed as an
exported `ContactDraftT = Omit<ContactFormValuesT, 'acceptsTerms'>` so the exclusion is a type the
compiler enforces rather than a convention. `setDraft` takes full `ContactFormValuesT` and strips
consent itself through an exported `toDraft()`, so the drop is written once instead of at each
caller. The JSON-identical guard became a key-by-key compare: it short-circuits on the field just
edited instead of serialising the whole draft twice per debounced write.

#### 5. Server action

**File**: `src/lib/contact/submit-contact-form.ts`

**Intent**: Re-validate an untrusted submission and answer. No sink.

**Contract**: `'use server'`; `submitContactForm(input: unknown): Promise<ContactSubmitResultT>`
returning `{ ok: true }` or `{ ok: false, errorKey: FormMessageKeyT }`. Parses with `safeParse` and
answers with the first issue's translation key. Never trusts the client's types.

Amended during the review gate — the plan had the action resolve the key into a sentence, which
forced it to take a locale it has no other use for and made it a *second* owner of key-to-sentence
alongside the form's `t()`. The two had already drifted: one fell back to the generic `error`, the
other to `undefined`. The failure channel is a key instead, the locale parameter is gone, and the
client does `t(result.errorKey)` — so the single-argument signature the plan originally specified is
what shipped. `ContactSubmitResultT` is declared in this same file: it was briefly a
`src/lib/contact/types.ts`, which the cohesion audit flagged as a module holding one type for one
consumer.

### Success Criteria:

#### Automated Verification:

- Schema unit test passes: `pnpm vitest run tests/unit/contact-schema.spec.ts`

#### Manual Verification:

- None for this phase — nothing is rendered yet.

---

## Phase 2: Wire the form

### Changes Required:

#### 1. Field input

**File**: `src/components/footer/contact-form-input.tsx`

**Intent**: Let the existing input carry a controlled value and render an error, without inventing a
primitive layer.

**Contract**: Gains `value`, `onChange`, `onBlur`, `error` and `name` props; becomes a client
component. `aria-invalid` and `aria-describedby` are set when `error` is present, matching
`nomad_chef/src/components/forms/form-text-input.tsx:35-59`. Keeps the `sr-only` label.

#### 2. The form

**File**: `src/components/footer/contact-form.tsx`

**Intent**: Replace the local checkbox state with TanStack Form, wire the draft, and give the submit
control its three states.

**Contract**: `useForm({ defaultValues: emptyContactValues(), validators: { onSubmit: contactSchema },
onSubmit })`. Fields render through `form.Field`; the submit control reads `canSubmit` / `isSubmitting`
via `form.Subscribe`. The send `Button` gains `type="submit"`. A debounced `listeners.onChange` writes
to the store. Server result goes to local `useState`, not `errorMap` — the reasoning is in
`nomad_chef/src/components/sections/cart/cart-form.tsx:39-41`. The name split collapses to one
`name` field; `scope` and `area` stay free text.

#### 3. Message field

**File**: `src/components/footer/contact-form-textarea.tsx` (new)

**Intent**: The schema carries a `message` field and the tdg markup has no control for it, so the
form needs one. A textarea cannot borrow the input component — the element differs — so it gets its
own file rather than a `as`-prop branch inside `ContactFormInput`.

**Contract**: Same props as `ContactFormInput` minus `type`, same underline styling, spans both
columns.

#### 4. Send button

**File**: `src/components/ui/button.tsx`

**Intent**: Let a submit control announce that it is working.

**Contract**: Adds an optional `isBusy` prop setting `aria-busy`. No visual change; `disabled`
already carries the styling.

### Success Criteria:

#### Automated Verification:

- Schema unit test still passes: `pnpm vitest run tests/unit/contact-schema.spec.ts`

#### Manual Verification:

- Submitting empty shows the required-field message on the e-mail and the consent box, in PL and EN.
- A valid submission shows the success message; the draft is cleared afterwards.
- Typing, reloading the tab, and returning restores every field except the consent tick.
- Closing the tab and reopening the site shows an empty form.
- The consent box still blocks submission and the checkmark still renders.

---

## Testing Strategy

### Unit Tests:

- `tests/unit/contact-schema.spec.ts` — the schema is a pure function, so it is the cheapest useful
  guard: empty e-mail, malformed e-mail, unticked consent, an over-long message, and a minimal valid
  payload. Asserts the returned messages are **translation keys that exist in the `form` namespace**,
  which is what actually stops the key/message contract drifting.

### Manual Testing Steps:

1. Open the site on :3001, scroll to the footer, submit empty — expect two errors.
2. Fill only a valid e-mail, tick consent, submit — expect success.
3. Type into several fields, reload, confirm the draft returns and consent does not.
4. Repeat on `/en/` and confirm the messages are English.

## Whole-tree Gate

Run once, after Phase 2:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test:int`

## References

- Research: `context/changes/2026-09-17-s2-contact-form/research.md`
- Decisions: `context/changes/2026-09-17-s2-contact-form/change.md` (`## Decisions`)
- Schema + action shape: `nomad_chef/src/lib/contact/`
- Hydration gate: `fest/fest-frontend/lib/stores/use-store-hydrated.ts`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands.

### Phase 1: Schema, store and server action

#### Automated

- [x] 1.1 Schema unit test passes

### Phase 2: Wire the form

#### Automated

- [x] 2.1 Schema unit test still passes

### Whole-tree gate

- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm test:int` — 8 files, 35 tests (was 7/25 when this line was first written)
