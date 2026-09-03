'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { getTranslations } from '@/lib/i18n/i18n'
import { localeFromPath } from '@/lib/routing'

// An error boundary is always a client component: `reset` re-renders the segment, which
// only the client can do. Like not-found.tsx it renders outside the catch-all, so the
// path prefix is the only locale signal available.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const copy = getTranslations(localeFromPath(usePathname())).common

  // The digest is the only handle on a production error: Next strips the message before
  // it reaches the browser, and this is what correlates the page with the server log.
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <article>
      <h1>{copy.errorTitle}</h1>
      <p>{copy.errorBody}</p>
      <button type="button" onClick={reset}>
        {copy.retry}
      </button>
    </article>
  )
}
