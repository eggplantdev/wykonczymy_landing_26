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
| 2   | `/oferta/`      | `/en/offer/`           | Oferta                                                                          | unchanged     |
| 3   | `/realizacje/`  | `/en/completed-works/` | Realizacje                                                                      | unchanged     |
| 4   | `/wykonczenia/` | `/en/interior-styles/` | Wykończenia                                                                     | unchanged     |
| 5   | `/kontakt/`     | `/en/contact/`         | Kontakt                                                                         | unchanged     |
| 6   | `/cennik/`      | `/en/price-list/`      | Cennik — **being retired**, needs deliberate replacements (PRD Open Question 3) | **UNDECIDED** |

Plus two redirects that already exist and must keep working: apex → `www`, and `/en/` → `/en/home/`.

Page set resolved 2026-09-02 (PRD Open Question 8): the five surviving pages keep their addresses
1:1, so only Cennik's two need replacements. Individual project pages are new addresses and appear
in no row here — they cannot break anything that is indexed today.

**One row is still open.** A row left empty at cutover is the
defect the guardrail exists to prevent. If PRD Open Question 8 changes the page set, a row's target
changes — the address still has to resolve or redirect deliberately.

## Behaviour to reproduce — verified 2026-09-03

The two probes that `429`d on LiteSpeed rate limiting last time now answer. All three are behaviour
the new site has to keep, not just addresses:

| Probe                               | Live response                                                      |
| ----------------------------------- | ------------------------------------------------------------------ |
| `https://wykonczymy.com.pl/` (apex) | `301` → `https://www.wykonczymy.com.pl/`                           |
| `/oferta` — no trailing slash       | `301` → `/oferta/`, which is what `trailingSlash: true` reproduces |
| a path that does not exist          | `404`                                                              |
