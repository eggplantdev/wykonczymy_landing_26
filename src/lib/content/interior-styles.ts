import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { InteriorStyle } from '@/payload-types'
import type { Locale } from '@/lib/i18n/i18n'
import type { MediaImageT } from '@/components/media/types'
import { toImage, toImages } from './media'
import { toSeoMeta, type SeoMetaT } from './seo'
import { isTranslated } from './translated'

// Shared by the listing grid, the home page's carousel teaser and the style's own page
// — tdg kept two copies of this shape and had to keep them in step by hand.
export type InteriorStyleT = {
  id: number
  slug: string
  title: string
  /** Card blurb. The style's own page opens with the same sentence, in full. */
  text: string
  body: string[]
  image: MediaImageT | null
  /** Breaks the article in half. */
  contentImage: MediaImageT | null
  gallery: MediaImageT[]
  meta: SeoMetaT
}

export const toInteriorStyle = (doc: InteriorStyle): InteriorStyleT => {
  const gallery = toImages(doc.gallery)

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    text: doc.text,
    body: (doc.body ?? []).map((row) => row.paragraph),
    image: toImage(doc.image) ?? gallery[0] ?? null,
    contentImage: toImage(doc.contentImage) ?? gallery[1] ?? null,
    gallery,
    meta: toSeoMeta(doc.meta, doc.text),
  }
}

// The listing, the home carousel and every style page read the same rows, so one cached
// query serves all of them rather than each fetching what it needs.
export const findInteriorStyles = cache(async (locale: Locale): Promise<InteriorStyleT[]> => {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'interior-styles',
    locale,
    depth: 1,
    limit: 100,
    sort: 'createdAt',
    where: { _status: { equals: 'published' } },
  })

  return docs.filter(isTranslated).map(toInteriorStyle)
})

/** The styles following this one, so every article ends on a different set of suggestions. */
export const relatedStyles = (
  styles: InteriorStyleT[],
  slug: string,
  count = 3,
): InteriorStyleT[] => {
  const index = styles.findIndex((style) => style.slug === slug)
  if (index < 0) return []

  return Array.from(
    { length: Math.min(count, styles.length - 1) },
    (_, offset) => styles[(index + offset + 1) % styles.length],
  )
}
