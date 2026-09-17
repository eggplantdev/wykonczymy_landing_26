import type { GlobalConfig } from 'payload'

import { RATING_PLATFORMS } from '@/lib/ratings'
import { revalidateAllPages } from '@/lib/revalidate'

// The contact block and form that close every page — one document, no address of
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
    {
      name: 'ratings',
      type: 'array',
      label: 'Rating badges',
      admin: {
        initCollapsed: true,
        description:
          'Typed in by hand: Fixly publishes no API, and Google licenses its rating per page view under terms that forbid storing it.',
      },
      fields: [
        { name: 'platform', type: 'select', options: [...RATING_PLATFORMS], required: true },
        { name: 'rating', type: 'number', required: true, min: 0, max: 5 },
        { name: 'reviewCount', type: 'number' },
        { name: 'profileUrl', type: 'text', label: 'Link to the reviews' },
      ],
    },
  ],
}
