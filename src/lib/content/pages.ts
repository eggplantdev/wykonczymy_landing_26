import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Page } from '@/payload-types'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import { HOME_PAGE_TYPE, pathForPage } from '@/lib/routing'

// generateMetadata and the component both resolve the same request, so without this
// every render costs two identical queries.
export const findPage = cache(async (locale: Locale, slug: string | null) => {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    // Two levels: the page's own media and its featured-project relationship, then that
    // project's photos.
    depth: 2,
    limit: 1,
    where: {
      _status: { equals: 'published' },
      ...(slug === null ? { pageType: { equals: HOME_PAGE_TYPE } } : { slug: { equals: slug } }),
    },
  })

  const doc = docs[0] ?? null

  // The home document owns the locale root, so in the default locale its own slug is not a
  // second address for it — `dynamicParams` would otherwise resolve `/start/` to a byte-identical
  // copy of `/`, which is duplicate content against the twelve-address map.
  if (doc && slug !== null && doc.pageType === HOME_PAGE_TYPE && locale === i18n.defaultLocale)
    return null

  return doc
})

// The same document answers to one address per locale, and only the document knows
// its counterpart slug — so the switcher's hrefs come from a second read, not a path
// rewrite.
//
// `fallback: false` means a locale's slug can legitimately be empty while the page is
// live in the other language, so a locale without one is omitted rather than turned
// into `/en/undefined/`.
export const pathsForPage = cache(
  async (id: string | number): Promise<Partial<Record<Locale, string>>> => {
    const payload = await getPayload({ config: await config })
    const doc = await payload.findByID({ collection: 'pages', id, depth: 0, locale: 'all' })

    // `locale: 'all'` widens every localized field to a per-locale record, which the
    // generated single-locale types do not describe.
    const slugs = doc.slug as unknown as Partial<Record<Locale, string>>
    const paths: Partial<Record<Locale, string>> = {}

    for (const locale of i18n.locales) {
      const slug = slugs?.[locale]
      if (slug) paths[locale] = pathForPage({ slug, pageType: doc.pageType }, locale)
    }

    return paths
  },
)

// "Which pages are live" is one contract, read by both the address maps and the
// prerender list — as two copies it could be narrowed in one and not the other.
export const findPublishedPages = cache(async (locale: Locale): Promise<Page[]> => {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    depth: 0,
    limit: 1000,
    where: { _status: { equals: 'published' } },
  })

  return docs
})

// Copy links to a *page*, not to a string: PL and EN slugs differ, so an href written
// into content is right in at most one locale. Content names a page type; this turns it
// into that locale's address.
export const pathsByType = cache(
  async (locale: Locale): Promise<Partial<Record<Page['pageType'], string>>> => {
    const paths: Partial<Record<Page['pageType'], string>> = {}

    for (const doc of await findPublishedPages(locale)) {
      if (doc.pageType === HOME_PAGE_TYPE || doc.slug)
        paths[doc.pageType] = pathForPage(doc, locale)
    }

    return paths
  },
)
