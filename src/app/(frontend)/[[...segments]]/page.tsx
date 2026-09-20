import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContactPage } from '@/components/contact/contact-page'
import { HomePage } from '@/components/home/home-page'
import { InteriorStylesPage } from '@/components/interior-styles/interior-styles-page'
import { LegalPage } from '@/components/legal/legal-page'
import { StylePage } from '@/components/interior-styles/style-page'
import { ProjectPage } from '@/components/projects/project-page'
import { ProjectsPage } from '@/components/projects/projects-page'
import { toHomeData } from '@/lib/content/home'
import { findChildren } from '@/lib/content/children'
import { resolveRoute } from '@/lib/content/route'
import { findInteriorStyles, relatedStyles } from '@/lib/content/interior-styles'
import { findProjects, relatedProjects } from '@/lib/content/projects'
import { getTranslations, i18n } from '@/lib/i18n/i18n'
import { findFooter } from '@/lib/content/footer'
import { findPublishedPages, pathsByType, pathsForPage } from '@/lib/content/pages'
import { toSeoMeta } from '@/lib/content/seo'
import { OG_LOCALES, SITE_NAME } from '@/lib/seo/constants'
import { toOgImages } from '@/lib/seo/og-image'
import {
  CONTACT_PAGE_TYPE,
  HOME_PAGE_TYPE,
  INTERIOR_STYLES_PAGE_TYPE,
  PROJECTS_PAGE_TYPE,
  PRIVACY_POLICY_PAGE_TYPE,
  pathForPage,
  segmentsForPage,
} from '@/lib/routing'

type ParamsT = { segments?: string[] }

// Left on (the default) so an unenumerated address still reaches this segment and is
// rejected by notFound() — which is what renders not-found.tsx. With it off, Next
// rejects the param before the segment runs and serves its own bare 404 instead: no
// layout, no locale, none of our copy. The cost is a database lookup per unknown URL;
// the twelve real addresses are all prerendered and never pay it.
export const dynamicParams = true

// tech-stack.md makes the CMS-owned-slug decision conditional on exactly this: every
// public address resolves at build time, so no request pays for a slug lookup.
export async function generateStaticParams(): Promise<ParamsT[]> {
  const perLocale = await Promise.all(
    i18n.locales.map(async (locale) => {
      const docs = await findPublishedPages(locale)
      const params: ParamsT[] = []

      // Hoisted out of the document loop so the two child collections are read once per
      // locale by construction, rather than relying on `cache()` to collapse a read per page.
      const children = new Map(
        await Promise.all(
          docs.map(
            async (doc) => [doc.pageType, await findChildren(doc.pageType, locale)] as const,
          ),
        ),
      )

      // `fallback: false`, so a page translated in one language only comes back with an
      // empty slug in the other — prerendering it would emit `/en/null/`.
      for (const doc of docs) {
        if (doc.pageType !== HOME_PAGE_TYPE && !doc.slug) continue

        params.push({ segments: segmentsForPage(doc, locale) })

        for (const child of children.get(doc.pageType) ?? [])
          params.push({ segments: segmentsForPage(doc, locale, child.slug) })
      }

      return params
    }),
  )

  return perLocale.flat()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ParamsT>
}): Promise<Metadata> {
  const { locale, childSlug, page, child, isMiss } = await resolveRoute((await params).segments)

  // Otherwise the 404 ships a real title and a canonical pointing at itself.
  if (isMiss || !page) return { title: getTranslations(locale).common.notFoundTitle }

  // Twelve indexed addresses with translated slugs: without an explicit canonical the
  // trailing-slash and www variants each look like a separate document, and without
  // `languages` the two translations look like duplicates rather than a pair.
  //
  // A child's counterpart slug lives in its own collection and is not resolvable from
  // the parent, so only page-level addresses advertise their translations.
  const languages = childSlug ? undefined : await pathsForPage(page.id)

  // A child's own meta was mapped by its finder, which also derived a description from its
  // summary copy; a page carries the raw plugin group and is mapped here.
  const meta = child?.meta ?? toSeoMeta(page.meta)

  const title = meta.title ?? child?.title ?? page.title
  const canonical = pathForPage(page, locale, childSlug ?? undefined)
  const images = toOgImages(meta.image)

  return {
    title,
    description: meta.description,
    alternates: {
      canonical,
      languages,
    },
    // Spelled out rather than left to Next's inheritance: `title` here would otherwise pick up
    // the layout's `| Wykończymy` template, which reads as noise next to `og:site_name`.
    openGraph: {
      type: 'website',
      title,
      description: meta.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: meta.description,
      images,
    },
  }
}

export default async function CatchAllPage({ params }: { params: Promise<ParamsT> }) {
  // The layout has already run this and 404ed on a miss — which is where the response status
  // is still settable. This call is free (the finders behind it are request-cached) and is
  // what gives the render a non-null page.
  const { locale, childSlug, page, isMiss } = await resolveRoute((await params).segments)
  if (isMiss || !page) notFound()

  const basePath = pathForPage(page, locale)

  if (page.pageType === INTERIOR_STYLES_PAGE_TYPE) {
    const styles = await findInteriorStyles(locale)
    const style = childSlug ? styles.find((item) => item.slug === childSlug) : undefined

    return style ? (
      <StylePage
        locale={locale}
        style={style}
        basePath={basePath}
        related={relatedStyles(styles, style.slug)}
      />
    ) : (
      <InteriorStylesPage title={page.title} basePath={basePath} data={{ styles }} />
    )
  }

  if (page.pageType === PROJECTS_PAGE_TYPE) {
    const projects = await findProjects(locale)
    const project = childSlug ? projects.find((item) => item.slug === childSlug) : undefined

    return project ? (
      <ProjectPage
        locale={locale}
        project={project}
        basePath={basePath}
        related={relatedProjects(projects, project.slug)}
      />
    ) : (
      <ProjectsPage locale={locale} title={page.title} basePath={basePath} data={{ projects }} />
    )
  }

  if (page.pageType === HOME_PAGE_TYPE) {
    // The rating badges are stored on the footer global; `findFooter` is request-cached, so
    // reading it here costs no second query on top of the layout's own footer.
    const [projects, styles, typePaths, footer] = await Promise.all([
      findProjects(locale),
      findInteriorStyles(locale),
      pathsByType(locale),
      findFooter(locale),
    ])

    return (
      <HomePage
        data={toHomeData(page, { locale, projects, styles, typePaths })}
        ratings={footer.ratings}
      />
    )
  }

  if (page.pageType === CONTACT_PAGE_TYPE) {
    // Phone and mail live on the footer global, which is already loaded for the layout's
    // footer — `findFooter` is request-cached, so reading it again costs no second query.
    const footer = await findFooter(locale)

    return (
      <ContactPage
        locale={locale}
        title={page.title}
        data={{
          address: page.contact?.address ?? undefined,
          nip: page.contact?.nip ?? undefined,
          phone: footer.phone,
          mail: footer.mail,
        }}
      />
    )
  }

  if (page.pageType === PRIVACY_POLICY_PAGE_TYPE)
    return <LegalPage title={page.title} body={page.legal?.body} />

  // `price-list` has no component. It is one of the twelve indexed addresses, so the
  // route answers rather than 404s until it is built or the type is dropped.
  return null
}
