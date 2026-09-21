---
date: 2026-09-17
researcher: ex-Plant
git_commit: 89b4f7ec93cf9dbc1e4ae10b6f592249dfb4ce21
branch: main
repository: landing_26
topic: 'Wiring the footer contact form to TanStack Form, Zod and a persisted Zustand store'
tags: [research, codebase, contact-form, tanstack-form, zod, zustand, i18n, validation]
status: complete
last_updated: 2026-09-17
last_updated_by: ex-Plant
---

# Research: wiring the footer contact form to TanStack Form, Zod and Zustand

**Date**: 2026-09-17
**Researcher**: ex-Plant
**Git Commit**: 89b4f7ec93cf9dbc1e4ae10b6f592249dfb4ce21
**Branch**: main
**Repository**: landing_26

## Research Question

The footer contact form is markup with no behaviour. Give it:

- TanStack Form + Zod, using the schemas that already exist in the reference repos rather than
  inventing new ones
- Zustand with the field values persisted to browser storage (asked for as `localStorage`; settled
  on `sessionStorage` on 2026-09-17 — see `## Open Questions` 1)
- validation on both the client and the server
- one `name` field instead of the `firstName` / `lastName` split the tdg port introduced
- exactly two required fields — the e-mail address, and acceptance of the privacy policy / terms
- no submission sink yet; where an answer is delivered is the next change

## Summary

**The precedent is real and close.** Chaos Kitchen has a working contact form — schema, client
component and server action — on this exact stack, and all three share one Zod object. Three of the
four reference repos use TanStack Form with Zod v4 through Standard Schema (`validators: { onSubmit:
schema }`, no resolver package), and three use Zustand `persist` for form drafts. Nothing has to be
designed from first principles.

**Four things do not transfer, and each is a decision rather than a detail. Two were settled by the
owner on 2026-09-17:**

1. **The hydration gate is mandatory here and absent from the closest precedent.** Chaos Kitchen and
   the leads app read persisted state straight through during render with no gate. They get away
   with it only because their forms live inside dialogs that never server-render. Our form renders
   inline in the root layout on statically prerendered pages. Copying that pattern produces a
   hydration mismatch and, worse, wipes the saved draft. fest's `useStoreHydrated` is the only
   correct precedent in any repo.
2. ~~Bilingual error messages break the shared-schema trick.~~ **Settled: the schema carries
   translation keys, not messages**, each side resolving with its own accessor. Neither reference
   repo does this — Chaos Kitchen shares one literal object because its Polish is hardcoded, fest
   duplicates the rules server-side because a `createSchema(t)` factory cannot run there. Keys typed
   as `TranslationKeyT<'form'>` keep a typo a compile error.
3. ~~`localStorage` runs against the repo trend.~~ **Settled: `sessionStorage`**, which is what the
   two most recent repos already do for form drafts. The draft dies with the tab, so nothing has to
   clear it.
4. ~~There is no privacy policy to consent to.~~ **Settled: none is created here.** The mandatory
   checkbox ships pointing at nothing — consent is still required to submit, it just has nothing to
   read. FR-032 stays unsatisfied; recorded as debt.

Server-side, this repo is greenfield: no server action, no route handler, no Payload custom
endpoint of our own exists yet. There is also no field/input/error/spinner primitive in
`src/components/ui/` — Chaos Kitchen's `src/components/forms/` layer has no counterpart here.

## Detailed Findings

### 1. What exists today

`src/components/footer/contact-form.tsx` is pure markup ported from tdg. No `action`, no `onSubmit`,
no validation, no submit state. Its only state is the consent checkbox driving `disabled`.

Two details that bite immediately:

- **The send button submits nothing.** `src/components/ui/button.tsx:56-86` defaults `type` to
  `'button'`; the form's `<Button variant="dark" label={t('send')} … />` at
  `src/components/footer/contact-form.tsx:48-53` never passes `type="submit"`.
- **`ContactFormInput` is not a client component.** `src/components/footer/contact-form-input.tsx`
  is a server-safe uncontrolled `<input name={id}>` with an `sr-only` label. Wiring it to TanStack
  Form means either passing a field object down (making it a client component) or keeping it dumb
  and threading `value` / `onChange` / `onBlur` plus an error slot as props.

`src/components/footer/contact-form-attachments.tsx` already renders a working multi-file input that
only lists filenames. It collects nothing and has nowhere to send a file (see §7) — dead UI.

