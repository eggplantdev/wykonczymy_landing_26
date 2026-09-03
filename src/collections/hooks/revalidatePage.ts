import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'
import { revalidatePath } from 'next/cache'

import type { Page } from '@/payload-types'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import { pathForPage } from '@/lib/routing'

// A document is edited in one locale but answers to an address in each, so a
// revalidation scoped to the edited locale leaves the other one stale.
async function pathsFor(payload: Payload, id: string | number): Promise<string[]> {
  const doc = await payload.findByID({ collection: 'pages', id, depth: 0, locale: 'all' })
  const slugs = doc.slug as unknown as Partial<Record<Locale, string>>

  return i18n.locales
    .filter((locale) => slugs[locale])
    .map((locale) => pathForPage({ slug: slugs[locale]!, isHome: doc.isHome }, locale))
}

// Payload runs these in the Next server process, so revalidatePath can be called
// in-process — no webhook, no shared secret.
export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status !== 'published' && previousDoc?._status !== 'published') return doc

  const paths = new Set(await pathsFor(payload, doc.id))

  // A renamed slug orphans the address it used to serve; drop that one too.
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    for (const locale of i18n.locales) {
      paths.add(pathForPage({ slug: previousDoc.slug, isHome: previousDoc.isHome }, locale))
    }
  }

  for (const path of paths) revalidatePath(path)

  return doc
}

export const revalidatePageDelete: CollectionAfterDeleteHook<Page> = ({ doc }) => {
  if (!doc?.slug) return doc

  for (const locale of i18n.locales) {
    revalidatePath(pathForPage({ slug: doc.slug, isHome: doc.isHome }, locale))
  }

  return doc
}
