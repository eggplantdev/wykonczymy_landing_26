import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { SiteLogo } from '@/components/layout/site-logo'
import { SiteNav } from '@/components/layout/site-nav'
import type { Locale } from '@/lib/i18n/i18n'
import { HOME_PAGE_TYPE } from '@/lib/routing'
import type { Page } from '@/payload-types'

type PropsT = {
  paths: Partial<Record<Locale, string>>
  typePaths: Partial<Record<Page['pageType'], string>>
}

// The bar spans the viewport but only its controls take pointer events, so the strip
// of empty space between logo and nav does not swallow clicks on the page beneath.
export function SiteHeader({ paths, typePaths }: PropsT) {
  return (
    <header className="paddings pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 py-4 md:py-6">
      <div className="pointer-events-auto">
        <SiteLogo homeHref={typePaths[HOME_PAGE_TYPE] ?? '/'} />
      </div>

      <div className="pointer-events-auto hidden items-center gap-1 md:flex">
        <SiteNav paths={typePaths} />
        <LanguageSwitcher paths={paths} />
      </div>
    </header>
  )
}
