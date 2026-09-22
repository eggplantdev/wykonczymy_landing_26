# Review-gate ledger — whole-repo · 2026-09-19

Scope: the entire repo (`src/` application code, `tests/`, `scripts/`, `tools/`, root config).
Excluded: `src/payload-types.ts`, `src/migrations/*` (generated), `node_modules`, `.next`.
Trigger: owner asked for a repo-wide gate before the codebase grows.

Fan-out (6 read-only agents, parallel): code-review · tailwind-v4-audit · feature-first-structure ·
module-cohesion-audit · structure-scatter-audit · comment-noise-audit.
`/10x-impl-review` dropped out — no single slice under review.

Baseline before any mutation: `pnpm typecheck` green, `pnpm lint` green.

**Reliability note.** The comment-noise agent reported a working-tree state that was false
(`hero.tsx` + `motion.ts` modified; actually `site-footer.tsx` + `payload-types.ts`) and attributed
decisions to a commit that does not exist in this session. Its *checkable* claims were re-verified
by hand before being admitted below; its unverifiable narrative was discarded.

## Findings

**Trimmed at archive (2026-09-22).** The pre-trim tally was **24 fixed, 13 dismissed, 3 dropped, 12 skipped, 2 filed · 0 open** across 54 findings. Every `fixed` finding was removed: its durable record is the
commit that fixed it, and the fix is now just the code. What survives below is the negative
space git cannot hold — what was looked at and deliberately *not* changed, and why.

### Filed — real, out of scope to fix here, tracked in Linear

- [x] 🔴 CRITICAL · filed EX-815 · `tests/helpers/seedUser.ts:26` · `pnpm test` seeds a full-CRUD admin (`dev@payloadcms.com` / `test`) into the **production** database — verified `POSTGRES_URL` and `PROD_POSTGRES_URL` resolve to the identical Neon host `ep-lively-bar-b15zrnqr`. `cleanupTestUser` is in `afterAll`, which does not run on SIGINT or a `beforeAll` timeout, so the row can persist. Not auto-fixed: the obvious guard (refuse a non-local host) would make `test:e2e` fail outright under the documented one-database setup — that trade is the owner's infra call, not mine. Filed with the three options costed — https://linear.app/ex-plant/issue/EX-815
      test: no automated test · — the guard is itself the assertion
- [x] 🔴 CRITICAL · filed EX-815 · `tests/int/{pages,projects}.int.spec.ts` · the integration suite creates and deletes rows in production, including a **published** project on `/realizacje/`. `pages.int.spec.ts:26` records in its own comment that a leaked draft already broke the suite once. Same root cause and same owner's-call as above; covered by the same issue, EX-815.
      test: no automated test · — a startup guard is the assertion

### Dismissed / dropped

