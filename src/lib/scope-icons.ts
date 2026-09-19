/**
 * The closed set of drawings a scope row can carry. Shared by the Payload select and the
 * component that resolves a key to a glyph, so the admin can never offer an option the code has
 * no icon for. Options name the drawing, not the trade: an editor adding a row is choosing a
 * picture, and "Trowel and bricks" says what they will get where "Plastering" does not.
 */
export const SCOPE_ICONS = [
  { value: 'check', label: 'Tick' },
  { value: 'bolt', label: 'Lightning bolt' },
  { value: 'fire', label: 'Flame' },
  { value: 'faucet', label: 'Faucet' },
  { value: 'sink', label: 'Sink' },
  { value: 'bath', label: 'Bathtub' },
  { value: 'shower', label: 'Shower' },
  { value: 'layer-group', label: 'Stacked layers' },
  { value: 'table-cells-large', label: 'Tiled grid' },
  { value: 'grip-lines', label: 'Horizontal lines' },
  { value: 'trowel-bricks', label: 'Trowel and bricks' },
  { value: 'paint-roller', label: 'Paint roller' },
  { value: 'brush', label: 'Brush' },
  { value: 'kitchen-set', label: 'Kitchen set' },
  { value: 'door-open', label: 'Open door' },
  { value: 'window-maximize', label: 'Window' },
  { value: 'lightbulb', label: 'Lightbulb' },
  { value: 'fan', label: 'Fan' },
  { value: 'hammer', label: 'Hammer' },
  { value: 'screwdriver-wrench', label: 'Screwdriver and wrench' },
  { value: 'ruler-combined', label: 'Ruler' },
] as const

export type ScopeIconKeyT = (typeof SCOPE_ICONS)[number]['value']

/** What a row falls back to when an editor clears the select. */
export const DEFAULT_SCOPE_ICON: ScopeIconKeyT = 'check'
