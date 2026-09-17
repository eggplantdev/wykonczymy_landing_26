import type { Metadata } from 'next'
import React from 'react'
import './styles.css'

import { DebugTools } from '@/components/debug/debug-tools'
// Every route renders through this layout, so a missing or malformed public var fails
// `next build` here instead of surfacing as undefined in the browser.
import { SERVER_URL } from '@/lib/env'

const SITE_NAME = 'Wykończymy'

// metadataBase is what makes the per-page `alternates` resolve to absolute URLs; without
// it Next emits relative canonicals, which search engines treat as no canonical at all.
export const metadata: Metadata = {
  metadataBase: new URL(SERVER_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The root layout cannot see route params, so this is the default locale, not the
    // current one — `/en/` knowingly declares itself Polish until the locale moves into
    // a real route segment.
    <html lang="pl">
      <body>
        <main>{children}</main>
        {/* Gated here, not inside the component: an early return still ships the whole
            client module to production browsers. */}
        {process.env.NODE_ENV !== 'production' && <DebugTools />}
      </body>
    </html>
  )
}
