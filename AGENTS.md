# Repository Guidelines

`landing_26` (project `wykonczymy-www`) — replatform of **wykonczymy.com.pl**, the marketing and
lead-generation site for a Warsaw renovation contractor, from WordPress to Payload + Next on Vercel.
Canonical, cross-tool agent onboarding file.

> **This repo has no application code yet.** Docs only — see **Where things stand** at the bottom.
> Conventions (structure, testing, commands) get written here *after* the scaffold lands, not
> invented in advance.

## STOP if you can't run what this file references

This file assumes **Claude Code**. If a step references a skill, command, or tool you don't have:
do **not** improvise a substitute, skip it silently, or guess an equivalent. **Stop, name the
missing capability and what you were about to do, and wait for the human.**

## Reference repos — three, all read-only

Named throughout this file. **Nothing outside `landing_26` is ever edited** — work flows one way,
read there, write here. Roles and the rules for copying from each →
`@context/foundation/references.md`.

| Name | Path | What it is |
|---|---|---|
| **Chaos Kitchen** | `/workspace/nomad_chef` | Live site on this exact stack — the default answer to "how do we do X here" |
| **tdg** | `/workspace/_old_repos/tdg` | The agency's WordPress template — the only real built markup for this site |
| **leads app** | `/workspace/yolo/wykonczymy` | Where quote requests land — a separate product with its own roadmap |

## Hard rules (read first)

- **tdg is never edited and nothing is deleted from it** — the owner has restated this more than
  once. What gets carried across is the owner's call, named file by file; do not produce
  keep/remove recommendations for it unasked.
- **Commit only your own work, by explicit path.** Multiple agents run against these trees;
  `git add -A` sweeps up another agent's in-flight work.
- **Use** `pnpm` — not npm, not yarn. Chaos Kitchen is on npm, so its `db:*` scripts need their
  `npm run` calls swapped on the way in.
- **Install latest *mature*.** Do **not** copy version numbers out of the reference repos; they are
  a snapshot of what those projects happened to have. But "latest" is not "published this morning":
  `minimumReleaseAge: 1440` in `pnpm-workspace.yaml` makes Vercel refuse a lockfile containing
  anything under a day old, and `pnpm add` pins today's version by default — widen the range so a
  mature fallback exists. This cost a failed production deploy; see
  `@context/foundation/stack-template.md`. The only pinned majors are decisions: Payload 3,
  React 19, Tailwind 4, `postgres:17-alpine`.
- **Payload owns the** `src/` **layout** — `src/app/(payload)/{admin,api}`, `payload.config.ts`,
  `withPayload()` wrapping the Next config. App Router only.
- **Never write to** `context/archive/` — archived changes are immutable. All project docs live
  under `context/`; there is no root `docs/`.
- **Timeline is not a project constraint.** Do not raise it, estimate it, or ask about it.
- **This is not a client handover.** The business belongs to the developer's brother and the developer
  keeps control indefinitely. Never justify scope with "otherwise the client would have to pay a
  developer" — there is no such client, so handover-proofing is a cut. This is **not** a licence to
  hardcode content: **all content data lives in the CMS** — copy, images, prices, list items are
  Payload fields, whoever edits them. What code owns is **structure**: layout, navigation, design,
  and the components themselves. **No block builder** — Payload's blocks / layout-builder machinery
  is not used; a page is a fixed layout whose typed fields the admin fills, never rearranges.

## The two landmines

- **The twelve indexed addresses are a guardrail, and three things about them are easy to break.**
  The canonical host is `www.`; every address ends in a **trailing slash**, so `trailingSlash: true`
  is required in the Next config or all twelve break at once; and PL/EN use translated slugs
  (`/oferta/` ↔ `/en/offer/`), held as a localized Payload `slug` field. The enumerated map is
  `@context/foundation/url-map.md` — it is the spec to test against, not a historical note.
- **Photo attachments (FR-031) cannot use the existing lead intake.** The leads app
  (`/workspace/yolo/wykonczymy`) accepts a flat set of text answers with nowhere to put a file. That
  is a fact about the existing contract, not a preference — delivering the requirement needs work
  **in that repo**, which is a separate product this project does not own.

## Stack, deploy, local DB

Layer table, rationale, and the two tdg migration frictions (Tailwind 3→4 class migration;
`WpImageT` → Payload media retyping) → `@context/foundation/tech-stack.md`.

**Before touching scaffold, deploy or environment config, read
`@context/foundation/stack-template.md`** — a follow-top-to-bottom runbook for standing this stack
up on Vercel. It is the seed for a reusable starter, so keep it free of anything specific to this
site.

- Local Postgres runs in Docker on **port 5436** — 5433/5434/5435 are taken by other projects on this
  machine. Wired in `@docker-compose.yml` / `@.env.example`.
- Deployed to Vercel on the **same account as the leads app** — deliberate, removes cross-org access
  problems. Use the `vercel:*` skills to talk to Vercel rather than guessing its API.
- `create-payload-app` **needs a TTY and cannot be run by an agent.** The owner runs it; the exact
  command is in `tech-stack.md`.

## Claude Code workflow

> The user's global rules in `~/.claude/rules/*` are the **single source** for response style, git,
> comments, and tooling conventions — this file deliberately does not restate them.

> **Workflow = 10x, not superpowers** — use the `/10x-*` skills for research/plan/implement/review.

Close out **every change that has its own** `context/changes/<id>/` **folder** by running the
`slice-review-gate` skill; having a change folder *is* the trigger. Only trivial folder-less edits
skip it.

## Where things stand

**Don't propose conversion-optimisation work — it is an explicit non-goal.** Success is measured as
parity with the current site plus editorial control, not a lift in a metric; nothing about the
current site's conversion, speed or credibility has been identified as broken. Rationale →
`@context/foundation/prd.md` (`## Problem`).

**The work is sequenced in `@context/foundation/roadmap.md`** — two Foundations slices then eight
vertical ones, in dependency order, with what blocks each. Pick an item and run `/10x-plan <id>`.
Nothing is owed on the documentation; it was completed 2026-09-02.

Read `@context/foundation/project-state.md` first — decisions taken, what was rejected and why, and
the ordered next steps. Then `@context/foundation/prd.md` (11-section brownfield PRD; its
`## Open Questions` holds the eleven open items — only "where do quote requests land today" blocks
cutover, none block building) and `@context/foundation/references.md`.

Content for populating early versions: `@context/foundation/live-site-snapshot/scraped-content.md`
— scraped 2026-03-04, so **spot-check against the live site before trusting it for cutover**;
prices in particular may have moved.
