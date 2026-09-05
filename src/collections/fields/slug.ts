import type { Field } from 'payload'

// Free text here becomes a URL. A slug with a space or a slash builds an href that
// cannot be resolved back to the document.
export const slugField = (description: string): Field => ({
  name: 'slug',
  type: 'text',
  localized: true,
  required: true,
  index: true,
  // Two documents sharing a slug make one address that resolves to whichever the query
  // returns first, so the loser silently disappears from the site.
  unique: true,
  validate: (value: string | null | undefined) =>
    typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
      ? true
      : 'Use lowercase letters, digits and single hyphens only (e.g. "price-list").',
  admin: { description },
})
