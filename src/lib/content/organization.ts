import { cache } from 'react'

import type { PostalAddressT } from '@/lib/contact/postal-address'
import type { Locale } from '@/lib/i18n/i18n'
import { findContactDetails } from './contact'
import { findFooter } from './footer'

export type OrganizationT = {
  telephone?: string
  email?: string
  address: PostalAddressT
  vatID?: string
}

// The business identity is split across two documents — phone and mail on the footer global,
// address and NIP on the contact page — and that is CMS-shaped knowledge, not something a route
// shell should be assembling out of four props. Both finders are request-cached and the layout
// already reads both, so this costs no extra query.
export const findOrganization = cache(async (locale: Locale): Promise<OrganizationT> => {
  const [footer, contact] = await Promise.all([findFooter(locale), findContactDetails(locale)])

  return {
    telephone: footer.phone,
    email: footer.mail,
    address: contact.address,
    vatID: contact.nip,
  }
})
