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
// the European opt-in pack.
//
// There is deliberately no `storageConfig.defaultExpiryDays`. It only shortens the cookie,
// and c15t keeps a second copy in localStorage that never expires and is written back over
// the cookie on load — so no value here can produce a periodic re-ask, and setting one just
// implies an expiry the visitor never experiences. Consent is asked once; the footer's
// cookie settings is how it gets changed.
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
