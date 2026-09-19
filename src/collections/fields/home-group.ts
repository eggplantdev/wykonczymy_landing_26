import type { Field } from 'payload'

import { HOME_PAGE_TYPE, pageTypes } from '@/lib/routing'
import { SERVICE_ICONS } from '@/lib/service-icons'

// Copy links to a *page*, not to a string: PL and EN slugs differ, so an href written
// into a field is right in at most one locale. There is one page per type, so the type
// is the whole address.
const ctaFields = (): Field[] => [
  { name: 'ctaLabel', type: 'text', localized: true },
  {
    name: 'ctaLink',
    type: 'select',
    options: [...pageTypes],
    admin: { description: 'The page the button opens, in whichever language is being read.' },
  },
]

// A standalone paragraph between two sections. `position` is which half of the grid it hangs
// off — the width is fixed, so left and right are the only choices there are.
const textSectionFields = (): Field[] => [
  { name: 'text', type: 'textarea', localized: true },
  {
    name: 'position',
    type: 'select',
    defaultValue: 'left',
    options: ['left', 'right'],
  },
]

const mediaFields = (): Field[] => [
  { name: 'image', type: 'upload', relationTo: 'media' },
  {
    name: 'video',
    type: 'upload',
    relationTo: 'media',
    admin: { description: 'Plays over the image when set.' },
  },
]

// The home page's sections. Their order and the rhythm between them are layout, owned by
// HomePage — an editor fills each section in, never rearranges them.
export const homeGroup: Field = {
  name: 'home',
  type: 'group',
  label: 'Home page',
  admin: { condition: (data) => data?.pageType === HOME_PAGE_TYPE },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        // Textarea, not text: the title is two lines and where it breaks is editorial —
        // a width that happens to wrap it would re-break itself on the next copy change.
        { name: 'title', type: 'textarea', localized: true },
        ...mediaFields(),
        ...ctaFields(),
      ],
    },
    {
      name: 'intro',
      type: 'group',
      label: 'Text above the services carousel',
      fields: textSectionFields(),
    },
    {
      name: 'services',
      type: 'group',
      fields: [
        { name: 'sectionTitle', type: 'text', localized: true },
        {
          // Not localized: one row set with shared photos, translated field by field. The
          // seed has to carry the existing row ids or a re-run replaces the rows.
          name: 'cards',
          type: 'array',
          admin: { initCollapsed: true },
          fields: [
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'text', type: 'textarea', localized: true },
            // The card draws an icon rather than a photo. Not localized: one drawing stands
            // for the service in both languages.
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [...SERVICE_ICONS],
              admin: { description: 'The drawing above the title.' },
            },
          ],
        },
      ],
    },
    {
      name: 'afterServices',
      type: 'group',
      label: 'Text under the services carousel',
      fields: textSectionFields(),
    },
    {
      name: 'projects',
      type: 'group',
      label: 'Projects carousel',
      admin: { description: 'Teases every published project — the slides are not curated here.' },
      fields: [{ name: 'sectionTitle', type: 'text', localized: true }, ...ctaFields()],
    },
    {
      name: 'numbers',
      type: 'group',
      fields: [
        { name: 'sectionTitle', type: 'text', localized: true },
        {
          name: 'cards',
          type: 'array',
          admin: { initCollapsed: true },
          fields: [
            // Text, not number: a figure is sometimes written rather than counted —
            // "24/7", "od 16" — and the card only ever prints it.
            { name: 'value', type: 'text', required: true },
            { name: 'unit', type: 'text', localized: true },
            { name: 'description', type: 'text', localized: true },
          ],
        },
      ],
    },
    {
      name: 'testimonials',
      type: 'group',
      label: 'Client testimonials',
      fields: [
        { name: 'sectionTitle', type: 'text', localized: true },
        {
          // Same shape as `services.cards`: one non-localized row set, translated field by
          // field, so the seed has to carry the existing row ids or a re-run replaces them.
          name: 'quotes',
          type: 'array',
          admin: { initCollapsed: true },
          fields: [
            { name: 'quote', type: 'richText', localized: true, required: true },
            // A name reads the same in both languages; what the person is described as
            // ("Mieszkanie na Mokotowie") does not.
            { name: 'name', type: 'text', required: true },
            { name: 'role', type: 'text', localized: true },
          ],
        },
      ],
    },
    {
      name: 'interiorStyles',
      type: 'group',
      label: 'Interior styles carousel',
      admin: {
        description: 'Teases every published interior style — the slides are not curated here.',
      },
      fields: [{ name: 'sectionTitle', type: 'text', localized: true }, ...ctaFields()],
    },
  ],
}
