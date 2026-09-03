'use client'

import { createContext, useContext, useMemo } from 'react'
import { getTranslations, type Locale, type TranslationsT } from './i18n'

type I18nContextT = {
  locale: Locale
  translations: TranslationsT
}

const I18nContext = createContext<I18nContextT | null>(null)

export function TranslationsProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const value = useMemo(() => ({ locale, translations: getTranslations(locale) }), [locale])

  return <I18nContext value={value}>{children}</I18nContext>
}

export function useI18nContext() {
  const context = useContext(I18nContext)

  if (!context) throw new Error('useI18nContext must be used within a TranslationsProvider')

  return context
}
