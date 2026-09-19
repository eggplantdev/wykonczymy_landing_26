'use client'

import { usePathname } from 'next/navigation'

import { getTranslations } from '@/lib/i18n/i18n'
import { localeFromPath } from '@/lib/routing'

// The locale comes off the path rather than `useI18nContext`, which throws without a
// provider above it — a fallback that can crash turns a slow navigation into an error page.
export default function SegmentLoading() {
  const copy = getTranslations(localeFromPath(usePathname())).common

  return (
    // min-h-svh keeps the footer where a real page would put it, so the fallback doesn't
    // yank it up the screen and back down once the page arrives.
    <div role="status" className="flex min-h-svh items-center justify-center">
      <span
        aria-hidden
        className="border-border-muted border-t-foreground size-10 animate-spin rounded-full border-2 motion-reduce:animate-none"
      />
      <span className="sr-only">{copy.loading}</span>
    </div>
  )
}
