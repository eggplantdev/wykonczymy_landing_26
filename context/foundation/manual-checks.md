# Manual checks

Human-only verification owed by a slice before it can move past `In Review`. An agent cannot
tick a box here — each one needs a browser, the admin UI, or production.

## F2 — i18n spine (2026-09-03)

Local, against `pnpm dev` with the two seeded Pages documents:

- [ ] `/` renders the home document; `/oferta/` renders Oferta.
- [ ] `/en/home/` and `/en/offer/` render the same two documents in English.
- [ ] `/oferta` (no trailing slash) 308s to `/oferta/` rather than 404ing.
- [ ] `/en` 301s to `/en/home/`.
- [ ] A slug that exists in neither locale renders the 404 page, and the 404 under `/en/…`
      shows English copy while the 404 under `/…` shows Polish.
- [ ] The language switcher on `/oferta/` links to `/en/offer/` and back.
- [ ] Creating a second Pages document with `isHome` checked is rejected in the admin.
- [ ] Editing a published page's title in the admin updates **both** addresses without a
      redeploy (the revalidation hook), including the locale that was not edited.
- [ ] Renaming a slug leaves the old address 404ing, not serving stale content.

Before cutover, the twelve addresses in `url-map.md` get walked in full — that is S8's gate,
not F2's.
