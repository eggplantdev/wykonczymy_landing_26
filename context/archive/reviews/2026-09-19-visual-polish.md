# Review-gate ledger — visual polish on `main` · 2026-09-19

Third gate on this tree today. The first two (`main.md` 10:03, `2026-09-19-main.md` 10:31) and
mine (`design-tokens-dark-mode-settings.md` 12:53) all closed against earlier states of it.

Unit of work: the uncommitted working tree vs HEAD `5ec3a8c` — 36 modified + 1 untracked path.
Only **32 files / 227+ / 139-** are hand-written; `src/payload-types.ts` and the three
`src/migrations/*.json` are ~1500 lines of generated + prettier churn and are excluded from
review (they are still in the tree and still need a commit decision).

Shape of the slice: hero sizing and scrim, two new button variants (`solid` / `ghost`), the
phone mark swapped to Font Awesome with a ringing keyframe, carousel arrow gaps tightened to a
single value, the footer's bottom band regrouped, an error state on the checkbox, field errors
taken out of flow, and the interior-style cards resized.

**Concurrency hazard.** `nav-group.tsx` was written at **15:27**, the minute this gate opened,
and 25 of the 32 files are newer than the last gate. A second agent is live in this tree. The
diff was snapshotted to the scratchpad at `base.sha` = HEAD so the read-only fan-out reviewed a
stable target. The mutating pass was held, then released on the owner's explicit go-ahead — see
`## Simplify pass` for the mitigations used in place of a quiet tree.

Fan-out: `/code-review`, `tailwind-v4-audit`, `feature-first-structure`, `module-cohesion-audit`,
`structure-scatter-audit`, `comment-noise-audit` (flag-only).
Dropped: `10x-impl-review` — no `plan.md` anchors this work (`s2-contact-form` is `implemented`
and its plan covers the form, not the hero or the buttons; `lead-delivery` is `new`).
Step 0.5 verification dropped: no `verify-manual-checks` skill installed, and browser automation
is off unless asked.

Baseline: `pnpm typecheck` clean, `eslint src --max-warnings=0` clean.

## Findings

**Trimmed at archive (2026-09-22).** The pre-trim tally was **28 fixed, 5 dismissed, 1 dropped, 1 skipped · 0 open** across 35 findings. Every `fixed` finding was removed: its durable record is the
commit that fixed it, and the fix is now just the code. What survives below is the negative
space git cannot hold — what was looked at and deliberately *not* changed, and why.

<!-- [box] · [severity, bug-finding checks only] · disposition · `source` · `file:line` · what — why
     Most-severe first; open [ ] boxes surface within their tier. Structural/style findings carry no severity. -->

### 🔴

- [x] 🔴 · **dismissed on evidence, then resolved** · `main-thread` + `structure-scatter` ·
      `src/components/footer/site-footer.tsx:12` · I reported the privacy-policy link as gone from
      every page. **The premise was wrong** — `SiteFooter` renders `ContactForm` on every page, and
      the consent checkbox's label carries `<Link href={privacyPolicyHref} target="_blank">`
      (`consent-label.tsx:28`), fed the same `typePaths[PRIVACY_POLICY_PAGE_TYPE]` `LegalLinks`
      used. That path is persistent, unlike `CookieBanner`, which stops rendering once consent is
      given. So the site never lost its policy link; it lost a *second* one.
      Owner's call, given that: **delete `legal-links.tsx`** (below). Worth knowing the surviving
      link is body-size text inside a checkbox label that opens a new tab — reachable, but not a
      footer-style standing link, if that ever matters.
      test: no automated test · e2e — "every page exposes a link to the policy" is the assertion
      worth having, since the only remaining path is now incidental to the form.

### 🟡

- [x] 🟡 · **dismissed — already gone** · `tailwind-v4` · `src/components/home/hero.tsx:49` ·
      `shadow-lg` on the CTA, same hardcoded black, fighting the button's own `bg-foreground`.
      Owner asked for it removed; `grep -n shadow src/components/home/hero.tsx` shows the file no
      longer contains it — the **second session had already deleted it** between the fan-out
      snapshot and now, leaving the `<ButtonLink>` tag split across six lines where the prop used
      to be. Nothing to remove. I collapsed the orphaned tag so `prettier --check` passes; the
      finding itself was stale, not fixed by me.

### 🔵

- [x] 🔵 · **dismissed** · `code-review` ·
      `src/components/home/interior-styles/interior-style-slide.tsx:24` · the `sizes` reasoning is
      correct for the worst case, but every photo that is not ~2:1 — most of the twelve — now
      downloads roughly double the pixels it renders, resolved against `deviceSizes` past 1240px on
      a 2× screen.
      **Your call: keep it.** The trade is priced and accepted — one worst-case-correct `sizes`
      string, nothing upscales anywhere, and no per-photo derivation to keep in sync with twelve
      editable uploads. Bandwidth is the deliberate cost.
