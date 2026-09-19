import type { SpecItemT } from '@/lib/content/spec-item'
import { cn } from '@/lib/cn'

type PropsT = {
  items: SpecItemT[]
  className?: string
}

// Compact key-over-value facts, as on a carousel slide. The bordered two-column reading
// of the same data is SpecTable.
export function SpecStrip({ items, className }: PropsT) {
  return (
    // From `lg` the facts share the row evenly instead of each taking the width of its own
    // text, which left a long address next to a two-word label and no alignment between them.
    // Implicit columns rather than a fixed count, so the strip does not care how many facts
    // a call site hands it.
    <ul
      className={cn(
        'grid w-fit grid-cols-2 gap-x-10 gap-y-3 lg:w-full lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none lg:gap-x-4',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.id} className="text-10 md:text-12 grid gap-y-2">
          <span className="text-subtle-foreground inline-block capitalize">{item.name}</span>
          <span>{item.value}</span>
        </li>
      ))}
    </ul>
  )
}
