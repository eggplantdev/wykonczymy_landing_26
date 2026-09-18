import type { CollectionConfig } from 'payload'

import { publishedOnly } from './access/published-only'
import { slugField } from './fields/slug'
import { specListField } from './fields/spec-list'
import { revalidatePage, revalidatePageDelete } from './hooks/revalidatePage'

// A completed job, addressable under the Realizacje page as `<basePath><slug>/`.
export const Projects: CollectionConfig = {
  slug: 'projects',
  access: { read: publishedOnly },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'address'],
    group: 'Content',
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageDelete],
  },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    slugField('The address segment under the Realizacje page, without slashes.'),
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      required: true,
      admin: { description: 'One sentence. Doubles as the hero lead and the card blurb.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'area', type: 'text', localized: true, admin: { width: '33%' } },
        { name: 'duration', type: 'text', localized: true, admin: { width: '33%' } },
        { name: 'address', type: 'text', localized: true, admin: { width: '33%' } },
      ],
    },
    { name: 'description', type: 'textarea', localized: true },
    specListField('scope', 'The work carried out, one row per trade.'),
    specListField('materials', 'Materials and finishes, one row per category.'),
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description:
          'The first photo is the card and hero shot; drag a different one to the top to change it.',
      },
    },
  ],
}
