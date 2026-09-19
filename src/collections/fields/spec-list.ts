import type { Field } from 'payload'

import { SCOPE_ICONS, DEFAULT_SCOPE_ICON } from '@/lib/scope-icons'

type OptionsT = {
  /** Trades the value column for an icon select — the only two shapes a project's lists come in. */
  withIcon?: boolean
}

const nameField: Field = { name: 'name', type: 'text', required: true }

const valueField: Field = { name: 'value', type: 'text', required: true }

const iconField: Field = {
  name: 'icon',
  type: 'select',
  options: [...SCOPE_ICONS],
  defaultValue: DEFAULT_SCOPE_ICON,
  admin: { description: 'The mark shown beside the name.' },
}

// Localized on the array rather than on its fields: PL and EN can list a different number of rows.
export const specListField = (
  name: string,
  description: string,
  { withIcon }: OptionsT = {},
): Field => ({
  name,
  type: 'array',
  localized: true,
  admin: { description, initCollapsed: true },
  fields: [nameField, withIcon ? iconField : valueField],
})
