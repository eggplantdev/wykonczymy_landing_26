import type { CollectionConfig } from 'payload'

import { publishedOnly } from './access/published-only'
import { slugField } from './fields/slug'
import { revalidatePage, revalidatePageDelete } from './hooks/revalidatePage'

// An interior style article, addressable under the Style wnętrz page as `<basePath><slug>/`.
export const InteriorStyles: CollectionConfig = {
  slug: 'interior-styles',
  access: { read: publishedOnly },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    group: 'Content',
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageDelete],
  },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    slugField('The address segment under the Style wnętrz page, without slashes.'),
    {
      name: 'text',
      type: 'textarea',
      localized: true,
      required: true,
      admin: { description: 'Card blurb. The style’s own page opens with the same sentence.' },
    },
    {
      name: 'body',
      type: 'array',
      localized: true,
      admin: {
        description: 'One row per paragraph. The article breaks in half around the middle image.',
      },
      fields: [{ name: 'paragraph', type: 'textarea', required: true }],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'contentImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Sits between the two halves of the article.' },
    },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
  ],
}
