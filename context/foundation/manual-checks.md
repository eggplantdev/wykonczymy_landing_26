# Manual checks

Verification owed by a slice before it can move past `In Review`. Most boxes need a browser,
the admin UI, or production, and only a human can close those. A box whose whole claim is
observable over HTTP — a status code, a redirect target, a string in the response — is
settled by fetching it, and the note under it records what came back. **A box whose subject
renders on the client is not one of those** — `curl` sees the pre-hydration shell, which for a
404 is Next's own English default. Open a browser before calling such a box failing.

## F2 — i18n spine (2026-09-03)

Local, against `pnpm dev`.

The original list was written against `/oferta/` and "the two seeded Pages documents". Neither
exists: `offer` was dropped from the page-type enum on 2026-09-04 and seeding was deleted on
2026-09-19. Rewritten 2026-09-21 against the six page types actually published, which is why
the addresses below are not the ones the slice was reviewed with.

- [x] `/` renders the home document; `/realizacje/` renders the projects listing.
      → both 200, `/realizacje/` links its six project children.
- [x] `/en/home/` and `/en/completed-works/` render the same two documents in English.
      → both 200.
- [x] `/realizacje` (no trailing slash) 308s to `/realizacje/` rather than 404ing.
      → 308 → `/realizacje/`; same for `/kontakt`.
- [x] `/en` reaches `/en/home/`.
      → two hops, both 308: `/en` → `/en/` → `/en/home/`. The original box said "301s"; it is
      a 308 chain, which preserves the method and is what `trailingSlash: true` emits.
- [x] A slug that exists in neither locale renders the 404 page, and the 404 under `/en/…`
      shows English copy while the 404 under `/…` shows Polish.
      → both 404. `/nie-ma-takiej-strony/` → "Ta strona nie istnieje lub została przeniesiona."
      + "Wróć na stronę główną" → `/`; `/en/no-such-page/` → the English pair → `/en/home/`.
      Titles localized too. `not-found.tsx` is a client component, so **curl sees only Next's
      built-in default** and the page looks broken over HTTP — it is not. Check this one in a
      browser; an HTTP fetch cannot settle it.
- [x] The language switcher on `/realizacje/` links to `/en/completed-works/` and back.
      → behind the "Ustawienia" button, so no `/en/…` href exists until it is opened. Once
      open: `PL → /realizacje/`, `EN → /en/completed-works/`.
- [ ] Creating a second Pages document with `pageType: home` is rejected in the admin.
- [ ] Editing a published page's title in the admin updates **both** addresses without a
      redeploy (the revalidation hook), including the locale that was not edited.
- [ ] Renaming a slug leaves the old address 404ing, not serving stale content.

Before cutover, the twelve addresses in `url-map.md` get walked in full — that is S8's gate,
not F2's.

## S2 — footer contact form (2026-09-17)

Swept 2026-09-21 in a browser (Chromium) against `pnpm dev`. The two boxes left open each
name a check this pass genuinely could not make, not one that failed.

- [x] Typing into the fields and reloading the tab restores every value except the consent
      tick, which comes back unticked.
      → all six text fields restored; `acceptsTerms` back to `false`. It is absent from the
      persisted draft entirely — `toDraft`'s `Omit` is what enforces that, so a ticked box is
      never written, not merely ignored on read.
- [x] Opening the site in a second tab shows an empty form — the draft is per-session, not
      shared (`sessionStorage`, not `localStorage`).
      → second tab empty; `localStorage.contact-form-draft` is `null`.
- [x] Closing the tab and reopening the site shows an empty form.
      → empty, `sessionStorage` gone with the tab.
- [x] "Zakres prac" renders as a multi-line textarea running the full width of the grid,
      not a single-line input — as does "Wiadomość" below it.
      → both are `<textarea>` at 766px against 373px for the single-column inputs.
- [x] Both textareas grow line by line as you type and stop growing at roughly sixteen rems,
      scrolling past that. Neither shows a drag handle in its corner.
      → 56.5 → 72 → 88 → 134 → 256px across 1/2/3/6/20 lines; capped at `max-height: 256px`
      (16rem) with `overflow-y: auto`. `resize: none`, so no handle.
- [ ] Every placeholder in the form is the same grey as the "Dodaj załączniki" label next to
      them — check in Safari and Firefox too, since the bug was a browser default.
      → **two problems with this box, neither of them a bug in the form.** All six
      placeholders are identically `rgb(163, 163, 163)` — explicitly set, which is the
      substance of the check and is what rules out the browser default. But the element the
      box names as the reference, the "Dodaj załączniki" paragraph, is `rgb(0, 0, 0)`; they
      were never meant to match, so the wording needs an owner's correction. And this pass was
      Chromium only — the cross-browser half is the reason the box is still open.
- [x] Sending with only an e-mail address and the consent box ticked succeeds; every other
      field may be blank.
      → "Dziękujemy, odezwiemy się wkrótce."
- [x] After a successful send the form is empty, and **sending a second enquiry in the same
      session does not refill the fields with the first one** — this is the bug the gate caught.
      → form cleared and the persisted draft emptied with it; a second enquiry typed into a
      clean form, sent, and cleared again. No trace of the first.
