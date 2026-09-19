import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type NavVariantT = 'bar' | 'mobile'

type StyleT = {
  variant?: NavVariantT
  className?: string
}

// Exported as classes rather than kept inside NavItem, because NavItemPill wears the same
// appearance but cannot be a NavItem: it renders the sliding pill as a sibling of the link,
// which a NavItem's <li><Link> has nowhere to put.
export function navItemClasses({ variant = 'bar', className }: StyleT) {
  return cn(
    // A hover fill would compete with the selected item's pill, which is the one thing in
    // the bar allowed to carry a background.
    'text-shwarz hover:text-grau_100 inline-flex items-center px-4 duration-200',
    // Chaos Kitchen's bar: a 24px item inside the group's 4px padding, so the whole
    // control stands 32px tall.
    variant === 'bar' && 'text-14 min-h-6',
    // Every control in the mobile menu — links and the language trigger alike — reads at
    // the same touch size, and drops hover because on a touch screen it only ever lingers
    // as a highlight left behind after a tap.
    variant === 'mobile' && 'text-24 hover:text-shwarz min-h-12 w-full justify-center',
    className,
  )
}

type PropsT = {
  href: string
  children: ReactNode
  variant?: NavVariantT
  className?: string
  onClick?: () => void
} & Pick<ComponentProps<'a'>, 'aria-current' | 'aria-label' | 'hrefLang'>

export function NavItem({ href, children, variant, className, ...linkProps }: PropsT) {
  return (
    <li>
      <Link
        href={href}
        {...linkProps}
        className={navItemClasses({
          variant,
          className: cn(
            'rounded-md',
            // Both hover overrides are deliberate: without them the plain `hover:` rules
            // would strip the fill off the one item that has to keep it.
            variant !== 'mobile' &&
              'aria-[current=page]:bg-shwarz aria-[current=page]:text-white aria-[current=page]:hover:bg-shwarz aria-[current=page]:hover:text-white',
            // A fill across a full-width row in the mobile menu reads as a block, not a
            // marker, so the panel keeps the underline it always had.
            variant === 'mobile' &&
              'aria-[current=page]:underline aria-[current=page]:underline-offset-4',
            className,
          ),
        })}
      >
        {children}
      </Link>
    </li>
  )
}
