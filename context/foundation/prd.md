---
project: "Wykończymy"
version: 1
status: draft
created: 2026-09-01
context_type: brownfield
product_type: web-app
target_scale:
  users: small
  qps: low
  data_volume: small
timeline_budget:
  delivery_weeks: null
  hard_deadline: null
  after_hours_only: false
---

# PRD — Wykończymy

> `timeline_budget.delivery_weeks` is deliberately `null`. The owner stated that timing is not a project constraint and asked that it not be resurfaced. This is a recorded decision, not a gap, and it is not carried into Open Questions.

## Current System Overview

**Purpose.** wykonczymy.com.pl is the marketing and lead-generation site for a renovation and interior-finishing contractor in Warsaw (ul. Terespolska 2, 03-813). Its job is to turn a search visitor into a free-quote request.

**Architecture.** A server-rendered WordPress monolith built on a purchased agency theme. Not headless, though its REST API is reachable.

**Tech stack (observed 2026-09-01).** WordPress on PHP 8.3.33 behind LiteSpeed. Built and maintained by an external agency; the owner does not control the code.

**Current user base.** Prospective renovation clients arriving from local search and from Facebook and Instagram. Scale is small — a single-city contractor.

**Core functionality today.**
- Six public pages in two languages: Start, Cennik, Oferta, Realizacje, Wykończenia, Kontakt.
- Twelve indexed URLs. English uses **translated slugs** rather than a locale prefix — `/en/offer/`, not `/en/oferta/`.
- A free-quote call to action appearing twice on the home page, backed by a form capturing name, phone, e-mail, project scope, square footage, and preferred contact time.
- Direct contact by phone (+48 505 805 425) and e-mail (biuro@wykonczymy.com.pl).
- A flat photo gallery of completed projects — no individual project pages.
- Client testimonials.
- No blog.

**Where leads go today.** Form submissions are forwarded from the WordPress site into a separate, independently deployed application that already owns the lead record, a lead dashboard, contact-status tracking, and lead notification. That application is a different product with its own roadmap and is **not** part of this project.

## Problem Statement & Motivation

The site works. The owner does not own it. It was built by an outside company on templates, so every change routes through someone else, the code cannot be shaped to the business, and the platform was never the owner's choice. The cost is control — no ability to evolve the layout, the content model, or the release process independently.

This project is a **replatform plus a new layout**: move onto a foundation the owner controls end to end, and redesign the presentation while doing it.

The motivation is ownership, not a measured failure. Nothing in the current site's conversion, speed, or credibility has been identified as broken. That distinction is load-bearing for how success is judged: **parity plus control**, not a lift in a metric the current site is failing. It also sets the risk posture — a replatform that changes everything at once while fixing nothing measurable has no upside to offset a regression, so preservation matters more here than improvement.

One capability gap does exist. The current form cannot accept files, and the owner wants the quote request to carry photos of the space. That is the single genuinely new capability in this project.

## User & Persona

**Primary persona — a Warsaw homeowner renovating a single flat.** A private, one-off client. Price-sensitive, comparing three or four contractors before making contact. Arrives from a local search for renovation or finishing work. Before picking up the phone they need two things: proof the work is good, and a sense of what it costs. The moment that matters is the gap between "this looks credible" and "I'll request the free quote".

**Secondary — the business's own content editor.** Whoever adds completed projects and adjusts page copy. Today they must go through the agency. After this change they edit directly, which is one of the project's reasons for existing.

**Unchanged.** No visitor ever authenticates, before or after. The site is anonymous to the public.

## Success Criteria

### Primary
- Every page on the current site has a working equivalent on the new site, and at cutover no existing address is left dead — each one either resolves or sends the visitor to a deliberate replacement.
- A real quote request submitted through the new site arrives complete in the contractor's lead system, verified end to end before the new site goes live.
- The business can add a completed project and edit page copy directly, in both languages, without touching code or asking a developer.
- A quote request can carry the homeowner's photos, and those photos are visible to the contractor alongside the rest of the request.

### Secondary
- The new layout reads as a portfolio piece for a finishing contractor rather than as a stock theme.
- Pages load faster than the current site — a consequence of the change, not a reason for it.
- Completed projects become individually addressable, creating pages that can rank for specific local searches which today have nowhere to land.

### Guardrails
- **Search positions do not drop.** Local renovation queries that rank today still rank after cutover.
- **No lead is lost.** Not during the transition, and not afterwards. A homeowner is never shown a success message for a request that did not arrive.
- **Both languages ship together.** An English-incomplete launch is a regression; the current site has both.
- **A verified replacement map gates the cutover.** Every live address is enumerated and checked against the new site before it becomes the live one.
- **Existing project photos and testimonials survive** the move intact.

## User Stories

### US-01: Homeowner requests a free quote with photos

- **Given** a Warsaw homeowner who has browsed the completed projects and decided the work looks credible
- **When** they complete the free-quote form — contact details, a description of the job, photos of the space — and consent to being contacted
- **Then** they see confirmation that the request was received, and it reaches the contractor's lead system with every answer and photo intact