- [x] dismissed · tailwind · 0 hits for `var(--x)` in arbitrary classes and 0 for unscannable dynamic class names, repo-wide. The two-tier `--wk-*` → `@theme` indirection holds.
- [x] dismissed · tailwind · 5 of 7 inline `style` attributes are runtime-computed (`MotionValue`s, CMS focal points, a continuous star-rating percentage) — no utility exists.
- [x] dismissed · module-cohesion · `contact-form.tsx` (201), `[[...segments]]/page.tsx` (198), `home-group.ts` (155), `board.tsx` (154), `home.ts` (130), `hero.tsx` (116), `site-nav.tsx` (112) all read and verified cohesive. No file in the repo exceeds 201 lines; the size heuristic never fires.
- [x] dismissed · scatter · no `utils.ts`/`helpers.ts`/`constants.ts`/`types/` catch-all exists anywhere. All 14 flat `lib/` modules are named single concerns.
- [x] dismissed · scatter · one carousel abstraction, not five — all 5 sections import `carouselDefaults` + `useCarouselReady` from `lib/carousel.ts`, all chrome from `ui/carousel-*`.
- [x] dismissed · scatter · the icon layering (`lib/fontawesome` side effect / `lib/*-icons` registries / feature resolvers / `ui/icons` hand-drawn marks) is coherent and matches the stated `AGENTS.md` convention.
- [x] dismissed · code-review · every `next/image` `sizes` prop checked against its rendered width per breakpoint; no stale or inverted value.
- [x] dismissed · code-review · ~12 further candidates re-read and dropped for want of a constructible failure (`revalidateAllPages` try/catch, `relatedStyles` clamping, `mobile-menu` render-time setState, lightbox focus restore, `pathsForPage`'s `locale: 'all'` cast, `sessionStorage` under SSR, partial Payload `access` blocks).
- [x] dropped · dead-code · 19 symbols exported but referenced only inside their own file. Narrowing them to module-private is 19 edits across 19 files that change nothing a reader or the compiler can act on; `export` on a one-consumer symbol is not a defect here.
- [x] dismissed · simplify/altitude · `src/components/cookies/consent-provider.tsx:28` · the gate's own earlier finding — `colorScheme: 'light'` pinning the banner light on a dark-mode page — is a **false positive**. `setupColorScheme('light')` in `@c15t/ui/dist/utils/dom.js` does one thing: removes a `c15t-dark` class, which only selects `.c15t-theme-root` — c15t's own rendered components. Every import in `src/components/cookies/` is from `@c15t/nextjs/headless`; the banner and the preferences dialog are this site's own markup on its own tokens, which already follow `data-theme`. The unpinned default is inert too: its MutationObserver watches for a `dark` **class** on `<html>` while `ThemeProvider` writes `data-theme`. Comment corrected to say this; nothing to fix.
- [x] dismissed · simplify · `src/components/footer/contact-form/field-control-classes.ts:8` · "the `cn()` only concatenates, make it a plain string". It does — the two literals share no conflicting utility group. But `cn` is in `eslint-plugin-better-tailwindcss`'s default `callees`, and `fieldControlClasses` matches none of its `variables` patterns, so a plain constant silently drops those two lines out of the class-validity linting this repo installed the plugin for (`mb-` and `text-hero-lg` both shipped and compiled to nothing). The call stays.
- [x] dismissed · reuse · the four-way `contact-form-field.tsx` split · each new module checked against the shared homes: `fieldControlClasses`' class string appears nowhere else, `ui/button.tsx` has no input-side equivalent, `FieldError` is the only `aria-live` field error in the repo, `useFieldIds` the only `useId` wrapper. `ContactFormCheckbox` cannot call `ContactFormField` — that emits a `<label htmlFor>` and `ui/checkbox.tsx` is itself a `<label>`. Correctly not reused.
- [x] dismissed · reuse-scan · the whole diff · catalogued the exported surface of the three primitive homes in `.reuse-scan.json` (`components/ui`, `components/media`, `lib/**`) and matched every new symbol against it. No reinvention: the class-string family in `ui/` is `buttonClasses` / `buttonLabelClasses` / `segmentClasses`, all button-side, none an input control set; there is no error-message component and no `useId` wrapper anywhere; `SpecStrip` (key-over-value cells) and `SpecTable` (ruled two-column list) are genuinely different renders of the same `SpecItemT[]`. The diff's one intra-diff repetition — the three copies of the production guard — is what the `(lab)` route group replaced (that finding is trimmed at archive; the convention it produced is in `AGENTS.md`).
- [x] dismissed · efficiency · the whole diff · no waste introduced. `.max()` and `.trim()` resolve to the same `zod/v4/core` module and the same `ZodString` prototype, so the client bundle is unchanged from the 913,397-byte figure the file's own comment records; the four-way split is bundle-neutral (all six files land in the same footer chunk) and `contact-form-checkbox.tsx` now imports strictly less; both renames are byte-identical with no `'use client'` or `server-only` crossing a boundary.
- [x] dropped · `.gitignore` · trailing `.env*` duplicates the block at the top; `git check-ignore` confirms `.env.example` is still tracked correctly. Cosmetic.
- [x] dropped · comment-noise · ~347 of 447 comment blocks carry real rationale and stay. The audit's proposed "trims" were rejected wholesale — cutting the rejected-alternative clause is exactly the de-fanged narration the strip test forbids.

### Skipped — real, deliberately not fixed in this gate

- [x] 🔴 CRITICAL · skipped · `src/lib/contact/submit-contact-form.ts:18` · the action validates, discards, and returns `{ ok: true }`; the UI then clears the draft and announces success. This is the known no-sink state — `context/changes/2026-09-18-lead-delivery/` is exactly this work, and the site is not published. Tracked there, not re-filed.
      test: TDD · integration — travels with the lead-delivery change
- [x] 🟡 WARNING · skipped · `submit-contact-form.ts:7` · no rate limit, honeypot or bot guard on a public server action. Must ship in the *same* change as the sink, not after it — recorded on the lead-delivery change rather than fixed against a no-op endpoint.
      test: TDD · integration — travels with the lead-delivery change
- [x] 🟡 WARNING · skipped · `contact-form-attachments.tsx:54` · selected files are displayed and then dropped; the input is not a `form.Field` and `preventDefault` means no `FormData` is ever built. This is FR-031, blocked on work in the leads-app repo this project does not own. Roadmap slice S6.
      test: TDD · e2e — travels with S6
- [x] 🟡 WARNING · skipped · `src/app/(frontend)/layout.tsx:35` · `<html lang="pl">` is hardcoded, so all six `/en/` addresses declare English copy as Polish. The fix needs the locale in a real route segment or a middleware rewrite — a routing change, not a one-liner, and the file's own comment already records the trade. Roadmap slice S7 (SEO surface).
      test: TDD · e2e — assert `documentElement.lang` from the server response
- [x] 🔵 OBSERVATION · skipped · `lib/content/{projects,interior-styles}.ts` · hard `limit: 100` truncates silently — a 101st published project vanishes from its listing and 404s at its own address. Distant for this site; the fix (page through, or throw on `totalDocs >` limit) is behaviour-changing and wants its own decision.
      test: no automated test · — 101 fixtures against the shared DB cost more than they return
- [x] skipped · feature-first + scatter · `src/components/media/types.ts` · 17 importers, no owning component, and `lib/content/media.ts` imports the type it produces — so the data layer depends on the UI layer. Both structural agents independently flagged it as the one real layer inversion. Deliberately left: it is a 17-file type-only refactor that deserves its own review, not a drive-by in a gate this wide.
- [x] skipped · altitude · `src/components/footer/contact-form/` · the four-way split fixed the packaging, not the coupling: three siblings each restate the same `useFieldIds` → `aria-describedby` / `aria-invalid` → `FieldError` wiring, and `ContactFormCheckbox` has already drifted (no `<label>`/`sr-only` span, a hand-tuned `left-6.5` to re-align an error it positions itself). The deeper fix is `ContactFormField` owning the wiring and yielding it to a render-prop child. Real, but a behaviour-and-visual restructure of all three controls — its own review, not a drive-by.
- [x] skipped · module-cohesion · `ui/button.tsx` · `buttonClasses`/`buttonLabelClasses` are consumed by 5 files that never render `Button`. Real pull toward a `button-classes.ts`, but the co-location is a documented decision and the split touches 6 import sites.
- [x] skipped · scatter/cohesion · `hero-lab/variants.tsx` (5 components in one file), `hero-lab/hero-frame.tsx` (4 exports, 4 kinds), `lib/motion.ts`'s hero-only constants, `lib/routing.ts`'s page-type vocabulary, `components/layout/`'s 16 flat files, and a `(lab)` route group for the three dev surfaces. All real, all judgement-weight refactors; none is a defect.
- [x] skipped · tailwind · `src/app/(frontend)/page-board/` · `text-xl` renders at 40px and `text-sm` at 12px because `styles.css` replaces Tailwind's `--text-*` scale. Real, but snapping to the numeric scale is a blind visual change to a dev surface I cannot see — needs eyes, not a guess.
- [x] skipped · tailwind · one `--container-prose` token to reconcile `18ch`/`62ch`/`68ch` across 4 files. Genuine, but picking the measure is a design call and 13 of the 21 arbitrary-value hits are dev-tool-only.
- [x] skipped · tailwind · `menu-toggle.tsx:63` inline `transitionDuration` → `duration-520`/`duration-820` classes. Needs confirming Tailwind 4 emits bare numeric durations from the theme; not worth the risk against a working animation.

## Simplify pass

Ran `/simplify` over the gate's own working-tree diff — four agents (reuse · simplification ·
efficiency · altitude) in parallel, then applied serially. **10 applied, 0 proposed, 5 dismissed,
1 skipped**; every finding is folded into `## Findings` above, tagged `simplify` / `reuse` /
`efficiency` / `altitude`. No second report file — this ledger is the only record.

