import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { ConsentProvider } from '@/components/cookies/consent-provider'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { PageTransition } from '@/components/layout/page-transition'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/footer/site-footer'
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld'
import { findOrganization } from '@/lib/content/organization'
import { findFooter } from '@/lib/content/footer'
import { TranslationsProvider } from '@/lib/i18n/translations-provider'
import { pathsByType, pathsForPage } from '@/lib/content/pages'
import { resolveRoute } from '@/lib/content/route'
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
  const { segments } = await params
  const { locale } = resolveSegments(segments)

  // Above the Suspense boundary `loading.tsx` puts around the page, which is the only place
  // left where a miss can still set the response status — see resolveRoute. The chrome's own
  // reads do not depend on it, so they still go out together with it rather than behind.
  const [route, typePaths, footer, organization] = await Promise.all([
    resolveRoute(segments),
    pathsByType(locale),
    findFooter(locale),
    findOrganization(locale),
  ])
  if (route.isMiss || !route.page) notFound()

  // The only dependent lookup — it needs the page's id.
  const paths = await pathsForPage(route.page.id)

  return (
    <TranslationsProvider locale={locale}>
      <ConsentProvider privacyPolicyHref={typePaths[PRIVACY_POLICY_PAGE_TYPE]}>
        <OrganizationJsonLd {...organization} />
        <SiteHeader paths={paths} typePaths={typePaths} phone={footer.phone} locale={locale} />
        <MobileMenu paths={paths} typePaths={typePaths} phone={footer.phone} />
        <div className="flex min-h-lvh flex-col bg-background">
          <div className="grow">
            <PageTransition>{children}</PageTransition>
          </div>
          <SiteFooter data={footer} locale={locale} typePaths={typePaths} />
        </div>
      </ConsentProvider>
    </TranslationsProvider>
  )
}
