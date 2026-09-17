import type { LocalizedT } from '../types'

type ContactCopyT = { address: string }

// The Kontakt page's only own content. Phone and mail are not repeated here — they live
// on the footer global, which the page reads, so there is one number to change.
//
// `nip` is deliberately unseeded: the live site publishes no tax id, so there is nothing
// to carry across. Fill it in the admin and the page starts showing it.
export const contactCopy: LocalizedT<ContactCopyT> = {
  // The street name is not translated — it is what a delivery or a map lookup needs.
  pl: { address: 'ul. Terespolska 2, Warszawa 03-813' },
  en: { address: 'ul. Terespolska 2, 03-813 Warsaw' },
}
