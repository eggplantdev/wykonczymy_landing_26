import type pl from './locales/pl.json'
import type { Locale } from './i18n'

// pl is the source of truth: importing it as a type gives key-level checking and
// forces en.json to match structurally.
export type TranslationsT = typeof pl

export type NamespaceT = keyof TranslationsT

export type TranslationKeyT<NS extends NamespaceT> = keyof TranslationsT[NS]

export type TranslationsByLocaleT = Record<Locale, TranslationsT>
