'use client'

import { usePathname } from 'next/navigation'

import { NavGroup } from '@/components/layout/nav-group'
import { NavItemPill } from '@/components/layout/nav-item-pill'
import type { Page } from '@/payload-types'
import { useTranslation } from '@/lib/i18n/use-translation'

// The order the bar reads in, which is editorial and not the order the collection
// happens to declare its options in.
const NAV_ORDER = ['home', 'completed-works', 'interior-styles', 'price-list', 'contact'] as const

const labelKeys = {
  home: 'home',
  'completed-works': 'completedWorks',
  'interior-styles': 'interiorStyles',
  'price-list': 'priceList',
  contact: 'contact',
} as const satisfies Record<(typeof NAV_ORDER)[number], string>

type PropsT = {
  paths: Partial<Record<Page['pageType'], string>>
  variant?: 'header' | 'mobile-menu'
  onNavigate?: () => void
}

// The header gathers the links into a pill; in the mobile menu they stack full width,
// where that pill's chrome would only draw a box around the whole overlay.
export function SiteNav({ paths, variant = 'header', onNavigate }: PropsT) {
  const { t } = useTranslation('nav')
  const pathname = usePathname()
  const isMobileMenu = variant === 'mobile-menu'

  // Resolved up front so the separators know which item is last: an unpublished page has
  // no address, so it is dropped rather than linked, and dropping it inside the render
  // would leave a hairline dangling at the end of the bar.
  const links = NAV_ORDER.flatMap((pageType) => {
    const href = paths[pageType]
    return href ? [{ pageType, href }] : []
  })

  return (
    <nav>
      <NavGroup
        // The links sit one flex container deeper than the language switcher and the
        // phone CTA, so the panel's rhythm only stays even while this gap matches the
        // one the Sheet spaces its own children by.
        className={
          isMobileMenu ? 'w-full flex-col gap-4 border-transparent bg-transparent p-0' : ''
        }
      >
        {links.map(({ pageType, href }) => (
          <NavItemPill
            key={pageType}
            href={href}
            variant={isMobileMenu ? 'mobile' : 'bar'}
            isActive={pathname === href}
            onClick={onNavigate}
          >
            {t(labelKeys[pageType])}
          </NavItemPill>
        ))}
      </NavGroup>
    </nav>
  )
}
