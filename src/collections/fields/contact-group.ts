import type { Field } from 'payload'

import { CONTACT_PAGE_TYPE } from '@/lib/routing'

// The Kontakt page carries no sections of its own — the contact form is in the footer of
// every page. All it adds is the company's postal details, which the footer never shows.
export const contactGroup: Field = {
  name: 'contact',
  type: 'group',
  label: 'Contact page',
  admin: { condition: (data) => data?.pageType === CONTACT_PAGE_TYPE },
  fields: [
    {
      name: 'address',
      type: 'text',
      localized: true,
      admin: { description: 'One line, as it should read. Links to a Google Maps search for it.' },
    },
    {
      name: 'nip',
      type: 'text',
      admin: { description: 'Tax id. Digits only — the label is added by the page.' },
    },
  ],
}
