'use client'

import type { ReactNode } from 'react'
import {
  ConsentManagerProvider,
  policyPackPresets,
  type ConsentManagerOptions,
} from '@c15t/nextjs/headless'

import { CONSENT_CATEGORIES } from './consent-categories'
import { ConsentedAnalytics } from './consented-analytics'
import { CookieBanner } from './cookie-banner'
import { CookiePreferences } from './cookie-preferences'

// c15t forwards store options it does not re-declare on its React-facing type.
type OptionsT = ConsentManagerOptions & {
  iframeBlockerConfig: { disableAutomaticBlocking: boolean }
}

// Module scope because c15t rebuilds its whole store when the options identity changes,
// which would leave the footer trigger talking to a different store than the dialog.
//
// The country is pinned rather than resolved: the audience is Polish, so everyone gets
// the European opt-in pack. The expiry only shortens the cookie — c15t keeps a second
// copy in localStorage, which never expires and is written back over the cookie, so this
// is not a periodic re-ask.
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
  storageConfig: { defaultExpiryDays: 180 },
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
