import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

import { NavGroup } from '@/components/layout/nav-group'
import { NavItem } from '@/components/layout/nav-item'
import { NavSeparator } from '@/components/layout/nav-separator'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import { localeRoot } from '@/lib/routing'

// Home is the fallback because `pathsForPage` omits a locale the page has no slug
// for — the switcher still has somewhere to send you, in the language you asked for.

type PropsT = {
  paths: Partial<Record<Locale, string>>
  locale: Locale
  labelFor: (candidate: Locale) => string
  onSelect: () => void
  id: string
  isMobileMenu: boolean
}

export function LanguageMenu({ paths, locale, labelFor, onSelect, id, isMobileMenu }: PropsT) {
  return (
    <NavGroup
      id={id}
      className={twMerge(
        'w-full flex-col rounded-t-none border-t-transparent p-1 pt-0',
        isMobileMenu && 'bg-shwarz rounded-2xl rounded-t-none border-transparent shadow-xl',
      )}
    >
      {i18n.locales.map((candidate, index) => (
        <Fragment key={candidate}>
          <NavItem
            href={paths[candidate] ?? localeRoot(candidate)}
            className={twMerge(
              'w-full justify-center',
              isMobileMenu &&
                'text-24 min-h-12 rounded-xl text-white hover:bg-transparent hover:text-white',
            )}
            hrefLang={candidate}
            aria-label={labelFor(candidate)}
            aria-current={candidate === locale ? 'page' : undefined}
            onClick={onSelect}
          >
            {candidate.toUpperCase()}
          </NavItem>
          {index < i18n.locales.length - 1 && (
            <NavSeparator
              className={twMerge('mx-auto h-px w-2/3', isMobileMenu && 'bg-white/15')}
            />
          )}
        </Fragment>
      ))}
    </NavGroup>
  )
}
