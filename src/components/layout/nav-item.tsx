import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

// The links sit one flex container deeper than the language switcher and the phone CTA,
// so an even rhythm down the panel only holds while both containers space their children
// by the same amount.
export const mobileMenuGap = 'gap-4'

export type NavVariantT = 'bar' | 'mobile'

type StyleT = {
  variant?: NavVariantT
  className?: string
}

// Exported as classes rather than kept inside NavItem, because the language trigger wears
// the same panel appearance and cannot be a NavItem: `Popover.Trigger asChild` needs a
// <button>, and a <button> inside an <a> is invalid HTML.
export function navItemClasses({ variant = 'bar', className }: StyleT) {
  return cn(
    // Same hover as `buttonClasses`' light pill, down to the duration: a nav item and
    // a button are the same affordance, so they must not answer the cursor differently.
    'text-shwarz hover:bg-grau_100 hover:text-grau_900 inline-flex items-center px-4 duration-200',
    variant === 'bar' && 'text-14 min-h-8',
    // Every control in the mobile menu — links and the language trigger alike — reads at
    // the same touch size, and drops hover because on a touch screen it only ever lingers
    // as a highlight left behind after a tap.
    variant === 'mobile' &&
      'text-24 hover:text-shwarz min-h-12 w-full justify-center hover:bg-transparent',
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
            'rounded-md aria-[current=page]:underline aria-[current=page]:underline-offset-4',
            className,
          ),
        })}
      >
        {children}
      </Link>
    </li>
  )
}
