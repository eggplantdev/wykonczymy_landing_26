import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type PropsT = {
  children: ReactNode
  // A hero fills the viewport and sits under the fixed header by design; without one the
  // page has to start below it.
  hasHero?: boolean
  className?: string
}

export function PageWrapper({ children, hasHero = true, className }: PropsT) {
  return (
    <div
      className={cn('w-full overflow-x-hidden', className, !hasHero && 'pt-20 md:pt-30 lg:pt-40')}
    >
      {children}
    </div>
  )
}
