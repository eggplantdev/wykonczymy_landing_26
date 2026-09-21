'use client'

import { useSwiper, useSwiperSlide } from 'swiper/react'

import { CarouselArrow } from '@/components/ui/carousel-arrow'
import { CarouselCounter } from '@/components/ui/carousel-counter'
import { cn } from '@/lib/cn'

type PropsT = {
  title?: string | null
  total: number
}

// Rendered inside every slide, not once beside the track — the caption belongs to the
// slide, so the inactive copies are faded out rather than hidden.
export function CarouselControls({ title, total }: PropsT) {
  const swiperSlide = useSwiperSlide()
  const swiper = useSwiper()

  return (
    <div
      className={cn(
        'flex items-center text-14 transition-opacity duration-300 *:leading-140 md:text-16',
        // `invisible` and not `opacity-0` alone: a transparent element still takes focus and
        // clicks, and `loop: true` duplicates every slide — so the faded copies put two full
        // sets of unreachable arrows in the tab order.
        swiperSlide?.isActive ? 'visible opacity-100' : 'invisible opacity-0',
      )}
    >
      <h6 className="order-2 min-w-0 flex-1 truncate px-4 md:px-14.5">{title}</h6>
      <CarouselCounter current={swiper.realIndex + 1} total={total} className="order-1 shrink-0" />
      <div className="order-3 ml-auto flex gap-x-1.5">
        <CarouselArrow direction="left" />
        <CarouselArrow direction="right" />
      </div>
    </div>
  )
}
