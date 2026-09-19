import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type NavVariantT = 'bar' | 'mobile'

type PropsT = {
  href: string
  children: ReactNode
  isActive: boolean
  // Whether the bar is drawing its own sliding pill behind this item. When it is not —
  // before the first measurement, or with JS off — the item paints its own fill, so the
  // inverted label always has the surface underneath it that it is legible against.
  hasPill: boolean
  variant: NavVariantT
  onClick?: () => void
}

export function NavItemPill({ href, children, isActive, hasPill, variant, onClick }: PropsT) {
  const isBar = variant !== 'mobile'

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        onClick={onClick}
        className={cn(
          // A hover fill would compete with the selected item's pill, which is the one thing
          // in the bar allowed to carry a background.
          'text-foreground hover:text-muted-foreground inline-flex items-center px-4 duration-200',
          // Chaos Kitchen's bar: a 24px item inside the group's 4px padding, so the whole
          // control stands 32px tall.
          isBar && 'text-14 min-h-6',
          // Every control in the mobile menu — links and the settings gear alike — reads at
          // the same touch size, and drops hover because on a touch screen it only ever
          // lingers as a highlight left behind after a tap.
          !isBar && 'text-24 hover:text-foreground min-h-12 w-full justify-center',
          // Positioned so it paints over the pill, which is a preceding sibling inside the
          // same stacking context.
          'relative rounded-full',
          isActive &&
            isBar &&
            (hasPill
              ? 'text-surface-foreground hover:text-surface-foreground'
              : 'bg-surface text-surface-foreground hover:bg-surface hover:text-surface-foreground'),
          // A fill across a full-width row in the mobile menu reads as a block, not a
          // marker, so the panel keeps the underline it always had.
          isActive && !isBar && 'underline underline-offset-4',
        )}
      >
        {children}
      </Link>
    </li>
  )
}
