'use client'

import { useSwiper } from 'swiper/react'

export function CarouselCounter() {
  const swiper = useSwiper()
  const { slides, realIndex } = swiper

  return (
    <div className="text-grau_300 flex items-center justify-center md:order-1">
      {realIndex < 10 && <span className="text-shwarz">0</span>}
      <span className="text-shwarz">{realIndex + 1}</span>
      <span className="mx-2 h-3 w-px bg-current" />
      {slides.length < 10 && <span>0</span>}
      <span>{slides.length}</span>
    </div>
  )
}
