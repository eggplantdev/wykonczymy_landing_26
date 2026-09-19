'use client'

import { useTheme } from 'next-themes'

import { SegmentedControl, segmentClasses } from '@/components/ui/segmented-control'
import { useTranslation } from '@/lib/i18n/use-translation'

const OPTIONS = [
  { value: 'system', labelKey: 'themeSystem' },
  { value: 'light', labelKey: 'themeLight' },
  { value: 'dark', labelKey: 'themeDark' },
] as const

// Safe to read `theme` without a mount gate ONLY because this never renders until the panel
// is open, and opening it takes a click. next-themes seeds its state from localStorage in a
// `useState` initialiser, which the server cannot run — so anything hoisted out of the
// popover and rendered on first paint would hydrate against the wrong value.
export function ThemeControl({ labelledBy }: { labelledBy: string }) {
  const { t } = useTranslation('common')
  const { theme, setTheme } = useTheme()

  return (
    // Toggles rather than radios: `radio` obliges the group to move focus with the arrow
    // keys and to hold a single tab stop, and claiming the role without that leaves a
    // keyboard user pressing arrows at something that ignores them.
    <SegmentedControl aria-labelledby={labelledBy}>
      {OPTIONS.map(({ value, labelKey }) => {
        const isActive = theme === value

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => setTheme(value)}
            className={segmentClasses(isActive)}
          >
            {t(labelKey)}
          </button>
        )
      })}
    </SegmentedControl>
  )
}
