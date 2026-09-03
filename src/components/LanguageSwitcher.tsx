'use client'

import Link from 'next/link'

import { i18n, type Locale } from '@/lib/i18n/i18n'
import { useTranslation } from '@/lib/i18n/use-translation'

const labelKeys = { pl: 'languagePl', en: 'languageEn' } as const

// Hrefs arrive as a prop because only the resolved document knows its counterpart
// slug (see pathsForPage). A locale the page has no slug for is omitted, not linked.
export function LanguageSwitcher({ paths }: { paths: Partial<Record<Locale, string>> }) {
  const { t, locale } = useTranslation('common')

  return (
    <nav>
      {i18n.locales.map((candidate) => {
        const href = paths[candidate]
        if (!href) return null

        return (
          <Link
            key={candidate}
            href={href}
            hrefLang={candidate}
            aria-current={candidate === locale ? 'page' : undefined}
          >
            {t(labelKeys[candidate])}
          </Link>
        )
      })}
    </nav>
  )
}
