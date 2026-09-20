---
change_id: lead-delivery
title: Deliver form submissions into the leads app, attachments included
status: planned
created: 2026-09-18
updated: 2026-09-20
archived_at: null
branch: null
worktree: null
---

## Notes

**This change has two homes.** The work does not fit in one repo, so the same `change.md` lives at
`context/changes/2026-09-18-lead-delivery/` in **both** `landing_26` and `wykonczymy`. It is one
change with one set of decisions; the copies are kept in step by hand, and a decision recorded on
one side is not agreed until it reads the same on the other.

`2026-09-17-s2-contact-form` in `landing_26` built the form and deliberately stopped short of a sink —
`submitContactForm` validates and returns `{ ok: true }` with the comment "No sink yet — where a
submission is delivered is the next change." This is that change.

A submission reaches the `leads` collection in the **leads app** (`/workspace/yolo/wykonczymy`) over
HTTP, with its attachments, and can be promoted by hand into an `investment`.

**Roadmap consequence: S2 and S6 merge.** The roadmap sequences S2 (form reaches the leads app) ahead
of S6 (photo attachments), but the wire contract is multipart from the first line — building a
JSON-only intake and rewriting it a slice later is work thrown away. S6's stated unblocking action
("agree the extended intake contract with the leads app") is what the 2026-09-18 design conversation
did; the decisions below are that agreement.

**The work straddles both repos, roughly half each.**

- **landing_26** — an address field on the form; a `submissions` queue collection; its own upload
  collection; the multipart forward; retry via cron (`vercel.ts`, which this repo does not have yet);
  building `rawData`/`formQuestions` from the i18n dictionary.
- **wykonczymy** — `POST /api/webhooks/landing`; an assets upload collection; three new columns on
  `leads`; `landing_form` added to the `source` enum; an `investments.assets` relation (a migration
  on a collection guarded by `preventDeleteWithTransactions`); a `makePreventDelete` probe protecting
  an asset a live investment points at; the lead → investment promotion in `/zgloszenia`.

## Decisions

- **2026-09-18 — attachments are first-class; the contract is multipart from the start.** Not a
  later slice. Files are the substance of an enquiry here: the hint copy already says "projekt, rzut,
  zdjęcia", and a renovation brief without the architect's PDF is not a brief.

- **2026-09-18 — submissions land in `leads`; no `enquiries` collection.** The value on that side is
  the machinery around the collection, not the collection: `captureLead`'s store-then-notify, dedup
  on `(source, externalId)`, retry ×3, `notifyStatus` / `autoReplyStatus`, `/zgloszenia`,
  `leads-reconcile`, ~15 test files. `source` already discriminates. A second collection would need
  all of it duplicated or generalized, and would split the inbox a salesperson reads.

- **2026-09-18 — an enquiry becomes an investment by hand, never automatically.** `investments` is a
  heavy financial object: `guardInvestmentStatusUnlock` on `beforeChange`, `preventDeleteWithTransactions`
  on `beforeDelete`, coefficients, VAT, settlement mode, kosztorys. Auto-creating one per submission
  would fill it with spam that is deliberately hard to delete. Three states, not two: lead →
  qualification → investment, with the lead kept as provenance. Most leads never advance.

- **2026-09-18 — the typed field set is dictated by `investments`, not by the form.** A field earns a
  column when it feeds a promotion; everything else is read, not queried. That criterion immediately
  exposed a gap — `investments.address` has nothing to map from, so **the form gains an address
  field**. New columns on `leads`: `address`, `scope`, `area`, hidden for Facebook leads via
  `admin.condition`. `message` gets no column: long, never filtered, read in the answers dialog.

- **2026-09-18 — assets are generic; one upload collection serves both sides.** "Projekt" is a file
  kind (PDF, drawing, photo), not an entity. One collection shared by leads and investments means
  **promotion writes a relation and never copies bytes** — the file sits in Vercel Blob once. Two
  collections would re-upload on every promotion: double transfer, double storage, two copies free to
  drift.
  - Carries a known hazard this app has already hit once: the comment in `media.ts` records that
    `transactions_rels` is `ON DELETE cascade`, so deleting a media row silently unhooks it from every
    transfer pointing at it. Same shape here — deleting an old lead would take a PDF out from under a
    live investment. `makePreventDelete` (`@/hooks/prevent-delete`) already exists for exactly this.

