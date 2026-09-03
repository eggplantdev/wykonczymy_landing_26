'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { i18n } from '@/lib/i18n/i18n'
import { getTranslations } from '@/lib/i18n/translations'
import { localeFromPath } from '@/lib/routing'

// A 404 renders outside the catch-all, so there is no provider above it and no
// locale in params — the path prefix is the only signal available.
export default function NotFound() {
  const locale = localeFromPath(usePathname())
  const t = getTranslations(locale).common

  return (
    <article>
      <h1>{t.notFoundTitle}</h1>
      <p>{t.notFoundBody}</p>
      <Link href={locale === i18n.defaultLocale ? '/' : '/en/home/'}>{t.backToHome}</Link>
    </article>
  )
}
