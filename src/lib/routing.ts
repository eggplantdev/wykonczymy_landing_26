import { i18n, isLocale, type Locale } from '@/lib/i18n/i18n'

type PageAddressT = { slug?: string | null; pageType?: string | null }

// The five pages of the live site. A page's type selects which conditional field group
// the admin sees, and it is how content links to a page: PL and EN slugs differ, so an
// href written into a field would be right in at most one locale.
export const pageTypes = [
  'home',
  'completed-works',
  'interior-styles',
  'contact',
  'price-list',
] as const

export type PageTypeT = (typeof pageTypes)[number]

// There is exactly one page per type, so the type already says which document owns
// the root — a separate flag could only ever disagree with it.
export const HOME_PAGE_TYPE = 'home'

export const CONTACT_PAGE_TYPE = 'contact'

// The two page types with children. A second segment under anything else is not an
// address — see resolveSegments.
export const PROJECTS_PAGE_TYPE = 'completed-works'
export const INTERIOR_STYLES_PAGE_TYPE = 'interior-styles'

export type ResolvedSegmentsT = {
  locale: Locale
  slug: string | null
  /** Second segment, e.g. the style in `/wykonczenia/boho/`. */
  childSlug: string | null
  /** A path that is not an address at all — too many segments to be a page. */
  isMiss: boolean
}

// The single source of URL shape: every address ends in a slash and only the
// non-default locale carries a prefix. See context/foundation/url-map.md.
export function pathForPage(page: PageAddressT, locale: Locale, childSlug?: string): string {
  if (page.pageType === HOME_PAGE_TYPE && locale === i18n.defaultLocale) return '/'

  const prefix = locale === i18n.defaultLocale ? '' : `/${locale}`
  const child = childSlug ? `${childSlug}/` : ''
  return `${prefix}/${page.slug}/${child}`
}

// A child hangs off its parent's address. The trailing-slash rule all twelve indexed
// addresses depend on lives here, in one place, rather than at every call site.
export function childPath(basePath: string, slug: string): string {
  return `${basePath}${slug}/`
}

// The address a locale switch lands on when there is no counterpart page. Only Polish
// has a bare root; `/en/` is a redirect, so English resolves through the home page.
export function localeRoot(locale: Locale, homeSlug = HOME_PAGE_TYPE): string {
  return locale === i18n.defaultLocale ? '/' : `/${locale}/${homeSlug}/`
}

export function segmentsForPage(page: PageAddressT, locale: Locale, childSlug?: string): string[] {
  return pathForPage(page, locale, childSlug).split('/').filter(Boolean)
}

// `slug: null` means the locale root. Only Polish has one — `/en/` is a redirect to
// `/en/home/`, not a page (next.config.ts).
//
// A path deeper than <locale?>/<slug>/<child> is a miss, never a page: without this the
// site answers 200 at an unbounded family of addresses (`/oferta/anything/at/all/`),
// which is duplicate content against a twelve-address guardrail. The second segment is
// parsed, not authorised — only a page type that has children accepts one, which the
// route decides.
export function resolveSegments(segments?: string[]): ResolvedSegmentsT {
  const parts = segments ?? []
  const [first] = parts
  const hasPrefix = first !== undefined && isLocale(first) && first !== i18n.defaultLocale
  const rest = hasPrefix ? parts.slice(1) : parts

  return {
    locale: hasPrefix ? first : i18n.defaultLocale,
    slug: rest[0] ?? null,
    childSlug: rest[1] ?? null,
    isMiss: rest.length > 2,
  }
}

export function localeFromPath(pathname: string): Locale {
  return resolveSegments(pathname.split('/').filter(Boolean)).locale
}