- [x] Submitting with an empty e-mail address and an unticked box shows an error under each,
      in Polish on `/` and in English on `/en/…`.
      → exactly two errors, on `email` and `acceptsTerms`, both `aria-invalid="true"`.
      "To pole jest wymagane" on `/`, "This field is required" on `/en/home/`.
- [x] A malformed address (`jan@`) reports the malformed-address message, not the
      missing-address one; a space-only address reports the missing one.
      → `jan@` → "Podaj poprawny adres e-mail"; `"   "` → "To pole jest wymagane". The schema
      trims before `min(1)`, which is what turns whitespace into missing rather than malformed.
- [x] No native browser validation bubble appears — the page's own messages are the only ones.
      → `form.noValidate` is `true` and every control reports an empty `validationMessage`.
- [x] The attachments input renders and accepts a file. It has nowhere to send it yet; that is
      FR-031 and a later change.
      → `accept="image/*,application/pdf"`, `multiple`; a PNG was accepted. Worth an owner's
      look though the box does not ask for it: the label still reads "Wybierz pliki" after a
      file is chosen, so nothing on screen confirms the pick.
- [x] Keyboard only: every field and the consent box are reachable and the box toggles with
      Space; the consent box shows a visible focus ring.
      → all six fields, the file input, the consent box, the privacy link and Send are in tab
      order, none with a negative tabindex, DOM order matching visual order. Space toggles the
      box. The ring resolves to `2px solid rgb(86, 86, 86)` via `peer-focus-visible`.
- [ ] Screen reader: pressing Send with an invalid form announces the errors (they appear only
      on submit, so nothing else would announce them).
      → the markup is right: every control is labelled, and each error node is `role="status"`
      with `aria-live="polite"`, wired by `aria-describedby`. That is the correct mechanism,
      but it is not the check — whether VoiceOver actually speaks them needs VoiceOver.

Both the consent box and the file input are `sr-only`, driven by their visible labels. A test
that clicks the input directly times out on an intercepted pointer event; drive the label, or
focus the control and press Space.

Recorded debt: FR-032 (privacy-policy page) ships unmet — the consent box is deliberately a
bare checkbox with nothing to link to.

## S7 — SEO surface (2026-09-21)

The populate script ran against production on 2026-09-21: wrote 10, skipped 0 — all six page
types in both locales now hold the copy from `seo-copy.md`. A re-run is a no-op, since the
script only fills an empty `meta.description`.

**The live site does not show them yet.** `revalidateAllPages` throws outside a request and
`revalidate.ts:12` logs it rather than swallowing it, so a CLI write leaves production serving
the cached copy until the next deploy. Check the addresses below against `pnpm dev`, which reads
the same database directly; the deployed site is only trustworthy on this after a redeploy.

Local, against `pnpm dev`:

- [ ] Setting `meta.description` by hand on a project in the admin overrides the derived one on
      the next load; clearing it brings the derived one back.
- [ ] The tab icon is the Wykończymy house-and-tools mark, not the default globe. Hard-reload —
      browsers cache a favicon aggressively.
- [ ] Paste `http://localhost:3000/wykonczenia/boho/` into a rich-preview surface (Slack DM to
      yourself, Discord, Signal). The card shows the brand image, the page title and the style's
      description. **Not** the eggplantdev agency mark, and not a bare link.

Against production, after deploy:

- [ ] Google Rich Results test on the deployed `/kontakt/` reports a valid `Organization`, with
      the phone, mail and address the footer and contact page show.
- [ ] Lighthouse SEO on the eight measured pages: `meta-description` passes. `is-crawlable`
      still fails and is **expected** — `robots.ts` and the layout's `robots` key hold the
      pre-cutover noindex. Do not delete them to chase the number; cutover owns that.

Recorded debt:

- **`price-list` has no Pages document** and will not get one — dropped 2026-09-21. Its absence from
  the sitemap and from the populate script's write set is now correct, not a gap. `/cennik/` and
  `/en/price-list/` stay in `url-map.md` as indexed addresses owed a `301`; cutover picks the target.
- **`<html lang="pl">` on `/en/*`** still contradicts the hreflang pairs this slice emits. Out of
  scope here; it needs the locale in a real route segment.

## EX-817 — card heights reserved in `lh` (2026-09-21)

Nine hand-derived pixel heights across three components became four `lh` values. `1lh` is the
element's own `font-size` x `line-height`, so the reserved box now follows the type scale
instead of being re-derived by hand whenever a title moves a step.

**Every box below is a before/after comparison, so it has to be made at each breakpoint
separately** — the old constants were per-breakpoint and each drifted by a different amount.
The base tier of `style-card.tsx` is the one that cannot be predicted on paper: `*` carries
`line-height: normal` (`styles.css`, the tdg reset), which resolves off the font's own metrics,
so only a browser can say what five lines come to there.

Against `pnpm dev`. Use the longest real `interior-styles.title` and `.text` in the database —
a short one reserves the same box and proves nothing.

