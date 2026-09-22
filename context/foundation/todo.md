# TODO — what is left

Compacted from `roadmap.md`, `manual-checks.md` and the open change folders, pruned 2026-09-22. It
is an index, not a source: every line points at the document that holds the real detail, and that
document stays the place a claim is settled. **Finished items are deleted from here rather than
ticked** — the document they point at keeps the record and the reasoning.

Everything the roadmap calls a slice is built and in production. What remains is one slice (S8),
verification that needs a human at a browser, four decisions, and housekeeping.

## Blocks cutover

- [ ] **S8 itself** — the FR-037 assertions over all twelve addresses in `url-map.md`, removing the
      pre-cutover noindex from `robots.ts` and the layout, DNS onto the `www` canonical host. The
      redirects for the four retired addresses are already shipped and live, so S8 **asserts** them
      rather than building them, and asserts `308` — which is what `permanent: true` emits, not
      `301`. → `roadmap.md` § S8
- [ ] **The staged `leads/<submissionId>/` prefix disappears after a delivery.** The callback is
      wired: `LANDING_CLEANUP_URL` is set on the leads app and it was redeployed, and the landing's
      `/api/webhooks/landing-delivered/` answers `403` to a bad signature on the public alias, which
      proves it is reachable. Unproven is the round trip — it needs one real submission carrying a
      photo. → `manual-checks.md` § EX-802
- [ ] **Honeypot survives Chrome autofill.** The trap field is `website` because Chrome maps
      `company` to `organization` regardless of `autoComplete`. A false trip discards a real enquiry
      while showing the visitor a thank-you — silent on both sides, the worst failure this slice can
      have. → `manual-checks.md` § EX-802

## After DNS

- [ ] **Every env var still names a `*.vercel.app` host.** Five variables across the two projects,
      two of which fail silently; `NEXT_PUBLIC_SERVER_URL` is build-time, so it needs a redeploy and
      not just an edit. Ordered runbook and the done-when probes → **EX-853**.

## Decisions owed

- [ ] **"O nas"** — its own page or a section on home. Nothing is ported until this is settled.
      → `context/changes/2026-09-04-tdg-port/todo.md`
- [ ] **OQ 4 — is Cennik's removal final?** Recorded as probable, not settled. If it stays, two
      success criteria and one guardrail change and S8 grows a page.
- [ ] **OQ 2 / OQ 7 — file limits and retention.** Accepted types, max size, max count, and how long
      photos and contact details are kept. A policy decision; the build does not wait on it.
- [ ] **Ratify where the four retired addresses land.** They all go to the home page today and have
      since 2026-09-04. Accept that, or name a different target for the pricing pair — one line in
      `next.config.mjs`. **Nothing waits on this**; it is here so the choice is recorded as a choice.
      → `url-map.md`

## Filed to Linear

- **EX-852** — alert when lead delivery is failing. A submission sat stranded for a day because the
  cron returns `200` whatever the numbers say, and a row at `MAX_ATTEMPTS` drops out of `listPending`
  for good. Two shapes written up in the issue; the alarm condition for either is a row the cron has
  stopped retrying.
- **EX-853** — the `*.vercel.app` swap above.

## Debt

- [ ] **`<html lang="pl">` on `/en/*`** contradicts the hreflang pairs S7 emits — verified live, the
      English home serves `lang="pl"` while advertising `hrefLang="en"` for itself. The effect in
      `translations-provider.tsx` fixes the live DOM, so assistive tech is covered and only a crawler
      sees the mismatch. Closing it properly needs the locale in a real route segment. **Low value:**
      Google reads content and hreflang, not this attribute. → `roadmap.md` § F2 deferred items
- [ ] **Manual checks still open** — F2 ×3 (all in the admin), S2 ×2 (placeholders in Safari and
      Firefox, VoiceOver announcing errors), S7 ×5, EX-817 ×8 (card heights, one per breakpoint).
      → `manual-checks.md`
- [ ] **`project-state.md` is stale** — still says `phase: foundations`, dated 2026-09-02, and
      describes a site with zero content. `AGENTS.md` names it as the first file to read, so every
      session starts from it. S8's status in `roadmap.md` was corrected 2026-09-22; the other slices
      still lag the code.
- [ ] **Three change folders unarchived** — `2026-09-18-lead-delivery` and `2026-09-20-s7-seo` are
      `implemented` and owe `/10x-archive`; `2026-09-04-tdg-port` has no `change.md` at all, so its
      review gate was never armed.

## Shortest path to cutover

**S8, then DNS, then EX-853.** Nothing else blocks the switch.
