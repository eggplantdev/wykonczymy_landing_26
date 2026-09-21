---
change_id: s7-seo
title: SEO surface — read the seoPlugin fields, add openGraph, sitemap and JSON-LD
status: planned
created: 2026-09-20
updated: 2026-09-20
---

# SEO surface — implementation plan

## Overview

Every public address on this site ships a `<title>` and a canonical, and nothing else. There is no
description, no `og:*`, no `twitter:*`, no icon, no sitemap and no structured data. Lighthouse scores
SEO **61** on all eight measured pages, and `meta-description` is the only failing audit in that
score that is ours to fix.

The fields are already there. `20260904_171708_seo_meta_and_slug_unique.ts` put `meta_title`,
`meta_description` and `meta_image_id` on every `*_locales` table, and `payload.config.ts:89` wires
`seoPlugin` into `pages`, `interior-styles` and `projects`. They are simply never read.

**This slice has no schema change.** Nothing is owed to `pnpm db:migrate:prod`. An earlier pass
planned a `SiteSettings` global for the fallback description; phase 5 authors a description for every
page, project and style in both locales, so that fallback would never have rendered.

## Current state

| Surface | Today |
| --- | --- |
| `generateMetadata` (`[[...segments]]/page.tsx:73`) | emits `title` + `alternates` only |
| Root layout metadata (`(frontend)/layout.tsx:16`) | `metadataBase`, title template, pre-cutover `robots: { index: false }` |
| `meta.title` / `meta.description` / `meta.image` | in production, localized, **unread** |
| `src/app/icon.*` | absent — `/favicon.ico` 404s, costing Best Practices 96 on all eight pages |
| `src/app/sitemap.ts` | absent |
| JSON-LD | absent (the WordPress site emits an AIOSEO graph on all twelve addresses) |
| `PageChildT` (`lib/content/children.ts:7`) | `{ slug, title }` — carries no meta, so a child cannot reach its own description |

Baseline Lighthouse (mobile preset, `wykonczymylanding26.vercel.app`, 2026-09-20): SEO 61 and Best
Practices 96 on every page; A11y 92–100; Perf 73–79.

## Desired end state

- Every one of the twelve indexed addresses emits a description, authored per page.
- Every project and interior-style child emits one **derived from copy it already has** —
  `summary` / `text`, both `required` and `localized`. Nobody writes a second description per item.
- `openGraph` and `twitter` carry title, description, locale and a real image.
- `/sitemap.xml` enumerates both locales with hreflang pairs and trailing slashes.
- One `Organization` JSON-LD block per page.
- Lighthouse `meta-description` passes everywhere. **SEO cannot reach 100 on this deployment** —
  `is-crawlable` fails by design while `src/app/robots.ts` and the layout's `robots` key hold the
  pre-cutover noindex. Verify the rest against a local production build with those two lifted.

## What we are NOT doing

- **No `SiteSettings` global.** Considered, and dropped once it was clear phase 5 authors every
  description: a CMS field plus a migration to hold a string that never renders is cost with no
  reader. `plugin-seo` would have supplied it cheaply via `SEOPluginConfig.globals` — worth knowing
  that hook exists if a real site-wide setting ever turns up.
- **No admin auto-generate button.** `plugin-seo`'s `generateDescription` is UI only
  (`MetaDescriptionComponent.js:21` fetches `/api/plugin-seo/generate-description` on click); it
  fills the field when an editor presses it, never on save and never at render. The fallback below
  does the same job without a click.
- **No move of `SITE_NAME` into the CMS.** It stays the constant it is today. The title template
  that uses it is a static `metadata` export in the root layout, and making it CMS-fed means
  converting that to an async `generateMetadata` for one string.
- **No `robots.ts` deletion.** Cutover owns that.
- **No performance work.** The `PageTransition` / `FadeUp` `opacity: 0` server render that costs
  ~90% of LCP is a separate, unanswered question.
