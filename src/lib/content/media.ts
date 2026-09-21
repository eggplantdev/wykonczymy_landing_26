import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import type { Media } from '@/payload-types'

// An upload field arrives as an id when the query's depth did not reach it, and its `url`
// is optional until the file is actually stored — either way there is nothing to render.
type UploadT = number | Media | null | undefined

const isPopulated = (value: UploadT): value is Media => typeof value === 'object' && value !== null

// Dropped when it sits dead centre, which is both Payload's default and the CSS one, so
// only a photo an editor actually re-aimed carries the override.
const toFocalPoint = (media: Media): MediaImageT['focalPoint'] => {
  const { focalX: x, focalY: y } = media
  if (typeof x !== 'number' || typeof y !== 'number') return undefined
  return x === 50 && y === 50 ? undefined : { x, y }
}

export const toImage = (value: UploadT): MediaImageT | null =>
  isPopulated(value) && value.url
    ? {
        url: value.url,
        // Typed `string`, but localized under `fallback: false` — undefined drops the attribute
        // entirely and a screen reader reads the file name instead.
        alt: value.alt ?? '',
        width: value.width ?? undefined,
        height: value.height ?? undefined,
        focalPoint: toFocalPoint(value),
      }
    : null

export const toVideo = (value: UploadT): MediaVideoT | null =>
  isPopulated(value) && value.url ? { url: value.url } : null

export const toImages = (values: (number | Media)[] | null | undefined): MediaImageT[] =>
  (values ?? []).map(toImage).filter((image): image is MediaImageT => image !== null)
