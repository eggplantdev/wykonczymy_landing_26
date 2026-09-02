---
project: "Wykończymy"
context_type: brownfield
created: 2026-09-01
updated: 2026-09-01
checkpoint:
  current_phase: 8
  phases_completed: [1, 2, 3, 4, 5, 6, 7]
  gray_areas_resolved:
    - topic: "context type"
      decision: "brownfield — live WordPress site is the baseline; this repo is scaffolding only"
    - topic: "rebuild motivation"
      decision: "replatform for code ownership and control, plus a new layout — not a conversion/perf/design complaint"
    - topic: "primary persona"
      decision: "Warsaw homeowner renovating a single flat"
    - topic: "access model"
      decision: "two roles — admin (schema, config, deploy) and editor (content only)"
    - topic: "realizacje content model"
      decision: "becomes a Payload collection with per-project detail pages; existing photos migrate as a flat gallery with no backfilled detail pages, new projects get full entries"
    - topic: "cennik"
      decision: "likely removed entirely — 301 targets for /cennik/ and /en/price-list/ still undecided"
    - topic: "lead destination"
      decision: "submissions land in the existing Payload app at workspace/yolo/wykonczymy, which already owns a leads collection and a /leads dashboard"
    - topic: "non-goals"
      decision: "no estimator/calculator, no wizard, Cennik retired not rebuilt, leads dashboard out of scope, no visitor accounts, not a conversion programme"
    - topic: "quote form scope"
      decision: "bigger than today — more questions plus file inputs; explicitly not a wizard, estimator, or calculator"
    - topic: "repo boundary"
      decision: "two separate repos — the public site is its own frontend and posts leads across a network boundary; the leads app is not modified by this project"
    - topic: "migration strategy"
      decision: "full cutover — all pages rebuilt, single DNS switch; no strangler/proxy phase"
    - topic: "timeline"
      decision: "no fixed delivery date; day-job hours. Not a project constraint — do not resurface."
  frs_drafted: 28
  quality_check_status: accepted
---

# Shape Notes — Wykończymy

## Current System

**Purpose.** Marketing and lead-generation site for a Warsaw renovation and interior-finishing contractor (ul. Terespolska 2, 03-813 Warszawa). Its job is to turn a search visitor into a free-quote request.

**Architecture.** Server-rendered WordPress monolith, built on a purchased/agency theme. Not headless today, though the REST API is exposed.

**Tech stack (observed 2026-09-01).** WordPress on PHP 8.3.33, LiteSpeed server, `/wp-json/` REST API reachable. Built and maintained by an external agency on WordPress templates; the owner does not control the code.

**Current user base.** Prospective renovation clients arriving from search and social (Facebook, Instagram). Rough scale: small — a local single-city contractor.

**Core functionality today.**
- Public pages: Start, Cennik (pricing), Oferta (services), Realizacje (completed projects), Wykończenia (finishes), Kontakt.
- PL/EN language switch.
- Free-quote CTA ("Umów się na darmową wycenę") appearing twice on the homepage, backed by a contact form capturing: name, phone, email, project scope, square footage, preferred contact time.
- Direct contact: phone +48 505 805 425, e-mail biuro@wykonczymy.com.pl.
- Photo gallery of completed projects.
- Client testimonials.

## Vision & Problem Statement

The site works, but the owner does not own it. It was built by an outside company on WordPress templates, which means every change routes through someone else, the code cannot be shaped to the business, and the platform choice was never the owner's. The cost is control: no ability to evolve the layout, the content model, or the delivery pipeline on his own terms.

The change is a **replatform plus a new layout** — move off WordPress onto a stack the owner controls end to end, and redesign the presentation in the process. This is not driven by a measured conversion, performance, or credibility failure; it is driven by ownership. That distinction matters downstream: success is defined as *parity plus control*, not as a lift in some metric the current site is failing.

## User & Persona

**Primary persona — Warsaw homeowner renovating a single flat.** A private, one-off client. Price-sensitive, comparing three to four contractors before calling. Reaches the site from a local search for renovation or finishing work, and needs two things before picking up the phone: proof the work is good (Realizacje, testimonials) and a rough price anchor (Cennik). The moment that matters is the gap between "this looks credible" and "I'll request the free quote".

## Constraints & Preserved Behavior

Confirmed as must-not-break:

- **URLs and SEO ranking.** Existing page URLs keep resolving (directly or via 301), and current positions for local renovation searches do not drop.
- **Quote form and lead delivery.** The free-quote form keeps capturing the same fields and keeps delivering leads to their current destination. A silently broken form is invisible lost revenue.
- **Portfolio photos and testimonials.** Realizacje imagery and client reviews carry over; nothing is re-shot or re-collected.
- **PL/EN language switch.** Both language versions survive the rebuild.

## Forward: tech-stack

Not part of the PRD schema — captured here for `/10x-stack-assess` downstream.

- Target stack named by the owner: **Next.js** + **Payload CMS**.
- Explicit avoid: **WordPress** — and more broadly, agency-owned template stacks.
- Driving requirement: full control over the code.
- **This repo is the design source, not scaffolding.** 142 components, ~6,700 lines of TSX, a full multi-template site built for a German real-estate client. What carries over:
  - **Design system** — `grau_100`–`grau_900` tokens, a 12-column responsive grid, and an `IMAGE_SIZES` constants module that feeds correct `sizes` props to every `next/image`.
  - **`components/elastic/contactForm/`** — nine components including `ContactFormTerms` / `ContactFormTermsText` / `ContactFormCheckbox`. The consent-checkbox pattern the quote form needs already exists here.
  - **`components/elastic/askForOffer/`** — a request-an-offer section (contact person, image, rich text). Structurally already "Umów się na darmową wycenę".
  - **`components/common/flexibleContent/` + `elasticComponentsManager/`** — CMS-driven section composition. Maps onto Payload blocks nearly one-to-one; the highest-value carry-over in the repo.
  - **Page templates** — home, about, news + article, object (+ subpages), investoren, textPage, legal.
  - **Chrome** — header with Lottie logo and spring animation, footer with newsletter, sliders (Swiper), Google Maps, animated text sections, icon set.
  - **Needs replacing** — the WordPress-GraphQL data layer: `RichTextParser`, `MediaHandler`, and the `WpImageT` / `wpStarterTypes` type surface all assume WP shapes and must be re-pointed at Payload.

### Template inventory — allocation UNDECIDED

> **The owner has not decided what gets used for which part of the new site.** This section is an inventory of what the template contains and what each piece was built for. It deliberately contains **no keep/remove recommendation**. Nothing here authorizes an agent to delete, move, or rewrite any component, template, or route. Removals are the owner's call, made explicitly, file by file. No downstream skill may treat this as approved scope.

Direction stated so far, and nothing beyond it: reuse the existing template and components, remove the WordPress dependency, and probably not carry over the elastic/flexible-content system.

**Structural fact (not a recommendation).** `common/flexibleContent/` and `common/elasticComponentsManager/` are dispatchers — long `if` chains matching WordPress GraphQL `__typename` strings, `any`-typed. They are coupled to WordPress by construction. The section components they dispatch to are plain props-in/JSX-out and carry no WordPress knowledge. Whatever is decided about the page-builder, that coupling boundary is where it falls.

**WordPress coupling surface (fact).** 37 files reference `wpStarterTypes`, GraphQL, or WP env vars. The concentrated points are `utils/types/wpStarterTypes/`, the GraphQL fetching layer, the revalidate-token flow, and `RichTextParser` / `MediaHandler` / `WpImageT`, which assume WordPress data shapes.

**What the template contains.**

| Area | Contents | Built for |
|---|---|---|
| `components/ui/**` | buttons, icons, spinner, tag, gradientMask | generic |
| `components/helpers/**` | btnLink, MediaHandler, linkGroup, scrollToTop, skeleton | generic; MediaHandler is WP-shaped |
| `components/common/**` | header (Lottie logo, spring animation), footer (newsletter), navigationBar, pageWrapper, sectionTitle, animatedTextSection, numbersSection, topSectionVideoImg, objectsSlider | generic chrome |
| `components/elastic/**` sections | textSection, imgPlusTwoColumnTextType1/2, imgWithOverflowingTxt, contactInfoSection, askForOffer, contactForm (9 files incl. terms/consent checkbox), offersList | generic presentational |
| `components/elastic/**` object sections | objectDescription, objectFeatures, objectLocation (+ Google map), objectElasticImagesSection, ObjectContactSection | property listings |
| `components/pageTemplates/**` | home (headlineProject, leistungen, news, sliderAngebote), about (team, career, accordion), news, article, object, investoren, textPage | TDG's own page set |
| `app/**` routes | `(elastic)/finance\|living\|optimum`, `object/[id]/[subpage]`, `investoren`, `news/[slug]`, `about`, `contact`, `legal/[legalPage]`, `all-pages` | TDG's own site map |
| `middleware.ts` | two redirects: `/legal` → `/legal/privacy`, `/object/<id>` → `/object/<id>/description` | TDG routing |
| Design layer | Tailwind config, `grau_100`–`grau_900` scale, 12-col grid, `IMAGE_SIZES` constants feeding `sizes` props | generic |
| Infra | `Dockerfile`, `bitbucket-pipelines.yml`, `.env.local.example` (WP vars) | TDG deployment |