- **No `<html lang>` fix.** `/en/*` still renders `lang="pl"`; that is roadmap line 137–139.
- **No conversion work.** Explicit non-goal (`prd.md § Problem`).
- The three authorized accessibility fixes (`carousel-controls.tsx` heading order,
  `contact-form-attachments.tsx` dark contrast, `field-control-classes.ts` 16px inputs) are trivial
  folder-less edits and ride outside this slice.

## Implementation approach

`meta` is on the Payload document for pages, and `findPage` already returns whole `Page` documents —
so page-level metadata needs no new query. Children are the gap: `findProjects` / `findInteriorStyles`
map their docs through `toProject` / `toInteriorStyle`, which drop `meta` on the floor, and
`PageChildT` is the narrow shape `resolveRoute` hands to `generateMetadata`.

The fix is one shared mapper (`toSeoMeta`) applied in both mappers, and `PageChildT` widened to carry
what it produces. `findChildren`'s `CHILD_SOURCES` map is satisfied structurally by `ProjectT` /
`InteriorStyleT`, so widening the child type is a compile-time push that lands in exactly two places.
No extra reads: both finders are `cache()`d and the layout already calls them.

---

## Phase 1 — `generateMetadata` reads `meta.*`, children derive theirs

### Changes

**`src/lib/seo/constants.ts`** (new)

- `SITE_NAME = 'Wykończymy'`, moved out of `layout.tsx:12` so `generateMetadata` and the layout share
  one string.

For children this is the **normal path, not a fallback**. `Projects.summary` is `required: true,
localized: true` and labelled in the admin "One sentence. Doubles as the hero lead and the card
blurb"; `InteriorStyles.text` is the same shape, "Card blurb. The style's own page opens with the
same sentence." That is already a meta description in everything but name, in both languages, for
every published document — so a project or style never needs one written for it, and one added next
year gets a correct description with no editor action.

`meta.description` stays available on those collections as a per-item override for the rare case
someone wants one, because the columns already exist in production and removing them would cost a
migration. It is an override nobody is expected to use, not a field the site depends on.

`toSeoMeta` trims a derived description at a word boundary near 155 characters. An authored
`meta.description` is never trimmed; the editor sees the plugin's own length indicator and owns it.

The root layout stays without a `description`. It sits above the locale segment (`<html lang="pl">`
is hardcoded there), so anything written at that level ships Polish to every `/en/*` page — and the
only routes outside the catch-all are `robots.ts` and `sitemap.ts`, which have no use for one.

**`src/lib/content/seo.ts`** (new)

```ts
export type SeoMetaT = { title?: string; description?: string; image: MediaImageT | null }
export const toSeoMeta = (meta: Page['meta'] | undefined, derivedDescription?: string): SeoMetaT
```

One mapper, fed by all three collections. `meta.image` goes through the existing `toImage` so the
media shape matches everything else in `lib/content/`; `derivedDescription` is the fallback each
caller already has to hand.

**`src/lib/content/projects.ts`, `src/lib/content/interior-styles.ts`**

- `ProjectT` / `InteriorStyleT` gain `meta: SeoMetaT`. `toProject` passes `doc.summary` as the
  derived description, `toInteriorStyle` passes `doc.text`.

**`src/lib/content/children.ts`**

- `PageChildT` → `{ slug: string; title: string; meta: SeoMetaT }`.

**`src/app/(frontend)/[[...segments]]/page.tsx`**

- `generateMetadata` picks the nearer source: `child ?? page`, then `meta.title ?? title` for the
  title and `meta.description` for the description — already fallen back to summary copy by the
  mapper, so `generateMetadata` has no chain of its own to spell out.

**`src/app/(frontend)/layout.tsx`**

- imports `SITE_NAME` from the new constants module instead of declaring it.

### Success criteria

- `pnpm lint && pnpm build` clean.
- `curl -s <page>/ | grep 'name="description"'` returns a non-empty description on all twelve
  addresses plus one project and one style detail page.
- Every project and style detail page shows a description with **no CMS edit of any kind** — it
  comes from `summary` / `text`, trimmed.
- Setting `meta.description` on one project overrides its derived one.

---

## Phase 2 — `openGraph`, `twitter`, and the icon

### Changes

**`src/app/(frontend)/[[...segments]]/page.tsx`**

