'use client'

import { getTranslations, i18n } from '@/lib/i18n/i18n'

// Only reached when the root layout itself throws, which means the layout's <html> and
// <body> never rendered — so this component has to supply them. Nothing above it can be
// assumed to work, so it stays deliberately minimal and does not try to detect a locale.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const copy = getTranslations(i18n.defaultLocale).common

  return (
    <html lang={i18n.defaultLocale}>
      <body>
        <h1>{copy.errorTitle}</h1>
        <p>{copy.errorBody}</p>
        <button type="button" onClick={reset}>
          {copy.retry}
        </button>
      </body>
    </html>
  )
}
