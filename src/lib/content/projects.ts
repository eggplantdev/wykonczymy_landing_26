import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Project } from '@/payload-types'
import type { Locale } from '@/lib/i18n/i18n'
import type { MediaImageT } from '@/components/media/types'
import type { ScopeItemT, SpecItemT } from '@/lib/content/spec-item'
import { toSeoMeta, type SeoMetaT } from './seo'
import { toImages } from './media'
import { toScope, toSpecs } from './specs'
import { isTranslated } from './translated'

export type ProjectT = {
  id: number
  slug: string
  title: string
  /** One-sentence summary. Doubles as the hero lead and the card blurb. */
  summary: string
  area: string
  duration: string
  address: string
  description: string
  scope: ScopeItemT[]
  materials: SpecItemT[]
  image: MediaImageT | null
  gallery: MediaImageT[]
  meta: SeoMetaT
}

export const toProject = (doc: Project): ProjectT => {
  // The cover is the first photo rather than a field of its own, so an editor picks it by
  // dragging it to the top of the one list the admin already shows.
  const [image, ...gallery] = toImages(doc.gallery)

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    area: doc.area ?? '',
    duration: doc.duration ?? '',
    address: doc.address ?? '',
    description: doc.description ?? '',
    scope: toScope(doc.scope),
    materials: toSpecs(doc.materials),
    image: image ?? null,
    gallery,
    meta: toSeoMeta(doc.meta, doc.summary, image),
  }
}

// The listing, the home carousel and every project page read the same handful of rows, so
// one cached query serves all of them rather than each fetching what it needs.
export const findProjects = cache(async (locale: Locale): Promise<ProjectT[]> => {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'projects',
    locale,
    depth: 1,
    limit: 100,
    sort: 'createdAt',
    where: { _status: { equals: 'published' } },
  })

  return docs.filter(isTranslated).map(toProject)
})

/** The first few that are not this one, so the page always closes on somewhere else to go. */
export const relatedProjects = (projects: ProjectT[], slug: string, count = 3): ProjectT[] =>
  projects.filter((project) => project.slug !== slug).slice(0, count)
