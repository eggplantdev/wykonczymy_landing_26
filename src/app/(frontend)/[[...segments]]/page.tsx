import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { HomePage } from '@/components/home/home-page'
import { InteriorStylesPage } from '@/components/interior-styles/interior-styles-page'
import { StylePage } from '@/components/interior-styles/style-page'
import { ProjectPage } from '@/components/projects/project-page'
import { ProjectsPage } from '@/components/projects/projects-page'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { SiteFooter } from '@/components/footer/site-footer'
import { SiteLogo } from '@/components/layout/site-logo'
import { footerPlaceholder } from '@/lib/placeholder/footer'
import { homePlaceholder } from '@/lib/placeholder/home'
import {
  interiorStyles,
  interiorStylesPlaceholder,
  relatedStyles,
} from '@/lib/placeholder/interior-styles'
import { projects, projectsPlaceholder, relatedProjects } from '@/lib/placeholder/projects'
import { getTranslations, i18n } from '@/lib/i18n/i18n'
import { TranslationsProvider } from '@/lib/i18n/translations-provider'
import { findPage, pathsByType, pathsForPage } from '@/lib/pages'
import { HOME_PAGE_TYPE, pathForPage, resolveSegments, segmentsForPage } from '@/lib/routing'

type ParamsT = { segments?: string[] }

// The two page types with children. A second segment under anything else is not an
// address — see resolveSegments.
const INTERIOR_STYLES_PAGE_TYPE = 'interior-styles'
const PROJECTS_PAGE_TYPE = 'completed-works'

// Every child address a parent owns, so prerendering and resolution read one list rather
// than each spelling out which collection hangs off which page type.
const childSlugsFor = (pageType: string): string[] => {
  if (pageType === INTERIOR_STYLES_PAGE_TYPE) return interiorStyles.map((style) => style.slug)
  if (pageType === PROJECTS_PAGE_TYPE) return projects.map((project) => project.slug)
  return []
}

const findStyle = (childSlug: string) => interiorStyles.find((style) => style.slug === childSlug)

const findProject = (childSlug: string) => projects.find((project) => project.slug === childSlug)

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

      for (const childSlug of childSlugsFor(doc.pageType))
        params.push({ segments: segmentsForPage(doc, locale, childSlug) })
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
  const child = childSlug ? (findStyle(childSlug) ?? findProject(childSlug)) : undefined

  return { title: child?.title ?? page?.title ?? getTranslations(locale).common.notFoundTitle }
}

export default async function CatchAllPage({ params }: { params: Promise<ParamsT> }) {
  const { locale, slug, childSlug, isMiss } = resolveSegments((await params).segments)
  if (isMiss) notFound()

  // `/en/` is a redirect to `/en/home/`; only the default locale has a root page.
  if (slug === null && locale !== i18n.defaultLocale) notFound()

  const page = await findPage(locale, slug)
  if (!page) notFound()

  const style =
    page.pageType === INTERIOR_STYLES_PAGE_TYPE && childSlug ? findStyle(childSlug) : undefined
  const project =
    page.pageType === PROJECTS_PAGE_TYPE && childSlug ? findProject(childSlug) : undefined
  if (childSlug && !style && !project) notFound()

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

    if (project)
      return (
        <ProjectPage
          locale={locale}
          project={project}
          basePath={pathForPage(page, locale)}
          related={relatedProjects(project.slug)}
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

    if (page.pageType === PROJECTS_PAGE_TYPE)
      return (
        <ProjectsPage
          locale={locale}
          title={page.title}
          basePath={pathForPage(page, locale)}
          data={projectsPlaceholder}
        />
      )

    return null
  }

  return (
    <TranslationsProvider locale={locale}>
      <SiteLogo homeHref={typePaths[HOME_PAGE_TYPE] ?? '/'} />
      {body()}
      <SiteFooter container="paddings pb-20 md:pb-30" data={footerPlaceholder(locale)} />
      <LanguageSwitcher paths={paths} />
    </TranslationsProvider>
  )
}
