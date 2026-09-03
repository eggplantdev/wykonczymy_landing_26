export const i18n = {
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
} as const

export type Locale = (typeof i18n.locales)[number]

export function isLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value)
}
