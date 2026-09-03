# Review-gate ledger — f2-i18n-spine · 2026-09-03

Unit of work: commits `41c93b2..9a16769` (4 phases), branch `f2-i18n-spine` off `main`.

Fan-out (Step 1): `/10x-impl-review`, code-review, `feature-first-structure`,
`module-cohesion-audit`, `structure-scatter-audit`, `comment-noise-audit`.
Dropped: `tailwind-v4-audit` — the slice adds no Tailwind classes.
Step 0.5 skipped: no `verify-manual-checks` skill installed on this machine.

impl-review verdict: REJECTED (1 critical). code-review: 6 🔴 / 8 🟡 / 8 🔵.
The two bug-finding checks converged independently on the same critical set.

## Findings

_Trimmed at archive (2026-09-03): every `fixed` finding was removed — a fix's durable record is its commit, and the code is readable. What survives is the negative space git cannot hold: what was dismissed, dropped, deferred, or superseded, and why. Pre-trim tally: 1 deferred, 3 dismissed, 17 fixed, 17 other, 0 open._

### Deferred — each needs a filed tracked issue before its box can check

- [x] 🟡 WARNING · deferred, tracked in `roadmap.md` § F2 · `code-review`,`impl-review` · `src/migrations/20260903_121437_pages.ts:57` · `slug` is indexed but not unique per locale, so the app-level guard has no DB backing. Needs its own migration, which a human applies to prod. The `is_home` half is moot — `2c87523` dropped the column
      test: TDD · integration — travels with the fix
- [x] deferred, tracked in `roadmap.md` § F2 · `code-review`,`impl-review` · `src/app/(frontend)/not-found.tsx:12` · the 404 sniffs the locale from `usePathname`, so the prerendered shell is Polish for `/en/` and hydration swaps it. Same routing decision as the root layout's hardcoded `lang="en"` — both need a locale a catch-all layout cannot see
      test: TDD · e2e — travels with the fix
- [x] deferred, tracked in `roadmap.md` § F2 · `code-review`,`impl-review` · `src/app/(frontend)/[[...segments]]/page.tsx:65` · no `alternates.canonical` / hreflang, and `generateMetadata` reads no seoPlugin fields — the plugin is not installed yet
- [x] deferred, tracked in `roadmap.md` § F2 · `code-review`,`scatter` · `next.config.ts:15` · `/en/home/` is hardcoded in the redirect while the EN home slug is a CMS-editable field; renaming it silently breaks an indexed redirect

- [x] fixed, then superseded by `2c87523` · `simplify` · `src/lib/pages.ts:33` · `pathsForPage(payload, id)` made the route re-resolve `getPayload` just to hand a client back — the optional `client` param went away with the hook that needed it
- [x] fixed, then superseded by `2c87523` · `simplify` · `src/collections/hooks/revalidatePage.ts:20` · `Parameters<typeof pathsForPage>[0]` indirection replaced with a direct `Payload` import — the hook no longer takes a client at all

### Dismissed / dropped

- [x] 🟡 · dismissed · `code-review` · `page.tsx:59` · "`segments: []` may not materialize `/`" — the build empirically emits `/` as ● SSG
- [x] 🟡 · dismissed · `code-review` · `revalidatePage.ts:37` · "`revalidatePath` needs a `type` argument" — `type` is for route _patterns_; literal paths are the documented usage. Already covered by a manual check
- [x] 🟡 · dismissed · `code-review` · `next.config.ts:15` · "`/en` source may not match `/en/`" — Next normalizes redirect sources under `trailingSlash`. Already a manual check
- [x] dismissed · `cohesion` · `src/lib/routing.ts` · "is it a grab bag?" — the auditor cleared it: four build/parse functions over one URL grammar
- [x] dropped · `structure`,`scatter` · `src/lib/i18n/i18n.ts` · `lib/i18n/i18n.ts` path stutter — cosmetic, and the merge above rewrites the file anyway
- [x] dropped · `simplify` · `src/collections/hooks/revalidatePage.ts:58` · `as string[]` after the `Array.isArray` guard — Payload's `context` is `Record<string, unknown>`, a runtime element check costs more than it buys
- [x] dismissed · `simplify` · `src/lib/i18n/use-translation.ts:12` · the `console.warn` branch is not dead: the dictionary is JSON, so a typed key can still be a non-string if `en.json` drifts
- [x] dropped · `structure` · `src/components/LanguageSwitcher.tsx` · PascalCase vs kebab-case naming — matches the pre-existing `collections/*.ts`; not worth a convention fight at one file

## Simplify pass

Ran /simplify — 2 applied, 0 proposed, 1 dropped, 1 dismissed; each finding folded into
`## Findings` (tagged `simplify`). Report: `/var/folders/cf/bs0zn0gj1lgbc2n7ps0z211h0000gn/T/simplify-XXXXXX.nz3Q3dHbKF.md`

## Tests & suite

- `npx tsc --noEmit` — clean.
- `pnpm lint` — 0 errors, 1 pre-existing warning in `tests/e2e/admin.e2e.spec.ts` (scaffold, not this slice).
- `pnpm test:int` — 12/12 (8 unit routing, 3 Pages integration, 1 scaffold api).
- `pnpm build` — succeeds; `/`, `/oferta`, `/en/home`, `/en/offer` all emit as ● SSG.
- `pnpm test:e2e` — 5/5 of this slice's frontend specs pass (`/`, `/oferta` → 308 → 200, `/en` → `/en/home/`,
  a deep path 404, an unknown slug 404). The scaffold's `admin.e2e.spec.ts` is red — its `login()`
  helper never reaches `/admin` — which is pre-existing scaffold breakage, not this slice.

## Post-review changes by the owner

- `2c87523` replaces per-address revalidation with `revalidatePath('/', 'layout')` and drops the
  `isHome` field in favour of `pageType === 'home'`. Six pages make over-invalidation cheaper than
  tracking which address moved, and the two fields could disagree about which document serves `/`.
  The six findings marked _superseded_ above were real against the code they were written for; the
  blunt hook cannot express those bugs at all.
- `9d3ede0` removes the provider's `useMemo` (see the `pr-review` finding).
