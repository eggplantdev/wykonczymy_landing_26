# Review-gate ledger — process CMS wiring (fb7cd1c) · 2026-09-21

Scope — the diff of commit `fb7cd1c`, hand-authored files only:

- `src/collections/fields/home-group.ts` (the `process` group)
- `src/lib/content/home.ts` (the mapper)
- `src/components/home/process/process-spotlight.tsx` (contract types moved in)
- `src/components/home/home-page.tsx` (CMS mount)
- `src/components/home/process/steps.ts` (deleted)
- `scripts/populate-process.ts` (new one-off write script)
- `package.json` (`process:populate`)

Generated, not reviewed: `src/migrations/20260921_170759_process_steps.{ts,json}`,
`src/migrations/index.ts`, `src/payload-types.ts`. The migration `.ts` was read for
sanity against the field change and matches.

Fan-out: code-review, comment-noise (flag-only), feature-first-structure,
module-cohesion-audit, structure-scatter-audit, primitive-reuse-scan.
`/10x-impl-review` dropped — no `plan.md` for this slice. Step 0.5 skipped — no
verification skill installed.

## Findings

**Trimmed at archive (2026-09-22).** The pre-trim tally was **19 fixed, 8 dismissed, 4 dropped, 1 skipped · 0 open** across 32 findings. Every `fixed` finding was removed: its durable record is the
commit that fixed it, and the fix is now just the code. What survives below is the negative
space git cannot hold — what was looked at and deliberately *not* changed, and why.

- [x] dismissed · comment-noise · `populate-process.ts:83` · the two-paragraph block on shared row
      ids and the per-locale re-read — kept (rewritten, both rulings survive). Neither is derivable
      from the code and both complete "without this, ___ breaks".
- [x] dismissed · comment-noise · `src/lib/content/home.ts:49` · the `localization.fallback` note —
      it is the only thing stopping a future reader deleting the filters as dead defensive code
      against a `required: true` field. Kept, and now covers all three row sets in one place
      instead of being restated per section.
- [x] dropped · comment-noise · `home-page.tsx:37,57,75` · pre-existing comment trims, untouched by
      this slice. Real but not this slice's churn.
- [x] dropped · feature-first · renaming `service-icons.ts` / `ServiceIcon` to `section-*` now that
      the set serves two sections. Correct in principle, seven import sites of pure naming churn.
- [x] dropped · reuse-scan · `src/components/ui/service-icon.tsx` vs
      `src/components/projects/scope-icon.tsx` · the same primitive written twice over two
      overlapping closed sets. Pre-existing, and merging is behaviour-changing — `ScopeIcon` takes
      `null` and falls back to a default, `ServiceIcon` does not.
- [x] dropped · reuse-scan · `tests/unit/home-content.spec.ts:36,65` · `halfTranslated` and
      `withSteps` differ only in the home group key. Two sites in one file where the local names
      carry the intent.
- [x] skipped · module-cohesion · `src/lib/content/home.ts` · `toHomeData` is one 160-line function
      mapping nine sections, each with its own reason to change. Real, and the seam is visible —
      but splitting it is a refactor of pre-existing code that deserves its own review, not a
      fix smuggled into this gate.
- [x] dismissed · reuse-scan · the `rows?.flatMap(r => cond ? [{…}] : []) ?? []` scaffolding, now
      at three sites. Deliberately **not** abstracted: a helper could only hold the syntax — every
      part that differs (three guard predicates, three output shapes) would still be written in
      full at each call site, in exchange for a name that says less than the code it hides.
      Revisit at a fourth site.
- [x] dismissed · reuse-scan · `populate-process.ts:100` vs `findPage()` · `findPage` is
      `cache()`-wrapped, reads at `depth: 1` and hard-filters published. Routing a write script
      through the request-tier read cache to save six lines is the worse trade.
- [x] dismissed · reuse-scan · the draft guard vs `populate-seo.ts:81` · shared rationale, not
      shared code — seo bulk-queries N pages into a `Set`, this checks one known page. Extracting
      either form forces the other into an N+1.
- [x] dismissed · module-cohesion · `process-spotlight.tsx:25,33` and `home-page.tsx:19` export
      non-component symbols · they are the components' own contract types, which the project rule
      and 11 sibling files colocate. Scanner false positives.
- [x] dismissed · module-cohesion · `process-spotlight.tsx:225` `StepDot` as a second component in
      the file · private, unexported, single-consumer, and pre-existing — the carve-out covers it.
- [x] dismissed · scatter · the slice added no competing home and created no new one; deleting
      `process/steps.ts` removed a stray non-component file from `components/`, so net scatter is
      down.

## Simplify pass

Run as a direct pass over the slice's files (the `/simplify` slash command is not invocable
from inside a session): 3 findings, all 3 applied, folded into `## Findings` above tagged
`simplify`. Net −42 lines. `primitive-reuse-scan` had run earlier as the fan-out's reuse check
— 2 applied, 4 dropped, 4 dismissed, also above.

## Tests & suite

- `pnpm typecheck` — green.
- `pnpm lint` — green.
- `tests/unit/home-content.spec.ts` — green, 11 passed (3 new: two process cases, one services).
- Re-run after the simplify pass: `typecheck` / `lint` / the 11 unit tests all still green.
- `pnpm test:db:refresh` — run, to give the test container the new tables for the partial-update
  probe. Takes a fresh production dump on the way through.
- `pnpm test` (full) / `test:e2e` / `build` — not run; awaiting the owner's go.

No E2E owed: the slice is a CMS-wiring change behind an already-shipped section. The one
browser-level risk it carries — a half-translated section rendering an empty heading — is
asserted at the mapper, which is where the decision is made.
