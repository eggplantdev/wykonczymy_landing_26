import { cn } from '@/lib/cn'

type PropsT = {
  title?: string
  className?: string
}

export function SectionTitle({ title, className }: PropsT) {
  // An absent title is an empty section heading in the page outline, not an empty box.
  if (!title) return null

  return (
    <h2 className={cn('text-22 font-bold text-balance md:text-28 lg:text-36', className)}>
      {title}
    </h2>
  )
}
