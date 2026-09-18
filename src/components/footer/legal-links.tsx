import Link from 'next/link'

import { CookieSettingsButton } from '@/components/cookies/cookie-settings-button'
import type { Page } from '@/payload-types'
import { cn } from '@/lib/cn'
import type { TranslationsT } from '@/lib/i18n/i18n'
import { PRIVACY_POLICY_PAGE_TYPE } from '@/lib/routing'

type PropsT = {
  typePaths: Partial<Record<Page['pageType'], string>>
  nav: TranslationsT['nav']
  className?: string
}

// Reopening the dialog is not a navigation, so one entry is a button and the other a
// link — but they read as one control, so they dress as one.
const entryClasses = 'hover:text-grau_200 transition-colors'

// Read off the published pages rather than composed from a slug: the policy is one
// document with a different slug per locale, and it may not be live in both.
export function LegalLinks({ typePaths, nav, className }: PropsT) {
  const href = typePaths[PRIVACY_POLICY_PAGE_TYPE]

  return (
    <ul
      className={cn(
        'text-10 text-grau_500 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start',
        className,
      )}
    >
      {href && (
        <li>
          <Link href={href} className={entryClasses}>
            {nav.privacyPolicy}
          </Link>
        </li>
      )}
      <li>
        <CookieSettingsButton className={entryClasses} />
      </li>
    </ul>
  )
}