**Undecided and tracked as such:** which of the above serve which page of the new site; whether the news/article templates are used at all (the live site has no blog); whether the page-builder is replaced by fixed templates or by Payload blocks.

## Access Control

**Today.** Content is edited through WordPress `wp-admin`. Credentials are effectively agency-held — part of the ownership problem driving this change. The public site itself is fully anonymous; no visitor ever authenticates.

**After the change.** The public site stays fully anonymous — no visitor accounts, no gating, no login on any public route. Authentication exists only for the content admin, and it gains a role split it did not have before:

- **Admin** — full access: content model/schema, site configuration, deployments, user management.
- **Editor** — content only: add and edit Realizacje, adjust Cennik and Oferta copy, manage both language versions. Cannot alter the content model or site structure.

The role split is a deliberate addition, not parity. Its purpose is to let the business add projects and edit copy without being able to break the content model.

## Success Criteria

### Primary
- Every page on the current site has a working equivalent on the new stack, and the DNS switch happens without any URL 404ing — every old URL either resolves or 301s to its new home.
- The free-quote form on the new site delivers a real lead to its current destination, verified by an end-to-end submission before cutover.
- The business can add a new realizacja and edit Cennik copy through the new admin, in both languages, without touching code or asking a developer.

### Secondary
- The new layout is a visible improvement on the current template — the site reads as a portfolio piece for a finishing contractor rather than as a stock theme.
- Page performance improves over the current WordPress build (a natural consequence of the stack change, not a driver of it).

### Guardrails
- **Search positions do not drop** after cutover. Local renovation queries that currently rank must still rank.
- **No lead is lost during the transition.** The form is verified working on staging against its real destination before DNS moves, not after.
- **Both languages ship together.** An EN-incomplete launch is a regression — the current site has both.
- **A verified redirect map gates the flip.** The full live URL set is enumerated and each entry checked against staging before DNS changes. This is the mitigation that makes full cutover acceptable.
- **Existing Realizacje content and testimonials survive** the migration intact.

## Non-Goals

Each entry traces to something the owner explicitly said, not to inference.

- **No price estimator or calculator.** The form asks more but computes nothing back to the visitor — "nothing crazy". Rules out the most common scope-creep direction for a contractor site.
- **No multi-step wizard.** Bigger form, more questions, file inputs — not a branching questionnaire.
- **Cennik is not rebuilt.** The pricing page is retired rather than ported.
- **The leads dashboard is not in scope.** `/zgloszenia`, lead notification, contact-status tracking, and the Facebook reconcile cron already exist in a separate application and are not this project's work.
- **No visitor accounts.** The public site stays fully anonymous; authentication exists only for content editing.
- **No conversion-optimisation programme.** This replatform is driven by ownership, not by a measured funnel failure. Improvements are welcome but are not success criteria.

## Product framing

- `product_type`: web-app
- `target_scale`: small — a single-city contractor's marketing site; low traffic, low submission volume, small content volume.
- Timeline: not a project constraint. Recorded as such at the owner's instruction; not to be resurfaced.

## Live URL inventory (observed 2026-09-01, via AIOSEO sitemap)

Twelve indexed URLs. EN uses **translated slugs**, not a locale prefix on the PL slug — preserving URLs therefore requires translated pathname routing, not a plain `/en/` prefix.

| PL | EN |
|---|---|
| `/` | `/en/` and `/en/home/` |
| `/oferta/` | `/en/offer/` |
| `/cennik/` | `/en/price-list/` |
| `/wykonczenia/` | `/en/interior-styles/` |
| `/realizacje/` | `/en/completed-works/` |
| `/kontakt/` | `/en/contact/` |

No blog. No per-project detail pages — Realizacje is a single gallery. `/en/` and `/en/home/` appear to be duplicates of the same page.

