import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import { resolveSegments, segmentsForPage } from '@/lib/routing'

type ParamsT = { segments?: string[] }

async function findPage(locale: Locale, slug: string | null) {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    depth: 0,
    limit: 1,
    where: {
      _status: { equals: 'published' },
      ...(slug === null ? { isHome: { equals: true } } : { slug: { equals: slug } }),
    },
  })

  return docs[0] ?? null
}

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

    for (const doc of docs) params.push({ segments: segmentsForPage(doc, locale) })
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ParamsT>
}): Promise<Metadata> {
  const { locale, slug } = resolveSegments((await params).segments)
  const page = await findPage(locale, slug)

  return { title: page?.title ?? 'Nie znaleziono' }
}

export default async function CatchAllPage({ params }: { params: Promise<ParamsT> }) {
  const { locale, slug } = resolveSegments((await params).segments)

  // `/en/` is a redirect to `/en/home/`; only the default locale has a root page.
  if (slug === null && locale !== i18n.defaultLocale) notFound()

  const page = await findPage(locale, slug)
  if (!page) notFound()

  return (
    <article>
      <h1>{page.title}</h1>
      <p>
        {page.pageType} · {locale}
      </p>
    </article>
  )
}
