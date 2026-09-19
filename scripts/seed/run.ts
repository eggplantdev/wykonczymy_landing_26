import type { Payload } from 'payload'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { SanitizedServerEditorConfig } from '@payloadcms/richtext-lexical'

import type { Page } from '@/payload-types'

import { i18n, type Locale } from '@/lib/i18n/i18n'
import {
  CONTACT_PAGE_TYPE,
  HOME_PAGE_TYPE,
  PRIVACY_POLICY_PAGE_TYPE,
  type PageTypeT,
} from '@/lib/routing'
import { contactCopy } from './data/contact'
import { legalBodySeeds } from './data/legal'
import { footerContact, footerCopy, footerRatings } from './data/footer'
import { interiorStyleSeeds } from './data/interior-styles'
import { homeCopy } from './data/home'
import { carriedFrom, homeGroup } from './home-group'
import { pageSeeds } from './data/pages'
import { projectSeeds } from './data/projects'

// Populates an empty database — local, preview or production — with the content the site
// renders, in both locales. Idempotent: every document is matched on the key that
// identifies it (a page's type, a project's Polish slug) and updated in place, so running
// it twice does not duplicate anything and does not undo photos attached in the admin.
//
// Images are deliberately left alone here so this stays safe to re-run over a populated
// admin; `pnpm seed:photos` is the one that writes them.

/** Payload writes one locale at a time, and `fallback: false` means both are required. */
const locales = i18n.locales as readonly Locale[]

async function seedProjects(payload: Payload): Promise<void> {
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
  }
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
 * The conditional field group a page type owns, if it owns one. Keyed off the type rather
 * than branched at both call sites: the Polish and English passes have to agree on which
 * group they write, or one locale silently keeps the other's shape.
 */
function groupFor(
  pageType: PageTypeT,
  locale: Locale,
  existing: Page | undefined,
  editorConfig: SanitizedServerEditorConfig,
): Record<string, unknown> {
  if (pageType === HOME_PAGE_TYPE)
    return { home: homeGroup(homeCopy[locale], carriedFrom(existing)) }
  if (pageType === CONTACT_PAGE_TYPE) return { contact: contactCopy[locale] }
  if (pageType === PRIVACY_POLICY_PAGE_TYPE) {
    return {
      legal: { body: convertMarkdownToLexical({ editorConfig, markdown: legalBodySeeds[locale] }) },
    }
  }
  return {}
}

async function seedPages(payload: Payload): Promise<void> {
  // The field declares no editor of its own, so the default config is the one the admin's own
  // editor uses — which is what makes the seeded tree identical to a hand-typed one.
  const editorConfig = await editorConfigFactory.default({ config: payload.config })

  for (const seed of pageSeeds) {
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
      ...groupFor(seed.pageType, 'pl', existing, editorConfig),
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
        ...groupFor(seed.pageType, 'en', doc, editorConfig),
      },
    })
  }
}

async function seedFooter(payload: Payload): Promise<void> {
  // Same row-id rule as the page arrays: a row written without an id replaces the stored one,
  // so both locale passes carry the ids already in the database.
  const stored = await payload.findGlobal({ slug: 'footer' })
  const rowIds = (stored.ratings ?? []).map((row) => row.id ?? undefined)

  for (const locale of locales) {
    await payload.updateGlobal({
      slug: 'footer',
      locale,
      data: {
        ...footerContact,
        ...footerCopy[locale],
        ratings: footerRatings.map((row, index) => ({ id: rowIds[index], ...row })),
      },
    })
  }
}

/**
 * Every write the seed performs, against an already-open Payload. Split from the CLI entry
 * so the integration tests can run the same code the operator runs, rather than a copy of it.
 */
export async function seedAll(payload: Payload): Promise<void> {
  await seedProjects(payload)
  payload.logger.info(`Seeded ${projectSeeds.length} projects`)

  await seedInteriorStyles(payload)
  payload.logger.info(`Seeded ${interiorStyleSeeds.length} interior styles`)

  await seedPages(payload)
  payload.logger.info(`Seeded ${pageSeeds.length} pages`)

  await seedFooter(payload)
  payload.logger.info('Seeded the footer')
}
