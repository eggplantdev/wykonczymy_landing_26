import Link from 'next/link'

import { SegmentedControl, segmentClasses } from '@/components/ui/segmented-control'
import { i18n, type Locale } from '@/lib/i18n/i18n'
import { useTranslation } from '@/lib/i18n/use-translation'
import { localeRoot } from '@/lib/routing'

const LOCALE_LABEL_KEYS = {
  pl: 'languagePl',
  en: 'languageEn',
} as const satisfies Record<Locale, string>

type PropsT = {
  paths: Partial<Record<Locale, string>>
  labelledBy: string
  onSelect: () => void
}

// Links rather than a client-side locale setter: the translations are separate URLs that have
// to stay crawlable, and `hrefLang` is what tells a crawler the two are the same page.
export function LanguageControl({ paths, labelledBy, onSelect }: PropsT) {
  const { t, locale } = useTranslation('common')

  return (
    <SegmentedControl aria-labelledby={labelledBy}>
      {i18n.locales.map((candidate) => (
        <Link
          key={candidate}
          // Home is the fallback because `pathsForPage` omits a locale the page has no slug
          // for — the control still has somewhere to send you, in the language you asked for.
          href={paths[candidate] ?? localeRoot(candidate)}
          hrefLang={candidate}
          aria-label={t(LOCALE_LABEL_KEYS[candidate])}
          aria-current={candidate === locale ? 'page' : undefined}
          onClick={onSelect}
          className={segmentClasses(candidate === locale)}
        >
          {candidate.toUpperCase()}
        </Link>
      ))}
    </SegmentedControl>
  )
}
