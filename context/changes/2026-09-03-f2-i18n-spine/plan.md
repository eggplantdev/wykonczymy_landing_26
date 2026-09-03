# F2 — Localization Spine Implementation Plan

## Overview

Stand up the routing and localization spine the whole site hangs off: a `Pages` collection with a
localized `slug`, one catch-all App Router route that resolves a request path to a Payload document,
a PL/EN UI dictionary, and on-demand revalidation so an admin edit goes live without a deploy.

No page component ships in F2. What ships is the machinery S1 will render _through_ — proven by a
throwaway placeholder that S1 replaces with real markup.

## Current State Analysis

- **`trailingSlash: true` is already set** (`next.config.ts:11`) with the url-map rationale in a
  comment. F1 landed it; F2 does not touch it.
- **Payload localization is already configured** — `payload.config.ts` carries
  `localization: { locales: ['pl','en'], defaultLocale: 'pl', fallback: false }`.
- **Collections are `Users` and `Media` only.** There is no content collection and no frontend
  route beyond the scaffold's `src/app/(frontend)/page.tsx`.
- **Env is read through `src/lib/env.ts` / `env.server.ts`**; ESLint rejects raw `process.env` in
  `src/**`. A revalidation secret has to go through `serverSchema`.
- **The database is not migrated by the build.** `pnpm db:migrate:prod` is run by a human, before
  the code that needs the schema. Phase 1 produces a migration; that ordering applies.

### Key Discoveries

- **`fest` is a fourth reference repo**, undocumented in AGENTS.md:
  `/Users/konradantonik/workspace/fest/fest-frontend/lib/i18n/`. It carries a working PL/EN
  dictionary, a typed `useTranslation` hook, and a provider — on Next App Router, same shape as
  this project. Phase 3 is a port, not a design.
- **JSON locale files keep full key-level typing.** `fest/lib/i18n/types.ts` does
  `import type pl from './locales/pl.json'; export type TranslationsT = typeof pl` — TypeScript
  infers the literal shape, so every key is checked and `en.json` is structurally forced to match
  `pl.json`. This removes the reason to hand-roll a `Record` in TS.
- **The server/client split is the load-bearing part of the port.** `use-translation.ts`'s own
  comment: server components call `getTranslations(locale)` directly; the hook exists only because
  a client component can't reach `params`. On this site that means nav + form use the hook and
  every page section reads the dictionary server-side, shipping zero i18n JS.
- **Neither Chaos Kitchen nor tdg has any locale-routing precedent** — both are single-locale with
  hardcoded route folders. The catch-all resolver is new code.
- **`fallback: false` does not produce missing pages here.** All twelve indexed addresses exist in
  both locales; that is what the url-map enumerates. It bites at the _field_ level — an unfilled
  English field renders empty rather than falling back to Polish.

## Desired End State

A `Pages` document created in the admin with `slug: 'oferta'` (pl) / `slug: 'offer'` (en) is
reachable at `https://…/oferta/` and `https://…/en/offer/`, both statically generated, both
rendering the document's fields. Editing that document in the admin makes the change visible on both
addresses without a deploy. An unknown path returns a real 404 in the locale its prefix implies.

Verified by: creating one page in the local admin, running `pnpm build`, and confirming both paths
appear in the build output as static routes.

## What We're NOT Doing

- **No page components, no tdg markup, no real copy.** That is S1.
- **No twelve-address guardrail test.** It belongs at S8 (cutover), where all twelve pages exist;
  at F2 ten of twelve rows would assert against documents that do not exist.
- **No unit test over the resolver.** Decided explicitly: S1 proves the routing by rendering a real
  page, and the failure mode is loud, not silent, at that point.
- **No slug field-level permissions.** PRD Open Question 9; the guardrail that matters is the S8
  test.
- **No redirects for Cennik's retired addresses.** PRD Open Question 3, still undecided.
- **No `pageType` variants beyond the one placeholder.** The conditional field groups arrive per
  page type as each slice needs them.

## Implementation Approach

One catch-all route, `src/app/(frontend)/[[...segments]]/page.tsx`, owns every public URL. The
PL-root / EN-prefix asymmetry is data, not folder structure: the resolver splits an optional leading
`en` segment off the path, treats the remainder as a slug, and queries Payload for a `Pages`
document whose localized `slug` matches in that locale.

`generateStaticParams` walks every published page in every locale and emits the segment arrays, so
every route is built at build time and no request hits the database. That is the precondition
`tech-stack.md` makes the CMS-slug decision conditional on — if routing ever goes dynamic, the
decision needs revisiting.

## Critical Implementation Details

**One document maps to two URLs, so revalidation is not a single path.** On a blog, an `afterChange`
hook revalidates `/posts/${doc.slug}`. Here, saving one `Pages` document invalidates _both_ its
Polish and its English address — and the Polish address is `/` when `isHome` is true, not
`/${slug}/`. The hook has to read the document in both locales (Payload's Local API `locale`
parameter) and revalidate each resolved path. Revalidating only the locale that was being edited
leaves the other language stale.

