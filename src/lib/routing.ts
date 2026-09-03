import { i18n, isLocale, type Locale } from '@/lib/i18n/i18n'

type PageAddressT = { slug?: string | null; isHome?: boolean | null }

export type ResolvedSegmentsT = {
  locale: Locale
  slug: string | null
  /** A path that is not an address at all — too many segments to be a page. */
  isMiss: boolean
}

// The single source of URL shape: every address ends in a slash and only the
// non-default locale carries a prefix. See context/foundation/url-map.md.
export function pathForPage(page: PageAddressT, locale: Locale): string {
  if (page.isHome && locale === i18n.defaultLocale) return '/'

  const prefix = locale === i18n.defaultLocale ? '' : `/${locale}`
  return `${prefix}/${page.slug}/`
}

export function segmentsForPage(page: PageAddressT, locale: Locale): string[] {
  return pathForPage(page, locale).split('/').filter(Boolean)
}

// `slug: null` means the locale root. Only Polish has one — `/en/` is a redirect to
// `/en/home/`, not a page (next.config.ts).
//
// A path deeper than <locale?>/<slug> is a miss, never a page: without this the site
// answers 200 at an unbounded family of addresses (`/oferta/anything/at/all/`), which
// is duplicate content against a twelve-address guardrail.
export function resolveSegments(segments?: string[]): ResolvedSegmentsT {
  const parts = segments ?? []
  const [first, ...rest] = parts

  if (first !== undefined && isLocale(first) && first !== i18n.defaultLocale) {
    return { locale: first, slug: rest[0] ?? null, isMiss: rest.length > 1 }
  }

  return { locale: i18n.defaultLocale, slug: parts[0] ?? null, isMiss: parts.length > 1 }
}

export function localeFromPath(pathname: string): Locale {
  return resolveSegments(pathname.split('/').filter(Boolean)).locale
}
