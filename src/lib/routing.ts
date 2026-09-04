import { i18n, isLocale, type Locale } from '@/lib/i18n/i18n'

type PageAddressT = { slug?: string | null; pageType?: string | null }

// There is exactly one page per type, so the type already says which document owns
// the root — a separate flag could only ever disagree with it.
export const HOME_PAGE_TYPE = 'home'

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
  const [first, ...rest] = parts

  if (first !== undefined && isLocale(first) && first !== i18n.defaultLocale) {
    return {
      locale: first,
      slug: rest[0] ?? null,
      childSlug: rest[1] ?? null,
      isMiss: rest.length > 2,
    }
  }

  return {
    locale: i18n.defaultLocale,
    slug: parts[0] ?? null,
    childSlug: parts[1] ?? null,
    isMiss: parts.length > 2,
  }
}

export function localeFromPath(pathname: string): Locale {
  return resolveSegments(pathname.split('/').filter(Boolean)).locale
}
