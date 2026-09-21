# Review-gate ledger — s7-seo · 2026-09-21

Diff under review: `d71f80e..c043de0` (5 commits).

Four files were dirty in the working tree throughout this run and belong to a parallel
agent — `src/app/(frontend)/styles.css`, `src/components/home/interior-styles/interior-style-slide.tsx`,
`src/components/interior-styles/style-card-body.tsx`, `src/components/projects/project-row.tsx`.
They are out of scope for every check here and must not be mutated by `/simplify`. (They landed
as `b0440a3` partway through the gate, so the tree is clean again — the exclusion held.)

A seventh dispatch, a safety-and-pattern scan, never returned a report. Not re-run: the two
bug-finding checks plus the reproduction below cover the same ground, and both destructive-action
verdicts were settled empirically rather than by review.

## Findings

<!-- Sources returning clean: tailwind-v4-audit (0 — the slice adds no `className` anywhere),
     feature-first-structure (0 — all 9 added files correctly placed). -->

### Reproduction that settled the two CRITICALs

`/code-review` and `/10x-impl-review` returned opposite verdicts on the one destructive action in
the slice, so neither was taken on trust. Both were reproduced against the Docker container on
5436, loaded from `dumps/local-latest.sql` — production was never connected to. The container was
restored from the same dump afterwards and the probe script deleted.

- **Locale wipe — DISPROVEN.** `pnpm seo:populate --write` against the container wrote all ten
  descriptions and left every `title` and `slug` intact in both locales. The source trace
  (`beforeChange` omits the current locale's key for an absent field; `upsertRow` deletes and
  reinserts all locale rows) is accurate as far as it goes, but something upstream refills the
  current locale before the write, so the conclusion does not follow.
- **Draft publication — CONFIRMED.** With a pending unpublished draft on the home page, one
  `--write` run flipped the published Polish title from `Start` to `DRAFT-ONLY-TITLE`. A second
  effect showed up unprompted: English descriptions that had been cleared in the database came
  back during the Polish write, because the merge base is the latest *version*, not the published
  row.

- [x] 🔴 CRITICAL · fixed · code-review + impl-review · `scripts/populate-seo.ts:73` · `payload.update`
      builds its merge base from `getLatestCollectionVersion` with no `published` flag, so it
      resolves a pending draft and writes it back as published. Reproduced. Both reviewers found
      this independently.
      test: test-driven-debugging · integration — the reproduction above is the red case; it wants
      a `tests/int` guard that drafts a page, runs the write, and asserts the published row is
      unchanged. Discharged: `tests/int/populate-seo-guard.int.spec.ts` pins both halves of the
      Payload behaviour the guard keys on — a pending draft reads back unpublished from a
      `draft: true` query while the published list still shows the old title, and a page with no
      draft reads back published so it is still written. The script itself is one-shot and
      self-executing, so the test pins the mechanism rather than importing the loop.
- [x] 🔴 CRITICAL · fixed · code-review · `scripts/populate-seo.ts:35` · `--write` is the entire
      safety model on a script whose default connection is production, with no host echoed and no
      confirmation. One shell-history recall away from the live database.
      test: no automated test — an interactive guard is not worth a harness; the draft guard above
      carries the regression coverage.
- [x] 🔴 CRITICAL · dismissed · code-review · `scripts/populate-seo.ts:73` · "the partial `meta`
      update blanks every other localized field in the locale it touches" — disproven by
      reproduction, see above. The trace was sound at both ends but missed an upstream refill.
- [x] 🟡 WARNING · fixed · code-review + impl-review · `src/lib/content/seo.ts:31-33` · `??` only
      guards null/undefined, so a cleared SEO field (Payload stores `''`) suppresses the derived
      description instead of falling back to it. `populate-seo.ts:64` already uses the truthy
      convention, so the repo contradicts itself.
      test: TDD · unit — `toSeoMeta({ description: '' }, 'A summary')` must return the summary.
