import type { Field } from 'payload'

import { PRIVACY_POLICY_PAGE_TYPE } from '@/lib/routing'

// The privacy policy is a title and one run of prose. It keeps the neutral `legal` name
// because it is the category, not the page — a second such page would share the group.
export const legalGroup: Field = {
  name: 'legal',
  type: 'group',
  label: 'Legal page',
  admin: { condition: (data) => data?.pageType === PRIVACY_POLICY_PAGE_TYPE },
  fields: [
    {
      name: 'body',
      type: 'richText',
      localized: true,
      admin: { description: 'The full text. Headings and lists are yours to use.' },
    },
  ],
}