- `openGraph`: `title`, `description`, `url` (the canonical already computed), `siteName`,
  `locale` (`pl_PL` / `en_GB`), `type: 'website'`, `images` from `meta.image` when set.
- `twitter`: `card: 'summary_large_image'` + the same title/description/image. The WordPress site
  emits no `twitter:*` at all, so there is nothing to carry over.

**`src/app/opengraph-image.png`** (new) — Next's file convention for a site-wide default, which
covers any page whose `meta.image` is unset. Branding, not content, so it belongs in the repo rather
than behind a CMS field. The live site points `og:image` at a **favicon** on all twelve addresses; do
not copy that.

**`src/app/icon.svg`** (new) — Next's file convention. With a declared icon the browser stops
falling back to `/favicon.ico`, which is the 404 behind Best Practices 96. Add
`src/app/apple-icon.png` only if the audit still complains.

### Success criteria

- `og:title`, `og:description`, `og:image`, `og:url`, `og:locale` and `twitter:card` present on a
  PL page and an EN page, with `og:locale` differing between them.
- Lighthouse Best Practices ≥ 96 with no `/favicon.ico` entry in `errors-in-console`.

---

## Phase 3 — `sitemap.ts`

### Changes

**`src/lib/content/addresses.ts`** (new)

- `listAddresses(): Promise<AddressT[]>` where `AddressT = { locale, path, pageId, childSlug }`.
- Lifted verbatim out of `generateStaticParams` (`page.tsx:39`), including the two conditions that
  make it correct: the `fallback: false` guard that skips a page with no slug in one locale, and the
  hoisted per-locale `findChildren` map.

**`src/app/(frontend)/[[...segments]]/page.tsx`**

- `generateStaticParams` becomes a map over `listAddresses()` — same output, one enumeration.

**`src/app/sitemap.ts`** (new)

- Outside `(frontend)`, alongside `robots.ts`, so the catch-all does not swallow `/sitemap.xml`.
- Absolute URLs via `new URL(path, SERVER_URL)`; `pathForPage` already supplies the trailing slash,
  which is load-bearing for all twelve addresses.
- `alternates.languages` from `pathsForPage(pageId)` for page-level entries. Children get none — a
  child's counterpart slug lives in its own collection and is not resolvable from the parent, the
  same limit `generateMetadata` already documents.

The sitemap is inert until cutover: `robots.ts` disallows everything and the layout sends
`noindex`. It ships now so cutover is a deletion, not a build.

### Success criteria

- `curl -s localhost:3000/sitemap.xml` lists every address `generateStaticParams` prerenders,
  each with a trailing slash and an absolute `https://www.` URL.
- No `/en/null/` or slash-less entry.
- `pnpm test:e2e` still green (it asserts the address map).

---

## Phase 4 — `Organization` JSON-LD

### Changes

**`src/lib/content/contact.ts`** (new)

- `findContactDetails(locale)` — resolves the contact page through the cached `findPage` and returns
  `{ address, nip }` off its `contact` group (`collections/fields/contact-group.ts`).

**`src/components/seo/organization-json-ld.tsx`** (new)

- A `<script type="application/ld+json">`. `name` from `SITE_NAME`, `url` from `SERVER_URL`,
  `telephone` / `email` from the footer global, `address` from `contact.address`, `vatID` from
  `contact.nip`.
- `contact.address` is one free-text line (`ul. Terespolska 2/19, Warszawa 03-813`). schema.org
  accepts `address` as Text, so it is emitted as-is — parsing a free-text field into a
  `PostalAddress` would invent structure the editor never entered.

**`src/app/(frontend)/[[...segments]]/layout.tsx`**

- Mount it once. The layout already awaits `findFooter(locale)`; `findContactDetails` rides the
  request-cached `findPage`, so this costs at most one query per request.

### Success criteria

- Exactly one `application/ld+json` block per page, parsing as valid JSON.
- Passes Google's Rich Results test for `Organization`.
- Phone and mail match the footer's rendered values.

---

## Phase 5 — Copy, then the populate script

