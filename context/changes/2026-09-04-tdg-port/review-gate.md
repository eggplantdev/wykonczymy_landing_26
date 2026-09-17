# Review-gate ledger — tdg-port (whole repo) · 2026-09-04

Scope: all of `src/` treated as one slice — the repo had no prior review gate.
Fan-out: code-review, tailwind-v4-audit, feature-first-structure, module-cohesion-audit,
structure-scatter-audit, comment-noise-audit. (`/10x-impl-review` dropped: no `plan.md`.)

Baseline before any mutation: `pnpm typecheck` green, `pnpm lint` green (1 pre-existing
unused-arg warning in `tests/e2e/admin.e2e.spec.ts:8`), working tree clean.

Adjudication note — the two structure audits conflicted. `structure-scatter-audit` wanted
`MediaImageT`/`MediaVideoT` promoted **into** `src/types/`; `feature-first-structure` wanted
`src/types/` **emptied**. Resolved in favour of emptying: the reported defect is a layer
inversion (`src/types/*` and `lib/*` importing from `components/`), and deleting the shared
type-folder removes the inversion rather than relocating it. `components/media/types.ts` stays
put — it is already colocated with its component, which is the convention the repo follows
everywhere else.

## Findings

- [x] 🔴 CRITICAL · filed EX-790 · `code-review` · `src/components/footer/contact-form.tsx:17-55` ·
      the contact form has no `action`, no `onSubmit` and no server action, so every lead
      submitted through the site-wide footer is silently dropped — needs the leads-app contract
      in `/workspace/yolo/wykonczymy`, which this repo does not own. Already tracked in this
      folder's `todo.md` under "Blocked on the CMS slice". The `Button` half of the defect
      (no way to pass `type="submit"`) is fixed separately below.
      test: TDD · e2e — travels with the wiring work, not authored here
- [x] 🔴 CRITICAL · fixed · `code-review` · `src/lib/pages.ts:11-26` · the home document also
      answered at its own PL slug (`/start/` → 200, byte-identical to `/`), because
      `dynamicParams` lets `findPage` resolve a slug `generateStaticParams` never emits.
      Duplicate content against the twelve-address guardrail.
      test: TDD · unit — `tests/unit/routing.spec.ts` + an e2e probe
- [x] 🔴 CRITICAL · fixed · `code-review` · `src/app/(frontend)/layout.tsx:10-13` · every one of
      the twelve indexed addresses shipped Payload's starter meta description ("A blank template
      using Payload in a Next.js app").
      test: no automated test — covered by the metadata e2e assertion added for the finding below
- [x] 🟡 WARNING · fixed · `code-review` · `src/app/(frontend)/layout.tsx:19` · `<html lang="en">`
      is hardcoded, so the Polish half of the site declares itself English. The root layout cannot
      see the route's params. **Decided: `lang="pl"`, keep static.** PL is the default locale and
      the majority of the site, so half the pages go from wrong to right for one word; `/en/` stays
      knowingly wrong until the locale moves into a real route segment. Middleware was rejected —
      `headers()` would opt the root layout into dynamic rendering and un-prerender the whole site.
      test: no automated test · e2e — deferred with the `[locale]` restructure
- [x] 🟡 WARNING · skipped · `code-review` · `src/app/(frontend)/[[...segments]]/page.tsx:140-151` ·
      `contact` and `price-list` fall through to `return null`, serving two indexed addresses as
      empty 200s. 404-ing them would delete two of the twelve addresses from the map, so the real
      fix is building the two pages, not changing this branch. Left as an explicit placeholder with
      the reason in the code; resolves itself in the pages slice.
      test: TDD · e2e — owed by the slice that builds those two pages
- [x] 🟡 WARNING · fixed · `code-review` · `src/components/home/hero.tsx:24-29` · `<Media>` rendered
      twice, both `priority`, producing two full srcsets and two `w=3840` preloads in the served HTML.
      test: no automated test — dead-obvious duplication, guarded by the hero e2e already present
- [x] 🟡 WARNING · fixed · `code-review` · `src/components/home/projects-carousel/carousel-counter.tsx:5-16` ·
      counter wrong twice: `swiper.slides` includes Swiper's loop duplicates so the total roughly
      doubled, and the zero-pad tested `realIndex < 10` instead of `realIndex + 1 < 10`, rendering
      slide 10 as `010`.
      test: TDD · unit
- [x] 🟡 WARNING · fixed · `code-review` · `src/components/layout/mobile-menu.tsx:31-34` ·
      `document.body.style.overflow` set imperatively with no cleanup and no viewport guard: open
      the menu on a phone and rotate to landscape and the panel hides behind `md:hidden` while
      `overflow: hidden` persists — the page is permanently unscrollable until reload. No
      Escape-to-close either.
      test: TDD · e2e
- [x] 🟡 WARNING · fixed · `code-review` · `src/components/ui/button-link.tsx:16-18`,
      `home/hero.tsx:33-35`, `layout/mobile-menu.tsx:68-74` · `<button>` nested inside `<a>`/`<Link>`
      in three places — invalid HTML, two focus stops, and some browser/AT pairs activate the button
      without following the href.
      test: TDD · e2e (axe `nested-interactive`)
