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
        'text-14 md:text-16 *:leading-140 flex items-center justify-between transition-opacity duration-300 md:justify-start',
        swiperSlide?.isActive ? 'opacity-100' : 'opacity-0',
      )}
    >
      <h6 className="max-md:min-w-0 max-md:flex-1 max-md:pr-6 md:order-2 md:px-14.5">{title}</h6>
      <CarouselCounter
        current={swiper.realIndex + 1}
        total={total}
        className="max-md:shrink-0 md:order-1"
      />
      <div className="order-3 ml-auto hidden gap-x-2.5 md:flex">
        <CarouselArrow direction="left" disabled={swiper.isBeginning} />
        <CarouselArrow direction="right" disabled={swiper.isEnd} />
      </div>
    </div>
  )
}
