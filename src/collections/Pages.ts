import type { CollectionConfig } from 'payload'

import { revalidatePage, revalidatePageDelete } from './hooks/revalidatePage'

// The six pages of the live site. A page's type selects which conditional field
// group the admin sees; the groups arrive with the slices that render them.
export const pageTypes = [
  'home',
  'offer',
  'completed-works',
  'interior-styles',
  'contact',
  'price-list',
] as const

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'pageType', 'isHome'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageDelete],
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        if (!data?.isHome) return data

        // Two home pages make `/` ambiguous and the resolver would pick arbitrarily.
        const existing = await req.payload.find({
          collection: 'pages',
          where: { isHome: { equals: true } },
          limit: 1,
          depth: 0,
          req,
        })

        const other = existing.docs.find((doc) => doc.id !== originalDoc?.id)
        if (other) {
          throw new Error(
            `Another page is already the home page ("${other.title}"). Unset it there first.`,
          )
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      required: true,
      index: true,
      admin: {
        description:
          'The address segment, without slashes. Indexed by Google — see context/foundation/url-map.md before changing one.',
      },
    },
    {
      name: 'isHome',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Serves at / in Polish. Only one page may carry this.',
      },
    },
    {
      name: 'pageType',
      type: 'select',
      required: true,
      options: [...pageTypes],
    },
  ],
}
