import type { Locale } from '@/lib/i18n/i18n'

/** One value per locale. `fallback: false`, so every seeded field is written twice. */
export type LocalizedT<T> = Record<Locale, T>

export type SpecRowT = { name: string; value: string }
