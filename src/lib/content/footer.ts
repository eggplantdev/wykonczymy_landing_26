import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { SiteFooterT } from '@/components/footer/site-footer'
import type { RatingT } from '@/components/ui/rating-badge'
import type { Locale } from '@/lib/i18n/i18n'
import { toImage } from './media'

// The ratings render on the home page, not in the footer, but they are stored on the footer
// global: it is the one document every page already loads, so the badges cost no extra query.
export type FooterDataT = SiteFooterT & { ratings: RatingT[] }

export const findFooter = cache(async (locale: Locale): Promise<FooterDataT> => {
  const payload = await getPayload({ config: await config })
  const doc = await payload.findGlobal({ slug: 'footer', locale, depth: 1 })

  // `platform` and `rating` are required in the config, so the generated type promises both —
  // a row an editor added and left half-filled comes back without them.
  const ratings =
    doc.ratings?.flatMap((row) =>
      row.platform && typeof row.rating === 'number'
        ? [
            {
              platform: row.platform,
              rating: row.rating,
              profileUrl: row.profileUrl ?? undefined,
            },
          ]
        : [],
    ) ?? []

  return {
    title: doc.title,
    intro: doc.intro,
    name: doc.name,
    role: doc.role,
    phone: doc.phone,
    mail: doc.mail,
    avatar: toImage(doc.avatar),
    ratings,
  }
})
