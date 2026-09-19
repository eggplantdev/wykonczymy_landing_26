import type { ScopeItemT } from '@/lib/content/spec-item'
import { ScopeIcon } from './scope-icon'

type PropsT = {
  items: ScopeItemT[]
}

// The names alone, each under its own mark. `SpecTable` reads the same rows as a ruled
// two-column table; this is the scope list's own shape and shares nothing with it but the data.
export function ScopeList({ items }: PropsT) {
  return (
    // The top padding meets the ruled table alongside: it centres its first name in a 40px
    // row, so the list has to start a line-box's worth lower to line up with it.
    <ul className="grid gap-y-3 pt-3">
      {items.map((item) => (
        <li key={item.id} className="text-12 flex items-center gap-x-3">
          {/* The marks have different viewBoxes, so an unsized glyph both steps the names
              in and out and changes the row's height. */}
          <ScopeIcon icon={item.icon} className="text-foreground size-4 shrink-0" />
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  )
}
