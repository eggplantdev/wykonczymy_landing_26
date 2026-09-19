'use client'

import Link from 'next/link'
import { useId } from 'react'
import { useConsentManager } from '@c15t/nextjs/headless'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/use-translation'

type PropsT = {
  privacyPolicyHref?: string
}

// A landmark rather than a modal: c15t resolves consent after the page has painted, so a
// focus trap would yank the reader out of whatever they had already started reading.
export function CookieBanner({ privacyPolicyHref }: PropsT) {
  const { activeUI, setActiveUI, saveConsents } = useConsentManager()
  const { t } = useTranslation('cookies')
  const { t: tNav } = useTranslation('nav')
  const titleId = useId()

  if (activeUI !== 'banner') return null

  return (
    <section
      aria-labelledby={titleId}
      className="border-grau_700 bg-white shadow-header fixed inset-x-4 bottom-4 z-50 max-w-md rounded-md border p-5 md:inset-x-6 md:bottom-6"
    >
      <h2 id={titleId} className="text-14 text-shwarz mb-2 md:text-16">
        {t('title')}
      </h2>
      <p className="text-12 text-grau_100 leading-150">{t('description')}</p>

      {privacyPolicyHref && (
        <Link
          href={privacyPolicyHref}
          className="text-10 text-grau_100 hover:text-shwarz mt-2 inline-block underline underline-offset-2 transition-colors"
        >
          {tNav('privacyPolicy')}
        </Link>
      )}

      {/* Accept and refuse wear the same pill: a refusal in a quieter style is not a free
          choice under the GDPR. */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" label={t('acceptAll')} onClick={() => saveConsents('all')} />
        <Button size="sm" label={t('rejectAll')} onClick={() => saveConsents('necessary')} />
        <Button
          size="sm"
          variant="outline"
          label={t('customize')}
          onClick={() => setActiveUI('dialog')}
        />
      </div>
    </section>
  )
}
