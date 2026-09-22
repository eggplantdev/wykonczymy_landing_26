# Review-gate ledger — design-tokens-dark-mode-settings · 2026-09-19

Scope: the two-tier design-token rewrite, the `[data-theme]` dark mode, and the settings
menu (gear popover: language + theme). 66 paths.

**Excluded as another session's in-flight work** (shared tree, not mine to review or commit):
`src/payload-types.ts`, `src/migrations/*.json` (prettier churn),
`public/images/logo-wykonczymy-brand.png` (untracked), plus form/carousel tuning belonging to
another session (enumerated under a finding since trimmed at archive).

## Findings

**Trimmed at archive (2026-09-22).** The pre-trim tally was **30 fixed, 7 dismissed, 8 dropped, 5 skipped, 1 filed · 0 open** across 51 findings. Every `fixed` finding was removed: its durable record is the
commit that fixed it, and the fix is now just the code. What survives below is the negative
space git cannot hold — what was looked at and deliberately *not* changed, and why.

<!-- [box] · [severity, bug-finding checks only] · disposition · `source` · `file:line` · what — why -->

### Deferred

- [x] filed · tailwind-v4-audit · `.prettierrc.json` · `prettier-plugin-tailwindcss` is a
      devDependency but there is no `plugins` array, so class sorting has never run — real and
      worth doing, but wiring it reformats class strings across the whole tree including another
      session's in-flight files, so it needs a clean tree. filed EX-811

### Correctness / safety

- [x] 🔵 OBSERVATION · dropped · code-review · `settings-menu.tsx` · the panel renders inside
      `<nav><ul>`, putting six controls in the nav's a11y tree. The obvious fix — `Popover.Portal`
      — breaks the mobile sheet: Radix Dialog sets `pointer-events: none` on everything outside
      itself, and a body-level popover is outside. The markup is valid (`<li>` takes flow content)
      and a settings gear is a nav control, so the cure is worse than the complaint.
      test: no automated test · — structural
- [x] 🟡 WARNING · skipped · code-review · `site-logo.tsx:21,33` · both PNGs carry `priority`, so
      every visitor preloads ~30KB of an image their theme hides, competing with the hero LCP.
      Real, but which file to deprioritise is unknowable at build time and dropping both risks a
      logo-less first paint. Needs an SVG mark to fix properly — not this slice.
      test: no automated test · — perf, measured not asserted
- [x] 🟡 WARNING · dismissed · code-review · `styles.css:206` · `--wk-glass` reported dead —
      false positive, `carousel-arrow.tsx:38` uses `bg-glass/30`.
- [x] 🟡 WARNING · dismissed · code-review · header no longer shows which language you are
      reading — not a regression, it is the gear-only trigger you chose explicitly.
- [x] 🔵 OBSERVATION · dismissed · code-review · `settings-menu.tsx` · hydration invariant is
      unenforced and `forceMount` invites breaking it — the `&&` sits outside `Popover.Content`,
      so `forceMount` cannot resurrect a child never in the tree. Documented at `theme-control.tsx`.
- [x] 🔵 OBSERVATION · dropped · code-review · `nav-item.tsx:12` reported dead — half true:
      the `NavItem` component is unused, `navItemClasses` is not. The dead half was removed by a
      separate finding, since trimmed at archive.

### Out of this slice — another session's uncommitted work, deliberately untouched

- [x] 🟡 WARNING · skipped · code-review · `services-carousel.tsx:38` · `756:` is not a breakpoint
      (`--breakpoint-md` is 768), so that tier never fires. Real bug, but it is in another agent's
      in-flight edit; editing it would collide with their work. Flagged to you instead.
- [x] 🟡 WARNING · skipped · code-review · `contact-form-field.tsx:38` · the out-of-flow
      `FieldError` is positioned against the *next* field's padding, not its own. Same reason.
- [x] skipped · code-review · `home-page.tsx`, `testimonials-carousel.tsx`,
      `contact-form-checkbox.tsx`, `service-slide.tsx`, `checkbox.tsx` · gap retunes, stray class
      whitespace, the checkbox invalid state. Same reason — excluded from my commits.

### Tokens / Tailwind

- [x] dropped · tailwind-v4-audit · `menu-toggle.tsx:63` · an inline `style` that only picks
      between two module constants. The `<path>` below it needs inline style regardless — its
      `strokeDasharray`/`strokeDashoffset` are not tokenisable — so converting only the `<svg>`
      leaves the file half-and-half, which is worse than leaving it alone.
- [x] dropped · tailwind-v4-audit · `hero-frame.tsx:26` · hand-rolls what `@utility full-bleed`
      already does — `hero-lab/` is a scratch route, not worth the churn.
- [x] dropped · tailwind-v4-audit · eslint has no Tailwind plugin — tooling gap, not a finding
      about this diff.

### Structure / comments

- [x] dismissed · module-cohesion · `styles.css` should NOT be split — the four token layers are
      one concern and the indirection only reads correctly in one file.
- [x] dismissed · structure-scatter · no scatter; all 7 new files match existing conventions, and
      a `layout/settings/` subdir would break `layout/`'s flat convention.
- [x] dropped · code-review · no tests exist in the repo at all — a standing gap, not this
      slice's to open.

### Simplify pass

- [x] skipped · simplify · `styles.css` · the whole `petrol → brand → --color-brand` chain has
      **zero** consumers — the only palette entry with no path to a rendered pixel. The value was
      deliberately sampled off the logo, so deleting it blind would throw away a decision. Needs
      your call; see the closeout.
- [x] dropped · simplify · `site-nav.tsx`, `settings-menu.tsx` · two vocabularies for the same two
      states (`'header' | 'mobile-menu'` vs `'bar' | 'mobile'`) with one line translating between
      them. Real, but unifying it churns three component APIs to delete one ternary.
- [x] dropped · simplify · a shared `@utility panel` for the card recipe — two call sites do not
      earn a utility now that they share `shadow-panel`.
- [x] dismissed · simplify · no duplicate of any existing helper: no second `cn` variant, no
      pre-existing segmented/toggle primitive, no popover wrapper (`ui/sheet.tsx` is a Dialog).
      Verified against all 15 files in `ui/`, `lib/`, and every `use*` export.
- [x] dismissed · simplify · `surface`/`surface-foreground` is mechanically an alias of
      `foreground`/`background` in both themes, and `ring` of `muted-foreground`. Both kept:
      `bg-foreground text-background` reads as a mistake at the five call sites, and `ring`
      answers to a different contrast floor (3:1 non-text, not 4.5:1 text), so collapsing it would
      let a future tweak to `muted-foreground` silently move the focus indicator.

## Simplify pass

Ran a `/simplify`-style pass (report-only agent, applied in the main thread) — 14 applied,
2 dropped, 2 dismissed, 1 skipped; each folded into `## Findings` above, tagged `simplify`.

## Tests & suite

- `tsc --noEmit` — clean.
- `eslint src --max-warnings=0` — clean.
- `prettier --check 'src/**/*.{ts,tsx,css}'` — clean across the slice. `src/payload-types.ts`
  still fails; it is another session's generated churn and was deliberately left alone.
- Tailwind CLI compile of `styles.css` — verified empirically rather than by reading: the ring
  resolves to `grey-100` light / `grey-300` dark, `--shadow-header` and the new `--shadow-panel`
  both resolve through `var(--wk-shadow)` so they flip with the theme, and `--wk-grey-20` is gone.
- No test suite exists in this repo, so there is nothing to run and no regression guard was
  authored. Every correctness finding above is a contrast value or an a11y attribute — asserting
  either needs a browser-level harness this repo does not have.
