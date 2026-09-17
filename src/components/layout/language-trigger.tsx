import { ChevronDown } from '@/components/ui/icons/chevron-down'
import { cn } from '@/lib/cn'
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
      className={cn(
        'text-14 text-shwarz hover:bg-grau_100 hover:text-grau_900 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 duration-200',
        isMobileMenu && 'bg-grau_800',
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
