import { useCallback } from 'react'
import { useI18nContext } from '../translations-provider'
import type { NamespaceT, TranslationKeyT } from '../types'

// Client components can't reach `params`, so the locale arrives through context
// instead. Server components skip this and call getTranslations(locale).
export function useTranslation<NS extends NamespaceT>(namespace: NS) {
  const { locale, translations } = useI18nContext()

  const t = useCallback(
    <K extends TranslationKeyT<NS>>(key: K, params?: Record<string, string | number>): string => {
      const value = translations[namespace][key]

      if (typeof value !== 'string') {
        console.warn(`Translation key "${String(key)}" missing in namespace "${String(namespace)}"`)
        return String(key)
      }

      if (!params) return value

      return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey: string) =>
        paramKey in params ? String(params[paramKey]) : `{{${paramKey}}}`,
      )
    },
    [translations, namespace],
  )

  return { t, locale }
}
