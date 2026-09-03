'use client'

import Link from 'next/link'

import { i18n, type Locale } from '@/lib/i18n/i18n'
import { useTranslation } from '@/lib/i18n/hooks/use-translation'

const labelKeys = { pl: 'languagePl', en: 'languageEn' } as const

// One document lives at two addresses, so the counterpart path can only be built
// from the document the page already resolved — hence a prop, not a path rewrite.
export function LanguageSwitcher({ paths }: { paths: Record<Locale, string> }) {
  const { t, locale } = useTranslation('common')

  return (
    <nav>
      {i18n.locales.map((candidate) => (
        <Link
          key={candidate}
          href={paths[candidate]}
          hrefLang={candidate}
          aria-current={candidate === locale ? 'true' : undefined}
        >
          {t(labelKeys[candidate])}
        </Link>
      ))}
    </nav>
  )
}
