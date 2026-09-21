import { cache } from 'react'

import type { PostalAddressT } from '@/lib/contact/postal-address'
import type { Locale } from '@/lib/i18n/i18n'
import { CONTACT_PAGE_TYPE } from '@/lib/routing'
import { findPublishedPages } from './pages'

export type ContactDetailsT = { address: PostalAddressT; nip?: string }

// Off the cached published-pages list rather than a query of its own — the layout already pays
// for that read, and the contact group is plain text, so its `depth: 0` loses nothing here.
export const findContactDetails = cache(async (locale: Locale): Promise<ContactDetailsT> => {
  const page = (await findPublishedPages(locale)).find((doc) => doc.pageType === CONTACT_PAGE_TYPE)
  const address = page?.contact?.address

  return {
    address: {
      street: address?.street ?? undefined,
      locality: address?.locality ?? undefined,
      postalCode: address?.postalCode ?? undefined,
      country: address?.country ?? undefined,
    },
    nip: page?.contact?.nip ?? undefined,
  }
})
