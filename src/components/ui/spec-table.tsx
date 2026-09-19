import type { SpecItemT } from '@/components/ui/spec-item'
import { cn } from '@/lib/cn'

type PropsT = {
  items: SpecItemT[]
  /** Drops the value column, leaving the names as a plain ruled list. */
  namesOnly?: boolean
  className?: string
}

export function SpecTable({ items, namesOnly, className }: PropsT) {
  return (
    <ul className={cn('grid gap-x-5', className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className={cn(
            'border-border text-12 grid min-h-10 grid-cols-2 items-center gap-x-5 border-b py-2',
            namesOnly && 'grid-cols-1',
          )}
        >
          <span className={cn(!namesOnly && 'text-subtle-foreground font-medium')}>
            {item.name}
          </span>
          {!namesOnly && <span>{item.value}</span>}
        </li>
      ))}
    </ul>
  )
}
