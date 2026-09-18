import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  // The crosshair is off by default on a collection with no image sizes, and without it
  // an editor has no way to say which part of a tall photo survives the 2:1 hero crop.
  upload: { focalPoint: true },
}
