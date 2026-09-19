import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

// The active segment wears the nav bar's current-page fill, so "which one is on" reads the
// same way in the settings panel as it does in the bar above it.
export function segmentClasses(isActive: boolean) {
  return cn(
    'text-12 inline-flex min-h-7 flex-1 items-center justify-center rounded-md px-2 duration-200',
    isActive ? 'bg-surface text-surface-foreground' : 'text-muted-foreground hover:text-foreground',
  )
}

// `role="group"` is not optional decoration: a bare <div> has an implicit role that takes no
// accessible name, so a caller's `aria-labelledby` would be dropped and the group announced
// as nothing. Defaulting it here is what stops that being every caller's problem.
export function SegmentedControl({ children, className, ...groupProps }: ComponentProps<'div'>) {
  return (
    <div
      role="group"
      {...groupProps}
      className={cn('bg-muted flex gap-1 rounded-lg p-1', className)}
    >
      {children}
    </div>
  )
}
