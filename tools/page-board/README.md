# Page board

A visual inventory of every route the **tdg** reference repo serves, captured full length at three
breakpoints and served from this app at `/page-board/`. It is the working surface for deciding
which of those pages carry across to this site.

The board is `noindex` and is not one of the twelve addresses in
`@context/foundation/url-map.md`.

## Viewing

`pnpm dev`, then `/page-board/`. Nothing else has to be running — tdg is needed to _make_ the
captures, never to look at them.

## Rebuilding — the cheap path first

Full-resolution captures live in the gitignored `.shots/`. As long as they are there, changing how
the board looks or how the images are encoded is a one-minute job:

```sh
pnpm board:build
```

Only re-shoot when the captures are gone or tdg itself changed — that part takes about half an hour.
tdg renders entirely from the static fixtures in its `utils/temp/*`, so no WordPress backend and no
database are involved.

```sh
# 1. in /workspace/_old_repos/tdg — note the port it picks
npm run dev

# 2. here
pnpm exec playwright install chromium   # first time only
BASE=http://localhost:3002 pnpm board   # capture, then build
```

- **`capture.mjs`** reads the route list off tdg's own `/all-pages` index — add a route there and it
  appears here — then screenshots each route at each viewport in `VIEWPORTS`, scrolling top to
  bottom first so tdg's scroll-triggered gsap reveals have fired.
- **`build.mjs`** downsizes the captures into `public/page-board/` and regenerates
  `src/app/(frontend)/page-board/manifest.ts`.

Neither `.shots/` nor `public/page-board/` is committed — the board is a local tool. The shareable
copy is the published artifact.

## tdg is read-only

Nothing here writes to tdg. It is reached over HTTP through `BASE` and nothing else.
