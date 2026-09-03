'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { localeFromPath } from '@/lib/routing'

const copy = {
  pl: { title: 'Nie znaleziono strony', home: 'Strona główna' },
  en: { title: 'Page not found', home: 'Home' },
}

export default function NotFound() {
  const locale = localeFromPath(usePathname())
  const { title, home } = copy[locale]

  return (
    <article>
      <h1>{title}</h1>
      <Link href={locale === 'pl' ? '/' : '/en/home/'}>{home}</Link>
    </article>
  )
}
