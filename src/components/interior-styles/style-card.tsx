import Link from 'next/link'

import { StyleCardBody } from './style-card-body'
import { cn } from '@/lib/cn'
import type { InteriorStyleT } from '@/lib/content/interior-styles'

type PropsT = {
  style: InteriorStyleT
  href: string
  index: number
}

export function StyleCard({ style, href, index }: PropsT) {
  const isLastInRow = (index + 1) % 3 === 0
  // The two-column rule used to be `md:even:border-l`, but the entrance wrapper the listing puts
  // around each card makes this link an only child, so `:nth-child(even)` never matches again.
  // `index` already drives the three-column rule next to it and does not care what nests the card.
  const isSecondInPair = index % 2 === 1

  return (
    <Link
      href={href}
      // `block`: as a grid item the link was blockified for free; inside the wrapper it is an
      // ordinary inline box, and the padding and borders below would hang off a line of text.
      // `md:pb-6` closes the box the hover fill paints, which had no bottom padding and so ended
      // flush with the photo. It stays behind `md` because Tailwind gates `hover:` behind
      // `@media (hover: hover)` — a touch device never paints the fill, so padding for it there is
      // layout nobody sees. `surface` is the pair that tracks the opposite of the page, so this
      // inverts in the dark theme instead of going black on a black page.
      className={cn(
        'group border-border hover:bg-surface hover:text-surface-foreground relative block pt-6 delay-100 duration-1000 md:px-6 md:pb-6 lg:border-r lg:px-6.5',
        isSecondInPair && 'md:border-l lg:border-l-0',
        isLastInRow && 'lg:border-r-0',
      )}
    >
      <StyleCardBody
        style={style}
        imageClassName="h-50 md:h-51.5 lg:aspect-287/190 lg:h-auto"
        // Five lines, not the slide's two: these cells are a third of the page wide, and the
        // reserved height is what keeps every photo in a row starting at the same y.
        textClassName="md:leading-135 xlg:line-clamp-4 xlg:h-16 line-clamp-5 h-17.5 md:h-20"
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, (max-width: 2047px) 25vw, 512px"
      />
    </Link>
  )
}
