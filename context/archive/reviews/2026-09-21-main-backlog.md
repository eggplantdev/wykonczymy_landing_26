# Review-gate ledger — backlog pass (EX-801 / EX-803 / EX-836 / EX-839) · 2026-09-21

Scope: commits `7832310`, `35a119d`, `6ecfc7d`. The working tree's dirty files belong to a
parallel session (lead-delivery, page-board, styles.css, cookie-preferences, home.ts,
tsconfig.json) and are excluded — the gate must never mutate a parallel session's tree.

Dropped checks:
- `/10x-impl-review` — no `plan.md`; this work came from Linear issues, not a 10x change.
- `tailwind-v4-audit` — the diff touches no class names or styles.
- Step 0.5 verification pass — browser/e2e work is forbidden in this session unless asked.

## Findings

**Trimmed at archive (2026-09-22).** The pre-trim tally was **11 fixed, 8 dismissed, 3 dropped · 0 open** across 22 findings. Every `fixed` finding was removed: its durable record is the
commit that fixed it, and the fix is now just the code. What survives below is the negative
space git cannot hold — what was looked at and deliberately *not* changed, and why.

### Dismissed / dropped

- [x] dismissed · `code-review` · `package.json:25` · the `source .env` shell preamble is now a third
      copy — it is a pre-existing repo pattern in a JSON string with no import to dedupe, and the
      honest fixes (a base script, `tsx --env-file`) are more churn than the duplication costs.
- [x] dismissed · `feature-first` · `scripts/localize-media-alt.ts` placement · correct home,
      correct neighbours; `src/lib/content/`, `src/migrations/` and `tools/` were all considered and
      correctly not used.
- [x] dismissed · `module-cohesion` · `scripts/localize-media-alt.ts` is not a grab-bag · zero
      exports, and the three rule tables plus their dispatch have one shared reason to change.
- [x] dismissed · `structure-scatter` · no new home, no competing placement in any of the three
      commits.
- [x] dismissed · `structure-scatter` · eight pre-existing non-component files under
      `src/components/` · untouched by this diff and convention here, not scatter.

- [x] dropped · `code-review` · `src/components/lightbox/photo-lightbox.tsx:9` /
      `consented-analytics.tsx:8` · the repeated `{ loading: () => null }` is not worth a wrapper —
      the ESLint rule is the dedup, and wrapping `dynamic` would hide what the rule wants visible.
- [x] dismissed · `reuse-scan` · `scripts/write-guard.ts` · not a re-invention of
      `tests/helpers/test-database.ts` — different contracts (displayable host vs. normalised
      equality check), and `scripts/` importing from `tests/helpers/` is the wrong direction.
- [x] dismissed · `reuse-scan` · `tests/unit/media-mapper.spec.ts:7` · no `Media` builder exists to
      reuse, and the local factory deliberately casts through `unknown` to produce values the
      generated type forbids.
- [x] dismissed · `reuse-scan` · `src/lib/content/media.ts:24` · `toImage` is the single choke point;
      no competing alt normalisation exists.

### Owner's call, out of the gate's hands

- [x] dropped · `code-review` · the scroll regression guard was proposed as an e2e. E2E is forbidden
      in this session, so the invariant is enforced by the ESLint rule instead — which catches a
      third `next/dynamic` call site before it ships rather than after.
- [x] dropped · `package.json` shell preamble, third copy · dismissed above; JSON strings, no import.

## Simplify pass

Ran the mutating pass by hand against the triage plus `primitive-reuse-scan` — 11 applied,
0 proposed, 6 dismissed, 3 dropped. Every finding is folded into `## Findings` above.
Separately, the owner cut comment volume across the whole diff mid-pass: 72 comment lines → 46,
and both `next/dynamic` "must stay" paragraphs were deleted outright once the ESLint rule
replaced them.

## Tests & suite

- `pnpm exec tsc --noEmit` — clean.
- `pnpm exec eslint scripts src tests` — 0 errors, 1 pre-existing warning.
  Repo-wide `pnpm lint` is red with 908 errors, all 398 of them from `.next-measure/`, an
  untracked build-output dir belonging to a parallel session. Neither gitignored nor
  eslint-ignored. Not this slice's to fix.
- `pnpm exec vitest run tests/unit/media-mapper.spec.ts` — 3 passed.
- `pnpm media:localize-alt` and `pnpm seo:populate`, dry — both `would write 0`, so the shared
  write-guard refactor is behaviour-preserving against the real database.
- `test:int`, `test:e2e`, `build` — declined by the owner, 2026-09-21.
