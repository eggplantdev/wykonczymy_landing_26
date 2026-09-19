import type { Page } from '@/payload-types'
import { i18n } from '@/lib/i18n/i18n'
import { resolveSegments, type ResolvedSegmentsT } from '@/lib/routing'
import { findChildren, type PageChildT } from './children'
import { findPage } from './pages'

export type ResolvedRouteT = ResolvedSegmentsT & {
  page: Page | null
  child: PageChildT | null
  /** Nothing answers here — the caller owes a `notFound()`. */
  isMiss: boolean
}

// Every way an address can miss, decided in one place, because the answer is needed three
// times per request — the layout, `generateMetadata` and the page — and three copies of the
// conditions drift. They already had: the metadata carried a comment reminding itself to
// agree with the route about an unresolvable child.
//
// The layout is the consumer that matters. `loading.tsx` wraps the page segment in Suspense,
// so by the time the page runs the response has been committed with a 200 and `notFound()`
// can only change the body — every unknown URL was answering 200 with 404 copy, which is a
// soft 404 to a crawler and undermines the whole indexed-address map. A layout renders above
// that boundary, so a miss caught there still sets the status.
//
// No `cache()` of its own: the finders it calls are each cached on primitives already, so
// asking three times costs one query — whereas this takes an array, which is a fresh
// reference per caller and would memoize nothing.
export async function resolveRoute(segments?: string[]): Promise<ResolvedRouteT> {
  const resolved = resolveSegments(segments)
  const { locale, slug, childSlug } = resolved
  const miss = { ...resolved, page: null, child: null, isMiss: true }

  // `/en/` is a redirect to `/en/home/`; only the default locale has a root page.
  if (resolved.isMiss || (slug === null && locale !== i18n.defaultLocale)) return miss

  const page = await findPage(locale, slug)
  if (!page) return miss

  // Only the two listing types own a second segment; anywhere else it is not an address,
  // which `findChildren` reports by having none to offer.
  if (!childSlug) return { ...resolved, page, child: null, isMiss: false }

  const child = (await findChildren(page.pageType, locale)).find((item) => item.slug === childSlug)

  return { ...resolved, page, child: child ?? null, isMiss: !child }
}
