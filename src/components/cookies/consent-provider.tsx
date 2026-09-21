'use client'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import {
  ConsentManagerProvider,
  policyPackPresets,
  type ConsentManagerOptions,
} from '@c15t/nextjs/headless'

import { CONSENT_CATEGORIES } from './consent-categories'
import { CookieBanner } from './cookie-banner'
import { CookiePreferences } from './cookie-preferences'

// The answer lives in the browser, so the server always renders "not consented" and a client that
// said yes renders the beacon — a mismatch React answers by discarding the whole tree. `ssr: false`
// leaves the server nothing to disagree with; the gate then only ever runs on the client.
const ConsentedAnalytics = dynamic(
  () => import('./consented-analytics').then((module) => module.ConsentedAnalytics),
  { ssr: false, loading: () => null },
)

// c15t forwards store options it does not re-declare on its React-facing type.
type OptionsT = ConsentManagerOptions & {
  iframeBlockerConfig: { disableAutomaticBlocking: boolean }
}

// Module scope because c15t rebuilds its whole store when the options identity changes,
// which would leave the footer trigger talking to a different store than the dialog.
//
// The country is pinned rather than resolved: the audience is Polish, so everyone gets
// the European opt-in pack.
//
// No `storageConfig.defaultExpiryDays`: c15t keeps a second copy in localStorage that never
// expires and overwrites the cookie on load, so no value there can produce a periodic re-ask.
//
// `colorScheme` and the iframe blocker are both pinned so c15t's defaults don't install
// permanent MutationObservers on <html> and <body>. Pinning it light costs nothing visible:
// the setting only toggles a `c15t-dark` class that styles c15t's own components, and every
// import here is from `@c15t/nextjs/headless` — the banner and the preferences dialog are
// built from this site's own tokens, which already follow `data-theme`.
const OPTIONS: OptionsT = {
  mode: 'offline',
  consentCategories: CONSENT_CATEGORIES.map(({ id }) => id),
  offlinePolicy: { policyPacks: [policyPackPresets.europeOptIn()] },
  overrides: { country: 'PL' },
  colorScheme: 'light',
  iframeBlockerConfig: { disableAutomaticBlocking: true },
}

type PropsT = {
  privacyPolicyHref?: string
  children: ReactNode
}

export function ConsentProvider({ privacyPolicyHref, children }: PropsT) {
  return (
    <ConsentManagerProvider options={OPTIONS}>
      <ConsentedAnalytics />
      {children}
      <CookieBanner privacyPolicyHref={privacyPolicyHref} />
      <CookiePreferences />
    </ConsentManagerProvider>
  )
}
