import { CarouselArrow } from '@/components/ui/carousel-arrow'
import { CarouselCounter } from '@/components/ui/carousel-counter'
import { cn } from '@/lib/cn'

type PropsT = {
  current: number
  total: number
  className?: string
}

// Sits under the track rather than inside a slide: the counter and the arrows address the
// carousel as a whole, so they hold their place while the slides move past them.
export function CarouselNav({ current, total, className }: PropsT) {
  return (
    <div
      className={cn(
        'text-14 md:text-16 *:leading-140 flex items-center justify-between',
        className,
      )}
    >
      <CarouselCounter current={current} total={total} />
      <div className="flex gap-x-2.5">
        <CarouselArrow direction="left" />
        <CarouselArrow direction="right" />
      </div>
    </div>
  )
}
