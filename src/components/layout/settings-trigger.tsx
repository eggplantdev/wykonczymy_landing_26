import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'
import '@/lib/fontawesome'

type PropsT = {
  label: string
  isOpen: boolean
  isMobileMenu: boolean
  // `Popover.Trigger asChild` merges the open/close handlers, `aria-expanded` and the
  // `aria-controls` pointing at its own generated id onto whatever it wraps.
} & Omit<ComponentProps<'button'>, 'className'>

// Bare in both places: the gear sits inside the nav group in the bar and inside the sheet on
// a phone, and both already carry the card and the lift. A second one would draw a pill
// around a control that is part of the shape it sits in.
export function SettingsTrigger({ label, isOpen, isMobileMenu, ...triggerProps }: PropsT) {
  return (
    <button
      type="button"
      aria-label={label}
      {...triggerProps}
      className={cn(
        'text-foreground hover:text-muted-foreground inline-flex items-center justify-center rounded-md duration-200',
        // Matched to the nav item beside it — 24px in the bar's 4px padding, and the panel's
        // 48px touch row on a phone.
        isMobileMenu ? 'size-12' : 'size-6',
      )}
    >
      <FontAwesomeIcon
        icon={faGear}
        // The gear turning is the only thing left saying the trigger is open — a gear has no
        // direction to point, so the chevron's flip has nothing to translate into.
        className={cn('duration-300', isMobileMenu ? 'size-6' : 'size-4', isOpen && 'rotate-90')}
      />
    </button>
  )
}
