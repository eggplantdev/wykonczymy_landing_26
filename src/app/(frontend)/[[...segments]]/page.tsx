import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { getTranslations, i18n } from '@/lib/i18n/i18n'
import { TranslationsProvider } from '@/lib/i18n/translations-provider'
import { findPage, pathsForPage } from '@/lib/pages'
import { resolveSegments, segmentsForPage } from '@/lib/routing'

type ParamsT = { segments?: string[] }

// The twelve indexed addresses are the whole public surface, so anything
// generateStaticParams did not enumerate is a 404 by construction rather than an
// on-demand render.
export const dynamicParams = false

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
      if (doc.isHome || doc.slug) params.push({ segments: segmentsForPage(doc, locale) })
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ParamsT>
}): Promise<Metadata> {
  const { locale, slug, isMiss } = resolveSegments((await params).segments)
  const page = isMiss ? null : await findPage(locale, slug)

  return { title: page?.title ?? getTranslations(locale).common.notFoundTitle }
}

export default async function CatchAllPage({ params }: { params: Promise<ParamsT> }) {
  const { locale, slug, isMiss } = resolveSegments((await params).segments)
  if (isMiss) notFound()

  // `/en/` is a redirect to `/en/home/`; only the default locale has a root page.
  if (slug === null && locale !== i18n.defaultLocale) notFound()

  const page = await findPage(locale, slug)
  if (!page) notFound()

  const paths = await pathsForPage(page.id)

  return (
    <TranslationsProvider locale={locale}>
      <article>
        <h1>{page.title}</h1>
        <p>
          {page.pageType} · {locale}
        </p>
        <LanguageSwitcher paths={paths} />
      </article>
    </TranslationsProvider>
  )
}
