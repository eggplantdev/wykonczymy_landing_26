'use client'

import { useConsentManager } from '@c15t/nextjs/headless'

import { useTranslation } from '@/lib/i18n/use-translation'

type PropsT = {
  className?: string
}

// The banner never returns on its own once answered, so this is the only way back to the
// choice — which the GDPR requires there to be.
export function CookieSettingsButton({ className }: PropsT) {
  const { setActiveUI } = useConsentManager()
  const { t } = useTranslation('cookies')

  return (
    <button type="button" onClick={() => setActiveUI('dialog')} className={className}>
      {t('settingsTrigger')}
    </button>
  )
}
