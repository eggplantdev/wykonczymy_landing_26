'use client'

import Link from 'next/link'

import { useTranslation } from '@/lib/i18n/use-translation'

type PropsT = {
  href?: string
}

const LINK_SLOT = '{link}'

// One translation string with a slot rather than two halves joined in the component: PL
// and EN put the policy at different points in the clause, so concatenating would pin the
// word order to whichever language was written first. Without an address — the policy is
// not published in this locale — the phrase still reads, just without the link.
export function ConsentLabel({ href }: PropsT) {
  const { t } = useTranslation('form')
  const [before = '', after = ''] = t('acceptTerms').split(LINK_SLOT)
  const linkText = t('acceptTermsLink')

  if (!href) return `${before}${linkText}${after}`

  return (
    <>
      {before}
      {/* The link sits inside the checkbox's <label>, so a plain click would tick the box
          on its way out; stopping it there keeps the two controls apart. The new tab is
          what saves the half-filled form from being navigated away from. */}
      <Link
        href={href}
        target="_blank"
        onClick={(event) => event.stopPropagation()}
        className="hover:text-shwarz underline underline-offset-2 transition-colors"
      >
        {linkText}
      </Link>
      {after}
    </>
  )
}
