import type { Locale } from '@/lib/i18n/i18n'

// The replatform is deployed but not the published site — wykonczymy.com.pl is still WordPress,
// and this host must not compete with it in the index. Two switches enforce that: `robots.txt`
// asks a crawler not to fetch, and the root layout's `robots` metadata tells one that fetched
// anyway not to index. They must flip together — a half-flip is silent and both halves are bad —
// so they read one flag rather than two comments pointing at each other.
export const SEARCH_INDEXING_ENABLED = false

// Not a CMS field: the template that uses it is a static `metadata` export, which cannot
// await a query.
export const SITE_NAME = 'Wykończymy'

// Open Graph wants a full language_TERRITORY tag, not the bare code the routes use. `en_GB`
// rather than `en_US`: the English copy addresses clients in Europe.
export const OG_LOCALES: Record<Locale, string> = { pl: 'pl_PL', en: 'en_GB' }
