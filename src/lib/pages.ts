import { cache } from 'react'
import { getPayload, type Payload } from 'payload'

import config from '@/payload.config'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import { pathForPage } from '@/lib/routing'

// generateMetadata and the component both resolve the same request, so without this
// every render costs two identical queries.
export const findPage = cache(async (locale: Locale, slug: string | null) => {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    depth: 0,
    limit: 1,
    where: {
      _status: { equals: 'published' },
      ...(slug === null ? { isHome: { equals: true } } : { slug: { equals: slug } }),
    },
  })

  return docs[0] ?? null
})

// The same document answers to one address per locale, and only the document knows
// its counterpart slug — so the switcher's hrefs come from a second read, not a path
// rewrite.
//
// `fallback: false` means a locale's slug can legitimately be empty while the page is
// live in the other language, so a locale without one is omitted rather than turned
// into `/en/undefined/`.
// A hook passes its own `req.payload` so the read joins the write's transaction;
// a route has none and gets a fresh client.
export async function pathsForPage(
  id: string | number,
  client?: Payload,
): Promise<Partial<Record<Locale, string>>> {
  const payload = client ?? (await getPayload({ config: await config }))
  const doc = await payload.findByID({ collection: 'pages', id, depth: 0, locale: 'all' })

  // `locale: 'all'` widens every localized field to a per-locale record, which the
  // generated single-locale types do not describe.
  const slugs = doc.slug as unknown as Partial<Record<Locale, string>>
  const paths: Partial<Record<Locale, string>> = {}

  for (const locale of i18n.locales) {
    const slug = slugs?.[locale]
    if (slug) paths[locale] = pathForPage({ slug, isHome: doc.isHome }, locale)
  }

  return paths
}
