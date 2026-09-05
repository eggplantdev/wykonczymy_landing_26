import type { Locale } from '@/lib/i18n/i18n'
import { INTERIOR_STYLES_PAGE_TYPE, PROJECTS_PAGE_TYPE, type PageTypeT } from '@/lib/routing'
import { findInteriorStyles } from './interior-styles'
import { findProjects } from './projects'

/** What the route needs off a child to build and resolve its address. */
export type PageChildT = { slug: string; title: string }

// Which collection hangs off which page type. As a map rather than an `if` ladder
// because the route asked the same question three ways — prerender the children,
// resolve one for metadata, resolve one for render — and each ladder could drift.
const CHILD_SOURCES: Partial<Record<PageTypeT, (locale: Locale) => Promise<PageChildT[]>>> = {
  [PROJECTS_PAGE_TYPE]: findProjects,
  [INTERIOR_STYLES_PAGE_TYPE]: findInteriorStyles,
}

// The finders are cached, so asking twice in one render costs one query.
export const findChildren = (pageType: string, locale: Locale): Promise<PageChildT[]> =>
  CHILD_SOURCES[pageType as PageTypeT]?.(locale) ?? Promise.resolve([])
