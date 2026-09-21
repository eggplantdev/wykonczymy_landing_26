import type { SpecItemT } from '@/lib/content/spec-item'
import { cn } from '@/lib/cn'

type PropsT = {
  items: SpecItemT[]
  className?: string
}

export function SpecTable({ items, className }: PropsT) {
  return (
    <ul className={cn('grid gap-x-5', className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className="grid min-h-10 grid-cols-2 items-center gap-x-5 border-b border-border py-2 text-14"
        >
          <span className="font-medium text-subtle-foreground">{item.name}</span>
          <span>{item.value}</span>
        </li>
      ))}
    </ul>
  )
}
