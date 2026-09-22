# Performance audit — 2026-09-22 (EX-842)

One measured pass over image loading, data fetching and caching, against production
(`wykonczymylanding26.vercel.app`, deployment `dpl_Auyw7E7tkxXwSVq6T2WNxZHEqk2W`).

**Outcome: one fix, everything else measured and deliberately left alone.** The audit's premise —
that the site is already fast and the job is to confirm it — held. The one thing that was actually
broken was a cache-invalidation hole, not a byte count.

## Baseline

Real-browser numbers, cold browser cache per row, Chromium via Playwright:

| viewport | path | LCP | TTFB | optimizer reqs | image KB | total KB |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| mobile 390 | `/` | 576 ms | 34 ms | 7 | 272 | 977 |
| mobile 390 | `/realizacje/kiwi-8/` | 380 ms | 31 ms | 6 | 167 | 872 |
| mobile 390 | `/wykonczenia/boho/` | 1084 ms | 34 ms | 10 | 459 | 1164 |
| desktop 1440 | `/` | 456 ms | 55 ms | 8 | 558 | 1292 |
| desktop 1440 | `/realizacje/kiwi-8/` | 464 ms | 31 ms | 6 | 408 | 1145 |
| desktop 1440 | `/wykonczenia/boho/` | 424 ms | 31 ms | 6 | 531 | 1264 |

Unthrottled, from a machine near the `arn1` region. These are the best case and are useful as a
relative baseline for a future pass, not as a field metric. Every LCP is an order of magnitude
inside the 2.5 s threshold, which is the reason nothing below was worth trading complexity for.

## 1. Image loading

- **`sizes` vs. Next's generated widths — left alone.** The fixed-px caps do round up to the next
  default breakpoint, and in pixel area the overshoot is 37–109%. In bytes it is **+7%**: 1886 KB
  served against 1768 KB ideal across the home page, because the source widths cap most requests
  before the ladder does. Declaring `deviceSizes`/`imageSizes` would buy ~118 KB spread over a
  whole page load and would put a second breakpoint ladder in the repo to keep in step with the
  Tailwind one. Not worth it.
- **`srcSet` markup weight — not a finding.** 36.6 KB raw, 14% of the 255.4 KB document, but
  **2.3 KB after compression**. The measurement that made it look like a problem was the wrong one.
- **`quality={90}` — out of scope by owner decision.** The photos are the product; quality is not a
  lever on this project. The dead `75` entry in `next.config.ts` `qualities` stays, because the
  optimizer rejects any quality not listed and a one-entry list is a worse guard than a two-entry
  one.
- **Optimizer source path (`/api/media/file/**`) — left alone.** Cold miss 0.28–0.76 s TTFB, warm
  HIT 0.13–0.18 s, and the Payload route already answers `cache-control: public, max-age=31536000`,
  which the optimizer inherits. Pointing `src` at the blob URL would save the hop only on a miss,
  and misses are rare enough not to pay for bypassing Payload's access control.
- **`placeholder`/blur — decided against, not overlooked.** The CMS produces no blur data, so
  wiring it means either a build step or a new field on every media row. The LCP image is
  preloaded and lands in under 600 ms; blur buys a perceptual bridge across a gap that is not
  there, at the cost of inline base64 in every document.
- **`preload` audit — correct as built.** Exactly one `<link rel="preload" as="image">` per
  document, on the hero. The two carousel first slides are `loading: 'eager'` with
  `fetchPriority: 'low'` (`src/lib/carousel-loading.ts`) — they start early without bidding against
  the LCP candidate. Both logo marks are `fetchPriority="high"` on purpose: they are
  `display: none` at one breakpoint each, and a lazy image's intersection observer never fires on a
  hidden element.
- **Carousels and lightbox — no eager off-screen loads.** `lazyPreloadPrevNext: 1` with
  `loop: true` (`src/lib/carousel.ts`); the lightbox mounts its images on open.

## 2. Data fetching

- **`depth` is already minimal.** `depth: 1` on the listing finders populates exactly the media rows
  the cards render; the finders that need no media use `depth: 0`.
- **`cache()` on every finder** collapses the repeat asks that layout, `generateMetadata` and the
  page each make within one render. Worth stating plainly: **this only matters at build time.** Every
  public address prerenders, so a visitor never reaches the database at all — the query count per
  render is a build cost, not a request cost.
- **`findChildren` reading the whole collection** is fine at 6 projects and 13 styles. It stops
  being fine somewhere in the high hundreds, and it is a build-time cost even then.
- **`dynamicParams = true` on unknown paths — cannot be turned into load.** First hit 2.95 s (of
  which ~1.7 s is the Neon cold start), warm 1.26–1.33 s, and **0.11 s on a repeat of the same path**
  because the 404 edge-caches. A crawler walking garbage URLs pays once per distinct path and
  never twice.

## 3. Caching