**Runs only on the owner's explicit go-ahead. It is the one production write in this slice.**

### Changes

**`context/changes/2026-09-20-s7-seo/seo-copy.md`** (new)

- Drafted PL + EN `meta.description` for **the pages only** — six page types, twelve addresses.
  Projects and interior styles are not in this file and never will be: they derive from `summary` /
  `text` in phase 1, and writing a second description per item is work nobody would keep up.
- The home page seeds from the live site's only hand-written, page-agnostic description (131 chars,
  `/`): _"Kompleksowe remonty domów, mieszkań, biur, klatek schodowych, lokali usługowych oraz inne
  powiązane usługi w Warszawie i okolicach."_ Its EN counterpart is authored, not scraped — the live
  `/en/home/` description is an AIOSEO body-extract.
- The live-site harvest is a weak source and the drafts say so: of twelve descriptions, two are
  hand-written (`/` at 131 chars, reusable; `/oferta/` at 440 chars, needs trimming to ~155), three
  are verbatim copies of the home one, six are AIOSEO body-extracts — one of which contains _"Please
  enable JavaScript in your browser to complete this form"_ — and `/en/completed-works/` has none.
  Detail in `live-seo-harvest.md`.

**`scripts/populate-seo.ts`** (new, one-off)

- Payload local API, `payload.update({ collection: 'pages', id, locale, data: { meta: { description } } })`,
  once per locale. **Touches the `pages` collection only.**
- **Writes only where `meta.description` is empty.** An authored value is never overwritten.
- `--dry-run` by default; writes only with an explicit flag.

### Run order

1. `pnpm db:dump` — the database is the only copy of the content.
2. `pnpm tsx scripts/populate-seo.ts` (dry run) — read the diff.
3. Same command with the write flag.

### Success criteria

- Dry run reports a description for every published page in both locales, and touches nothing else.
- After the write, Lighthouse `meta-description` passes on all eight measured pages — the six page
  types showing their authored copy, the two detail pages showing their derived copy.

---

## Risks and open items

- **`is-crawlable` stays 0** until cutover. SEO 100 is only observable on a local production build
  with `robots.ts` and the layout's `robots` key temporarily lifted. Do not delete them to chase a
  number.
- **`<html lang="pl">` on `/en/*`** weakens the hreflang pair the canonical work already landed.
  Out of scope here; flag it if it blocks a phase.
- **`price-list` has no component** and renders `null` (`page.tsx:183`). It is one of the twelve
  addresses, so it gets a description like the rest — an empty page with a good description is the
  status quo, not a regression this slice introduces.
- **A derived description is only as good as the copy it derives from.** `summary` and `text` were
  written as card blurbs, not for search results. Spot-check a few rendered ones; if one reads badly
  that is an argument for editing the blurb, which improves both surfaces, not for adding a second
  field.
- **`fallback: false` means EN is authored separately.** Both `summary` and `text` are localized and
  required, so a published child always has both — but a page's `meta.description` does not, and a
  PL-only page ships no EN description. Invisible if testing stays in Polish.

## References

- `context/changes/2026-09-20-s7-seo/live-seo-harvest.md` — the twelve live addresses, verbatim
- `context/foundation/url-map.md` — the address map this must not break
- `src/migrations/20260904_171708_seo_meta_and_slug_unique.ts` — proves the fields exist
- `src/lib/routing.ts` — the single source of URL shape
- Roadmap line 141 — "seoPlugin fields in `generateMetadata` — belongs with S7"

## Progress

- [x] Phase 1 — `generateMetadata` reads `meta.*`, with the content-derived fallback — `73ec703`
- [x] Phase 2 — `openGraph`, `twitter`, icon — `73ec703`
- [x] Phase 3 — `sitemap.ts` — `798b7cf`
- [x] Phase 4 — `Organization` JSON-LD — `4226528`
- [ ] Phase 5 — copy + populate script — `seo-copy.md` and `scripts/populate-seo.ts` landed, dry run clean (10 writes, 0 skips); **the `--write` run is still owed and needs the owner's go-ahead**
- [ ] `slice-review-gate`
