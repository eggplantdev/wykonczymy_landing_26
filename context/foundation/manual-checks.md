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
- [ ] Creating a second Pages document with `pageType: home` is rejected in the admin.
- [ ] Editing a published page's title in the admin updates **both** addresses without a
      redeploy (the revalidation hook), including the locale that was not edited.
- [ ] Renaming a slug leaves the old address 404ing, not serving stale content.

Before cutover, the twelve addresses in `url-map.md` get walked in full — that is S8's gate,
not F2's.

## S2 — footer contact form (2026-09-17)

Local, against `pnpm dev` on :3001 (:3000 is the leads app), footer of any page:

- [ ] Typing into the fields and reloading the tab restores every value except the consent
      tick, which comes back unticked.
- [ ] Opening the site in a second tab shows an empty form — the draft is per-session, not
      shared (`sessionStorage`, not `localStorage`).
- [ ] Closing the tab and reopening the site shows an empty form.
- [ ] "Zakres prac" renders as a multi-line textarea running the full width of the grid,
      not a single-line input — as does "Wiadomość" below it.
- [ ] Both textareas grow line by line as you type and stop growing at roughly sixteen rems,
      scrolling past that. Neither shows a drag handle in its corner.
- [ ] Every placeholder in the form is the same grey as the "Dodaj załączniki" label next to
      them — check in Safari and Firefox too, since the bug was a browser default.
- [ ] Sending with only an e-mail address and the consent box ticked succeeds; every other
      field may be blank.
- [ ] After a successful send the form is empty, and **sending a second enquiry in the same
      session does not refill the fields with the first one** — this is the bug the gate caught.
- [ ] Submitting with an empty e-mail address and an unticked box shows an error under each,
      in Polish on `/` and in English on `/en/…`.
- [ ] A malformed address (`jan@`) reports the malformed-address message, not the
      missing-address one; a space-only address reports the missing one.
- [ ] No native browser validation bubble appears — the page's own messages are the only ones.
- [ ] The attachments input renders and accepts a file. It has nowhere to send it yet; that is
      FR-031 and a later change.
- [ ] Keyboard only: every field and the consent box are reachable and the box toggles with
      Space; the consent box shows a visible focus ring.
- [ ] Screen reader: pressing Send with an invalid form announces the errors (they appear only
      on submit, so nothing else would announce them).

Recorded debt: FR-032 (privacy-policy page) ships unmet — the consent box is deliberately a
bare checkbox with nothing to link to.
