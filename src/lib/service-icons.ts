/**
 * The closed set of drawings a services card can carry. Shared by the Payload select and the
 * component that resolves a key to a glyph, so the admin can never offer an option the code has
 * no icon for. Options name the drawing, not the service: an editor adding a thirteenth service
 * is choosing a picture, and "Trowel" says what they will get where "Plaster" does not.
 */
export const SERVICE_ICONS = [
  { value: 'hammer', label: 'Hammer' },
  { value: 'arrow-up-right-dots', label: 'Rising arrow' },
  { value: 'paint-roller', label: 'Paint roller' },
  { value: 'screwdriver-wrench', label: 'Screwdriver and wrench' },
  { value: 'lightbulb', label: 'Lightbulb' },
  { value: 'faucet-drip', label: 'Dripping faucet' },
  { value: 'fan', label: 'Fan' },
  { value: 'ruler-combined', label: 'Ruler' },
  { value: 'door-open', label: 'Open door' },
  { value: 'house-chimney', label: 'House' },
  { value: 'brush', label: 'Brush' },
  { value: 'compass-drafting', label: 'Drafting compass' },
] as const

export type ServiceIconKeyT = (typeof SERVICE_ICONS)[number]['value']

/**
 * What the twelve seeded cards start out with, in row order. The seed writes these once; from
 * then on the field is the editor's, so this list is a starting point rather than the mapping.
 */
export const SEEDED_SERVICE_ICONS: readonly ServiceIconKeyT[] = SERVICE_ICONS.map(
  (icon) => icon.value,
)
