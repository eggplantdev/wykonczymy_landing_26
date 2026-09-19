import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type PropsT = {
  children: ReactNode
  // A hero fills the viewport and sits under the fixed header by design; without one the
  // page has to start below it.
  hasHero?: boolean
  // Every page that opens with a title opens with it at the same height and in the same
  // type — as four copies of the heading they drifted, and the contact page ended up a
  // whole section lower than the rest. The home page is the exception: its hero is the
  // heading.
  title?: string
  className?: string
}

// `overflow-x-clip`, never `overflow-x-hidden`: `hidden` on one axis forces the other to `auto`,
// which turns this wrapper into a vertical scroll container. The sections' entrance transform sits
// 20px below the content box until it plays, so the wrapper really has those 20px to scroll and
// Chrome latches the whole wheel gesture to it — the page stops dead until you scroll somewhere
// else. `clip` leaves `overflow-y: visible` and still trims the carousel tracks.
export function PageWrapper({ children, hasHero = true, title, className }: PropsT) {
  return (
    <div className={cn('w-full overflow-x-clip', className, !hasHero && 'pt-20 md:pt-30 lg:pt-40')}>
      {title && (
        <h1 className="paddings text-32 md:text-40 lg:text-58 mb-12 text-center md:mb-24 lg:mb-20">
          {title}
        </h1>
      )}
      {children}
    </div>
  )
}
