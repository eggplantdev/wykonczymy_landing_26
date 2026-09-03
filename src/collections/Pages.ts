import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import {
  capturePagePathsBeforeChange,
  capturePagePathsBeforeDelete,
  revalidatePage,
  revalidatePageDelete,
} from './hooks/revalidatePage'

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
    // Payload mounts a public REST/GraphQL surface, and `drafts: true` makes an
    // unpublished version readable through it. Anonymous callers get published rows
    // only; the filter has to live here, not just in the route's query.
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'pageType', 'isHome'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeChange: [capturePagePathsBeforeChange],
    beforeDelete: [capturePagePathsBeforeDelete],
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageDelete],
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        if (!data?.isHome) return data

        // Two home pages make `/` ambiguous and the resolver would pick arbitrarily.
        // Excluded in the query rather than filtered afterwards: a `limit` that
        // happened to return only this document would hide a real duplicate.
        const existing = await req.payload.find({
          collection: 'pages',
          where: {
            isHome: { equals: true },
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
    {
      name: 'slug',
      type: 'text',
      localized: true,
      required: true,
      index: true,
      // Free text here becomes a URL. A slug with a space or a slash builds an href
      // that cannot be resolved back to the document.
      validate: (value: string | null | undefined) =>
        typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? true
          : 'Use lowercase letters, digits and single hyphens only (e.g. "price-list").',
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