- [x] 🟡 WARNING · fixed · impl-review · `src/lib/content/addresses.ts:38` · the home page is
      exempt from the `!doc.slug` guard, but `pathForPage` only special-cases home in the *default*
      locale — an untranslated English home would emit `/en/null/`, the exact address the guard's
      comment says it exists to prevent.
      test: TDD · unit — a published home with an empty EN slug must not appear in `listAddresses`.
      Discharged by `tests/unit/addresses.spec.ts` + the `hasAddress` cases in
      `tests/unit/routing.spec.ts`; both go red on the pre-fix predicate, printing `/en//`.
      `/simplify` then found the same predicate written two more ways — see below.
- [x] 🟡 WARNING · fixed · code-review · `src/app/robots.ts` · the file carries a "delete at
      cutover" instruction and is also the only place a `Sitemap:` directive can live — and it has
      none. Following the comment literally at cutover ships no `robots.txt` and leaves the new
      sitemap undiscoverable.
      test: no automated test · — a cutover-time content decision, covered by manual-checks.
- [x] 🟡 WARNING · fixed · impl-review · `src/components/seo/organization-json-ld.tsx:16` · no
      `logo`, which Google's Rich Results test requires for an Organization.
      test: no automated test · — structural markup, verified by the Rich Results check already in
      manual-checks.
- [x] 🟡 WARNING · fixed · impl-review · `src/lib/routing.ts:70` · `segmentsForPage` has no caller
      in `src/` since the extraction of `segmentsForPath`; it survives only because its own unit
      test imports it. Dead export propped up by its test.
- [x] 🟡 WARNING · skipped · code-review · `src/app/sitemap.ts:12` · prerendered once at build with
      no `revalidate`, so a newly published project is absent until the next deploy. Contested —
      impl-review checked the build output and found the route carries the `_N_T_/layout` tag that
      `revalidatePath('/', 'layout')` already invalidates. Inert until cutover either way; it
      belongs to the cutover checklist, not to this slice.
      test: no automated test · — needs a deployed revalidation path to assert against.
- [x] 🔵 OBSERVATION · fixed · code-review + impl-review · `src/lib/seo/og-image.ts:16` · the
      description derives from existing content but the image does not, so ~40 child addresses all
      share the brand card while `project.image` / `style.image` sit already mapped and unused.
      The asymmetry contradicts the slice's own "nobody will fill this in per item" premise.
- [x] 🔵 OBSERVATION · fixed · code-review · `src/lib/content/seo.ts:17-24` · `trimToLimit` returns
      156 characters (the `…` is appended after slicing to 155) and slices by UTF-16 code unit, so
      a cut inside a surrogate pair emits a lone surrogate.
      test: TDD · unit — folded into the `toSeoMeta` spec above.
- [x] 🔵 OBSERVATION · fixed · code-review · `src/components/seo/organization-json-ld.tsx:14` · the
      same Organization is emitted on every address with no `@id`, so nothing ties the PL and EN
      blocks to one entity.
- [x] 🔵 OBSERVATION · skipped · code-review · `src/app/(frontend)/[[...segments]]/page.tsx:79` ·
      no `x-default` hreflang. Real, but it belongs in `pathsForPage` so both call sites get it at
      once — a routing change, not an SEO-surface one, and the twelve-address map is the spec it
      would have to be checked against.
- [x] 🔵 OBSERVATION · skipped · code-review · `src/app/(frontend)/[[...segments]]/page.tsx:75` ·
      an editor typing the full `Title | Wykończymy` into the SEO tab gets the brand twice, because
      `meta.title` passes through the root template. Fixed by a field description in the Payload
      config — a CMS-copy change, outside this diff's surface.
- [x] 🔵 OBSERVATION · skipped · code-review + impl-review · `src/app/icon.png` · 512×512 / 90 KB
      served on every page with no smaller variant and no `favicon.ico`. Relevant to the Lighthouse
      goal this work sits under, but it is asset generation, not review cleanup.
- [x] 🔵 OBSERVATION · dropped · code-review · `src/lib/content/addresses.ts:27-33` · the
      `pageType` Map would duplicate addresses if two documents ever shared a page type. One
      document per type is enforced in the admin; a `Set` would make the comment true as written
      but guards a state that cannot currently exist.
- [x] 🔵 OBSERVATION · dropped · code-review · `src/lib/content/addresses.ts:19` · `cache()` buys
      nothing here — the two call sites are separate build-time scopes and the finders it wraps are
      already cached. Harmless.
