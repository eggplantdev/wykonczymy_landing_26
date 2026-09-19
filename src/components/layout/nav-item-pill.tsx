import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { navItemClasses, type NavVariantT } from '@/components/layout/nav-item'
import { cn } from '@/lib/cn'

type PropsT = {
  href: string
  children: ReactNode
  isActive: boolean
  // Whether the bar is drawing its own sliding pill behind this item. When it is not —
  // before the first measurement, or with JS off — the item paints its own fill, so the
  // white label always has something dark underneath it.
  hasPill?: boolean
  variant?: NavVariantT
  className?: string
  onClick?: () => void
} & Pick<ComponentProps<'a'>, 'aria-label' | 'hrefLang'>

export function NavItemPill({
  href,
  children,
  isActive,
  hasPill = false,
  variant,
  className,
  ...linkProps
}: PropsT) {
  const isBar = variant !== 'mobile'

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        {...linkProps}
        className={navItemClasses({
          variant,
          // Positioned so it paints over the pill, which is a preceding sibling inside the
          // same stacking context.
          className: cn(
            'relative rounded-md',
            isActive &&
              isBar &&
              (hasPill
                ? 'text-white hover:text-white'
                : 'bg-shwarz text-white hover:bg-shwarz hover:text-white'),
            // A fill across a full-width row in the mobile menu reads as a block, not a
            // marker, so the panel keeps the underline it always had.
            isActive && !isBar && 'underline underline-offset-4',
            className,
          ),
        })}
      >
        {children}
      </Link>
    </li>
  )
}
