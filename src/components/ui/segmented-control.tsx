import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

// The active segment wears the nav bar's current-page fill, so "which one is on" reads the
// same way in the settings panel as it does in the bar above it.
export function segmentClasses(isActive: boolean) {
  return cn(
    'text-12 inline-flex min-h-6 flex-1 items-center justify-center rounded-full px-2 duration-200',
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
      // Tray and segment are both fully round, as on the nav group and the pill inside it:
      // this is the same tray-holding-a-pill shape, and a softened rectangle beside a round
      // one is the three-radii problem that pass was closing.
      className={cn('flex gap-1 rounded-full bg-muted p-1', className)}
    >
      {children}
    </div>
  )
}
