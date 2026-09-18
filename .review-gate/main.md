# Review-gate ledger — working tree on `main` · 2026-09-18

Scope: the whole uncommitted working tree (31 modified + 5 untracked files). `/10x-impl-review`
dropped out — the active change `context/changes/2026-09-18-lead-delivery/` holds only `change.md`,
no `plan.md` to anchor drift against, and most of the diff falls outside that slice. Step 0.5
verification dropped out — no `verify-manual-checks` skill here, and browser automation is off
unless asked.

Fan-out: `/code-review`, `tailwind-v4-audit`, `feature-first-structure`, `module-cohesion-audit`,
`structure-scatter-audit`, `comment-noise-audit`.

## Parallel-session hold

`src/components/layout/{mobile-menu,nav-item,site-nav}.tsx` were written at **14:18**, after this
gate started — a second agent is live in the tree. Every finding in `src/components/layout/*` was
therefore held out of the mutating pass and filed instead (EX-806).

## Findings

- [x] 🔴 CRITICAL · fixed · `code-review` · `scripts/seed/photos.ts:85-101` · `storeOriginal` wrote Payload's stored bytes to a hardcoded `<cwd>/media`, which is only correct while the Vercel Blob adapter is off — and `payload.config.ts:81` turns it on from `BLOB_READ_WRITE_TOKEN` alone. With the token set, originals landed in a directory nothing serves while every row was stamped with a `filesize` describing bytes Blob didn't hold, and the early-return guard made that state permanent. Deleted the whole function: what it defended is a measured ~45 dB re-encode, i.e. imperceptible, and it was the only reason the script touched the filesystem at all.
      test: no automated test · — — a deletion has no behaviour to pin; the replacement invariant ("this module never writes files itself") is now structural
- [x] 🔴 CRITICAL · fixed · `gate` · `src/app/(frontend)/styles.css:1` · **self-inflicted, by this ledger.** Tailwind v4 auto-detects sources as "every non-gitignored file", markdown included, so the literal `w-[var(…)]` quoted in the EX-806 line below was extracted as a real candidate and emitted `.w-\[var\(…\)\] { width: var(…) }` — which PostCSS cannot parse, breaking every page. Added `@source not` for `context/` and `.review-gate/`: those trees are prose, and `context/` is full of docs that quote class names, so the same trap was already armed for any future doc.
      test: no automated test · — — `pnpm build` is the guard; the failure mode is a parse error, not a behaviour

- [x] 🟡 WARNING · fixed · `code-review` · `src/components/lightbox/photo-lightbox.tsx:24-38` · closing the lightbox dropped focus to `<body>`. Radix restores to a `Dialog.Trigger` and a tile is not one, so its composed `preventDefault()` also killed FocusScope's fallback. The provider now records `document.activeElement` on open and refocuses it before unmount.
      test: TDD · e2e — `tests/e2e/photo-lightbox.e2e.spec.ts`, authored not run (Playwright stays closed unless asked)
- [x] 🟡 WARNING · fixed · `code-review` · `scripts/seed/photos.ts:135` · `pnpm seed:photos` against a database with no styles was a silent success — empty loop, no warning, exit 0. Now throws naming `pnpm seed`.
      test: TDD · unit — `tests/unit/seed-photos.spec.ts`, green
- [x] 🟡 WARNING · filed EX-803 · `code-review` · `scripts/seed/photos.ts:79` · `Media.alt` is not localized and alt strings are built from a `locale: 'pl'` query, so all 74 photos serve Polish alt text on `/en/`. Needs a schema change plus a migration a human runs.
      test: no automated test · — — recorded on EX-803
- [x] 🟡 WARNING · dismissed · `code-review` · `scripts/seed/photos.ts:104` · a hand-uploaded file sharing a filename gets its picture swapped. That is the script's documented job — it overwrites what an editor arranged, which is why it is kept out of `pnpm seed`.
- [x] 🔵 fixed · `code-review` · `src/components/lightbox/photo-lightbox-dialog.tsx:44` · no `Dialog.Description`, so Radix warned on every open. Added `aria-describedby={undefined}` — a photo needs no prose description.
      test: no automated test · — — a dev-only console warning
- [x] 🔵 fixed · `code-review` · `src/components/lightbox/photo-lightbox-dialog.tsx:50` · `Dialog.Close` was the last child and so the last tab stop, behind both arrows. Moved ahead of the Swiper; it is absolutely positioned, so nothing moves visually.
      test: no automated test · — — tab order, covered in spirit by the focus e2e