- [x] 🔵 OBSERVATION · dropped · code-review · `src/app/sitemap.ts:26` · `pathsForPage` per entry
      is an N+1 (6–12 reads at build). Too small to matter at twelve addresses.
- [x] 🔵 OBSERVATION · dropped · code-review · `src/lib/seo/og-image.ts:17` · `width`/`height` are
      omitted rather than defaulted for a Media row without dimensions. Next guards the emission;
      no invalid markup.
- [x] 🔵 OBSERVATION · dropped · impl-review · `src/lib/content/addresses.ts:19` · `listAddresses`
      breaks the directory's `find*` prefix. It does not find a document; the name is right.
- [x] 🔵 OBSERVATION · dropped · impl-review · `src/app/icon.png` · the `icon.svg` → `icon.png`
      switch is unrecorded. Recorded here; not worth a doc edit of its own.
- [x] fixed · structure-scatter · `AGENTS.md` · the `lib/content/<x>.ts` (reads Payload) vs
      `lib/<x>/` (no Payload dependency) split is a real convention — `lib/contact/` vs
      `lib/content/contact.ts` predates this slice — but it is written down nowhere, so
      `lib/seo/` next to `lib/content/seo.ts` reads as an accident. One line under
      `## Conventions`.
- [x] fixed · comment-noise · `src/app/(frontend)/[[...segments]]/layout.tsx:42` · drop the word
      `three` from "The chrome's own three reads" — a hand-maintained count this very diff had to
      bump from `two`. Highest-value comment finding: a live maintenance hazard, not a style nit.
- [x] fixed · comment-noise · `src/app/(frontend)/[[...segments]]/layout.tsx:57` · delete the
      `{/* Once, in the shell — … */}` block — placing a site-wide Organization block in the shell
      is the canonical pattern; the comment restates the placement.
- [x] fixed · comment-noise · `src/lib/content/children.ts:7` · delete
      `/** What the route needs off a child … */` — one-to-one restatement of the three fields.
- [x] fixed · comment-noise · `scripts/populate-seo.ts:62-63` · delete "An authored value is never
      overwritten…" — restates the `if` and its own log line, and duplicates the file header.
- [x] fixed · comment-noise · `src/lib/seo/og-image.ts:14-15` · trim from `, so a page whose` —
      the trailing clause restates the ternary.
- [x] fixed · comment-noise · `src/app/sitemap.ts:11` · trim
      `It ships now so cutover is a deletion rather than a build.` — the preceding sentence
      already carries the why.
- [x] fixed · comment-noise · `src/lib/content/seo.ts:5` · trim
      `The shape \`generateMetadata\` consumes.` — the sentence that follows is the load-bearing one.
- [x] fixed · comment-noise · `src/lib/seo/constants.ts:3-4` · trim up to `drift.` — the
      "three copies would drift" clause only restates that it is a shared constant; the
      "cannot await a query" sentence is the real reason.
- [x] dropped · comment-noise · `src/lib/content/contact.ts:9` · `rather than a query of its own`
      — the auditor's own verdict is "arguably not worth the churn". Agreed; not worth the diff.
- [x] skipped · module-cohesion · `src/lib/routing.ts:1-98` · 15 exports mixing page-type
      constants with path builders; would want `routing/constants.ts` + `routing/paths.ts`.
      Pre-existing — the slice's only addition (`segmentsForPath`) is on-topic. A routing refactor
      does not belong inside an SEO slice.
- [x] skipped · structure-scatter · `src/components/media/types.ts` · `MediaImageT` is declared in
      the component tier and imported by 19 modules, 5 of them in `lib/` — an upward dependency
      the slice deepened by 2 (`lib/content/seo.ts:1`, `lib/seo/og-image.ts:1`). Pre-existing
      repo-wide convention; relocating it is a 19-import refactor with its own review surface.
- [x] dropped · module-cohesion · `scripts/populate-seo.ts` · holds two reasons to change (the
      marketing copy and the write loop). A 92-line one-shot script is not worth splitting.
- [x] dismissed · module-cohesion · `src/lib/content/interior-styles.ts` · flagged for "types +
      3 value exports"; it is one topic — the DTO, its mapper, its finders. The slice added two
      lines, both delegating to `lib/content/seo.ts` rather than inlining.
