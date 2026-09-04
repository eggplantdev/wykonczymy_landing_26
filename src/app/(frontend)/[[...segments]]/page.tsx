import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { HomePage } from '@/components/home/home-page'
import { InteriorStylesPage } from '@/components/interior-styles/interior-styles-page'
import { StylePage } from '@/components/interior-styles/style-page'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { SiteLogo } from '@/components/layout/site-logo'
import { homePlaceholder } from '@/lib/placeholder/home'
import {
  interiorStyles,
  interiorStylesPlaceholder,
  relatedStyles,
} from '@/lib/placeholder/interior-styles'
import { getTranslations, i18n } from '@/lib/i18n/i18n'
import { TranslationsProvider } from '@/lib/i18n/translations-provider'
import { findPage, pathsByType, pathsForPage } from '@/lib/pages'
import { HOME_PAGE_TYPE, pathForPage, resolveSegments, segmentsForPage } from '@/lib/routing'

type ParamsT = { segments?: string[] }

// The one page type with children. A second segment under anything else is not an
// address — see resolveSegments.
const INTERIOR_STYLES_PAGE_TYPE = 'interior-styles'

const findStyle = (childSlug: string) => interiorStyles.find((style) => style.slug === childSlug)

// Left on (the default) so an unenumerated address still reaches this segment and is
// rejected by notFound() — which is what renders not-found.tsx. With it off, Next
// rejects the param before the segment runs and serves its own bare 404 instead: no
// layout, no locale, none of our copy. The cost is a database lookup per unknown URL;
// the twelve real addresses are all prerendered and never pay it.
export const dynamicParams = true

// Resolves every public address at build time, so no request touches the database.
// tech-stack.md makes the CMS-owned-slug decision conditional on exactly this.
export async function generateStaticParams(): Promise<ParamsT[]> {
  const payload = await getPayload({ config: await config })
  const params: ParamsT[] = []

  for (const locale of i18n.locales) {
    const { docs } = await payload.find({
      collection: 'pages',
      locale,
      depth: 0,
      limit: 1000,
      where: { _status: { equals: 'published' } },
    })

    // `fallback: false`, so a page translated in one language only comes back with an
    // empty slug in the other — prerendering it would emit `/en/null/`.
    for (const doc of docs) {
      if (doc.pageType !== HOME_PAGE_TYPE && !doc.slug) continue

      params.push({ segments: segmentsForPage(doc, locale) })

      if (doc.pageType === INTERIOR_STYLES_PAGE_TYPE) {
        for (const style of interiorStyles)
          params.push({ segments: segmentsForPage(doc, locale, style.slug) })
      }
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ParamsT>
}): Promise<Metadata> {
  const { locale, slug, childSlug, isMiss } = resolveSegments((await params).segments)
  const page = isMiss ? null : await findPage(locale, slug)
  const style = childSlug ? findStyle(childSlug) : undefined

  return { title: style?.title ?? page?.title ?? getTranslations(locale).common.notFoundTitle }
}

export default async function CatchAllPage({ params }: { params: Promise<ParamsT> }) {
  const { locale, slug, childSlug, isMiss } = resolveSegments((await params).segments)
  if (isMiss) notFound()

  // `/en/` is a redirect to `/en/home/`; only the default locale has a root page.
  if (slug === null && locale !== i18n.defaultLocale) notFound()

  const page = await findPage(locale, slug)
  if (!page) notFound()

  const style = childSlug ? findStyle(childSlug) : undefined
  if (childSlug && (page.pageType !== INTERIOR_STYLES_PAGE_TYPE || !style)) notFound()

  const paths = await pathsForPage(page.id)
  const typePaths = await pathsByType(locale)

  const body = () => {
    if (style)
      return (
        <StylePage
          locale={locale}
          style={style}
          basePath={pathForPage(page, locale)}
          related={relatedStyles(style.slug)}
        />
      )

    if (page.pageType === HOME_PAGE_TYPE) return <HomePage data={homePlaceholder(typePaths)} />

    if (page.pageType === INTERIOR_STYLES_PAGE_TYPE)
      return (
        <InteriorStylesPage
          title={page.title}
          basePath={pathForPage(page, locale)}
          data={interiorStylesPlaceholder}
        />
      )

    return null
  }

  return (
    <TranslationsProvider locale={locale}>
      <SiteLogo homeHref={typePaths[HOME_PAGE_TYPE] ?? '/'} />
      {body()}
      <LanguageSwitcher paths={paths} />
    </TranslationsProvider>
  )
}
