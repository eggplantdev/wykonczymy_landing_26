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
    image: postgres:17-alpine
    container_name: <project>-cms
    ports: ['<free port>:5432']
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes: [pgdata:/var/lib/postgresql/data]
volumes: { pgdata }
```

`pnpm db:up`. Pick a host port nothing else on the machine uses.

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
- **Locale-segmented routes with translated pathnames** — Payload's `localization` covers content
  only; routing is yours to build.