- **2026-09-20 — that one collection IS `media`.** Reverses the 2026-09-18 rider "Not `media` — that
  is the invoice library under the 'Finanse' admin group". The objection was admin-panel labelling;
  the evidence against it is structural. Every layer of the upload path in `wykonczymy` is already
  generic and none of it mentions invoices: `process-upload-file` (classify → HEIC-convert →
  compress → size-guard), `POST /api/upload-file`, `uploadFile()`, `discardOrphanedUploads`, the
  `vercelBlobStorage` entry, the 400×300 thumbnail, and `media.mimeTypes` (`image/*`,
  `application/pdf`) — four unrelated surfaces already share it, including vehicle inspections and
  equipment handovers.
  - The decisive cost is not duplication, it is **`deleteUnreferencedMedia`**: a single reference
    counter naming, by hand, every collection that points at a file. It already lost that race —
    `equipment-events.attachments` was added later and is **not** counted, so those files are
    deletable out from under a live record **today**, despite the function's own comment instructing
    the next author to add it. A second collection means a second such counter. Instead, one registry
    (`MEDIA_RELATIONS`) drives both the counter and the `makePreventDelete` probes, and adding a
    relation is one line in one place.
  - Labelling is answered by a `kind` field (faktura / projekt / zdjęcie / inne) on `media`, which is
    cheaper than a collection and is the field the next decision below already calls for.

- **2026-09-18 — staff assign `kind`, at promotion; the visitor does not classify.** Every lead is
  qualified by hand anyway, and choosing which assets are worth carrying over is the same pass as
  saying what they are. A MIME-based guess at intake would be noise until a human looked regardless.
  `kind` is therefore not an intake field.

- **2026-09-18 — the outbox is a queue, not a second inbox.** Owner's call, against the advice
  recorded at the time: the cheaper option was inline retry plus an e-mail backstop (which is what
  the current WordPress site does, and this repo already has nodemailer + an SMTP adapter wired).
  Rejected because losing a lead is the outcome being bought out of. The cost — app-shaped machinery
  in a landing page — is contained by one rule: **a row lives until delivery, then is deleted.** Not
  housekeeping; it is what stops the queue becoming a shadow leads archive free to drift from the
  real one, and what keeps "one inbox" true. Hidden or read-only in the admin. Files are held only
  until delivery is confirmed; the canonical home stays the leads app's blob.
  - Order is load-bearing, mirroring `captureLead`: **store → answer the visitor → forward.** The
    visitor's "thank you" rests on the local write, never on the other app answering.

- **2026-09-18 — typed core plus a self-describing tail; `source: 'landing_form'`.** Every field also
  rides in `rawData` + `formQuestions`, in the shape the leads app already parses — so
  `buildLeadAnswers` renders new questions in the answers dialog with **no migration and no deploy on
  that side**. That is the whole extensibility story; the duplication with the typed columns is
  deliberate (columns are for filtering and promotion, the tail is for reading). Labels come from the
  same i18n dictionary that rendered the form, so what is stored is the label the visitor actually
  saw; `locale` rides along. `landing_form` is a new `source` value so the cutover stays measurable
  while the WordPress form still runs, and so numeric WPForms `entry_id`s never share an `externalId`
  space with the landing's uuids.
  - Idempotency comes free: the landing mints a `submissionId` uuid at queue time and sends it as
    `externalId`, so a retry after a timeout that actually succeeded hits the unique index, returns
    `created: false`, and `captureLead` does not re-send the e-mails.

- **2026-09-18 — the wire schema is duplicated in both repos, pinned by a shared fixture.** Not a
  shared package (publish + version bump in two repos for every field) and not a copy script. Only
  the ~7-field envelope has to agree; the tail is self-describing. This follows the rule the leads
  app already states over `leadSchema` — strict on the envelope, permissive on what varies — with
  `notifyShapeAlert` as the existing safety net when a shape drifts.

- **2026-09-20 — `area` is text.** Closes the open question. The label "Powierzchnia prac, np.
  30–60 m²" invites a range, which no numeric column holds; sorting on it was never asked for.

## Open

- **Who edits `wykonczymy`.** `landing_26`'s `AGENTS.md` still says nothing outside that repo is ever edited, and
  half this change lives there. Three options put to the owner, none chosen yet: (a) lift the rule
  once for this change, (b) split the work across two sessions, endpoint first so there is something
  to test against, (c) lift it and update `AGENTS.md`, on the grounds that the rule stopped describing
  reality the moment the landing needed a sink.
- **Open Question 5 looks answered — confirm at the source.** The leads app's `wpforms` route
  documents a `wpforms_process_complete` snippet POSTing every WordPress submission to it, with the
  WP notification e-mail as the human backstop, and states that WPForms Lite does not persist
  entries. That corroborates "e-mail + leads app" and rules out a third store — but it is the
  receiver describing the sender, not the WordPress config itself.