- [ ] `/wykonczenia/` at **375px** (one column): every photo in the column starts level, and no
      title or blurb is clipped mid-descender.
- [ ] `/wykonczenia/` at **768px** (two columns, `md`): photos level across each pair. This tier
      is the one that previously sat at exactly its box height with zero slack — it is where a
      clipped descender would show first.
- [ ] `/wykonczenia/` at **1024px** (three columns, `lg`): photos level across each row of three.
- [ ] `/wykonczenia/` at **1280px** (`xlg`, blurb drops to four lines): photos level, and the
      blurb clamps at four lines rather than five or three.
- [ ] `/wykonczenia/` at **2048px+**: same, at the widest tier the grid reaches.
- [ ] Home interior-styles slider at **375px** and at **1280px**: the photos across the visible
      slides start at the same y, including where one card's title wraps to two lines and its
      neighbour's does not.
- [ ] A card whose title fits on **one** line sits level with its two-line neighbours — that is
      the whole point of the reserved box, and a `min-h` that came out too small fails here
      rather than by clipping.

If a tier is off by a pixel or two, that is the expected direction of the change (the old
constants rounded up off the fractional spacing scale) — the question is only whether it reads
worse. It is a line count that is wrong, not a rounding.

## EX-802 — lead delivery (landing_26 half, 2026-09-21)

The form finally has a sink. A submission is stored, the visitor is answered, then the envelope is
forwarded HMAC-signed to the leads app, which fetches the attachments and calls back to release the
staged blob prefix. Almost nothing below is observable from this repo: the rate limits, the cron
schedule and both secrets live in Vercel, and half the contract lives in the other repo.

**Every check here was closed by 2026-09-22** — the migration, the Vercel rate-limit rules, the
three production secrets, both crons reporting `200` on their slashed paths, a live submission with
attachments reaching the leads app, and the staged blob prefix disappearing after it. The ticked
boxes were stripped when the change was archived; what follows is what outlived them.

**`WYKONCZYMY_WEBHOOK_URL` must name the public alias** — `wykonczymy.vercel.app`. The
project-scoped alias (`wykonczymy-wykonczymys-projects.vercel.app`) and every deployment URL sit
behind Deployment Protection and answer `401` before any route runs; the public alias returns `403`
to a deliberately invalid signature, which is the leads app's own rejection and therefore proof the
request arrived.

**The cleanup round trip runs in seconds, not on the sweep.** The first submission after
`LANDING_CLEANUP_URL` was wired logged `upload-token` at `11:22:04 UTC`, the form at `11:22:06` and
the `landing-delivered` callback `200` at `11:22:14`; a blob listing taken straight after held no
new prefix. The daily `sweep-orphans` is the backstop, and its 24-hour gate lives in
`src/lib/blob/sweep.ts`, not in the cron schedule — running the cron early does nothing.

**The retry queue has been exercised for real (2026-09-22).** A submission from 2026-09-21 21:48
sat at `attempts: 10` with `lastError: "Leads app answered 401"`, which put it past `MAX_ATTEMPTS`
and therefore outside what `listPending` will ever pick up again. Cause was not the secret: the
leads app answers a bad signature with `403`, so a `401` means the request never reached its code —
`WYKONCZYMY_WEBHOOK_URL` was pointing at a Deployment-Protection-guarded host. With the URL fixed,
resetting `attempts` to 0 and running the cron delivered it and deleted the row. The queue is empty.

That is the "no lead is lost" machinery working, but it only worked because someone looked. Nothing
watches for a row past the ceiling — the design note in `submissions.ts` calls the admin "the alarm",
and no one is in front of it.

**The honeypot autofill check was closed by analysis, not observation (2026-09-22)** — the owner's
call, having no saved Chrome address profile. Chrome's address profile schema is name, organization,
street address, city, postcode, phone and email; it carries no website field, which is exactly why
the trap is named `website` rather than `company` (`contact-form-trap.tsx:13`). **What is accepted
with it:** the failure it guards is silent on both sides, so no amount of spam arriving will ever
reveal it — the symptom is an enquiry that does not arrive. Re-open it if a visitor ever reports
sending something that never landed.

One known gap, deliberately left:

- **A forward will not reach the leads app from any Deployment-Protection-guarded host** — the
  request needs an `x-vercel-protection-bypass` header that `forward.ts` does not send. This is
  wider than preview: probed 2026-09-22, `wykonczymy.vercel.app` answers `403` to an invalid
  signature (its own rejection, so the request landed) while both
  `wykonczymy-wykonczymys-projects.vercel.app` and the raw deployment URL answer `401`. So
  `WYKONCZYMY_WEBHOOK_URL` must name the **public alias**; the project-scoped one differs by a
  single path segment and fails closed. Decide the bypass header when a preview actually needs to
  deliver; until then, test the round trip against production.
- **A `401`/`403` burns all ten attempts.** `forward()` cannot distinguish "wrong address" from "the
  network blinked", so a misconfigured URL costs the full retry budget over roughly two hours and
  then parks the lead permanently. Worth splitting retryable from terminal failures if this recurs.
