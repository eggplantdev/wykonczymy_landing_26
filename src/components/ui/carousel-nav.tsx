import { CarouselArrow } from '@/components/ui/carousel-arrow'
import { CarouselCounter } from '@/components/ui/carousel-counter'
import { cn } from '@/lib/cn'

type PropsT = {
  /** Left off by a section that wants the arrows alone; the counter then takes no room. */
  current?: number
  total?: number
  className?: string
}

// Sits under the track rather than inside a slide: the counter and the arrows address the
// carousel as a whole, so they hold their place while the slides move past them.
export function CarouselNav({ current, total, className }: PropsT) {
  const hasCounter = current !== undefined && total !== undefined

  return (
    // The caller's spacing goes on the outer box and the row keeps its own height, because
    // `min-h` on a padded box is measured through the padding and so never reaches the row.
    // 28px is the height of a rating badge: the testimonials counter shares a line with two
    // of them, and the arrows alone are too short to put the two lines of type at the same
    // height.
    <div className={className}>
      <div
        className={cn(
          'text-14 md:text-16 *:leading-140 flex min-h-7 items-center',
          hasCounter ? 'justify-between' : 'justify-end',
        )}
      >
        {hasCounter && <CarouselCounter current={current} total={total} />}
        <div className="flex gap-x-1.5">
          <CarouselArrow direction="left" />
          <CarouselArrow direction="right" />
        </div>
      </div>
    </div>
  )
}
