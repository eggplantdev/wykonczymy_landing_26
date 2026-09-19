import type { ScopeIconKeyT } from '@/lib/scope-icons'

/** A labelled fact — the spec rows and the carousel's detail strip both read one. */
export type SpecItemT = {
  id: number
  name: string
  value: string
}

/** A named piece of work under its mark. The scope list renders nothing else about it. */
export type ScopeItemT = {
  id: number
  name: string
  icon?: ScopeIconKeyT | null
}
