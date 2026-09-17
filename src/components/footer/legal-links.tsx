import Link from 'next/link'

import type { Page } from '@/payload-types'
import { cn } from '@/lib/cn'
import type { TranslationsT } from '@/lib/i18n/i18n'
import { PRIVACY_POLICY_PAGE_TYPE } from '@/lib/routing'

type PropsT = {
  typePaths: Partial<Record<Page['pageType'], string>>
  nav: TranslationsT['nav']
  className?: string
}

// Read off the published pages rather than composed from a slug: the policy is one
// document with a different slug per locale, and it may not be live in both.
export function LegalLinks({ typePaths, nav, className }: PropsT) {
  const href = typePaths[PRIVACY_POLICY_PAGE_TYPE]
  if (!href) return null

  return (
    <ul
      className={cn(
        'text-10 text-grau_500 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start',
        className,
      )}
    >
      <li>
        <Link href={href} className="hover:text-grau_200 transition-colors">
          {nav.privacyPolicy}
        </Link>
      </li>
    </ul>
  )
}
