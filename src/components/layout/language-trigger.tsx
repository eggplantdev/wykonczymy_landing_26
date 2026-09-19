import type { ComponentProps } from 'react'

import { ChevronDown } from '@/components/ui/icons/chevron-down'
import { cn } from '@/lib/cn'
import type { Locale } from '@/lib/i18n/i18n'

type PropsT = {
  locale: Locale
  label: string
  isOpen: boolean
  isMobileMenu: boolean
  // `Popover.Trigger asChild` merges the open/close handlers, `aria-expanded` and the
  // `aria-controls` pointing at its own generated id onto whatever it wraps.
} & ComponentProps<'button'>

export function LanguageTrigger({ locale, label, isOpen, isMobileMenu, ...triggerProps }: PropsT) {
  return (
    <button
      type="button"
      aria-label={label}
      {...triggerProps}
      className={cn(
        'text-14 text-shwarz hover:text-grau_100 inline-flex min-h-8 items-center justify-center gap-2 rounded-lg bg-white px-4 shadow-lg duration-200',
        // The lift is the bar's: it separates a floating control from the page under it.
        // Inside the panel there is nothing to float over.
        isMobileMenu && 'shadow-none',
        // Open, the trigger drops the edge it shares with the list so the two read as
        // one continuous shape rather than a pill with a box parked underneath.
        isOpen && 'rounded-b-none border-b-transparent',
      )}
    >
      {locale.toUpperCase()}
      <span
        aria-hidden="true"
        className={cn('inline-flex size-4 duration-300', isOpen && 'rotate-180')}
      >
        <ChevronDown />
      </span>
    </button>
  )
}
