# Review-gate ledger — icons + CMS scope-icon picker (uncommitted tree on `main`) · 2026-09-19

Unit of work: working tree vs `HEAD` (`8908b85`), excluding files owned by a parallel session.

**In scope**

- `scripts/seed/data/footer.ts`, `scripts/seed/data/projects.ts`
- `src/collections/Projects.ts`, `src/collections/fields/spec-list.ts`
- `src/components/contact/contact-page.tsx`, `src/components/lightbox/photo-lightbox-dialog.tsx`
- `src/components/projects/project-description.tsx`, `src/components/projects/scope-icon.tsx`,
  `src/components/projects/scope-list.tsx`
- `src/components/ui/checkbox.tsx`, `src/lib/content/spec-item.ts`, `src/components/ui/spec-table.tsx`,
  `src/components/ui/spec-strip.tsx`, `src/components/ui/star-rating.tsx`
- `src/lib/content/specs.ts`, `src/lib/scope-icons.ts`, `src/components/footer/social-links.tsx`
- `src/components/object-carousel/types.ts`, `src/components/projects/project-row.tsx`, `src/lib/content/projects.ts`
- `tests/unit/specs.spec.ts`, `tests/int/pages.int.spec.ts`
- `src/migrations/20260919_144808_scope_icon.ts`, `src/migrations/20260919_151151_scope_drop_value.ts`,
  `src/migrations/index.ts`
- deleted: `src/components/ui/icons/{checkmark,envelope,facebook,instagram,pin,star}.tsx`
- `context/foundation/legal/privacy-policy-pl.md`

**Excluded** — parallel session's uncommitted work, never mutated by this gate:
`src/components/footer/site-footer.tsx`, `src/components/home/hero.tsx`,
`src/components/home/testimonials/testimonials-carousel.tsx`, `src/components/projects/project-hero.tsx`,
`public/images/logo-wykonczymy-brand.png`, and the three pre-existing migration `.json` snapshot edits.
Excluded as generated: `src/payload-types.ts`.

## Findings

**Trimmed at archive (2026-09-22).** The pre-trim tally was **17 fixed, 7 dismissed, 1 dropped, 1 skipped · 0 open** across 26 findings. Every `fixed` finding was removed: its durable record is the
commit that fixed it, and the fix is now just the code. What survives below is the negative
space git cannot hold — what was looked at and deliberately *not* changed, and why.

<!-- [box] [severity, bug-finding checks only] · disposition · `source` · `file:line` · what — reason -->

- [x] 🔵 OBSERVATION · dismissed · `code-review` · `scripts/seed/data/footer.ts:9` · the live site displays
      `biuro@wykonczymy.com.pl` but its `mailto:` points at `bartek@wykonczymy.com.pl`
      (`context/foundation/live-site-snapshot/scraped-content.md:26,364`); our `contact-page.tsx` uses one
      value for both `href` and text. If `biuro@` is a display-only alias that is not actually delivered,
      every mail link on the site goes to an unmonitored box — and lead delivery is a stated guardrail.
      Not verifiable from the repo. **Owner confirmed 2026-09-19 that `biuro@` receives mail**, so the
      single value is correct for both `href` and text and the live site's split is the anomaly.
      test: no automated test · n/a — deliverability is an external fact, not a code path
- [x] 🔵 OBSERVATION · skipped · `suite` · `vitest.config.mts` · the integration tests run against the
      shared local dev database with no per-run isolation, which is what let one crashed run corrupt every
      subsequent one. One transient `beforeAll` failure appeared in 8 consecutive runs, consistent with a
      parallel agent session touching the same database. Standing up an isolated test database is a
      slice of its own and would be a poor thing to smuggle into an icon-picker diff — recorded, not
      filed, because the root hazard (silent cleanup) is now fixed.
      test: no automated test · n/a — test-harness topology, not a code path
- [x] dismissed · `comment-noise` · `src/components/projects/scope-list.tsx` · the `pt-3` alignment comment.
      Audited explicitly and passed: it records cross-instance coupling to the *other* branch's `min-h-10`,
      which nothing in the code links. Kept.
- [x] dismissed · `tailwind-v4` · `src/components/projects/scope-list.tsx` · `pt-3` as a raw scale utility
      rather than a `@theme` token. Verified as the idiomatic v4 form — 12px here is an arithmetic result
      (half the difference between two line boxes), not a design value, and tokenising it would hide the
      derivation behind a name that means nothing on its own.
- [x] dismissed · `tailwind-v4` · `src/components/ui/star-rating.tsx:32` · inline `style` for the clip
      width. Pre-existing and a legitimate exception — a runtime-computed percentage no utility can express
      and Tailwind's scanner could never emit from a template string.
- [x] dismissed · `module-cohesion` · `src/lib/scope-icons.ts` · scanner flagged "mixes kinds (types + 2
      value exports)". The skill's own carve-out covers it: a defining `const` and the type derived from it
      are one concern. Identical shape to the `service-icons.ts` precedent.
- [x] dismissed · `feature-first-structure` · the `lib/` + feature split for the new pair. Verified as an
      established repo convention with four instances (`routing.ts`, `ratings.ts`, `service-icons.ts`,
      `scope-icons.ts`), not a one-off — and the `.ts` resolver vs the precedent's `.tsx` component is
      forced by `SpecTable`'s function-prop seam, not a drift.
- [x] dismissed · `structure-scatter` · `src/components/ui/icons/` after six deletions. Six files remain,
      all with live consumers, all hand-drawn marks FA's free tier cannot supply — which is exactly the
      AGENTS.md definition. The directory got more coherent, not less.
- [x] dropped · `comment-noise` · four pre-existing trim candidates outside this change's intent
      (`contact-page.tsx:65`, `Projects.ts:8`, `spec-list.ts:5-6`, `specs.ts:4-5`). Real but cosmetic, and
      churning unrelated comments widens a diff the owner has to read. Not filed.

## Simplify pass

Ran `/simplify` over the in-scope files — its findings are folded into `## Findings` above, tagged
`simplify`; there is no second list. It reported no separate report path back to the gate. Its two
structural calls were the ones that superseded triage decisions: splitting `SpecTable`'s list branch
into `components/projects/scope-list.tsx` (which removed the `iconFor` function prop and the
discriminated union along with it) and hoisting `iconField` out of `specListField`. It also held back
one edit as blocked — `src/components/footer/social-links.tsx`, because it sits beside the parallel
session's `site-footer.tsx`; `git status` showed that file clean, so the dangling TRIAL comment was
removed by hand in the main thread rather than deferred.

## Tests & suite

- `pnpm typecheck` — **green**
- `pnpm lint` — **green**
- `pnpm test:int` (unit + integration; both globs live in `vitest.config.mts`) — **green, 38/38**, after
  clearing the leaked fixture above. Ran 8 times total: 7 green, 1 transient `beforeAll` failure
  attributed to shared-database contention, recorded as its own finding.
- `pnpm build` — **green**, 50 static pages generated across both locales
- Re-run end to end after the scope-`value` removal: `pnpm migrate` → `pnpm seed` (exit 0) →
  typecheck / lint / `test:int` 38/38 / build, all green; scope rows verified in `projects_scope` as
  name + icon in both locales.
- `pnpm test:e2e` — **not run.** Playwright is not launched without an explicit ask (standing rule).
  `pnpm test` is `test:int && test:e2e`, so the full-suite alias was not run to green either.

New test authored this gate: `tests/unit/specs.spec.ts` — pins the editor's icon key surviving
`toSpecs`, the single hop between the CMS row and the renderer where losing it degrades every scope row
to the fallback tick without erroring.