**Different before:** the form could not accept files at all, so photos arrived later by e-mail or not at all, and the first call started from nothing.

#### Acceptance Criteria
- The request is delivered, or the homeowner is told plainly that it failed and given the phone number. A success message is never shown for a request that did not arrive.
- Photos arrive with the request and are viewable alongside its other answers.
- A retried or double-clicked submission produces one request, not two.
- A file that is too large or of an unaccepted type is refused with the reason stated, before the homeowner waits through an upload that will be rejected.
- Consent is captured explicitly and recorded with the request.
- The flow behaves identically in Polish and English.

### US-02: Editor publishes a completed project

- **Given** an editor who has finished a renovation and has photos of it
- **When** they sign in and create a project entry with photos and a description, in both languages
- **Then** it appears in the completed-projects listing and on its own page, without a developer being involved

**Different before:** projects were photos added to a single flat gallery, through the agency, with no individual pages.

#### Acceptance Criteria
- The new project is reachable at its own address and appears in the listing.
- Both language versions are editable by the same person in the same place.
- The editor cannot alter page structure or site configuration in the process.

### US-03: Returning visitor follows an old link

- **Given** someone with a bookmark, or a search result pointing at the current site
- **When** they follow it after the new site is live
- **Then** they arrive at the equivalent page, or at a deliberately chosen replacement — never at an error

**Different before:** n/a — this is a preservation requirement created by the change itself.

## Scope of Change

Requirement ids are carried from the shaping notes so the two documents stay cross-referenced.

### Added

- FR-008: A visitor can open an individual completed project and see its photos and description at its own address.
- FR-016: An editor can create a project entry with photos, a description, and its own address, in both languages.
- FR-019: An editor cannot alter the content model, site structure, or configuration.
- FR-020: An administrator can change the content model, site configuration, and how the site is released.
- FR-021: An administrator can create, suspend, and remove editor accounts.
- FR-031: A visitor can attach one or more files to a quote request — photos of the space, plans, inspiration images.
- FR-032: A visitor can see what happens to their data before submitting, and give explicit consent to being contacted.
- FR-034: A visitor whose request cannot be delivered is told so plainly and given the phone number.
- FR-035: A visitor is prevented from submitting a file that is too large or of an unaccepted type, and is told why before the upload.
- FR-036: Automated submissions are refused before they reach the lead system.

### Modified

- FR-007: The completed-projects listing keeps its address but becomes a listing of individually addressable projects rather than a flat gallery.
- FR-015: An editor signs in to a content admin they control, rather than one held by an agency.
- FR-017: An editor can edit the copy on the remaining pages, in both languages.
- FR-018: An editor can add and edit client testimonials.
- FR-030: A visitor can request a free quote by submitting contact details and a description of the job. The form asks more than it does today.

### Removed

- **Cennik.** The pricing page is retired rather than rebuilt. Its two addresses need deliberate replacements (Open Question 3). Retiring it forfeits ranking on high-intent pricing searches, which is a known and accepted cost.

### Preserved

These are not assumptions. Each is a requirement whose breakage is a defect.

- FR-001: The home page remains at its current addresses in both languages.
- FR-002: The services offer remains at its current addresses.
- FR-003: The finishes / interior styles page remains at its current addresses.
- FR-004: The contact page remains at its current addresses.
- FR-005: Client testimonials remain readable.
- FR-006: The company's Facebook and Instagram profiles remain reachable.
- FR-009: Photos from the current gallery remain viewable, carried across as a gallery. Individual project pages exist for new projects only; the older photos are not retro-fitted with them.
- FR-010: A visitor can call the company directly from the phone number on any device.
- FR-011: A visitor can switch language and land on the translated equivalent of the page they were on.
- FR-012: Any address that exists on the current site leads to a working page.
- FR-013: A search engine can crawl a listing of all public pages in both languages.
- FR-014: A search engine can read each page's title, description, canonical address, and correct language pairing between Polish and English.
- FR-033: A visitor receives confirmation that their request was received.

### Explicitly outside this project

- The lead dashboard, lead notification, contact-status tracking, and the existing recovery sweep. These live in a separate application with its own roadmap.
- **One dependency crosses the boundary:** the contractor must be able to view a request's attached photos alongside its other answers. FR-031 is only half-delivered without it. This is work in the other application, sequenced against this project but not owned by it.

## Constraints & Compatibility

**Cutover is all-at-once.** Every page is rebuilt and the switch happens in one move. There is no phase where the old and new sites both serve live traffic. This is a deliberate choice — at six pages, running two systems in parallel costs more than it protects. The consequence is that every preservation risk lands at the same moment, which is why the verified replacement map is a guardrail rather than a task.

**Addresses must survive.** Twelve addresses are indexed today. English uses translated slugs rather than a locale prefix, so preserving them requires per-language address mapping, not a simple language prefix. Every address either survives or gets a deliberate replacement; none may be left to fail.

**Content must survive.** Existing project photos and client testimonials move across intact. Nothing is re-shot or re-collected.

**Both languages are one deliverable.** The current site has Polish and English. Shipping one without the other is a regression, not a phase.

