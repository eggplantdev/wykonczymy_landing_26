import type { Locale } from '@/lib/i18n/i18n'

export type PostalAddressT = {
  street?: string
  locality?: string
  postalCode?: string
  country?: string
}

// Where the postcode sits relative to the town is a language convention, not data: Polish
// writes "Warszawa 03-813", English "03-813 Warsaw". Holding the parts and joining them here
// is what lets one stored address read correctly in both, and is why the CMS has no
// finished-line field to drift out of step with these.
const LOCALITY_LINE: Record<Locale, (locality: string, postalCode: string) => string> = {
  pl: (locality, postalCode) => `${locality} ${postalCode}`,
  en: (locality, postalCode) => `${postalCode} ${locality}`,
}

// Every part is optional in the CMS, so each join has to survive the piece next to it being
// absent — an address mid-entry renders short rather than with a stray comma or a gap.
export function formatPostalAddress(address: PostalAddressT, locale: Locale): string | undefined {
  const { street, locality, postalCode } = address

  const secondLine =
    locality && postalCode ? LOCALITY_LINE[locale](locality, postalCode) : (locality ?? postalCode)

  return [street, secondLine].filter(Boolean).join(', ') || undefined
}