The form renders through `src/components/footer/site-footer.tsx` at
`src/app/(frontend)/[[...segments]]/layout.tsx:45` — **inline in the root layout**, inside
`TranslationsProvider` (`layout.tsx:36`), on routes that call `generateStaticParams()`
(`src/app/(frontend)/[[...segments]]/page.tsx:34`) with `dynamicParams = true` (`page.tsx:30`).

### 2. TanStack Form + Zod — the precedent

`@tanstack/react-form` appears in three repos and is the only form library in any of them. There is
zero react-hook-form, Formik or `@hookform/resolvers`. Zod is v4 everywhere. tdg has no form
library at all — its contact form is a dead `<form action=''>`; its only contribution is a field
list.

**The template to copy** is Chaos Kitchen's contact domain:

- `nomad_chef/src/lib/contact/contact-schema.ts` — framework-free, no `'use client'`, no
  `'use server'`
- `nomad_chef/src/components/sections/contact/contact-form.tsx` — imports it
- `nomad_chef/src/lib/contact/send-contact-email.ts` — `'use server'`, imports the same object,
  takes `input: unknown` and re-parses with `safeParse`, never trusting the client's types

That last point *is* "validation on both sides", achieved with one schema rather than two.

House conventions, consistent across all three repos:

- **`onSubmit` validation only.** No `onBlur` anywhere. The single `validators.onChange` in the set
  (`fest/fest-frontend/components/forms/auth/use-auth-form.ts:35`) is a side effect that clears a
  server error and returns `undefined` — not a rule. Per-blur feedback would be a new decision.
- **Consent modelled two ways** — `.refine((v) => v === true, { error: … })`
  (`nomad_chef/src/lib/newsletter/newsletter-schema.ts:12`) or `z.literal(true, { error: … })`
  (`fest/fest-frontend/components/forms/auth/schema.ts:31`). Both valid in v4.
- **Optional e-mail / phone is `z.union([z.literal(''), z.email(msg)])`**
  (`wykonczymy/src/components/forms/worker-form/worker-schema.ts:8`) — an empty HTML input yields
  `''`, not `undefined`, so `.optional()` does not do the job.
- **Flat object plus `superRefine`, never `discriminatedUnion`.**
  `nomad_chef/src/lib/cart/cart-schema.ts:6-8` states the reason: TanStack keeps the values of
  unmounted fields in one state shape.
- **Server errors go to local `useState`, never through `errorMap`.**
  `nomad_chef/src/components/sections/cart/cart-form.tsx:39-41` argues the case explicitly — a
  truthy success return would otherwise be mistaken for an error.
- **No `standardSchemaValidator`, no `formOptions()`.** Schemas are passed directly; shared config
  travels through custom hooks.

Two competing field-wiring styles exist. Chaos Kitchen uses plain `useForm` + `form.Field`
render-props + explicit prop drilling; fest and the leads app use `createFormHook` + `form.AppField`
+ `useFieldContext()`. For one small form, the plain `useForm` route is both lighter and the closer
precedent.

**No phone validation exists anywhere.** Every phone field in every repo is bare `z.string()`. A PL
format rule would be designed from scratch; the nearest analogue is Chaos Kitchen's
`POSTAL_CODE_RE` / `NIP_RE` pair at `nomad_chef/src/lib/cart/cart-schema.ts:3-4`.

Do not copy `nomad_chef/src/lib/contact/contact-schema.ts:4` verbatim — its error string is
double-quoted inside single quotes, so the visitor sees the quote characters.

### 3. Zustand + persist — and the hydration trap

Chaos Kitchen `src/stores/cart-form-store.ts` is the closest structural match: Zustand 5 + `persist`
+ `createJSONStorage`, a JSON-equality guard in the setter to skip redundant writes, a 500 ms
debounced `listeners.onChange` feeding it, and the draft spread over fresh defaults on read. The
leads app generalises the same thing into a `createFormStore(name)` factory driving 13 drafts.

**Both read persisted state during render with no hydration gate.** They are safe only by accident:
their forms render inside dialogs (`nomad_chef/…/dialog.tsx:91` — `{isOpen && (`), so the server
never renders them.

