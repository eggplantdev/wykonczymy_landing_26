import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { SiteLogo } from '@/components/layout/site-logo'
import type { Locale } from '@/lib/i18n/i18n'

type PropsT = {
  homeHref: string
  paths: Partial<Record<Locale, string>>
}

export function SiteHeader({ homeHref, paths }: PropsT) {
  return (
    <header>
      <SiteLogo homeHref={homeHref} />
      <LanguageSwitcher paths={paths} />
    </header>
  )
}
