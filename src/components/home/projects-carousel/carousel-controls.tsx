'use client'

import { useSwiper, useSwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'

import { CarouselArrow } from '@/components/ui/carousel-arrow'
import { CarouselCounter } from './carousel-counter'

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
      className={twMerge(
        'text-14 md:text-16 *:leading-140 flex items-center justify-between transition-opacity duration-300 md:justify-start',
        swiperSlide?.isActive ? 'opacity-100' : 'opacity-0',
      )}
    >
      <h6 className="w-47.5 md:order-2 md:w-auto md:px-14.5">{title}</h6>
      <CarouselCounter total={total} />
      <div className="order-3 ml-auto hidden gap-x-2.5 md:flex">
        <CarouselArrow direction="left" disabled={swiper.isBeginning} />
        <CarouselArrow direction="right" disabled={swiper.isEnd} />
      </div>
    </div>
  )
}
