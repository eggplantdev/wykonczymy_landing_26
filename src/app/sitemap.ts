import type { MetadataRoute } from 'next'

import { listAddresses } from '@/lib/content/addresses'
import { pathsForPage } from '@/lib/content/pages'
import { absoluteUrl } from '@/lib/seo/absolute-url'

// Outside `(frontend)` so the catch-all segment does not swallow `/sitemap.xml`, the same
// reason `robots.ts` sits here.
//
// Inert until cutover — `robots.ts` disallows everything and the layout sends `noindex`.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const addresses = await listAddresses()

  return Promise.all(
    addresses.map(async ({ path, pageId, childSlug }) => {
      const url = absoluteUrl(path)

      // A child's counterpart slug lives in its own collection and is not resolvable from the
      // parent, so only page-level entries advertise their translations — the same limit
      // `generateMetadata` documents.
      if (childSlug) return { url }

      const paths = await pathsForPage(pageId)

      return {
        url,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(paths).map(([locale, localePath]) => [locale, absoluteUrl(localePath)]),
          ),
        },
      }
    }),
  )
}
