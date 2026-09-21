'use client'

import dynamic from 'next/dynamic'
import { useConsentManager } from '@c15t/nextjs/headless'

// A static import would put the beacon in the chunk every page downloads, including for
// the visitors who said no.
//
// `loading` renders nothing but must stay: without it the lazy component's Suspense
// boundary has no fallback, so suspending hides the page's whole subtree while the chunk
// loads and takes the scroll position with it — here that would land on the click that
// accepts analytics. Same reason as `photo-lightbox.tsx`.
const Analytics = dynamic(() => import('@vercel/analytics/next').then((m) => m.Analytics), {
  loading: () => null,
})

export function ConsentedAnalytics() {
  const { has } = useConsentManager()

  if (!has('measurement')) return null

  return <Analytics />
}
