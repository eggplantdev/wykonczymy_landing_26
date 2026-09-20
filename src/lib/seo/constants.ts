import type { Locale } from '@/lib/i18n/i18n'

// The title template, `og:site_name` and the Organization JSON-LD all name the business, and
// three copies of a brand string drift. Not a CMS field: the template that uses it is a static
// `metadata` export, which cannot await a query.
export const SITE_NAME = 'Wykończymy'

// Open Graph wants a full language_TERRITORY tag, not the bare code the routes use. `en_GB`
// rather than `en_US`: the English copy addresses clients in Europe.
export const OG_LOCALES: Record<Locale, string> = { pl: 'pl_PL', en: 'en_GB' }
