# Lead delivery — landing_26 half — Plan Brief

> Full plan: `context/changes/2026-09-18-lead-delivery/plan.md`
> Research: `context/changes/2026-09-18-lead-delivery/research.md`

## What & Why

Build the sending half of `lead-delivery` in `landing_26`: the footer contact form currently
validates and throws the submission away. This plan gives it a sink — attachments upload straight to
blob storage, the submission is queued locally, forwarded HMAC-signed to the leads app, retried
until delivered, and its staged files deleted on confirmation.

## Starting Point

`submitContactForm` returns `{ ok: true }` with a "No sink yet" comment. Nothing else exists here: no
queue collection, no Route Handler outside Payload's catch-alls, no HMAC code, no `env.server.ts`, no
`vercel.json`, and the file picker is dead UI that stores filenames and never lifts a `File`. The
receiving half in `wykonczymy` is implemented and frozen, so every phase is verifiable against a real
endpoint rather than a guess.

## Desired End State

A visitor fills the form, optionally attaches photos or a PDF, and presses send. Files go straight
from the browser into `leads/<submissionId>/`, the submission is queued, the visitor is thanked, and
the envelope is forwarded in the background. The lead and its files appear in `/zgloszenia`, the
staged copies are deleted, and a delivery outage costs a retry rather than a lost lead.

## Key Decisions Made

| Decision | Choice | Why | Source |
| --- | --- | --- | --- |
| Rollout shape | One pass, attachments included | Splitting would ship a form whose picker still does nothing | Plan |
| Rate limiting | Vercel Firewall rules | Platform-level, no dependency in a landing page | Plan |
| `locale` on the wire | Dropped | The Server Action has no locale to send; the reader is a Polish salesperson | Plan |
| Queue in the admin | Visible, read-only | A stuck row needs a surface; an editable queue is a footgun | Plan |
| Callback spec | Written into the contract, both sides build now | Neither half exists yet; the spec is what lets them be built in parallel | Plan |
| Test strategy | Unit the pure parts, mock the blob | The browser→blob hop is a manual check, not a mockable unit | Plan |
| Ordering | Store, answer visitor, then forward via `after()` | The thank-you must rest on the local write, never on the other app | Research |
| Retry rule | Retry only on `5xx` / transport failure | `200` means stop, including on partial asset failure | Research |
| One blob store | Preview and Production share it | Owner's ruling, 2026-09-21 — forces the age sweep to be production-gated | Research |

## Scope

**In scope:** `env.server.ts` + new server secrets; `@vercel/blob` as a runtime dependency; the
`address` field; the submissions queue collection and its migration; the envelope builder, the
signer and the fixture that pins them; the client-upload token route and working attachments; the
forward and the `after()` sequencing; the retry cron, the callback receiver and the production-gated
age sweep; Firewall rules as a manual check.

**Out of scope:** any implementation in `wykonczymy` (another agent owns its callback sender — only
the contract, `change.md` and the shared fixture are kept in step); application-level rate limiting;
a staged rollout; live-blob or Playwright upload tests; the roadmap's stale S2/S6 statuses.

## Risks

- **The dropped `locale` ripples into three artifacts** — the contract's envelope table, the shared
  fixture (which still contains `locale: 'pl'`), and possibly a test in `wykonczymy`. Removing it
  needs coordinating with the agent working in that repo.
- **The blob prefix pin is load-bearing.** This site's CMS media sits at the store root under exact
  filenames with `allowOverwrite: true`; an unpinned token would let an anonymous visitor replace one.
- **The migration is applied by a human**, before the code that needs it deploys.
