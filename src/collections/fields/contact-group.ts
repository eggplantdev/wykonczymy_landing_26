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
      type: 'group',
      label: 'Address',
      admin: {
        description:
          'The parts, not a finished line. The page joins them in the order that locale reads in — Polish puts the town before the postcode, English after it.',
      },
      fields: [
        {
          name: 'street',
          type: 'text',
          localized: true,
          admin: { description: 'Street and number, e.g. "ul. Terespolska 2".' },
        },
        {
          name: 'locality',
          type: 'text',
          localized: true,
          admin: { description: 'Town. Translated — "Warszawa" reads as "Warsaw" in English.' },
        },
        // Neither a postcode nor a country code is language, so both sit outside the locale
        // tables — the same reason `nip` below does.
        {
          name: 'postalCode',
          type: 'text',
          admin: { description: 'e.g. "03-813".' },
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'PL',
          admin: { description: 'Two-letter ISO code. Machine-read only; never shown.' },
        },
      ],
    },
    {
      name: 'nip',
      type: 'text',
      admin: { description: 'Tax id. Digits only — the label is added by the page.' },
    },
  ],
}