Our form is not in a dialog. It is inline in the layout on prerendered pages, so the server renders
it with empty defaults while the client's first render already has the persisted draft — React
hydration mismatch (#418) on every visit with a saved draft.

The gate that fixes it is fest's, and fest documents *why* it is not cosmetic: without it, the
debounced write fires from empty defaults during the first client render and **deletes the saved
draft**. Missing the gate does not merely warn — it destroys the feature.

`fest/fest-frontend/lib/stores/use-store-hydrated.ts`:

```ts
export function useStoreHydrated<T>(store: PersistedStoreT<T>): boolean {
  return useSyncExternalStore(
    (cb) => store.persist.onFinishHydration(cb),
    () => store.persist.hasHydrated(),
    getServerHydrated, // () => false
  )
}
```

Explicit negatives across all four repos: no `skipHydration`, no `version` / `migrate`, no
`useShallow`, no `immer`, no `devtools`, and no persisted store behind a React provider.

`next.config.ts` has **no React Compiler flag**, so the trap recorded in the leads app's
`context/foundation/lessons.md:77-81` (a bound hook passed as a parameter crashing on hook order)
does not apply here.

### 4. Server-side validation — greenfield

There is **no `'use server'` action of ours, no `app/api/**/route.ts` of ours, and no Payload custom
`endpoints`** anywhere in `src/`. The only server surface is Payload's generated scaffolding, marked
`DO NOT MODIFY`.

`src/app/(payload)/api/[...slug]/route.ts` already owns the whole `/api/**` namespace, but a
concrete segment beats a catch-all in Next's matcher, so a hand-written handler coexists. Chaos
Kitchen proves it: it runs `src/app/(payload)/api/[...slug]/route.ts` alongside
`src/app/api/p24/webhook/route.ts`. Pick a segment no collection uses — the collections are `users`,
`media`, `pages`, `projects`, `interior-styles`.

**`trailingSlash: true` (`next.config.ts:12`) applies to route handlers too.** Probed against the
running dev server:

```
GET /api/users/me   -> 308  redirect -> /api/users/me/
GET /api/users/me/  -> 200
GET /api/foo        -> 308  redirect -> /api/foo/
GET /api/foo/       -> 404
```

A 308 preserves method and body and `fetch` follows it, so it works — but it is a wasted round trip
and a footgun for any client that does not follow. **Write the trailing slash into the fetch URL.**

A server action sidesteps the URL question entirely and is what Chaos Kitchen uses for its contact
form. A route handler is what we would need later if the submission is forwarded to the leads app —
but that is the next change, and nothing here forces the choice now.

Env: `src/lib/env-schema.ts` holds pure schemas, `src/lib/env.server.ts` is five lines
(`import 'server-only'` + `serverSchema.parse(process.env)`), `src/lib/env.ts` keys each public var
statically so the bundler inlines it. `eslint.config.mjs:26-44` rejects raw `process.env` in
`src/**` with four exemptions. Note `.env.example` **already declares `LEADS_INTAKE_URL` and
`LEADS_INTAKE_SECRET`, neither of which is in `serverSchema`** — documented but unvalidated. This
change has no sink, so neither is needed yet.

### 5. i18n — and the bilingual schema conflict

`src/lib/i18n/i18n.ts` exports `getTranslations(locale)` for server use; `useTranslation` is
`'use client'` (`src/lib/i18n/use-translation.ts:1`). The split is documented at
`use-translation.ts:7-8`. A route handler has no `params.segments`, so it must take the locale from
the request and validate it with `isLocale()`.

Interpolation is live machinery, not dead: `use-translation.ts:21-26` replaces `{{param}}`, and the
signature is `t(key, params?)`. **No call site passes `params` today** and `tooShort` — the only key
using it — is referenced by nothing.

The `form` namespace (`src/lib/i18n/locales/pl.json:12-32`, `en.json:12-32`) holds two disjoint
sets. Dead placeholders from F2: `name, message, submit, sending, success, error, required,
invalidEmail, invalidPhone, tooShort`. Live keys from the tdg port: `firstName, lastName, email,
phone, scope, area, acceptTerms, send, attachments`.

This lands well: **`name` = "Imię i nazwisko" is already waiting** for the one-name-field decision,
and `firstName` / `lastName` become dead once the split is dropped. The validation-message keys
(`required`, `invalidEmail`, `invalidPhone`, `tooShort`) are already there in both locales.

`pl.json:29` — `acceptTerms` is `"Akceptuję politykę prywatności"`, **plain text, not a link**.

**The conflict.** Chaos Kitchen shares one literal schema object with its server action *because*
its messages are hardcoded Polish. fest's bilingual answer is `createSchema(t)` — a factory memoised
on `[t]`, messages resolved at build time
(`fest/fest-frontend/components/forms/auth/schema.ts:1-38`). But a factory of `t` cannot run on the
server, so fest's `sign-up-action.ts:10-15` declares a **second, separate, untranslated schema** and
loses the messages. We want both bilingual messages and one shared schema; neither repo has done
that. Options worth weighing in the plan:

- Schema carries **message keys**, not messages; each side resolves them with its own accessor
  (`useTranslation` on the client, `getTranslations(locale)` on the server). No duplication, but
  error values stop being human-readable strings.
- Factory `createContactSchema(t)` shared as a function; the server calls it with
  `getTranslations(locale).form` wrapped in a `t`-shaped adapter. One rule set, both sides
  translated, at the cost of threading the locale into the request.
- fest's route: duplicate rules, translate only on the client. Cheapest, and it drifts.

### 6. UI primitives — the gap

`src/components/ui/` holds seven files and **none of them is an input, field, label, error-message
or spinner primitive**: `button.tsx`, `button-link.tsx`, `carousel-arrow.tsx`, three icons, and the
`spec-*` display trio. Chaos Kitchen's `src/components/forms/` layer (`field-shell.tsx`,
`form-text-input.tsx`, `form-textarea.tsx`, `form-checkbox.tsx`) has no counterpart here.

