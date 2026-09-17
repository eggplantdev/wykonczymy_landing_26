import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type PropsT = {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
} & Pick<ComponentProps<'a'>, 'aria-current' | 'aria-label' | 'hrefLang'>

export function NavItem({ href, children, className, ...linkProps }: PropsT) {
  return (
    <li>
      <Link
        href={href}
        {...linkProps}
        className={cn(
          // Same hover as `buttonClasses`' light pill, down to the duration: a nav item and
          // a button are the same affordance, so they must not answer the cursor differently.
          'text-14 text-shwarz hover:bg-grau_100 hover:text-grau_900 inline-flex min-h-8 items-center rounded-md px-4 duration-200 aria-[current=page]:underline aria-[current=page]:underline-offset-4',
          className,
        )}
      >
        {children}
      </Link>
    </li>
  )
}
