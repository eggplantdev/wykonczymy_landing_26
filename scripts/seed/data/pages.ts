import type { PageTypeT } from '@/lib/routing'
import type { LocalizedT } from '../types'

export type PageCopyT = { title: string; slug: string }

// The four live pages. Slugs are indexed addresses — see context/foundation/url-map.md
// before changing one.
export const pageSeeds: { pageType: PageTypeT; copy: LocalizedT<PageCopyT> }[] = [
  {
    pageType: 'home',
    copy: {
      pl: { title: 'Start', slug: 'start' },
      en: { title: 'Home', slug: 'home' },
    },
  },
  {
    pageType: 'completed-works',
    copy: {
      pl: { title: 'Realizacje', slug: 'realizacje' },
      en: { title: 'Completed works', slug: 'completed-works' },
    },
  },
  {
    pageType: 'interior-styles',
    copy: {
      pl: { title: 'Wykończenia', slug: 'wykonczenia' },
      en: { title: 'Interior styles', slug: 'interior-styles' },
    },
  },
  {
    pageType: 'contact',
    copy: {
      pl: { title: 'Kontakt', slug: 'kontakt' },
      en: { title: 'Contact', slug: 'contact' },
    },
  },
]
