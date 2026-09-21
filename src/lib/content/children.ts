import type { Locale } from '@/lib/i18n/i18n'
import { INTERIOR_STYLES_PAGE_TYPE, PROJECTS_PAGE_TYPE, type PageTypeT } from '@/lib/routing'
import { findInteriorStyles, type InteriorStyleT } from './interior-styles'
import { findProjects, type ProjectT } from './projects'

// The child carries its own page type because that is the only thing that tells a project
// from an interior style once the route has resolved one: the caller holds the child and
// the page as two separate values, and narrowing the first by the second's `pageType` is
// not something TypeScript can do. Without the tag the route shell had to throw the
// resolved child away and find it again by slug in the collection it knew it wanted.
export type PageChildT =
  | ({ pageType: typeof PROJECTS_PAGE_TYPE } & ProjectT)
  | ({ pageType: typeof INTERIOR_STYLES_PAGE_TYPE } & InteriorStyleT)

// Which collection hangs off which page type. As a map rather than an `if` ladder
// because the route asked the same question three ways — prerender the children,
// resolve one for metadata, resolve one for render — and each ladder could drift.
const CHILD_SOURCES: Partial<Record<PageTypeT, (locale: Locale) => Promise<PageChildT[]>>> = {
  [PROJECTS_PAGE_TYPE]: async (locale) =>
    (await findProjects(locale)).map((project) => ({ ...project, pageType: PROJECTS_PAGE_TYPE })),
  [INTERIOR_STYLES_PAGE_TYPE]: async (locale) =>
    (await findInteriorStyles(locale)).map((style) => ({
      ...style,
      pageType: INTERIOR_STYLES_PAGE_TYPE,
    })),
}

// The finders are cached, so asking twice in one render costs one query.
export const findChildren = (pageType: string, locale: Locale): Promise<PageChildT[]> =>
  CHILD_SOURCES[pageType as PageTypeT]?.(locale) ?? Promise.resolve([])
