import type { ReactNode } from 'react'

import { ConsentProvider } from '@/components/cookies/consent-provider'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { PageTransition } from '@/components/layout/page-transition'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/footer/site-footer'
import { findFooter } from '@/lib/content/footer'
import { TranslationsProvider } from '@/lib/i18n/translations-provider'
import { findPage, pathsByType, pathsForPage } from '@/lib/content/pages'
import { PRIVACY_POLICY_PAGE_TYPE, resolveSegments } from '@/lib/routing'

type ParamsT = { segments?: string[] }

// The shell sits outside `PageTransition`, which wraps only the page body: a transform on
// the animated wrapper would otherwise make it the containing block for the logo's
// `position: fixed` and drag it along for the animation.
//
// It lives here rather than in a `template.tsx` because a template remounts per navigation,
// which would tear down `AnimatePresence` itself — it can only animate an exit for a child
// *it* removes, so the outgoing page was disappearing in a single frame. The layout persists
// and the keyed wrapper inside it is what replays.
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
        <SiteHeader paths={paths} typePaths={typePaths} phone={footer.phone} locale={locale} />
        <MobileMenu paths={paths} typePaths={typePaths} phone={footer.phone} />
        <div className="bg-background flex min-h-lvh flex-col">
          <div className="grow">
            <PageTransition>{children}</PageTransition>
          </div>
          <SiteFooter data={footer} locale={locale} typePaths={typePaths} />
        </div>
      </ConsentProvider>
    </TranslationsProvider>
  )
}
