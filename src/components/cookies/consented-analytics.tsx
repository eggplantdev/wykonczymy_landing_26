'use client'

import dynamic from 'next/dynamic'
import { useConsentManager } from '@c15t/nextjs/headless'

// A static import would put the beacon in the chunk every page downloads, including for
// the visitors who said no.
const Analytics = dynamic(() => import('@vercel/analytics/next').then((m) => m.Analytics))

export function ConsentedAnalytics() {
  const { has } = useConsentManager()

  if (!has('measurement')) return null

  return <Analytics />
}
