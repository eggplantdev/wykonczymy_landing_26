import type { MediaImageT } from '@/components/media/types'
import type { Page } from '@/payload-types'
import { toImage } from './media'

// The shape `generateMetadata` consumes. Identical on all three collections the seo plugin
// touches, so one type and one mapper serve pages, projects and interior styles.
export type SeoMetaT = {
  title?: string
  description?: string
  image: MediaImageT | null
}

// Google truncates a result snippet around here. Only a derived description is held to it —
// an editor who types their own gets the plugin's length indicator and the final say.
const DESCRIPTION_LIMIT = 155

const trimToLimit = (text: string): string => {
  if (text.length <= DESCRIPTION_LIMIT) return text

  const cut = text.slice(0, DESCRIPTION_LIMIT)
  const lastSpace = cut.lastIndexOf(' ')

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, '')}…`
}

// `derivedDescription` is the copy the document already carries — a project's `summary`, a
// style's `text`. Both are required one-sentence blurbs, so a child never needs a second
// description written for it and one added later is covered without an editor touching the
// SEO tab. `meta.description` stays an override for the rare case someone wants one.
export const toSeoMeta = (meta: Page['meta'], derivedDescription?: string): SeoMetaT => ({
  title: meta?.title ?? undefined,
  description:
    meta?.description ?? (derivedDescription ? trimToLimit(derivedDescription) : undefined),
  image: toImage(meta?.image),
})
