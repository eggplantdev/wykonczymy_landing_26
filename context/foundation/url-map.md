---
project: wykonczymy-www
verified: 2026-09-03
source: https://www.wykonczymy.com.pl/sitemap.xml (All in One SEO v4.9.5.1)
---

# Address map

The verified replacement map the cutover guardrail requires. **Enumerated from the live sitemap on
2026-09-02**, not transcribed from an earlier document. Re-verify before cutover — a page added
after this date is not in this table.

**Re-verified 2026-09-03.** All twelve return `200`, `/en/` still `301`s to `/en/home/`, and the
sitemap's page set is unchanged (`lastmod` 2025-12-19) — nothing has been added, moved or retired.

## Facts that constrain the new site

1. **The canonical host is `www.`** Every indexed URL is `https://www.wykonczymy.com.pl/…`, and the
   apex `301`s to it. The PRD's prose says `wykonczymy.com.pl`; the addresses that rank say `www`.
   The apex redirect is part of what must survive.
2. **Every address ends in a trailing slash.** Next.js strips it by default, which would break all
   twelve at once. **`trailingSlash: true` is required in the Next config** — decide it before the
   route tree, not after.
3. **English pages use translated slugs under an `/en/` prefix** — `/oferta/` ↔ `/en/offer/`. Both
   halves are indexed, so this is not a locale prefix that can be added mechanically.
4. **`/en/` `301`s to `/en/home/`.** English home has two live addresses; the redirect source counts
   as an address to preserve.

## The twelve

| #   | Polish          | English                | Page                                                                            | New address   |
| --- | --------------- | ---------------------- | ------------------------------------------------------------------------------- | ------------- |
| 1   | `/`             | `/en/home/`            | Start                                                                           | unchanged     |
| 2   | `/oferta/`      | `/en/offer/`           | Oferta — **retired 2026-09-04**, its content became tiles on the home page      | **UNDECIDED** |
| 3   | `/realizacje/`  | `/en/completed-works/` | Realizacje                                                                      | unchanged     |
| 4   | `/wykonczenia/` | `/en/interior-styles/` | Wykończenia                                                                     | unchanged     |
| 5   | `/kontakt/`     | `/en/contact/`         | Kontakt                                                                         | unchanged     |
| 6   | `/cennik/`      | `/en/price-list/`      | Cennik — **dropped 2026-09-21**; no page will be built                          | `301`, target owed |

Plus two redirects that already exist and must keep working: apex → `www`, and `/en/` → `/en/home/`.

Page set resolved 2026-09-02 (PRD Open Question 8): the surviving pages keep their addresses 1:1,
so only Cennik's and Oferta's need replacements. Individual project pages are new addresses and
appear in no row here — they cannot break anything that is indexed today.

**Oferta was retired on 2026-09-04.** The "What we do" section on the home page became a carousel of
tiles that link nowhere, and the page they used to point at was deleted from the CMS. Four indexed
addresses now have no target — `/oferta/`, `/en/offer/`, `/cennik/`, `/en/price-list/` — and each
needs a deliberate `301` before cutover.

**Cennik was dropped on 2026-09-21** — the owner's call, matching Oferta's. Neither page is built, so
four of the twelve addresses are now redirect-only and none of the four has a target yet. Dropping a
page decides what does *not* get built; it does not retire the address, which is indexed and must
still answer deliberately.

**Two rows are still open** — both waiting on a `301` target, not on a page. A row left empty at
cutover is the defect the guardrail exists to prevent. If PRD Open Question 8 changes the page set, a
row's target changes — the address still has to resolve or redirect deliberately.

## Behaviour to reproduce — verified 2026-09-03

The two probes that `429`d on LiteSpeed rate limiting last time now answer. All three are behaviour
the new site has to keep, not just addresses:

| Probe                               | Live response                                                      |
| ----------------------------------- | ------------------------------------------------------------------ |
| `https://wykonczymy.com.pl/` (apex) | `301` → `https://www.wykonczymy.com.pl/`                           |
| `/oferta` — no trailing slash       | `301` → `/oferta/`, which is what `trailingSlash: true` reproduces |
| a path that does not exist          | `404`                                                              |

## Where the apex → `www` redirect actually lives — checked 2026-09-21

**It is not on Vercel yet, and it is not in this repository.** `wykonczymy.com.pl` has not been
added to the Vercel account at all: `vercel domains ls --scope wykonczymys-projects` lists only
`wykonczymy.app`, and the project — `wykonczymy_landing_26`, not `wykonczymy-www` — answers on
`wykonczymylanding26.vercel.app` alone. Both the apex and `www` still resolve to `188.210.222.1`,
the WordPress host, and the `301` in the table above is that host's, not ours.

So there is nothing to verify before the domain moves; the redirect is a step **of** cutover, not a
precondition to check beforehand. It belongs on Vercel rather than in `next.config.ts`: a Vercel
domain redirect answers at the edge before any function runs, while a host redirect in the app
costs an invocation per hit and can loop against the platform's own.

At cutover, in the Vercel dashboard for `wykonczymy_landing_26` → Settings → Domains:

1. Add `www.wykonczymy.com.pl` as the primary domain.
2. Add `wykonczymy.com.pl` and set it to **Redirect to** `www.wykonczymy.com.pl`, status `308`
   (Vercel's default; `301` is also acceptable — what must not happen is the pair configured the
   other way round, which flips the canonical host on all twelve addresses at once).

Then re-run the three probes in the table against the new host, plus:

```
curl -sSI https://wykonczymy.com.pl/ | head -3      # 30x → https://www.wykonczymy.com.pl/
```
