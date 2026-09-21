import { useId, type ReactNode } from 'react'

import { CookieSettingsButton } from '@/components/cookies/cookie-settings-button'
import { LanguageControl } from '@/components/layout/language-control'
import { ThemeControl } from '@/components/theme/theme-control'
import { cn } from '@/lib/cn'
import type { Locale } from '@/lib/i18n/i18n'
import { useTranslation } from '@/lib/i18n/use-translation'

type SectionPropsT = {
  label: string
  children: (labelledBy: string) => ReactNode
}

// The heading is the group's accessible name rather than a repeat of it: giving the control
// an `aria-label` as well would have a screen reader announce the word, then read the
// visible heading and announce it again.
function SettingsSection({ label, children }: SectionPropsT) {
  const labelId = useId()

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className="px-1 text-14 tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      {children(labelId)}
    </div>
  )
}

type PropsT = {
  paths: Partial<Record<Locale, string>>
  onNavigate: () => void
  // The surface, from whoever is showing this. In the bar it is a popover and has to draw its
  // own card; in the mobile sheet it is just part of the sheet, which already is one.
  className?: string
}

export function SettingsPanel({ paths, onNavigate, className }: PropsT) {
  const { t } = useTranslation('common')

  return (
    <div className={cn('flex w-48 flex-col gap-3', className)}>
      <SettingsSection label={t('language')}>
        {(labelledBy) => (
          <LanguageControl paths={paths} labelledBy={labelledBy} onSelect={onNavigate} />
        )}
      </SettingsSection>

      <SettingsSection label={t('theme')}>
        {(labelledBy) => <ThemeControl labelledBy={labelledBy} />}
      </SettingsSection>

      <CookieSettingsButton className="-mb-1 border-t border-border-muted px-1 pt-3 text-left text-14 text-muted-foreground transition-colors hover:text-foreground" />
    </div>
  )
}
