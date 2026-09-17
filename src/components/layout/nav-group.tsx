import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type PropsT = {
  children: ReactNode
  className?: string
  id?: string
}

// fest's NavGroupWrapper, retokenised: gathers a run of nav items so they read as one
// control rather than loose links over the page.
export function NavGroup({ children, className, id }: PropsT) {
  return (
    <ul id={id} className={cn('flex gap-1 rounded-lg bg-white p-1', className)}>
      {children}
    </ul>
  )
}
