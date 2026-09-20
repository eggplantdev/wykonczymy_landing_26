---
change_id: s7-seo
title: SEO surface — read the seoPlugin fields, add openGraph, sitemap and JSON-LD
status: implementing
created: 2026-09-20
updated: 2026-09-20
archived_at: null
branch: s7-seo
worktree: null
---

## Notes

Read the already-modelled seoPlugin fields in `generateMetadata`, add a site-wide fallback
description for pages that have none, emit openGraph/twitter, and ship a sitemap. Driven by a
Lighthouse baseline: SEO 61 on all eight measured pages, of which `meta-description` is the only
audit that is ours to fix (`is-crawlable` is the deliberate pre-cutover noindex guardrail).

Discovery that shapes the slice: `meta.title` / `meta.description` / `meta.image` already exist,
localized, in production — `20260904_171708_seo_meta_and_slug_unique.ts` added them to every
`*_locales` table and `payload.config.ts:89` wires the plugin into pages, interior-styles and
projects. They are simply never read. **This slice has no schema change.** Descriptions are authored
for the six page types only; projects and interior styles derive theirs from `summary` / `text`,
which are already required, localized, one-sentence blurbs — nobody maintains a second description
per item. A `SiteSettings` global for a site-wide fallback was considered and dropped: with pages
authored and children derived, it would never have rendered.

Live-site crawl (2026-09-20, all twelve indexed addresses) as a copy source: only `/` and
`/oferta/` carry hand-written descriptions; three are verbatim duplicates of the home one, six are
All-in-One-SEO auto-extracts from the first body paragraph (one includes "Please enable JavaScript
in your browser to complete this form"), and `/en/completed-works/` has none. `og:image` is
`cropped-favicon.png` on every page. Harvest in `live-seo-harvest.md`.
