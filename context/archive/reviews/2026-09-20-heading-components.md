# Review-gate ledger — heading-components (folder-less slice on `main`) · 2026-09-20

Slice: extract the page/entry heading layer into components, fix the heading outline,
resize the interior-style card title.

Files (11 reviewed; the fix pass added `style-card.tsx` and `fonts.ts`):

- src/components/ui/page-title.tsx (new)
- src/components/ui/entry-title.tsx (new)
- src/components/ui/section-title.tsx
- src/components/layout/page-wrapper.tsx
- src/components/home/hero.tsx
- src/components/home/interior-styles/interior-style-slide.tsx
- src/components/interior-styles/style-card-body.tsx
- src/components/object-carousel/object-carousel.tsx
- src/components/object-carousel/object-slide-content.tsx
- src/components/projects/project-row.tsx
- src/app/(frontend)/styles.css

NOT in scope, never touched: `context/changes/2026-09-20-s7-seo/` — untracked,
`status: new`, a parallel agent's change folder.

Fan-out that ran (6): `/code-review`, `tailwind-v4-audit`, `feature-first-structure`,
`module-cohesion-audit`, `structure-scatter-audit`, `comment-noise-audit`.
`/10x-impl-review` dropped out — no `plan.md`, this slice has no change folder.

## Findings

**Trimmed at archive (2026-09-22).** The pre-trim tally was **11 fixed, 7 dismissed, 4 dropped, 5 skipped, 1 filed · 0 open** across 28 findings. Every `fixed` finding was removed: its durable record is the
commit that fixed it, and the fix is now just the code. What survives below is the negative
space git cannot hold — what was looked at and deliberately *not* changed, and why.

- [x] 🟡 WARNING · skipped · code-review · `src/components/home/home-page.tsx:45` · home's
      only `h1` is conditional on the nullable CMS `hero` group, so clearing it in Payload
      ships `/` with no `h1` and reddens `tests/e2e/frontend.e2e.spec.ts:9`. Not fixed: the
      alternatives are an invisible fallback heading (worse outline, hides the editor error)
      or making the field required, which is a CMS schema change and a migration — out of a
      heading-components slice. The red test is the correct signal for an empty hero.
      test: no automated test — the failure mode is empty CMS data, and the existing e2e
      assertion already fails loudly on it.
- [x] 🔵 OBSERVATION · dismissed · code-review · `src/components/ui/entry-title.tsx:18` · the
      dedup is not visually neutral — the `h3` call site moves Geist → Poppins because the
      base rule covers `h1, h2, [data-display]` only. Intended and already flagged to the
      owner before the gate; it makes the two identically-styled titles actually match.
- [x] 🔵 OBSERVATION · skipped · code-review · `src/components/interior-styles/style-card-body.tsx:23`
      · the type bump hits the `/wykonczenia/` listing too, not just the home slider; a title
      that fit two lines at 18px may truncate at 20. Needs the owner's eyes against the real
      CMS titles at 768–1279px — not a call to make blind.
- [x] 🔵 OBSERVATION · skipped · code-review · `src/components/ui/page-title.tsx:14` ·
      `project-hero.tsx:18` keeps a weight-400 `h1` while every `PageTitle` page is now 700,
      and `not-found.tsx:21` / `error.tsx:29` are `font-medium`. Real inconsistency, but
      project-hero's `h1` is a deliberate kicker above a larger summary — restyling it is a
      design decision, and it is still the open question put to the owner.
- [x] 🔵 OBSERVATION · skipped · code-review · `src/components/interior-styles/style-card-body.tsx:23`
      · the two listing pages disagree on outline — projects rows emit `h2`, interior-style
      cards emit `<header>`, which contributes no heading. Real, but `<header>` → `h2` pulls
      the card title into the `:is(h1, h2, …)` face rule and restyles two pages; a visual
      change that needs the owner, not a gate fix.
- [x] 🔵 OBSERVATION · dismissed · code-review · `src/components/object-carousel/object-carousel.tsx:26`
      · the heading now sits inside the pre-hydration `opacity-0` gate. `opacity-0` hides
      nothing from AT or crawlers — benign, confirmed by the reviewer itself.
- [x] dismissed · module-cohesion · `src/components/ui/page-title.tsx` · proposed moving it to
      `components/layout/` because it is the only `ui/` file reaching for `paddings`.
      Overruled: `feature-first-structure` and `structure-scatter-audit` both independently
      placed it correctly, and the three title components belong in one directory.
- [x] skipped · module-cohesion · `src/components/ui/section-title.tsx:10` · the family is
      inconsistent — `PageTitle` and `EntryTitle` bake bottom margins, `SectionTitle` bakes
      none and all eight call sites hand-write theirs. Real, but normalising it is a spacing
      change across eight sections of a live site: its own slice, not this one.
- [x] dropped · module-cohesion · `src/components/object-carousel/object-carousel.tsx:38` ·
      `sectionTitle` prop-drilled two levels. Two levels is not drilling worth a context.
- [x] dismissed · feature-first-structure · `src/components/ui/entry-title.tsx:11` · suggested
      `data-display` instead of the `font-display` class. `styles.css` now states that
      `data-display` is for elements that take the face *without being a heading*; an `h3` is
      a heading, so the utility is the honest mechanism.
- [x] dropped · structure-scatter · `src/components/projects/spec-group-heading.tsx:7` ·
      possible `CardLabel` N+1 across three files. The audit inspected the ramps, found they
      genuinely differ, and explicitly did not propose it.
