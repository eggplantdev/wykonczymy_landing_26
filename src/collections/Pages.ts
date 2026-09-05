import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { HOME_PAGE_TYPE, pageTypes } from '@/lib/routing'
import { publishedOnly } from './access/published-only'
import { homeGroup } from './fields/home-group'
import { slugField } from './fields/slug'
import { revalidatePage, revalidatePageDelete } from './hooks/revalidatePage'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: { read: publishedOnly },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'pageType'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageDelete],
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        if (data?.pageType !== HOME_PAGE_TYPE) return data

        // Two home pages make `/` ambiguous and the resolver would pick arbitrarily.
        // Excluded in the query rather than filtered afterwards: a `limit` that
        // happened to return only this document would hide a real duplicate.
        const existing = await req.payload.find({
          collection: 'pages',
          where: {
            pageType: { equals: HOME_PAGE_TYPE },
            ...(originalDoc?.id ? { id: { not_equals: originalDoc.id } } : {}),
          },
          limit: 1,
          depth: 0,
          draft: true,
          req,
        })

        const other = existing.docs[0]
        if (other) {
          throw new APIError(
            `Another page is already the home page ("${other.title}"). Unset it there first.`,
            400,
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
    slugField(
      'The address segment, without slashes. Indexed by Google — see context/foundation/url-map.md before changing one.',
    ),
    {
      name: 'pageType',
      type: 'select',
      required: true,
      options: [...pageTypes],
      admin: {
        description: 'Selects the page\u2019s field group. The "home" page also serves at /.',
      },
    },
    homeGroup,
  ],
}