- [x] 🟡 WARNING · fixed · `code-review` · `src/collections/Pages.ts:74-89` · `slug` is indexed but
      not unique and `findPage` uses `limit: 1` with no `sort`, so two pages sharing a slug resolve
      planner-dependently and can flip between revalidations. Field-level `unique` added; the
      migration is owed and a human runs it on prod.
      test: TDD · integration
- [x] 🟡 WARNING · fixed · `code-review` · `src/components/interior-styles/style-card.tsx:27` ·
      `sizes` ignored `xl:px-55` (220px per side), declaring `33vw` where each card renders ≈23vw —
      Next served 640w for a 384w slot. The project's recurring `sizes`-drift bug.
- [x] 🟡 WARNING · fixed · `code-review` · `src/components/interior-styles/style-page.tsx:37` ·
      `sizes` tail of `1240px` was copied from `project-slide.tsx` without recomputing; the real
      `lg:col-span-10` box is ≈1517px at 1920, so Next picked 1280w and upscaled.
- [x] 🟡 WARNING · fixed · `code-review` · `src/components/media/media-placeholder.tsx:22-23` ·
      `animate-pulse` never stops, keeping a compositor animation alive for the page's lifetime
      behind every image, and pulsing grey forever where media is null.
- [x] 🟡 WARNING · fixed · `code-review` · `src/payload.config.ts:77-79` · `seoPlugin` was
      configured with no `collections`, so it installed meta fields on nothing — inert config that
      made the SEO story look handled while editors had no way to set a description.
      test: no automated test — config wiring, verified by the field appearing in admin
- [x] 🟡 WARNING · dismissed · `code-review` · all five carousels · `!isReady && 'opacity-0'` ships
      the section invisible in SSR HTML, so a client-JS failure hides most of the home page. Real,
      but it is the deliberate trade documented in each file (Swiper lays the track out on the
      client; the alternative is a flash of stacked full-width slides). Changing it is a design
      decision, not a review fix. The duplication was folded into the reuse pass below.
- [x] 🟡 WARNING · fixed · `code-review` · `next.config.ts:15` +
      `context/foundation/url-map.md` · four indexed addresses have neither a target nor a redirect:
      `/oferta/` and `/cennik/` 404 today, plus their `/en/` counterparts. Oferta was retired on
      purpose. **Decided: 301 to the home page.** The Polish pair goes to `/`, the English pair to
      `/en/home/` rather than `/en/`, so it lands in one hop instead of chaining through the
      existing locale-root redirect.
- [x] 🟡 WARNING · filed EX-793 · `code-review` · deploy config · the apex→`www` canonical redirect
      exists only as a Vercel domain setting and cannot be verified from the repo. **Confirm before
      cutover** — the whole url-map depends on it.
- [x] 🔵 OBSERVATION · fixed · `code-review` · `src/collections/Users.ts` · no access control, so
      any authenticated editor could delete the owner's account.
      test: TDD · integration
- [x] 🔵 OBSERVATION · fixed · `code-review` · `src/collections/hooks/revalidatePage.ts` · a bare
      `catch {}` swallowed real cache errors and the hook fired on draft saves.
      test: no automated test — logging-only change
- [x] 🔵 OBSERVATION · fixed · `code-review` · `src/lib/i18n/use-translation.ts` · missing
      `'use client'` on a hook consumed only by client components.
- [x] 🔵 OBSERVATION · fixed · `code-review` · `src/components/LanguageSwitcher.tsx:90` ·
      `aria-current="true"` should be `"page"` on a navigation link.
- [x] 🔵 OBSERVATION · fixed · `code-review` · `src/app/(frontend)/[[...segments]]/layout.tsx:26-29` ·
      three sequential awaits paid on every render including misses — now one `Promise.all`.
- [x] 🔵 OBSERVATION · fixed · `tailwind-v4-audit` · `src/app/(frontend)/error.tsx:29`,
      `not-found.tsx:21`, `page-board/board.tsx:26` · `--text-*: initial` in `styles.css:11` wipes
      Tailwind's default text scale, so `text-2xl` and `text-xs` emit **no CSS at all** — the 404
      and error headings rendered at inherited size. Not a style nit; a silently dead class.
- [x] 🔵 OBSERVATION · dropped · `code-review` · `src/lib/env.server.ts` + `SERVER_URL` · dead, but
      the env layer's exact paths are pinned by `AGENTS.md` and an ESLint rule; removing a file that
      the rules name is churn against a documented contract.
- [x] 🔵 OBSERVATION · dropped · `code-review` · `src/components/layout/page-transition.tsx` · the
      `exit` animation never runs because a `template.tsx` remounts and tears down `AnimatePresence`.
      Cosmetic, and the enter animation — the part that was asked for — works.
- [x] 🔵 OBSERVATION · skipped · `code-review` · `src/app/(frontend)/page-board/` · a dev tool
      reachable in production. Deliberate (it is how the tdg port is visually diffed) and it leaks
      nothing, but it wants a decision before cutover rather than a patch now.
- [x] 🔵 OBSERVATION · skipped · `code-review` · four content-derived React keys · they break once
      data comes from the CMS and gains real ids — resolves itself in the CMS slice, and changing
      them now would be guessing at the eventual id shape.
