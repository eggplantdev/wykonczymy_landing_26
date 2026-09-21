import type { Metadata } from 'next'
import React from 'react'
import './styles.css'

import { DebugTools } from '@/components/debug/debug-tools'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { siteFont, titleFont } from './fonts'
// Every route renders through this layout, so a missing or malformed public var fails
// `next build` here instead of surfacing as undefined in the browser.
import { SERVER_URL } from '@/lib/env'
import { SEARCH_INDEXING_ENABLED, SITE_NAME } from '@/lib/seo/constants'

// metadataBase is what makes the per-page `alternates` resolve to absolute URLs; without
// it Next emits relative canonicals, which search engines treat as no canonical at all.
export const metadata: Metadata = {
  metadataBase: new URL(SERVER_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  robots: SEARCH_INDEXING_ENABLED ? undefined : { index: false, follow: false },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The root layout cannot see route params, so this is the default locale, not the
    // current one. TranslationsProvider corrects it after hydration; this attribute is what
    // a crawler that never runs JS still sees on `/en/`.
    // Painting `html` rather than `body` leaves the segment layout's own painted wrapper as
    // what the menu toggle blends against.
    // suppressHydrationWarning is required, not defensive: next-themes resolves the theme
    // in a blocking script before paint, so the `data-theme` the browser has by hydration
    // is one the server could not have known to render.
    <html
      lang="pl"
      suppressHydrationWarning
      className={`bg-background ${siteFont.variable} ${titleFont.variable}`}
    >
      <body>
        <ThemeProvider>
          <main>{children}</main>
          {/* Gated here, not inside the component: an early return still ships the whole
              client module to production browsers. */}
          {process.env.NODE_ENV !== 'production' && <DebugTools />}
        </ThemeProvider>
      </body>
    </html>
  )
}
