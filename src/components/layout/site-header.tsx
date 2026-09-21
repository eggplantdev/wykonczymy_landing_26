import { SettingsMenu } from '@/components/layout/settings-menu'
import { SiteLogo } from '@/components/layout/site-logo'
import { SiteNav } from '@/components/layout/site-nav'
import { PhoneCta } from '@/components/ui/phone-cta'
import { getTranslations, type Locale } from '@/lib/i18n/i18n'
import { HOME_PAGE_TYPE } from '@/lib/routing'
import type { Page } from '@/payload-types'

type PropsT = {
  paths: Partial<Record<Locale, string>>
  typePaths: Partial<Record<Page['pageType'], string>>
  phone: string
  locale: Locale
}

// The bar spans the page but only its controls take pointer events, so the empty space
// either side of the nav does not swallow clicks on the page beneath.
//
// It does not take `site-container`: the logo belongs at the edge of the screen, like the footer
// bar and the carousel tracks. The nav does not move for that — the column is centred, so its
// axis and the screen's are the same point.
export function SiteHeader({ paths, typePaths, phone, locale }: PropsT) {
  const { nav } = getTranslations(locale)

  return (
    // The outer columns are equal fractions, so the nav lands on the page's own axis
    // whatever the logo happens to measure — a flex row would only centre it in the space
    // left over, and it would drift as the labels change length in EN.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-4 paddings pt-2 md:py-6">
      <div className="pointer-events-auto justify-self-start">
        <SiteLogo homeHref={typePaths[HOME_PAGE_TYPE] ?? '/'} />
      </div>

      <div className="pointer-events-auto hidden md:block">
        <SiteNav paths={typePaths} trailing={<SettingsMenu paths={paths} />} />
      </div>

      {/* Desktop only: on a phone this corner belongs to the menu toggle, and the panel it
          opens carries its own call button. */}
      <div className="pointer-events-auto hidden justify-self-end md:block">
        <PhoneCta phone={phone} callLabel={nav.callUs} variant="solid" size="sm" />
      </div>
    </header>
  )
}
