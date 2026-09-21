---
change_id: s2-contact-form
title: Wire the footer contact form to TanStack Form, Zod and Zustand
status: archived
created: 2026-09-17
updated: 2026-09-21
archived_at: 2026-09-21T08:49:51Z
branch: null
worktree: null
---

## Notes

The markup already exists — `src/components/footer/contact-form.tsx`, ported from tdg, with no
`action`, no `onSubmit`, no validation and no submit state. This change gives it behaviour.

Owner's scope, as stated:

- **TanStack Form + Zod.** The schemas are already written in the reference repos — find them, do
  not invent new ones.
- **Zustand + persistence of the field values in `localStorage`**, so a visitor who navigates away
  does not lose what they typed.
- **Validation on both sides** — client and server.
- **One name field.** The `firstName` / `lastName` split the tdg port introduced is dropped; the
  live WP form has a single `Imię i nazwisko`, and so will this one.
- **Two required fields and no more: the e-mail address, and acceptance of the privacy policy /
  terms.** Everything else is optional. (The live WP form also marks only the e-mail required.)
- **No persistence of submissions yet.** Build the form itself. Where an answer is delivered — the
  leads app, e-mail, a Payload collection — is decided and wired afterwards.

Consequence worth naming up front: "validation on the server" with nothing to store means a route
that parses the submission against the shared Zod schema and answers, with no sink behind it. The
schema is the deliverable; the destination is the next change.

## Decisions

- **2026-09-17 — `sessionStorage`, not `localStorage`.** The draft dies with the tab, so nothing has
  to clear it and a shared machine keeps nothing. Also puts us back on the repo trend: `nomad_chef`
  and the leads app both persist form drafts to `sessionStorage`.
- **2026-09-17 — no privacy policy page in this change.** The consent checkbox stays a bare
  checkbox: still required to submit, label stays plain text rather than a link. **Debt:** FR-032
  (the visitor must be able to see what happens to their data before submitting) ships unsatisfied.

- **2026-09-17 — the schema carries translation keys, not messages.** Each side resolves them with
  its own accessor: `useTranslation('form')` on the client, `getTranslations(locale).form` on the
  server. One rule set, one file, both locales, and the server is not forced to run a React hook.
  The keys are typed as `TranslationKeyT<'form'>` (`src/lib/i18n/i18n.ts:21`), so a misspelled key
  fails typecheck instead of rendering itself into the UI.
- **2026-09-17 — the message field is in.** `Wiadomość` / message (FR-030) is part of this form. Its
  i18n key already exists in both locales (`form.message`). Optional, like everything except the
  e-mail address and the consent checkbox.

- **2026-09-17 — the attachments input stays.** It has no sink here and none in the leads app
  either, and that is fine: the whole site is built before anything is pushed, so there is no
  half-shipped state to protect a visitor from. Wiring it up is S6 / FR-031, which is work in the
  leads app repo. Left in place, recorded as debt, not removed.

Field set is not settled here. It is enumerated once, for the current live form, in
`context/foundation/live-site-snapshot/scraped-content.md` (`### Contact Form Fields`) — scraped
2026-03-04, spot-check it. PRD Open Question 1 is still open.
