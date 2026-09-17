import { CarouselArrow } from '@/components/ui/carousel-arrow'
import { CarouselCounter } from '@/components/ui/carousel-counter'

type PropsT = {
  current: number
  total: number
}

// Sits under the track rather than inside a slide: the counter and the arrows address the
// carousel as a whole, so they hold their place while the quotes move past them.
export function TestimonialControls({ current, total }: PropsT) {
  return (
    <div className="text-14 md:text-16 *:leading-140 flex items-center justify-between pt-8 md:pt-10">
      <CarouselCounter current={current} total={total} />
      <div className="flex gap-x-2.5">
        <CarouselArrow direction="left" />
        <CarouselArrow direction="right" />
      </div>
    </div>
  )
}
