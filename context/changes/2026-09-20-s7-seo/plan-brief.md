---
change_id: s7-seo
kind: plan-brief
updated: 2026-09-20
---

# s7-seo — brief

**What.** The site emits a title and a canonical and nothing else. Add descriptions, `openGraph` /
`twitter`, an icon, a sitemap and `Organization` JSON-LD. Lighthouse SEO is 61 on all eight measured
pages; `meta-description` is the only failing audit in that score that is ours.

**The discovery that shapes it.** `meta.title` / `meta.description` / `meta.image` already exist in
production, localized, on pages, projects and interior styles — migration
`20260904_171708_seo_meta_and_slug_unique.ts`, plugin wired at `payload.config.ts:89`. They are never
read. **No schema change in this slice.** Nothing for `pnpm db:migrate:prod`.

**Owner's decisions.** Population by a one-off script against production, after `pnpm db:dump`. All
four surfaces in scope. **Nobody writes a description per project or per style** — those derive from
copy the documents already carry. A `SiteSettings` global for a site-wide fallback was considered and
dropped; with pages authored and children derived, it would never have rendered.

**What `plugin-seo` does and does not give you.** Its `generateDescription` is an admin
"Auto-generate" button — nothing fills an empty field on save, nothing runs at render. Reading
`doc.meta` into `generateMetadata` is always yours.

**Phases.**

1. `generateMetadata` reads `meta.*`. Pages use authored copy; **children derive theirs** from
   `Projects.summary` / `InteriorStyles.text` — both `required` and `localized`, both already
   one-sentence blurbs, so every published child has a PL and an EN description with no editing at
   all. `meta.description` stays on those collections as an override nobody is expected to use.
   Children need `PageChildT` widened; `toProject` / `toInteriorStyle` currently drop `meta`.
2. `openGraph` + `twitter` from the same source, with `src/app/opengraph-image.png` as the default,
   plus `src/app/icon.svg` — which kills the `/favicon.ico` 404 behind Best Practices 96.
3. `src/app/sitemap.ts` — both locales, hreflang pairs, trailing slashes, reusing the enumeration
   lifted out of `generateStaticParams`.
4. `Organization` JSON-LD — phone/mail from the footer global, address + NIP from the contact page.
5. Copy drafts for the **six page types only**, then the populate script — which touches the `pages`
   collection and nothing else. **Only on the owner's go-ahead. The one production write.**

**Ceiling.** SEO cannot hit 100 on this deployment — `is-crawlable` fails by design while
`robots.ts` and the layout's `robots` key hold the pre-cutover noindex. Measure the rest on a local
production build with those lifted; do not delete them to chase the number.

**Weak source.** The WordPress harvest is thinner than assumed: 2 of 12 descriptions are
hand-written, 3 are duplicates of the home one, 6 are AIOSEO body-extracts (one contains "Please
enable JavaScript in your browser to complete this form"), 1 is empty. The page copy is authored, not
carried over.

Full plan → `plan.md`. Harvest → `live-seo-harvest.md`.