- [x] 🔵 · **skipped** · `tailwind-v4` · `src/components/interior-styles/style-card-body.tsx:29` ·
      `group-hover:bg-black/20` bypasses the role tier; `--wk-scrim` exists for exactly this, and
      `hero.tsx:28` in this same diff uses `bg-scrim/10`. Context line, not changed by the diff —
      and **you parked it explicitly in an earlier gate.** Left alone.
- [x] 🔵 · **dropped** · `code-review` · `src/components/home/services/service-slide.tsx:22` ·
      `max-w-sm mx-auto` (384px) never binds — at `slidesPerView: 4.6` / `spaceBetween: 56` the
      widest a slide reaches is ~340px even at the 1920px `max-w-site` cap. Real, but it is a
      harmless safety cap that costs one class and would bind again if the breakpoint config
      changed. Not worth the churn of removing, not worth a backlog entry.
- [x] 🔵 · **dismissed (my error)** · `main-thread` · `src/components/ui/button.tsx` · I logged
      `SOLID_SWAP` as a no-op. **Half wrong.** In `buttonClasses` the base is `duration-200`, so
      appending `duration-500` for `solid` genuinely overrode it — load-bearing. It was redundant
      only in `buttonLabelClasses`, whose base already reads `duration-500 delay-100`. Superseded
      by the open 🟡 desync finding, which is the real defect. (The constant itself is gone —
      see the `module-cohesion` line below.)

### Structural / style (no severity tier)

- [x] **dismissed** · `structure-scatter` ·
      `src/app/(frontend)/page-board/page.tsx` · **pre-existing, outside this diff.** Has the
      `robots` noindex but **no `NODE_ENV` gate**, unlike both labs — so it renders in production.
      **Your call: leave it.** `page-board` and both labs are temporary scaffolding that comes out
      when the port is finished, so gating one of them is churn on code with a known end date. The
      captures are gitignored, so what production serves is the empty state. Do not re-raise this
      in a later gate — it is decided, not skipped.

### Checked and clean

**Structure.** `next/image` `sizes` was updated in the same edit as the box resize, with the
object-cover reasoning written down — the global next/image rule is satisfied. No deep relative
imports introduced. All touched files kebab-case, all new types `T`-suffixed. No new home created
for anything. Contract types stay colocated. `CarouselNav` reuse in `interior-styles-carousel.tsx`
replaced a bespoke arrow pair with the existing `ui/` primitive — reuse in the right direction.
`@/lib/fontawesome` side-effect import present in all four FA consumers. `hero-lab/` is correctly
placed and properly gated (`page.tsx:22` has `if (NODE_ENV === 'production') notFound()` plus
`robots: { index: false }`, matching `footer-lab/`); its multi-kind files are left deliberately, a
lab route whose job is five variants side by side being one concern.

**Comments kept, survive the strip test untouched:** the rewritten `--text-hero` comment (and its
numbers were correctly updated alongside the value — no stale figures); `interior-style-slide.tsx:21`,
judged the most load-bearing added comment in the slice — without it a future editor following the
next/image rule would "correct" `sizes` down to the box width and blur the widest photos;
`interior-styles-carousel.tsx:50` (`CarouselNav` calls `useSwiper()`, so moving that `<div>` out of
`<Swiper>` silently kills the arrows); both `style-card-body.tsx` comments; `button.tsx:6`. Tally
7 deleted / 4 trimmed / 6 kept / 2 restores across 9 files — ratio 7:4, a passing audit, trim stayed
the exception. No directive comments (`eslint-disable`, `ts-expect-error`, pragmas) anywhere in the
diff, so nothing in scope risked a behaviour change.

**Tailwind.** `@keyframes ring` is correct and verified: nesting it inside `@theme` is exactly the
v4 idiom — with `animate-ring` in the candidate set it emits both the utility and the keyframes;
with an empty set the `@keyframes` count is **0**, correctly tree-shaken, which is the whole reason
v4 asks for the nesting. `motion-safe:animate-ring` emits under
`@media (prefers-reduced-motion: no-preference)`. Every spacing value in the diff is legal on v4's
dynamic scale — `w-108 h-100 h-76 min-h-8.5 left-6.5 px-4.5 px-14.5 gap-x-1.5 size-4.5` all emit,
and `min-h-8.5` = 34px matches its comment exactly. The two genuinely reverse-engineered values
(`w-64.25`, `h-45.5`) were removed by this diff — right direction. Zero `var(--x)` inside `[...]`,
zero inline `style={{}}`; the one arbitrary bracket (`max-w-[18ch]`) is unchanged, lab-only, and has
no `@theme` namespace to live in. All new colour work goes through the role tier.
`site-footer.tsx:38` previously read `mb-`, which compile confirms was **never a class** — a real
fix in this diff. `--text-hero` at 6.6vw is monotonic against `text-72` (95px vs 72px at `xl`), so
the scale does not invert. `Phone` losing its `color` prop is safe — its only consumer passes it
bare.