- [x] 🔵 OBSERVATION · dropped · `code-review` · both dictionaries ship in every client bundle ·
      two small JSON files on a six-page site; splitting them is app-shaped machinery this project
      explicitly rejects.
- [x] 🔵 OBSERVATION · skipped · `code-review` · `src/components/footer/contact-form-input.tsx` ·
      no `required`/`aria-invalid`. The form has no submit handler at all (FR-031 is blocked on the
      leads app) and which of the six fields are mandatory is a business rule nobody has stated, so
      marking them would be guessing. The caller-supplied `id` is fine — the footer form renders
      once per page and `htmlFor` already matches.
- [x] 🔵 OBSERVATION · dropped · `code-review` · `src/components/layout/page-wrapper.tsx:14-19` ·
      `className` ordered before conditional padding so callers cannot override it. No caller
      currently needs to; fixing it now is speculative.
- [x] 🔵 OBSERVATION · dropped · `code-review` · `/en` takes two hops · one redirect on a locale
      root nobody links to directly.
- [x] 🔵 OBSERVATION · dropped · `code-review` · `object-slide-content.tsx:22` `sizes` marginally
      under at `md` · within one Next image bucket, so it changes nothing served.
- [x] fixed · `module-cohesion` · `src/app/(frontend)/[[...segments]]/page.tsx:22-39` · the route
      file also owned the page-type constants and the child-lookup logic, spreading the page-type
      vocabulary across three homes. Constants consolidated into `lib/routing.ts`, lookups extracted
      to `lib/page-children.ts`.
- [x] fixed · `feature-first` + `structure-scatter` · `src/types/*` · all three files were
      single-feature contracts sitting in a shared type-folder, and `src/types/*` imported from
      `components/media/` — a backwards tier arrow. Colocated; `src/types/` deleted.
- [x] fixed · `feature-first` + `structure-scatter` · `src/components/LanguageSwitcher.tsx` · the
      only PascalCase filename and the only component at the `components/` root, while every
      consumer and every import of it lives in `components/layout/`.
- [x] dismissed · `structure-scatter` · `components/media/` as a sibling of `components/ui/` ·
      defensible either way and 13 import sites; not worth the churn at this size.
- [x] dropped · `feature-first` · `lib/placeholder/` tier, `lib/carousel.ts` naming, `layout/` split ·
      all three are tidiness preferences; the placeholder quarantine in particular is load-bearing
      (`rm -rf` when Payload lands) and colocating it would scatter the eventual deletion.
- [x] fixed · `tailwind-v4-audit` · 24 arbitrary bracket values across 14 files · converted to the
      spacing/text scale where the file already mixed both forms. Ratios (`aspect-[312/208]`),
      viewport units and the proportional board grid left as-is — arbitrary is idiomatic there.
- [x] fixed · `tailwind-v4-audit` · `src/app/(frontend)/styles.css` · added `--text-11`, `--text-8`,
      `--leading-111`, `--container-board`, `--container-prose`; deleted the dead `--headerH` /
      `--headerHMd` ports from tdg that nothing reads.
- [x] fixed · `tailwind-v4-audit` · `board.tsx:88`, `menu-toggle.tsx:56` · two inline `style`
      attributes carrying literal constants a utility can express. The runtime-valued ones
      (`board.tsx:125`, the `strokeDasharray` pair) correctly stay inline.
- [x] skipped · `tailwind-v4-audit` · no Tailwind-aware ESLint plugin, so every finding above is
      invisible to CI · adding `eslint-plugin-better-tailwindcss` is a new dependency and a new
      CI-failure surface — your call, not a review fix.
- [x] fixed · `comment-noise` · 7 deletions, 10 trims across 16 files · scaffold boilerplate,
      caller lists, provenance that binds nothing, and layout narration restating the classes
      beneath it. The audit explicitly protected ~60 comments carrying real rationale.
- [x] dismissed · `comment-noise` · the four-times-repeated `basePath` trailing-slash comment ·
      it pins the twelve-address contract on an otherwise ambiguous `string` prop; repetition is
      the point when the constraint is easy to violate locally.

- [x] fixed · `simplify` · `src/lib/routing.ts` · added `childPath(basePath, slug)` — the
      trailing-slash rule the twelve indexed addresses depend on had been living in seven places.
- [x] fixed · `simplify` · `src/lib/routing.ts` · added `localeRoot(locale)` — `language-menu.tsx`
      and `not-found.tsx` each hardcoded `/en/home/`, which also hardcoded a localized CMS slug.
- [x] fixed · `simplify` · `src/lib/routing.ts:71` · `resolveSegments`'s two structurally identical
      return branches collapsed into one.
- [x] fixed · `simplify` · `src/lib/content/children.ts` (new) · `childSlugsFor` / `findChild` were
      two `pageType` ladders over the same two collections; now one `CHILD_SOURCES` map.
- [x] fixed · `simplify` · `src/lib/pages.ts` · extracted `findPublishedPages(locale)` —
      `generateStaticParams` held a byte-identical copy of `pathsByType`'s query.