**Migration ordering.** Phase 1 adds tables. `pnpm db:migrate:prod` must be run by a human against
production _before_ the Phase 2 code that queries those tables is pushed. The pre-push gate prompts
for this; it does not enforce it.

## Phase 1: Pages collection and schema

### Overview

The content model: one collection, a localized slug, an `isHome` flag, and enough of a field group
to render something.

### Changes Required

#### 1. Pages collection

**File**: `src/collections/Pages.ts`

**Intent**: The single content collection for every public page. A `pageType` select drives which
conditional field group the admin sees; F2 ships one type with placeholder fields, later slices add
their own.

**Contract**: fields — `title` (text, localized, required), `slug` (text, localized, required,
indexed), `isHome` (checkbox, defaults false), `pageType` (select), `_status` via `versions.drafts`.
`admin.useAsTitle: 'title'`. The `seoPlugin` already in `payload.config.ts` attaches its own group.

The `isHome` flag needs a `beforeValidate` guard: at most one document may carry it. Two home pages
make `/` ambiguous and the resolver would pick arbitrarily.

#### 2. Register the collection

**File**: `src/payload.config.ts`

**Intent**: Add `Pages` to the `collections` array.

**Contract**: `collections: [Users, Media, Pages]`.

#### 3. Migration

**File**: `src/migrations/<timestamp>_pages.ts` (+ `.json` snapshot, + `index.ts`)

**Intent**: Create the `pages` and `pages_locales` tables.

**Contract**: Generated with `pnpm payload migrate:create`, then **read before it is applied** —
`migrate:create` has emitted phantom drift in the past. Localized fields live in the `_locales`
side table; confirm `slug` and `title` are there and not on the base table.

### Success Criteria

#### Automated Verification

- Migration applies against the local database: `pnpm payload migrate`
- Types regenerate and include `Page`: `pnpm payload generate:types`

#### Manual Verification

- The admin shows a Pages collection and a new document saves with both `pl` and `en` slugs.
- Setting `isHome` on a second document is rejected.

---

## Phase 2: Catch-all route and resolver

### Overview

The URL layer: path in, document out; document in, URL out.

### Changes Required

#### 1. Routing helpers

**File**: `src/lib/routing.ts`

**Intent**: The single source for URL shape. Every other consumer — `generateStaticParams`, the
language switcher, the revalidation hook, and later the sitemap and canonical tags — calls these
rather than building paths inline.

**Contract**:

```ts
// '/' for the pl home, '/en/home/' for the en home, '/oferta/' and '/en/offer/' otherwise.
pathForPage(page: { slug: string; isHome?: boolean }, locale: Locale): string
// Splits an optional leading 'en' off the segments; the remainder is the slug.
resolveSegments(segments?: string[]): { locale: Locale; slug: string | null }
```

Trailing slash is always present. The `/en/` prefix appears only for the non-default locale.

#### 2. Catch-all route

**File**: `src/app/(frontend)/[[...segments]]/page.tsx`

**Intent**: Resolve the incoming path to a `Pages` document and render it. F2 renders the title and
a field dump; S1 replaces the body with real components.

**Contract**: `generateStaticParams` queries every published page in every locale and returns one
`{ segments }` entry per address, derived via `pathForPage`. The page component calls
`resolveSegments`, queries Payload by `slug` + `locale`, and calls `notFound()` on a miss.
`generateMetadata` reads the seoPlugin fields.

The scaffold's `src/app/(frontend)/page.tsx` is deleted — the catch-all owns `/`.

#### 3. Not-found page

**File**: `src/app/(frontend)/not-found.tsx`

**Intent**: A localized 404.

**Contract**: Locale inferred from the pathname prefix, not from a resolved document — there is no
document. Renders dictionary strings.

### Success Criteria

#### Automated Verification

- Build emits both addresses as static routes: `pnpm build` (inspect the route table)
- Typecheck passes: `pnpm typecheck`

#### Manual Verification

- A page created in the admin loads at `/<pl-slug>/` and `/en/<en-slug>/`.
- The `isHome` page loads at `/` and at `/en/home/`.
- `/nonsense/` returns a 404 page, and the browser network tab shows status 404 — not 200.
- `/oferta` without the slash redirects to `/oferta/`.

---

## Phase 3: UI dictionary

### Overview

Port `fest`'s i18n module, trimmed of its WPML plumbing.

### Changes Required

#### 1. Dictionary module

**Files**: `src/lib/i18n/{i18n.ts,types.ts,translations.ts,translations-provider.tsx}`,
`src/lib/i18n/locales/{pl,en}.json`, `src/lib/i18n/hooks/use-translation.ts`

**Intent**: Typed PL/EN chrome strings — nav labels, buttons, form validation. Ported from
`/Users/konradantonik/workspace/fest/fest-frontend/lib/i18n/`.

