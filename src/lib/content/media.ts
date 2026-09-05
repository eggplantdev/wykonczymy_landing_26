import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import type { Media } from '@/payload-types'

// An upload field arrives as an id when the query's depth did not reach it, and its `url`
// is optional until the file is actually stored — either way there is nothing to render.
type UploadT = number | Media | null | undefined

const isPopulated = (value: UploadT): value is Media => typeof value === 'object' && value !== null

export const toImage = (value: UploadT): MediaImageT | null =>
  isPopulated(value) && value.url ? { url: value.url, alt: value.alt } : null

export const toVideo = (value: UploadT): MediaVideoT | null =>
  isPopulated(value) && value.url ? { url: value.url } : null

export const toImages = (values: (number | Media)[] | null | undefined): MediaImageT[] =>
  (values ?? []).map(toImage).filter((image): image is MediaImageT => image !== null)
