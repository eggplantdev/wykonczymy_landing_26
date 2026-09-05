import type { Field } from 'payload'

// A labelled fact — `Rewiring / Full house, new consumer unit`. Localized on the array
// rather than on the two text fields: PL and EN can list a different number of rows.
export const specListField = (name: string, description: string): Field => ({
  name,
  type: 'array',
  localized: true,
  admin: { description, initCollapsed: true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'value', type: 'text', required: true },
  ],
})
