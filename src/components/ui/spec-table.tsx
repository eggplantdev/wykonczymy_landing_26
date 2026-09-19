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
          className="border-border text-12 grid min-h-10 grid-cols-2 items-center gap-x-5 border-b py-2"
        >
          <span className="text-subtle-foreground font-medium">{item.name}</span>
          <span>{item.value}</span>
        </li>
      ))}
    </ul>
  )
}
