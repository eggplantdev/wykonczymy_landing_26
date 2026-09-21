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
    <Tag className={cn('mb-6 text-20 md:mb-9 md:text-22 lg:mb-12 lg:text-28', className)}>
      {title}
    </Tag>
  )
}