- [x] dismissed · module-cohesion · `src/lib/content/projects.ts` · identical shape, identical
      two-line delta. Same verdict.

### `/simplify` pass — Step 2

Four cleanup agents (reuse / simplification / efficiency / altitude), read-only, then one apply
pass. Four findings surfaced from two angles independently, which is what promoted them over the
single-source ones.

- [x] fixed · simplify · `src/lib/routing.ts:44` · the "does this document have an address in this
      locale" test was written at three call sites in three spellings, and `pages.ts:88` was
      missing the locale half — so `pathsByType.home` built `/en//` for an untranslated English
      home and handed it to `SiteHeader`, `MobileMenu`, `SiteFooter` and the home CTA resolver.
      The `addresses.ts` fix earlier in this gate corrected one copy only. Now one exported
      `hasAddress(page, locale)` beside `pathForPage`, called from all three.
      test: TDD · unit — three cases on the predicate plus three on `listAddresses`; verified red
      against the pre-fix form, where the failure prints the literal `/en//`.
- [x] fixed · simplify · `src/lib/content/organization.ts` · the route shell assembled the business
      identity out of two CMS documents (phone/mail on the footer global, address/NIP on the
      contact page) and threaded four scalars into the JSON-LD block. `findOrganization(locale)`
      owns that in the CMS tier — where the convention added to `AGENTS.md` this same run says it
      belongs — and the component takes one shape. Both finders were already request-cached, so
      no extra query.