## Scope of Change

- **Removed:** Cennik. Both `/cennik/` and `/en/price-list/` are retired; their 301 targets are an open question, and retiring them forfeits ranking on high-intent pricing queries.
- **Restructured:** Realizacje becomes a Payload collection with per-project detail pages. Existing project photos migrate as a flat gallery without detail pages; projects added after launch get full entries. This creates new indexable URLs that do not exist today.
- **Rebuilt at parity:** Home, Oferta, Wykończenia, Kontakt — same URLs, new layout, content moved into Payload.
- **Reworked:** the free-quote flow. Scope not yet captured; the owner has indicated it is substantially more than a rebuilt contact form. **This is the likely home of the product's domain rule** and is the last unresolved piece of discovery.
- **Added:** admin/editor role split; owner-controlled codebase and deploy pipeline.

## Lead destination (existing system, out of scope)

Quote submissions do not terminate in this project. They are handed to an **existing, separately deployed Payload application** (`workspace/yolo/wykonczymy`) that already owns the lead record, the `/leads` dashboard, contact-status tracking, and lead notification. That app is **not modified by this project** and its dashboard is **not in this PRD's scope**.

What this project owns is the *public side of the boundary*: collecting the homeowner's answers, and handing them over reliably. Two consequences:

- The lead payload is a **contract with a system this project does not control**. Whatever the quote flow asks a homeowner must map onto what the leads app can store.
- **File inputs break the existing contract.** The live ingestion endpoint (`/api/webhooks/wpforms`) accepts a `fields` map of strings and numbers only, and the `leads` collection has no upload relationship. Attachments cannot traverse it. The leads app must therefore gain a way to accept and store them — the option of "conform to what already exists" is closed by FR-031, as a matter of fact rather than preference.
- "No lead is lost" is now a **cross-network guarantee**, not an in-process one. It requires an explicit failure story: what the homeowner sees, and what happens to their answers, if the leads API is unreachable mid-submission. Silent failure here is the single most expensive defect this project can ship.

## Business Logic

**The site's rule: turn an anonymous search visitor into a qualified, contactable lead with enough project detail attached that the first phone call can be about the work rather than about the basics.**

This is a marketing and lead-capture site, not an application. It applies no recommendation, scoring, or calculation — deliberately. The owner has ruled out an estimator or price calculator: the form asks more than it does today, but it does not compute anything back to the visitor.

What the rule consumes: the homeowner's contact details, their description of the job, and **files they attach** — photos of the space, floor plans, inspiration images. What it produces: a lead record in a separate system, carrying enough context that the contractor can prepare before calling. Where the homeowner meets it: the free-quote form, reached from the CTA present on the current site.

The domain value is therefore concentrated in *reliability and richness of capture*, not in computation. A lead that arrives with photos and a described scope is worth materially more than a name and a phone number — and a lead that silently fails to arrive is worth nothing. That is where this product's quality lives.

## User Stories

### US-01: Homeowner requests a free quote with photos

- **Given** a Warsaw homeowner who has browsed Realizacje and decided the work looks credible
- **When** they complete the free-quote form — contact details, a description of the job, attached photos of the space — and consent to being contacted
- **Then** they see confirmation that the request was received, and the lead reaches the contractor's leads system with every answer and attachment intact

#### Acceptance Criteria
- The submission is delivered to the leads system, or the homeowner is told plainly that it failed and given the phone number. A success message is never shown for a lead that did not arrive.
- Attachments arrive with the lead and are viewable alongside its other answers.
- A retried or double-clicked submission produces one lead, not two.
- Files that are oversized or of a disallowed type are rejected before the upload, with the reason stated.
- Consent is captured explicitly and recorded with the lead.
- The flow works identically in Polish and English.

## Functional Requirements

Format: `FR-NNN: [Actor] can [capability]. Priority. Change: new | modified | preserved`

### Public site — content

- FR-001: Visitor can view the home page at `/` and `/en/`. Priority: must-have. Change: preserved
- FR-002: Visitor can browse the services offer at `/oferta/` and `/en/offer/`. Priority: must-have. Change: preserved
- FR-003: Visitor can browse finishes / interior styles at `/wykonczenia/` and `/en/interior-styles/`. Priority: must-have. Change: preserved
- FR-004: Visitor can view contact details at `/kontakt/` and `/en/contact/`. Priority: must-have. Change: preserved
- FR-005: Visitor can read client testimonials. Priority: must-have. Change: preserved
- FR-006: Visitor can reach the company's Facebook and Instagram profiles. Priority: must-have. Change: preserved