- [x] dropped · tailwind-v4 · `src/components/interior-styles/style-card-body.tsx:23` · `h-*`
      under `line-clamp-2` here vs `min-h-*` three lines away in `interior-style-slide.tsx`.
      Pre-existing on both sides, both render correctly, only the values moved in this diff.
- [x] dropped · comment-noise · `src/app/(frontend)/styles.css:46` · `--text-hero` is
      described as "the hero title" but the hero uses `text-40 md:text-72`. Pre-existing, and
      the token's only consumer is a lab page.

- [x] filed EX-817 · simplify/altitude · `src/components/interior-styles/style-card-body.tsx:23`
      · nine reserved heights across three files are hand-computed `font-size × leading × 2`
      and must be re-derived on every type-scale change — this diff is the proof, and it
      produced the zero-slack `md` tier above. `min-h-[2lh]` would track the type
      automatically. Not fixed here: each replacement shrinks the box 0.8–2px on two live
      pages the owner had just finished eyeballing.
      test: no automated test — the invariant is visual; recorded in EX-817.
- [x] dismissed · simplify/altitude · `src/components/ui/section-title.tsx:10` · proposed a
      default `mb-6 md:mb-8` to match its two new siblings. The reviewer's own call-site
      survey refutes it: only 2 of 8 take that exact value, 2 take `pb-6 md:pb-8 lg:pb-10` and
      2 need no margin at all — the last four would each have to override it back off with
      `mb-0 md:mb-0`. Net churn, not net dedup.
- [x] dismissed · simplify/altitude · `src/components/ui/section-title.tsx:9` · the reviewer
      independently confirmed `if (!title) return null` is the right altitude (a repeating
      "empty CMS field" invariant, not a one-off caller guard). Agrees with the fix above.
- [x] dismissed · simplify/altitude · `src/components/object-carousel/object-carousel.tsx:26` ·
      the reviewer confirmed the sr-only `h2` plus `aria-hidden` visual repeats is the right
      depth — hoisting the visible label out of the track would be a redesign, not an
      outline fix.

Zero findings from `tailwind-v4-audit` (verified empirically by compiling the real theme:
`h-13.5`, `min-h-12.5`, `font-display` and every token in the diff generate) and zero from
`structure-scatter-audit`. `feature-first-structure` recommended no moves.

## Simplify pass

Ran `/simplify` — 4 agents (reuse, simplification, efficiency, altitude). 0 applied, 1 filed,
3 dismissed, 1 skipped; each folded into `## Findings` above (tagged `simplify`). No separate
report written — this ledger is the single record.

Reuse, simplification and efficiency each returned **zero findings** and said so explicitly
after checking the plausible candidates: the three title components are genuinely distinct
(different type rungs, tag, alignment), `const Tag = level` is the repo's first polymorphic
element rather than a reinvention, the three hand-rolled `h1`s left behind have class strings
that do not overlap `PageTitle`, nothing was left dead by the extraction, and moving
`visibility` onto the CTA added no render-loop subscription and shifted no client boundary.
All four altitude findings are above.

## Tests & suite

New: `tests/unit/heading-outline.spec.tsx` — 7 specs pinning the outline this slice fixed
(PageWrapper emits an `h1` only when titled, a carousel slide adds exactly one `h3` and no
`h2`, both repeated slide labels are `aria-hidden`, `EntryTitle` levels, `SectionTitle`
renders nothing on an empty field). Behaviour-asserting, so they survive a later refactor.
`vitest.config.mts` now includes `*.spec.tsx` — `createElement` cannot satisfy a component
whose props require `children`, and a component spec reads as JSX.

| Leg | Result |
| --- | --- |
| `pnpm typecheck` | pass |
| `pnpm lint` | pass |
| `pnpm test:int` (unit + int) | **64 passed**, 11 files, 0 failed |
| `pnpm test:e2e` | **8 passed, 4 failed, 2 did not run** — baseline, see below |
| `pnpm build` | pass, 43+ static paths |

The four e2e failures are **pre-existing and not this slice's**. Proved rather than assumed:
`hero.tsx` was reverted to `HEAD`, `reduced-motion` and `photo-lightbox` were re-run, and both
still failed — so the new `motion.div` carrying `visibility` is not the cause. They are
`admin.e2e` (`tests/helpers/login.ts` waits on a hardcoded `localhost:3000` while the suite
serves 3100), `frontend.e2e` trailing-slash on `/oferta`, and the two above.

`pnpm test:db:refresh` was run mid-gate on the earlier theory that a stale test database
explained three of them. It did not: the same four fail against a database freshly loaded from
production. That theory is dead — worth recording so the next person does not re-run the
refresh for these.

One run showed 7 failures instead of 4; re-running in isolation passed and the full suite
returned to 4. Treat the extra three as flake under the single worker, not signal.

## Still owed to the owner (visual decisions, not gate blockers)

1. Widen `:is(h1, h2, [data-display])` to include `h3`? Removes `EntryTitle`'s workaround;
   costs a Geist → Poppins flip on legal-page subheadings.
2. `project-hero.tsx:18`'s `h1` stays weight 400 while every `PageTitle` page is now 700.
3. The `/wykonczenia/` listing cards grew with the shared `StyleCardBody` — eyeball the
   longest real title at 768–1279px.
