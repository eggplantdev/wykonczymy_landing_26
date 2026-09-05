import { twMerge } from 'tailwind-merge'

import type { SpecItemT } from '@/components/ui/spec-item'

type PropsT = {
  items: SpecItemT[]
  className?: string
}

// Compact key-over-value facts, as on a carousel slide. The bordered two-column reading
// of the same data is SpecTable.
export function SpecStrip({ items, className }: PropsT) {
  return (
    <ul
      className={twMerge('grid w-fit grid-cols-2 gap-x-10 gap-y-3 lg:flex lg:gap-x-4', className)}
    >
      {items.map((item) => (
        <li key={item.id} className="text-10 md:text-12 grid gap-y-2">
          <span className="text-grau_200 inline-block capitalize">{item.name}</span>
          <span>{item.value}</span>
        </li>
      ))}
    </ul>
  )
}
