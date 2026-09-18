import Link from 'next/link'
import type { ReactNode } from 'react'

import { buttonClasses, buttonLabelClasses, type ButtonVariantT } from './button'

type PropsT = {
  href: string
  label?: string
  variant?: ButtonVariantT
  // Same two props `Button` takes: `icon` only retunes the padding, so the icon itself is
  // passed as a child and the caller decides which one and at what size.
  icon?: 'leading' | 'trailing'
  children?: ReactNode
  className?: string
}

export function ButtonLink({ href, label, variant = 'light', icon, children, className }: PropsT) {
  if (!label) return null

  const content = (
    <>
      <span className={buttonLabelClasses({ variant })}>{label}</span>
      {children}
    </>
  )
  const classes = buttonClasses({ variant, icon, className })

  // A bare fragment is not a navigation, and `next/link` treats it as one: the first click
  // writes the hash, and every click after it resolves to the route already showing and is
  // dropped, so the page never scrolls again. A plain anchor hands the fragment back to the
  // browser, which re-runs its own scroll-to-target on every click, `scroll-smooth` included.
  if (href.startsWith('#')) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
