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
- [ ] Port the remaining pages: Oferta (tdg `about` / `textPage`), Realizacje (tdg `object`),
      Kontakt.

## Blocked on the CMS slice

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
