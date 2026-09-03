import React from 'react'
import './styles.css'

// Side-effect import: every route renders through this layout, so a missing or malformed
// public var fails `next build` instead of surfacing as undefined in the browser.
import '@/lib/env'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
