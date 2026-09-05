import Link from 'next/link'

import { buttonClasses, buttonLabelClasses, type ButtonVariantT } from './button'

type PropsT = {
  href: string
  label?: string
  variant?: ButtonVariantT
  className?: string
}

export function ButtonLink({ href, label, variant = 'light', className }: PropsT) {
  if (!label) return null

  return (
    <Link href={href} className={buttonClasses({ variant, className })}>
      <span className={buttonLabelClasses({ variant })}>{label}</span>
    </Link>
  )
}