- [x] 🔵 filed EX-804 · `code-review` · `src/components/lightbox/photo-lightbox-dialog.tsx:59` · Swiper binds `Keyboard` on `document`, so arrowing through the lightbox also advances the related-styles carousel behind it. The fix belongs on the background carousel, not here.
      test: TDD · e2e — recorded on EX-804
- [x] 🔵 filed EX-805 · `code-review` · `src/lib/content/home.ts:34` · a page with no slug in one locale makes `childPath` emit `/boho/`, 404ing all twelve teaser cards. Pre-existing, widened by the per-style `basePath`; the right semantic is a routing decision.
      test: TDD · unit — recorded on EX-805
- [x] 🔵 fixed · `code-review` · `src/components/media/media.tsx:11` + `media-image.tsx:11` · the `unoptimized` prop was threaded through both components and passed by nobody — my own leftover scaffolding from the blur diagnosis. Removed.
- [x] 🔵 fixed · `code-review` · `src/components/lightbox/photo-button.tsx:20` · `className` hit the `<button>` in one branch and the `<img>` in the other, and the null branch dropped `priority`. No caller passed `className`, so the prop is gone and `priority` now reaches both branches.
- [x] 🔵 dismissed · `code-review` · `photo-lightbox-dialog.tsx:54` · `loop` with exactly two slides. Swiper clones to reach its threshold; verified working.
- [x] 🔵 dismissed · `code-review` · `style-gallery.tsx:22` · `isWide` returns false when `width`/`height` are absent. Payload stores both for every image upload, so the branch is unreachable.
- [x] 🔵 dismissed · `code-review` · `scripts/seed/photos.ts:170` · `payload.update` without `draft: true`. Publishing is exactly what a photo seeder should do.
- [x] 🔵 dismissed · `code-review` · `language-switcher.tsx:37` · no `Popover.Portal`. The reviewer verified the header establishes the stacking context and floating-ui accounts for the sheet's transform.
- [x] 🔵 dismissed · `code-review` · `language-menu.tsx:16` · lost `bg-grau_800`. Deliberate — the sheet is white now.
- [x] 🔵 dropped · `code-review` · `photo-lightbox.tsx:24` · dead state if `openUrl` names a url absent from `images`. Unreachable: every tile draws from the same list the provider holds.
- [x] 🔵 dropped · `code-review` · `photo-lightbox.tsx:9` · `dynamic()` has no `loading` fallback. The chunk is small and no loading treatment exists anywhere on this site to match.
- [x] 🔵 dropped · `code-review` · `photo-button.tsx:23` · `<div>` inside `<button>` via `MediaPlaceholder`. Fixing it reaches into every `Media` consumer for an error browsers do not make.
- [x] 🔵 dropped · `code-review` · `style-gallery.tsx:38` · duplicate React keys if an editor picks the same file twice in one gallery. A content error, not a code one.
- [x] 🔵 dropped · `code-review` · `scripts/seed/photos.ts:66` · the parser strips `-scaled` before the numeric suffix, so `<name>-scaled-2.webp` would throw. All 74 files parse and it fails loudly.
- [x] 🔵 dropped · `code-review` · `scripts/seed-photos.ts:8` · no `try/finally` around `payload.destroy()`. `scripts/seed.ts` has the same shape; fixing one splits the convention.
- [x] fixed · `feature-first-structure` · `src/components/lightbox/` · the three lightbox files had zero interior-style knowledge — no domain import, type or string — and `object-carousel/` is the repo's precedent for a domain-free multi-file widget. Moved out of `interior-styles/`; four import lines followed. `structure-scatter-audit` argued the opposite (feature dialogs compose Radix in their own folder); I took feature-first because `language-switcher`, its cited precedent, *is* domain code and this is not.
- [x] fixed · `comment-noise` · `scripts/seed/photos.ts:57` · the prefix matcher's `.sort()` was justified by a `hall`/`hall1` collision that belongs to a different matcher — no style prefix is a prefix of another, so the sort never changed the result. Replaced `filter(...).sort(...)[0]` with `find(...)`.
- [x] fixed · `module-cohesion` · `style-gallery.tsx:41` · `isWide(image)` evaluated twice per tile. Hoisted.
- [x] fixed · `simplify` · `photo-lightbox-dialog.tsx:79` · the control bar was missing `text-14 md:text-16 *:leading-140`, which `TestimonialControls` sets — so the lightbox counter rendered at a different size from every other carousel on the site. That is the divergence the brief called out; fixed.
- [x] fixed · `comment-noise` · 9 deletions + 8 trims across `photo-lightbox.tsx`, `photo-lightbox-dialog.tsx`, `style-gallery.tsx`, `style-page.tsx`, `media.tsx`, `types.ts`, `next.config.ts`, `pages.ts`, `photos.ts`, `AGENTS.md` · class-restatement, a duplicated rationale (`next.config.ts` ↔ `media-image.tsx`), one vanished-state marker (`any more` in `pages.ts`), and two rejected-alternative openers.
- [x] dismissed · `comment-noise` · `photo-lightbox.tsx:8` · kept the `dynamic()` rationale. It names *Swiper* as the weight, which is imported in another file and so invisible here.
- [x] dismissed · `comment-noise` · `media/types.ts:6` · kept the `width`/`height` doc. It is the reason those fields exist on a view-model that otherwise carries url and alt — I deleted them as unused earlier in this session and had to restore them minutes later.
- [x] dismissed · `tailwind-v4-audit` · `media-image.tsx:30` · the audit wanted a comment on the retained inline `style`. `image.focalPoint` → `objectPosition` percentages are self-evidently runtime values; the comment fails the strip test.
- [x] dismissed · `feature-first-structure` · `photo-lightbox.tsx` · context + provider + hook in one file. Matches `lib/i18n/translations-provider.tsx`, and the context is private — splitting would force exporting it.
- [x] dismissed · `feature-first-structure` · `scripts/seed-photos.ts` · mirrors `scripts/seed.ts` + `scripts/seed/run.ts` exactly.
- [x] dismissed · `feature-first-structure` · `src/components/ui/phone-cta.tsx` · the move is correct and both importers use the alias.
- [x] dropped · `feature-first-structure` · `src/components/lightbox/photo-*.tsx` · the `photo-` prefix is redundant inside a folder called `lightbox`. Pure churn.
- [x] dropped · `structure-scatter-audit` · `photo-lightbox-dialog.tsx` + `ui/sheet.tsx` · both hand-roll the "the Overlay exists only for the scroll lock" workaround. Extract at the third dialog, not the second.
- [x] dropped · `module-cohesion` · `scripts/seed/run.ts`, `scripts/seed/photos.ts` · growth seams noted (split per collection past ~300 LOC; lift `storeOriginal` on a second uploader). The second is now moot — `storeOriginal` is gone.
- [x] dropped · `simplify` · `photo-lightbox-dialog.tsx:79` · extracting a shared counter+arrows bar. Two consumers of five lines of JSX, and the third (`projects-carousel/carousel-controls.tsx`) legitimately differs — per-slide fade, a title, `md:order` shuffling.
- [x] filed EX-806 · `tailwind-v4-audit` + `comment-noise` · `language-switcher.tsx:45,48`, `site-nav.tsx:48` · `w-[var(…)]` v3 syntax, a comment crediting `onOpenAutoFocus` with tab-cycling it doesn't control, a comment pointing at `sheet.tsx` for a gap that lives in `mobile-menu.tsx`, and the popover's `avoidCollisions` flip inverting the seam. All held — parallel session owns these files.
- [x] filed EX-807 · `tailwind-v4-audit` · `eslint.config.mjs` · nothing in CI validates Tailwind classes; `prettier-plugin-tailwindcss` only sorts them.