- [x] fixed · `simplify` · `src/app/(frontend)/[[...segments]]/page.tsx` · `generateStaticParams`
      ran its locale loop serially and awaited a child read per document; now 2 queries per locale
      by construction.
- [x] fixed · `simplify` · `src/lib/pages.ts:45` · `pathsForPage` was the one content reader
      without `cache()` — two identical `findByID(locale: 'all')` round trips per page.
- [x] fixed · `simplify` · `src/lib/content/projects.ts` · `relatedProjects` returned every other
      project uncapped into a client carousel; capped at 3, matching `relatedStyles`.
- [x] fixed · `simplify` · `src/app/(frontend)/layout.tsx` · `DebugTools`' production bail-out was
      inside the client component, so the module shipped to production browsers.
- [x] fixed · `simplify` · `src/lib/carousel.ts` · `useCarouselReady()` replaces the ready-gate
      copy-pasted into five carousels, four carrying a verbatim copy of the same comment.
- [x] fixed · `simplify` · `src/globals/Footer.ts` · duplicated `revalidatePath('/', 'layout')` +
      try/catch; now calls the exported `revalidateAllPages`.
- [x] fixed · `simplify` · `style-gallery.tsx`, `project-gallery.tsx` · both re-typed
      `SectionTitle`'s exact class string; both now use the component.
- [x] fixed · `simplify` · `site-header.tsx` · `homeHref` was computed in the layout and passed
      alongside `typePaths`, which the header already receives; derived internally.
- [x] fixed · `simplify` · `src/lib/content/home.ts` · `projectsBase` was a second name for
      `link(PROJECTS_PAGE_TYPE)`.
- [x] fixed · `simplify` · `src/components/ui/button.tsx:30` · `size: 'xl'` set `text-14 h-9` and
      its only call site overrode every dimension; the ladder was missing a case. Now
      `text-18 h-12 px-6`.
- [x] fixed · `simplify` · `src/types/` emptied and removed · `ProjectT`/`InteriorStyleT` to their
      mappers, `ObjectCarouselItemT` to its feature, `SpecItemT` to `components/ui/spec-item.ts`.
      Also removes the layer inversion the two structure audits disagreed over.
- [x] fixed · `simplify` · Tailwind · 24 arbitrary values onto the live default scale; every
      `aspect-[a/b]` rewritten bare; two new `@theme` rungs (`--text-8`, `--leading-150`).
- [x] fixed · `simplify` · comment noise · four copies of the `basePath` restatement, the
      vanished-state clause in `button.tsx`, `error.tsx`'s cross-reference, and the self-restating
      halves in `media.tsx` / `object-slide-content.tsx`.
- [x] fixed · `simplify` · two comments were factually **wrong**: `object-slide-content.tsx` on
      reuse by the projects listing (it uses `ProjectRow`), `interior-styles-carousel.tsx` on the
      styles having no addresses (they do), `nav-group.tsx` on a border that is not in the classes.
- [x] fixed · `simplify` · `src/components/layout/language-switcher.tsx` · was the only PascalCase
      filename in `src/` and sat a level above its two children.
- [x] fixed · `simplify` · `nav-group.tsx:14` · stray leading and double space in a class string.
- [x] skipped · `simplify` · unused component surface (`Button` `size:'sm'`/`hasIcon`/`outline`,
      `Media`'s `placeholderType`, `CarouselArrow`'s `variant`, the `finance_*`/`optimum_*`
      palettes, …) flagged dead by 3 of 4 agents · not dead — the tdg port is unfinished and this
      is the surface the remaining pages land on.
- [x] skipped · `simplify` · `unstable_cache` / `'use cache'` promotion for the content readers ·
      the largest single win on the efficiency list, but a caching-architecture decision.
- [x] skipped · `simplify` · `select`-narrowed queries for the listing paths · a real trade-off
      (one shared cached query vs. a light listing read plus a full detail read); wants a call.
- [x] skipped · `simplify` · a `<Section rhythm>` wrapper for the seven `container` strings, and a
      nav-variants module for the five inline `isMobileMenu &&` overrides · review-worthy refactors.
- [x] skipped · `simplify` · `depth: 2` on `findPage` double-fetches the featured project · the fix
      changes `toHomeData`'s contract, so behaviour-adjacent.
- [x] skipped · `simplify` · `SpecItemT.id` synthesised as `index + 1` purely for a React key ·
      `id` becomes real when specs are fully CMS-owned; removing it now is churn.
- [x] dropped · `simplify` · `getPayload({ config: await config })` repeated in 6 files · a helper
      saves one line each, and the route no longer does it at all.
- [x] dropped · `simplify` · `revalidatePage` / `revalidatePageDelete` have identical bodies · they
      differ in exported Payload hook type, which is the point.
- [x] fixed · `simplify` follow-up · `src/components/ui/button.tsx:20-22` · extracting
      `buttonClasses()` made `ButtonLink` render an `<a>` under `display:flex`, which is
      block-level and stretched full width (user-reported, twice). `w-fit` reproduces a
      `<button>`'s shrink-wrap exactly; `inline-flex` was rejected because three call sites use
      `mx-auto` / `ml-auto md:block`.
