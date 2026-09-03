import type { Locale } from './i18n'
import type { TranslationsByLocaleT, TranslationsT } from './types'
import { i18n } from './i18n'
import pl from './locales/pl.json'
import en from './locales/en.json'

export const translations: TranslationsByLocaleT = { pl, en }

export function getTranslations(locale: Locale): TranslationsT {
  return translations[locale] ?? translations[i18n.defaultLocale]
}
