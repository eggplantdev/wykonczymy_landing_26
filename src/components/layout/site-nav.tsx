'use client'

import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

import { NavGroup } from '@/components/layout/nav-group'
import { NavItem } from '@/components/layout/nav-item'
import { NavSeparator } from '@/components/layout/nav-separator'
import type { Page } from '@/payload-types'
import { useTranslation } from '@/lib/i18n/use-translation'

// The order the bar reads in, which is editorial and not the order the collection
// happens to declare its options in. Home is absent because the logo already links it.
const NAV_ORDER = ['completed-works', 'interior-styles', 'price-list', 'contact'] as const

const labelKeys = {
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
  // would leave a hairline dangling at the end of the group.
  const links = NAV_ORDER.flatMap((pageType) => {
    const href = paths[pageType]
    return href ? [{ pageType, href }] : []
  })

  return (
    <nav>
      <NavGroup
        className={isMobileMenu ? 'w-full flex-col border-transparent bg-transparent p-0' : ''}
      >
        {links.map(({ pageType, href }, index) => (
          <Fragment key={pageType}>
            <NavItem
              href={href}
              // No hover state on a touch screen: it only ever fires as a sticky
              // highlight left behind after a tap.
              className={
                isMobileMenu
                  ? 'text-24 hover:text-shwarz min-h-12 w-full justify-center hover:bg-transparent'
                  : ''
              }
              aria-current={pathname === href ? 'page' : undefined}
              onClick={onNavigate}
            >
              {t(labelKeys[pageType])}
            </NavItem>
            {index < links.length - 1 && (
              <NavSeparator className={isMobileMenu ? 'mx-auto h-px w-2/3' : ''} />
            )}
          </Fragment>
        ))}
      </NavGroup>
    </nav>
  )
}
