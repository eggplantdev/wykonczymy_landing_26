import type { ReactNode } from 'react'

import { MobileMenu } from '@/components/layout/mobile-menu'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/footer/site-footer'
import { findFooter } from '@/lib/content/footer'
import { TranslationsProvider } from '@/lib/i18n/translations-provider'
import { findPage, pathsByType, pathsForPage } from '@/lib/content/pages'
import { resolveSegments } from '@/lib/routing'

type ParamsT = { segments?: string[] }

// The shell sits in the layout, not the page, so `template.tsx` wraps only the page
// body: a transform on the animated wrapper would otherwise make it the containing
// block for the logo's `position: fixed` and drag it along for the animation.
//
// A layout on the catch-all segment still receives `params`, which is what lets the
// language switcher's hrefs stay server-resolved.
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
      <SiteHeader paths={paths} typePaths={typePaths} />
      <MobileMenu paths={paths} typePaths={typePaths} phone={footer.phone} />
      {/* The background is painted here rather than on body: a background on html/body
          propagates to the browser canvas, which is not part of the root group's
          backdrop, so the menu toggle's mix-blend-difference would have nothing to
          invert against on plain sections. */}
      <div className="bg-white flex min-h-lvh flex-col">
        <div className="grow">{children}</div>
        <SiteFooter
          container="paddings pt-20 pb-10 md:pt-30  xl:pt-40"
          data={footer}
          locale={locale}
          typePaths={typePaths}
        />
      </div>
    </TranslationsProvider>
  )
}
