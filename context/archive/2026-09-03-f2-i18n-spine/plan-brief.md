# F2 — Localization Spine — Plan Brief

> Full plan: `context/changes/2026-09-03-f2-i18n-spine/plan.md`

## What & Why

Stand up the routing and localization machinery every page on this site will hang off: a `Pages`
collection with a localized `slug`, one catch-all App Router route resolving a path to a document, a
PL/EN UI dictionary, and on-demand revalidation. It comes before any page component because it
decides the shape of every URL — landing it after three pages exist means rewriting three pages.

## Starting Point

F1 shipped the scaffold and production is live. Payload's `localization` block is already
configured, and `trailingSlash: true` is already in `next.config.ts` with the url-map rationale in a
comment. What does not exist: any content collection, any public route beyond the scaffold's
placeholder, any dictionary. `Users` and `Media` are the only collections.

## Desired End State

A page created in the admin with `slug: 'oferta'` (pl) / `slug: 'offer'` (en) is reachable at
`/oferta/` and `/en/offer/`, both statically generated. Editing it makes the change live on both
addresses without a deploy. An unknown path returns a real 404 in the locale its prefix implies.

## Key Decisions Made

| Decision       | Choice                                                         | Why                                                                                                         |
| -------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Route tree     | One catch-all `[[...segments]]`                                | The PL-root / EN-prefix asymmetry is data, not folder layout                                                |
| Page model     | One `Pages` collection, conditional field groups by `pageType` | No block builder; admin fills typed slots, never rearranges                                                 |
| Home page      | An `isHome` flag on the document                               | Lets the resolver collapse to `/` in the default locale without a special case in the route tree            |
| Rendering      | Static + `revalidatePath` from a Payload hook                  | Zero DB hits per request — the condition the CMS-slug decision depends on — while keeping editorial control |
| Trailing slash | Keep it                                                        | Inherited from the live WordPress site; dropping it buys twelve redirects and a re-crawl for no gain        |
| Dictionary     | Port `fest`'s JSON + `useTranslation` module                   | It works, it is typed, and `typeof pl.json` gives key-level checking without a library                      |
| Tests          | None in F2                                                     | S1 proves the resolver by rendering a real page; the twelve-address guardrail belongs at S8                 |

## Scope

**In scope:** `Pages` collection + migration · routing helpers (`pathForPage`, `resolveSegments`) ·
catch-all route with `generateStaticParams` · localized 404 · i18n dictionary, provider, hook ·
language switcher · revalidation hook.

**Out of scope:** page components and tdg markup (S1) · real copy · the twelve-address test (S8) ·
slug field permissions (PRD OQ 9) · Cennik redirects (PRD OQ 3) · `pageType` variants beyond one
placeholder.

## Architecture / Approach

```
/oferta/            ─┐
/en/offer/          ─┤→ [[...segments]] ─→ resolveSegments() ─→ Payload query (slug + locale) ─→ render
/                   ─┘                              ↑
                                             pathForPage()
                                                    ↑
        generateStaticParams · language switcher · revalidation hook · (later) sitemap, canonical, hreflang
```

`pathForPage` is the single source of URL shape. Everything that needs to know what a page's address
is calls it, so there is one place to be wrong.

## Phases at a Glance

| Phase                   | What it delivers                                | Key risk                                                                               |
| ----------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1. Pages collection     | Collection, localized slug, `isHome`, migration | `migrate:create` has emitted phantom drift before — read the migration before applying |
| 2. Catch-all + resolver | Both addresses of a page render statically      | Only real design work in the change; no precedent in any reference repo                |
| 3. UI dictionary        | Typed PL/EN chrome strings, switcher            | Low — a trim of working code from `fest`                                               |
| 4. Revalidation         | Admin save updates live pages                   | One document owns two URLs; revalidating one locale leaves the other stale             |

**Prerequisites:** F1 (done). A human runs `pnpm db:migrate:prod` after Phase 1 and before Phase 2's
code is pushed.

## Open Risks & Assumptions

- **`fest` is a fourth reference repo and is not in AGENTS.md.** `/Users/konradantonik/workspace/fest`
  — `fest-frontend/lib/i18n/` is the Phase 3 port source. Worth adding to the reference table.
- **Assumes every page exists in both locales.** True of the twelve indexed addresses, which is why
  the switcher needs no missing-translation branch. A PL-only page later breaks that assumption.
- **`generateStaticParams` assumes routing stays static.** `tech-stack.md` says the CMS-slug
  decision needs revisiting if a route goes dynamic.
- **PRD OQ 10** (which fields are localized vs shared) gets answered per collection as slices model
  their content; F2 only settles it for `Pages`' own fields.

## Success Criteria (Summary)

- A page created in the admin loads at both its Polish and English addresses, statically generated.
- Editing it in the admin changes both live addresses without a deploy.
- An unknown path returns a genuine 404, localized by prefix; `/oferta` redirects to `/oferta/`.