- [x] fixed · simplify · `src/lib/seo/constants.ts` · cutover was two switches in two files
      (`robots.ts` `disallow` and the root layout's `robots` metadata) coupled only by comments
      pointing at each other. A half-flip is silent and both directions are bad: flip robots only
      and the sitemap advertises twelve `noindex` URLs; flip the layout only and every page
      invites a crawl robots.txt forbids. One `SEARCH_INDEXING_ENABLED` now drives both.
- [x] fixed · simplify · `src/lib/seo/absolute-url.ts` · `new URL(x, SERVER_URL).href` was written
      five times across three new files — the same argument the slice itself made for hoisting
      `SITE_NAME`. One `absoluteUrl`; it also gets `SERVER_URL` back out of a component file.
- [x] fixed · simplify · `scripts/populate-seo.ts:70` · a third copy of the published-pages query,
      already drifted on `limit` (100 vs 1000), against a contract `pages.ts:64-65` explicitly
      says is single-source. Calls `findPublishedPages`. Verified safe from a `tsx` script: React
      `cache()` degrades to a pass-through outside a request scope.
- [x] fixed · simplify · `src/app/(frontend)/[[...segments]]/page.tsx:163` · the contact branch
      still mapped `address`/`nip` inline, duplicating the `findContactDetails` the slice had just
      added for the JSON-LD block. Now reads the shared finder; `ContactPageDataT` becomes
      `ContactDetailsT & { phone; mail }` instead of restating its two fields.
- [x] fixed · simplify · `src/lib/content/addresses.ts:9` · `AddressT.locale` was written on every
      entry and destructured by neither consumer, while being derivable from `path`. A documented
      field nothing depends on reads as a contract. Dropped.
- [x] fixed · simplify · `src/app/sitemap.ts:14` · a conditional spread wrapped around an `await`
      four levels deep, whose `{}` branch read as "no-op" rather than "this is a child". Early
      return in the map body.
- [x] fixed · simplify · `src/lib/routing.ts:93` · `localeFromPath` hand-split the path nine lines
      below the helper extracted to stop exactly that, whose own comment therefore contradicted
      itself the day it landed.
- [x] fixed · simplify · `src/lib/content/seo.ts:15` · `DESCRIPTION_LIMIT` was module-private and
      `tests/unit/seo.spec.ts` kept its own copy of `155`, so the cap test measured its own
      constant. Exported and imported.
- [x] fixed · simplify · `src/lib/content/projects.ts:49` · `image ?? null` at an argument position
      whose signature already accepts `undefined` — it made the parameter look stricter than it is.
- [x] filed · simplify · `src/lib/content/seo.ts:20` · `toSeoMeta` has `derivedDescription` and
      `derivedImage` but no `derivedTitle`, and pages pass no derived image at all — so all six
      page addresses share the one brand OG card, while the title chain
      (`meta.title ?? child?.title ?? page.title`) is the only SEO mapping left outside
      `lib/content/`. Behaviour-changing and uncertain: which image is each page type's hero is a
      content decision, and contact and the price list have no candidate. filed EX-821
      test: TDD · unit — recorded on the issue; `tests/unit/seo.spec.ts` already covers the mapper.
- [x] filed · simplify · `src/app/(frontend)/[[...segments]]/page.tsx:112` · `resolveRoute` returns
      a `child` the render branch ignores, re-fetching the whole collection and `.find()`ing the
      same document again, in two structurally identical blocks. The fix widens `PageChildT` into a
      union and changes `resolveRoute`'s return type — a shape change to the routing contract, not
      a cleanup, so it deserves its own diff. filed EX-822
- [x] filed · simplify · `src/components/interior-styles/interior-styles-section.tsx` · the section
      prop is the whole `InteriorStyleT[]`, handed across a `'use client'` boundary to a carousel
      that reads five fields — carrying ~15.8 KB of `body` prose per locale plus 48 gallery
      relations and 12 `contentImage` objects onto the page Lighthouse measures. Not fixed here
      because it touches files a parallel agent landed as `b0440a3` mid-gate. filed EX-823
- [x] skipped · simplify · `scripts/populate-seo.ts:70-91` · the published query and the
      `draft: true` query could collapse into one, since `draft: true` returns each document's
      latest version and the published set is that minus the drafted ones. Correct as reasoning,
      but it sits directly on the CRITICAL this gate just fixed and reshapes the write set the
      reproduction validated. Not worth re-opening a settled destructive path to drop one query
      from a one-shot script.
- [x] skipped · simplify · `src/app/sitemap.ts:20` + `page.tsx:64` · "children do not advertise
      translations" is implemented twice, comment and all. Real, but the shared part is a single
      ternary and the two consumers want different shapes (a path record vs absolute URLs); an
      extraction would be longer than what it replaces.
- [x] dropped · simplify · `src/app/(frontend)/[[...segments]]/page.tsx:91` · the `twitter` block
      restates `openGraph`, and crawlers fall back to `og:*` when `twitter:*` is absent — so only
      `card` does work. Turns on crawler behaviour the Next docs do not state either way; not
      worth the churn against an unverified premise.
- [x] dropped · simplify · `src/app/(frontend)/[[...segments]]/layout.tsx:52` · `pathsForPage` is
      a serial round trip after the `Promise.all`, paid on every render including every miss.
      Pre-existing, not touched by this slice, and the fix (one `locale: 'all'` read serving both
      `pathsByType` and `pathsForPage`) belongs to whoever owns that hot path.

## Simplify pass

Ran `/simplify` as Step 2 — four read-only angle agents, then one serial apply pass. 11 fixed,
3 filed (EX-821, EX-822, EX-823), 2 skipped, 2 dropped; every finding folded into `## Findings`
above, tagged `simplify`. No separate report file.

## Tests & suite

- `pnpm lint` — green
- `pnpm exec tsc --noEmit` — green
- `pnpm build` — green, 46 prerendered paths, `/sitemap.xml` and `/icon.png` emitted
- `pnpm test:int` — green, 64 passed
- `pnpm test:e2e` — **6 failed** (admin dashboard, 2× frontend-routing, 2× photo-lightbox,
  reduced-motion), 6 passed, 2 did not run. Not investigated: the owner said to skip it, and the
  tree held a parallel agent's uncommitted work at the time, so attribution was never established.

Re-run after the `/simplify` pass (Step 3 — the numbers above predate it):

- `pnpm exec tsc --noEmit` — green
- `pnpm lint` — green
- `pnpm test:int` — green, **78 passed across 14 files** (was 64/12; +3 `hasAddress`,
  +3 `listAddresses`, +2 populate-seo draft guard)
- `pnpm build` — green, 53 static pages; route table carries `/icon.png`, `/robots.txt`,
  `/sitemap.xml`. Artefacts byte-comparable to the pre-`/simplify` build: 46 `<loc>` entries,
  zero `null`, no double-slash paths, `robots.txt` unchanged.
- `pnpm test:e2e` — not re-run; still skipped on the owner's instruction.
