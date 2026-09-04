# tdg port — open items

Running list for the component port. Not a `/10x-new` change folder yet: no `change.md`,
so the review gate is not armed. Run `/10x-new tdg-port` to make it one.

## Next

- [x] **`next/image` `sizes` ordering.** A bare value placed first always wins, so every
      later condition is dead. All eight `sizes` props now audited: `interior-style-slide.tsx`
      (fixed-width card, `274px` / `241px`), `style-card.tsx` (`calc()` against the grid's own
      padding), `offer-slide.tsx` and `media-backdrop.tsx` (the dead `1920px` tail dropped —
      `100vw` already covers it) are the ones that were wrong. `image-sizes.ts`, a 3-entry
      stump of tdg's lookup table with one miscomposed consumer, is gone.

- [ ] Visually diff `/wykonczenia/boho/` against the board's `/news/boho` at 390 / 768 / 1440.
      The port uses one responsive tree with `lg:contents`; tdg ships two trees. Desktop
      column placement of the meta row and date is the part most likely to differ.
- [x] **Style page gallery is a Swiper.** `style-gallery.tsx` — `grabCursor` plus the
      `Keyboard` module, 1.15 / 2.2 / 3 slides per view. Follows the `offers-carousel`
      idiom (client component, `isReady` opacity guard). tdg's `ObjectsSlider` shape
      (looping, centred, one slide) is now a separate thing — `related-styles-carousel.tsx`,
      the "More interior styles" section closing every style page.
- [ ] Port the remaining pages: Realizacje (tdg `object`), Kontakt, Opinie klientów
      (testimonials — on the home page, a section of its own, or both is still open).
      "O nas" is a maybe: decide whether it is its own page or a block on the home page
      before porting anything for it. Oferta is retired, not pending.
- [ ] Social links in the footer/header — the set of profiles is not decided yet, so get
      the list from the owner before building the row.
- [ ] Fixly: a link to the company's profile (`https://fixly.pl/profil/tYMYyA5I`), plus its
      reviews and star rating on the site. **Researched 2026-09-04 — the source question is
      settled: hand-copied into Payload.** Fixly has no public API (no docs, no partner
      programme; `robots.txt` has `Disallow: /api`, so the backend is app-internal), no
      embeddable badge or widget, and profile pages sit behind Cloudflare — a plain `curl`
      with a browser UA gets 403. So scraping is not "fetching a public page", it is working
      around a bot wall; that rules it out on terms as much as on fragility. What Fixly does
      support outbound is a link to the profile and the "collect reviews" link it generates
      in account settings, which it explicitly allows on your own site.
      Shape: a `Fixly` global (`profileUrl`, `rating`, `reviewCount`, `reviewLink`,
      `lastCheckedAt`) plus an array of selected reviews (`author`, `body`, `rating`,
      `date`); refreshed by hand, so `lastCheckedAt` is what says whether it has gone stale.
      Do **not** mark these up as `schema.org/AggregateRating` — reviews about our own
      business copied from another platform are Google's "self-serving reviews", excluded
      from rich results and a manual-action risk. Plain text plus a link to the source.
      Overlaps the "Opinie klientów" item — same section, possibly two sources.
- [x] **Page transitions.** Already in: `(frontend)/template.tsx` renders
      `components/layout/page-transition.tsx` — a `motion/react` fade-and-rise that respects
      `useReducedMotion`. Only revisit if a per-route or shared-element transition is wanted.
- [ ] Cookie banner + a Privacy / Cookies policy page to link from it. Consent has to gate
      whatever analytics or third-party embeds land later, so build the consent state
      before adding the first script, not after.
- [ ] Site-wide SEO plumbing, none of which exists yet: `sitemap.ts`, `robots.ts`, OG
      images, favicon set, and `LocalBusiness` JSON-LD. The sitemap must emit the twelve
      indexed addresses with their trailing slashes and PL/EN alternates — see
      `context/foundation/url-map.md`.
- [ ] Analytics. Nothing is wired. Decide what (Vercel Analytics vs GA4) and keep it behind
      the cookie consent above.

## Blocked on the CMS slice

- [ ] Wire every page's data to Payload — no component keeps hardcoded copy, images,
      prices or list items. This is the umbrella item the three below are parts of.
- [ ] Contact form on TanStack Form + Zod, submitting to the leads app. Photo attachments
      (FR-031) are out of scope here — that contract lives in `/workspace/yolo/wykonczymy`.
- [ ] Replace `src/lib/placeholder/*` with real Payload fields. For styles that means a
      collection with a localized slug, body and gallery, plus the 72 photos into Media —
      they sit in `public/images/styles/` for now.
- [ ] Localized style slugs. One English slug currently serves both locales, so PL reads
      `/wykonczenia/mid-century-modern/`. Needs a localized field, like `pages.slug`.
- [ ] `contact` and `completed-works` page documents do not exist locally, so
      `pathsByType` falls those links back to `/`. Resolves itself once the documents exist.

## Dropped from the tdg template, on purpose

- The related-slide category `Tag` — tdg colours each slide by an article category this
  site has no equivalent for, so the tag and the per-category slide background are gone.
- Author name, role and avatar on the article meta row — blog furniture with no asset and
  no obvious meaning for an interior style. Reinstate if the design calls for it.
