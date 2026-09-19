'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

type PropsT = {
  children: ReactNode
}

// `data-theme` rather than next-themes' default `class`, because the stylesheet's theme
// blocks are attribute selectors — and because `html`'s className already carries the font
// variables, which a library writing to that same attribute would be free to trample.
//
// `themes` is listed even though it matches the default pair: a palette experiment becomes
// another entry here plus another block in styles.css, with nothing to change at the call
// sites, and that only holds if the list is already the thing being read.
export function ThemeProvider({ children }: PropsT) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      themes={['light', 'dark']}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