**There is no loading or pending state anywhere in `src/`** — no spinner, no `isSubmitting`, no
`aria-busy`, no `useTransition`, no `useActionState`. `Button` has no `aria-busy` prop; adding one
edits the primitive rather than working around it locally.

The house client-component style is narrow and uniform: `useState` with an `is`-prefixed boolean
updated inline in the handler; `useId()` for input/label pairing; named `function` handlers only
when they have a body; `useEffect` rare and always justified in a comment (two instances repo-wide).

`button.tsx:15-28` explains why the pill is exported as classes and why `w-fit` is load-bearing —
read it before touching the submit control's layout.

### 7. The leads app contract (next change, but it constrains this one)

`POST /api/webhooks/wpforms` on the leads app, shared secret in the `X-Webhook-Secret` header, no
CORS configured — **server-side calls only**.

**AGENTS.md describes the payload as "a flat set of text answers"; it is not.** The real shape is:

```
fields: Record<string, { name, value?, type? }>
```

`wykonczymy/src/lib/leads/wpforms.ts:43-75` throws the keys away with `Object.values`. **The human
label is the field's identity**, and three regexes extract the structured columns
(`wykonczymy/src/lib/leads/normalize-lead.ts:16-18`):

| lands in | regex |
| --- | --- |
| `email` | `/mail/i`, plus the value must look like an e-mail |
| `phone` | `/phone\|telefon\|\btel\b/i` |
| `name` | `/name\|imi[eę]\|nazwisko/i` |

Checked against our bilingual labels: PL ("Adres e-mail", "Telefon", "Imię i nazwisko") and EN
("E-mail address", "Phone", "Full name") both hit all three. Coincidental, but it holds. Everything
else survives only inside the `rawData` jsonb blob and renders by label.

Two facts worth carrying forward: the leads app **already sends the visitor an auto-reply**
("Dziękujemy za kontakt") whenever an e-mail can be extracted; and **attachments are impossible**
there — `leads` has no upload field and the webhook reads `request.text()`, so multipart never
parses. FR-031 is work in that repo, exactly as AGENTS.md states.

### 8. Testing

`vitest.config.mts` runs one jsdom project. The `include` **enforces** the naming: int tests are
`tests/int/<name>.int.spec.ts`, unit tests are `tests/unit/<name>.spec.ts` (no `.unit.` infix). E2E
lives in `tests/e2e/<name>.e2e.spec.ts`.

`vitest.setup.ts` is four lines. No `@testing-library/jest-dom`, no `cleanup()`, no `globals: true` —
every test imports `describe` / `it` / `expect` explicitly.

Int tests instantiate Payload directly (`getPayload({ config: await config })`) against the **real
local Postgres on 5436**; `tests/int/projects.int.spec.ts:20-38` creates and deletes a real row with
a comment noting that a leaked row is a live page.

