import { cache } from 'react'

import type { Locale } from '@/lib/i18n/i18n'
import { CONTACT_PAGE_TYPE } from '@/lib/routing'
import { findPublishedPages } from './pages'

export type ContactDetailsT = { address?: string; nip?: string }

// Off the cached published-pages list rather than a query of its own — the layout already pays
// for that read, and the contact group is plain text, so its `depth: 0` loses nothing here.
export const findContactDetails = cache(async (locale: Locale): Promise<ContactDetailsT> => {
  const page = (await findPublishedPages(locale)).find((doc) => doc.pageType === CONTACT_PAGE_TYPE)

  return {
    address: page?.contact?.address ?? undefined,
    nip: page?.contact?.nip ?? undefined,
  }
})