- [x] fixed · `simplify` follow-up · `src/migrations/20260904_171708_seo_meta_and_slug_unique.ts`
      (new) · wiring `seoPlugin.collections` and `slug.unique` were schema changes landed without a
      migration; `pnpm build` failed on `column pages__locales.meta_title does not exist`.
      Migration generated, applied **locally**, `generate:types` re-run. Additive columns plus a
      non-unique→unique index swap — no data loss. **Production still owes `pnpm db:migrate:prod`,
      which a human runs.**
- [x] filed EX-794 · `simplify` · `styles.css` · two typographic ladders coexist — the numeric
      `--text-N` scale used everywhere, and a semantic `--text-sm/base/…` block carrying the only
      line-height and letter-spacing values, used only in `error.tsx` / `not-found.tsx`. Pick one.
- [x] filed EX-794 · `simplify` · `styles.css:9` · `--font-sans` references `--font-riforma`, but no
      font is loaded anywhere in `src/` (no `next/font`), so `font-sans` falls through to
      `ui-sans-serif`. Either wire the font or drop the var.

## Simplify pass

Ran `/simplify` — 21 applied, 3 proposed, 6 skipped, 4 dropped; every finding folded into
`## Findings` above (tagged `simplify`). Two follow-ups landed after it: the `w-fit` button
regression the owner caught, and the migration the schema findings owed.

Report: `/private/tmp/claude-501/-Users-konradantonik-workspace-yolo-landing-26/329baaaa-f607-45b6-94c8-b0a04d7a2055/scratchpad/simplify-report.md`

The earlier blocker (a parallel agent session holding uncommitted work across 12 files) is
resolved — that work landed in `lib/content/*` and the fan-out findings keyed to
`lib/placeholder/*` were re-adjudicated against the merged tree before `/simplify` ran.

## Tests & suite

- `pnpm typecheck` — green.
- `pnpm lint` — green, 1 pre-existing unused-arg warning (`tests/e2e/admin.e2e.spec.ts:8`).
- `pnpm build` — green after the migration; 42 paths prerendered.
- `pnpm test:int` / `pnpm test:e2e` — **not run.** Step 3 (authoring the post-`/simplify` tests)
  is still owed, and the full suite has not been run against this slice.

---

# Review-gate ledger — run 2 · tdg-port (CMS/seed slice) · 2026-09-17

Second gate run on the same change folder, 13 days after run 1. New diff, so a new
findings list rather than an edit of run 1's — run 1's record above is left intact.

Scope: `d09eac6..worktree`, including uncommitted and untracked files. The slice:
seed split into `scripts/seed/run.ts` + `scripts/seed/data/home.ts`, revalidation
extracted to `src/lib/revalidate.ts`, `src/lib/pages.ts` → `src/lib/content/pages.ts`,
`payload-types.ts` regenerated, int/unit tests added; plus three committed UI fixes
(`06333d9`, `ecc9ede`, `79e6152`).

Excluded as generated: `src/payload-types.ts`, `src/app/(payload)/admin/importMap.js`.

Fan-out: code-review, tailwind-v4-audit, feature-first-structure, module-cohesion-audit,
structure-scatter-audit (diff-scoped), comment-noise-audit (flag-only).
Dropped: `/10x-impl-review` — no `plan.md` in the change folder.
Step 0.5 verification pass: skipped — no verification skill installed, and browser
automation is off by standing instruction.

**Tree caveat:** at dispatch, ~95% of the slice was another session's uncommitted work,
with two files written 90 seconds prior. The user was asked and explicitly chose the full
gate, accepting that `/simplify` mutates those files. Recorded here because run 1 hit the
same hazard and resolved it by waiting instead.

**Carried forward from run 1:** 6 open boxes (2 🔴/🟡 correctness, 2 deploy-config
warnings, 2 `simplify` proposals on `styles.css`). They remain archive blockers and are
not restated in run 2's list — see run 1's `## Findings` above, lines 20/36/89/93/248/251.

## Findings — run 2

- [x] filed EX-791 · `simplify`/altitude · `tests/int/seed.int.spec.ts:30` · the re-seed test asserts
      row IDS are stable but never that the row's `image`/`video` survives — which is the actual
      thing the id-preservation machinery exists to protect, and the literal AGENTS.md promise
      ("never touches uploads"). Cheap to write (attach media to a card, re-seed, assert), but it
      needs another WRITE against the int suite's DB — blocked behind the `.env` decision above.
      test: TDD · integration — the guard IS the finding
- [x] fixed · `simplify`/simplification · `src/lib/content/projects.ts:65` +
      `interior-styles.ts:56` · byte-identical `filter((doc) => doc.slug && doc.title)` AND a
      byte-identical two-line comment, copy-pasted into both readers. Extracted to
      `src/lib/content/translated.ts` as `isTranslated`, comment with it. The altitude pass called
      this "minor, not worth a helper"; the simplification pass called the comment a fork that
      will drift. Fixed on the comment argument — the prose is the part that rots.
- [x] fixed · `simplify`/simplification · `tests/int/projects.int.spec.ts:28` · `as never` copied
      from `pages.int.spec.ts`'s precedent, where it IS load-bearing. Here it is not — verified by
      removing it and running `tsc --noEmit` clean. Dropped.
