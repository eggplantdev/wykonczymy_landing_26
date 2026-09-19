import type { Metadata } from 'next'
import React from 'react'
import './styles.css'

import { DebugTools } from '@/components/debug/debug-tools'
import { siteFont, titleFont } from './fonts'
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
    // `body` is capped at 1920 and centred, so past that width the page stops short of the
    // screen edges. Painting `html` fills the gutters by propagating to the canvas, and
    // leaves the segment layout's own painted wrapper as what the menu toggle blends against.
    <html lang="pl" className={`bg-white ${siteFont.variable} ${titleFont.variable}`}>
      <body>
        <main>{children}</main>
        {/* Gated here, not inside the component: an early return still ships the whole
            client module to production browsers. */}
        {process.env.NODE_ENV !== 'production' && <DebugTools />}
      </body>
    </html>
  )
}