**Correctness.** Every `FieldError` consumer has a positioned ancestor — only three render paths
exist, and `ContactFormField`'s `className` goes to the *control*, not the wrapper, so a caller's
`pt-0` cannot clobber the `relative`. No clipping ancestor over the form (`PageWrapper`'s
`overflow-x-hidden` does not contain `SiteFooter`), and every block following a field carries a 32px
top gap, so a `top-full` message lands in reserved space; the longest error string (~135px) cannot
wrap even in a half-width column. **No variant/size/icon/disabled combination renders a control with
no height** — all 45 enumerated through the real `cn`. `ButtonLink`'s new optional `size?` passing
`undefined` is safe. The `container-end` grid stays centred with an empty third column
(`grid-cols-3` is `repeat(3, minmax(0,1fr))`, content-independent). `@keyframes ring` is emitted
even when *only* `motion-safe:animate-ring` is used, so the variant does not strand the keyframes.
`icons/phone.tsx`'s dropped `color` prop had no callers. `--animate-ring` being `infinite` is
acceptable under WCAG 2.2.2 because `motion-safe:` is the accepted mitigation.

## Concurrency log

- 15:27 `nav-group.tsx` — written as this gate opened.
- 15:29 `site-footer.tsx` — written mid-audit, after the snapshot. Drift is `lg:` -> `md:` on the
  dark band's grid and `gap-y-7` -> `gap-y-2`. Did not invalidate any finding.
- 15:35 `contact-form.tsx` — newly modified, `variant="solid"` added to the submit `Button`. The
  other session's work; **not touched by the simplify pass** and not reviewed above (it postdates
  the snapshot).

## Simplify pass

Ran `/simplify` — **28 applied, 0 proposed, 1 skipped, 1 dropped, 5
dismissed**, across 33 ledger lines covering 35 raw findings (two pairs were the same defect seen
by two checks and are merged). Every finding folded into `## Findings` above; there is no second
list.

Released to run on your "continue with simplify" after twice flagging the live second session.
Mitigations used instead of a quiet tree: the pre-pass diff was snapshotted to
`scratchpad/pre-simplify.diff`, every edit was a narrow `assert count == 1` string replacement
rather than a whole-file rewrite, and the two files the other session owns were handled by hand —
`site-footer.tsx` got three surgical edits (restore the grid comment, unwrap `cn()`, collapse the
re-wrapped `<footer>` tag) and `contact-form.tsx` was not opened at all.

Every held-back finding is a `[ ]` box above with the reason on the line. None were filed to Linear:
each one needs a decision from you rather than a ticket, and the gate would rather surface the
remaining open boxes than manufacture an issue apiece.

## Tests & suite

- `pnpm typecheck` — **clean**, run three times (gate open, after the fan-out, after the mutating
  pass).
- `eslint src --max-warnings=0` — **clean**, same three points, and **clean again after
  `eslint-plugin-better-tailwindcss` was added to the config** — the 7 errors it surfaced on first
  run are all fixed above. One transient failure mid-pass (`'cn' is defined but never used` in
  `site-footer.tsx`, caused by my own `cn()` unwrap) fixed by dropping the import.
- `prettier --check` on all 17 touched files — **clean**. One failure (`site-footer.tsx`, a
  `<footer>` tag my unwrap had left split across three lines) fixed by hand rather than
  `prettier --write`, to avoid reformatting the other session's in-flight edits in that file.
- Tailwind compile verification through the installed `tailwindcss@4.3.3` node API — all eleven
  changed/new candidates emit: `shadow-panel-sm`, `shadow-panel`, `invisible`, `visible`,
  `peer-focus-visible:outline-2`, `peer-focus-visible:outline-ring`, `md:col-start-3`,
  `lg:col-start-6`, `duration-500`, `motion-safe:animate-ring`, `text-hero`.
- `pnpm test` (vitest + playwright) — **not run.** The e2e leg needs the local Postgres stack up,
  and starting it while another agent owns the tree is its own hazard.

**No regression tests authored.** Every correctness finding fixed here carries a `test:` sub-line
above, and all of them read `no automated test`: four are focus-ring / grid-track / tab-order
facts that jsdom cannot observe and that need Playwright, which is off unless you ask; one is a
dev-only debug surface. The one genuinely cheap guard — a `buttonClasses` snapshot across the 45
variant×size×icon combinations, which would have caught the `px-0` bug outright — is noted on its
finding and is worth adding when `button.tsx` next gets a spec file.

**Archive status: CLEAR.** 0 open `[ ]` boxes — every finding reached a terminal resting place, and
nothing was filed to Linear: the one finding that looked like a filing turned out to be cheaper to
just do.

**Standing lesson from this gate:** do not do pixel reasoning against screenshots of the scaled
preview. Four consecutive wrong hero type sizes came from measuring a CTA pill 1:1 against a frame
that was rendering at roughly half scale.