Three of the ten were defects in **this gate's own earlier fixes**, which is the argument for the
step running unconditionally: the `email` field left uncapped by the cap fix, an `api.int.spec.ts`
assertion that could never have run, and a `next.config.ts` comment corrected to a second false
statement. A fourth reversed an open finding outright — the cookie-banner `colorScheme` warning
turned out to be traceably inert.

## Tests & suite

| Leg | Result |
| --- | --- |
| `pnpm typecheck` | green (after clearing a stale `.next/types/validator.ts` left by the route move) |
| `pnpm lint` | green |
| `pnpm test:int` — `tests/unit/**` + `tests/int/api.int.spec.ts` | **53 passed**, from 12 at the start of the gate |
| `pnpm build` | green — 51 pages; `/hero-lab`, `/footer-lab`, `/page-board` still resolve at their old addresses, which is the proof the `(lab)` route group is URL-transparent |
| `pnpm test:int` — the rest of `tests/int/` | **not run** |
| `pnpm test:e2e` | **not run** |

The two unrun legs are EX-815: both create and delete rows in the production database, so
running them to close this gate would have been the gate committing the defect it filed. The
legs that were run are exactly the ones that touch production read-only or not at all.

Tests authored in this gate, all in `tests/unit/contact-schema.spec.ts`:
- the `CAPS` table — one case per string field, each asserting its own ceiling
- `caps every string field the schema carries` — walks `emptyContactValues()` so a newly added
  field that nobody capped is a red test rather than an unbounded public endpoint
- `tests/int/api.int.spec.ts` replaced a vacuous `toBeDefined()` with the access rule that can
  actually break
