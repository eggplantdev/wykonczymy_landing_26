import pl from './locales/pl.json'
import en from './locales/en.json'

export const i18n = {
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
} as const

export type Locale = (typeof i18n.locales)[number]

export function isLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value)
}

// pl is the source of truth: `typeof pl` gives key-level checking and forces
// en.json to match structurally.
export type TranslationsT = typeof pl

export type NamespaceT = keyof TranslationsT

export type TranslationKeyT<NS extends NamespaceT> = keyof TranslationsT[NS]

export const translations: Record<Locale, TranslationsT> = { pl, en }

export function getTranslations(locale: Locale): TranslationsT {
  return translations[locale]
}
