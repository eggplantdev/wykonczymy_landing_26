import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { findPage } from '@/lib/content/pages'
import { toImage, toVideo } from '@/lib/content/media'
import { i18n } from '@/lib/i18n/i18n'

import type { HeroSourceT } from './hero-frame'
import { CentredBottomCta, CentredStack, LeftCentred, LeftFoot, SplitFoot } from './variants'

export const metadata: Metadata = {
  description: 'Hero layouts, stacked, on the real photo and copy.',
  title: 'Hero lab',
}

// The home document is read per request so the lab always shows whatever is in the admin
// right now, rather than whatever was there at build time.
export const dynamic = 'force-dynamic'

export default async function HeroLabPage() {
  const page = await findPage(i18n.defaultLocale, null)
  const hero = page?.home?.hero
  if (!hero?.title) notFound()

  const source: HeroSourceT = {
    title: hero.title,
    image: toImage(hero.image),
    video: toVideo(hero.video),
    ctaLabel: hero.ctaLabel ?? undefined,
    // The lab never navigates anywhere, so the button only has to look like the real one.
    ctaHref: '#',
  }

  return (
    <div>
      <CentredStack source={source} />
      <CentredBottomCta source={source} />
      <LeftCentred source={source} />
      <LeftFoot source={source} />
      <SplitFoot source={source} />
    </div>
  )
}