- [x] skipped · `simplify`/reuse · `scripts/seed/run.ts:23-149` · `seedProjects` /
      `seedInteriorStyles` / `seedPages` triplicate one find→create-or-update(pl)→update(en) shape,
      ~90 lines. Real, but `seedPages` carries the `isHome` branch and a different return type
      (`Record<string, number>`), so the extraction is a refactor with its own blast radius — not a
      cleanup-pass edit. Review-worthy.
- [x] skipped · `simplify`/altitude · `src/lib/routing.ts:54` · sharpened diagnosis of the earlier
      🔵: `HOME_PAGE_TYPE` is the page-type DISCRIMINATOR, and `localeRoot` spends it as a URL
      segment. `scripts/seed/data/pages.ts:12` proves the axes differ — PL home slug is `start`,
      EN is `home`, equal to the discriminator only by coincidence. `site-header.tsx:19` already
      shows the right pattern (`typePaths[HOME_PAGE_TYPE] ?? '/'`). Two of the three call sites
      could adopt it for free; `language-menu.tsx` needs the OTHER locale's home address, which no
      current query supplies. Split fix across 3 files, so: review-worthy.
- [x] skipped · `simplify`/altitude · `src/lib/revalidate.ts:8` · Payload hook `context` could
      carry `disableRevalidate` from the seed so the hook KNOWS it is out-of-request instead of
      discovering it via an exception. The audit calls it marginal and the current try/catch
      honestly commented; agreed.
- [x] skipped · `simplify`/altitude · `src/collections/Pages.ts` · a `beforeValidate` guard
      rejecting `_status: published` on a half-translated doc (precedent exists there — the
      duplicate-home check). `_status` is not localized, so Payload's `required` only binds the
      locale being written; a project published PL-only silently vanishes from the EN listing with
      no error. The audit itself calls this defer-not-fix-now for a solo-operator six-page site.
- [x] dropped · `simplify`/efficiency · `scripts/seed/run.ts:164` · `seedInteriorStyles`,
      `seedPages` and `seedFooter` write disjoint collections and could run under one `Promise.all`
      after `seedProjects`. Safe, but they are interleaved with `payload.logger.info` progress
      lines that are the operator's only feedback during a `seed:prod` run — scrambling those to
      save a few hundred ms on an occasional CLI is the wrong trade.
- [x] dismissed · `simplify`/efficiency · no N+1 and no uncached duplicate query introduced —
      every content-layer read is `cache()`-wrapped, `generateStaticParams` already hoists
      `findChildren` out of its per-doc loop, and `layout.tsx`'s one serial `await` is a real
      `page.id` dependency. The per-entry `find → pl write → en write` chains only LOOK like
      parallelisable locale loops; the EN update needs the id the PL write returns.
- [x] dismissed · `simplify`/reuse · 3 false positives verified: the `payload.find` argument shape
      across `src/lib/content/*` (every call site's `depth`/`limit`/`sort`/`draft` is tuned to its
      need — idiomatic SDK use, not a hand-rolled abstraction); `spec()` in
      `data/projects.ts` vs `toSpecs` (opposite directions — seed input vs doc-to-component); the
      int-test `getPayload` bootstrap (4 copies now, but the pattern pre-dates this slice in
      `api.int.spec.ts` and `pages.int.spec.ts` — not new duplication).
- [x] dismissed · `simplify`/simplification · `scripts/seed.ts`'s 9-line stub (it is the CLI entry;
      `seedAll` is exported precisely so the int tests run the operator's code, not a copy), the
      `home-group.ts` extraction (it COLLAPSED a hardcoded `emptyRowIds` + a separate inline EN
      recompute into one `rowIdsOf`), the `SpecRowT` removal, and the `revalidate.ts` extraction —
      all net reductions.
- [x] dismissed · `simplify`/simplification · two files named `home-group.ts`
      (`src/collections/fields/` vs `scripts/seed/`) both exporting `homeGroup` · different
      concerns disambiguated by their directories; nothing imports one expecting the other.
