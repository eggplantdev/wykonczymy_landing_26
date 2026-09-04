import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

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
        className={twMerge(
          'text-14 text-shwarz hover:bg-shwarz aria-[current=page]:bg-grau_800 inline-flex min-h-8 items-center rounded-md px-4 duration-300 hover:text-white',
          className,
        )}
      >
        {children}
      </Link>
    </li>
  )
}
