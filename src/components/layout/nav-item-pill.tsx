'use client'

import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { navItemClasses, type NavVariantT } from '@/components/layout/nav-item'
import { cn } from '@/lib/cn'

// Chaos Kitchen's nav pill (`src/components/sections/nav/nav-desktop.tsx`), carried over as
// a swap-in for NavItem: one pill exists at a time and Motion matches the outgoing and
// incoming copies by `layoutId`, so it travels between items instead of blinking across.
const PILL_LAYOUT_ID = 'nav-pill'

type PropsT = {
  href: string
  children: ReactNode
  isActive: boolean
  variant?: NavVariantT
  className?: string
  onClick?: () => void
} & Pick<ComponentProps<'a'>, 'aria-label' | 'hrefLang'>

export function NavItemPill({
  href,
  children,
  isActive,
  variant,
  className,
  ...linkProps
}: PropsT) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        {...linkProps}
        className={navItemClasses({
          variant,
          className: cn(
            'relative rounded-md',
            // The pill is opaque and covers the link, so only the label has to change
            // colour — and it must not fall back to the hover colour over the fill.
            isActive && 'text-white hover:text-white',
            className,
          ),
        })}
      >
        {isActive && (
          <motion.span
            aria-hidden
            layoutId={PILL_LAYOUT_ID}
            className="bg-blau absolute inset-0 rounded-md"
            transition={
              shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }
            }
          />
        )}
        {/* Above the pill, which is painted over the link's own box. */}
        <span className="relative z-10">{children}</span>
      </Link>
    </li>
  )
}
