import type { MetadataRoute } from 'next'

import { listAddresses } from '@/lib/content/addresses'
import { pathsForPage } from '@/lib/content/pages'
import { SERVER_URL } from '@/lib/env'

// Outside `(frontend)` so the catch-all segment does not swallow `/sitemap.xml`, the same
// reason `robots.ts` sits here.
//
// Inert until cutover — `robots.ts` disallows everything and the layout sends `noindex`. It
// ships now so cutover is a deletion rather than a build.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const addresses = await listAddresses()

  return Promise.all(
    addresses.map(async ({ path, pageId, childSlug }) => ({
      url: new URL(path, SERVER_URL).href,
      // A child's counterpart slug lives in its own collection and is not resolvable from the
      // parent, so only page-level entries advertise their translations — the same limit
      // `generateMetadata` documents.
      ...(childSlug
        ? {}
        : {
            alternates: {
              languages: Object.fromEntries(
                Object.entries(await pathsForPage(pageId)).map(([locale, localePath]) => [
                  locale,
                  new URL(localePath, SERVER_URL).href,
                ]),
              ),
            },
          }),
    })),
  )
}
