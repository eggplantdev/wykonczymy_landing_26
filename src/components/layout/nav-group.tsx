import type { ReactNode, Ref } from 'react'
import { cn } from '@/lib/cn'

type PropsT = {
  children: ReactNode
  className?: string
  ref?: Ref<HTMLUListElement>
}

// fest's NavGroupWrapper, retokenised: gathers a run of nav items so they read as one
// control rather than loose links over the page. Positioned because the moving pill is
// measured against this box — `offsetLeft` is relative to the nearest positioned ancestor,
// and without one it would resolve against the fixed header instead.
export function NavGroup({ children, className, ref }: PropsT) {
  return (
    <ul
      ref={ref}
      className={cn('relative flex gap-1 rounded-lg bg-card p-1 shadow-panel', className)}
    >
      {children}
    </ul>
  )
}
