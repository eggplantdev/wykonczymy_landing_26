# Lead delivery — landing_26 half — Implementation Plan

## Overview

Build the entire sending half of `lead-delivery` in `landing_26`: the contact form gains an address
field and working attachments, a submission is queued locally, forwarded as signed JSON to the leads
app, retried until delivered, and its staged blobs are deleted when the far side confirms. The
receiving endpoint already exists and is frozen, so every phase here can be verified against a real
contract rather than a guess.

## Current State Analysis

`submitContactForm` validates and returns without a sink (`src/lib/contact/submit-contact-form.ts:19`).
Nothing else of this change exists in this repo: no queue collection, no Route Handler at all
(`src/app/api/` is absent — the only handlers are Payload's catch-alls), no HMAC code, no
`src/lib/env.server.ts`, no `vercel.json`, and `@vercel/blob` is a devDependency used only by
`scripts/blob-upload.ts`. The file picker renders but is dead UI: it stores `file.name` strings and
never lifts a `File` (`contact-form-attachments.tsx:20,54-64`).

The far side is complete. `wykonczymy` is at `status: implemented` — `POST /api/webhooks/landing`,
`landingSubmissionSchema`, the SSRF-guarded `fetchLandingAsset`, the `leads` columns, the
`landing_form` enum value and the promotion UI are all shipped and tested. Its one remaining piece,
the delete-on-delivery callback sender, is owned by another agent and is being built to the
**Callback** section added to `context/reference/landing-intake-contract.md` on 2026-09-21.

## Desired End State

A visitor fills the footer form on the deployed site, optionally attaches photos or a PDF, and
presses send. The files upload straight from the browser into `leads/<submissionId>/`; the
submission is written to a local queue; the visitor is thanked; the envelope is forwarded
HMAC-signed to the leads app, which stores the lead, pulls the files into `media`, and calls back to
say the staged copies can go. A delivery outage costs a retry, never a lost lead, and a visitor who
abandons the tab leaves bytes that the age sweep reclaims.

Verify by submitting the real form on a preview deploy and confirming the lead — with its files — in
`/zgloszenia`, then confirming the `leads/<submissionId>/` prefix is empty and the queue row gone.

### Key Discoveries:

- **`after()` from `next/server` is the store → answer → forward primitive.** It is supported in
  Server Functions in this Next version (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md`),
  which is exactly the ordering `change.md` calls load-bearing: the visitor's thank-you rests on the
  local write, never on the other app answering.
- **`200` means stop retrying** — including on partial asset failure. Only a `500` (the lead itself
  could not be stored) earns a retry. The status table in `landing-intake-contract.md` is the spec
  for the queue's retry logic.
- **The upload must be awaited inside TanStack's `onSubmit`** (`contact-form.tsx:68-89`), because
  `isBusy` is derived from `form.state.isSubmitting` via `<form.Subscribe>` (`:175-188`) — work
  awaited there is covered by the busy state for free, and its failure path mirrors the existing
  `setServerError(t(key)); return`.
- **Message keys are compile-checked against the Polish dictionary.** `FormMessageKeyT =
  TranslationKeyT<'form'>` and `MESSAGE_KEYS` reads `pl` (`contact-schema.ts:10,14`), so a new error
  key must land in **both** `pl.json` and `en.json` or one of the two type-errors.
- **Route Handlers are uncached for non-`GET` here**, so the token route, the callback receiver and
  the crons need no cache opt-out.
- **Schema only moves by migration and a human applies it** (`push: false`, `AGENTS.md:154`), and
  `migrate:create` must run only after the fields have settled (`tech-stack.md:80`) — a mid-edit
  generation freezes a stale snapshot and leaks a `DROP COLUMN` into the next unrelated migration.
- **Module placement follows the CMS-tier rule** (`AGENTS.md:97-101`): queue persistence reads and
  writes Payload, so it is `lib/content/submissions.ts`; blob and signing helpers touch no Payload,
  so they get their own directories (`lib/blob/`, and the signer alongside the form domain in
  `lib/contact/`).

## What We're NOT Doing

- **Not building anything in `wykonczymy`.** Its half is implemented and another agent owns the
  callback sender. This plan's only cross-repo actions are keeping `landing-intake-contract.md`,
  `change.md` and the shared fixture in step — coordination, not implementation.
- **Not sending `locale`** (decision 2026-09-21). See Risks: this ripples into the fixture and the
  contract's envelope table.
- **Not rate-limiting in application code.** Vercel Firewall rules on the two public paths, verified
  manually.
- **Not staging the rollout.** Attachments ship with the first working delivery, in one pass.
- **Not touching the roadmap's S2/S6 statuses** — that is an owner's pass, noted in research.
- **No live-blob or Playwright upload test.** Mocks at the module boundary; the real browser→blob
  hop is a manual check.

## Implementation Approach

Six phases, ordered so each one is verifiable on its own: the plumbing that everything imports
(env, deps, the new field) first; then the queue it writes to; then the pure envelope and signing
modules, which are where the contract is actually pinned; then the upload path; then delivery
itself; then the scheduled work and the callback receiver that close the lifecycle.

The whole design rests on one sequence — **store, answer, forward** — and on one rule for reading the
far side's reply: retry on `500` and on transport failure, stop on everything else.

## Critical Implementation Details

**Timing & lifecycle.** The `submissionId` is minted **client-side**, before the upload, because the
blob prefix is scoped to it and the token must pin that path. The same id is then passed to the
action so the queue row and the wire envelope agree. This makes the id client-controlled: a forged
duplicate is harmless because the far side dedupes on `(source, externalId)` and returns
`created: false`, but the token route must still reject anything that is not a well-formed uuid, or
the prefix pin stops being a pin.

**State sequencing.** `after()` runs the forward only once the response is on its way. The queue row
must therefore be committed *before* the action returns, not inside the `after` callback — otherwise
a crash between the two loses the submission that the visitor was just thanked for.

## Phase 1: Foundations — env, dependencies, the address field

### Overview

Everything later phases import: the server-side env reader that does not exist yet, `@vercel/blob`
as a real dependency, and the address field the leads app's `investments.address` has nothing to map
from without.

### Changes Required:

#### 1. Server env reader

**File**: `src/lib/env.server.ts` (new)

**Intent**: The first server-only env module in the repo. `eslint.config.mjs:27-48` already names it
in the ignore list precisely so the next author does not edit the lint config and reach for
`clientSchema` instead — putting a secret there would inline it into the browser bundle.

**Contract**: Parses `serverSchema` from `src/lib/env-schema.ts` once at module load and exports the
parsed object. Carries `import 'server-only'` — it would be the first module in `src/` to do so;
note that `payload.config.ts:21-22` documents why *it* cannot (the Payload CLI loads it outside
Next), which is the exception, not the precedent.

#### 2. New server secrets

**File**: `src/lib/env-schema.ts`

**Intent**: Declare what this change needs, in the one place env vars are declared.

**Contract**: Add to `serverSchema`: `LANDING_WEBHOOK_SECRET` (min 1 — the shared HMAC secret, same
value as the leads app), `WYKONCZYMY_WEBHOOK_URL` (url — the full inbound endpoint), `CRON_SECRET`
(min 1 — guards the two cron routes). `BLOB_READ_WRITE_TOKEN` already exists and is already required
on Vercel by the `superRefine` at `:34-42`. Follow the existing `optional()` convention only where a
var genuinely may be unset; these three may not.

#### 3. `@vercel/blob` becomes a runtime dependency

**File**: `package.json`

**Intent**: The client-upload API is imported from `src/` at runtime, not just by a script.

**Contract**: Move `@vercel/blob` from `devDependencies` to `dependencies`, keeping the `^2.8.0`
range. Per `AGENTS.md`, do not pin a fresh exact version — `minimumReleaseAge: 1440` will refuse a
lockfile containing anything under a day old.

#### 4. The address field

**Files**: `src/lib/contact/contact-schema.ts`, `src/lib/i18n/locales/pl.json`,
`src/lib/i18n/locales/en.json`, `src/components/footer/contact-form/contact-form.tsx`

**Intent**: Add `address` to the validated field set, its label to both dictionaries, and the input
to the form. It is optional like the other text answers — only email and consent are required.

**Contract**: `contactSchema` gains `address` as a trimmed string capped at `SHORT_FIELD_MAX_LENGTH`
with the `tooLong` message key; `emptyContactValues()` (`:71-73`) gains the matching empty string;
both dictionaries gain a `form.address` key (adding to one alone type-errors the other); `TEXT_FIELDS`
(`contact-form.tsx:38-43`) gains the field, whose `name` doubles as its translation key.

### Success Criteria:

#### Automated Verification:

- Contact schema unit tests pass, including a case asserting `address` is accepted and capped:
  `pnpm vitest run tests/unit/contact-schema.spec.ts`
- The form render test still passes: `pnpm vitest run tests/unit/contact-form-reset.spec.ts`

#### Manual Verification:

- The address input appears in the footer form in both `pl` and `en`, with a translated placeholder.
- A draft containing an address survives a page reload (the sessionStorage store round-trips it).

---

## Phase 2: The submissions queue

### Overview

A Payload collection that holds a submission from the moment it is accepted until the moment the
leads app confirms it. A row lives until delivery, then is deleted — that rule is what stops the
queue becoming a shadow leads archive.

### Changes Required:

#### 1. The collection

**File**: `src/collections/Submissions.ts` (new)

**Intent**: Persist the envelope plus its delivery state, visible in the admin so a stuck row has a
surface, but not writable there (decision 2026-09-21).

**Contract**: `CollectionConfig` following the house style in `src/collections/Projects.ts` — a typed
const, a one-line comment saying what the collection is, terse field literals. Fields:
`submissionId` (text, required, unique, indexed), `envelope` (json — the exact object that will be
signed and sent), `attempts` (number, default 0), `lastAttemptAt` (date), `lastError` (text).
Access: `read` requires an authenticated user; `create`, `update` and `delete` all return `false` —
server writes go through `overrideAccess`. `admin`: `useAsTitle: 'submissionId'`, a `defaultColumns`
set leading with `submissionId` and `attempts`, and a group that is not `'Content'` so it does not
sit among the editorial collections. Nothing here is `localized` — this is machinery, not content,
and `fallback: false` makes an unlocalized field the right default.

#### 2. Registration

**File**: `src/payload.config.ts`

**Contract**: Named import beside the other four collections (`:15-19`) and appended to the
`collections` array (`:37`).

#### 3. Migration

**File**: `src/migrations/<generated>.ts` + `.json`

**Intent**: Create the table. Schema only moves by migration here.

**Contract**: Generated with `pnpm migrate:create` **after the fields have settled** — not while
Phase 2 is still being edited, or the snapshot freezes mid-change and leaks a `DROP COLUMN` into the
next unrelated migration (`tech-stack.md:80`). Follows the `MigrateUpArgs`/`MigrateDownArgs` +
single `db.execute(sql\`…\`)` shape of the existing files. **A human applies it** with
`pnpm db:migrate:prod` — never an agent — and it goes up before the code that needs it.

#### 4. Queue persistence

**File**: `src/lib/content/submissions.ts` (new)

**Intent**: The only module that reads or writes the queue. It touches Payload, so it belongs in the
CMS tier by the `AGENTS.md:97-101` rule.

**Contract**: `enqueue(envelope)` writes a row and returns it; `listPending(limit)` returns rows
ordered oldest-first for the retry cron; `recordFailure(id, error)` increments `attempts` and stamps
`lastError`; `deleteRow(submissionId)` removes a delivered row. All use `overrideAccess: true`, since
the collection refuses writes through access control.

### Success Criteria:

#### Automated Verification:

- An integration test creates, reads and deletes a queue row through `getPayload`, and asserts a
  second write of the same `submissionId` is rejected by the unique index:
  `pnpm vitest run tests/int/submissions.int.spec.ts`

#### Manual Verification:

- The collection appears in the admin, outside the Content group, and offers no Create button;
  opening a row shows its fields without editable controls.

---

## Phase 3: Envelope and signing

### Overview

The two pure modules where the wire contract actually lives, plus the fixture that pins them. This
is the phase that keeps the two hand-copied schemas from drifting, so it is tested hardest.

### Changes Required:

#### 1. The envelope builder

**File**: `src/lib/contact/envelope.ts` (new)

**Intent**: Turn validated form values, a `submissionId` and a list of uploaded assets into the exact
object the contract describes. Payload-free, so it sits with the form domain.

**Contract**: Produces the envelope named in `landing-intake-contract.md`: `submissionId`,
`submittedAt`, `formId`, `formName`, the typed answers (`name`, `email`, `phone`, `address`, `scope`,
`area`, `message`), `rawData`, `formQuestions`, and `assets`. **No `locale`** (decision 2026-09-21).
`formQuestions` is built from the **default (Polish) dictionary** via
`getTranslations(i18n.defaultLocale).form`, keyed by field name — the same key-doubles-as-label
convention the form itself uses (`contact-form.tsx:36`). Empty answers are omitted rather than sent
as empty strings.

#### 2. The signer

**File**: `src/lib/contact/sign.ts` (new)

**Intent**: One function for both directions — signing the outbound forward and verifying the
inbound callback.

**Contract**: `sign(rawBody: string, secret: string): string` returning `sha256=` + hex
HMAC-SHA256, and `verify(rawBody, signature, secret): boolean` using a length-guarded
`timingSafeEqual`. Built on `node:crypto`; no dependency is added. **The HMAC is computed over the
exact bytes sent** — the caller serialises once and both signs and sends that same string. A
re-`JSON.stringify` on either side changes key order or spacing and the signature stops matching.

#### 3. Pin the fixture

**Files**: `tests/fixtures/landing-submission.ts`, `tests/unit/envelope.spec.ts` (new)

**Intent**: Make the shared fixture load-bearing rather than decorative — a sender-side change that
breaks the envelope breaks a test.

**Contract**: The fixture gains a `satisfies` clause against the envelope builder's return type (it
was committed untyped because no such type existed yet). A unit test asserts that the builder, given
the fixture's answers, produces exactly the fixture's envelope. **`locale` is removed from the
fixture**, and the same removal must land in `wykonczymy/src/__tests__/fixtures/landing-submission.ts`
and in the envelope table of both copies of `landing-intake-contract.md` — coordinate with the agent
working in that repo rather than editing around them, and check whether any test there asserts on
`locale` before removing it.

### Success Criteria:

#### Automated Verification:

- The builder reproduces the shared fixture exactly: `pnpm vitest run tests/unit/envelope.spec.ts`
- Signing round-trips and rejects a tampered body, a wrong secret and a truncated signature:
  `pnpm vitest run tests/unit/sign.spec.ts`

#### Manual Verification:

- A signature produced here is accepted by the real endpoint — send one hand-built envelope with
  `curl` against the preview deploy of the leads app and confirm a `200` rather than a `403`.

---

## Phase 4: The upload path

### Overview

The browser uploads straight to this site's blob store under a token that structurally cannot
address anything but `leads/<submissionId>/`. The bytes never enter a function, so Vercel's 4.5 MB
request cap never applies.

### Changes Required:

#### 1. The token route

**File**: `src/app/api/blob/upload-token/route.ts` (new — the first Route Handler outside the Payload
group, so `src/app/api/` is created here)

**Intent**: Mint a short-lived client upload token, but only for a visitor who has already filled in
a valid enquiry. A public marketing form has no user to authenticate, so form validity is the gate.

**Contract**: `POST`, wrapping `handleUpload` from `@vercel/blob/client`. In `onBeforeGenerateToken`:
re-run `contactSchema` **server-side** over the fields carried in `clientPayload` and refuse if it
fails; require a well-formed uuid `submissionId`; then return a token pinned with
`pathname` scoped to `leads/<submissionId>/`, `allowedContentTypes` covering images and
`application/pdf`, and `maximumSizeInBytes` of 8 MB. The prefix pin is load-bearing: the store root
holds this site's CMS media written with `allowOverwrite: true` under exact filenames
(`scripts/blob-upload.ts:52-58`), so without it an anonymous visitor holding a valid token could
name an upload after a CMS image and replace it. `onUploadCompleted` does not fire against
localhost — do not put anything load-bearing in it.

#### 2. Prefix derivation

**File**: `src/lib/blob/prefix.ts` (new)

**Intent**: One place that knows how a submission maps to a blob path, imported by the token route,
the callback receiver and the sweep. Payload-free, hence its own directory rather than `lib/content/`.

**Contract**: `leadPrefix(submissionId: string): string` returning `leads/<submissionId>/`, plus the
`LEADS_PREFIX` root constant the sweep lists. Nothing else in the repo may build this path by hand.

#### 3. Client-side file guards

**File**: `src/lib/contact/attachments.ts` (new)

**Intent**: Refuse a file before the visitor waits through an upload that will be rejected anyway.

**Contract**: A pure function taking `File[]` and returning either the accepted list or a
`FormMessageKeyT`. Limits mirror the token route exactly — at most 15 files, 8 MB each, images and
PDF only. Duplicating the ceilings is deliberate: the client copy is UX, the token copy is
enforcement, and only the second one is a guarantee.

#### 4. Lifting the files

**File**: `src/components/footer/contact-form/contact-form-attachments.tsx`

**Intent**: Make the dead input real by letting the parent own the selection.

**Contract**: State changes from `string[]` of names to `File[]`; the rendered list maps over
`files.map(f => f.name)`. The component gains `files` and `onFilesChange` props so the form owns the
array. It needs an explicit reset path: `formApi.reset` will not clear it, and the native input's
`value` must be cleared too or re-picking the same file fires no `change` event.

#### 5. New message keys

**Files**: `src/lib/i18n/locales/pl.json`, `src/lib/i18n/locales/en.json`

**Contract**: `fileTooLarge`, `tooManyFiles`, `unsupportedFileType`, `uploadFailed` added to the
`form` namespace in both locales.

### Success Criteria:

#### Automated Verification:

- The file guards accept a valid set and return the right key for each rejection — oversize, too
  many, wrong type: `pnpm vitest run tests/unit/attachments.spec.ts`
- The token route refuses an invalid form payload and a malformed `submissionId`, and pins the
  pathname for a valid one, with `@vercel/blob/client` mocked at the module boundary:
  `pnpm vitest run tests/unit/upload-token.spec.ts`

#### Manual Verification:

- On a preview deploy, attaching two images and a PDF and submitting puts exactly those objects
  under `leads/<submissionId>/` in the blob store and nothing at the root.
- Picking a 20 MB file shows the size error without any network request.
- Picking the same file twice in a row still registers the second pick.

---

## Phase 5: Delivery

### Overview

Store, answer the visitor, then forward. The order is the whole point: the thank-you rests on the
local write, never on the other app answering.

### Changes Required:

#### 1. The forward

**File**: `src/lib/contact/forward.ts` (new)

**Intent**: Send one envelope to the leads app and classify the reply into "done" or "retry",
according to the contract's status table.

**Contract**: Serialises the envelope **once** to a string, signs those exact bytes, and `POST`s them
with `content-type: application/json` and the `x-landing-signature` header to
`WYKONCZYMY_WEBHOOK_URL`. Returns a discriminated result: delivered on any `2xx` **and on `4xx`** —
`200` means stop retrying, and a `400`/`403` is a bug that retrying cannot fix, so it must be
surfaced rather than looped. Retry only on `5xx` and on a transport error or timeout.

#### 2. The action gains its sink

**File**: `src/lib/contact/submit-contact-form.ts`

**Intent**: Replace the "No sink yet" comment with the store → answer → forward sequence.

**Contract**: After validation, build the envelope, `enqueue` it, and return `{ ok: true }`. The
forward runs in an `after()` callback from `next/server` — scheduled after the response, so the
visitor is not waiting on the leads app. The queue row is committed **before** the return, not inside
the callback. On a delivered result the callback deletes the row; on a retryable one it records the
failure and leaves the row for the cron. The action's input widens to carry `submissionId` and the
uploaded asset descriptors; it re-validates both rather than trusting them. Its result type is
unchanged, so the form's existing error handling still holds.

#### 3. Wiring the form

**File**: `src/components/footer/contact-form/contact-form.tsx`

**Intent**: Upload on submit, then send.

**Contract**: Inside the existing `onSubmit` (`:68-89`), between `setIsSent(false)` and the action
call: mint a `submissionId` with `crypto.randomUUID()`, run the file guards, upload each file with
`upload()` from `@vercel/blob/client` pointed at the token route, and pass the resulting descriptors
plus the id to `submitContactForm`. An upload failure sets `serverError` to `t('uploadFailed')` and
returns, exactly as the existing catch does. Because this is awaited inside `onSubmit`, the
`<form.Subscribe>` busy state covers it with no new state. On success, clear the lifted file array
alongside `clearDraft()` and `formApi.reset()`.

### Success Criteria:

#### Automated Verification:

- The forward classifies each row of the contract's status table correctly — `200`, `400`, `403`,
  `500`, and a thrown transport error — with `fetch` mocked:
  `pnpm vitest run tests/unit/forward.spec.ts`
- The action enqueues before returning and deletes the row on a delivered forward, with the queue
  module mocked: `pnpm vitest run tests/unit/submit-contact-form.spec.ts`

#### Manual Verification:

- A real submission on a preview deploy appears in `/zgloszenia` with its files attached, and its
  queue row disappears.
- With `WYKONCZYMY_WEBHOOK_URL` pointed at a dead host, the visitor still sees the thank-you and the
  queue row survives with `attempts: 1` and a `lastError`.

---

## Phase 6: Scheduled work and cleanup

### Overview

The three things that close the lifecycle: retrying what did not deliver, deleting what did, and
reclaiming what no submission ever claimed.

### Changes Required:

#### 1. Cron declarations

**File**: `vercel.json` (new)

**Intent**: Declare the retry and sweep schedules. This repo has no Vercel config file at all yet.

**Contract**: A `crons` array with two entries: the retry route on a frequent schedule, the sweep
daily. Plain `vercel.json` rather than `vercel.ts` — the latter needs `@vercel/config`, and a
two-entry cron list is not worth a new dependency in a landing page.

#### 2. Retry cron

**File**: `src/app/api/cron/deliver-pending/route.ts` (new)

**Intent**: Deliver what the `after()` callback could not.

**Contract**: `GET`, refusing any request without the `CRON_SECRET` bearer token. Reads
`listPending`, forwards each through the Phase 5 module, deletes delivered rows and records failures
on the rest. Bounded per run so one poisoned row cannot starve the others.

#### 3. The callback receiver

**File**: `src/app/api/webhooks/landing-delivered/route.ts` (new)

**Intent**: Accept the leads app's confirmation and drop the staged bytes.

**Contract**: Built to the **Callback** section of `landing-intake-contract.md`. `POST`, reading the
**raw** body with `request.text()` before parsing so the signature is verified over the exact bytes;
`403` on a bad or missing `x-landing-signature`; `400` if the body is not JSON or `submissionId` is
not a uuid; otherwise list `leadPrefix(submissionId)` and delete what is there, answering `200` —
including when the prefix is already empty, so a replay is idempotent. **The body's `submissionId`
is the only input**; the target list is re-derived from this side's own prefix, never taken from the
caller.

#### 4. The age sweep

**File**: `src/app/api/cron/sweep-orphans/route.ts` (new)

**Intent**: Reclaim uploads from visitors who closed the tab — bytes no queue row ever claimed and no
callback will ever mention.

**Contract**: `GET`, `CRON_SECRET`-guarded, and **gated on `VERCEL_ENV === 'production'`**, returning
without acting anywhere else. The gate is not hygiene: Preview and Production share one blob store,
so `leads/` is a shared prefix and a sweep run from preview would delete files belonging to
submissions still retrying in production. Lists `LEADS_PREFIX` only — never the store root, where
this site's CMS media lives — and deletes a prefix only when **both** conditions hold: its objects
are older than a fixed window **and** its `submissionId` matches no live queue row. Age alone would
race a submission still retrying; the queue check alone cannot see a submission that was never
created.

#### 5. Firewall rules

**Intent**: Rate-limit the two public paths without a dependency (decision 2026-09-21).

**Contract**: Rules in the Vercel dashboard covering the token route and the form action path. They
live outside the repo, so they are a manual check and are recorded as one.

### Success Criteria:

#### Automated Verification:

- The callback receiver returns `403` on a bad signature, `400` on a non-uuid, and `200` on both a
  populated and an already-empty prefix, with the blob client mocked:
  `pnpm vitest run tests/unit/landing-delivered.spec.ts`
- The sweep is a no-op when `VERCEL_ENV` is not `production`, and spares a prefix that is young or
  still has a queue row: `pnpm vitest run tests/unit/sweep-orphans.spec.ts`
- Both cron routes refuse a request with no `CRON_SECRET`:
  `pnpm vitest run tests/unit/cron-auth.spec.ts`

#### Manual Verification:

- After a real delivered submission, the `leads/<submissionId>/` prefix is empty and the CMS media at
  the store root is untouched.
- The Firewall rules are in place on both public paths and a burst of requests is throttled.
- The retry cron drains a row that was left behind by a failed forward.

---

## Testing Strategy

### Unit Tests:

- The envelope builder against the shared fixture — the one test that catches wire drift.
- Signing: round-trip, tampered body, wrong secret, truncated signature.
- The forward's classification of every row in the contract's status table.
- File guards: each rejection reason maps to its own message key.
- The token route's refusals and its pathname pin, with `@vercel/blob/client` mocked.
- The callback receiver and the sweep, with the blob client mocked.

### Integration Tests:

- The queue collection through `getPayload`: create, read, delete, and the unique-index rejection.

### Manual Testing Steps:

1. Submit the real form on a preview deploy with two images and a PDF; confirm the lead and its files
   in `/zgloszenia`.
2. Confirm `leads/<submissionId>/` is empty afterwards and the queue row is gone.
3. Point `WYKONCZYMY_WEBHOOK_URL` at a dead host; confirm the visitor still sees the thank-you and a
   queue row survives with a recorded failure, then that the cron drains it once the host is back.
4. Attach an oversize file and a `.zip`; confirm both are refused client-side with the right message.
5. Confirm the CMS media at the blob store root is untouched by any of the above.

## Performance Considerations

The bytes never cross a function in either direction on this side — the browser uploads directly and
the leads app fetches. The only sizing question is the retry cron's per-run bound, which exists to
stop one poisoned row starving the queue rather than for throughput: this is a landing page, and the
expected volume is a handful of submissions a day.

## Migration Notes

One new table, created by one migration generated after Phase 2's fields settle. **A human applies
it** with `pnpm db:migrate:prod`, before the code that needs it is deployed. There is no existing
data to carry across. `down` drops the table; since a queue row's whole life is "until delivery",
losing the table loses only undelivered submissions — take the dump anyway, as `db:migrate:prod`
does automatically.

## Whole-tree Gate

Run **once**, after the final phase.

- Type checking passes: `pnpm typecheck`
- Linting passes: `pnpm lint`
- Integration suite passes: `pnpm test:int`
- E2E suite passes: `pnpm test:e2e`
- Build succeeds: `pnpm build`

## References

- Related research: `context/changes/2026-09-18-lead-delivery/research.md`
- The wire contract, including the new Callback section:
  `context/reference/landing-intake-contract.md`
- Decisions: `context/changes/2026-09-18-lead-delivery/change.md`
- The receiving endpoint this is built against:
  `/workspace/yolo/wykonczymy/src/app/(frontend)/api/webhooks/landing/route.ts`
- The form slice this extends: `context/archive/2026-09-17-s2-contact-form/`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Foundations — env, dependencies, the address field

#### Automated

- [x] 1.1 Contact schema unit tests pass, including address accepted and capped — 8c892e8
- [x] 1.2 The form render test still passes — 8c892e8

### Phase 2: The submissions queue

#### Automated

- [x] 2.1 Integration test creates, reads and deletes a queue row, and the unique index rejects a duplicate — d084cef

### Phase 3: Envelope and signing

#### Automated

- [x] 3.1 The builder reproduces the shared fixture exactly — d049698
- [x] 3.2 Signing round-trips and rejects tampered body, wrong secret, truncated signature — d049698

### Phase 4: The upload path

#### Automated

- [x] 4.1 File guards return the right message key for each rejection — 31213a5
- [x] 4.2 The token route refuses invalid payloads and pins the pathname — 31213a5

### Phase 5: Delivery

#### Automated

- [x] 5.1 The forward classifies every row of the contract's status table — 11b24c9
- [x] 5.2 The action enqueues before returning and deletes the row on delivery — 11b24c9

### Phase 6: Scheduled work and cleanup

#### Automated

- [x] 6.1 The callback receiver returns 403 / 400 / 200 per the callback status table
- [x] 6.2 The sweep is a no-op outside production and spares young or claimed prefixes
- [x] 6.3 Both cron routes refuse a request with no CRON_SECRET
