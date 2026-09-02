---
project: wykonczymy-www
status: living
started: 2026-09-02
purpose: seed for a reusable Payload + Next + Neon + Vercel starter
---

# Stack template — the fast path to a running site

**What this is.** A runbook for standing up *the next* project on this stack, written while
building this one. Every step below was actually executed here; every trap listed actually cost
time. It is a living document — append to it as the build continues, and eventually lift it out
into a real template repo.

**What it is not.** Not a description of `landing_26`'s features. Anything specific to this site
(the twelve URLs, the leads-app contract, tdg) belongs in the other foundation docs and must be
stripped when this becomes a template.

**Assumed stack:** Next.js App Router · Payload 3 · Postgres (Docker local, Neon prod) ·
Vercel Blob · pnpm · deployed to Vercel from GitHub.

**Target:** from empty directory to a URL returning 200, with an admin panel, in one sitting.

---

## The order that works

Each step's traps are documented in the section below it. Read the trap before running the step —
that is the entire point of this document.

| # | Step | Who runs it |
|---|---|---|
| 1 | Scaffold with `create-payload-app` | human (needs a TTY) |
| 2 | Local Postgres in Docker | agent |
| 3 | Repo hygiene — ignore files | agent |
| 4 | Dependency policy — `pnpm-workspace.yaml` | agent |
| 5 | Payload config — adapters, localization, email | agent |
| 6 | Next config — `trailingSlash` | agent |
| 7 | Scripts — `build` runs migrations | agent |
| 8 | Vercel project + GitHub link | human |
| 9 | Neon integration | human (dashboard) |
| 10 | Blob integration | human (dashboard) |
| 11 | `PAYLOAD_SECRET` | agent |
| 12 | Push to `main` → production deploy | human |
| 13 | Create first admin user | human |

---

## 1. Scaffold

`create-payload-app` **requires a TTY and cannot be run by an agent.**

```bash
npx create-payload-app@latest -n _payload_scaffold -t blank --use-pnpm -a claude
```

- `-t blank` over `-t website`: the website template ships a block-based page builder, a demo
  layout and seed content that all has to be deleted. `blank` gives `Users` + `Media` and nothing
  else.
- `-a claude` installs Payload's own Claude skill into `.claude/skills/payload/`. **The flag is
  real despite being absent from the CLI README** — don't let a doc-check talk you out of it.
- Scaffold to a **temp directory** if the target repo is non-empty; the generator refuses to run
  otherwise. Merge in afterwards, then delete the temp tree.

**Traps**

- The generated `.env` had a **doubled URL scheme** (`postgres://postgres://user:pass@host/db`)
  and a **weak 24-hex `PAYLOAD_SECRET`**. Do not trust the generated `.env`. Write your own.
- It names the connection string `DB_POSTGRES_URL`. Rename to **`POSTGRES_URL`** — that is what
  Vercel's Neon integration injects, so matching it means production needs no extra wiring.

## 2. Local Postgres

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:17-alpine
    container_name: <project>-cms
    ports:
      - '<free port>:5432'
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

Pin the Postgres major deliberately — dev/prod parity with Neon. **Pick a host port no other
project on the machine uses** and record why in a comment; 5432–5435 fill up fast.

## 3. Repo hygiene — ignore files

`.gitignore`, secrets block at the very top:

```gitignore
# env — real secrets, never committed. .env.example is the tracked template.
.env
.env.*
!.env.example
```

Then **symlink the Vercel ignore file to it**:

```bash
ln -s .gitignore .vercelignore
```

**Trap — this is the one that leaked secrets here.** `vercel deploy` from the CLI does not read
your repo. It tars the **working directory** and uploads it, and `.gitignore` is only partially
honoured — `.env` shipped into a deployment bundle. Two independent fixes, apply both:

1. The symlink, so one ignore list governs both. Git stores it as mode `120000`; use a **relative**
   target so it survives a clone.
2. **Deploy from GitHub, never `vercel deploy`.** A git-triggered build's source *is* the repo, so
   an ignored file was never there to leak. The CLI path is upload-and-hope.

## 4. Dependency policy

```yaml
# pnpm-workspace.yaml
# Vercel's pnpm 11 defaults minimumReleaseAge to 1440 and refuses a lockfile
# containing anything newer; pnpm 10 defaults to 0. Setting it explicitly makes
# local resolution and the Vercel build agree regardless of which pnpm runs.
minimumReleaseAge: 1440

allowBuilds:
  esbuild: true
  sharp: true
  unrs-resolver: true
  workerd: true
```

**Trap.** The first production deploy died on `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`: five
packages resolved locally were less than 24 hours old, and Vercel's newer pnpm refused them. The
chain of fixes that actually worked:

- pin `packageManager` in `package.json` so both sides run the same pnpm;
- set `minimumReleaseAge` explicitly rather than inheriting a version-dependent default;
- **widen the ranges `pnpm add` pins.** `pnpm add` writes an exact-ish range at today's version; if
  that version is hours old there is no mature fallback to resolve to. `^x.0.0` gives one.
- `minimumReleaseAgeExclude` for packages resolved through a wildcard optional peer (here
  `happy-dom`, which vitest declares as `"*"` and which we never import — we run jsdom).
- `peerDependencyRules.ignoreMissing` did **not** help. Don't reach for it.

**Rule to carry forward: "install latest" must mean "install latest *mature*".** Scaffolding a
project on the day a dependency publishes is a deploy failure waiting to happen.

## 5. Payload config

