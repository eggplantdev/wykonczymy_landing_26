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

// The bar spans the page but only its controls take pointer events, so the empty space
// either side of the nav does not swallow clicks on the page beneath. It is
// fixed, so the viewport — not `body` — is its containing block: it has to be capped and
// centred itself or it would sit flush to the screen edges above 1920.
export function SiteHeader({ paths, typePaths }: PropsT) {
  return (
    // The outer columns are equal fractions, so the nav lands on the page's own axis
    // whatever the logo happens to measure — a flex row would only centre it in the space
    // left over, and it would drift as the labels change length in EN.
    <header className="paddings max-w-site pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4 md:py-6">
      <div className="pointer-events-auto justify-self-start">
        <SiteLogo homeHref={typePaths[HOME_PAGE_TYPE] ?? '/'} />
      </div>

      <div className="pointer-events-auto hidden items-center gap-1 md:flex">
        <SiteNav paths={typePaths} />
        <LanguageSwitcher paths={paths} />
      </div>

      {/* Nothing renders into the third track, but it is load-bearing: it is the fraction
          that balances the logo's. */}
    </header>
  )
}
