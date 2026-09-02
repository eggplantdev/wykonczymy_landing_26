---
project: wykonczymy-www
status: decided
decided_on: 2026-09-02
deployment_target: vercel
package_manager: npm
---

# Tech stack

> **Note on format.** This does not conform to `/10x-tech-stack-selector`'s hand-off schema, on
> purpose. That schema requires a `starter_id` from its 35-entry starter registry, and the registry
> has no Payload entry — a conformant file would need an invented key that a downstream validator
> would reject. It also caps the body at one paragraph, which would drop every decision below.
> `/10x-roadmap` reads this file only to derive its `## Foundations` section and to skip probing
> layers already declared, and the layer table below serves that fine.
>
> The stack was **not chosen by a selection process.** The owner had already decided on Payload +
> Next before this project started. What follows is that decision written down, plus the layer
> choices derived from it.

## Layers

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16, App Router | React 19 |
| CMS / backend | Payload 3 (`@payloadcms/next`) | Mounted at `src/app/(payload)`; Payload owns the `src/` layout |
| Database | Postgres 17 | `@payloadcms/db-vercel-postgres` |
| — local dev | Docker, `postgres:17-alpine` | **Port 5436** — see collision note below |
| — production | Neon, via Vercel | |
| Media storage | Vercel Blob | `@payloadcms/storage-vercel-blob` |
| Email | Nodemailer via Payload adapter | `@payloadcms/email-nodemailer` + SMTP |
| Rich text | Lexical | `@payloadcms/richtext-lexical` |
| Forms | **TanStack Form + Zod** | `@tanstack/react-form` ^1.29, `zod` ^4 — Chaos Kitchen's pattern |
| Styling | **Tailwind 4** | `@tailwindcss/postcss` — CSS-based config, not `tailwind.config.js` |
| Animation | GSAP ^3.15 | Also `framer-motion` ^12 available |
| E2E tests | Playwright | Plus `@playwright/mcp` wired via `.mcp.json` |
| Unit tests | `node --import tsx --test` | Node's built-in runner, no Vitest/Jest |
| Package manager | npm | |
| Hosting | Vercel | Same account as the leads app — deliberate |
| Tooling | ESLint, Prettier, husky | |

## Local database port

`5436`. The three lower ports are already taken on this machine:

| Port | Container |
|---|---|
| 5433 | `wykonczymy` — leads app |
| 5434 | `chef-cms` — Chaos Kitchen |
| 5435 | `wykonczymy-test` — leads app test db |
| **5436** | **`landing26-cms` — this project** |

Committed in `docker-compose.yml` and `.env.example`.

## Scaffold command

`create-payload-app` requires a TTY and cannot be run by an agent — the owner runs it:

```
cd /Users/konradantonik/workspace/yolo
npx create-payload-app@latest -n _payload_scaffold -t blank --use-npm -a claude
```

Choose **Postgres**. Connection string: `postgres://landing26:landing26@localhost:5436/landing26`.
Scaffolds to a temp dir because `landing_26` is non-empty (the generator refuses); merge in afterwards.
`-a claude` installs Payload's own Claude skill.

## Two migration frictions when lifting from tdg

1. **Tailwind 3.4 → 4.** tdg is on 3.4 with a `tailwind.config.js`; this project is on 4, which moves
   config into CSS. Lifted markup needs class migration, not copy-paste.
2. **`WpImageT` → Payload media.** Every tdg component that renders an image types its prop against
   the WordPress image shape. Each one must be retyped on the way in. Unavoidable in any approach —
   it is the same work whether files are copied or edited in place.

GSAP is the good news: tdg is on 3.12, Chaos Kitchen on 3.15. Animation logic ports directly.

## Undecided — the one real gap

**PL/EN with translated pathnames has no pattern to inherit.** Chaos Kitchen declares
`localization: { locales: ['pl','en'] }` in `payload.config.ts` but its frontend is Polish-only — no
locale segment, no middleware, no `en` in frontend code. So the CMS layer is configured and the
rendering layer does not exist.

This project needs the harder version: `/en/offer/`, not `/en/oferta/` — translated slugs, because
those are the twelve indexed URLs and URL preservation is a PRD guardrail (FR-011, FR-012, FR-014).

**Decide this before the route tree is laid down.** Retrofitting locale routing after the fact is the
expensive order.

Also open: whether Swiper and `lottie-react` (both in tdg, neither in Chaos Kitchen) come across, or
whether their uses get rebuilt on what is already here.
