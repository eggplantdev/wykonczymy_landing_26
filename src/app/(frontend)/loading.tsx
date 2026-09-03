import { Spinner } from '@/components/Spinner'
import { getTranslations, i18n } from '@/lib/i18n/i18n'

// Every address is prerendered today, so this fallback is near-unreachable — it exists
// for the first route that streams or opts out of static generation, where its absence
// is a blank frame rather than an error.
//
// A loading UI has no params and no provider above it, so it cannot know the locale.
// The default locale is the deliberate wrong answer for `/en/`; see the deferred
// locale-aware-shell finding in roadmap.md § F2.
export default function Loading() {
  return <Spinner label={getTranslations(i18n.defaultLocale).common.loading} />
}
