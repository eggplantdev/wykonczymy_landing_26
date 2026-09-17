import type { Payload } from 'payload'

import { i18n, type Locale } from '@/lib/i18n/i18n'
import { HOME_PAGE_TYPE } from '@/lib/routing'
import { footerContact, footerCopy } from './data/footer'
import { interiorStyleSeeds } from './data/interior-styles'
import { homeCopy, homeShared } from './data/home'
import { homeGroup, rowIdsOf } from './home-group'
import { pageSeeds } from './data/pages'
import { projectSeeds } from './data/projects'

// Populates an empty database — local, preview or production — with the content the site
// renders, in both locales. Idempotent: every document is matched on the key that
// identifies it (a page's type, a project's Polish slug) and updated in place, so running
// it twice does not duplicate anything and does not undo photos attached in the admin.
//
// Images are deliberately not seeded. Media has to be uploaded through the admin, and a
// missing photo renders as a placeholder rather than breaking the page.

/** Payload writes one locale at a time, and `fallback: false` means both are required. */
const locales = i18n.locales as readonly Locale[]

async function seedProjects(payload: Payload): Promise<Record<string, number>> {
  const ids: Record<string, number> = {}

  for (const seed of projectSeeds) {
    const { docs } = await payload.find({
      collection: 'projects',
      locale: 'pl',
      draft: true,
      depth: 0,
      limit: 1,
      where: { slug: { equals: seed.pl.slug } },
    })

    const existing = docs[0]
    const doc = existing
      ? await payload.update({
          collection: 'projects',
          id: existing.id,
          locale: 'pl',
          data: { ...seed.pl, _status: 'published' },
        })
      : await payload.create({
          collection: 'projects',
          locale: 'pl',
          data: { ...seed.pl, _status: 'published' },
        })

    await payload.update({ collection: 'projects', id: doc.id, locale: 'en', data: seed.en })
    ids[seed.pl.slug] = doc.id
  }

  return ids
}

async function seedInteriorStyles(payload: Payload): Promise<void> {
  for (const seed of interiorStyleSeeds) {
    const data = (copy: (typeof seed)['pl']) => ({
      title: copy.title,
      slug: copy.slug,
      text: copy.text,
      body: copy.body.map((paragraph) => ({ paragraph })),
    })

    const { docs } = await payload.find({
      collection: 'interior-styles',
      locale: 'pl',
      draft: true,
      depth: 0,
      limit: 1,
      where: { slug: { equals: seed.pl.slug } },
    })

    const existing = docs[0]
    const doc = existing
      ? await payload.update({
          collection: 'interior-styles',
          id: existing.id,
          locale: 'pl',
          data: { ...data(seed.pl), _status: 'published' },
        })
      : await payload.create({
          collection: 'interior-styles',
          locale: 'pl',
          data: { ...data(seed.pl), _status: 'published' },
        })

    await payload.update({
      collection: 'interior-styles',
      id: doc.id,
      locale: 'en',
      data: data(seed.en),
    })
  }
}

async function seedPages(payload: Payload, projectIds: Record<string, number>): Promise<void> {
  for (const seed of pageSeeds) {
    const isHome = seed.pageType === HOME_PAGE_TYPE

    const { docs } = await payload.find({
      collection: 'pages',
      locale: 'pl',
      draft: true,
      depth: 0,
      limit: 1,
      where: { pageType: { equals: seed.pageType } },
    })

    const existing = docs[0]
    const plData = {
      ...seed.copy.pl,
      pageType: seed.pageType,
      _status: 'published' as const,
      ...(isHome
        ? {
            home: homeGroup(
              homeCopy.pl,
              projectIds[homeShared.featuredProjectSlug],
              rowIdsOf(existing),
            ),
          }
        : {}),
    }

    const doc = existing
      ? await payload.update({ collection: 'pages', id: existing.id, locale: 'pl', data: plData })
      : await payload.create({ collection: 'pages', locale: 'pl', data: plData })

    await payload.update({
      collection: 'pages',
      id: doc.id,
      locale: 'en',
      data: {
        ...seed.copy.en,
        ...(isHome
          ? {
              home: homeGroup(
                homeCopy.en,
                projectIds[homeShared.featuredProjectSlug],
                rowIdsOf(doc),
              ),
            }
          : {}),
      },
    })
  }
}

async function seedFooter(payload: Payload): Promise<void> {
  for (const locale of locales) {
    await payload.updateGlobal({
      slug: 'footer',
      locale,
      data: { ...footerContact, ...footerCopy[locale] },
    })
  }
}

/**
 * Every write the seed performs, against an already-open Payload. Split from the CLI entry
 * so the integration tests can run the same code the operator runs, rather than a copy of it.
 */
export async function seedAll(payload: Payload): Promise<void> {
  const projectIds = await seedProjects(payload)
  payload.logger.info(`Seeded ${Object.keys(projectIds).length} projects`)

  await seedInteriorStyles(payload)
  payload.logger.info(`Seeded ${interiorStyleSeeds.length} interior styles`)

  await seedPages(payload, projectIds)
  payload.logger.info(`Seeded ${pageSeeds.length} pages`)

  await seedFooter(payload)
  payload.logger.info('Seeded the footer')
}
