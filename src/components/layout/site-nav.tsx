'use client'

import { motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { NavGroup } from '@/components/layout/nav-group'
import { NavItemPill } from '@/components/layout/nav-item-pill'
import { NavSeparator } from '@/components/layout/nav-separator'
import { useNavPill } from '@/components/layout/use-nav-pill'
import type { Page } from '@/payload-types'
import { useTranslation } from '@/lib/i18n/use-translation'
import { HOME_PAGE_TYPE } from '@/lib/routing'

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

const PILL_SPRING = { type: 'spring', stiffness: 400, damping: 30 } as const

type PropsT = {
  paths: Partial<Record<Page['pageType'], string>>
  variant?: 'header' | 'mobile-menu'
  onNavigate?: () => void
  // Rendered as the last item of the bar rather than beside it, so the settings gear reads
  // as part of the nav group instead of a second card floating next to it. The mobile menu
  // stacks its own controls as siblings, so it passes nothing and keeps the gear outside.
  trailing?: ReactNode
}

// The header gathers the links into a pill; in the mobile menu they stack full width,
// where that pill's chrome would only draw a box around the whole overlay.
export function SiteNav({ paths, variant = 'header', onNavigate, trailing }: PropsT) {
  const { t } = useTranslation('nav')
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const isMobileMenu = variant === 'mobile-menu'
  const { pill, enterFrom, attach } = useNavPill({ enabled: !isMobileMenu })

  // A project or an interior style has no nav entry of its own — it lives under its
  // section's address, so the bar marks the section it came from rather than going blank.
  // Every href `pathForPage` builds ends in a slash, which is what makes the prefix test
  // land on a segment boundary; `pathname` is normalised to match. Home is excluded
  // because in Polish its address is `/`, a prefix of every other one.
  const currentPath = pathname.endsWith('/') ? pathname : `${pathname}/`
  const isCurrent = (pageType: (typeof NAV_ORDER)[number], href: string) =>
    currentPath === href || (pageType !== HOME_PAGE_TYPE && currentPath.startsWith(href))

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
        ref={attach}
        // The links sit one flex container deeper than the settings gear and the phone CTA,
        // so the panel's rhythm only stays even while this gap matches the one the Sheet
        // spaces its own children by.
        className={
          isMobileMenu ? 'w-full flex-col gap-4 border-transparent bg-transparent p-0' : ''
        }
      >
        {pill && (
          // An <li> and not a <span>: a <ul> may only contain list items, and absolute
          // positioning keeps it out of the flex row it would otherwise join.
          <motion.li
            aria-hidden
            className="bg-surface absolute top-0 left-0 rounded-md"
            // On a fresh load there is nowhere to come from, so the pill simply appears
            // under the current item; after a navigation it slides from where the previous
            // copy of the bar left it.
            initial={enterFrom ?? false}
            animate={pill}
            transition={shouldReduceMotion ? { duration: 0 } : PILL_SPRING}
          />
        )}

        {links.map(({ pageType, href }) => (
          <NavItemPill
            key={pageType}
            href={href}
            variant={isMobileMenu ? 'mobile' : 'bar'}
            isActive={isCurrent(pageType, href)}
            hasPill={pill !== null}
            onClick={onNavigate}
          >
            {t(labelKeys[pageType])}
          </NavItemPill>
        ))}

        {!isMobileMenu && trailing && (
          <>
            <NavSeparator />
            <li className="flex">{trailing}</li>
          </>
        )}
      </NavGroup>
    </nav>
  )
}
