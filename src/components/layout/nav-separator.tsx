import { twMerge } from 'tailwind-merge'

type PropsT = {
  className?: string
}

// fest's Separator, as an <li> because a nav group is a list and a bare <div> between
// items would make the list invalid. Decorative only — the hairline says nothing a
// screen reader needs, the list structure already separates the items.
export function NavSeparator({ className }: PropsT) {
  return (
    <li
      aria-hidden="true"
      className={twMerge('bg-grau_700 my-auto h-5 w-px shrink-0', className)}
    />
  )
}
