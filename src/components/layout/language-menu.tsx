import { NavGroup } from '@/components/layout/nav-group'
import { NavItem } from '@/components/layout/nav-item'
import { cn } from '@/lib/cn'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import { localeRoot } from '@/lib/routing'

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
      className={cn(
        'w-full flex-col rounded-t-none border-t-transparent p-1 pt-0',
        isMobileMenu && 'bg-grau_800',
      )}
    >
      {i18n.locales.map((candidate) => (
        <NavItem
          key={candidate}
          // Home is the fallback because `pathsForPage` omits a locale the page has no slug
          // for — the switcher still has somewhere to send you, in the language you asked for.
          href={paths[candidate] ?? localeRoot(candidate)}
          className={cn(
            'w-full justify-center',
            // The default marker for the current locale is the surface colour the list
            // itself wears here, so it needs one the grey does not swallow.
            isMobileMenu && 'aria-[current=page]:bg-white',
          )}
          hrefLang={candidate}
          aria-label={labelFor(candidate)}
          aria-current={candidate === locale ? 'page' : undefined}
          onClick={onSelect}
        >
          {candidate.toUpperCase()}
        </NavItem>
      ))}
    </NavGroup>
  )
}
