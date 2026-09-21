import { getPayload } from 'payload'

import config from '@/payload.config'
import { findPublishedPages } from '@/lib/content/pages'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import type { PageTypeT } from '@/lib/routing'
import { isWrite, runWriteScript } from './write-guard'

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

// The share card, by filename rather than media id — the id says nothing to a reader and a
// wrong one fails silently as somebody else's photo, where a wrong filename aborts the run.
//
// A page carries no image of its own, so each one points at a photo it already leads with:
// home at its hero, the two listings at the first item they show. Contact and the privacy
// policy are deliberately absent — `toOgImages` falls back to the brand card, which is the
// better share image for both than an arbitrary living room.
//
// Localized, like `meta.description`: the column is on `pages_locales`. The same photo is
// written to both locales here only because these three are rooms, not copy.
const IMAGES: Partial<Record<PageTypeT, string>> = {
  home: 'salon-bezowy.jpg',
  'completed-works': 'Jastrzebie-Patkow-lesnych-106G-12.webp',
  'interior-styles': 'boho-salon.webp',
}

const run = async () => {
  const payload = await getPayload({ config: await config })

  // Resolved once, and a miss aborts before anything is written rather than leaving half the
  // pages pointing at a card and half at the brand fallback.
  const filenames = Object.values(IMAGES)
  const { docs: media } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: filenames.length,
    where: { filename: { in: filenames } },
  })
  const imageIdByFilename = new Map(media.map((doc) => [doc.filename, doc.id]))

  const missing = filenames.filter((filename) => !imageIdByFilename.has(filename))
  if (missing.length > 0) {
    console.error(`No media row for: ${missing.join(', ')}. Nothing was written.`)
    process.exit(1)
  }

  let written = 0
  let skipped = 0

  for (const locale of i18n.locales) {
    // `fallback: false`, so each locale is read and written on its own — a PL description
    // never stands in for a missing EN one.
    const docs = await findPublishedPages(locale)

    // `payload.update` merges onto the *latest* version, not the published one, so a page with
    // unpublished editorial work sitting in the admin would have that draft published as a side
    // effect of filling in a description. Reproduced against the test database; see
    // `review-gate.md`. Such a page is left for the editor rather than written through.
    const { docs: latest } = await payload.find({
      collection: 'pages',
      locale,
      depth: 0,
      limit: 100,
      draft: true,
    })
    const drafted = new Set(
      latest.filter((doc) => doc._status !== 'published').map((doc) => doc.id),
    )

    for (const doc of docs) {
      if (drafted.has(doc.id)) {
        console.log(`skip  ${locale} ${doc.pageType} — has an unpublished draft`)
        skipped += 1
        continue
      }

      const pageType = doc.pageType as PageTypeT
      const filename = IMAGES[pageType]

      // Blanks only. An editor's own description or share card outranks anything drafted here,
      // and re-running the script must never undo one.
      const description = doc.meta?.description ? undefined : DESCRIPTIONS[pageType]?.[locale]
      const image = doc.meta?.image || !filename ? undefined : imageIdByFilename.get(filename)

      if (!description && !image) {
        console.log(`keep  ${locale} ${doc.pageType} — nothing left to fill`)
        skipped += 1
        continue
      }

      const filled = [description && `description "${description}"`, image && `image ${filename}`]
        .filter(Boolean)
        .join(' + ')

      console.log(`${isWrite ? 'write' : 'dry  '} ${locale} ${doc.pageType} → ${filled}`)

      // The group is sent whole rather than field by field, so filling one of the two can
      // never be what clears the other.
      if (isWrite)
        await payload.update({
          collection: 'pages',
          id: doc.id,
          locale,
          data: {
            meta: {
              ...doc.meta,
              ...(description ? { description } : {}),
              ...(image ? { image } : {}),
            },
          },
        })

      written += 1
    }
  }

  return { written, kept: skipped }
}

runWriteScript(run)
