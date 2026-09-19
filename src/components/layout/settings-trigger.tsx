import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'
import '@/lib/fontawesome'

type PropsT = {
  label: string
  isOpen: boolean
  // `Popover.Trigger asChild` merges the open/close handlers, `aria-expanded` and the
  // `aria-controls` pointing at its own generated id onto whatever it wraps.
} & Omit<ComponentProps<'button'>, 'className'>

// Bare: the gear sits inside the nav group, which already carries the card and the lift. A
// second one would draw a pill around a control that is part of the shape it sits in.
export function SettingsTrigger({ label, isOpen, ...triggerProps }: PropsT) {
  return (
    <button
      type="button"
      aria-label={label}
      {...triggerProps}
      // 24px, matched to the nav item beside it inside the bar's 4px padding.
      className="text-foreground hover:text-muted-foreground inline-flex size-6 items-center justify-center rounded-full duration-200"
    >
      <FontAwesomeIcon
        icon={faGear}
        // The gear turning is the only thing left saying the trigger is open — a gear has no
        // direction to point, so the chevron's flip has nothing to translate into.
        className={cn('size-4 duration-300', isOpen && 'rotate-90')}
      />
    </button>
  )
}
