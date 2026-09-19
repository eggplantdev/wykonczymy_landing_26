import type { ReactNode, Ref } from 'react'
import { cn } from '@/lib/cn'

type PropsT = {
  children: ReactNode
  className?: string
  ref?: Ref<HTMLUListElement>
}

// Positioned because the moving pill is measured against this box — `offsetLeft` is relative
// to the nearest positioned ancestor, and without one it would resolve against the fixed header
// instead. See `use-nav-pill.ts`.
export function NavGroup({ children, className, ref }: PropsT) {
  return (
    <ul
      ref={ref}
      className={cn('relative flex gap-1 rounded-lg bg-card p-1 lg:shadow-panel-sm', className)}
    >
      {children}
    </ul>
  )
}