## Simplify pass

Ran as a main-thread pass over the diff (the built-in `/simplify` is a slash command, not a skill I
can invoke) plus a primitive-reuse check against `ui/carousel-arrow`, `ui/carousel-counter`,
`ui/sheet`, `home/projects-carousel/carousel-controls` and `home/testimonials/testimonial-controls`.
1 applied (the control-bar typography), 1 dropped (shared bar extraction), 0 proposed. Both folded
into `## Findings` above.

## Tests & suite

- `tests/unit/seed-photos.spec.ts` — new. `pnpm exec vitest run tests/unit`: **30 passed / 5 files**.
- `tests/e2e/photo-lightbox.e2e.spec.ts` — new, **authored not run**; Playwright stays closed unless
  asked.
- `pnpm exec tsc --noEmit` — clean.
- `pnpm exec eslint src scripts tests` — clean.
- Served stylesheet re-checked after the `@source not` fix — zero unparseable rules, `/` and
  `/wykonczenia/klasyczny/` both 200.
- `/wykonczenia/{klasyczny,modern-retro,industrialny,glamour}/` — all 200, mosaic spans as expected
  (klasyczny 0 wide / 8 square, modern-retro 8 wide / 0 square).
- `pnpm test:int` and `pnpm build` — **not run**: the int suite writes to the dev database and the
  tree holds another agent's in-flight work, so neither result would be attributable.
