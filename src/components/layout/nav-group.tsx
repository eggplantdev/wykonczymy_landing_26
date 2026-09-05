import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type PropsT = {
  children: ReactNode
  className?: string
  id?: string
}

// fest's NavGroupWrapper, retokenised: gathers a run of nav items so they read as one
// control rather than loose links over the page.
export function NavGroup({ children, className, id }: PropsT) {
  return (
    <ul id={id} className={twMerge('flex gap-1 rounded-lg bg-white p-1', className)}>
      {children}
    </ul>
  )
}