- **There is no time-based revalidation anywhere, and that is the intended design.** No
  `export const revalidate`, no `'use cache'`, no `cacheLife`, no `unstable_cache`, no
  `fetch(…, { next: { revalidate } })`. Payload is read through the Local API, not `fetch`, so
  nothing introduces it indirectly. Pages are prerendered at build and live until something
  explicitly purges them: a Payload write, or a deploy.
- **All twelve addresses genuinely serve prerendered.** Every one answers `x-nextjs-prerender: 1`
  with `x-vercel-cache: HIT` (or `PRERENDER` on the first hit at a given POP). Nothing has quietly
  opted into dynamic rendering, so the CMS-owned-slug decision in `tech-stack.md` still rests on
  what it was built on.
- **`cache-control: public, max-age=0, must-revalidate` on HTML is correct, not a miss.** The
  browser re-asks every time and the edge answers from cache or 304s off the etag. That is the price
  of a cache bust from the admin taking effect immediately; an hour of `max-age` would put an hour
  between an editor's save and the visitor seeing it.
- **`revalidateAllPages()` purging the whole site is the right call at this size.** The cost is one
  cold render per address on its next request. Per-path revalidation would have to model the fact
  that one page answers at two addresses, that slugs are editable, and that the home type moves `/`
  between documents — three ways to leave an address stale for a saving measured in hundreds of
  milliseconds, once.
- **`'use cache'` — not adopted.** Nothing measured here is a dynamic path worth caching.

### Images survive a deploy at the edge and do not survive it in the browser

The optimizer answers `cache-control: public, max-age=31536000` — the maximum in practice — and its
cache key **excludes** the `dpl` parameter. Proven directly: a request for a never-before-seen width
with **no `dpl`** returned `MISS` and created the entry, and the same URL **with the current `dpl`**
then returned `HIT` off that entry. A deploy therefore re-optimizes nothing.

The browser is a different story. Every `srcset` in the HTML carries `&dpl=<deployment id>`, and
that id is unique per deployment (checked against `vercel inspect` across three deploys). Measured
in Chromium on the live home page:

| | requests | transfer |
| --- | ---: | ---: |
| first visit | 8 | 1299 KB |
| reload, same `dpl` | 8 | **0 KB** (7/8 from disk) |
| same images, changed `dpl` | 5 | **1060 KB** |

Within a deployment the browser cache is perfect. After a deploy, a returning visitor re-downloads
every image — from the edge, not from sharp, but re-downloads them.

The source is Skew Protection, on at `skewProtectionMaxAge: 43200` (12 h), which is what sets
`NEXT_DEPLOYMENT_ID` and makes Next append `?dpl=`. Two things are worth recording precisely,
because both are easy to get backwards:

- **All 311 `dpl` occurrences in the home document are on image URLs; zero are on JS or CSS.** Those
  live under `/_next/static/immutable/`, which Next deliberately exempts — their filenames are
  already content-hashed.
- **Skew protection does not travel in the image URLs.** The RSC and Server Action requests carry the
  deployment id in an `x-deployment-id` header
  (`router-reducer/reducers/server-action-reducer.js`, `fetch-server-response.js`). So the
  protection that matters here — a tab open across a deploy still being able to submit the contact
  form, which is the one path this site exists for — does not depend on `dpl` reaching an image.

**Left alone anyway.** Turning Skew Protection off would buy the image win and cost the Server
Action protection: a bad trade, since the loss is a lead. Keeping it on and stripping `dpl` from
images only is possible and costs nothing in protection — `images.loaderFile` bypasses the append,
which happens only in the default loader (`shared/lib/image-loader.js`) — but it means hand-writing
the optimizer URL shape and owning it across Next upgrades, to save 1.3 MB for a returning visitor
on deploy days. Content ships through the CMS, not through deploys, so after cutover those days are
rare. Revisit only if deploy frequency stays high.

## The one fix

**`Media` had no revalidation hook.** `Pages`, `Projects`, `InteriorStyles` and the `Footer` global
all purge on write; `Media` did not. Its `alt` is localized, `required` and rendered into every
page, and replacing an upload changes the file URL — neither reached a visitor until some unrelated
edit or a deploy happened to revalidate. Fixed in `c3c06c7`: `revalidateMedia` in
`src/collections/hooks/revalidatePage.ts`, wired in `src/collections/Media.ts`. It needs its own
hook because `revalidatePage` gates on `_status`, which an upload collection does not have.

## Not measured

- **Lighthouse was not run.** The numbers above come from real-browser `PerformanceObserver` and
  resource timings instead, which answer what the issue asked for (LCP, image bytes, optimizer
  request count) without a synthetic score on top.
- **A React hydration error (#418) was observed once** on `/wykonczenia/boho/` and did not reproduce
  across roughly a dozen subsequent loads of the same page under the same conditions. Recorded
  rather than filed, because one unreproducible sighting is not a finding. Worth a second look if it
  appears again.
