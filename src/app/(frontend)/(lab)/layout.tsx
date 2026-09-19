import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

// Route groups do not appear in the URL, so `/hero-lab/` and its siblings are unchanged —
// what the group buys is that membership, not a remembered line in each page, is what keeps
// a dev surface out of production. The guard used to be copy-pasted into all three pages,
// which meant the fourth lab page would have shipped by omission.
//
// `robots` is here for the same reason. The root layout carries it today, but that entry
// goes at cutover; this one does not.
export const metadata: Metadata = {
  robots: { follow: false, index: false },
}

export default function LabLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound()

  return children
}