**No precedent exists for rendering a component in a test.** `@testing-library/react` 16.3.0 is
installed and `@vitejs/plugin-react` is wired into the vitest config, but nothing imports it.
Rendering `<ContactForm>` would also be the first time anything stands up `TranslationsProvider` in
a test. The two existing unit tests are pure-function tests. A Zod schema is a pure function — it
tests cleanly at `tests/unit/`, which is the cheapest useful guard here.

**Bug found, out of scope:** `playwright.config.ts:39` sets `webServer.url` to
`http://localhost:3000` with `reuseExistingServer: true`. This repo's dev server is on **:3001**;
:3000 is the leads app (verified — it answers `307 → /zaloguj`). `pnpm test:e2e` therefore reuses
the wrong application. Worth its own fix.

### 9. Placement

Path alias is `@/* → ./src/*`. `src/lib/` has two shapes: `content/` and `i18n/` as self-contained
domain folders, and flat single-concern modules at the root (`routing.ts`, `revalidate.ts`,
`carousel.ts`). Note that `carousel.ts` keeps a hook in `lib/` — **there is no `src/hooks/`, no
`src/stores/`, no `src/types/` and no `src/lib/schemas/`.**

Nothing in AGENTS.md or `context/foundation/*` constrains a `lib/` sub-layout. The consistent
placement is a `src/lib/contact/` folder mirroring `src/lib/i18n/`:

- schema → `src/lib/contact/contact-schema.ts` (the same name and path Chaos Kitchen uses)
- store → `src/lib/contact/contact-form-store.ts`. Chaos Kitchen uses a top-level `src/stores/`;
  this repo has none, and one store does not earn a fourth top-level directory under `src/`.
- server entry → a server action beside the schema, or `src/app/api/contact/route.ts` if a route is
  wanted (see §4).

Style differs from Chaos Kitchen on the way in: this repo is `singleQuote: true`, `semi: false`,
`printWidth: 100`.

## Code References

- `src/components/footer/contact-form.tsx` — the target; markup only
- `src/components/footer/contact-form.tsx:48-53` — send button missing `type="submit"`
- `src/components/footer/contact-form-input.tsx` — server-safe uncontrolled input
- `src/components/footer/contact-form-attachments.tsx` — collects nothing, no sink exists
- `src/app/(frontend)/[[...segments]]/layout.tsx:36,45` — provider, and the footer rendered inline
- `src/app/(frontend)/[[...segments]]/page.tsx:30,34` — `dynamicParams`, `generateStaticParams`
- `src/components/ui/button.tsx:15-28,56-86` — `w-fit` rationale, and the `type` prop
- `src/lib/i18n/use-translation.ts:1,7-8,21-26` — client-only, the server split, interpolation
- `src/lib/i18n/locales/pl.json:12-32` — the `form` namespace; `:29` is the consent label
- `src/lib/env-schema.ts` — Zod v4 idioms already in use here (`z.email()`, `superRefine`)
- `eslint.config.mjs:26-44` — the raw `process.env` ban and its exemptions
- `next.config.ts:12` — `trailingSlash: true`, which reaches route handlers
- `playwright.config.ts:39` — points at :3000, the wrong app
- `nomad_chef/src/lib/contact/contact-schema.ts` — the schema template (note the quoting bug at :4)
- `nomad_chef/src/components/sections/contact/contact-form.tsx:29-41,45-54,76-92` — the form shape
- `nomad_chef/src/lib/contact/send-contact-email.ts:1-19` — server re-parse of `input: unknown`
- `nomad_chef/src/lib/cart/cart-schema.ts:3-8,38-44` — flat object + `superRefine`, PL format regexes
- `nomad_chef/src/lib/newsletter/newsletter-schema.ts:3-20` — consent `.refine`, `defaultXValues()`
- `nomad_chef/src/stores/cart-form-store.ts` — persist + equality guard + debounced write
- `nomad_chef/src/components/forms/field-shell.tsx:10-27` — error rendering + a11y wiring
- `fest/fest-frontend/lib/stores/use-store-hydrated.ts` — the hydration gate we need
- `fest/fest-frontend/components/forms/auth/schema.ts:1-38` — `createSchema(t)` factory
- `fest/fest-frontend/app/actions/auth/sign-up-action.ts:10-15` — the duplicated server schema
- `fest/fest-frontend/components/forms/hooks/use-form-status.ts:10-19` — `submissionAttempts > 0` gate
- `wykonczymy/src/components/forms/worker-form/worker-schema.ts:4-23` — the optional-email idiom
- `wykonczymy/src/lib/leads/wpforms.ts:11-22,43-75` — the intake schema and the label-is-identity mapping
- `wykonczymy/src/lib/leads/normalize-lead.ts:16-18` — the three extraction regexes
- `context/foundation/live-site-snapshot/scraped-content.md:33-49` — the live field set

