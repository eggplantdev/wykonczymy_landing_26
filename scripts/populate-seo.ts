import { getPayload } from 'payload'

import config from '@/payload.config'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import type { PageTypeT } from '@/lib/routing'

// The canonical copy. `seo-copy.md` in the change folder is a review snapshot of these strings
// with the sourcing argument behind each one — edit here, not there.
//
// Pages only. Projects and interior styles derive their description from `summary` / `text`
// (see `lib/content/seo.ts`), so writing a second one per item is work nobody would keep up.
const DESCRIPTIONS: Partial<Record<PageTypeT, Record<Locale, string>>> = {
  home: {
    pl: 'Kompleksowe remonty domów, mieszkań, biur, klatek schodowych, lokali usługowych oraz inne powiązane usługi w Warszawie i okolicach.',
    en: 'Complete renovations of houses, flats, offices, stairwells and commercial units in Warsaw and the surrounding area.',
  },
  'completed-works': {
    pl: 'Zrealizowane remonty mieszkań i domów w Warszawie — zdjęcia z każdej realizacji, zakres prac i wykończenia, które wybrali nasi klienci.',
    en: 'Renovations we have completed in Warsaw — photographs from each project, the scope of the work and the finishes our clients chose.',
  },
  'interior-styles': {
    pl: 'Boho, glamour, japandi, industrialny i dziewięć innych stylów wnętrz — czym się różnią, do jakich wnętrz pasują i jak je wykończyć.',
    en: 'Boho, glamour, japandi, industrial and nine more interior styles — how they differ, where they work and how to finish a room in each.',
  },
  contact: {
    pl: 'Telefon, mail i adres firmy remontowej Wykończymy w Warszawie. Napisz, podaj zakres prac i metraż — odezwiemy się z wyceną.',
    en: 'Phone, email and address for Wykończymy, a renovation company in Warsaw. Tell us the scope and the floor area and we will come back with a quote.',
  },
  'privacy-policy': {
    pl: 'Jak serwis wykonczymy.com.pl przetwarza dane osobowe przesłane przez formularz kontaktowy, na jakiej podstawie i przez jaki czas.',
    en: 'How wykonczymy.com.pl processes the personal data sent through the contact form, on what legal basis and for how long it is kept.',
  },
}

const isWrite = process.argv.includes('--write')

const run = async () => {
  const payload = await getPayload({ config: await config })
  let written = 0
  let skipped = 0

  for (const locale of i18n.locales) {
    // `fallback: false`, so each locale is read and written on its own — a PL description
    // never stands in for a missing EN one.
    const { docs } = await payload.find({
      collection: 'pages',
      locale,
      depth: 0,
      limit: 100,
      where: { _status: { equals: 'published' } },
    })

    for (const doc of docs) {
      const description = DESCRIPTIONS[doc.pageType as PageTypeT]?.[locale]

      if (!description) {
        console.log(`skip  ${locale} ${doc.pageType} — no copy drafted`)
        skipped += 1
        continue
      }

      // An authored value is never overwritten: this script exists to fill a gap once, not to
      // become the place page descriptions live.
      if (doc.meta?.description) {
        console.log(`keep  ${locale} ${doc.pageType} — already has "${doc.meta.description}"`)
        skipped += 1
        continue
      }

      console.log(`${isWrite ? 'write' : 'dry  '} ${locale} ${doc.pageType} → "${description}"`)

      if (isWrite)
        await payload.update({
          collection: 'pages',
          id: doc.id,
          locale,
          data: { meta: { description } },
        })

      written += 1
    }
  }

  console.log(
    `\n${isWrite ? 'wrote' : 'would write'} ${written}, left ${skipped} alone.` +
      (isWrite ? '' : '\nRe-run with --write to apply. Take `pnpm db:dump` first.'),
  )

  process.exit(0)
}

run()
