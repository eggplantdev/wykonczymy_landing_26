import type { SpecItemT } from '@/components/ui/spec-item'

// Payload gives array rows a string id; the components key on a number, and the row's
// position is the only stable ordering the CMS exposes anyway.
type SpecRowT = { name: string; value: string }

export const toSpecs = (rows: SpecRowT[] | null | undefined): SpecItemT[] =>
  (rows ?? []).map((row, index) => ({ id: index + 1, name: row.name, value: row.value }))
