import type { ReactNode } from 'react'

import { PageTransition } from '@/components/layout/page-transition'

// A template remounts on every navigation, so the enter animation replays per page —
// a layout would mount once and never run it again.
export default function FrontendTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
