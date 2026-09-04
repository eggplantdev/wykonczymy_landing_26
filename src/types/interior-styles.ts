import type { MediaImageT } from '@/components/media/types'

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
  /** Breaks the article in half, the way tdg's `contentImg` splits its two body fields. */
  contentImage: MediaImageT | null
  gallery: MediaImageT[]
}
