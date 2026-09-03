---
status: living
purpose: reusable setup runbook — Payload + Next + Neon + Vercel
---

# Payload + Next on Vercel — setup runbook

Follow top to bottom. Empty directory → live URL with a working admin panel.

**Stack:** Next App Router · Payload 3 · Neon Postgres (Docker locally) · Vercel Blob · pnpm ·
deployed from GitHub.

Keep this file free of project-specific content — it is the seed for a starter repo.

---

## 1. Scaffold — human runs this, needs a TTY

```bash
npx create-payload-app@latest -n _scaffold -t blank --use-pnpm -a claude
```

`-t blank` (the `website` template ships a page builder and demo content you'll delete).
`-a claude` installs Payload's Claude skill. Scaffold to a temp dir if the target repo is
non-empty, then merge in.

Then immediately:

- **Rewrite the generated `.env`** — it emits a doubled scheme (`postgres://postgres://…`) and a
  weak secret.
- **Rename `DB_POSTGRES_URL` → `POSTGRES_URL`** everywhere. That's the name Vercel's Neon
  integration injects, so production needs no extra wiring.

## 2. Local database

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:18-alpine
    container_name: <project>-cms
    ports: ['<free port>:5432']
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes: [pgdata:/var/lib/postgresql] # 18+ wants the parent, not /data
volumes: { pgdata }
```

`pnpm db:up`. Pick a host port nothing else on the machine uses.

**Match the local major to the hosted one** (Neon is on 18). `pg_dump` refuses to dump a server
newer than itself, so a 17 container silently can't back up an 18 Neon — which only surfaces the
day you need the backup. Bumping the major means recreating the volume; `pg_upgrade` is not worth
it for a dev database.

## 3. Ignore files

```gitignore
.env
.env.*
!.env.example
```

```bash
ln -s .gitignore .vercelignore   # relative target, so it survives a clone
```

`vercel deploy` uploads the working directory, not the repo — without this it ships `.env`.
Better still: **deploy from GitHub, never from the CLI.**

```gitattributes
# .gitattributes — folds these in GitHub's "Files changed" so a PR opens on the
# code that needs judgement. Folded, not hidden: still expandable and commentable.
context/**       linguist-generated=true
.review-gate/**  linguist-generated=true
tests/**         linguist-generated=true
```

Local `git diff` is unaffected — this is GitHub-side only. Worth knowing the trade: a test file
that is itself the deliverable of a change now opens collapsed in the review of that change.

## 4. pnpm

```yaml
# pnpm-workspace.yaml
minimumReleaseAge: 1440 # Vercel's pnpm enforces this; set it so local and CI agree
allowBuilds: { esbuild: true, sharp: true, unrs-resolver: true, workerd: true }
```

Pin `packageManager` in `package.json`. **After any `pnpm add`, widen the range it wrote** —
it pins today's version, which the 24h cooldown then rejects with no fallback to fall back to.
For a package pulled in by a wildcard optional peer you never import, use
`minimumReleaseAgeExclude`.

## 5. `payload.config.ts`

```ts
db: vercelPostgresAdapter({
  pool: { connectionString: process.env.POSTGRES_URL || '' },
  push: false,                                    // migrations only
  migrationDir: path.resolve(dirname, 'migrations'),
}),

email: process.env.SMTP_HOST ? nodemailerAdapter({ /* … */ }) : undefined,

