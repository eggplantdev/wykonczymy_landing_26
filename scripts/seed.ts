import { getPayload, type Payload } from 'payload'

import config from '@payload-config'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import { footerContact, footerCopy } from './seed/data/footer'
import { interiorStyleSeeds } from './seed/data/interior-styles'
import { homeCopy, homeShared, pageSeeds, type HomeCopyT } from './seed/data/pages'
import { featuredProjectSlug, projectSeeds } from './seed/data/projects'

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

/**
 * Payload matches array rows by id. The services and numbers rows are *not* localized —
 * one row set, translated field by field — so the English pass has to carry the ids the
 * Polish pass created, or it replaces the rows and takes the Polish copy with them.
 */
type RowIdsT = { services: (string | undefined)[]; numbers: (string | undefined)[] }

const homeGroup = (copy: HomeCopyT, featuredProject: number | undefined, rowIds: RowIdsT) => ({
  hero: {
    title: copy.hero.title,
    ctaLabel: copy.hero.ctaLabel,
    ctaLink: homeShared.heroCtaLink,
  },
  intro: { text: copy.intro, position: homeShared.introPosition },
  services: {
    sectionTitle: copy.services.sectionTitle,
    cards: copy.services.cards.map((card, index) => ({ id: rowIds.services[index], ...card })),
  },
  projects: {
    sectionTitle: copy.projects.sectionTitle,
    ctaLabel: copy.projects.ctaLabel,
    ctaLink: homeShared.projectsCtaLink,
  },
  numbers: {
    sectionTitle: copy.numbers.sectionTitle,
    cards: copy.numbers.cards.map((card, index) => ({
      id: rowIds.numbers[index],
      value: homeShared.numberValues[index],
      ...card,
    })),
  },
  interiorStyles: {
    sectionTitle: copy.interiorStyles.sectionTitle,
    ctaLabel: copy.interiorStyles.ctaLabel,
    ctaLink: homeShared.interiorStylesCtaLink,
  },
  featuredProject: {
    sectionTitle: copy.featuredProject.sectionTitle,
    ctaLabel: copy.featuredProject.ctaLabel,
    project: featuredProject,
  },
})

const emptyRowIds: RowIdsT = { services: [], numbers: [] }

async function seedPages(payload: Payload, projectIds: Record<string, number>): Promise<void> {
  for (const seed of pageSeeds) {
    const isHome = seed.pageType === 'home'

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
        ? { home: homeGroup(homeCopy.pl, projectIds[featuredProjectSlug], emptyRowIds) }
        : {}),
    }

    const doc = existing
      ? await payload.update({ collection: 'pages', id: existing.id, locale: 'pl', data: plData })
      : await payload.create({ collection: 'pages', locale: 'pl', data: plData })

    const rowIds: RowIdsT = {
      services: (doc.home?.services?.cards ?? []).map((card) => card.id ?? undefined),
      numbers: (doc.home?.numbers?.cards ?? []).map((card) => card.id ?? undefined),
    }

    await payload.update({
      collection: 'pages',
      id: doc.id,
      locale: 'en',
      data: {
        ...seed.copy.en,
        ...(isHome
          ? { home: homeGroup(homeCopy.en, projectIds[featuredProjectSlug], rowIds) }
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

const payload = await getPayload({ config })

const projectIds = await seedProjects(payload)
payload.logger.info(`Seeded ${Object.keys(projectIds).length} projects`)

await seedInteriorStyles(payload)
payload.logger.info(`Seeded ${interiorStyleSeeds.length} interior styles`)

await seedPages(payload, projectIds)
payload.logger.info(`Seeded ${pageSeeds.length} pages`)

await seedFooter(payload)
payload.logger.info('Seeded the footer')

await payload.destroy()
