# Review-gate ledger — f2-i18n-spine · 2026-09-03

Unit of work: commits `41c93b2..9a16769` (4 phases), branch `f2-i18n-spine` off `main`.

Fan-out (Step 1): `/10x-impl-review`, code-review, `feature-first-structure`,
`module-cohesion-audit`, `structure-scatter-audit`, `comment-noise-audit`.
Dropped: `tailwind-v4-audit` — the slice adds no Tailwind classes.
Step 0.5 skipped: no `verify-manual-checks` skill installed on this machine.

impl-review verdict: REJECTED (1 critical). code-review: 6 🔴 / 8 🟡 / 8 🔵.
The two bug-finding checks converged independently on the same critical set.

## Findings

- [x] 🔴 CRITICAL · fixed · `code-review`,`impl-review` · `src/lib/routing.ts:24` · `resolveSegments` discards every segment past the first, so `/oferta/anything/at/all/` renders Oferta with a 200 — unbounded duplicate content against a twelve-address guardrail
      test: TDD · unit — resolveSegments is pure; assert deep segments resolve to a miss
- [x] 🔴 CRITICAL · fixed · `code-review`,`impl-review` · `src/collections/hooks/revalidatePage.ts:42` · `afterDelete` applies the request locale's slug to BOTH locales — deleting a PL doc revalidates `/en/oferta/` (not an address) and leaves `/en/offer/` serving the deleted page forever
      test: no automated test — needs a live ISR cache; covered by manual check
- [x] 🔴 CRITICAL · fixed · `code-review`,`impl-review` · `src/collections/hooks/revalidatePage.ts:31` · the renamed-slug branch has the same cross-locale confusion: `previousDoc.slug` is one locale's string fed to every locale
      test: no automated test — same reason
- [x] 🔴 CRITICAL · fixed · `code-review` · `src/collections/Pages.ts:18` · `access.read: () => true` + `drafts: true` exposes unpublished content on the public REST/GraphQL surface — verified: `/api/pages/?draft=true` answers anonymously
      test: TDD · integration — assert an anonymous draft read returns nothing
- [x] 🔴 CRITICAL · fixed · `code-review`,`scatter` · `src/app/(frontend)/[[...segments]]/page.tsx:33` · `pathsForPage` assumes both locales have a slug; with `fallback: false` a PL-only page makes the switcher link to `/en/undefined/`. The revalidate hook already filters this; the route does not
      test: TDD · unit — once extracted, assert a missing locale is omitted
- [x] 🔴 CRITICAL · fixed · `code-review` · `src/app/(frontend)/[[...segments]]/page.tsx:50` · `generateStaticParams` prerenders `/en/null/` for locale-incomplete documents
      test: TDD · unit — same helper as above
- [x] 🟡 WARNING · fixed · `impl-review` · `tests/e2e/frontend.e2e.spec.ts:11` · the scaffold spec still asserts the homepage Phase 2 deleted — red, and typecheck/lint/build all passed over it
      test: TDD · e2e — this IS the test; retarget it at the catch-all
- [x] 🟡 WARNING · fixed · `code-review` · `src/collections/hooks/revalidatePage.ts:2` · `revalidatePath` throws outside a Next request scope, so any CLI write (seed script, `payload run`) aborts mid-way
      test: no automated test — guard is a try/catch, cheaper to eyeball
- [x] 🟡 WARNING · fixed · `code-review` · `src/collections/hooks/revalidatePage.ts:28` · moving `isHome` between pages never revalidates `/` — indexed URL #1 keeps serving the old page
      test: no automated test — live ISR cache
- [x] 🟡 WARNING · fixed · `code-review`,`impl-review` · `src/collections/Pages.ts:31` · the isHome guard's `limit: 1` can return the document being edited and miss a second home; it also cannot see drafts
      test: TDD · integration — assert a second home is rejected
- [x] 🟡 WARNING · fixed · `scatter` · `src/payload.config.ts:36` · the locale list is hand-copied instead of imported from `i18n.ts`, so the CMS and the app can desynchronise silently
      test: no automated test — the import IS the guarantee
