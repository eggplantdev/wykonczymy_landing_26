import type { MediaImageT } from '@/components/media/types'

/** A labelled fact — the spec rows, the scope list and the carousel's detail strip all use it. */
export type SpecItemT = {
  id: number
  name: string
  value: string
}

// Shared by the listing page, the home page's carousel teaser and the project's own page.
export type ProjectT = {
  id: number
  slug: string
  title: string
  /** One-sentence summary. Doubles as the hero lead and the card blurb. */
  summary: string
  price: string
  area: string
  duration: string
  address: string
  description: string
  scope: SpecItemT[]
  materials: SpecItemT[]
  image: MediaImageT | null
  gallery: MediaImageT[]
}