### Public site — Realizacje

- FR-007: Visitor can browse a listing of completed projects at `/realizacje/` and `/en/completed-works/`. Priority: must-have. Change: modified
- FR-008: Visitor can open an individual project and see its photos and description on its own URL. Priority: must-have. Change: new
- FR-009: Visitor can view legacy project photos migrated from the current gallery, which have no individual project pages. Priority: must-have. Change: preserved

### Public site — contact and language

- FR-010: Visitor can call the company directly from the phone number on any device. Priority: must-have. Change: preserved
- FR-011: Visitor can switch between PL and EN and land on the translated equivalent of the page they were on. Priority: must-have. Change: preserved
- FR-012: Visitor arriving at any URL that exists on the current site reaches a working page — the same page, or a deliberate 301 target. Priority: must-have. Change: preserved

### Search

- FR-013: Search engine can crawl a sitemap covering all public pages in both languages. Priority: must-have. Change: preserved
- FR-014: Search engine can read per-page title, description, and canonical metadata, with correct hreflang pairing between PL and EN. Priority: must-have. Change: preserved

### Content administration

- FR-015: Editor can sign in to a content admin without needing developer help. Priority: must-have. Change: modified
- FR-016: Editor can create a project entry with photos, description, and its own URL, in both languages. Priority: must-have. Change: new
- FR-017: Editor can edit the copy on Oferta, Wykończenia, Kontakt, and the home page, in both languages. Priority: must-have. Change: modified
- FR-018: Editor can add and edit client testimonials. Priority: must-have. Change: modified
- FR-019: Editor cannot alter the content model, site structure, or configuration. Priority: must-have. Change: new
- FR-020: Admin can change the content model, site configuration, and deployment. Priority: must-have. Change: new
- FR-021: Admin can create, suspend, and remove editor accounts. Priority: must-have. Change: new

### Quote form

Numbered from FR-030 so the earlier blocks stay stable.

- FR-030: Visitor can request a free quote by submitting contact details and a description of the job. Priority: must-have. Change: modified
- FR-031: Visitor can attach one or more files to the quote request — photos of the space, plans, inspiration images. Priority: must-have. Change: new
- FR-032: Visitor can see, before submitting, what happens to their data, and give explicit consent to being contacted. Priority: must-have. Change: new
- FR-033: Visitor receives confirmation that the request was received. Priority: must-have. Change: preserved (the leads app already sends an auto-reply)
- FR-034: Visitor whose submission cannot be delivered is told so plainly and given the phone number, rather than seeing a success message for a lead that vanished. Priority: must-have. Change: new
- FR-035: Visitor cannot submit a file that is oversized or of a disallowed type, and is told why before they wait for an upload that will be rejected. Priority: must-have. Change: new
- FR-036: Automated submissions are rejected before they reach the leads system. Priority: must-have. Change: new

**Cross-boundary requirement (the other repo, listed for the contract only):** the contractor must be able to view a lead's attachments alongside the rest of its answers. This is work in the leads app, not in this project, and is recorded here only because it is the other half of FR-031.

## Open Questions

1. **What exactly does the form ask?** — Scope is settled (more questions than today, plus file inputs; no estimator or calculator). The specific question list is not, and it is a content decision rather than an architectural one. Owner: user. Block: no — the PRD can be written without it.
2. **How do attachments reach and live in the leads app?** — A new or extended ingestion path plus storage is required (see Lead destination). Routine to solve; decided at build time, not here. The only judgement worth carrying forward: the leads app should own the stored files, so a lead's attachments don't depend on the marketing site's storage outliving it. Block: no.
3. **What are the file limits?** — Accepted types, max size, max count per submission. Needed for FR-035. Owner: user. Block: no.
4. **Where do `/cennik/` and `/en/price-list/` 301 to** once Cennik is retired? — Candidates: Oferta, Kontakt, home. Affects retention of high-intent pricing traffic. Owner: user. Block: no (cutover-time decision).
5. **Where do quote-form leads actually land today?** — Assumed `biuro@wykonczymy.com.pl`, but the WP form may also write to a database table or a third-party service. Must be confirmed before cutover, since lead delivery is a guardrail. Owner: user. Block: yes for cutover, no for PRD.
