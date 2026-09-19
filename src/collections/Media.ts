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
  upload: {
    // The crosshair is off by default on a collection with no image sizes, and without it
    // an editor has no way to say which part of a tall photo survives the 2:1 hero crop.
    focalPoint: true,
    // A 30 MP phone or camera original is never worth storing: the lightbox is the widest
    // thing that reads one, and it stops gaining at 2560.
    resizeOptions: { width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true },
    // Payload runs every upload through sharp whether or not this is set, and sharp's own
    // default is quality 80 — measurably worse than what the files arrive as. Setting it is
    // the only way to choose the number rather than inherit it.
    formatOptions: { format: 'webp', options: { quality: 90, effort: 6 } },
  },
}
