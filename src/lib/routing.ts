import { i18n, isLocale, type Locale } from '@/lib/i18n/i18n'

type PageAddressT = Pick<import('@/payload-types').Page, 'slug'> & {
  isHome?: boolean | null
}

// The single source of URL shape. generateStaticParams, the language switcher, the
// revalidation hook and — later — the sitemap and canonical tags all resolve through
// here, so there is one place to be wrong. Every address ends in a slash and only the
// non-default locale carries a prefix; see context/foundation/url-map.md.
export function pathForPage(page: PageAddressT, locale: Locale): string {
  if (page.isHome && locale === i18n.defaultLocale) return '/'

  const prefix = locale === i18n.defaultLocale ? '' : `/${locale}`
  return `${prefix}/${page.slug}/`
}

export function segmentsForPage(page: PageAddressT, locale: Locale): string[] {
  return pathForPage(page, locale).split('/').filter(Boolean)
}

// `slug: null` means the request is for the locale root. Only Polish has one — `/en/`
// is a redirect to `/en/home/`, not a page (next.config.ts).
export function resolveSegments(segments?: string[]): { locale: Locale; slug: string | null } {
  const parts = segments ?? []
  const [first, ...rest] = parts

  if (first && isLocale(first) && first !== i18n.defaultLocale) {
    return { locale: first, slug: rest[0] ?? null }
  }

  return { locale: i18n.defaultLocale, slug: parts[0] ?? null }
}

export function localeFromPath(pathname: string): Locale {
  const [first] = pathname.split('/').filter(Boolean)
  return first && isLocale(first) && first !== i18n.defaultLocale ? first : i18n.defaultLocale
}
