import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ConsentProvider } from '@/components/cookies/consent-provider'
import { SiteFooter } from '@/components/footer/site-footer'
import { findFooter } from '@/lib/content/footer'
import { i18n } from '@/lib/i18n/i18n'
import { pathsByType } from '@/lib/content/pages'
import { PRIVACY_POLICY_PAGE_TYPE } from '@/lib/routing'
import { TranslationsProvider } from '@/lib/i18n/translations-provider'

export const metadata: Metadata = {
  description: 'The footer on its own, with no page above it.',
  robots: { follow: false, index: false },
  title: 'Footer lab',
}

/** Read per request, so the lab shows whatever the admin holds right now. */
export const dynamic = 'force-dynamic'

export default async function FooterLabPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  const locale = i18n.defaultLocale
  const [footer, typePaths] = await Promise.all([findFooter(locale), pathsByType(locale)])

  return (
    <TranslationsProvider locale={locale}>
      <ConsentProvider privacyPolicyHref={typePaths[PRIVACY_POLICY_PAGE_TYPE]}>
        <div className="bg-background text-foreground">
          <SiteFooter data={footer} locale={locale} typePaths={typePaths} />
        </div>
      </ConsentProvider>
    </TranslationsProvider>
  )
}
