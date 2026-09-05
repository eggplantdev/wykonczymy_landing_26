import { twMerge } from 'tailwind-merge'

import type { SpecItemT } from '@/components/ui/spec-item'

type PropsT = {
  items: SpecItemT[]
  /** Drops the value column, leaving the names as a plain ruled list. */
  namesOnly?: boolean
  className?: string
}

export function SpecTable({ items, namesOnly, className }: PropsT) {
  return (
    <ul className={twMerge('grid gap-x-5', className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className={twMerge(
            'border-grau_300 text-12 grid min-h-10 grid-cols-2 items-center gap-x-5 border-b py-2',
            namesOnly && 'grid-cols-1',
          )}
        >
          <span className={twMerge(!namesOnly && 'text-grau_200 font-medium')}>{item.name}</span>
          {!namesOnly && <span>{item.value}</span>}
        </li>
      ))}
    </ul>
  )
}
