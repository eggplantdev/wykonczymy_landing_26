'use client'

import { usePathname } from 'next/navigation'

import { NavGroup } from '@/components/layout/nav-group'
import { NavItem } from '@/components/layout/nav-item'
import { navGroupClass, navItemClass, type NavVariantT } from '@/components/layout/nav-variants'
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
  variant?: NavVariantT
  onNavigate?: () => void
}

export function SiteNav({ paths, variant = 'bar', onNavigate }: PropsT) {
  const { t } = useTranslation('nav')
  const pathname = usePathname()

  return (
    <nav>
      <NavGroup className={navGroupClass[variant]}>
        {NAV_ORDER.map((pageType) => {
          const href = paths[pageType]
          // An unpublished page has no address, so it is left out rather than linked.
          if (!href) return null

          return (
            <NavItem
              key={pageType}
              href={href}
              className={navItemClass[variant]}
              aria-current={pathname === href ? 'page' : undefined}
              onClick={onNavigate}
            >
              {t(labelKeys[pageType])}
            </NavItem>
          )
        })}
      </NavGroup>
    </nav>
  )
}
