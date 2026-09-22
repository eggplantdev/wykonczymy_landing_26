---
project: wykonczymy-www
change: s7-seo
drafted: 2026-09-21
---

# Page descriptions — review snapshot

The canonical strings live in `scripts/populate-seo.ts`. **This file is a snapshot for reading,
not a source** — if a line here reads badly, change it in the script.

**Pages only.** Projects and interior styles are not here and never will be: they derive their
description from `summary` / `text` (`src/lib/content/seo.ts`), which are required, localized,
one-sentence blurbs the editor already writes. A second description per item is work nobody would
keep up.

## What is actually in the database

Ten published pages, five page types, both locales. **Every one of the ten has
`meta.description` empty** — nothing here overwrites authored copy.

`price-list` is one of the twelve indexed addresses but **has no document at all**, so it is not in
the write set. `/cennik/` currently redirects. Either the page gets created and re-run through this
script, or the address leaves `url-map.md` — that decision belongs to cutover, not here.

## Why the live site's copy is barely used

Of the twelve live descriptions (`live-seo-harvest.md`), only the home one is worth carrying:

- **Two are hand-written** — `/` at 131 chars (reused verbatim below) and `/oferta/` at 440 chars,
  for a page type this site does not have.
- **Three are verbatim copies of the home one** — `/realizacje/`, `/kontakt/`, `/cennik/`.
- **Six are AIOSEO body-extracts**, cut mid-sentence. `/en/contact/` contains _"Please enable
  JavaScript in your browser to complete this form"_; `/en/price-list/` is a price table run
  together into prose.
- **One is empty** — `/en/completed-works/`.

So: the Polish home description is carried over. Everything else is authored. The English lines are
authored rather than translated from the Polish, because a search snippet reads as a sentence, not
as a gloss.

## The copy

Each is under the 155-character mark Google truncates a snippet around.

### `home`

- **pl** (131) — carried verbatim from the live `/`, the one hand-written, page-agnostic line on
  the old site.

  > Kompleksowe remonty domów, mieszkań, biur, klatek schodowych, lokali usługowych oraz inne
  > powiązane usługi w Warszawie i okolicach.

- **en** (115) — authored; the live `/en/home/` description is a body-extract.

  > Complete renovations of houses, flats, offices, stairwells and commercial units in Warsaw and
  > the surrounding area.

### `completed-works`

Names what the page is — photographs of finished jobs — rather than repeating the home line, which
is what the old site did.

- **pl** (135)

  > Zrealizowane remonty mieszkań i domów w Warszawie — zdjęcia z każdej realizacji, zakres prac i
  > wykończenia, które wybrali nasi klienci.

- **en** (130)

  > Renovations we have completed in Warsaw — photographs from each project, the scope of the work
  > and the finishes our clients chose.

### `interior-styles`

Leads with four of the thirteen style names, because those are the words someone actually searches.

- **pl** (131)

  > Boho, glamour, japandi, industrialny i dziewięć innych stylów wnętrz — czym się różnią, do
  > jakich wnętrz pasują i jak je wykończyć.

- **en** (133)

  > Boho, glamour, japandi, industrial and nine more interior styles — how they differ, where they
  > work and how to finish a room in each.

### `contact`

- **pl** (123)

  > Telefon, mail i adres firmy remontowej Wykończymy w Warszawie. Napisz, podaj zakres prac i
  > metraż — odezwiemy się z wyceną.

- **en** (145)

  > Phone, email and address for Wykończymy, a renovation company in Warsaw. Tell us the scope and
  > the floor area and we will come back with a quote.

### `privacy-policy`

- **pl** (129)

  > Jak serwis wykonczymy.com.pl przetwarza dane osobowe przesłane przez formularz kontaktowy, na
  > jakiej podstawie i przez jaki czas.

- **en** (129)

  > How wykonczymy.com.pl processes the personal data sent through the contact form, on what legal
  > basis and for how long it is kept.

## Running it

`POSTGRES_URL` is production in every environment, so this is a production write.

```sh
pnpm db:dump                # the database is the only copy of the content
pnpm seo:populate           # dry run — prints every line it would write
pnpm seo:populate --write   # applies it
```

The script writes only where `meta.description` is empty and touches the `pages` collection only.
Re-running it after the write is a no-op that prints `keep` for every row.
