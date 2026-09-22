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

**Trimmed at archive (2026-09-22).** The pre-trim tally was **30 fixed, 10 dropped, 8 skipped,
3 dismissed, 3 filed · 0 open**, including three `🔴 CRITICAL`. Every `fixed` finding was removed:
its durable record is the commit that fixed it, and the fix is now just the code. What survives
below is the negative space git cannot hold — what was looked at and deliberately *not* changed,
and why.

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

- [x] 🔴 CRITICAL · dismissed · code-review · `scripts/populate-seo.ts:73` · "the partial `meta`
      update blanks every other localized field in the locale it touches" — disproven by
      reproduction, see above. The trace was sound at both ends but missed an upstream refill.
- [x] 🟡 WARNING · skipped · code-review · `src/app/sitemap.ts:12` · prerendered once at build with
      no `revalidate`, so a newly published project is absent until the next deploy. Contested —
      impl-review checked the build output and found the route carries the `_N_T_/layout` tag that
      `revalidatePath('/', 'layout')` already invalidates. Inert until cutover either way; it
      belongs to the cutover checklist, not to this slice.
      test: no automated test · — needs a deployed revalidation path to assert against.
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
