# Review-gate ledger — process-section + typography pass · 2026-09-21

Scope (this slice only — the tree also holds another agent's in-flight `lead-delivery`
work under `src/lib/{contact,blob,env*}` and `tests/unit/sweep-orphans.spec.ts`, which is
NOT part of this slice and must not be touched):

- `src/components/home/process/{process-spotlight.tsx,steps.ts}` (new, untracked)
- `src/app/(frontend)/(lab)/process-lab/*` (new, untracked — 6 layout variants)
- `src/components/home/home-page.tsx` (test mount of the section)
- `src/app/(frontend)/styles.css` (`--wk-green` / `--wk-success`)
- `src/components/ui/carousel-arrow.tsx` (edge-aware disabled state)
- `src/components/footer/contact-form/field-control-classes.ts` (16px control floor, 14px placeholder)
- site-wide `text-10`/`text-12` → `text-14` pass (~25 files)

Fan-out: correctness, simplification/reuse, comment-noise (flag-only), structure +
tailwind-v4. `/10x-impl-review` dropped — no `plan.md` for this slice.

## Findings

**Trimmed at archive (2026-09-22).** The pre-trim tally was **13 fixed, 6 dismissed, 3 dropped, 4 skipped · 2 open (both closed at archive)** across 26 findings. Every `fixed` finding was removed: its durable record is the
commit that fixed it, and the fix is now just the code. What survives below is the negative
space git cannot hold — what was looked at and deliberately *not* changed, and why.

- [x] resolved · simplify · `src/app/(frontend)/(lab)/process-lab/*` · delete the whole lab, −378 lines — the spotlight was chosen and shipped and nothing linked to `/process-lab/`. Left to the owner at the time because the directory was untracked and the deletion unrecoverable. Closed at archive (2026-09-22): the directory is gone and no reference to it survives in `src/`, `tests/` or `context/`.
- [x] superseded · structure · `src/components/home/home-page.tsx:109` · the placeholder mounted on the real home page — six steps of hardcoded Polish copy (incl. "Gwarancja 24 miesiące"), rendered untranslated on `/en/`. Closed at archive (2026-09-22): the Payload wiring you ordered for after this gate landed, `home-page.tsx` now renders `processSection` from the CMS and the constant is gone — `grep "Gwarancja 24" src/` is empty.
- [x] dismissed · simplify · `src/components/ui/carousel-arrow.tsx:29` · proposal to drop `toEdge`/`fromEdge` and keep only `slideChange`. The correctness pass traced Swiper's `updateProgress` — both fire on resize and breakpoint change, where the last slide can stop being the last. Kept all three; the reviewers disagreed and the source settled it.
- [x] skipped · simplify · `process-spotlight.tsx:53-95,143-164` · replace the measured strip (`marks`, `axis`, `measure()`, `ResizeObserver`, four spans) with per-step CSS segments sized `calc(100% + gap)`, ≈ −75 lines. Real and probably right, but it is the only visual behaviour in the file and changes geometry on mobile — behaviour-changing, wants eyes at both breakpoints and a resize across them. Its own review, not a gate fix.
- [x] dismissed · simplify · `process-spotlight.tsx:46,203` · proposal to delete `wantsRun` as unreachable. The correctness pass agrees on the ordering but did not verify it at runtime, and the handshake is 5 lines guarding a section that silently never rotates if the bet is wrong. Kept.
- [x] skipped · structure · `src/app/(frontend)/styles.css:169` · `#1db954` is 2.46:1 on the light canvas, under the 3:1 non-text floor. Decorative-redundant (the dot is `aria-hidden`; state is also carried by `aria-current` and the label colour), so not a formal failure — but a `--wk-green-lifted` following the `--wk-red` precedent is the fix if it reads washed out. Needs your eyes before adding a token speculatively.
- [x] dropped · tailwind-v4 · `process-lab/{scroll-rail,rail-alternating,rail-core}.tsx` · `left-[7px]` → `left-1.75`, `inset-[2px]` → `inset-0.5`. Churn on four variants with a scheduled death.
- [x] dropped · comment-noise · `process-lab/*` · 7 deletions and 3 trims across the lab files. Moot either way — the lab is deleted or it is scratch.
- [x] dropped · simplify · `steps.ts:9` · `aside` is write-only in the shipped component (only the lab variants read it). Dies with the lab decision, or with the Payload modelling.
- [x] dismissed · simplify + structure · `process-spotlight.tsx` cohesion · both passes independently concluded: do not split. The file is one mechanism bound by a single `MotionValue`; a `useSpotlightRail()` hook would return five values and still be written back to by the Swiper callbacks.
- [x] dismissed · tailwind-v4 · `process-spotlight.tsx:148-163,258` · the inline `style` hits are runtime-measured px and Motion values, both of which the token rule leaves open; the scanner found zero `var()`-in-brackets across the diff.
- [x] dismissed · structure · `src/app/(frontend)/styles.css` · ~8 Prettier re-order hunks inside `@apply`, triggered by the theme keys moving. Not a change; called out here so the next reader does not hunt for one.
- [x] dismissed · tailwind-v4 · the ~25-file text pass · no contradictory variants (every surviving pair steps *up*), no dead `md:` restating its base, `text-10`/`text-12` left only on dev surfaces. The one geometric fallout is the `h-12` above.

## Simplify pass

Folded into `## Findings` (tagged `simplify`) rather than run as a separate `/simplify`
invocation — the fan-out's simplification agent produced the same ledger, and a second
mutating pass over a file three reviewers had just read would have been re-review, not
simplification.

Net: ~−120 lines applied. The two large deletions still on the table (the lab, −378;
the CSS-segment rewrite, −75) were the two boxes left open at the time; the lab has since been deleted, so only the CSS-segment rewrite is still on the table.

## Tests & suite

- `pnpm typecheck` — green.
- `pnpm lint` — green.
- `pnpm test` / `test:e2e` / `build` — not run; awaiting your go (the e2e leg wants its own
  dev server on 3100 and the test DB container).

No new tests authored: every correctness finding in this slice is visual carousel state
with no harness in the suite, and each is recorded with that disposition above.
