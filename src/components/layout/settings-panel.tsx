import { useId, type ReactNode } from 'react'

import { CookieSettingsButton } from '@/components/cookies/cookie-settings-button'
import { LanguageControl } from '@/components/layout/language-control'
import { ThemeControl } from '@/components/theme/theme-control'
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
      <span id={labelId} className="text-10 text-muted-foreground px-1 tracking-wide uppercase">
        {label}
      </span>
      {children(labelId)}
    </div>
  )
}

type PropsT = {
  paths: Partial<Record<Locale, string>>
  onNavigate: () => void
}

export function SettingsPanel({ paths, onNavigate }: PropsT) {
  const { t } = useTranslation('common')

  return (
    <div className="bg-card shadow-panel flex w-48 flex-col gap-3 rounded-lg p-3">
      <SettingsSection label={t('language')}>
        {(labelledBy) => (
          <LanguageControl paths={paths} labelledBy={labelledBy} onSelect={onNavigate} />
        )}
      </SettingsSection>

      <SettingsSection label={t('theme')}>
        {(labelledBy) => <ThemeControl labelledBy={labelledBy} />}
      </SettingsSection>

      <CookieSettingsButton className="text-12 text-muted-foreground hover:text-foreground border-border-muted -mb-1 border-t px-1 pt-3 text-left transition-colors" />
    </div>
  )
}
