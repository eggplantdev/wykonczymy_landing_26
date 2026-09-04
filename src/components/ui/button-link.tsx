import Link from 'next/link'

import { Button, type ButtonVariantT } from './button'

type PropsT = {
  href: string
  label?: string
  variant?: ButtonVariantT
  className?: string
}

export function ButtonLink({ href, label, variant = 'light', className }: PropsT) {
  if (!label) return null

  return (
    <Link href={href}>
      <Button label={label} variant={variant} className={className} />
    </Link>
  )
}