**Contract**: `TranslationsT = typeof pl` (Polish is the source of truth; `en.json` is structurally
forced to match). Namespaces: `nav`, `form`, `common`. `useTranslation(namespace)` returns a `t`
supporting `{{param}}` interpolation. Server components call `getTranslations(locale)` directly and
never touch the hook.

Two deliberate deviations from the source:

- **Drop `translated-slug-setter.tsx` and the `translatedSlug` state.** fest discovers a page's
  counterpart slug imperatively because WPML gives it no other option. Here the catch-all already
  holds the document with both slugs, so the counterpart URL is a prop passed into the provider.
  `use-change-locale.ts`'s three-branch fallback collapses to one `router.push`.
- **Put `translations` in `useCallback`'s dep array and delete the
  `eslint-disable-next-line react-hooks/exhaustive-deps`.** fest's disable is sound only because its
  provider derives `translations` from `locale` inside a `useMemo`, making the two changes the same
  event; it would go stale the moment a namespace is lazy-loaded or CMS strings are merged in. The
  provider's `useMemo` already gives a stable identity per locale, so listing the real dependency
  behaves identically and costs nothing.

#### 2. Language switcher

**File**: `src/components/LanguageSwitcher.tsx`

**Intent**: Swap between a page's two addresses.

**Contract**: Client component. Takes the counterpart path as a prop (computed server-side via
`pathForPage`) and pushes it. No existence check — every page exists in both locales.

### Success Criteria

#### Automated Verification

- Typecheck catches a key missing from `en.json`: `pnpm typecheck` after deliberately deleting one
- Lint passes with no i18n eslint-disable: `pnpm lint`

#### Manual Verification

- The switcher moves between the two addresses of the same page and the URL keeps its trailing slash.

---

## Phase 4: On-demand revalidation

### Overview

An admin save updates the live static pages without a deploy.

### Changes Required

#### 1. Revalidation hook

**File**: `src/collections/Pages.ts` (hooks) or `src/collections/hooks/revalidatePage.ts`

**Intent**: After a page is saved or deleted, invalidate every address that document owns.

**Contract**: An `afterChange` + `afterDelete` hook that resolves the document in **both** locales
and calls `revalidatePath` on each result of `pathForPage`. Revalidating only the edited locale
leaves the other language serving stale HTML. On a slug change, the _previous_ path must also be
revalidated — `afterChange` receives `previousDoc`.

#### 2. Env

**File**: `src/lib/env-schema.ts`

**Intent**: Only if the hook is reached over HTTP rather than in-process. If `revalidatePath` is
called directly inside the Payload hook (same Next process), no secret is needed — prefer that.

**Contract**: Add nothing unless the in-process call proves unworkable.

### Success Criteria

#### Automated Verification

- Build succeeds with the hook attached: `pnpm build`

#### Manual Verification

- Edit a page's Polish title in the admin, reload the English address — the English content is
  unchanged but not stale-cached from before the save.
- Change a slug; the old address 404s and the new one works.

---

## Testing Strategy

**No automated tests in this change.** Decided explicitly during planning. The resolver's failure
mode at F2 is loud — S1 renders a real page through it, so a broken resolver is a blank screen, not
a silent regression. The guardrail that matters is the S8 twelve-address test, which needs all
twelve pages to exist before it can assert anything.

Verification here is the build output (are both addresses static routes?) and the manual checks in
each phase.

## Migration Notes

Phase 1 produces a migration. A human runs `pnpm db:migrate:prod` — which dumps production first —
**before** pushing the Phase 2 code. The pre-push gate will prompt on a `main` push that adds
`src/migrations/*.ts`.

## Whole-tree Gate

Run once, after Phase 4.

- Type checking passes: `pnpm typecheck`
- Linting passes: `pnpm lint`
- Build succeeds: `pnpm build`

## References

- URL spec: `context/foundation/url-map.md` (re-verified 2026-09-03)
- i18n decisions: `context/foundation/tech-stack.md` → `## i18n`
- Roadmap item: `context/foundation/roadmap.md` → F2
- Port source: `/Users/konradantonik/workspace/fest/fest-frontend/lib/i18n/`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands.

### Phase 1: Pages collection and schema

#### Automated

- [x] 1.1 Migration applies against the local database — 41c93b2
- [x] 1.2 Types regenerate and include `Page` — 41c93b2

### Phase 2: Catch-all route and resolver

#### Automated

- [ ] 2.1 Build emits both addresses as static routes
- [ ] 2.2 Typecheck passes

### Phase 3: UI dictionary

#### Automated

- [x] 3.1 Typecheck catches a key missing from `en.json`
- [x] 3.2 Lint passes with no i18n eslint-disable

### Phase 4: On-demand revalidation

#### Automated

- [ ] 4.1 Build succeeds with the hook attached