- [x] 🟡 WARNING · filed EX-792 · `code-review` · `tests/int/seed.int.spec.ts:25` · `pnpm test:int`
      resolves `POSTGRES_URL` from `.env` (via `vitest.setup.ts`'s `dotenv/config`) and then calls
      `seedAll` twice, so running the suite overwrites whatever an editor typed into the local
      admin. New blast radius: before this slice the int tests only created throwaway docs.
      Needs an env decision (a `.env.test` the int suite points at) — not silently rewired.
      test: TDD · integration — assert the suite is not pointed at `.env`'s URL
- [x] 🟡 WARNING · filed EX-791 · `code-review` · `scripts/seed/home-group.ts:29,38` · re-seed still
      destroys admin-added array rows. Row ids are preserved (the slice's real fix) but matching
      is POSITIONAL and the array is replaced, not merged: a 4th services card added in the admin
      is deleted with its photo, and reordering rows in the admin writes each title onto the
      neighbour's row — correct copy over the wrong image, no error. Contradicts AGENTS.md's
      "never touches uploads". Fix is id-keyed or append-only merge — behaviour-changing, wants
      your call. (Line refs are post-extraction; was `run.ts:120,129-133`.)
      test: TDD · integration — append a 4th card + reverse row order, re-seed, assert survival
- [x] 🟡 WARNING · fixed · `code-review` · `tests/int/projects.int.spec.ts` · the fixture is a
      PUBLISHED project in the shared content DB, cleaned up in `afterAll` with
      `.catch(() => undefined)` — an assertion failure or a killed worker leaks a live project
      onto `/realizacje/` and burns its `unique` slug forever. Now created inside the `it` with
      cleanup in `finally`, allowed to throw.
      test: no automated test · integration — test hygiene, not product behaviour
- [x] 🔵 OBSERVATION · skipped · `code-review` · `src/lib/content/projects.ts:65` · the
      `fallback: false` filter checks `slug && title` but not `summary`, so a half-translated
      project renders "Zupnicza 19 — null" in the EN carousel. Real, but the fix is a product
      decision (filter it out vs. coerce to `''`) on another agent's in-flight file.
      test: TDD · integration — extend the existing PL-only fixture
- [x] 🔵 OBSERVATION · skipped · `code-review` · `src/lib/content/pages.ts:88` +
      `page.tsx:53` · the home type is exempted from the no-slug guard, so a home doc with no EN
      slug yields `/en/null/` as a prerendered address. Pre-existing, low reachability
      (`slugField` is required), but sits on the twelve-address guardrail.
      test: TDD · unit — `pathsByType` with a null-slug home doc
- [x] 🔵 OBSERVATION · skipped · `code-review` · `src/lib/content/home.ts:75,107` · the new
      `localeRoot` fallback is fed into `childPath`, synthesising `/en/home/zupnicza-19/` — a
      hard 404. Not a regression (the old `'/'` fallback also 404'd), but a fallback that exists
      to avoid a wrong address still emits one. Dropping the href is the honest behaviour.
      test: TDD · unit — `typePaths: {}` case in `home-content.spec.ts`
- [x] 🔵 OBSERVATION · dropped · `code-review` · `scripts/seed/run.ts:63` · interior-style `body`
      rows are written without ids, so each re-seed recreates them. Harmless today (no uploads on
      that row), latent if an image field is ever added.
      test: no automated test — no live defect to guard
- [x] 🔵 OBSERVATION · skipped · `code-review` · `src/lib/routing.ts:54` · `localeRoot`'s
      hardcoded `'home'` now has three consumers baking in `/en/home/`; the EN home slug is a
      CMS-editable field and nothing prevents a rename. Enforceable version is a Payload
      `beforeValidate`, not a test.
      test: no automated test — coupling recorded
- [x] 🔵 OBSERVATION · dropped · `code-review` · `src/lib/revalidate.ts:14` · one `seedAll` run
      emits ~20 identical `revalidatePath skipped` warnings, so the "not silent" rationale is
      undercut by its own volume. Log ergonomics.
      test: no automated test — not behaviour
- [x] 🔵 OBSERVATION · skipped · `code-review` · `tests/int/*` · no `payload.destroy()`, and
      vitest runs files in parallel while `seed.int.spec.ts` bulk-writes `pages` that
      `pages.int.spec.ts` also touches. No deterministic breakage found; `fileParallelism: false`
      would remove the class. Pre-existing pattern.
      test: no automated test — infrastructure
- [x] 🔵 OBSERVATION · skipped · `code-review` · `tests/int/seed.int.spec.ts:40-56` · the
      'writes both locales of a shared array row' test asserts only length-equality and
      first-row-difference — it never checks the ids match across locales, which is the thing the
      `RowIdsT` machinery exists for.
      test: TDD · integration — strengthen in place
- [x] fixed · `cohesion`+`feature-first` · `tests/int/seed.int.spec.ts:59-92` → new
      `tests/int/projects.int.spec.ts` · `findProjects` is a content-layer subject grafted into
      the seed spec; the `payload = payload ?? …` re-init existed only because two subjects
      shared one module-scope handle. Flagged independently by both audits.
- [x] fixed · `scatter`+`feature-first` · `tests/int/seed.int.spec.ts:3` · `@/../scripts/seed/run`
      used the `@/*` alias to climb out of its own target. Added `"@scripts/*": ["./scripts/*"]`
      to `tsconfig.json`; `vite-tsconfig-paths` picks it up with no further wiring. Flagged
      independently by both audits.
- [x] fixed · `cohesion` · `scripts/seed/run.ts:98-145` → new `scripts/seed/home-group.ts` ·
      `RowIdsT`/`rowIdsOf`/`homeGroup` are a field-shape MAPPING concern among four WRITE
      routines, moving in lockstep with `src/collections/fields/home-group.ts`. Two call sites;
      the now-unused `Page` import left with them. `run.ts` 214 → 165 lines.
- [x] fixed · `cohesion` · `scripts/seed/types.ts:3` · `SpecRowT` was re-exported through a
      non-barrel purely so `data/projects.ts` could use one import line. Deleted; the one
      consumer now imports from `@/lib/content/specs` directly.
- [x] fixed · `tailwind-v4` · `src/components/home/featured-project.tsx:27` · `lg:h-[755px]` was
      an off-scale px literal (755/4 = 188.75) beside a rem sibling `md:h-176`. Now `lg:h-189`
      (756px, +1px). PRE-EXISTING line — the slice only touched 32/34.
- [x] fixed · `comment-noise` · `src/lib/content/projects.ts:68` · the doc claimed "the projects
      FOLLOWING this one" but the code is `filter(...).slice(0, count)` — the first N that aren't
      this one, no wrap-around. Only its twin `relatedStyles` actually wraps; the phrasing was
      copied across and is false in one of the two files.
- [x] fixed · `comment-noise` · `src/lib/revalidate.ts:5` + `revalidatePage.ts:7` · both said
      "at six pages"; `pageTypes` holds FIVE. Dropped the number rather than pick one — it drifts
      and the cost argument does not need it.
- [x] fixed · `comment-noise` · `src/lib/content/interior-styles.ts:40` · "the same twelve rows"
      was the last hardcoded count, surviving in the file furthest from the data after the slice
      removed it from the seed's own header.
- [x] fixed · `comment-noise` · `src/components/layout/language-menu.tsx:8` · the `pathsForPage`
      fallback comment was left floating above `type PropsT`, ~24 lines from the
      `paths[candidate] ?? localeRoot(candidate)` it explains — orphaned by my own separator
      removal. Moved onto that line.
- [x] skipped · `cohesion` · `src/lib/routing.ts:8-25` · the page-type vocabulary
      (`pageTypes`/`PageTypeT`/the three sentinels) is a second clock in the URL-grammar file and
      wants `src/lib/page-types.ts`. Ripples to ~8 import sites and the audit called it the
      weakest of its findings — a review-worthy refactor, not a cleanup-pass edit.
- [x] dropped · `comment-noise` · 6 deletes + 5 trims across `run.ts:12,198`, `routing.ts:5,46`,
      `data/{home:15,pages:6,interior-styles:11,projects:19}`, `layout.tsx:32`, `Footer.ts:5`,
      `content/interior-styles.ts:10,20` · all genuine noise (tdg provenance, refactor narration,
      duplicated rationale), but cosmetic churn spread across another session's in-flight files.
      The factually WRONG and drifting ones were fixed above; these are prose.
- [x] dismissed · `code-review` · 6 items verified benign: `ecc9ede`'s `md:flex` fix (confirmed
      correct, `text-nowrap` genuinely redundant), `79e6152`'s `paddings`/`text-balance` (image
      `sizes="100vw"` unaffected — the overlay is a sibling of the image container), the
      `language-menu` `key` move, `home.ts:37`'s `_status` guard, `page.tsx:82`'s metadata
      symmetry, and `generateStaticParams`' children hoist (no N+1).
- [x] dismissed · `tailwind-v4` · `page.tsx:121` `style={style}` · a domain prop carrying an
      interior-style record, not an inline style attribute.
- [x] dismissed · `feature-first` · `src/lib/content/*` → `src/components/**` type-only imports ·
      seven edges, ALL pre-dating `d09eac6`; the slice added zero. Type-only so no runtime/RSC
      edge, and hoisting them to `src/types/` is the outcome run 1 already rejected.

## Simplify pass — run 2

Ran `/simplify` over `d09eac6..worktree` — 4 cleanup agents in parallel (reuse, simplification,
efficiency, altitude). **2 applied, 1 proposed, 4 skipped, 1 dropped, 4 dismissed**; every finding
is folded into `## Findings — run 2` above tagged `simplify`, per this gate's one-list rule — no
separate report file.

Two agents collided on `src/lib/content/{projects,interior-styles}.ts:65/56` and reached opposite
conclusions (simplification: extract; altitude: leave it). Resolved toward extraction, on the
narrower ground that the duplicated **comment** is what drifts, not the one-line predicate.

## Tests & suite — run 2

- `pnpm typecheck` — **pass** (clean, after both simplify edits)
- `pnpm lint` — **pass** (clean)
- `pnpm test` / `pnpm test:int` / `pnpm test:e2e` / `pnpm build` — **not run.** `test:int` is the
  subject of an open 🟡: it calls `seedAll` against whatever `POSTGRES_URL` `.env` holds, so
  running it overwrites the local content DB. Not run without your call.

**Archive is UNBLOCKED** — 0 open boxes. Two findings were fixed on your decision (`lang="pl"`;
301s for the four retired addresses) and five were filed to Linear, project **Wykonczymy**, team
Ex-plant:

| Issue | What |
| --- | --- |
| EX-790 | 🔴 contact form drops every lead — blocked on the leads-app contract |
| EX-791 | 🟡 re-seeding deletes admin-added rows and mis-pairs copy with photos |
| EX-792 | 🟡 `pnpm test:int` seeds the real local content database |
| EX-793 | 🟡 confirm the apex→`www` redirect in Vercel before cutover |
| EX-794 | typography — two competing scales, plus a brand font nobody loads |

Deleting the seed machinery outright was raised and reverted, so EX-791 and EX-792 stand.

`pnpm typecheck` currently fails on `src/components/footer/contact-form.tsx:23` — another
session's in-flight work, untouched here.
