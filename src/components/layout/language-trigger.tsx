import { twMerge } from 'tailwind-merge'

import { ChevronDown } from '@/components/ui/icons/chevron-down'
import type { Locale } from '@/lib/i18n/i18n'

type PropsT = {
  locale: Locale
  label: string
  isOpen: boolean
  onClick: () => void
  menuId: string
  isMobileMenu: boolean
}

export function LanguageTrigger({ locale, label, isOpen, onClick, menuId, isMobileMenu }: PropsT) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={menuId}
      aria-label={label}
      onClick={onClick}
      className={twMerge(
        'text-14 text-shwarz inline-flex items-center justify-center gap-2',
        isMobileMenu
          ? 'bg-shwarz text-24 min-h-12 rounded-2xl border-transparent px-6 text-white'
          : 'min-h-10 rounded-lg bg-white px-4',
        // Open, the trigger drops the edge it shares with the list so the two read as
        // one continuous shape rather than a pill with a box parked underneath.
        isOpen && 'rounded-b-none border-b-transparent',
      )}
    >
      {locale.toUpperCase()}
      <span
        aria-hidden="true"
        className={twMerge('inline-flex size-4 duration-300', isOpen && 'rotate-180')}
      >
        <ChevronDown />
      </span>
    </button>
  )
}
