import type { Locale } from '@/lib/i18n/i18n'

/** `fallback: false`, so every seeded field is written twice. */
export type LocalizedT<T> = Record<Locale, T>
