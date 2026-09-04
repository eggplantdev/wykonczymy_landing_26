import type { ReactNode } from 'react'

import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/footer/site-footer'
import { footerPlaceholder } from '@/lib/placeholder/footer'
import { TranslationsProvider } from '@/lib/i18n/translations-provider'
import { findPage, pathsByType, pathsForPage } from '@/lib/pages'
import { HOME_PAGE_TYPE, resolveSegments } from '@/lib/routing'

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
  const page = await findPage(locale, slug)
  const typePaths = await pathsByType(locale)
  const paths = page ? await pathsForPage(page.id) : {}

  return (
    <TranslationsProvider locale={locale}>
      <SiteHeader homeHref={typePaths[HOME_PAGE_TYPE] ?? '/'} paths={paths} />
      {children}
      <SiteFooter container="paddings pb-20 md:pb-30" data={footerPlaceholder(locale)} />
    </TranslationsProvider>
  )
}
