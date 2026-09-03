'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { getTranslations } from '@/lib/i18n/i18n'
import { localeFromPath } from '@/lib/routing'

// Same layout as not-found.tsx. An error boundary is always a client component:
// `reset` re-renders the segment, which only the client can do.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const copy = getTranslations(localeFromPath(usePathname())).common

  // Next strips the message in production before it reaches the browser; logging here
  // is what correlates the page with the server-side digest.
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex items-center gap-6">
        <h1 className="border-r border-current/30 pr-6 text-2xl font-medium">500</h1>
        <div className="space-y-1">
          <p className="text-sm">{copy.errorBody}</p>
          <button className="text-sm underline" type="button" onClick={reset}>
            {copy.retry}
          </button>
        </div>
      </div>
    </div>
  )
}
