import type { MediaImageT } from '@/components/media/types'
import type { SpecItemT } from '@/lib/content/spec-item'

// tdg's `ObjectSlideT` and `NewsSlideT` were two near-identical shapes kept in step by
// hand and told apart at runtime; one shape with an optional detail strip serves both.
export type ObjectCarouselItemT = {
  key: string
  href: string
  title: string
  text: string
  image: MediaImageT | null
  /** Shown under the blurb on a project; a style has no specs and omits it. */
  details?: SpecItemT[]
}
