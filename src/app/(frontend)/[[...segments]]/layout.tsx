import type { ReactNode } from 'react'

import { ConsentProvider } from '@/components/cookies/consent-provider'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/footer/site-footer'
import { findFooter } from '@/lib/content/footer'
import { TranslationsProvider } from '@/lib/i18n/translations-provider'
import { findPage, pathsByType, pathsForPage } from '@/lib/content/pages'
import { PRIVACY_POLICY_PAGE_TYPE, resolveSegments } from '@/lib/routing'

type ParamsT = { segments?: string[] }

// The shell sits in the layout, not the page, so `template.tsx` wraps only the page
// body: a transform on the animated wrapper would otherwise make it the containing
// block for the logo's `position: fixed` and drag it along for the animation.
//
// A layout on the catch-all segment still receives `params`, which is what lets the
// settings panel's locale hrefs stay server-resolved.
export default async function SegmentLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<ParamsT>
}) {
  const { locale, slug } = resolveSegments((await params).segments)
  const [page, typePaths, footer] = await Promise.all([
    findPage(locale, slug),
    pathsByType(locale),
    findFooter(locale),
  ])
  // The only dependent lookup — it needs the page's id.
  const paths = page ? await pathsForPage(page.id) : {}

  return (
    <TranslationsProvider locale={locale}>
      <ConsentProvider privacyPolicyHref={typePaths[PRIVACY_POLICY_PAGE_TYPE]}>
        <SiteHeader paths={paths} typePaths={typePaths} />
        <MobileMenu paths={paths} typePaths={typePaths} phone={footer.phone} />
        <div className="bg-background flex min-h-lvh flex-col">
          <div className="grow">{children}</div>
          <SiteFooter
            container="paddings pt-20 pb-6 md:pt-30 xl:pt-40"
            data={footer}
            locale={locale}
            typePaths={typePaths}
          />
        </div>
      </ConsentProvider>
    </TranslationsProvider>
  )
}