## Architecture Insights

- **One schema, two consumers, server re-parses `unknown`.** This is the repo family's answer to
  "validation on both sides", and it is a plain application of *parse, don't validate* — the schema
  is the boundary, not a pair of checks that can drift.
- **Standard Schema removed the resolver layer.** TanStack Form v1 takes a Zod object directly.
  Anything recommending `zodResolver` or `standardSchemaValidator` is describing a dead API.
- **The dialog is doing invisible work in two repos.** A component that never server-renders hides
  every SSR hazard in the state it reads. Moving the same store into a layout is not a relocation —
  it changes which renders exist.
- **Label-as-identity at the leads boundary is a stringly-typed contract.** The receiving side
  matches on human text with regexes, so a copy edit in the CMS could silently stop populating a
  column. Whatever we send, the three matched labels are effectively API, not copy.
- **Persistence and validation pull opposite ways on timing.** Validation here fires `onSubmit`
  only; persistence must fire on change. They share a state tree but not a cadence, which is why the
  precedent debounces the write and guards it on equality.

## Historical Context (from prior changes)

- `context/changes/2026-09-04-tdg-port/` — where `ContactForm` and its inputs came from, including
  the `firstName` / `lastName` split this change removes and the attachments input that collects
  nothing.
- `context/changes/2026-09-17-s2-contact-form/change.md` — the owner's scope statement, including
  "the schemas are already written in the reference repos — find them, do not invent new ones".
- The `form` i18n namespace's unused half (`required`, `invalidEmail`, `invalidPhone`, `tooShort`)
  dates from F2 and was written in anticipation of exactly this change.

## Open Questions

Four decisions the plan cannot make on its own, ordered by how much they change the shape of the
work. **All four were resolved by the owner on 2026-09-17 — struck through, with the reasoning
kept because it is what the plan builds on.**

1. ~~**`localStorage` or `sessionStorage`?**~~ **DECIDED 2026-09-17: `sessionStorage`.** The draft
   dies with the tab, so nothing has to clear it and a shared machine keeps nothing. This also puts
   us back on the repo trend — `nomad_chef` and the leads app both persist form drafts to
   `sessionStorage`. Same `createJSONStorage` call, other storage.
2. ~~**How do bilingual messages and a shared schema coexist?**~~ **DECIDED 2026-09-17: the schema
   carries translation keys, not messages** (option (a) in §5). Each side resolves with its own
   accessor — `useTranslation('form')` on the client, `getTranslations(locale).form` on the server —
   so there is one rule set in one file and the server never has to run a React hook. The known cost
   of (a), that error values stop being human-readable strings and a typo would render itself into
   the UI, is closed by typing them as `TranslationKeyT<'form'>` (`src/lib/i18n/i18n.ts:21`): a bad
   key fails typecheck. `useTranslation` also warns and falls back to the raw key
   (`use-translation.ts:16-19`), so a miss is visible rather than blank.
3. ~~**The privacy policy does not exist.**~~ **DECIDED 2026-09-17: not now — the checkbox stays a
   bare checkbox.** No policy page is created in this change and the label stays plain text, not a
   link (`src/lib/i18n/locales/pl.json:29`). Consent is still required to submit; it simply has no
   target to point at yet. **Recorded debt:** FR-032 (the visitor must be able to see what happens
   to their data before submitting) is not satisfied, and a mandatory consent with nothing to read
   is the weakest point of the shipped form. Revisit when a legal page is added to `url-map.md`.
4. ~~**Two field-set questions the scope statement leaves open.**~~ **DECIDED 2026-09-17, both.** The
   message / description field (`Wiadomość`, FR-030, on the live WP form but dropped by the tdg
   port) **is in scope** — its `form.message` key already exists in both locales. The attachments
   input **stays** despite having no sink here and none in the leads app (§7): the whole site is
   built before anything is pushed, so an unwired control harms nobody and pulling it would only
   have to be undone in S6.

Smaller, answerable in the plan: whether to add a `src/components/forms/` primitive layer or wire
fields inline for one form; server action vs. route handler; and whether `Button` gains an
`aria-busy` prop now.
