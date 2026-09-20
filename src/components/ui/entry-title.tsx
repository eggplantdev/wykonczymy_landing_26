import { cn } from '@/lib/cn'

type PropsT = {
  title: string
  // A listing row is a section of the page it sits on; a carousel slide sits under the
  // carousel's own heading.
  level?: 'h2' | 'h3'
  className?: string
}

// `font-display` is named here rather than inherited: the base rule in styles.css hands the
// title face to `h1` and `h2` only, so the `h3` form would otherwise come out in body type.
export function EntryTitle({ title, level = 'h2', className }: PropsT) {
  const Tag = level

  return (
    <Tag
      className={cn('font-display text-20 md:text-22 lg:text-28 mb-6 md:mb-9 lg:mb-12', className)}
    >
      {title}
    </Tag>
  )
}
