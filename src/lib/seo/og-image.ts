import type { MediaImageT } from '@/components/media/types'
import { SITE_NAME } from './constants'

// Kept in `public/` rather than as Next's `src/app/opengraph-image.png` file convention: file-based
// metadata outranks `generateMetadata`, so the convention would pin this image to every address and
// a document's own `meta.image` could never win.
const DEFAULT_OG_IMAGE = {
  url: '/images/og-default.png',
  width: 1200,
  height: 630,
  alt: SITE_NAME,
} as const

// A card with no image is rendered as a bare link.
export const toOgImages = (image: MediaImageT | null) =>
  image
    ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt }]
    : [DEFAULT_OG_IMAGE]
