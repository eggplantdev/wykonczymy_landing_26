import type { ScopeItemT, SpecItemT } from '@/lib/content/spec-item'
import type { ScopeIconKeyT } from '@/lib/scope-icons'

// Payload gives array rows a string id; the components key on a number, and the row's
// position is the only stable ordering the CMS exposes anyway.
export type SpecRowT = { name: string; value: string }
export type ScopeRowT = { name: string; icon?: ScopeIconKeyT | null }

export const toSpecs = (rows: SpecRowT[] | null | undefined): SpecItemT[] =>
  (rows ?? []).map((row, index) => ({
    id: index + 1,
    name: row.name,
    value: row.value,
  }))

export const toScope = (rows: ScopeRowT[] | null | undefined): ScopeItemT[] =>
  (rows ?? []).map((row, index) => ({
    id: index + 1,
    name: row.name,
    icon: row.icon,
  }))
