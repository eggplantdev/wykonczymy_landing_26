import type { GlobalConfig } from 'payload'

import { revalidateAllPages } from '@/collections/hooks/revalidatePage'

// The contact block and quote form that close every page — one document, no address of
// its own, so a global rather than a collection.
export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateAllPages()
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'intro', type: 'textarea', localized: true, required: true },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'role', type: 'text', localized: true, required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'mail', type: 'email', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
}
