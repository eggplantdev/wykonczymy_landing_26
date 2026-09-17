# tdg port — open items

Running list for the component port. Not a `/10x-new` change folder yet: no `change.md`,
so the review gate is not armed. Run `/10x-new tdg-port` to make it one.

**Scope: carrying tdg's markup across as components here.** Site-wide plumbing — the form's
delivery, SEO files, consent, analytics — is not a component port and is not tracked here;
see **Not this slice** at the bottom for where each one lives.

## Open

- [ ] **O nas** — still undecided: its own page, or a block on the home page. Decide before
      porting anything for it.

## Done

- [x] **Kontakt — done 2026-09-17.** The page carries no form of its own: the footer puts
      one under every page, this one included. All it adds is the postal block —
      `src/components/contact/contact-page.tsx`, address / mail / phone with pin, envelope
      and phone icons, wired in the catch-all. `/kontakt/` and `/en/contact/` both
      prerender.
      Phone and mail are read from the `footer` global rather than repeated on the page, so
      there is one number to change. Only `contact.address` (localized) and `contact.nip`
      are page fields — migration `20260917_171404_contact_details`.
      `nip` is seeded empty: the live site publishes no tax id, so there was nothing to
      carry across. Fill it in the admin and the line appears.
- [x] **`next/image` `sizes` ordering.** A bare value placed first always wins, so every
      later condition is dead. All eight `sizes` props now audited: `interior-style-slide.tsx`
      (fixed-width card, `274px` / `241px`), `style-card.tsx` (`calc()` against the grid's own
      padding), `offer-slide.tsx` and `media-backdrop.tsx` (the dead `1920px` tail dropped —
      `100vw` already covers it) are the ones that were wrong. `image-sizes.ts`, a 3-entry
      stump of tdg's lookup table with one miscomposed consumer, is gone.
- [x] **Style page gallery is a Swiper.** `style-gallery.tsx` — `grabCursor` plus the
      `Keyboard` module, 1.15 / 2.2 / 3 slides per view. Follows the `offers-carousel`
      idiom (client component, `isReady` opacity guard). tdg's `ObjectsSlider` shape
      (looping, centred, one slide) is now a separate thing — `related-styles-carousel.tsx`,
      the "More interior styles" section closing every style page.
- [x] **Realizacje is ported.** `completed-works` renders both levels — `projects-page.tsx`
      for the listing, `project-page.tsx` for a job, wired in the catch-all route. Oferta is
      retired, not pending.
- [x] **Opinie klientów — a home-page section, not its own page (decided 2026-09-17).**
      `testimonials` group on `home-group.ts` (localized `quote` / `role`, shared `name`,
      one non-localized row set like `services.cards`), `src/components/home/testimonials/`,
      four quotes seeded in both locales, migration `20260917_160110_testimonials`.
- [x] **Social links — done 2026-09-17.** `src/components/footer/social-links.tsx` renders
      Facebook / Instagram / Fixly with the decided profiles (`handyman_warsaw_`,
      `people/Warsaw-Handyman/100085905117915`, `profil/tYMYyA5I`), icons in
      `src/components/ui/icons/`, in the footer.
- [x] **Fixly — done 2026-09-17.** The profile link (`fixly.pl/profil/tYMYyA5I`) ships in
      the socials row. Ratings and copied reviews are not part of this site.
- [x] **Page transitions.** Already in: `(frontend)/template.tsx` renders
      `components/layout/page-transition.tsx` — a `motion/react` fade-and-rise that respects
      `useReducedMotion`. Only revisit if a per-route or shared-element transition is wanted.

## Dropped from the tdg template, on purpose

- The related-slide category `Tag` — tdg colours each slide by an article category this
  site has no equivalent for, so the tag and the per-category slide background are gone.
- Author name, role and avatar on the article meta row — blog furniture with no asset and
  no obvious meaning for an interior style. Reinstate if the design calls for it.

## Not this slice

Parked here only so cutting them from the list above does not lose them. Each belongs to a
roadmap slice, or to none yet — do not work them from this file.

- **Contact form has no sink.** `submitContactForm` validates and returns `{ ok: true }`
  without delivering anywhere. → roadmap **S2**.
- **`price-list` is a dead page type under a live 301.** `'price-list'` is still in
  `pageTypes` while `/cennik/` redirects home, so a document created under it would be
  unreachable. → roadmap **S8**, open questions 3 and 4.
- **SEO plumbing** — `sitemap.ts`, `robots.ts`, OG images, favicon set, `LocalBusiness`
  JSON-LD. → roadmap **S7**.
- **Cookie consent + a Privacy / Cookies page.** Not in the roadmap at all. Has to exist
  before the first third-party script, not after.
- **Analytics** (Vercel Analytics vs GA4). Not in the roadmap either, and gated on consent.
