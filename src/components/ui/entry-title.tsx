import { cn } from '@/lib/cn'

type PropsT = {
  title: string
  // A listing row is a section of the page it sits on; a carousel slide sits under the
  // carousel's own heading.
  level?: 'h2' | 'h3'
  className?: string
}

export function EntryTitle({ title, level = 'h2', className }: PropsT) {
  const Tag = level

  return (
    <Tag className={cn('text-20 md:text-22 lg:text-28 mb-6 md:mb-9 lg:mb-12', className)}>
      {title}
    </Tag>
  )
}
