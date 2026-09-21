'use client'

import { createContext, useContext, useEffect } from 'react'
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
  // `<html>` is rendered by the root layout, which sits above every dynamic segment and so
  // hardcodes the default locale. This is the first place the locale is known, and the
  // attribute lives outside React's tree, so an effect is the only way to reach it. It runs
  // after hydration, which is soon enough for assistive tech — it reads the live tree — but
  // not for a crawler, which only ever sees the served `pl`. Closing that needs the locale in
  // a real route segment; see url-map.md.
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <I18nContext value={{ locale, translations: getTranslations(locale) }}>{children}</I18nContext>
  )
}

export function useI18nContext() {
  const context = useContext(I18nContext)

  if (!context) throw new Error('useI18nContext must be used within a TranslationsProvider')

  return context
}
