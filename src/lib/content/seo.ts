import type { MediaImageT } from '@/components/media/types'
import type { Page } from '@/payload-types'
import { toImage } from './media'

// Identical on all three collections the seo plugin touches, so one type and one mapper serve
// pages, projects and interior styles.
export type SeoMetaT = {
  title?: string
  description?: string
  image: MediaImageT | null
}

// Google truncates a result snippet around here. Only a derived description is held to it —
// an editor who types their own gets the plugin's length indicator and the final say.
export const DESCRIPTION_LIMIT = 155

// Clearing a field in the admin submits `''`, which `??` would pass through as an authored
// value and suppress the derived fallback.
const blankToUndefined = (value?: string | null): string | undefined => value?.trim() || undefined

const trimToLimit = (text: string): string => {
  // By code point, not code unit: slicing mid-surrogate emits a lone half that renders as
  // the replacement character. One short of the limit leaves room for the ellipsis.
  const characters = Array.from(text)
  if (characters.length <= DESCRIPTION_LIMIT) return text

  const cut = characters.slice(0, DESCRIPTION_LIMIT - 1).join('')
  const lastSpace = cut.lastIndexOf(' ')

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, '')}…`
}

// `derivedDescription` is the copy the document already carries — a project's `summary`, a
// style's `text`. Both are required one-sentence blurbs, so a child never needs a second
// description written for it and one added later is covered without an editor touching the
// SEO tab. `meta.description` stays an override for the rare case someone wants one.
//
// `derivedImage` is the same bargain for the share card: without it every child address falls
// back to the one brand card, which is the outcome the derived description exists to avoid.
export const toSeoMeta = (
  meta: Page['meta'],
  derivedDescription?: string,
  derivedImage?: MediaImageT | null,
): SeoMetaT => ({
  title: blankToUndefined(meta?.title),
  description:
    blankToUndefined(meta?.description) ??
    (derivedDescription ? trimToLimit(derivedDescription) : undefined),
  image: toImage(meta?.image) ?? derivedImage ?? null,
})