- [x] 🟡 WARNING · fixed · `code-review`,`impl-review` · `src/app/(frontend)/[[...segments]]/page.tsx:73` · the 404 metadata title is hardcoded Polish on `/en/` paths, duplicating `common.notFoundTitle`
      test: no automated test — one string
- [x] 🔵 · fixed · `code-review` · `src/app/(frontend)/[[...segments]]/page.tsx:13` · three DB round trips per render (`generateMetadata` + component + `pathsForPage`); wrap in React `cache()`
- [x] 🔵 · fixed · `code-review` · `src/lib/routing.ts:11` · slugs are unvalidated free text; a slug with a space or `/` produces an unresolvable address
      test: TDD · integration — assert the field rejects a slash
- [x] 🔵 · fixed · `code-review` · `src/collections/Pages.ts:46` · the guard throws a bare `Error` (500 toast) instead of Payload's `APIError`
- [x] 🔵 · fixed · `code-review` · `src/lib/i18n/translations.ts:10` · the `?? defaultLocale` fallback is unreachable dead code
- [x] 🔵 · fixed · `code-review` · `src/components/LanguageSwitcher.tsx:22` · `aria-current="true"` should be `"page"`
- [x] fixed · `scatter`,`cohesion`,`impl-review` · `page.tsx:33` + `revalidatePage.ts:10` · "all paths for one document" implemented twice, with the two copies disagreeing on the partial-slug guard
- [x] fixed · `cohesion`,`structure` · `src/lib/i18n/hooks/use-translation.ts` · a `hooks/` directory holding one file, inside a 5-file module — flatten it
- [x] fixed · `cohesion` · `src/lib/i18n/{i18n,types,translations}.ts` · 33 lines across three files that share one reason to change — merge to one, keep the `'use client'` provider separate
- [x] fixed · `scatter` · `src/lib/routing.ts:35` · `localeFromPath` re-implements the prefix split `resolveSegments` already does
- [x] fixed · `comment-noise` · `src/app/(frontend)/[[...segments]]/page.tsx:30` · trim the sentence narrating what `locale: 'all'` does
- [x] fixed · `impl-review` · `plan.md:359` · progress boxes 2.1/2.2/4.1 ticked without commit shas

### Deferred — each needs a filed tracked issue before its box can check

- [ ] 🟡 WARNING · deferred · `code-review`,`impl-review` · `src/migrations/20260903_121437_pages.ts:57` · `slug` is indexed but not unique per locale, and `is_home` has no partial unique index — the app-level guards have no DB backing. Needs its own migration, which a human applies to prod
      test: TDD · integration — travels with the fix
- [ ] deferred · `code-review`,`impl-review` · `src/app/(frontend)/not-found.tsx:12` · the 404 sniffs the locale from `usePathname`, so the prerendered shell is Polish for `/en/` and hydration swaps it. Same routing decision as the root layout's hardcoded `lang="en"` — both need a locale a catch-all layout cannot see
      test: TDD · e2e — travels with the fix
- [ ] deferred · `code-review`,`impl-review` · `src/app/(frontend)/[[...segments]]/page.tsx:65` · no `alternates.canonical` / hreflang, and `generateMetadata` reads no seoPlugin fields — the plugin is not installed yet
- [ ] deferred · `code-review`,`scatter` · `next.config.ts:15` · `/en/home/` is hardcoded in the redirect while the EN home slug is a CMS-editable field; renaming it silently breaks an indexed redirect

- [x] fixed · `simplify` · `src/lib/pages.ts:33` · `pathsForPage(payload, id)` made the route re-resolve `getPayload` just to hand a client back — now `pathsForPage(id, client?)`, hooks still pass `req.payload` for the transaction
- [x] fixed · `simplify` · `src/collections/hooks/revalidatePage.ts:20` · `Parameters<typeof pathsForPage>[0]` indirection replaced with a direct `Payload` import

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
- `pnpm test:e2e` — **not run**: needs the dev server up. Owed before archive.
