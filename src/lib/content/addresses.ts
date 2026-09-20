import { cache } from 'react'

import { i18n, type Locale } from '@/lib/i18n/i18n'
import { HOME_PAGE_TYPE, pathForPage } from '@/lib/routing'
import { findChildren } from './children'
import { findPublishedPages } from './pages'

export type AddressT = {
  locale: Locale
  /** Root-relative and trailing-slashed, exactly as `pathForPage` builds it. */
  path: string
  pageId: string | number
  childSlug?: string
}

// The prerender list and the sitemap have to agree on what the site's addresses are — as two
// enumerations they could be narrowed in one and not the other, and the sitemap would advertise
// a URL that was never built.
export const listAddresses = cache(async (): Promise<AddressT[]> => {
  const perLocale = await Promise.all(
    i18n.locales.map(async (locale) => {
      const docs = await findPublishedPages(locale)
      const addresses: AddressT[] = []

      // Hoisted out of the document loop so the two child collections are read once per
      // locale by construction, rather than relying on `cache()` to collapse a read per page.
      const children = new Map(
        await Promise.all(
          docs.map(
            async (doc) => [doc.pageType, await findChildren(doc.pageType, locale)] as const,
          ),
        ),
      )

      // `fallback: false`, so a page translated in one language only comes back with an
      // empty slug in the other — listing it would emit `/en/null/`.
      for (const doc of docs) {
        if (doc.pageType !== HOME_PAGE_TYPE && !doc.slug) continue

        addresses.push({ locale, path: pathForPage(doc, locale), pageId: doc.id })

        for (const child of children.get(doc.pageType) ?? [])
          addresses.push({
            locale,
            path: pathForPage(doc, locale, child.slug),
            pageId: doc.id,
            childSlug: child.slug,
          })
      }

      return addresses
    }),
  )

  return perLocale.flat()
})
