'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { getTranslations, i18n } from '@/lib/i18n/i18n'
import { localeFromPath } from '@/lib/routing'

// Mirrors Next's own 404 layout — centred, 404 beside the message with a divider —
// because the only thing wrong with the default was that it is English-only.
//
// A 404 renders outside the catch-all, so there is no provider above it and no locale
// in params — the path prefix is the only signal available.
export default function NotFound() {
  const locale = localeFromPath(usePathname())
  const copy = getTranslations(locale).common

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex items-center gap-6">
        <h1 className="border-r border-current/30 pr-6 text-2xl font-medium">404</h1>
        <div className="space-y-1">
          <p className="text-sm">{copy.notFoundBody}</p>
          <Link
            className="text-sm underline"
            href={locale === i18n.defaultLocale ? '/' : '/en/home/'}
          >
            {copy.backToHome}
          </Link>
        </div>
      </div>
    </div>
  )
}