plugins: [
  vercelBlobStorage({
    collections: { media: true },
    token: process.env.BLOB_READ_WRITE_TOKEN || '',
    addRandomSuffix: true,
  }),
],
```

The email ternary is required: attached unconditionally, nodemailer verifies the SMTP transport at
**build** time and fails when there's no host. Left undefined, Payload logs mail to the console.

Multilingual? `localization: { locales: [...], defaultLocale, fallback: false }` — `fallback: true`
silently renders the default locale and looks translated.

## 5b. Typed env layer

`pnpm add zod server-only`, then `src/lib/env-schema.ts` (pure schemas) + `env.ts` (public vars,
**keyed statically** or the bundler can't inline them) + `env.server.ts` (`import 'server-only'`).
Import `@/lib/env` from the root layout so a missing var fails the build. Ban raw `process.env`
in `src/**` with `no-restricted-syntax`.

Two things specific to Payload: `payload.config.ts` parses `serverSchema` directly rather than
importing `env.server.ts`, because the Payload CLI loads it outside Next where `server-only` can't
resolve. That parse is also the server-side build gate: `next build` compiles the admin routes,
which import the config. Wrap optional vars so `''` counts as unset; dotenv writes empty strings, not absent keys.

Gate deployment-only vars on `VERCEL` in a `superRefine` rather than making them required
everywhere — the blob token has no business in a local build, and requiring it would push dev
uploads into the production store.

Full pattern: the `typed-env-module` skill.

## 6. `next.config.ts`

```ts
trailingSlash: true,   // only if your URLs carry one — one-way door once indexed
```

## 6b. App Router special files — day one, not later

The scaffold ships none of these, and each one's absence is invisible until the moment it matters:
an unhandled throw takes down the whole tree, a slow segment shows a blank frame. Add all four
before the first real page.

```
app/(frontend)/
  not-found.tsx      # 404 — also what notFound() renders
  error.tsx          # segment error boundary — MUST be 'use client' ('reset' re-renders)
  global-error.tsx   # root layout itself threw — supplies its own <html>/<body>
  loading.tsx        # Suspense fallback for the segment
components/
  Spinner.tsx        # role="status" + a visually-hidden label, or it is silent to a screen reader
```

- **`error.tsx` cannot be a server component.** Its `reset` prop re-renders the segment, which only
  the client can do. `global-error.tsx` is the same, plus it renders `<html>`/`<body>` itself —
  the root layout that normally supplies them is exactly what failed.
- **Log `error.digest`.** Next strips the message in production before it reaches the browser; the
  digest is the only handle that correlates the page with the server log.
- **`loading.tsx` looks dead on a fully-static site and still belongs there** — it costs nothing
  and covers the first route that streams or opts out of static generation.
- **None of these can see the locale.** They render outside the page's params, so on a bilingual
  site they either sniff the path prefix (`not-found`, `error`) or accept the default locale as a
  known-wrong answer (`loading`, `global-error`). Decide which per file rather than discovering it
  in review — see §11.

## 7. Scripts

```jsonc
"build":     "next build",
"typecheck": "tsc --noEmit",
"migrate":   "payload migrate",
"migrate:create": "payload migrate:create",
"db:migrate:prod": "pnpm db:dump && set -a && source .env && set +a && POSTGRES_URL=\"$PROD_POSTGRES_URL\" pnpm payload migrate",
"db:up":     "docker compose up -d",
"db:down":   "docker compose down"
```

**Quote any env value containing `&`** — a Neon URL ends in `…?sslmode=require&channel_binding=require`,
and `source .env` on an unquoted line backgrounds the assignment, leaving the var _empty_. `pg_dump`
then falls back to a local socket and the error names the wrong problem entirely.

**Take `payload migrate` out of `build`** — Payload's starter puts it there, and on Vercel
`POSTGRES_URL` points at the hosted database for _every_ deployment, previews included, so a
throwaway branch build migrates production. Deploys ship code; `payload migrate` owns schema.
`db:migrate:prod` is the deliberate replacement — a human runs it, never an agent, and it dumps
prod first because a migration that rewrites a populated column has no undo.

The cost of the split: a deploy can build green and 500 on first request if the schema is behind
the code. So the habit is **schema first** — migrate prod, then push.

## 7b. Git hooks

`husky-watch-deploy` scaffolds `.husky/` plus a `scripts/watch-deploy.sh` that tails the Vercel
build triggered by the push. Then append the migration gate from `payload-prod-migrate` at the
**top** of `pre-push`, above the slow checks, so declining aborts before the test wait: on a push
to the prod branch that _adds_ `src/migrations/*.ts` it asks the human whether prod was migrated
first. It runs no SQL — a hook can't enforce this, it only supplies the one fact the human
forgets.

Both skills own their own details — read them rather than reconstructing the hooks from here.

## 8. Vercel

```bash
vercel link --scope <team> --project <name> --yes   # check the scope, the default is often wrong
```

Connect the GitHub repo. **Never bulk-import `.env.example`** into Vercel's env store — empty
values block the Neon and Blob installs by name collision and fail the build.

```bash
openssl rand -hex 32   # PAYLOAD_SECRET, per environment, different from local
```

## 9. Neon and Blob integrations — dashboard

| Setting                  | Value                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------- |
| Region                   | nearest your audience; match the function region                                   |
| Neon Auth                | **off** — that's for your app's end users, Payload has its own                     |
| Custom prefix            | **empty** — a prefix gives `STORAGE_POSTGRES_URL`, the config reads `POSTGRES_URL` |
| DB branch for deployment | **Preview only** — per-preview branch = staging isolation                          |
| Sensitive                | **off** — sensitive vars can't be read back by `vercel env pull`                   |

Region is not changeable later without recreating the database.

## 10. Deploy and verify

Push to the production branch.

```bash
curl -so /dev/null -w '%{http_code}\n' https://<alias>/        # 200
curl -so /dev/null -w '%{http_code}\n' https://<alias>/admin   # 308 if trailingSlash
```

The per-deployment URL 302s to `vercel.com/sso-api` — that's Deployment Protection. Use the
**project alias**.

Create the first admin at `/admin` — Payload has no CLI path for it.

---

## Checklist

- [ ] `pnpm typecheck` · `pnpm lint` · `pnpm build` clean locally
- [ ] production alias returns 200, `/admin` reachable, first user created
- [ ] `git check-ignore -v .env` matches, `.env.example` still tracked
- [ ] `build` does **not** contain `payload migrate`; `PROD_POSTGRES_URL` is set so `db:dump` works

## Open in this template

- **`NEXT_PUBLIC_SERVER_URL` per environment** — production is static, preview needs
  `https://${VERCEL_URL}` and must be computed in code.
  (The locale-routing item that used to sit here is answered by §11.)

## 11. Bilingual routing — optional, only if the site ships two languages

Payload's `localization` covers **content**; routing and UI chrome are yours. Three parts, and the
mistake is collapsing them into one:

1. **Which document a URL loads** — a `localized: true` `slug` field on the page collection, so each
   locale carries its own translated path segment. Resolved in the App Router, not in a static
   table: a static table means a page cannot be added without a deploy.
2. **One catch-all route**, `app/(frontend)/[[...segments]]/page.tsx`. If the default locale sits at
   the root and the others are prefixed, that asymmetry is _data_ — a `resolveSegments` helper — not
   a second folder tree. Enumerate every address in `generateStaticParams` and set
   `export const dynamicParams = false`, so anything unenumerated is a 404 by construction rather
   than an on-demand render against the database.
3. **UI chrome** — nav labels, buttons, validation messages — a hand-rolled typed dictionary, no
   i18n library, while the string count is small and the locales are known at build time:

```
lib/i18n/
  i18n.ts                  # locale list, isLocale, getTranslations, the types
  locales/{pl,en}.json     # one file per locale
  translations-provider.tsx  # 'use client' — context, the only client file
  use-translation.ts       # the hook client components call
```

`i18n.ts` types the dictionary as `typeof <defaultLocale>.json`, which makes the default locale the
source of truth and forces every other locale's JSON to match it **structurally, at compile time** —
a missing key is a typecheck failure, not a runtime blank. That single line is most of why a library
is not needed here.

**Server components call `getTranslations(locale)` directly.** The provider and hook exist only
because a client component cannot reach `params`. Do not wrap the tree in a provider you do not
need.

Three traps, each of which cost a review-gate finding:

- **`localization.fallback: false` means a locale's slug can legitimately be empty.** Every place
  that builds a URL from a document must skip a locale with no slug, or it emits `/<locale>/undefined/`
  and prerenders `/<locale>/null/`. Resolve a document's addresses in **one** helper and call it
  everywhere — the language switcher, `generateStaticParams`, and the revalidation hook all need the
  same answer, and independent copies drift apart on exactly this guard.
- **A catch-all matches paths deeper than a page.** Without an explicit "too many segments" miss,
  the site answers 200 at an unbounded family of URLs.
- **On-demand revalidation must resolve both locales, before the write.** One document occupies one
  address per locale, but a write only carries the edited locale's slug — so read the old row's
  addresses in `beforeChange`/`beforeDelete`, while it still exists, and union them with the new
  ones in `afterChange`. Wrap `revalidatePath` in a try/catch: Payload hooks also run under the
  Local API (seed scripts, `payload run`), where there is no Next request scope and it throws.