```ts
export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) } },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },

  db: vercelPostgresAdapter({
    pool: { connectionString: process.env.POSTGRES_URL || '' },
    push: false,                                       // migrations only, never auto-push
    migrationDir: path.resolve(dirname, 'migrations'),
  }),

  // Without SMTP credentials Payload falls back to logging mail to the console.
  // Attaching the adapter regardless makes every local build fail transport
  // verification against a host that isn't there.
  email: process.env.SMTP_HOST ? nodemailerAdapter({ /* ... */ }) : undefined,

  plugins: [
    vercelBlobStorage({ collections: { media: true },
                        token: process.env.BLOB_READ_WRITE_TOKEN || '',
                        addRandomSuffix: true }),
  ],
  sharp,
})
```

**Traps**

- **Attach the email adapter conditionally.** Unconditionally attached, nodemailer *verifies the
  SMTP transport at build time* and every local build fails with
  `Error verifying Nodemailer transport … address: '::1', port: 587`. Payload's email port is a
  clean Adapter with a Null-Object fallback — leaving it `undefined` gives you console logging,
  which is the right local behaviour.
- **`push: false`.** Schema changes go through generated migrations, so production schema drift is
  reviewable rather than implicit.
- **Localization, if the site is multilingual:** set `fallback: false` when an incomplete second
  locale would be a regression — otherwise missing translations silently render the default locale
  and look shipped.

## 6. Next config

```ts
trailingSlash: true,   // only if the URL contract requires it — decide before launch, not after
```

`trailingSlash` is a **one-way door once URLs are indexed.** Next strips trailing slashes by
default; if the existing site's addresses carry them, every one 404s or redirect-chains without
this. Decide it at scaffold time.

## 7. Scripts

```jsonc
{
  "build":     "payload migrate && next build",   // migrations run on every deploy
  "typecheck": "tsc --noEmit",
  "migrate":   "payload migrate",
  "migrate:create": "payload migrate:create",
  "db:up":     "docker compose up -d",
  "db:down":   "docker compose down",
  "db:dump":   "...pg_dump from PROD_POSTGRES_URL into dumps/",
  "db:import": "...psql the dump into the local container"
}
```

**Consequence to understand:** because `build` runs `payload migrate`, **the build needs a
reachable database.** A Vercel build with no `POSTGRES_URL` fails before Next ever compiles. Wire
the database *before* the first deploy, not after.

## 8–10. Vercel, Neon, Blob

**Link the project and check the scope.** The CLI's default team is often the wrong one:

```bash
vercel link --scope <team> --project <name> --yes
```

**Never import `.env.example` into Vercel's env vars.** Doing that here created fifteen variables
with **empty values**, which then (a) collided by name with the Neon and Blob integrations,
blocking both installs, and (b) would have failed the build with `POSTGRES_URL=""`. Vercel's env
store is for real values only; the template lives in git.

**Neon integration — the four settings that matter:**

| Setting | Value | Why |
|---|---|---|
| Region | nearest the audience | Not changeable later without recreating the DB. A function in `iad1` querying `fra1` pays a round trip per query — match the function region too. |
| Auth | **off** | Neon Auth provisions identity for your *app's end users*. Payload's `Users` collection already handles admin login. |
| Custom prefix | **empty** | A prefix yields `STORAGE_POSTGRES_URL`; the config reads `POSTGRES_URL`. Empty gives the unprefixed set. |
| Branch for deployment | **Preview only** | Per-preview Neon branch = real staging isolation. Checking Production forks the DB on every production deploy. |
| Sensitive | **off** | Sensitive vars are write-only — `vercel env pull` can no longer read them, which breaks `db:dump`. |

**Blob integration:** same prefix and sensitive rules. Keep *Add a read-write token* checked.

## 11. Secrets

```bash
openssl rand -hex 32
```

Set `PAYLOAD_SECRET` per environment. **Use a different value from local** — it signs admin
sessions and JWTs; sharing it across environments buys nothing and widens blast radius.

## 12–13. First deploy and first user

Push to the production branch; Vercel builds from GitHub. Then verify:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://<alias>/        # expect 200
curl -s -o /dev/null -w '%{http_code}\n' https://<alias>/admin   # 308 if trailingSlash: true
```

- The **per-deployment URL** 302s to `vercel.com/sso-api` — that is Deployment Protection, not a
  fault. The **project alias** is the public one.
- **Payload has no CLI path for the first admin user.** It is created through the UI at
  `/admin/create-first-user` on an empty `users` table.

---

## Verification checklist

- [ ] `pnpm typecheck` clean
- [ ] `pnpm lint` clean
- [ ] `pnpm build` exits 0 locally against the Docker database
- [ ] Production alias returns 200
- [ ] `/admin` reachable, first user created
- [ ] `git check-ignore -v .env` matches; `.env.example` still tracked
- [ ] No `.env` in the deployment bundle

Bundle check (source of the leak here):

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.vercel.com/v6/deployments/<dpl_id>/files?teamId=<team>" \
  | tr ',' '\n' | grep '"name"' | grep '\.env'
```

---

## Still unsolved — carry these forward

- **`NEXT_PUBLIC_SERVER_URL` across environments.** Production takes a static value. Preview needs
  `https://${VERCEL_URL}`, which is per-deployment and therefore cannot be an env var — it has to
  be computed in code. No pattern settled yet.
- **Bilingual routing.** Payload's `localization` solves content only. Locale-segmented, *translated*
  pathnames resolved through `generateStaticParams` are still to be built here; when they are,
  document the shape in this file.
- **`engines` in the scaffold's `package.json`** is a range (`^18.20.2 || >=20.9.0`), so builds
  auto-upgrade on the next Node major. Pin it if reproducibility matters more than currency.
