'use client'

import { useSwiper } from 'swiper/react'

type PropsT = {
  // Passed in rather than read off `swiper.slides`, which in loop mode counts the
  // duplicate slides Swiper clones onto each end and so roughly doubles the total —
  // and is empty during SSR, rendering "00" before hydration.
  total: number
}

const pad = (value: number) => (value < 10 ? `0${value}` : String(value))

export function CarouselCounter({ total }: PropsT) {
  const swiper = useSwiper()

  return (
    <div className="text-grau_300 flex items-center justify-center md:order-1">
      <span className="text-shwarz">{pad(swiper.realIndex + 1)}</span>
      <span className="mx-2 h-3 w-px bg-current" />
      <span>{pad(total)}</span>
    </div>
  )
}