**The lead contract belongs to someone else.** Quote requests terminate in a separate application that this project does not control. Two consequences follow:

- Whatever the form asks a homeowner must map onto what that application can record. The form's design is constrained by a system outside this project's authority.
- **The current intake cannot carry files.** It accepts a flat set of text answers and has nowhere to put an attachment. FR-031 therefore cannot be delivered by conforming to what already exists — the receiving application has to gain the ability to accept and hold attachments. This is a fact about the existing contract, not a preference between designs.

**Delivery is a cross-system guarantee.** "No lead is lost" now spans two independently operated systems. It requires an explicit failure story — what the homeowner sees, and what becomes of their answers, when the receiving system is unreachable mid-submission. A silent failure here is the most expensive defect this project can ship, because it is invisible: the business cannot miss a lead it never knew about.

**Duplicate protection is required.** The receiving system identifies a request by an identifier supplied by the sender. Without a stable one, an ordinary retry or a double-click creates a second copy of the same request. The new site must supply one.

**Personal data.** Photographs of someone's home submitted with contact details are personal data. Consent must be explicit and recorded with the request, and the retention question travels with it.

## Business Logic Changes

**The rule, unchanged in kind:** turn an anonymous search visitor into a qualified, contactable lead carrying enough project detail that the first phone call can be about the work rather than about the basics.

**What changes is the richness of capture, not the rule.** The form asks more than it does today and, for the first time, accepts photographs of the space. Nothing is computed and nothing is returned to the visitor — the owner has explicitly ruled out an estimate, a price calculator, or a branching questionnaire. The site decides nothing on the homeowner's behalf.

This is a marketing and lead-capture product, not an application. Its domain value is concentrated in the **reliability and richness of capture**, not in computation. A request that arrives with photographs and a described scope is worth materially more than a name and a phone number; a request that silently fails to arrive is worth nothing at all. Everything of value in this product sits on that axis, which is why the guardrails are weighted toward delivery and preservation rather than toward conversion.

## Access Control Changes

**Unchanged for the public.** No visitor ever authenticates. There are no accounts, no gated pages, and no login on any public route — before or after.

**Changed for staff.** Content is edited today through an administration area whose credentials are effectively held by the agency. That is part of the ownership problem this project exists to solve. After the change, the same function is owner-controlled and gains a role split it does not have today:

- **Administrator** — full access: the content model, site configuration, releases, and account management.
- **Editor** — content only: add and edit completed projects, adjust page copy, manage both language versions. Cannot alter the content model or the structure of the site.

The split is an addition, not parity. Its purpose is to let the business publish work and fix copy without being able to break the structure underneath — which is also why a visual page-builder is not required (see Non-Goals).

## Non-Goals

Each entry traces to something the owner stated explicitly.

- **No price estimator or calculator.** The form asks more but returns nothing computed. This rules out the most common scope-creep direction for a contractor site.
- **No multi-step wizard.** More questions and file inputs, not a branching questionnaire.
- **Cennik is not rebuilt.** The pricing page is retired, not ported.
- **No visitor accounts.** The public site stays anonymous; authentication exists only for editing content.
- **No conversion-optimisation programme.** This project is driven by ownership, not by a measured funnel failure. Improvements are welcome but are not success criteria, and no conversion target gates the work.
- **The lead dashboard is not rebuilt.** Lead management already exists in a separate application and is not this project's work.
- **No blog.** The current site has none and none is introduced.
- **No page-builder for editors.** Editors change content within fixed page structures. Consistent with the access model: if editors cannot alter structure, structure-editing machinery serves nobody.

## Open Questions

1. **What exactly does the form ask?** — The scope is settled: more questions than today plus file inputs, with no estimate returned. The specific question list is not. A content decision, not an architectural one. Owner: user. Block: no.
2. **What are the file limits?** — Accepted types, maximum size, maximum count per request. Needed to deliver FR-035, and needed by the receiving application too. Owner: user. Block: no.
3. **Where do the two retired pricing addresses lead** once Cennik is gone? — Candidates are the services page, the contact page, or the home page. Determines whether high-intent pricing traffic is retained or discarded. Owner: user. Block: no; required before cutover.
4. **Is Cennik's removal final?** — Recorded as the owner's stated intention, expressed as probable rather than settled. Two success criteria and one preservation guardrail change if it stays. Owner: user. Block: no.
5. **Where do quote requests actually land today?** — Believed to be the business e-mail address plus the separate lead application, but the current site may also record them elsewhere. Must be confirmed before cutover, since lead delivery is a guardrail and the current behaviour is the thing being preserved. Owner: user. Block: yes, before cutover.
6. **How do attachments reach and persist in the receiving application?** — A new or extended intake plus somewhere to hold the files is required. Routine to build; the one judgement worth carrying is that the receiving application should own the stored files, so a request's photos do not depend on the marketing site's storage outliving it. Owner: user. Block: no; sequenced with the other application.
7. **What is the retention period for submitted photographs and contact details?** — Personal data with no stated retention window. Not currently recorded anywhere. Owner: user. Block: no.
